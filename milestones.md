# SwarmOps — Milestones & Steps

Literal task list. One numbered list per person per milestone. Exit check = must be true before next milestone starts.

---

## M0 — Team & repo setup

Done:
- [x] Org `SwarM-industries` created.
- [x] 13 repos created, pushed, README + `.gitignore` in each.

Remaining (anyone):
1. Invite Guy + Valfish to org.
2. Create PM board (GitHub Projects). Columns: Todo / In Progress / In Review / Done. Add M1 tasks.
3. Create chat (Discord/Slack). Channels: `#track-a-core`, `#track-b-planning`, `#track-c-platform`, `#general`.
4. Confirm all 3 can clone all 13 repos.

**Exit:** org has 3 members, board has M1 tasks, chat exists.

---

## M1 — Foundation

**Tony — auth-service, fleet-service, mission-service**
1. Scaffold each: Node 20 + TS + Express, `/health` route, Dockerfile.
2. `auth-service`: User model, `POST /auth/login` → JWT, roles `planner|operator|admin`. Shared JWT-verify middleware.
3. `fleet-service`: Drone model (PRD §6), `POST /fleet/drones`, `GET /fleet/drones?status=`.
4. `mission-service`: Mission model (PRD §6), `POST /missions`, `GET /missions?status=`.
5. Push Drone + Mission shapes to `swarmops-contracts`.
6. PR → 1 approval → merge.

**Guy — planning-service**
1. Scaffold: FastAPI, `/health`, Dockerfile.
2. Plan model (PRD §6) in MongoDB.
3. Greedy solver: sort missions by priority then deadline, assign nearest capable drone with enough battery.
4. `POST /planning/solve`: pulls drones/missions over HTTP, runs greedy, writes Plan.
5. Add RabbitMQ to `swarmops-local` compose (unused for now).
6. PR → approval → merge.

**Valfish — frontend, gateway, local**
1. Scaffold Vite React app in `swarmops-frontend`.
2. Port `LiveMap.jsx` / `mapData.js` / `geometry.js` from pitch deck `site/`.
3. Replace fake loop data with real fetches from fleet/mission-service. No live movement yet.
4. Mission board: list + create form.
5. `swarmops-gateway`: NGINX routes `/auth /fleet /missions /planning /telemetry /notifications`.
6. `swarmops-local`: compose file, gateway = only exposed port.
7. PR → approval → merge.

**Exit:** `docker-compose up` runs full stack. Create drone + mission in UI, hit solve, see assignment on map.

---

## M2 — Optimization core

**Guy**
1. Bipartite matching (`scipy.optimize.linear_sum_assignment`): minimize distance + urgency penalty.
2. OR-Tools routing for multi-stop drones.
3. Battery-drain simulation per route; check candidate route against active no-fly zones
   (fetched from `fleet-service`) and reject/reroute if it crosses one; reject or insert a
   charging stop using real `charging-stations` locations (also from `fleet-service`) if a route
   would leave a drone stranded.
4. Conflict handling: higher priority/earlier deadline wins; loser rescheduled or flagged unresolved.
5. `POST /planning/simulate` (non-committing).
6. Lock + publish `/planning/solve` and `/planning/simulate` response shape to `swarmops-contracts`.
7. PR → approval → merge.

**Tony**
1. `fleet-service`: maintenance/offline status, "take offline" endpoint.
2. `fleet-service`/`mission-service`: payload/sensor-type compatibility fields.
3. `fleet-service`: `NoFlyZone` + `ChargingStation` models (PRD §6), `GET/POST /fleet/no-fly-zones`,
   `GET/POST /fleet/charging-stations`. Publish both shapes to `swarmops-contracts`.
4. Scaffold `notification-service`: Node/TS, stateless, `/health`, stub endpoint.
5. PR → approval → merge.

**Valfish**
1. Fleet inventory view: battery, maintenance status, take-offline button.
2. Show feasibility/conflict flags in mission board.
3. Map overlay: no-fly zones as shaded regions, charging stations as markers (static fetch from
   `fleet-service` — no live-update requirement yet, that's M3's WebSocket work).
4. `swarmops-deployments`: create `helm/swarmops/` skeleton (`Chart.yaml`, empty `values.yaml`).
5. PR → approval → merge.

**Exit:** matched assignment beats M1 greedy on total distance. Infeasible route gets rejected/charging-stop, not silent failure. A route crossing a defined no-fly zone gets rejected/rerouted, not silently allowed.

---

## M3 — Live system

**Guy**
1. `telemetry-service`: `POST /telemetry/ingest`, publish to RabbitMQ, write recent history to MongoDB.
2. `drone-simulator`: flies each drone along its Plan route, emits telemetry on timer, random variance.
3. `planning-service`: consume telemetry/mission events off bus, re-solve only affected portion.
4. `notification-service`: consume alert events off bus, expose via WebSocket/poll endpoint.
5. Push telemetry event schema to `swarmops-contracts`.
6. PR → approval → merge.

**Tony**
1. Lock down write ownership: telemetry-service writes drone `position`/`battery_pct`; fleet-service CRUD only touches static fields.
2. Cross-service integration tests against real gateway (no mocks).
3. `PATCH /fleet/drones/:id/status` + `PATCH /missions/:id/status` — surfaced by Guy's M3 work
   (planning-service assigns/completes Plans but neither service's `status` ever changed to
   reflect it; planning-service worked around this internally instead). Endpoints exist now;
   Guy wires the calls into `planning-service` on his own side.
4. PR → approval → merge.

**Valfish**
1. WebSocket client → telemetry/notification streams.
2. Swap `LiveMap`'s fake data for real WebSocket positions (animation code unchanged).
3. Alerts UI fed by notification-service.
4. Remove the dev auth-bypass button/path now that real `auth-service` login works end to end
   (flagged during Tony's M3 integration testing — was still live, producing 401s against real
   tokens).
5. PR → approval → merge.

**Exit:** simulator running → drones move on live map, no refresh. Disable a drone mid-route → planning-service re-solves, map updates.

---

## M4 — Local containers/cluster *(optional, skip if already comfortable)*

1. `swarmops-local` compose: gateway only exposed port, Mongo named volume, seed runs only on empty data dir.
2. Local cluster (kind/minikube).
3. Raw Deployments/Services/ConfigMaps/Secrets, one namespace.
4. MongoDB via Bitnami Helm chart, not hand-rolled.
5. Seed script → read-only ConfigMap mount, same first-init-only rule.
6. Expose app only through gateway (Ingress or gateway Service).

**Exit (if done):** stack runs on local cluster, reachable only via gateway. If skipped, go to M5.

---

## M5 — Helm chart (grading starts here)

**Valfish**
1. `swarmops-deployments/helm/swarmops/`: `Chart.yaml`, add Bitnami MongoDB + Bitnami RabbitMQ as dependencies, `helm dependency update`.
2. `_helpers.tpl`: naming/labels.
3. One template using `range`+`if` over `values.yaml` service list → generates all near-identical Deployments/Services.
4. Document `values.yaml` convention (image, replicas, port, env, resources) before others add to it.
5. Verify: `helm install`, `helm upgrade` (bump value, confirm roll), `helm rollback` (confirm revert), `helm uninstall`+reinstall (confirm Mongo data survives).
6. PR → approval → merge.

**Tony**
1. Add auth/fleet/mission/notification-service entries to `values.yaml`.
2. Verify render: `helm template swarmops`.
3. PR → approval → merge.

**Guy**
1. Add planning-service (bigger image, higher resources) + telemetry-service to `values.yaml`.
2. `drone-simulator`: separate template (Job/Deployment-no-Service — doesn't fit `range` pattern).
3. PR → approval → merge.

**Exit:** `helm install` brings up all 9 services + Mongo + RabbitMQ. Upgrade rolls, rollback reverts, uninstall+reinstall keeps Mongo data.

---

## M6 — Cloud infrastructure (Terraform)

**Valfish**
1. `terraform-aws-modules/vpc/aws` + `terraform-aws-modules/eks/aws`.
2. IAM: cluster role, node role, EBS CSI permissions.
3. One ECR repo per shippable unit (9: frontend, gateway, auth, fleet, mission, planning, telemetry, notification, drone-simulator).
4. Core add-ons: VPC CNI, CoreDNS, kube-proxy, EBS CSI driver.
5. Connect repo to Terraform Cloud workspace: VCS-driven runs, remote state + locking. State never in Git.
6. PR-reviewed `plan` before every `apply`. No local `apply` against shared workspace.
7. No app workload this milestone — infra only.

**Exit:** `kubectl get nodes` shows healthy node group. 9 empty ECR repos exist. Terraform Cloud shows clean apply, locked state.

---

## M7 — Deploy app to cloud

**Everyone**
1. Tag convention from now on: `<semver>-<7-char-git-hash>`. Never `latest`.
2. Manually build+tag+push each service's current image to ECR once (prove path before automating).
3. Point Helm chart at ECR images via `values-aws.yaml`. Base chart stays environment-agnostic.

**Valfish**
1. Confirm Mongo PVC uses EBS CSI StorageClass, dynamically provisioned.
2. Install AWS Load Balancer Controller.
3. Ingress/ALB in front of gateway — only externally reachable thing.

**Exit:** `helm install`/`upgrade` with AWS values brings app up on EKS. ALB address reaches frontend through gateway. Mongo survives pod restart.

---

## M8 — CI (GitHub Actions) + GitOps (Argo CD)

**Valfish**
1. Reusable GH Actions workflow: PR → lint/test/build-validate only. Push to `main` → bump `VERSION`+git hash, OIDC to AWS (no static keys), build+push to ECR.
2. Install Argo CD: own Helm release, own namespace.
3. Write `AppProject` (scoped repos/destinations) + top-level `Application` (chart + all values files, `selfHeal: true`, `prune: true`).
4. `swarmops-deployments/environments/production/images/<service>.yaml` — one file per service.
5. Set up scoped bot identity (GitHub App token) — only thing allowed to bypass `swarmops-deployments` branch protection.

**Tony & Guy**
1. Copy Valfish's workflow into each owned service repo, parameterized per service.
2. `main`-push job edits only that service's own image file via `yq`, commits via bot identity. Never touch another service's file. Never text-replace.
3. PR → approval → merge (workflow file itself; later automated image-bump commits skip review, per M0).

**Exit:** push code change → CI builds/tags/pushes → bumps image file → Argo CD deploys, zero manual `helm upgrade`/`kubectl apply`. Delete a pod by hand → self-heal restores it. Edit live Deployment by hand → Argo CD reverts drift.

---

## M9 — Observability + required extension

**Tony & Guy**
1. Every service exposes internal-only `/metrics` (request count, status, duration, process stats). Node: `prom-client`. Python: `prometheus-fastapi-instrumentator`. No user/mission/drone IDs in labels.
   - **Tony's 3 services done (2026-07-25, jumped ahead of M6-8 — no cluster dependency for the app-level piece):** `auth-service`, `fleet-service`, `mission-service` all expose `GET /metrics`, verified live.
2. `planning-service` (Guy) also emits solve time, conflict rate, assignment quality vs. M1 greedy baseline.
3. Structured JSON logs, no secrets, no PII.
   - **Tony's 3 services done (2026-07-25)** alongside item 1 above.

**Valfish**
1. kube-prometheus-stack as its own Argo CD `Application`.
2. Loki + Grafana Alloy as its own Argo CD `Application`.
3. `ServiceMonitor` per service (or templated in Helm chart).
4. One Grafana dashboard "SwarmOps Overview" from Git: node/pod health, request rate, error rate, latency, + Guy's algorithm panel.
5. Alertmanager alerts from Git: service down, replicas unavailable, crash-looping, high error rate.

**Guy — required extension: Argo Rollouts canary on planning-service**
1. Install Argo Rollouts.
2. Convert planning-service Deployment → `Rollout` with canary steps + `AnalysisTemplate` (error rate/latency) + auto-rollback.
3. Rehearse: ship broken build, confirm canary catches it and rolls back.

**Exit:** Grafana dashboard shows live data. Manufactured alert fires (e.g. scale to 0). Canary rehearsal actually catches a bad build.

---

## M10 — Demo prep

**Everyone**
1. Walk `plan.md` §4 checklist (security/cost/performance/caching) — one person can answer each cold.
2. Confirm every Argo CD `Application` shows `Synced` + `Healthy`.
3. Tony: seed realistic demo data.
4. Full dry run of demo, including canary-rollback moment.
5. Confirm `terraform destroy` path ready post-demo.

**Exit:** demo runs cold, start to finish, no "this part's still flaky."
