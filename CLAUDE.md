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
- Message bus: **RabbitMQ**, not Kafka.
- Frontend map: **abstract SVG grid** (ported from `site/`), not a real Leaflet map.
- Local dev: **docker-compose** brings up everything. If you're integration-testing against a
  service, it should be a container in that compose file, not someone's laptop over a tunnel.

If you think one of these is wrong, say so to the team — don't silently build around it.

## Data model & API — don't improvise field names

Canonical shapes are in PRD §6 (data models) and §7 (API surface). Treat these as fixed:

- **Drone**: `id, name, status, position {lat,lng}, battery_pct, max_range_km, speed_kmh, payload_capacity_kg, current_payload_type`
- **Mission**: `id, priority (1-5), deadline, target_locations[], required_payload_type, estimated_duration_min, status`
- **Plan**: `id, drone_id, mission_ids[ordered], route[waypoints], estimated_battery_at_completion, status`
- **Telemetry event**: `drone_id, timestamp, position, battery_pct, event_type`

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
- **Non-goals stay non-goals** (PRD §1.3): no real hardware integration, no full ATC-grade
  collision avoidance (simplified no-fly-zone/route-conflict checks only), no multi-tenancy.
  If a task starts trending toward one of these, stop and check the PRD.
- **Commit messages**: describe why, not what (the diff already shows what). No
  `Co-Authored-By` trailers.
- **Tests**: each service owns its own test suite; don't mock another team member's service in
  a unit test if you can hit a real (containerized) instance in an integration test instead —
  divergence between mocked and real behavior is exactly the kind of bug this system is supposed
  to catch, not cause.

## When you're not sure whose problem something is

Check `plan.md`'s ownership tracks (§1) and phase breakdown (§2) first. It's written to make
that unambiguous. If it's genuinely unclear, that's a sign `plan.md` needs an update — don't
just guess and build in the gap.
