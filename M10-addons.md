# M10 addons — low-battery hand-off fix + charging-station capacity removal

Planning doc for two fixes found at the 2026-08-05 mock presentation. Revised after an
independent Opus review caught 3 blocking defects in the original Fix 1 (see below) —
this version is what's being implemented.

## Context

Mock presentation (2026-08-05) surfaced a real gap in the low-battery hot-swap flow: when
a mission drone's battery drops below threshold mid-flight, it correctly gets pulled off
its mission and routed to a charging station — but the vacated mission never gets
reassigned to a new idle drone. It just sits `pending`.

Root cause: two separate low-battery hand-off triggers exist in
`swarmops-planning-service`:

1. **RabbitMQ event path** (`src/main.py:19-37`, `_on_telemetry_trigger`) — calls the two
   hand-off functions, then **always calls `run_solve()` afterward** to re-match the freed
   mission to an idle drone.
2. **30s polling backstop** (`src/reconcile.py`) — added 2026-08-05 because the RabbitMQ
   `low_battery` event has "never once reached this service" in the live cluster
   (`src/config.py:27-31`). This is the path that actually fires in practice. **It calls
   the same two hand-off functions but never calls `run_solve()` afterward.** That's the
   bug.

Patrol drones don't have this bug — `handle_patrol_low_battery` (`src/routes/patrols.py`)
does its own inline replacement-drone swap, independent of `run_solve()`.

Second ask: stop treating charging-station `capacity` as a real constraint. Confirmed zero
enforcement anywhere in the backend (`fleet-service`, `planning-service`,
`mission-service`) — the only place it's load-bearing is `fleet-service`'s POST validation
and the frontend's create-station form.

## Fix 1 — reconcile.py must trigger a re-solve after hand-off

**File:** `swarmops-planning-service/src/reconcile.py`

### 1a. Import `run_solve` — no circular-import issue

`reconcile.py:17` already does `from src.routes.planning import _get_with_auth`. Just add
`run_solve` to that same import line.

### 1b. Gate on *dispatched*, not on the raw candidate list

`send_drone_to_charge` deliberately leaves a drone `flying` while en route to a charger, so
a drone already being handled stays in `_flying_low_battery_drones`'s output for minutes
and just hits the `already_charging` → `continue` branch (`reconcile.py:90-97`) every tick.
Gating on "candidates non-empty" would fire `run_solve()` every 30s on all 5 replicas for
the entire time a drone is en route to charge, indefinitely — the exact no-op storm this
change needs to avoid.

Fix: track whether the loop actually reached the `RECONCILE_ACTIONS_TOTAL.labels(outcome=
"dispatched")` branch (`reconcile.py:104`) this tick — i.e. at least one drone was newly
handed off, not just found-already-in-progress. Only call `run_solve()` if that's true.

### 1c. Concurrency: 5 replicas can now call run_solve() independently

`run_solve()` (`src/routes/planning.py:122-170`) is read-then-write with no atomic claim on
the solve itself. Today this is safe in practice because the RabbitMQ path is
single-consumer and the HTTP `/solve` route is one request. Reconcile is the first path
where all 5 replicas independently decide to call `run_solve()`, and two replicas
dispatching in the same ~30s window could both solve before either inserts, producing
duplicate/conflicting Plans for the same mission or drone.

Fix with a short-lived Mongo-backed solve lock, reusing this codebase's existing
atomic-claim idiom (conditional update + check matched/modified count, back off on loss —
same pattern as `_abort_active_plan_for_drone` in `charge_orders.py:141-156`):

- New collection `reconcile_locks` (new file `src/models/reconcile_lock.py`, mirroring the
  existing `src/models/charge_order.py` shape: a `reconcile_locks_collection()` factory).
- New function:
  ```python
  async def _try_acquire_solve_lock(ttl_seconds: int = 15) -> bool:
      now = datetime.now(timezone.utc)
      coll = reconcile_locks_collection()
      doc = await coll.find_one({"_id": "run_solve"})
      if doc is None:
          await coll.insert_one({"_id": "run_solve", "expires_at": now + timedelta(seconds=ttl_seconds)})
          return True
      if doc["expires_at"] < now:
          result = await coll.update_one(
              {"_id": "run_solve", "expires_at": doc["expires_at"]},
              {"$set": {"expires_at": now + timedelta(seconds=ttl_seconds)}},
          )
          return result.modified_count == 1
      return False
  ```
  TTL-based, no explicit release — avoids a stuck lock if a replica dies mid-solve.
  `ttl_seconds=15` is comfortably shorter than `reconcile_interval_s` (30s) so a crashed
  holder self-clears before the next tick. Real Mongo's `_id` uniqueness alone will reject a
  concurrent duplicate `insert_one` (`DuplicateKeyError`, catch and return `False`) — no
  extra index needed.
- In `reconcile_once()`: only call `run_solve()` (per 1b's gating) after successfully
  acquiring this lock; if the acquire fails, skip — another replica is already solving this
  tick, and it'll see the same shared Mongo state, so the freed mission still gets picked
  up.
- This lock wraps **only** the reconcile-triggered `run_solve()` call, not the RabbitMQ or
  manual `/solve` HTTP paths — those remain as-is (already effectively serialized).

**Considered and rejected:** scaling `planning-service` to 1 replica for the demo (fastest,
but directly undermines the Argo Rollouts canary extension, which needs multiple replicas
to demo a live traffic-split/rollback); a fully race-safe per-plan atomic claim inside
`run_solve` itself (more correct long-term, too much test-suite churn 2 days from a demo);
shipping without a fix (real risk of a visibly broken demo moment).

## Fix 1 test-harness changes

**File:** `swarmops-planning-service/tests/conftest.py`

- `fake_get_with_auth` (lines 50-56) currently only handles `status=idle` and
  `/fleet/drones` URLs — raises `AssertionError` on anything else. The moment `run_solve()`
  actually executes inside a reconcile test, it calls `_get_with_auth` for
  `.../missions?status=pending` too (`planning.py:99-101`) — **every existing reconcile
  test would break** without this fix, not just new ones. Add a `missions: list[dict]`
  field to `ServiceHarness` and a branch in the fake for the missions URL, mirroring the
  existing drones branch.
- `run_solve()` also calls `plans_collection().insert_many(plans)` — `FakeCollection`
  (`tests/fakes.py`) has no `insert_many` method at all, only `insert_one`. Add
  `insert_many`, same shape as the existing `insert_one` (append each doc, assign an
  `ObjectId` if missing, return an object with `inserted_ids`).
- `reconcile_locks_collection` needs the same monkeypatch wiring as `plans_collection`/
  `charge_orders_collection` already get in `service_harness` — add `reconcile_locks` as a
  new `FakeCollection` on the harness, wired into `reconcile_mod`.

**File:** `swarmops-planning-service/tests/test_reconcile.py`

- New test: drive `handle_mission_low_battery` through `reconcile_once()` with a seeded
  pending mission + a second idle drone available, assert the mission ends up `assigned` to
  the *new* drone (not left `pending`) — the actual regression test for the demo bug.
- New test: a tick where every candidate is already-charging (all hit the
  `already_charging` continue) must **not** call `run_solve` — covers the 1b gating fix.
- New test: two concurrent `reconcile_once()` calls (via `asyncio.gather`, same pattern as
  the existing patrol double-dispatch race test) where both would dispatch a hand-off in
  the same tick — assert `run_solve` (spy/counted) only actually proceeds once, i.e. the
  lock genuinely serializes it.

## Fix 2 — charging-station capacity: stop enforcing/requiring it

`capacity` is rendered nowhere in the frontend outside the one input being removed, and
`swarmops-contracts` isn't a dependency of any service (absent from every
`package.json`/`requirements.txt`) — the contracts touch is documentation-only, doesn't
block on cross-team coordination.

- **`swarmops-fleet-service/src/models/ChargingStation.ts`** (`capacity`, line ~12):
  `required: true` → `required: false`.
- **`swarmops-fleet-service/src/routes/fleet.routes.ts`** (POST handler, lines ~390-393):
  drop the "capacity is required and must be a number" 400 check. Still accept it if passed
  (harmless, ignored).
- **`swarmops-frontend/src/components/dashboard/CreateChargingStationDialog.tsx`**
  (lines 21, 33, 51-52, 60, 115-123): remove the capacity input field and its
  positive-number validation from the create form entirely.
- **`swarmops-frontend/src/lib/types.ts:80`**: `capacity` → optional (`capacity?: number`),
  not deleted — existing seeded stations still return it on GET.
- **`swarmops-local/seed/seed.ts:137-141`**: drop `capacity` from the three seeded
  stations.
- **`swarmops-contracts`** (`src/charging-station.ts`, `python/.../charging_station.py`):
  make `capacity` optional in both shared types, doc-only change per above.
- No change needed in `swarmops-planning-service`'s `_nearest_reachable_station` — already
  ignores capacity entirely.

## Test suites

- **`swarmops-planning-service`**: covered above (extends the existing `pytest` suite, no
  new tooling — this is the test surface that actually matters, since it's what proves both
  Fix 1's correctness and its concurrency safety).
- **`swarmops-fleet-service`**: zero test tooling exists today, and this fix touches its
  validation logic directly. Add `vitest` + `supertest` + `mongodb-memory-server` (dev
  deps, hermetic, no real Mongo container needed), a `test` script in `package.json`, wired
  into the existing CI workflow's currently-no-op test step. Tests:
  - `POST /fleet/charging-stations` succeeds with `capacity` omitted.
  - `POST /fleet/charging-stations` still succeeds if `capacity` is passed (back-compat).
  - `GET /fleet/charging-stations` round-trips a station created without `capacity`.
  - One baseline test on an existing untested route (e.g. `GET /fleet/drones`) so the suite
    isn't scoped to only this change.
- **`swarmops-frontend`**: not building new test infra for this fix (cut per review — a
  full vitest+testing-library suite just to assert one input field is gone is overkill 2
  days from a demo). Manually verify instead: create a station via the dialog with no
  capacity input present, confirm it succeeds.

## Verification (end-to-end)

1. `swarmops-local` compose up, or point at the live cluster if applied.
2. Force a mission drone below the 20% threshold.
3. Wait one `reconcile_interval_s` tick (30s): `GET /missions` shows the vacated mission
   moved from `pending` to `assigned` to a *different* idle drone; `GET /fleet/drones` shows
   the low-battery drone with an active `ChargeOrder`/heading to charge.
4. Run with 2+ replicas locally (or via the new concurrent test) — confirm no duplicate
   Plan is created for the same mission.
5. Create a charging station via the frontend dialog and via a raw `POST
   /fleet/charging-stations` with no `capacity` — both succeed.
6. Run `swarmops-planning-service`'s full `pytest` suite and `swarmops-fleet-service`'s new
   suite — all green.

## Docs / process notes

- CLAUDE.md's temporary direct-push-to-main override is in effect — no PR required for
  these repos right now, but still leave a `STATUS.md` note in each touched repo per the
  project's standing working agreement, and no `Co-Authored-By` trailer on any commit.
- Update `milestones.md`'s M10 section with a dated note once this lands — the existing
  2026-08-04 note about mission drones getting no low-battery handling is already
  stale/superseded; this closes the real remaining gap it left behind.
- Small unrelated doc fix, bundled in the same pass: `milestones.md`'s M10 entry still says
  the defense deck is "planned, not built" — `presentation.html`/`presentation.tony.html`
  now exist with real commits; update that note.
