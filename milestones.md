# SwarmOps — Milestones & Steps

Literal task list. One numbered list per person per milestone. Exit check = must be true before next milestone starts.

**Synced to actual repo state 2026-07-28** (audited all 13 app repos directly via GitHub API,
not assumed from this doc). M1–M7 confirmed done. M8 is the current blocker — CI exists PR-side
only, no Argo CD/GitOps yet. M9 app-level metrics/logs done on all 7 services (this doc
previously undercounted it as 3). M9.5 Unity track is well past what this doc said — Stage 0–2
already shipped, not just Stage 0 "signed off."

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

## M1 — Foundation — **DONE**

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

## M2 — Optimization core — **DONE**

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

## M3 — Live system — **DONE**

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

## M5 — Helm chart (grading starts here) — **DONE**

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

## M6 — Cloud infrastructure (Terraform) — **DONE**

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

## M7 — Deploy app to cloud — **DONE** (values-aws.yaml + ALB Ingress landed 2026-07-28)

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

## M8 — CI (GitHub Actions) + GitOps (Argo CD) — **DONE, all 9 services healthy, verified live 2026-08-01**

Status 2026-07-30: **`DEPLOYMENTS_BOT_TOKEN` blocker (below) is fixed and confirmed live across
all 9 service repos** — first time the full pipeline (push → build → ECR → bump
`swarmops-deployments` → real `swarmops-ci-bot` commit) has worked end to end for every service.
Root cause was never the PAT value (several re-sets, a full delete+recreate, and a brand-new test
secret all reproduced the same failure) — it's a **GitHub Free-org-plan limitation: organization-
level Actions secrets/vars cannot reach *private* repos, full stop, regardless of visibility
setting (`all`/`private`/`selected` all equivalent for a private repo)**. Confirmed with a clean
A/B test: same secret, same workflow, only repo privacy flipped — 15-char test value resolved
correctly on a public throwaway repo, empty on the same repo made private. Fix: `DEPLOYMENTS_BOT_TOKEN`
and `AWS_GHA_ROLE_ARN` moved from org-level to **repo-level** secret/var on each of the 9 service
repos. Verified live 2026-07-30: all 9 `publish` jobs green, all 9 real bump commits landed in
`swarmops-deployments` (`auth/fleet/mission/planning/telemetry/notification/frontend/gateway/
drone-simulator: bump image to ...`). Diagnostic cruft (temp env vars, debug echo, stale
"pending" comments) stripped from `swarmops-fleet-service`'s workflow after confirmation;
worth the same pass on the other 8 next time one of them is touched.

Separately, Valfish got Argo CD itself installed and synced against the live cluster on
2026-07-29 (before the bot-token fix above — that sync used image tags Valfish bumped by hand,
not via CI): **8 of 9 services deployed clean and healthy** (`auth, fleet, mission, telemetry,
notification, drone-simulator, frontend, gateway`), ALB reachable from the real internet. Two
real bugs found and fixed live along the way: `AppProject`'s `clusterResourceWhitelist: []` also
blocked `Namespace` creation despite `CreateNamespace=true` (fixed by explicitly whitelisting
`Namespace`), and all 9 ECR repos were empty from the `infra/persistent`/`infra/cluster` split
recreating ECR from scratch (rebuilt/pushed all 9 manually to unblock the sync test). `planning-
service` is the one exception — blocked on M9 (no Prometheus yet for its canary `AnalysisTemplate`)
plus a real bug on top: its "stable" ReplicaSet references an image tag that no longer exists
(predates the ECR fix), so it currently has zero working stable replicas, one working canary
replica. **Flagged to Guy directly** — his to fix, see `swarmops-deployments/STATUS.md`'s
2026-07-29 entry for full detail. Since the bot-token fix above lands *new* images automatically
now, Argo CD has real fresh commits to sync for the first time — worth re-confirming all 8 are
still healthy (and whether planning-service's situation changed) rather than trusting the
2026-07-29 snapshot.

**Done:**
1. PR-side workflow (lint/test/build-validate) — all 9 repos.
2. `publish` job (version, build, push to ECR, `yq`-bump `swarmops-deployments`) — **all 9 repos,
   merged**: auth/fleet/mission-service (Tony, earlier), then telemetry-service/
   notification-service/drone-simulator/frontend (subagent-drafted, Tony-verified/merged),
   planning-service and gateway (subagent-drafted, Tony-verified/merged). planning-service and
   gateway have no version file in their repos (Python with no pyproject.toml; pure NGINX config)
   — both hardcode `version="0.1.0"` matching the tag already live in production from M7's manual
   push, with a comment explaining why. drone-simulator's `yq` path is
   `.droneSimulator.image.tag`, not `.services.<name>...`, since it's a worker with no `services:`
   map entry — verified explicitly, easy to get wrong by copy-paste.
3. Also fixed in passing: `swarmops-planning-service`'s `verify` job was failing on `main` itself
   (pre-existing, unrelated to the new publish job) — `src/config.py` validates 8 required env
   vars at import time, CI's bare `python -c "import src.main"` step never set any of them. Fixed
   by scoping dummy values to just that one step.
4. `swarmops-infrastructure`'s OIDC role Terraform: merged
   ([`swarmops-infrastructure#1`](https://github.com/SwarM-industries/swarmops-infrastructure/pull/1)),
   then the whole repo got split into `infra/persistent/` (ECR + OIDC role, never destroyed) +
   `infra/cluster/` (VPC/EKS, destroy freely) after Valfish's cost-discipline destroy took ECR
   down with the cluster once
   ([`swarmops-infrastructure#2`](https://github.com/SwarM-industries/swarmops-infrastructure/pull/2),
   merged) — see that repo's `RUNBOOK.md`. Valfish applied `infra/persistent` for real: all 9 ECR
   repos + the OIDC role exist in AWS (`769638986113`), confirmed directly via the Terraform Cloud
   API (Tony got added as TFC org owner). A stray UI-triggered destroy plan against
   `infra/persistent` got caught and blocked by its `prevent_destroy` guards — worked as designed.
5. Argo CD `AppProject` + `Application` + bootstrap runbook written
   (`swarmops-deployments/argocd/`) — not yet installed, blocked on `infra/cluster` existing again
   (currently destroyed). Also had to convert the chart's `services:` from a list to a map
   (`values.yaml`/`values-aws.yaml`/`templates/service.yaml`) so Argo CD's per-service value-file
   overrides merge safely — Helm's multi-file merge replaces lists wholesale but deep-merges maps.
   All 9 `environments/production/images/<service>.yaml` files exist to match. Full writeup in
   `swarmops-deployments`'s STATUS.md.

**Not done / current blockers:**
1. ~~AWS trust-policy failure~~ — **FIXED, confirmed live 2026-07-29** (see above).
2. ~~`DEPLOYMENTS_BOT_TOKEN` value bad~~ — **FIXED, confirmed live 2026-07-30** (see above). Was
   never the value — Free-org-plan org-secret-to-private-repo limitation. Fixed via per-repo
   secrets/vars on all 9 service repos.
3. **planning-service not healthy on the live cluster** — blocked on M9 (no Prometheus for its
   canary `AnalysisTemplate` yet) plus a real bug: stable ReplicaSet points at a deleted image tag.
   Flagged to Guy directly (see above) — needs Guy to re-point or re-deploy it now that CI pushes
   real images automatically.
4. **Re-confirm Argo CD sync post-bot-token-fix** — 2026-07-29's "8/9 healthy" snapshot predates
   automated image bumps; worth a fresh `kubectl get applications -n argocd` / `argocd app list`
   check once there's a cluster to check against. Not urgent right now: `infra/cluster` is
   destroyed again between sessions (cost discipline, per Valfish 2026-07-30) — sync mechanics
   already proven end-to-end 2026-07-29, this only changes what's feeding it, so low-risk to defer
   to the next `infra/cluster` apply rather than re-applying just to check.
5. **Scoped bot identity** — resolved differently than originally planned: instead of a GitHub
   App, used a fine-grained PAT (Contents: Read/write, scoped to `swarmops-deployments` only)
   from an existing account, stored as `DEPLOYMENTS_BOT_TOKEN`. Deliberate simplification from
   CLAUDE.md's literal "GitHub App, not personal token" wording — faster to stand up, same
   scoping goal (one repo, one permission, not a broad personal token), but the resulting
   image-bump commits will show as that person's account rather than a distinct bot identity.
   Also now per-repo rather than org-scoped (see #2) — any *future* org-wide secret/var needs the
   same per-repo treatment on this plan, org-level won't reach any of the 9 private service repos.

**Exit:** push code change → CI builds/tags/pushes → bumps image file → Argo CD deploys, zero manual `helm upgrade`/`kubectl apply`. Delete a pod by hand → self-heal restores it. Edit live Deployment by hand → Argo CD reverts drift.

---

## M9 — Observability + required extension — **DONE, verified live end-to-end 2026-08-01**

**Tony & Guy**
1. Every service exposes internal-only `/metrics` (request count, status, duration, process stats). Node: `prom-client`. Python: `prometheus-fastapi-instrumentator`. No user/mission/drone IDs in labels.
   - **DONE, all 7 services (confirmed 2026-07-28 file-tree audit — this doc previously said only
     Tony's 3, that was stale):** every service has `/observability/{logger,metrics}` (or `.py`
     equivalent) and exposes `GET /metrics`.
2. `planning-service` (Guy) also emits solve time, conflict rate, assignment quality vs. M1 greedy baseline. **DONE, confirmed by Guy (2026-07-29):** `planning_solve_duration_seconds` (histogram, `src/routes/planning.py:121`), `planning_conflict_rate` (gauge, `src/routes/planning.py:154`), `planning_assignment_quality_vs_greedy` (gauge, `src/routes/planning.py:155-157`, ratio vs a real M1 `solve_greedy()` run computed in `src/solver.py:403-417`, guarded against the zero-match case) — all three wired via `prometheus-fastapi-instrumentator` + a custom `assignment_quality_vs_greedy()` helper in `solver.py`, verified live against the real stack with real (non-zero) values after a real solve. See `swarmops-planning-service/STATUS.md`'s 2026-07-26 update for the full detail — this was done well before this doc's 2026-07-28 audit, the audit just couldn't tell from a file-tree scan alone.
3. Structured JSON logs, no secrets, no PII.
   - **DONE, all 7 services (2026-07-28)** — same audit as item 1, not just Tony's 3.

**Valfish** — drafted 2026-07-28 (Tony, via subagent), picked back up and **merged to `main`
2026-07-30** (`swarmops-deployments#2`, hand-merged past drift from M8's canary/bot-token work —
see that repo's `STATUS.md`). **Still not synced against a live cluster** — `infra/cluster` is
destroyed between sessions, nothing below is verified for real yet, only `helm lint`/`helm
template`.
1. kube-prometheus-stack as its own Argo CD `Application` (local wrapper chart, `monitoring` ns). **Merged, unsynced.**
2. Loki + Grafana Alloy as its own Argo CD `Application` (single-binary Loki + Alloy DaemonSet, scoped to `swarmops` ns). **Merged, unsynced.**
3. `ServiceMonitor` templated in `helm/swarmops/templates/servicemonitor.yaml`, one per `services:` map entry. **Merged, unsynced — flag: unconfirmed whether `frontend`/`gateway` actually expose `/metrics` (gateway's plain NGINX), needs a check before this is trusted for those two.**
4. "SwarmOps Overview" Grafana dashboard (ConfigMap, sidecar-discovered): cluster/pod health, request/error rate/latency, + planning-service's 3 real algorithm metrics. **Merged, unsynced.**
5. Alertmanager `PrometheusRule`: service down, replicas unavailable, crash-looping, high error rate. **Merged, unsynced — first-pass thresholds, not tuned against real traffic.**

**Guy — required extension: Argo Rollouts canary on planning-service** — drafted 2026-07-28
(Tony, via subagent), diverged from Guy's own parallel implementation on `main`, hand-merged
(keeping the stronger half of each — see `swarmops-deployments/STATUS.md`'s 2026-07-30 entry)
and **merged to `main` 2026-07-30** (`swarmops-deployments#1`). Also fixed the same day: the
live cluster's stable ReplicaSet was pointing at an image tag deleted in the ECR rebuild —
triggered a fresh publish (`swarmops-planning-service` `0.1.0-ad2d1aa`) so it has a real tag to
sync next. **Still not synced against a live cluster** — same reason as Valfish's item above.
1. Install Argo Rollouts — own AppProject/Application (2.41.1), cluster-scoped RBAC kept separate from the app's own AppProject. **Merged, unsynced.**
2. Convert planning-service Deployment → `Rollout` (20% → analysis → 50% → analysis → 100%, both steps gated) + `AnalysisTemplate` (Prometheus error-rate >5%, p95 >2s, p99 >3s off `/metrics`, scoped to canary-pod metrics only via pod-template-hash) + auto-rollback. Other services keep plain Deployments. **Merged, unsynced — no `trafficRouting:` plugin exists (no mesh/ALB weighted-target-group), so this is a replica-split approximation of canary, not exact traffic weighting; flagged as a real limitation in the manifests.**
3. Rehearse: ship broken build, confirm canary catches it and rolls back. **Runbook written (`docs/canary-rollback-rehearsal.md`), rehearsal itself not run — needs a live cluster with Prometheus actually up (item 3 above resolves the "nothing to query" gap the AnalysisTemplate had until this merge).**

**Exit:** Grafana dashboard shows live data. Manufactured alert fires (e.g. scale to 0). Canary rehearsal actually catches a bad build.

**Actual next step, both tracks above:** re-apply `infra/cluster` (Tony/Valfish, TFC workspace
admin only — Guy has no path to trigger this himself) and re-run `argocd/README.md`'s bootstrap,
which now installs Argo Rollouts *and* kube-prometheus-stack/loki-stack in the same pass. Once
that's live: confirm all 9 services sync healthy (last real check, 2026-07-29, predates both
these merges), confirm planning-service's Rollout actually reaches "stable" instead of stalling
at its first analysis gate, then run the rehearsal for real.

---

## M9.5 — Unity drone simulator — **Stages 0–2 DONE, ahead of previous doc text**

Promoted from side-track to main track (Tony, team lead, 2026-07-26) — see
`UNITY_SIMULATOR_PLAN.md` for full stage detail. Goal: replace/augment `swarmops-drone-simulator`
with a Unity-driven simulator for demo purposes (better visuals + live camera feed), without
changing any downstream contract. Build order locked: data transmission first, graphics second.
**Guy owns this track end to end** — it's a direct replacement/augment of his own
`swarmops-drone-simulator`; Stages 2 and 4 need Valfish's coordination since they land in his
repos/infra, but Guy drives all five stages.

**Status (updated by Guy, 2026-07-29):** the 2026-07-28 file-tree audit below said only Stage 0–2
were shipped and Stage 3 was "not confirmed, optional" — that undercounted it. Stage 0 through
Stage 3 are now all done and verified live (Stage 3 well past "optional cosmetic," see item 4
below for the full detail). Only Stage 4 remains open.

**Prior status (2026-07-28 file-tree audit):** this section previously said Stage 0 was "signed
off, not yet built" — that was stale. Stage 0, Stage 1, and Stage 2 are all shipped:
`swarmops-telemetry-service` has the HTTP ingest route, and `swarmops-unity-simulator` has a
camera-feed WebSocket relay, `FleetSyncManager`, mission markers, and route rendering already in
its tree. Stages 3–4 remain open.

**Guy**
1. Stage 0: `POST /telemetry/events` on `telemetry-service` — schema-validated HTTP route,
   alongside the existing RabbitMQ-consumer path, reached only through the gateway's existing
   `/telemetry` route. **DONE.**
2. Stage 1 (data-only proof): minimal Unity scene, one placeholder object, script POSTs
   telemetry JSON to Stage 0's endpoint on an interval. Done when the real frontend shows a
   drone moving, driven entirely by Unity, with zero changes to planning-service,
   notification-service, or frontend code. **DONE.**
3. Stage 2 (camera feed, only after Stage 1 works; coordinate with Valfish — lands in
   `swarmops-frontend`): `Camera` on the drone object → `RenderTexture` → JPEG frames over a
   separate WebSocket (not RabbitMQ). New small frontend panel to display it. Purely additive.
   **DONE** — camera-feed WebSocket relay present in `swarmops-unity-simulator`.
4. Stage 3 (graphics polish, optional): swap placeholder shapes for a simple drone model/terrain
   once Stage 1 (and optionally 2) work end-to-end. Demo aid, not a game — keep it light. **DONE,
   confirmed by Guy (2026-07-29) — well past "optional cosmetic," a full pass done live over
   2026-07-27/28:**
   - Real correctness fixes found while testing, not cosmetic: adopted (website-created) drones
     were rendering thousands of units off the dressed terrain (wrong projection method — fixed);
     flight speed tuned for demo pacing (`SIMULATION_SPEED_MULTIPLIER` 15 → 0.15 → 1.5, kept in
     parity with `swarmops-drone-simulator`); flight altitude raised 0.6 → 15 units to clear
     terrain buildings; terrain grown 700×700 → 900×900 to match the frontend's valid
     lat/lng-placement range.
   - No-fly-zone/charging-station rendering, route preview for adopted drones, flight feel
     (bank-on-turn, propeller speed, low-battery strobe), atmosphere (sky/fog/rock variation/
     day-night drift), a more realistic drone model (real propeller blades, landing legs, camera
     gimbal, two-tone body — still zero external assets for the drone itself).
   - Terrain decoration switched from pure primitives to real imported models for the one
     deliberate exception to "zero external assets": Kenney's CC0 "City Kit (Commercial)" and
     "Car Kit" for buildings/vehicles, auto-scaled per instance, with a primitive fallback if the
     kit isn't imported yet. 7 distinct landmark clusters plus buildings/cars scattered across the
     *whole* 900×900 terrain (not just clustered near the middle).
   - Two real multi-drone bugs found live and fixed: a frame/tag interleaving race in the camera
     feed protocol (only one of two concurrently-streaming drones' feeds ever rendered), and a
     related relay bug where producer connections received every *other* producer's broadcast
     traffic unread forever, eventually stalling — fixed by making the relay role-aware
     (`swarmops-telemetry-service`). See `swarmops-unity-simulator/STATUS.md` for the full detail.
5. Stage 4 (two-machine demo setup — needs M7's public ALB/gateway already up, coordinate with
   Valfish since that's his infra; last stage, not first): Machine A loads the deployed frontend;
   Machine B runs Unity, POSTs telemetry over HTTPS to the public gateway's `/telemetry/events`
   route (same ALB → gateway path as everything else, no new Ingress rule). Add lightweight auth
   (API key or short-lived `auth-service` token) on that endpoint before it's open to the
   internet. Test Machine B's network path ahead of demo day, not live. **Not started — M7's ALB
   is up now, so this is unblocked; do next if replacing the Node simulator for the actual
   demo.**

**Exit:** frontend shows a drone moving under live Unity control with zero downstream contract
changes (Stage 1 minimum bar) — **met**. Stage 2–4 are stretch within this milestone, not required to move
on to M10 — but Stage 4 must be done before the actual demo if this replaces the Node simulator
for it.

---

## M10 — Demo prep

**Everyone**
1. Walk `plan.md` §4 checklist (security/cost/performance/caching) — one person can answer each cold.
2. Confirm every Argo CD `Application` shows `Synced` + `Healthy`.
3. Tony: seed realistic demo data.
4. Full dry run of demo, including canary-rollback moment.
5. Confirm `terraform destroy` path ready post-demo.

**Exit:** demo runs cold, start to finish, no "this part's still flaky."
