# SwarmOps — Repo Reference

What each repo in `SwarM-industries` is, exactly. One deployable unit per repo (polyrepo — see `plan.md` §1).

---

### `swarmops`
This repo. Docs only — PRD, `plan.md`, `milestones.md`, `CLAUDE.md`, `REPOS.md`, and the pitch-deck site (`site/`). Not part of the running app. Nothing here gets deployed.

### `swarmops-frontend`
React + Vite SPA. The only thing end users see. Live fleet map (drones, missions, no-fly zones, routes), mission board, fleet inventory, what-if simulator, dashboards. Talks to everything through the gateway — never calls a backend service directly.

### `swarmops-gateway`
NGINX config/image. Single entrypoint for the whole system. Routes `/auth`, `/fleet`, `/missions`, `/planning`, `/telemetry`, `/notifications` to their services. In the cloud, sits behind the ALB — it's the only thing the Ingress points at.

### `swarmops-auth-service`
Node/TS + Express + MongoDB. Login, JWT issuance, roles (`planner`/`operator`/`admin`). Every other service trusts its tokens; nothing else in the system issues or validates auth on its own.

### `swarmops-fleet-service`
Node/TS + Express + MongoDB. Drone inventory: name, status (`idle`/`flying`/`charging`/`maintenance`), max range, speed, payload capacity/type. Does **not** own live position/battery updates — that's telemetry-service's job. Only static fields + status changes (e.g. "take offline").

### `swarmops-mission-service`
Node/TS + Express + MongoDB. Mission definitions: target locations, priority, deadline, required payload type, estimated duration, status (`pending`/`assigned`/`in_progress`/`complete`).

### `swarmops-planning-service`
Python + FastAPI. The core: assigns drones to missions and computes routes. Greedy baseline → Hungarian matching → OR-Tools routing → battery-feasibility check → event-driven re-planning. Consumes fleet/mission data and telemetry events, produces Plans. The one service with a canary deploy (Argo Rollouts) because it's the highest-risk, most-iterated piece.

### `swarmops-telemetry-service`
Node/TS + Express + MongoDB. Ingests simulated drone position/battery events (`POST /telemetry/ingest`), publishes them to RabbitMQ, keeps recent history. This is what actually updates a drone's live position — fleet-service doesn't.

### `swarmops-notification-service`
Node/TS + Express. Stateless. Consumes conflict/alert/completion events off RabbitMQ from planning-service, exposes them to the frontend (WebSocket or polling). No database of its own.

### `swarmops-drone-simulator`
Node/TS worker (not a web service — long-running process, no inbound HTTP). "Flies" each drone along its currently assigned route at a realistic speed, emitting telemetry events on a timer with randomized variance (simulated wind/sensor noise) so re-planning has something real to react to.

### `swarmops-local`
Docker Compose setup. Brings up every service above + MongoDB + RabbitMQ for local dev with one command. Gateway is the only exposed port; everything else talks by Compose service name.

### `swarmops-deployments`
Everything Kubernetes: the Helm chart (`helm/swarmops/`), Argo CD config (`AppProject`, `Application`, per-service image files under `environments/production/images/`), and observability config (Grafana dashboard, Alertmanager rules, `ServiceMonitor`s). This is the repo Argo CD watches — a Git commit here is the only way anything gets deployed once GitOps is live.

### `swarmops-infrastructure`
Terraform. VPC, EKS cluster, ECR repos (one per service that ships an image), IAM roles, core cluster add-ons. Connected to a Terraform Cloud workspace — state lives there, never in Git. No application code here, infrastructure only.

### `swarmops-contracts`
Shared data model / event shapes (Drone, Mission, Plan, Telemetry event — PRD §6) as an actual importable package (npm for the Node services, a small Python package for planning-service), so services can't silently drift on field names or types. Not required by the deployment brief — added so "contracts before code" is enforced by the compiler, not just convention.

### `swarmops-business`
Documents, not code — the odd one out in this list. Business overviews and one-pagers (HE + EN),
the use-case companion, the market/competitive research behind them, and the `_render/` PDF
pipeline. Split out of `swarmops` on 2026-08-19 with its full history so the business material
versions on its own instead of riding along with the docs repo. **Nothing here is deployed, and it
is deliberately absent from `SERVICE_REPOS` in the Makefile** — no CI, no Dockerfile, no image. It
is in `REPOS`, so `make clone-missing` / `fetch-all` / `pull-all` / `status` all cover it.

**Read `_render/README.md` in that repo before changing any document there** — every `.pdf` is
generated output, and the three one-pagers are independent hand-authored files with no shared
template.
