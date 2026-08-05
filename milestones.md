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
service` was the one exception at that point — blocked on M9 (no Prometheus yet for its canary
`AnalysisTemplate`) plus a real bug on top: its "stable" ReplicaSet referenced an image tag that
no longer existed (predated the ECR fix), leaving zero working stable replicas.

**Both resolved since.** Guy fixed planning-service 2026-07-30 by re-triggering its publish job
([`swarmops-planning-service@ad2d1aa`](https://github.com/SwarM-industries/swarmops-planning-service/commit/ad2d1aa)),
which built and pushed a real image and bumped `swarmops-deployments` to a tag that actually
exists. Valfish then brought `infra/cluster` back up and verified the whole stack live on
2026-08-01: **all 9 services healthy** (including planning-service), M9's observability stack
synced, and the canary rollback rehearsal passed for real against a deliberately broken image —
so blocker #4's "re-confirm the sync post-bot-token-fix" is closed too, against real
CI-produced images rather than hand-bumped tags. Full detail in `swarmops-deployments/STATUS.md`'s
"M9 verified live end-to-end, 2026-08-01" entry.

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
   (`swarmops-deployments/argocd/`) — **installed and syncing for real since 2026-07-29**, and as
   of 2026-08-03 the bootstrap itself is automated via `infra/cluster`'s Terraform rather than
   run by hand (see the M9 update below). Also had to convert the chart's `services:` from a list to a map
   (`values.yaml`/`values-aws.yaml`/`templates/service.yaml`) so Argo CD's per-service value-file
   overrides merge safely — Helm's multi-file merge replaces lists wholesale but deep-merges maps.
   All 9 `environments/production/images/<service>.yaml` files exist to match. Full writeup in
   `swarmops-deployments`'s STATUS.md.

**Not done / current blockers:**
1. ~~AWS trust-policy failure~~ — **FIXED, confirmed live 2026-07-29** (see above).
2. ~~`DEPLOYMENTS_BOT_TOKEN` value bad~~ — **FIXED, confirmed live 2026-07-30** (see above). Was
   never the value — Free-org-plan org-secret-to-private-repo limitation. Fixed via per-repo
   secrets/vars on all 9 service repos.
3. ~~planning-service not healthy on the live cluster~~ — **FIXED, verified live 2026-08-01.**
   Guy re-triggered its publish job (`ad2d1aa`) so the stable ReplicaSet points at an image tag
   that exists; M9's Prometheus landed in parallel, unblocking the canary `AnalysisTemplate`.
4. ~~Re-confirm Argo CD sync post-bot-token-fix~~ — **DONE, verified live 2026-08-01** by Valfish,
   against real CI-produced images rather than hand-bumped tags. All 9 services healthy.
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

**Update 2026-08-03 (Tony):** the "re-run `argocd/README.md`'s bootstrap" step above is now
automated, in two stages after two false starts:

**Read this part first — the debugging story below is mostly a record of a wrong diagnosis, kept
because the wrong version is written into several commit messages.** Every
`Object 'Kind' is missing in '{"404":"Not Found"}'` error in this saga had one cause:
`swarmops-deployments` is a **private** repo, so fetching its `argocd/*.yaml` manifests from
`raw.githubusercontent.com` without an `Authorization` header returned GitHub's plain-text
`404: Not Found` body — which is *valid YAML*, parsing to the map `{"404": "Not Found"}`. That
sailed through `data.http` and was handed to `kubectl_manifest` as the manifest, which then
correctly complained it had no `kind`. **The failure was in parsing `yaml_body`, before any
cluster call** — nothing to do with CRDs, Argo CD, ordering, or the provider. Fixed in
[436a5a6](https://github.com/SwarM-industries/swarmops-infrastructure/commit/436a5a6) by fetching
through `api.github.com`'s contents endpoint with a token, plus a status-code postcondition so a
failed fetch now names the file and HTTP status instead of silently becoming a garbage manifest.

Sequence of attempts, with what each one actually proved:

1. Folded everything into `infra/cluster/argocd.tf`
   ([f5b69a5](https://github.com/SwarM-industries/swarmops-infrastructure/commit/f5b69a5)):
   `helm_release` for Argo CD + `kubectl_manifest` for all 6 manifests. Failed at `terraform
   plan`. Misread as a CRD-doesn't-exist-yet problem.
2. `apply_only = true`
   ([ff341f8](https://github.com/SwarM-industries/swarmops-infrastructure/commit/ff341f8)): no
   effect — that flag only affects delete behavior. (True, but irrelevant to the real cause.)
3. Two-phase `terraform apply -target=...` wrapper (`apply.sh`,
   [63f8fe0](https://github.com/SwarM-industries/swarmops-infrastructure/commit/63f8fe0)):
   rejected outright — **the `swarmops-infrastructure` TFC workspace enforces VCS-driven-only
   applies**, so CLI `apply` (targeted or not) fails with "Apply not allowed for workspaces with a
   VCS connection". This finding *is* real and worth remembering.
4. Split into two workspaces
   ([4d6937b](https://github.com/SwarM-industries/swarmops-infrastructure/commit/4d6937b)):
   `infra/cluster` keeps Argo CD + the repo-read Secret; new `infra/argocd-apps/` module + TFC
   workspace `swarmops-argocd-apps` (created via the TFC API) holds the 6 `kubectl_manifest`
   resources, sequenced by a **run trigger** off `infra/cluster`. Built on the wrong premise, but
   **kept** — it expresses a genuine ordering requirement cleanly and costs no manual sequencing.
   Correction recorded in
   [b90ce48](https://github.com/SwarM-industries/swarmops-infrastructure/commit/b90ce48);
   collapsing back to one workspace is a valid future simplification, not a bug fix.
5. Separately real, found and fixed along the way
   ([3523c46](https://github.com/SwarM-industries/swarmops-infrastructure/commit/3523c46)):
   `helm_release.argocd` applied *in parallel* with `lb-controller.tf`'s release and failed with
   "no endpoints available for service aws-load-balancer-webhook-service". The AWS LB controller's
   chart installs a cluster-wide `MutatingWebhookConfiguration` intercepting **every** Service
   creation, so Argo CD's own Services were rejected before that webhook's pod was serving. Fixed
   with `depends_on` (no `time_sleep` needed — `helm_release`'s default `wait=true` already means
   "complete" implies ready). Argo CD's release had to be force-replaced afterward, since it was
   left in a `failed` Helm status that a normal apply saw as no-diff.

**Prerequisites, both now satisfied:**
- `swarmops-argocd-apps` assumes the same `swarmops-terraform-cloud` role via Dynamic Credentials;
  its trust policy is scoped by `sub` per workspace. **Valfish added `swarmops-argocd-apps` as a
  third exact entry** (deliberately not a `swarmops-*` wildcard — that would trust any future or
  mistyped workspace name with AdministratorAccess). Verified live 2026-08-03.
- Two sensitive TFC variables, both set by Tony: `argocd_deployments_repo_token` on
  `infra/cluster`, and `deployments_repo_token` on `swarmops-argocd-apps` (same PAT value; the
  second is what the authenticated manifest fetch needs).

**State as of 2026-08-03:** both workspaces have **applied successfully**. `infra/cluster` has
Argo CD installed and healthy (its `argoproj.io/v1alpha1` CRDs confirmed registered via a direct
API query — `AppProject`, `Application`, `ApplicationSet` all present). `swarmops-argocd-apps`
applied all 6 objects: the `swarmops` and `argo-rollouts` AppProjects, and the `swarmops`,
`kube-prometheus-stack`, `loki-stack` and `argo-rollouts` Applications.

**NOT yet verified — do not treat this milestone as closed:** "applied" only proves the objects
exist, not that Argo CD synced them or that any workload is running. Nobody has yet run
`kubectl get applications -n argocd` (want all 4 `Synced`/`Healthy`) or `kubectl get pods -n
swarmops`. Neither Tony nor his Claude session can: per `eks.tf`'s `access_entries` the only
humans with cluster access are **Guy** (`Guy-1`, Edit, scoped to the `swarmops` namespace only)
and **Valfish** (`Harel-1`, cluster-admin) — Tony has no access entry at all, and his local `aws`
CLI resolves to a different personal account (see `[[feedback_aws_account_mismatch]]`). Guy was
pinged on Discord 2026-08-03 for the `swarmops`-namespace check; the `argocd`/`monitoring`
namespace checks need Valfish.

**Actual next step:** get those two `kubectl` checks run. Then confirm all 9 services are healthy
(last real check 2026-07-29, predating the canary/observability merges *and* this whole automation
effort), confirm `planning-service`'s Rollout reaches "stable" rather than stalling at its first
analysis gate — note its stable ReplicaSet previously pointed at a deleted ECR tag, with a fresh
`0.1.0-ad2d1aa` pushed to clear it — then run the canary rehearsal for real.

### Update, later on 2026-08-03 (Tony) — cluster verified for real; API live, **SPA is broken**

Supersedes the "NOT yet verified" block above for the `swarmops` namespace. Valfish created a
dedicated `Tony-1` IAM user (`infra/persistent/tony-iam.tf`) plus a cluster-wide **read-only**
EKS access entry (`tony_view`, `AmazonEKSViewPolicy`, `infra/cluster/eks.tf`) — so the
"Tony can't inspect the cluster" blocker above is gone. Note the IAM policy grants only
`eks:DescribeCluster` on the `swarmops` cluster, so `aws eks list-clusters` is denied by design;
use `--name swarmops` directly. Access is View, so **no `rollout restart`, `exec`, or
`port-forward`** — inspection only, deliberately (see that file's comment).

**All 16 pods in `swarmops` are `Running`/ready**, and the ALB is internet-reachable at
`k8s-swarmops-gateway-3b08f79c2f-1927114502.us-east-1.elb.amazonaws.com` (auto-generated, changes
on every `infra/cluster` destroy/apply — never hardcode it). Guy's Unity simulator is driving real
traffic through it right now, all 200s.

**But `GET /` — the actual UI — returns 504 after exactly 60s.** Everything else is fine:
`/healthz` 200 in 0.58s, and `/fleet/*`, `/missions`, `/planning/*`, `/telemetry/*`, `/auth/*` all
200/201 and fast. So "all 9 services healthy" is true pod-wise but **misleading about the demo
URL** — the one page you'd put in front of a stakeholder is the one that doesn't load.

nginx's own error log names the cause precisely:
`upstream timed out (110: Operation timed out) while connecting to upstream, upstream:
"http://172.20.215.99:80/"` — the frontend Service's ClusterIP. DNS resolves correctly, then the
TCP connect times out. Ruled out, all verified live: frontend pod ready with **0 restarts** and
serving 200s to kubelet probes every 5s; EndpointSlice correct and `ready: true` →
`10.1.31.228:80`; Service ports `80→80`; no NetworkPolicy on frontend (only mongo/rabbitmq have
one); **not the node** (planning-service has a pod on frontend's exact node, 62/62 200s); **not
the high-IP/secondary-ENI range** (planning's `10.1.30.103` is that same range on that same node,
ready and serving); kube-proxy/aws-node/coredns all healthy with 0 restarts. **Decisive fact: the
frontend pod received zero non-probe requests in 40 minutes** — the gateway's packets never
arrive, dropped between the ClusterIP DNAT and the pod. Every declarative object is correct, so
this looks like stale datapath state (conntrack/iptables) on the gateway's node rather than a
config error. **Flagged to Guy on Discord** (he has Edit in `swarmops`); first thing to try is
`kubectl rollout restart deployment/swarmops-frontend -n swarmops`, then the gateway if that
doesn't clear it.

**Still genuinely unverified:** `kubectl get applications -n argocd`. `AmazonEKSViewPolicy` covers
built-in resources only, **not CRDs** — `applications.argoproj.io` is forbidden for `Tony-1`, so
the Argo CD sync confirmation still needs Valfish's cluster-admin. Same for anything in
`monitoring`.

**Also observed:** Prometheus scraped the gateway's `/metrics` 158 times in 40 minutes, every one
a 499. That's the known "`frontend`/`gateway` don't serve `/metrics`" gap (documented as accepted
out-of-scope in `swarmops-deployments/STATUS.md`) now showing up as continuous scrape failures —
worth having an answer ready before demoing the Grafana dashboard, since two targets will be
visibly down.

### Update 2026-08-04 (Tony) — SPA 504 fixed, Argo CD check finally run, mock presentation prep

**Yesterday's blocker is gone — permission widened, undocumented.** `OBSERVABILITY_ACCESS.md`/the
2026-08-03 entry above both said Tony-1 is `AmazonEKSViewPolicy`, cluster-wide **read-only**, CRDs
forbidden. Live test today: `kubectl auth can-i create/patch/delete "*" "*" -A` → **all yes**,
server dry-run create/rollout-restart both succeeded for real. Tony-1's k8s RBAC is effectively
cluster-admin now, not View. **Confirmed deliberate by Tony (team lead), 2026-08-05** — not an
accidental access-entry change. Note this is *k8s RBAC only* — the separate AWS IAM identity
behind it still can't `eks:ListNodegroups` / `eks:UpdateNodegroupConfig` (see below), so it's not
a blanket AWS-level admin grant.

**`kubectl get applications -n argocd` — run for real, first time:**

| App | Sync | Health |
|---|---|---|
| `swarmops` | Synced | Healthy |
| `argo-rollouts` | Synced | Healthy |
| `loki-stack` | Synced | Healthy |
| `kube-prometheus-stack` | Synced | **Degraded** (see below) |

**SPA 504 — root cause confirmed, fixed live.** Exactly the symptom and cause from 2026-08-03
(stale conntrack/iptables datapath between gateway's node and frontend's ClusterIP, not a config
error — every declarative object was correct). Fix was the first thing flagged to Guy yesterday:
`kubectl rollout restart deployment/swarmops-frontend -n swarmops`, then
`deployment/swarmops-gateway` for the same reason. Both rolled out clean. Verified:
`GET /` now **200 in 0.34s** (was 504 after 60s). Frontend now reachable at
`http://k8s-swarmops-gateway-3b08f79c2f-1927114502.us-east-1.elb.amazonaws.com/` (ALB DNS, changes
on next `infra/cluster` destroy/apply — don't hardcode it anywhere durable).

**New bug found: `kube-prometheus-stack` stuck Degraded — pod-density ceiling again, different
shape than M9's.** Not the M9 "aggregate memory/pod-count" version — this time it's an **AZ +
per-node packing deadlock**: 4 nodes (t3.medium, 17-pod ENI cap each), 2 per AZ
(`us-east-1a`/`us-east-1b`). 3 of 4 nodes sit at 17/17 (full); the one node with room
(`ip-10-1-16-233`, `us-east-1b`) is the wrong AZ for Grafana's `gp3` PV (pinned `us-east-1a` via
node affinity, RWO). New Grafana pod from a triggered rollout can't schedule anywhere → stuck
`Pending` 14+ min, `Degraded` Application status. **Not demo-blocking**: old Grafana pod (`1/1
Running`, pre-rollout revision) still serves the dashboard fine, zero functional impact, just a
stuck extra pod and a red status flag in Argo CD.

Real fix is the same class as M8/M9's earlier version — add a 5th node (`desired_size` 4→5,
`aws eks update-nodegroup-config`, module already has `lifecycle.ignore_changes` on it so this
survives the next `terraform apply` same as before). **Tony-1 cannot run this** —
`eks:ListNodegroups`/`eks:UpdateNodegroupConfig` denied, a separate AWS IAM permission from the
k8s RBAC widening above; the k8s API server doesn't gate node-group scaling, only AWS IAM does.
Needs Valfish (cluster-admin) or a `node_desired_size` bump in
`swarmops-infrastructure/infra/cluster/variables.tf` through the normal PR → TFC plan → apply path.
Left as-is for now since it's not blocking tomorrow's mock presentation.

### Update 2026-08-04, continued (Tony) — RabbitMQ reconnect-on-drop, real health checks, camera backpressure, map-bounds validation

Root cause from the frozen-drone/empty-alerts incident above (RabbitMQ pod rescheduled at
`09:19:17`, none of the plain-`amqplib` services ever recovered) is now actually fixed, not just
worked around by a manual restart:

- **`fleet-service`, `notification-service`, `telemetry-service`** — each now handles
  `connection.on("close"/"error")` and re-runs its full connect+bind+consume setup instead of
  sitting silently dead forever. `planning-service` needed **no fix** — it already uses
  `aio_pika.connect_robust`, which auto-reconnects and restores consumers on its own; the manual
  restart I gave it earlier in this incident was unnecessary caution, not a real fix for a real
  problem there.
- **`/health` on all three now reflects real RabbitMQ connection state** (was an unconditional
  `200` on all three) — so kubelet's own liveness probe can now actually catch a stuck reconnect
  and restart the pod as a backstop, instead of a dead consumer being invisible to Kubernetes
  forever.
- **`telemetry-service`'s camera relay (`cameraFeed.ts`) now has a backpressure guard** —
  `client.send()` was unconditional, so a viewer that can't drain frames as fast as Unity produces
  them queued them in-process memory unbounded. This was the *actual* OOM root cause, not just
  the undersized memory limit fixed earlier (`swarmops-deployments#3`) — that bump bought
  headroom, this fixes the real design gap. Frames now drop for a client past a 4MB buffered
  threshold instead of queueing forever.
- **Validated live, by accident**: right after deploying these three fixes, RabbitMQ's pod got
  rescheduled *again* (apparently a side effect of an Argo CD hard-refresh touching the whole
  `swarmops` Application, which includes the RabbitMQ chart dependency — avoid hard-refreshing
  unless needed). All three freshly-deployed pods hit the exact failure mode this fix targets in
  real time: connection dropped, reconnect attempted, genuinely failed while RabbitMQ was down,
  `/health` correctly reported `503`, kubelet restarted them, they reconnected clean once RabbitMQ
  was back. Self-healed with zero manual intervention — the loop this incident was missing.

**Also fixed, same incident/day:**
- **Mission deadline had no sane-range validation** (`swarmops-frontend`,
  `CreateMissionDialog.tsx`) — a mistyped year (`1111` instead of `2026`) submitted a mission
  centuries overdue with no error anywhere; this is exactly how the original "afaf" test mission
  got its garbage deadline. Now rejects non-future dates client-side, plus a `min` on the
  datetime-local input itself.
- **Charging-station/no-fly-zone map-bounds validation was missing entirely** on the charging
  station dialog, and only checked literal `(0, 0)` on the no-fly-zone one. `OperationalView`'s
  auto-fit bounds are expand-only and never shrink back, so *any* out-of-range point (not just
  Null Island) permanently stretches the whole map and squashes every real drone into a corner —
  found live when a charging station landed at `(0, 0)` via a `Number("") === 0` frontend gotcha.
  Fixed in three places: `swarmops-frontend`'s `CreateChargingStationDialog.tsx` (Tony) and
  `CreateNoFlyZoneDialog.tsx` (Guy, same day, picked up independently after a Discord ping), plus
  **`swarmops-fleet-service`'s `POST /fleet/charging-stations` and `POST /fleet/no-fly-zones`**
  (Guy) — the server-side check is the one that actually matters, since nothing stops a client
  other than this frontend from submitting a bad value the same way.
- **Charging station seeded** — none existed on the live cluster; "North Base Charge Point"
  (`32.75, 35.0`, operational) added near the patrol test zone.

**New known gap, found investigating "why doesn't a low-battery drone on a regular mission go
charge itself" — not a bug, a missing feature:** `planning-service`'s `_on_telemetry_trigger`
(`src/main.py:16-28`) only runs the low-battery hand-off (`handle_patrol_low_battery`) for drones
on **active patrol duty**. A drone flying a regular Mission `Plan` gets no automatic low-battery
handling at all — the generic `run_solve()` re-solve that also fires doesn't touch it either,
since a mission-assigned drone is never "idle" and so is outside `run_solve()`'s own assignment
pool, same as a patrol drone. `POST /fleet/drones/{id}/charge` (`routes/charge_orders.py`) exists
as a **manual** path an operator can trigger by hand, but nothing does it automatically for a
mission (only for a patrol). Not fixed — a scope decision, not a bug, but worth having an answer
ready if it comes up live: "patrols self-heal on low battery, missions currently need a human to
send the drone to charge."

**Follow-up, not built (Tony's request, 2026-08-04) — camera feed has no staleness/lag detection.**
Checked `cameraFeed.ts`: frames relay blind today — no per-frame timestamp, no age check, no
distinction between "quiet feed" and "frozen/dead feed." Two real gaps, worth splitting:

1. **Staleness (is this frame even recent?).** `CameraFeedStreamer.cs` self-tags each frame
   inline already (per `cameraFeed.ts`'s own header comment on the producer/consumer tagging
   scheme) — add a producer-side timestamp to that tag. Consumer (frontend) computes
   `now - frame_timestamp` and shows a "feed stale" indicator past some threshold (e.g. 2s) instead
   of silently displaying a frozen last frame with no visual cue anything's wrong.
2. **Lag under real backpressure.** The `bufferedAmount` guard added today (telemetry-service,
   `a0ca1a1`) fixes the OOM by *dropping* a frame for a client that's fallen behind — but it's
   still strict FIFO otherwise, so a client that's behind stays behind, accumulating visible lag
   over time rather than catching back up. A "latest-frame-wins" relay policy (drop everything
   queued except the newest frame when a client is behind, instead of relaying the backlog in
   order) would keep the feed visually live under real packet loss/lag instead of playing catch-up
   in slow motion. Standard pattern for live video relays; not implemented anywhere in this repo
   today.

Both are `swarmops-telemetry-service`/`swarmops-unity-simulator` (Guy's + Tony's shared surface,
frontend needs the staleness indicator too) — flag before the actual demo defense if the camera
feed is a focal point, not required for tomorrow's mock run.

**Follow-up, not built (Tony's request, 2026-08-04) — real domain instead of the raw ALB DNS
name.** Comes up every apply/destroy cycle: the ALB is created out-of-band by the AWS Load
Balancer Controller reacting to the Ingress, not tracked in Terraform state, so a fresh `apply`
gets a brand-new random hostname every time — nothing to hardcode anywhere.

Real fix, not a workaround: **`external-dns`** — a k8s controller that watches the Ingress and
auto-syncs a Route53 record to whatever the current ALB hostname is, on every apply. Survives
destroy/apply cycles with zero manual re-pointing. Same architectural pattern already in this repo
(IRSA role, like the LB controller has).

Decided: **team already owns a domain** — delegate a subdomain (e.g. `demo.<theirdomain>`) to a
new Route53 hosted zone rather than registering a fresh one (saves the ~$12-15/yr registration
cost, only the ~$0.50/mo hosted zone). Needs:
1. NS delegation at the registrar (one-time, outside Terraform) pointing the subdomain at a new
   Route53 hosted zone.
2. New Terraform for the hosted zone — belongs with `infra/persistent` (never-destroy class,
   same as ECR/OIDC), not `infra/cluster`.
3. ACM cert, DNS-validated against that zone (free).
4. `external-dns` Helm chart + its own IRSA role scoped to `route53:ChangeResourceRecordSets` on
   just that zone — new Application in `swarmops-deployments`, same pattern as
   kube-prometheus-stack/Argo Rollouts.

**Decision (2026-08-04 night): documented follow-up, not built tonight** — real infra addition
(new AWS resources, new IAM role, new Argo CD Application, one Terraform apply into
`infra/persistent`) right before the mock presentation wasn't worth the risk that night.

**Update 2026-08-05 (Tony) — built and applied, superseding the above.** Valfish built this the
next day: `aws_route53_zone.swarmops_demo` + `aws_acm_certificate.swarmops_demo` (DNS-validated)
in `infra/persistent/domain.tf` for `swarmops.harelvalfish.dev` (delegated subdomain of Harel's
own domain, not a fresh registration — team chose this over Tony's domain), plus the
`external-dns` IRSA role in `infra/cluster/external-dns.tf`. Confirmed live via Terraform state:
zone `Z06348013MIG7SM2C8BSU`, cert validated, both resources under `prevent_destroy`. **NS
delegation confirmed live by Valfish, night of 2026-08-04/05** (via Discord) — the one manual,
outside-Terraform step is done. He also reports wiring `external-dns` into
`infra/argocd-apps`'s manifest list — it existed in `swarmops-deployments` but was never actually
hooked into the automated bootstrap, so it wouldn't have applied on its own; fixed same session.

**For tomorrow's mock presentation:** app is demo-ready — all 16 `swarmops` pods healthy, ALB
reachable, frontend now actually loads (`GET /` 200). Known non-blocking gaps to have an answer
ready for if asked: Grafana `Degraded` status (above, cosmetic), `frontend`/`gateway` `/metrics`
499s (documented, accepted out-of-scope since M9), plaintext secrets in `values.yaml` (per
`PRESENTATION_PLAN.md`'s "what is not done" sheet).

**M10 item 3 ("seed realistic demo data") — done, minimally.** Live cluster had zero users, no
login possible. `swarmops-local/seed/seed.ts`'s demo creds (`demo-admin@swarmops.internal` /
`demo-admin-password`) were never applied to the cloud cluster — only ever ran against local
compose. Registered directly via `POST /auth/register` against the live ALB (role `admin`),
confirmed `POST /auth/login` returns a real JWT. **Fleet/mission state checked separately** (`GET /fleet/drones`, `GET /missions` against the live
ALB, authenticated): 1 drone exists (`Unity-Sim-1`, from Guy's simulator driving live traffic —
not seeded data), **0 missions**. Board will look empty on login until missions are created —
either through the UI before the run-through, or by pointing `swarmops-local/seed/seed.ts` at the
live ALB instead of compose's gateway.

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
   internet. Test Machine B's network path ahead of demo day, not live. **DONE (2026-08-05,
   confirmed by Tony)** — two-machine setup working: app deployed on cloud (EKS/ALB), Unity
   running on a separate machine, telemetry flowing over HTTPS through the public gateway.

**Exit:** frontend shows a drone moving under live Unity control with zero downstream contract
changes (Stage 1 minimum bar) — **met**. Stage 2–4 are stretch within this milestone, not required to move
on to M10. **All five stages now done.**

---

## M10 — Demo prep

**Everyone**
1. Walk `plan.md` §4 checklist (security/cost/performance/caching) — one person can answer each cold.
2. Confirm every Argo CD `Application` shows `Synced` + `Healthy`.
3. Tony: seed realistic demo data.
4. Full dry run of demo, including canary-rollback moment.
5. Confirm `terraform destroy` path ready post-demo.

**Exit:** demo runs cold, start to finish, no "this part's still flaky."

**Update 2026-08-03 (Tony) — defense deck planned, not built.** `PRESENTATION_PLAN.md` (repo
root) holds the full plan for a self-contained HTML slide deck for the capstone defense, built
via the `frontend-slides` plugin skill. Locked: 16 sheets, platform/DevOps-heavy with a real
optimizer section, inline browser editing on, and a custom visual system ("Stealth Dossier" —
five revisions, the last one is what's locked; the plugin's own 12 presets were all rejected as
not technical enough). Content sourced from `SwarmOps_PRD.md`, this file, `SERVICES.md` and
`TALK_TRACK_GUY.md` — nothing invented, but **every figure on the evidence/infra/gaps sheets
still needs a cross-check against those sources before the deck is shown to anyone**.

Two things the next session needs to know: the plugin is currently **disabled** in
`~/.claude/settings.json` (`"frontend-slides@frontend-slides": false`), so the Skill tool can't
invoke it — the plan follows `SKILL.md` from the marketplace path directly. And the plan
deliberately includes a **"what is not done" sheet** (plaintext secrets in `values.yaml`, the
`GET /` 504 on the demo URL, gateway/frontend `/metrics` 499s, Argo CD sync still unconfirmed) —
per `TALK_TRACK_GUY.md`'s position that these are gaps to own rather than hide. If the team
disagrees, that's one sheet to cut, flagged in the plan.

`presentation.html` itself is **not built** — the plan is the deliverable at this point.

**Superseded 2026-08-06.** `presentation.html` (and a per-person working copy,
`presentation.tony.html`) now exist and have real commits (layout/responsiveness/content
passes) — the deck moved from "planned" to "actively being built" sometime after the note above.
Note above kept for the plan's own content/rationale, which is still accurate; only the "not
built" status line was stale.

**Update 2026-08-06 — mock-presentation bug fixed: low-battery mission hand-off didn't
reassign, plus charging-station capacity dropped.** Mock presentation (2026-08-05) surfaced a
real gap: a mission drone going low-battery mid-flight correctly got pulled off its mission and
routed to a charging station, but the vacated mission never got reassigned to a new idle drone.
Root cause and fix live in `swarmops-planning-service/STATUS.md`'s own 2026-08-06 entry and
`M10-addons.md` (this repo's root) — short version: `src/reconcile.py`'s 30s polling backstop
(the only low-battery trigger that reliably fires in the live cluster) was missing the trailing
`run_solve()` call that the RabbitMQ event path already had. Fixed, plus two concurrency/
correctness issues an independent review caught before the fix shipped (a potential no-op solve
storm, and an unguarded multi-replica race on `run_solve()` — now behind a short-lived Mongo
lock). `swarmops-planning-service`'s `pytest` suite grew three regression tests, 8/8 green.

Second, unrelated fix bundled in the same pass: charging-station `capacity` is no longer
required/enforced anywhere (team decision — "assume infinity"; it was already unenforced
everywhere in the backend, just still a required input on creation). Touched
`swarmops-fleet-service` (schema + route, plus its first-ever test suite — was at zero test
tooling before this), `swarmops-frontend` (removed the now-meaningless input from the
create-station dialog), `swarmops-local` (seed data), and `swarmops-contracts` (doc-only, not an
actual dependency of any service).

M10 item 4 ("full dry run, no flaky parts") — this was the flaky part found during that dry run.
Not yet re-confirmed with a second full dry run post-fix.
