# SwarmOps — Services & Tools Glossary

Short reference: what each piece is for. Full contracts/shapes live in `SwarmOps_PRD.md`;
ownership/sequencing lives in `plan.md`/`milestones.md`. This file is just "what is this thing."

## App services (polyrepo, one repo each)

**frontend** — React/Vite SPA. Live map, mission board, fleet inventory, alerts UI.
Talks only to the gateway, never to services directly.

**gateway** — NGINX. Routes `/auth /fleet /missions /planning /telemetry /notifications`
to their services. Only externally exposed port in the whole stack.

**auth-service** — User accounts, `POST /auth/login` → JWT, roles `planner|operator|admin`.
Every other service verifies that JWT via shared middleware.

**fleet-service** — Owns Drone, NoFlyZone, ChargingStation models. CRUD on static drone
fields; position/battery are telemetry-service's to write, not this service's.

**mission-service** — Owns Mission model: create, list, status. Feeds planning-service
the work items it needs to assign.

**planning-service** — The optimizer core (Python/FastAPI). Assigns drones to missions,
routes them, checks battery feasibility, re-solves on events. Everything else is plumbing
around this.

**telemetry-service** — Ingests drone position/battery events, publishes to RabbitMQ,
writes recent history. Only writer of `Drone.position`/`battery_pct`.

**notification-service** — Stateless fan-out of planning-service's alert/conflict events
to the frontend. No datastore of its own.

**drone-simulator** — Fake fleet that flies each Plan's route on a timer, emits realistic
(varianced) telemetry. Gives re-planning a genuine trigger to react to, not a mock.

## Repos that aren't services

**swarmops** (this repo) — Docs + pitch-deck site. Not a deployable unit.

**swarmops-contracts** — Shared TS/Python types (Drone, Mission, Plan, Alert, etc.) so
services don't drift on field names.

**swarmops-local** — docker-compose for local dev; brings up the whole stack.

**swarmops-deployments** — GitOps repo: Helm chart + per-service image-tag files that
Argo CD watches and reconciles against.

**swarmops-infrastructure** — Terraform for AWS (VPC, EKS, IAM, ECR, add-ons).

## Infra / tooling pieces

**RabbitMQ** — Message bus. Decouples telemetry ingestion and mission/status changes from
planning-service's re-solve loop — event-driven instead of polled.

**MongoDB** (Bitnami chart) — One shared chart dependency, one logical DB per service.

**Helm** — Templates the near-identical Node/Python service Deployments from one parent
chart + `values.yaml`, instead of hand-written manifests per service.

**yq** — CLI YAML editor. CI uses it to bump exactly one service's image tag in its own
`swarmops-deployments/.../images/<service>.yaml` file — never a text replace.

**Argo CD** — Watches `swarmops-deployments`, auto-syncs the cluster to match Git
(self-heal + prune). A deploy is a Git commit; nobody runs `helm upgrade` by hand.

**Argo Rollouts** — Canary deploys for `planning-service` only — it's the highest-risk,
most-iterated service, so it gets progressive delivery instead of a plain rolling update.

**Terraform (+ Terraform Cloud)** — Provisions the EKS cluster/VPC/IAM/ECR. Remote state
+ locking, PR-reviewed plan before every apply, no local apply against shared state.

**ECR** — One image repo per shippable unit. Images tagged `<semver>-<7-char-hash>`,
never `latest`.

**GitHub Actions (OIDC)** — CI per repo: PRs lint/test/build only; pushes to `main`
version-bump, auth to AWS via OIDC (no static keys), build+push to ECR.

**kube-prometheus-stack / Loki + Grafana Alloy** — Metrics and log collection, installed
as their own Argo CD Applications. Feed the "SwarmOps Overview" Grafana dashboard.
