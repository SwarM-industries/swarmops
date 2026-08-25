# SwarmOps — Project Guide for Claude

Read this before touching code. It's shared across the whole team (Tony, Guy, Valfish) so every
Claude session — whichever of us is driving — has the same mental model of the system.

## What this project is

SwarmOps is a drone fleet mission planning & route optimization platform — a capstone project.
Given a fleet of drones (limited battery, speed, payload) and a set of missions (surveillance/
delivery/inspection, with priority and deadlines), it automatically assigns drones to missions,
computes battery-feasible routes, and re-plans in real time as conditions change. It is a
distributed system built to demonstrate that idea, not a toy CRUD app — the algorithm and the
delivery pipeline are the point.

Full requirements: **`SwarmOps_PRD.md`** (repo root). That is the source of truth for data
models, API surface, and success metrics — if this guide and the PRD ever disagree, the PRD
wins and this file is stale.

Task breakdown and who owns what: **`plan.md`** (repo root). Check it before assuming you should
build something — it's someone else's track, or it's sequenced for a later phase.

There is also a **`site/`** directory: a static pitch-deck site for presenting this idea to
non-technical stakeholders. It is not the application. Its `LiveMap` component is a useful
visual/code reference for the real frontend's live map (Phase 3), but don't confuse the two —
changes to the actual product do not belong in `site/`, and vice versa.

There is also a **`business/`** directory: the external-facing documents — business overviews and
one-pagers (HE + EN), a use-case companion doc, and the PDFs generated from them. Also not the
application, and a separate track from both the product and `site/`.

**If you are asked to change any of those documents, read `business/_render/README.md` first.**
It is the complete process: which file is the source for which PDF, the exact render commands,
how to verify a render, and the editing rules that keep the documents' claims aligned with what
is actually built. Two things that catch people out: every `.pdf` in `business/` is generated
output (edit the source and re-render — never the PDF), and the three one-pagers are independent
hand-authored files with no shared template, so a copy change means editing each one by hand.

## System shape (memorize this, it doesn't change)

```
Frontend (React/Vite SPA)
        │  HTTPS / WebSocket
        ▼
Gateway (NGINX) — routes /auth /fleet /missions /planning /telemetry /notifications
        │
   ┌────┼────────┬───────────┬──────────────┬───────────────────┐
   ▼    ▼        ▼           ▼              ▼                   ▼
auth  fleet   mission    planning       telemetry           notification
(JWT) (drones)(missions) (optimizer)    (ingests events)    (alerts, stateless)
                              ▲              │
                              └── RabbitMQ ──┘── drone simulator (emits telemetry)
                                   │
                                   └────────────► notification-service (alerts)
```

- **planning-service** is the core: it's a VRPTW variant where battery range (not fixed vehicle
  capacity) is the binding constraint, and it depends dynamically on distance flown + payload
  weight. Build order for it, always in this sequence, never skip ahead: greedy → bipartite
  matching (Hungarian) → per-drone routing (OR-Tools, small TSP) → battery-feasibility check →
  event-driven re-planning. See PRD §4.2.
- **telemetry-service + drone simulator + RabbitMQ** exist to make re-planning event-driven
  instead of polled. The simulator is a fake drone fleet, not a mock — it should behave like a
  real fleet would (timers, realistic speed, randomized variance) so re-planning has a genuine
  trigger to react to.
- **notification-service** is intentionally stateless — it's a fan-out from planning-service's
  conflict/alert events, not a datastore.

## Locked-in tech decisions — don't relitigate these mid-build

See `plan.md` §0 for the full table and rationale. The short version:

- `auth-service`, `fleet-service`, `mission-service`, `telemetry-service`, `notification-service`
  → **Node.js 20 + TypeScript + Express + Mongoose**.
- `planning-service` → **Python 3.11 + FastAPI**, `scipy.optimize.linear_sum_assignment` for the
  Hungarian algorithm, `ortools` for per-drone routing. This is the one service that's a
  different language on purpose — don't "fix" it to match the others.
- Message bus: **RabbitMQ** (Bitnami Helm chart dependency), not Kafka.
- Database: **one Bitnami MongoDB chart dependency**, one logical database per service — not
  five separate Mongo deployments.
- Frontend map: **abstract SVG grid** (ported from `site/`), not a real Leaflet map.
- Local dev: **docker-compose** (in `swarmops-local`) brings up everything. If you're
  integration-testing against a service, it should be a container in that compose file, not
  someone's laptop over a tunnel.

If you think one of these is wrong, say so to the team — don't silently build around it.

## Repos — this is polyrepo, not monorepo

This repo (`swarmops`) is docs + the pitch deck. It is **not** one of the app's deployable
units. The actual app lives across these repos in the `SwarM-industries` GitHub org:
`swarmops-frontend`, `swarmops-gateway`, `swarmops-auth-service`, `swarmops-fleet-service`,
`swarmops-mission-service`, `swarmops-planning-service`, `swarmops-telemetry-service`,
`swarmops-notification-service`, `swarmops-drone-simulator`, `swarmops-local`,
`swarmops-deployments`, `swarmops-infrastructure`. If you're working in one of those repos, it
should have its own copy of the relevant bits of this file — this file is the shared source, not
a substitute for repo-local context.

Every repo: `main` protected (PR + 1 approval, no direct pushes), a README, a stack-appropriate
`.gitignore`, `feature/`/`bugfix/`/`hotfix/` branches. The one exception, once GitOps is live: a
scoped bot identity is the only thing allowed to bypass `swarmops-deployments`'s branch
protection, for automated image-tag bump commits. No human bypasses it, ever.

**TEMPORARY OVERRIDE (2026-07-23, until said otherwise):** direct pushes to `main` are allowed
across all app repos — skip the PR/approval step for now. This does not apply to
`swarmops-deployments`'s GitOps bot-only exception above, which stays as-is. Revert to
PR-required once the team says so, and delete this note when that happens.

**Note:** GitHub only *enforces* branch protection on private repos with a paid org plan, or on
public repos. The org is currently free-tier with private repos, so "no direct pushes to main"
is a team discipline rule right now, not a GitHub-enforced one — treat it exactly as seriously
as if it were enforced (modulo the temporary override above).

## Deployment contract — how code gets to the cluster

This is fixed, not a suggestion, because the whole point of the project is that nobody deploys
by hand:

- **Images**: tagged `<semver>-<7-char-git-hash>` (e.g. `1.2.0-a1b2c3d`). `latest` is never used.
- **CI** (GitHub Actions, one workflow per app repo): PRs only lint/test/build-validate — never
  publish an image, never touch the cluster. Pushes to `main` version the build, authenticate to
  AWS via **OIDC** (no static keys, ever), and push to that repo's ECR repository.
- **CD**: a push to `main` also updates that service's own file at
  `swarmops-deployments/environments/production/images/<service>.yaml` via `yq` — never a text
  replace, never editing another service's file. Argo CD (watching `swarmops-deployments`,
  auto-sync + self-heal + prune) reconciles the cluster to match. **Nobody runs `helm upgrade` or
  `kubectl apply` by hand once this is live** — a deploy is a Git commit, full stop.
- **Helm**: one parent chart at `swarmops-deployments/helm/swarmops/`, Bitnami MongoDB + Bitnami
  RabbitMQ as dependencies, `range`/`_helpers.tpl` generating the near-identical services rather
  than copy-pasted manifests per service.
- **Observability**: every service exposes an internal-only `/metrics` (request count, status,
  duration, process stats — no user/mission/drone IDs in labels), discovered via a
  `ServiceMonitor`. Logs are structured JSON, no secrets, no PII. Both kube-prometheus-stack and
  Loki/Alloy are installed as Argo CD Applications, not by hand.
- **Required extension**: Argo Rollouts canary on `planning-service` — this is the one service
  allowed progressive delivery instead of a plain rolling update, because it's explicitly the
  highest-risk, most-iterated service (PRD §3.3).

Full detail and per-person ownership of each piece: `plan.md` §3 (Phases 4–5).

## Data model & API — don't improvise field names

Canonical shapes are in PRD §6 (data models) and §7 (API surface). Treat these as fixed:

- **Drone**: `id, name, status, position {lat,lng}, battery_pct, max_range_km, speed_kmh, payload_capacity_kg, current_payload_type`
- **Mission**: `id, priority (1-5), deadline, target_locations[], required_payload_type, estimated_duration_min, status`
- **Plan**: `id, drone_id, mission_ids[ordered], route[waypoints], estimated_battery_at_completion, status`
- **Telemetry event**: `drone_id, timestamp, position, battery_pct, event_type`
- **No-fly zone**: `id, name, region [{lat,lng}, min 3], active` — owned by fleet-service
  (`GET/POST /fleet/no-fly-zones`), consumed by planning-service for route avoidance.
- **Charging station**: `id, name, position {lat,lng}, capacity, status (operational|offline)` —
  owned by fleet-service (`GET/POST /fleet/charging-stations`), consumed by planning-service to
  insert charging stops on infeasible routes.

Status enums, exactly (don't invent synonyms):
- Drone status: `idle | flying | charging | maintenance`
- Mission status: `pending | assigned | in_progress | complete`

If a track needs to change one of these shapes, that's a cross-team contract change — flag it
in `plan.md`'s sync points, don't just change your own service and let the others find out when
integration breaks.

## Working agreements

- **Contracts before code.** If another service depends on your endpoint's response shape,
  write the shape down (even just a markdown snippet with a JSON example) before the consumer
  builds against it.
- **Every service is a Dockerfile from day one.** Don't defer containerization to Phase 4 —
  Phase 4 is about Helm/Terraform/CD, not "finally write a Dockerfile."
- **Don't build ahead of your phase in `plan.md`** unless you've cleared it with the team —
  phases are sequenced because later phases assume earlier contracts are stable (e.g. don't
  build the what-if simulator UI before `/planning/simulate`'s response shape is locked).
- **The PRD's non-goals are historical, not binding** (2026-08-13). PRD §1.3 excluded real
  hardware integration, multi-tenancy and ATC-grade collision avoidance. Those were *the
  capstone's* scope boundaries, the capstone is complete and presented, and the project is now
  being built as a company — every one of those three is on the commercial roadmap
  (`business/SwarmOps_Business_Overview_EN.md` §7 and §7.1). **Don't stop work because the PRD
  says a thing is out of scope.** Treat the PRD as the record of what the academic deliverable
  covered and as the authority on data models and API shapes (§6/§7), not as a gate on what the
  company builds. Real-hardware integration specifically has its own plan: `actual_prod.md`.
- **Commit messages**: describe why, not what (the diff already shows what). No
  `Co-Authored-By` trailers.
- **Tests**: each service owns its own test suite; don't mock another team member's service in
  a unit test if you can hit a real (containerized) instance in an integration test instead —
  divergence between mocked and real behavior is exactly the kind of bug this system is supposed
  to catch, not cause.
- **Every new feature ships with a smoke test that exercises the feature itself.** Lint, typecheck
  and build passing is not evidence a feature works — it is evidence it compiles. A feature is not
  done until there is a test that drives the actual behavior end to end and would fail if the
  feature were removed or broken. Concretely, for each kind of work:
  - **New endpoint** — a test that calls it over HTTP with a real request and asserts the response
    shape *and* the resulting state change, not just a 200.
  - **New solver/algorithm behavior** — a case that produces the wrong answer without the change.
    `swarmops-planning-service`'s `pytest` regression tests for the low-battery hand-off fix are
    the pattern: three tests that each fail on the pre-fix code.
  - **New UI feature** — at minimum a test that renders it with real-shaped data and asserts what
    the operator would see. A component that only ever gets checked by `npm run build` is untested.
  - **New cross-service behavior** — a scenario in `swarmops-local` (`seed/demo-scenarios.ts` is the
    existing pattern) that runs against the real docker-compose stack. **This is the one that keeps
    catching real bugs** — the naive/aware datetime crash and the patrol-replacement decoy failure
    were both invisible to unit tests with fakes and obvious the first time the scenario ran live.
  - **Bug fix** — a regression test that fails on the old code. No exceptions; a fix without one is
    an assertion that the bug is gone, not evidence.

  If a feature is genuinely hard to test, say so in the PR or `STATUS.md` and say what you did
  instead — "verified manually against the live cluster, no automated coverage" is an acceptable
  and honest state. Silently shipping untested and letting CI's green tick imply otherwise is not.
  Where a repo has no test tooling at all, adding it is part of the feature (`swarmops-fleet-service`
  went from zero to a working `vitest` + `supertest` + `mongodb-memory-server` setup in one pass —
  that is the bar).
- **Leave a status note after every push or finished chunk of work.** Whichever of us's Claude
  session (Tony's, Guy's, Valfish's) does the pushing: append a short dated note to that repo's
  own `STATUS.md` (or this repo's `milestones.md` if the work is cross-repo/milestone-level) —
  what changed, why, what's still open/blocked, and anything the next person's Claude needs to
  know before building on it (e.g. "merged but not applied", "needs a var/secret set first",
  "destroyed to save cost, re-apply before relying on it"). This is how the other two tracks'
  Claude sessions stay accurate without re-deriving state from scratch or trusting a stale doc —
  see the top of `milestones.md` for the format this should follow.

## When you're not sure whose problem something is

Check `plan.md`'s ownership tracks (§1) and phase breakdown (§2) first. It's written to make
that unambiguous. If it's genuinely unclear, that's a sign `plan.md` needs an update — don't
just guess and build in the gap.
