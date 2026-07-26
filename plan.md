# SwarmOps — Build Plan

Source of truth for **what the app does**: `SwarmOps_PRD.md`.
Source of truth for **how it's built, deployed, and graded**: the capstone brief this plan
implements (polyrepo structure, Compose/local-k8s optional, Helm+EKS as the real focus,
Terraform Cloud, GitHub Actions OIDC, Argo CD GitOps, kube-prometheus-stack/Loki observability,
one required extension beyond the floor). This doc is SwarmOps's concrete answer to that brief —
the tools and shape are fixed by the brief; the specifics below are us confirming how they map
onto SwarmOps's actual services.

Everything here is deliberately flexible in *how* (which exact Helm values, which exact alert
thresholds) but not in *what's required* — Helm chart, Terraform on public modules, OIDC-only
AWS auth, GitOps-only deploys, one dashboard, one required extension. If a decision below turns
out to be wrong, change it and update this file — don't silently drift from it.

---

## 0. Decisions locked in before anyone writes code

| Decision | Choice | Why |
|---|---|---|
| Language — auth/fleet/mission/telemetry/notification services | Node.js 20 + TypeScript + Express + Mongoose | CRUD-shaped services, fast to scaffold, one stack for 5 of 6 services keeps cross-service code reusable. |
| Language — planning-service | Python 3.11 + FastAPI | The one service where the algorithm story matters. `scipy.optimize.linear_sum_assignment` gives Hungarian for free; `ortools` has first-class Python support for routing. |
| Message bus | RabbitMQ, via the **Bitnami RabbitMQ Helm chart** as a chart dependency | Lighter than Kafka to stand up correctly; Bitnami chart means we're not hand-rolling a stateful broker. |
| Database | **One Bitnami MongoDB chart dependency**, one logical database per service (auth_db, fleet_db, mission_db, planning_db, telemetry_db) on that single instance | Matches "each service owns its own database" without operating 5 separate stateful Mongo deployments. `notification-service` stays stateless. Revisit if per-service instances turn out cheap enough — not a hard requirement either way. |
| Gateway | NGINX, path-based routing per PRD §3.2, fronted by an ALB via Ingress in the cloud | As specified; ALB/Ingress makes it the only externally reachable thing, matching the brief's "single entrypoint" requirement. |
| Frontend | React + Vite, reusing the pitch site's map primitives (`site/src/components/LiveMap.jsx`, `site/src/lib/geometry.js`) wired to real data | Don't rebuild the animated map from scratch — port it, swap the data source. |
| Live map rendering | Abstract SVG grid, not Leaflet | Faster to build, no tile-provider dependency, matches the pitch deck. |
| Image tagging | `<semver>-<7-char-git-hash>` everywhere, e.g. `1.2.0-a1b2c3d`. **`latest` is never used, anywhere.** | Required by the brief; also just correct practice for GitOps — Argo CD needs a tag that actually changes to detect a new deploy. |
| CI | GitHub Actions, one workflow per app repo. PRs: lint/test/build-validate only, never publish, never touch the cluster. Pushes to `main`: bump `VERSION` + short git hash, OIDC to AWS (no static keys), build, push to that repo's ECR repository. | Per brief. |
| CD | Argo CD, its own Helm release, its own namespace, watching `swarmops-deployments`. Automated sync + self-heal + pruning. An `AppProject` scopes allowed repos/destinations. | Per brief. Nobody runs `helm upgrade` by hand once this is live. |
| GitOps image updates | Per-service image files under `environments/production/images/<service>.yaml` in `swarmops-deployments`, edited only via `yq` by each app's own CI — never a text replace, never a human hand-editing someone else's file. The only identity allowed to bypass `swarmops-deployments`'s branch protection is a scoped bot (GitHub App installation token, not a personal token). | Per brief — this is what makes "every deploy is a Git commit" actually true instead of aspirational. |
| Infra provisioning | Terraform on `terraform-aws-modules/vpc/aws` + `terraform-aws-modules/eks/aws`, connected to a **Terraform Cloud** workspace (VCS-driven runs, remote state with locking). State is never committed to Git. | Per brief. |
| Observability | kube-prometheus-stack + Loki/Alloy, **both installed as Argo CD Applications**, not by hand. One Grafana dashboard ("SwarmOps Overview"). `ServiceMonitor` per service scraping an internal-only `/metrics`. Structured JSON logs, no PII, no user/mission/drone IDs in metric labels. | Per brief. |
| Required extension | **Argo Rollouts, canary strategy on `planning-service`** | This is already load-bearing in the PRD (§3.3): planning-service is explicitly called out as the highest-risk, most-iterated service. The brief requires *some* extension beyond the floor (Argo CD alone) — Argo Rollouts is the natural, already-justified pick rather than bolting on something unrelated. |
| Local dev orchestration | `docker-compose.yml` in `swarmops-local` | Practice milestone, not graded, but still the fastest way to integration-test across services before Phase 4. |

---

## 1. Repository & team structure

Polyrepo, one GitHub org (`SwarM-industries`, already created), one repo per deployable unit —
**not** a monorepo. The existing `swarmops` repo (this plan, the PRD, the pitch site) is *not*
one of these — it's project docs and the pitch deck, not a deployable unit.

Repos to create:

| Repo | Contents |
|---|---|
| `swarmops-frontend` | React/Vite SPA |
| `swarmops-gateway` | NGINX config/image |
| `swarmops-auth-service` | Node/TS |
| `swarmops-fleet-service` | Node/TS |
| `swarmops-mission-service` | Node/TS |
| `swarmops-planning-service` | Python/FastAPI |
| `swarmops-telemetry-service` | Node/TS |
| `swarmops-notification-service` | Node/TS |
| `swarmops-drone-simulator` | Node/TS worker — deployable unit in its own right (a long-running Job/Deployment, not request-driven), gets its own repo/image/Helm template |
| `swarmops-local` | Docker Compose environment wiring all of the above together |
| `swarmops-deployments` | K8s manifests (practice milestone), the Helm chart, Argo CD config (`AppProject`/`Application`), per-service `environments/production/images/*.yaml`, observability config (dashboards, alerts, ServiceMonitors) |
| `swarmops-infrastructure` | Terraform |
| `swarmops-contracts` *(recommended, not brief-mandated)* | Shared data model / event shapes from PRD §6 as actual importable types (npm package for the Node services, a small Python package for planning-service) so "contracts before code" isn't just a convention, it's a dependency |

**Per-repo, non-negotiable, for every repo above:**
- `main` protected: no direct pushes, PR required, at least one approval.
  **Caveat:** GitHub only enforces branch protection on private repos with a paid org plan
  (Team/Enterprise) or on public repos. `SwarM-industries` is currently the free org plan and
  repos are private, so this is enforced by team discipline, not by GitHub, for now — nobody
  pushes directly to `main` regardless of whether GitHub would stop them. Revisit if the org
  ever goes public or upgrades.
  **TEMPORARY OVERRIDE (2026-07-23, until said otherwise):** direct pushes to `main` are
  allowed across all app repos — skip PR/approval for now. Does not apply to
  `swarmops-deployments`'s GitOps bot-only exception below. Delete this note when the team
  reinstates PR-required.
- README describing the repo's purpose (one paragraph — what it deploys, how to run it standalone).
- Appropriate `.gitignore` for its stack (Node vs. Python vs. Terraform vs. Helm).
- Branching convention: `feature/`, `bugfix/`, `hotfix/`.
- Once `swarmops-deployments`' GitOps automation is live, its branch protection's one exception
  (once/if actually enforced by GitHub) is the scoped bot identity making image-bump commits —
  nobody else bypasses it, ever, enforced or not.

**Process tooling (part of the deliverable, not optional):**
- Project management: GitHub Projects (zero extra signup, already in the org) unless the team
  prefers Linear/Jira.
- Team chat: Discord or Slack — pick one, use it for real coordination, not just as a checkbox.

---

## 2. Ownership tracks

Same three tracks as before — the brief's extra rigor changes *how much* is in Track C, not who
owns what.

### Track A — Core Data Services — **Tony**
`swarmops-auth-service`, `swarmops-fleet-service`, `swarmops-mission-service`, gateway routing
config (in `swarmops-gateway`).

### Track B — Algorithm & Live Data — **Guy**
`swarmops-planning-service`, `swarmops-telemetry-service`, `swarmops-drone-simulator`,
`swarmops-notification-service`, the message bus, and the Argo Rollouts canary extension (owns
planning-service end to end including its progressive-delivery story). Also owns the **Unity
drone simulator** (Stages 0–4, `UNITY_SIMULATOR_PLAN.md`) — promoted from side-track to main
track (Tony, 2026-07-26); it's a direct replacement/augment of his own `swarmops-drone-simulator`.
Stage 2 (frontend camera panel) and Stage 4 (public ALB path) still need Valfish's buy-in since
they touch his repos, but Guy drives the track.

### Track C — Frontend & Platform — **Valfish**
`swarmops-frontend`, `swarmops-infrastructure` (Terraform), and the platform pieces of
`swarmops-deployments` (Helm chart skeleton/conventions, Argo CD install + `AppProject`, CI
workflow template, observability stack install). Tony and Guy chart/CI their *own* services
against Valfish's conventions (see Phase 4/6) — Valfish doesn't write every service's Dockerfile.

---

## 3. Phase-by-phase breakdown

Phases 1–3 are the application (PRD §9 phases 1–3). Phase 4 is where the brief's grading focus
starts. Phase 5 is cloud + automation + observability + the required extension.

### Phase 1 — Foundation
*(unchanged from the app-feature plan: greedy assignment, basic CRUD, all services scaffolded and talking through the gateway. See PRD §9 phase 1.)*

- **Tony**: scaffold auth/fleet/mission services, JWT middleware, publish Drone/Mission shapes to `swarmops-contracts`.
- **Guy**: scaffold planning-service, greedy baseline, stand up RabbitMQ locally even before anything publishes to it.
- **Valfish**: port the pitch site's map into a real frontend app, mission board, gateway config, `swarmops-local` docker-compose.

### Phase 2 — Optimization core
*(unchanged: Hungarian matching, OR-Tools routing, battery feasibility, conflict handling. PRD §9 phase 2.)*

- **Guy**: matching → routing → feasibility → conflict handling; lock and publish the `/planning/solve` response shape.
- **Tony**: maintenance/offline states on fleet-service, payload-compatibility fields, notification-service skeleton.
- **Valfish**: fleet inventory view, surface feasibility/conflict flags in the UI, first Helm chart drafts for the services that are stable.

### Phase 3 — Live system
*(unchanged: telemetry-service, drone simulator, WebSocket map, event-driven re-planning. PRD §9 phase 3.)*

- **Guy**: telemetry ingest + publish, drone simulator, planning-service consumes events and re-solves incrementally, notification-service consumes alerts.
- **Tony**: make drone-position ownership unambiguous (telemetry writes position/battery, fleet CRUD only edits static fields), cross-service integration tests now that all 6 services exist.
- **Valfish**: WebSocket wiring, swap the ported `LiveMap`'s fake loop-data for real positions (the animation code itself doesn't change).

---

### Phase 4 — Package it properly (this is where grading starts)

Practice sub-steps (optional, do them if you want the muscle memory, skip if you're already
comfortable):
- Docker Compose locally via `swarmops-local` — gateway is the only thing exposed to the host,
  everything else talks by Compose service name, Mongo gets a named volume, seeding
  (`seed/init-mongo.js`-equivalent) only runs against an empty data directory.
- A local cluster (kind/minikube), raw Deployments/Services/ConfigMaps/Secrets in a dedicated
  namespace, Bitnami MongoDB chart instead of hand-rolled Mongo, seed script as a read-only
  ConfigMap mount, exposed only through the gateway.

**The graded work:**

- **Valfish** — owns the parent Helm chart's *shape*, in `swarmops-deployments/helm/swarmops/`:
  - Declares Bitnami MongoDB and Bitnami RabbitMQ as chart dependencies.
  - Builds one working service template (start with `auth-service`) using `range`/`if`/
    `_helpers.tpl` so it's a template that generates all near-identical services, not five
    copy-pasted manifests — image, replicas, ports, env, and resources all come from
    `values.yaml`.
  - Confirms install/upgrade/rollback/uninstall all work and MongoDB's data survives every one
    of them (this is the actual bar — not "helm install succeeded once").
  - Publishes the `values.yaml` conventions (naming, resource shape) before Tony/Guy add their
    services to it.
- **Tony** — adds `auth-service`, `fleet-service`, `mission-service`, `notification-service` to
  the chart's values (Dockerfiles for each live in their own repos; the chart just references
  the images).
- **Guy** — adds `planning-service` (heavier image — Python + OR-Tools base), `telemetry-service`,
  and `drone-simulator` to the chart. The simulator is a long-running worker, not
  request-driven — it needs a different Helm template shape (Deployment without a Service, or a
  Job, not a ClusterIP-backed Deployment like the rest).

**Sync point:** Valfish's one working template + values.yaml convention exists before Tony/Guy
add their services — six independently-invented chart conventions is worse than one imposed
late.

---

### Phase 5 — Cloud infrastructure, delivery automation, observability

- **Valfish**
  - Terraform in `swarmops-infrastructure`: VPC + EKS via `terraform-aws-modules/vpc/aws` and
    `terraform-aws-modules/eks/aws`. Connect to a Terraform Cloud workspace — VCS-driven runs,
    remote state with locking, state never in Git. Provisions VPC (public/private subnets, NAT,
    routing), EKS control plane + node group, one ECR repo per component (9 repos — one per
    deployable unit above, minus `swarmops-local`/`swarmops-infrastructure`/`swarmops-contracts`/
    `swarmops-deployments`, none of which ship images), IAM (cluster role, node role, EBS CSI
    permissions), core add-ons (VPC CNI, CoreDNS, kube-proxy, EBS CSI driver). No application
    workload during this step.
  - Installs AWS Load Balancer Controller; Ingress/ALB in front of the gateway is the only
    externally reachable thing.
  - Installs Argo CD as its own Helm release in its own namespace; writes the `AppProject`
    (scoped repos/destinations) and the top-level `Application` (points at the chart + all
    values files, automated sync/self-heal/prune).
  - Installs kube-prometheus-stack and Loki/Alloy, **each as its own Argo CD Application**.
    Builds the "SwarmOps Overview" Grafana dashboard (node/pod health, request rate, error rate,
    latency) and the baseline Alertmanager alerts (service down, replicas unavailable,
    crash-looping, high error rate) — provisioned from Git, not clicked together.
  - Writes the reusable GitHub Actions workflow template (parameterized per service: lint/test/
    build-validate on PRs; version+OIDC+build+push+`yq`-edit-the-image-file on `main`) that
    Tony/Guy copy into their own service repos.
- **Guy**
  - Argo Rollouts install + canary `Rollout` resource for `planning-service` specifically:
    traffic-split steps, analysis template, automated rollback trigger. This is the required
    extension — be ready to explain at demo why it's planning-service specifically (highest
    blast radius: it's the optimization core, and it's the service most likely to get iterated
    on right up to the deadline).
  - Instruments `planning-service`'s `/metrics` (solve time, conflict rate, assignment quality
    vs. greedy baseline — PRD §8) and wires its own `ServiceMonitor`.
  - CI workflows (from Valfish's template) for planning-service, telemetry-service,
    drone-simulator, notification-service — each edits only its own image file in
    `swarmops-deployments`.
  - **Unity drone simulator** (main track now, not a side branch — see
    `UNITY_SIMULATOR_PLAN.md` and `milestones.md` M9.5): Stage 0 (generic ingest endpoint on his
    own `telemetry-service`), Stage 1 (data-only proof), Stage 2 (camera-feed panel — lands in
    `swarmops-frontend`, needs Valfish's coordination), Stage 3 (graphics polish), Stage 4
    (two-machine demo — needs this phase's ALB/gateway path already up, so it's last, not
    first).
- **Tony**
  - CI workflows for auth/fleet/mission-service from Valfish's template.
  - `/metrics` instrumentation + `ServiceMonitor` for his four services.
  - Seed data for the live demo across all services; cross-repo integration pass now that the
    whole pipeline (build → ECR → Argo CD → cluster) is live.

**End-of-project demo:** push a commit → CI builds/tags/pushes to ECR and `yq`-bumps the image
file → Argo CD reconciles the cluster automatically → Grafana/Loki show it healthy → ship a bad
`planning-service` build and watch the canary catch it and roll back, live.

---

## 4. Pre-demo checklist — think about these, be ready to answer them

Not extra tasks, lenses on what's already built. Assign an owner for "can answer this cold" even
if the work is shared:

- **Security** — where do credentials actually live (K8s Secrets vs. Terraform Cloud vars vs. GH
  Actions secrets)? Is anything sensitive ever committed or logged? Does every AWS auth path
  (CI, Argo CD if it needs AWS access, the cluster itself) use OIDC/IRSA, never static keys? Do
  IAM roles and K8s RBAC follow least privilege? Is anything more exposed than it needs to be —
  Grafana open with no auth, a backend service reachable outside the cluster?
- **Resources and cost** — do Deployments set requests/limits or run unbounded? What's actually
  costing money (node types, EBS volumes, the ALB, NAT gateways) and could it be smaller for a
  demo-only cluster? Is there a real `terraform destroy` teardown path? Would the setup survive
  a node or pod dying, or is everything a single replica?
- **Performance** — what's actually been measured (latency, throughput) vs. assumed? Where's the
  slowest hop (likely: planning-service's solve time under load)? Do the Grafana dashboards say
  anything beyond "is it up"?
- **Caching** — is anything recomputed that doesn't need to be? Candidates specific to SwarmOps:
  planning-service re-deriving a distance matrix every solve instead of caching it per fleet
  snapshot; the frontend re-fetching fleet/mission state on a poll instead of relying on the
  WebSocket push it already has. Worth a Redis/ElastiCache layer, or is it premature here?

---

## 5. Working in parallel without stepping on each other

- **Contracts before code.** The moment two tracks need the same shape, the owning service
  writes it down (ideally as an actual `swarmops-contracts` type, not just a comment) before the
  consumer builds against it.
- **`swarmops-local`'s docker-compose is the integration point through Phase 3.** Nobody
  integration-tests against someone else's laptop.
- **Every service is a Dockerfile from day one** in its own repo — Phase 4 is about Helm/Terraform/CD, not "finally containerize."
- **PRs only, everywhere, always** — including `swarmops-deployments` once GitOps is live, where
  the only exception is the scoped bot identity making image-bump commits.
- **Weekly sync on contract changes, not a daily standup** — three people, deliberately
  independent tracks, don't need process overhead beyond "sync point changed, tell the other two."
