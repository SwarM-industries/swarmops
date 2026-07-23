# SwarmOps — Milestones & Step-by-Step

Companion to `plan.md` (which explains the *why* and the ownership rationale) and
`SwarmOps_PRD.md` (which defines *what* the app does). This file is the literal checklist:
one milestone at a time, one numbered list of steps per person, an exit check before moving on.

Work top to bottom. Within a milestone, the three people's steps run in parallel — the "Exit
check" is what has to be true before anyone starts the next milestone.

---

## M0 — Team & repo setup

- [x] GitHub org `SwarM-industries` created.
- [x] 13 repos created and pushed: `swarmops-frontend`, `swarmops-gateway`,
      `swarmops-auth-service`, `swarmops-fleet-service`, `swarmops-mission-service`,
      `swarmops-planning-service`, `swarmops-telemetry-service`,
      `swarmops-notification-service`, `swarmops-drone-simulator`, `swarmops-local`,
      `swarmops-deployments`, `swarmops-infrastructure`, `swarmops-contracts`. Each has a
      README, a stack-appropriate `.gitignore`, and `main` as default branch.
- [ ] Branch protection: currently **not GitHub-enforced** (free org plan + private repos don't
      support it — see `plan.md` §1). Team discipline substitutes until/unless that changes.
      Nobody — Tony, Guy, or Valfish — pushes directly to `main` on any repo, ever.

**Whoever picks this up next (any of the three):**
1. Invite the other two as org members (`https://github.com/orgs/SwarM-industries/people` → Invite member).
2. Pick and stand up a PM tool: GitHub Projects (fastest — zero new signup) unless the team prefers Linear/Jira. Create one board, one column set (Todo / In Progress / In Review / Done), and seed it with this file's milestones as cards.
3. Pick and stand up a chat platform: Discord or Slack. Create the server/workspace, one channel per track (`#track-a-core`, `#track-b-planning`, `#track-c-platform`) plus a `#general`.
4. Confirm everyone can clone all 13 repos.

**Exit check:** all three people are org members, PM board exists with M1's tasks on it, chat exists.

---

## M1 — Foundation

Matches PRD §9 phase 1. Target: all five core services + gateway talking, greedy assignment, a
static map showing current state.

**Tony — `swarmops-auth-service`, `swarmops-fleet-service`, `swarmops-mission-service`**
1. Scaffold each repo: Node 20 + TypeScript + Express, `npm init`, tsconfig, a `/health` endpoint, Dockerfile.
2. `auth-service`: user model in MongoDB, `POST /auth/login` issuing a JWT, roles = `planner | operator | admin`. Write the shared JWT-verification middleware as a small package (or a copy-pasted module for now, promoted to `swarmops-contracts` once stable).
3. `fleet-service`: Drone model (PRD §6) in Mongoose, `POST /fleet/drones`, `GET /fleet/drones?status=`.
4. `mission-service`: Mission model in Mongoose, `POST /missions`, `GET /missions?status=`.
5. Publish the Drone and Mission JSON shapes to `swarmops-contracts` (exact field names/types — no paraphrasing PRD §6).
6. Open a PR per repo, get one approval, merge.

**Guy — `swarmops-planning-service`**
1. Scaffold FastAPI app, `/health`, Dockerfile (Python base image).
2. Plan model (PRD §6) in MongoDB (via `pymongo`/`motor`).
3. Implement the greedy baseline (PRD §4.2 phase 1): sort missions by priority then deadline, assign nearest available capable drone with sufficient battery.
4. `POST /planning/solve`: calls out to fleet-service/mission-service over HTTP (no message bus yet), runs the greedy solver, writes a Plan.
5. In `swarmops-local`: add a RabbitMQ service to the compose file now, even though nothing publishes yet — don't let Phase 3 start with "also set up the bus."
6. PR, review, merge.

**Valfish — `swarmops-frontend`, `swarmops-gateway`, `swarmops-local`**
1. Scaffold a fresh Vite React app in `swarmops-frontend` (this is the real product, separate from the `swarmops`/`site/` pitch deck).
2. Port `LiveMap.jsx`, `mapData.js`, `geometry.js` from the pitch deck's `site/` repo as a starting point.
3. Replace the pitch deck's fake looping data with real fetches to fleet-service/mission-service (no live movement yet — that's M3).
4. Mission board: list view + create-mission form against `mission-service`.
5. `swarmops-gateway`: NGINX config routing `/auth /fleet /missions /planning /telemetry /notifications` to the right upstream.
6. `swarmops-local`: `docker-compose.yml` wiring auth/fleet/mission/planning + gateway + Mongo + frontend together. Gateway is the only port exposed to the host.
7. PR, review, merge.

**Exit check:** `docker-compose up` in `swarmops-local` brings up the whole stack; creating a mission and a drone through the UI, then hitting "solve," produces a greedy assignment visible on the map.

---

## M2 — Optimization core

Matches PRD §9 phase 2.

**Guy — `swarmops-planning-service`**
1. Bipartite matching: `scipy.optimize.linear_sum_assignment` minimizing distance + urgency penalty (PRD §4.2 phase 2).
2. Per-drone routing for multi-stop missions via `ortools`' routing solver (phase 3).
3. Battery-drain simulation along candidate routes; reject or insert a charging stop (phase 4).
4. Conflict handling (PRD §4.3): higher-priority/earlier-deadline wins, other mission rescheduled or flagged unresolved.
5. `POST /planning/simulate` — same solver, non-committing (needed by Valfish in M9, build it now while the solver internals are fresh).
6. Lock the `/planning/solve` and `/planning/simulate` response shape, publish it to `swarmops-contracts`.
7. PR, review, merge.

**Tony**
1. `fleet-service`: add `maintenance`/offline status transitions, a "take drone offline" endpoint.
2. `fleet-service`/`mission-service`: payload/sensor-type compatibility fields so planning-service can filter on `required_payload_type`.
3. Scaffold `swarmops-notification-service`: Node/TS, stateless, `/health`, a stub endpoint for now (real bus consumption comes in M3).
4. PR, review, merge.

**Valfish**
1. Fleet inventory view: battery, maintenance status, "take offline" action wired to Tony's new endpoint.
2. Mission board: surface feasibility/conflict flags from planning-service's response.
3. `swarmops-deployments`: create the repo's `helm/swarmops/` directory skeleton (empty `Chart.yaml`, `values.yaml`) — don't template yet, just the shape, since M5 needs somewhere to start.
4. PR, review, merge.

**Exit check:** solving a scenario with 2+ missions and limited drones produces a materially better (lower total distance) assignment than M1's greedy, and an infeasible route (would strand a drone) gets rejected or given a charging stop instead of silently failing.

---

## M3 — Live system

Matches PRD §9 phase 3.

**Guy**
1. `swarmops-telemetry-service`: scaffold, `POST /telemetry/ingest`, publish to RabbitMQ, write recent history to MongoDB.
2. `swarmops-drone-simulator`: worker that flies each drone along its currently-assigned route (from planning-service's Plan) at a realistic speed, emitting a telemetry event on a timer, with configurable random variance (wind/sensor noise) so re-planning has something real to react to.
3. `planning-service`: consume telemetry + mission events off RabbitMQ; implement incremental re-planning that re-solves only the affected portion of the schedule (PRD §4.2 phase 5), not the whole fleet.
4. `notification-service`: consume conflict/alert events off RabbitMQ, expose them via a WebSocket or a polling endpoint.
5. Publish the telemetry event schema (PRD §6) to `swarmops-contracts` before Tony/Valfish build against it.
6. PR, review, merge.

**Tony**
1. Make drone-position ownership unambiguous: telemetry-service writes `position`/`battery_pct` on the Drone record; fleet-service's own CRUD only touches static fields (name, capacity, payload type). Document this in `fleet-service`'s README.
2. Write cross-service integration tests now that all 6 services exist (a test that hits the real gateway, not mocks — see `CLAUDE.md`'s testing note).
3. PR, review, merge.

**Valfish**
1. WebSocket client in the frontend connecting to telemetry/notification streams.
2. Swap the ported `LiveMap`'s fake `pointOnLoop` data source for real drone positions from the WebSocket — the animation code itself (marker rendering, no-fly zones, route lines) doesn't change, only where positions come from.
3. Alerts UI fed by `notification-service`.
4. PR, review, merge.

**Exit check:** start the simulator, drones visibly move on the live map without a page refresh; kill/disable a drone mid-route (via the "take offline" action from M2) and watch planning-service re-solve and the map update.

---

## M4 — Containerize & run locally/on a local cluster *(optional practice — not graded)*

Skip straight to M5 if the team is already comfortable with Compose and raw Kubernetes manifests.

1. Confirm `swarmops-local`'s compose setup: gateway is the only service exposed to the host; MongoDB has a named volume; seeding runs only against an empty data directory (guard on a marker file or Mongo's own "collection doesn't exist yet" check).
2. Stand up a local cluster (kind or minikube).
3. Write raw Deployments/Services/ConfigMaps/Secrets for each service in a dedicated namespace (`swarmops-deployments/k8s-manifests/` or similar, practice-only, not the Helm chart).
4. Install MongoDB via the Bitnami MongoDB Helm chart rather than hand-rolling it, even at this practice stage.
5. Turn the seed script into a ConfigMap mounted read-only at the init path, same first-init-only behavior as Compose.
6. Expose the app only through the gateway (Ingress or a gateway Service) — never expose backend services directly.

**Exit check (if attempted):** the whole stack runs on the local cluster, reachable only through the gateway. If skipped, just move to M5.

---

## M5 — Helm chart *(this is where grading starts)*

**Valfish — owns the chart's shape**
1. In `swarmops-deployments/helm/swarmops/`: `Chart.yaml`, declare Bitnami MongoDB and Bitnami RabbitMQ as `dependencies`, run `helm dependency update`.
2. Build `_helpers.tpl` with the shared naming/labels helpers.
3. Build **one** working service template (start with auth-service) using `range` over a `values.yaml` list of services, driven by `if`s for anything that differs (has a Service vs. doesn't, needs a PVC vs. doesn't) — the goal is one template file generating all near-identical Deployments/Services, not five hand-written copies.
4. `values.yaml` conventions: per-service `image.repository`, `image.tag`, `replicas`, `port`, `env`, `resources.requests/limits`. Write these down (a short section in the chart's README) before Tony/Guy add to it.
5. `helm install`, `helm upgrade` (bump a value, confirm it rolls), `helm rollback` (confirm it reverts), `helm uninstall` then reinstall (confirm MongoDB's PVC data survives — this is the actual bar, not just "the commands ran").
6. PR, review, merge.

**Tony — adds his services to the chart**
1. Add `auth-service`, `fleet-service`, `mission-service`, `notification-service` entries to `values.yaml` using Valfish's convention.
2. Confirm each renders correctly: `helm template swarmops | grep -A20 auth-service` (or equivalent) before opening the PR.
3. PR, review, merge.

**Guy — adds his services to the chart**
1. Add `planning-service` (heavier image — Python + OR-Tools base, likely needs higher `resources.requests`) and `telemetry-service` to `values.yaml`.
2. `drone-simulator` needs a different template shape (a Deployment with no Service, or a Job/CronJob depending on how it's built) — write this as its own template if `range` doesn't fit cleanly, don't force it into the generic one.
3. PR, review, merge.

**Exit check:** `helm install swarmops ./helm/swarmops` brings up all 9 services + Mongo + RabbitMQ on the local/dev cluster; `helm upgrade` with a changed image tag rolls; `helm rollback` reverts; `helm uninstall` + reinstall preserves Mongo data (PVC not deleted, or explicitly re-attached).

---

## M6 — Cloud infrastructure (Terraform)

**Valfish — `swarmops-infrastructure`**
1. Terraform root module: `terraform-aws-modules/vpc/aws` (public + private subnets, NAT, routing) and `terraform-aws-modules/eks/aws` (control plane + a node group).
2. IAM: cluster role, node role, EBS CSI permissions (IRSA-style, not broad static policies).
3. One ECR repository per deployable unit that ships an image (9 repos: frontend, gateway, auth, fleet, mission, planning, telemetry, notification, drone-simulator — not `swarmops-local`/`swarmops-infrastructure`/`swarmops-contracts`).
4. Core add-ons: VPC CNI, CoreDNS, kube-proxy, EBS CSI driver.
5. Connect the repo to a Terraform Cloud workspace: VCS-driven runs (PR = plan, merge to main = apply after approval), remote state with locking. **State is never committed to Git.**
6. `terraform plan` reviewed in a PR before every `terraform apply` — no one runs `apply` from a laptop against the shared workspace.
7. **No application workload goes on the cluster in this milestone** — infrastructure only.

**Exit check:** EKS cluster exists and is reachable (`kubectl get nodes` shows the node group healthy), ECR has 9 empty repositories, Terraform Cloud shows a clean apply with locked remote state.

---

## M7 — Deploy the app to the cloud

**Everyone — one-time per service, then it's automatic (M8)**
1. Tag convention from here on, everywhere: `<semver>-<7-char-git-hash>` (e.g. `1.2.0-a1b2c3d`). **Never `latest`.**
2. Manually build + tag + push each service's current image to its ECR repo once, to prove the path works before automating it in M8.
3. Point the Helm chart at those images via a dedicated `values-aws.yaml` (or `environments/production/*`) — the base chart stays environment-agnostic; only this file knows about ECR URLs.

**Valfish**
1. MongoDB's storage: confirm the Bitnami chart's PVC is backed by a StorageClass using the EBS CSI driver, dynamically provisioned (not a hand-created volume).
2. Install the AWS Load Balancer Controller.
3. Ingress/ALB in front of the gateway — confirm it's the *only* thing reachable from outside the cluster (backend services should not have public-facing Services/Ingresses).

**Exit check:** `helm install`/`upgrade` with the AWS values file brings the app up on EKS; hitting the ALB's address reaches the frontend through the gateway; MongoDB survives a pod restart (EBS-backed PVC, not ephemeral).

---

## M8 — CI (GitHub Actions) + GitOps (Argo CD)

**Valfish — writes the reusable pieces once**
1. A GitHub Actions workflow template: on PR → lint/test/build-validate only (no publish, no cluster access). On push to `main` → bump `VERSION` + short git hash, OIDC-auth to AWS (dedicated IAM role trusted for this org/repo/branch — no static keys), build, push to that repo's ECR repo.
2. Install Argo CD as its own Helm release, its own namespace.
3. Write the `AppProject` (scopes which repos/destinations are allowed) and the top-level `Application` (points at the Helm chart + all values files, `automated: { selfHeal: true, prune: true }`).
4. Set up `swarmops-deployments/environments/production/images/<service>.yaml` — one file per service, each holding just that service's image tag.
5. Set up the scoped bot identity (GitHub App installation token, ideally) that's the only thing allowed to bypass `swarmops-deployments`'s branch protection for automated commits.

**Tony & Guy — copy the template into their own repos**
1. Each of Tony's 4 services and Guy's 4 services (planning, telemetry, drone-simulator, notification) gets Valfish's workflow, parameterized with that service's name/ECR repo.
2. The `main`-push job, after pushing the image, edits *only its own* `environments/production/images/<service>.yaml` in `swarmops-deployments` using `yq` (never a text replace, never touching another service's file) and commits via the bot identity.
3. PR, review, merge (for the workflow file itself — the automated image-bump commits it produces later are the one thing allowed to skip review, per M0).

**Exit check:** push a real code change to any service → CI builds, tags, pushes to ECR, and bumps that service's image file in `swarmops-deployments` → Argo CD picks it up within its sync interval and the new pod is running, with zero manual `helm upgrade`/`kubectl apply`. Delete a pod by hand and confirm Argo CD's self-heal brings it back. Manually edit a live Deployment and confirm Argo CD reverts the drift.

---

## M9 — Observability + required extension

**Tony & Guy — instrument their own services**
1. Every service exposes an internal-only `/metrics` (request count, status, duration, process stats). Node services: `prom-client`. `planning-service`: `prometheus-fastapi-instrumentator` or equivalent. No user/mission/drone IDs in metric labels.
2. `planning-service` specifically also emits solve time, conflict rate, and assignment quality vs. the M1 greedy baseline (PRD §8) — Guy owns this since he owns the solver.
3. Structured JSON logs, no secrets, no PII.

**Valfish — installs the stacks, both as Argo CD Applications**
1. kube-prometheus-stack (Prometheus, Grafana, Alertmanager, kube-state-metrics, node-exporter) as its own Argo CD `Application`.
2. Loki + Grafana Alloy as its own Argo CD `Application`.
3. `ServiceMonitor` per service (or one templated `ServiceMonitor` in the Helm chart, following the same `range` pattern as M5) so Prometheus discovers all of them automatically.
4. One Grafana dashboard, "SwarmOps Overview," provisioned from Git (a ConfigMap/dashboard-as-code, not clicked together): node/pod health, request rate, error rate, latency — plus a panel for Guy's algorithm metrics.
5. Alertmanager alerts, provisioned from Git: service down, replicas unavailable, crash-looping, high error rate.

**Guy — required extension: Argo Rollouts canary on `planning-service`**
1. Install Argo Rollouts.
2. Convert `planning-service`'s Deployment (in the Helm chart) to a `Rollout` resource with a canary strategy — traffic-split steps, an `AnalysisTemplate` checking error rate/latency from the metrics in step 1–2 above, automated rollback if analysis fails.
3. Rehearse it: ship a deliberately broken `planning-service` build, watch the canary get a fraction of traffic, fail analysis, and roll back automatically — this is the moment to actually demo, not just configure.

**Exit check:** Grafana shows the "SwarmOps Overview" dashboard with live data; a manufactured alert (e.g. scale a deployment to 0) fires in Alertmanager; the canary rehearsal in Guy's step 3 actually catches a bad build.

---

## M10 — Demo prep

**Everyone**
1. Walk `plan.md` §4 (the pre-demo checklist: security, cost, performance, caching) and make sure at least one person can answer each cold.
2. Confirm every Argo CD `Application` (the app itself, kube-prometheus-stack, Loki/Alloy) shows `Synced` and `Healthy`.
3. Seed realistic demo data (drones, missions) — Tony owns this per `plan.md`, since his track had the most slack by this point.
4. Rehearse the demo script once end-to-end, including the canary-rollback moment from M9.
5. Confirm there's a real `terraform destroy` path ready to run right after the demo, so the cluster isn't billing overnight.

**Exit check:** you could run the whole demo cold, in order, without anyone narrating "this part's still flaky."
