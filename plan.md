# SwarmOps — Build Plan

Source of truth for scope: `SwarmOps_PRD.md`. This doc splits that scope into three parallel
tracks for a 3-person team (Tony, Guy, Valfish) and sequences them across the PRD's 5 build
phases (§9).

---

## 0. Decisions locked in before anyone writes code

The PRD leaves a few things open (§10) or unspecified. Picking now so nobody blocks on it later.
Revisit as a team if any of these are wrong — but don't leave them ambiguous during build.

| Decision | Choice | Why |
|---|---|---|
| Language — auth/fleet/mission/telemetry/notification services | Node.js 20 + TypeScript + Express + Mongoose | CRUD-shaped services, fast to scaffold, one stack for 4 of 6 services keeps cross-service code (shared types, request helpers) reusable. |
| Language — planning-service | Python 3.11 + FastAPI | This is the one service where the algorithm story matters. `scipy.optimize.linear_sum_assignment` gives the Hungarian algorithm for free; `ortools` has first-class Python support for the routing phase. Fighting Node bindings for OR-Tools isn't worth it. |
| Message bus | RabbitMQ | Kafka is heavier to stand up correctly (ZK/KRaft, partitioning) for the throughput this system actually has. RabbitMQ gets telemetry → planning and planning → notification working fast. Swap later if someone wants the Kafka story for the defense. |
| Gateway | NGINX, path-based routing per PRD §3.2 | As specified. |
| Frontend | React + Vite, reusing the pitch site's map primitives | `site/` already has a working animated SVG fleet map (`site/src/components/LiveMap.jsx`, `site/src/lib/geometry.js`). Wire it to real WebSocket data instead of the loop-animation fake data — don't rebuild it from scratch. |
| Live map rendering | Abstract SVG grid, not Leaflet | Matches the pitch site, faster to build, avoids a tile-provider dependency for a simulated fleet. |
| Local dev orchestration | `docker-compose.yml` at repo root: Mongo, RabbitMQ, all 6 services, gateway | Needed before anyone can integration-test across services, and before Helm charts make sense in Phase 4. |
| Repo layout | Polyrepo per PRD §3, one repo per service + one for frontend + one for infra/deployments (Argo CD GitOps repo) | As specified. A shared `swarmops-contracts` repo (or npm/pip package) holds the data model shapes from PRD §6 so all three tracks stay in sync without copy-pasting types. |
| Auth | JWT issued by `auth-service`, verified by each service via shared middleware (shared secret or JWKS) | Simplest thing that satisfies RBAC (planner/operator/admin) without a session store. |

---

## 1. Ownership tracks

Three tracks, one per person, designed so each person can work through all 5 PRD phases on
their own slice without waiting on the others for day-to-day work. Cross-track dependencies are
called out explicitly per phase below — that's where you sync.

### Track A — Core Data Services — **Tony**
`auth-service`, `fleet-service`, `mission-service`, gateway config.

### Track B — Algorithm & Live Data — **Guy**
`planning-service` (the optimization core), `telemetry-service`, drone simulator, message bus,
`notification-service`, Argo Rollouts canary (owns `planning-service` end to end, including its
deploy story, since PRD §3.3 specifically ties the canary extension to this service).

### Track C — Frontend & Platform — **Valfish**
React/Vite SPA (all views), Helm charts (all services), Terraform/EKS, GitHub Actions CI (OIDC),
Argo CD, observability (kube-prometheus-stack, Loki/Alloy).

This groups the two algorithmically/operationally "deep" pieces (planning-service's solver,
the deploy pipeline) as full end-to-end ownership rather than splitting infra thinly across
three people — infra work compounds badly when three people are half-context on it.

---

## 2. Phase-by-phase breakdown

Each phase lists per-track tasks and an explicit **sync point** — the contract the other two
tracks depend on. Do the sync-point work first within a phase; it unblocks the other two.

### Phase 1 — Foundation

**Goal:** all five services scaffolded, talking over the gateway; basic CRUD; greedy assignment;
static map showing current state.

- **Tony**
  - Scaffold `auth-service`: JWT login/issuance, RBAC roles (planner/operator/admin), MongoDB user collection.
  - Scaffold `fleet-service`: CRUD for Drone model (PRD §6), `GET /fleet/drones?status=`.
  - Scaffold `mission-service`: CRUD for Mission model, `POST /missions`, `GET /missions?status=`.
  - Write the shared JWT-verification middleware other services import.
  - **Sync point:** publish the Drone and Mission JSON shapes (exact field names/types) to `swarmops-contracts` by end of week 1 — Guy's planning-service and Valfish's frontend both build against these immediately.
- **Guy**
  - Scaffold `planning-service` (FastAPI skeleton, health check, MongoDB connection for Plan model).
  - Implement the greedy baseline (PRD §4.2 phase 1): nearest capable drone with sufficient battery, sorted by priority then deadline.
  - `POST /planning/solve` wired to greedy solver, reading from fleet-service/mission-service over HTTP for now (message bus comes in Phase 3).
  - Stand up RabbitMQ locally (docker-compose) even though nothing publishes to it yet — Phase 3 shouldn't start with infra work.
- **Valfish**
  - Scaffold the frontend app (new Vite app, separate from `site/` — that one stays the pitch deck).
  - Static fleet map: port `LiveMap.jsx` + `mapData.js` + `geometry.js` from `site/` as a starting point, replace fake data with a fetch from `fleet-service`/`mission-service` (no live movement yet — Phase 3 adds WebSocket).
  - Mission board (list view, create mission form) against `mission-service`.
  - NGINX gateway config routing `/auth /fleet /missions /planning /telemetry /notifications`.
  - Write `docker-compose.yml` at the root gateway/deployments repo wiring everything above together.

**End-of-phase demo:** create a mission and a drone through the UI, hit "solve", see a greedy assignment appear on the map.

---

### Phase 2 — Optimization core

**Goal:** replace greedy with matching/OR-Tools; battery-aware feasibility.

- **Guy**
  - Bipartite matching (Hungarian, via `scipy.optimize.linear_sum_assignment`) minimizing distance + urgency penalty (PRD §4.2 phase 2).
  - Per-drone routing for multi-stop missions via OR-Tools routing solver (phase 3 of the algorithm, same phase of the roadmap).
  - Battery-drain simulation along candidate routes; reject/insert-charging-stop logic (phase 4 of the algorithm).
  - Conflict handling (PRD §4.3): priority/deadline tie-break, flag unresolved missions.
  - `POST /planning/simulate` (what-if, non-committing) — needed early since Valfish's what-if panel in Phase 5 depends on it existing.
- **Tony**
  - Add maintenance/offline status transitions to `fleet-service` (needed for feasibility checks and the fleet operator persona).
  - Payload/sensor-type compatibility fields + filtering on `mission-service`/`fleet-service` so planning-service can match on required_payload_type.
  - Start the `notification-service` skeleton (stateless, consumes from RabbitMQ once Guy's bus is live) — low-effort service, fits in Tony's track since it's simple CRUD-adjacent, not algorithm work.
- **Valfish**
  - Fleet inventory view (battery, maintenance status, take-drone-offline action).
  - Surface feasibility/conflict results in the mission board (flag unresolved missions from planning-service's response).
  - Start Helm chart skeletons for the 3 services that exist and are stable (auth, fleet, mission) — don't template services still in flux.

**Sync point:** Guy's `/planning/solve` response shape (assignment + route + feasibility) gets locked and published to contracts before Valfish builds the UI around it.

**End-of-phase demo:** solve produces near-optimal assignments vs. Phase 1's greedy, and a route that would strand a drone gets rejected or given a charging stop instead.

---

### Phase 3 — Live system

**Goal:** drone simulator + telemetry-service + message bus; live WebSocket map; event-driven re-planning.

- **Guy**
  - `telemetry-service`: ingest endpoint (`POST /telemetry/ingest`), publish to RabbitMQ, recent-history store in MongoDB.
  - Drone simulator worker: flies each drone along its assigned route at realistic speed, emits telemetry on a timer with configurable random variance.
  - Wire `planning-service` to consume telemetry events and mission events off the bus; implement re-planning that re-solves only the affected portion of the schedule (PRD §4.2 phase 5).
  - `notification-service` consumes planning-service's conflict/alert events off the bus and exposes them (WebSocket or polling endpoint) to the frontend.
- **Tony**
  - Harden auth/fleet/mission services for concurrent access now that telemetry is writing fleet state continuously (position/battery updates from telemetry-service, not from fleet-service's own CRUD — make sure ownership of "who writes drone position" is unambiguous: telemetry-service writes it, fleet-service's CRUD only edits static fields like name/capacity).
  - Add integration tests across the gateway now that all 6 services exist.
- **Valfish**
  - WebSocket connection from frontend to telemetry/notification stream; wire the ported `LiveMap` component's drone markers to real positions instead of the loop-animation fake data (the animation *infrastructure* — `pointOnLoop`, marker rendering, no-fly zones — stays; only the data source changes).
  - Status strip + legend already exist from Phase 1 — just confirm they reflect live state.
  - Alerts UI fed by `notification-service`.

**Sync point:** telemetry event schema (drone_id, timestamp, position, battery_pct, event_type — PRD §6) gets published to contracts before the simulator and the frontend both build against it.

**End-of-phase demo:** start the simulator, watch drones move on the live map for real, kill one drone mid-route, watch planning-service re-solve and the map update without a page refresh.

---

### Phase 4 — Infrastructure

**Goal:** Helm, Terraform/EKS, GitHub Actions CI with OIDC, Argo CD GitOps, observability.

This phase is Valfish's track by ownership, but it's the one place where doing it solo doesn't
scale — everyone needs their own service containerized and Helm-chartable. Split as:

- **Valfish**
  - Terraform: VPC + EKS via public modules, state in Terraform Cloud.
  - GitHub Actions: OIDC to AWS (no static keys), build+push to ECR — one reusable workflow, parameterized per service.
  - Argo CD: GitOps deployments repo, app-of-apps pattern across all 6 services + gateway + frontend.
  - kube-prometheus-stack + Loki/Alloy: cluster-wide install, base dashboards.
- **Tony**
  - Dockerfiles + Helm chart values for `auth-service`, `fleet-service`, `mission-service`, `notification-service` (his services from earlier phases — he knows their config surface best).
- **Guy**
  - Dockerfile + Helm chart for `planning-service` (needs the Python/OR-Tools base image, likely heavier than the Node services — worth owning directly) and `telemetry-service`.
  - Helm chart / deployment config for the drone simulator worker (it's a long-running job, not a request-driven service — different Helm template shape from the rest).

**Sync point:** Valfish defines the Helm chart *template* (one working example, e.g. auth-service) and the values.yaml conventions before Tony/Guy chart their own services against it — otherwise you get 6 charts with 6 different conventions.

**End-of-phase demo:** `git push` to a service repo → GitHub Actions builds/pushes → Argo CD syncs it into the EKS cluster → Grafana shows the new pod healthy.

---

### Phase 5 — Extension & polish

**Goal:** Argo Rollouts canary on planning-service, what-if simulator, algorithm dashboards, demo scenarios.

- **Guy**
  - Argo Rollouts canary strategy on `planning-service` specifically (PRD §3.3): traffic-split steps, automated analysis/rollback triggers.
  - Algorithm performance dashboard: solve time, conflict rate, assignment quality vs. greedy baseline (PRD §8) — expose these as metrics planning-service emits, Valfish wires the Grafana panel.
- **Tony**
  - Final demo data: seed scripts for realistic drones/missions across all services for the live demo.
  - Cross-service integration test pass + bug bash — Tony's track had the least algorithmically novel work through Phases 1-4, so he has the most slack here to own hardening.
- **Valfish**
  - What-if simulator panel: calls `/planning/simulate`, previews the re-solved schedule without committing, diff view against the current plan.
  - Grafana dashboards: fleet utilization, avg battery efficiency, mission completion rate (PRD §5.2, §8) — plus the algorithm panel Guy's metrics feed.
  - Final visual polish pass on the live app (separate from the `site/` pitch deck, which is already done).

**End-of-phase demo:** ship a bad build of planning-service, watch the canary catch it and roll back automatically, on camera.

---

## 3. Working in parallel without stepping on each other

- **Contracts before code.** Every sync point above is a data shape. The moment two tracks need
  the same shape, whoever owns the producing service writes it down (a `swarmops-contracts`
  repo/package, or even just a shared markdown file with JSON examples) *before* the consuming
  track builds against it. Don't let someone infer your API shape from a Slack message.
- **docker-compose is the integration point until Phase 4.** Nobody should be integration-testing
  against someone else's laptop. `docker-compose up` brings up all 6 services + Mongo + RabbitMQ
  + gateway from Phase 1 onward.
- **Each service repo is independently deployable from day one**, even if it's a stub. Don't
  batch "finish the algorithm, then containerize" — that's how Phase 4 becomes a scramble.
- **Weekly sync, not daily standup overhead** — the tracks are deliberately independent enough
  that a 3-person team doesn't need heavyweight process. Sync when a phase's sync-point
  contract changes, not on a schedule.
