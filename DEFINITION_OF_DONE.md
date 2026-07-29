# SwarmOps — Definition of Done

Final checklist from the capstone brief. Check off before demo.

**Synced against `milestones.md` + each repo's `STATUS.md` (Guy, 2026-07-29)** — this file had
never been updated since it was first written; every box was still unchecked regardless of real
progress. Checked boxes below are things confirmed done and verified live, not just "code
exists." Where something is written/ready but not yet actually running, it stays unchecked with
a note explaining exactly what's blocking it — a checklist that just says "not done" with no
context isn't more honest, just less useful.

## Repo & team setup
- [ ] All repos: protected `main`, README, `.gitignore`, `feature/bugfix/hotfix` branches —
      README/`.gitignore` done everywhere, but branch protection is **deliberately, temporarily
      off**: `swarmops/CLAUDE.md`'s "TEMPORARY OVERRIDE (2026-07-23)" allows direct pushes to
      `main` across all app repos until the team says otherwise. Needs to be reverted (and this
      box actually true) before demo day.
- [ ] PM board (GitHub Projects/Linear/Jira) in use — no dedicated board; task tracking happens
      in Discord instead (see below). Leaving unchecked since that's not literally what this item
      asks for, but it's a deliberate substitution, not a gap nobody noticed.
- [x] Team chat (Discord) in use — also doubling as the de facto PM board (task/status updates
      posted there rather than a separate GitHub Projects/Linear/Jira board).

## Local run *(optional — practice, not graded)*
- [ ] (optional) Docker Compose
- [ ] (optional) Local k8s

## Helm chart
- [x] One parent chart, MongoDB + RabbitMQ as Bitnami dependencies
- [x] `range`/`_helpers.tpl` template generates services (not copy-pasted per service)
- [x] Install, upgrade, rollback, uninstall all work
- [x] Mongo data survives all of the above

(M5, confirmed done — verified against a real minikube cluster per `swarmops-deployments/STATUS.md`.)

## Cloud infra (Terraform)
- [x] VPC + EKS via public modules (`terraform-aws-modules`)
- [x] Terraform Cloud workspace, remote state, state never in Git
- [x] One ECR repo per service, IAM roles, core add-ons installed — all 9 ECR repos + the GitHub
      OIDC role are real in AWS (account `769638986113`), confirmed directly via the Terraform
      Cloud API.
- [ ] No app workload deployed manually during this step — not something confirmable after the
      fact; leaving unchecked rather than assuming.

**Note:** `swarmops-infrastructure` split into `infra/persistent` (ECR + OIDC role,
`prevent_destroy`'d, never torn down) and `infra/cluster` (VPC/EKS, destroy freely) after a
cost-saving cluster teardown once took ECR down with it. `infra/cluster` **is currently destroyed**
(cost discipline between work sessions) — needs a fresh `apply` before anything below that depends
on a live cluster is actually reachable, regardless of what's checked above.

## Deploy to cloud
- [x] Images tagged `<semver>-<7-char-hash>`, never `latest`
- [x] Helm points at ECR images via a dedicated AWS values file (`values-aws.yaml`) — base chart
      stays environment-agnostic
- [x] Mongo on EBS-CSI-provisioned PVC (`gp3`, confirmed to survive a pod restart)
- [x] AWS Load Balancer Controller + ALB/Ingress — only thing reachable from outside

(M7, confirmed done 2026-07-28 — **but see the cloud infra note above**: `infra/cluster` is
currently destroyed, so none of this is actually live/reachable *right now* even though it was
built and verified. Re-verify reachability after the next `infra/cluster` apply, don't assume.)

## CI (GitHub Actions)
- [x] One workflow per repo — all 9 service repos have `.github/workflows/ci.yml`
- [x] PRs: lint/test/build only — never publish, never touch cluster
- [ ] `main` push: version + OIDC auth (no static keys) + build + push to ECR — **the workflow
      code for this exists and is merged in all 9 repos**, but doesn't actually work yet: every
      run fails at the "Configure AWS credentials via OIDC" step
      (`Not authorized to perform sts:AssumeRoleWithWebIdentity`). Terraform's recorded trust
      policy looks correct; real AWS disagrees — needs Valfish to compare the live IAM role
      against what's actually applied. Nothing has published to ECR for real through CI yet.

## GitOps (Argo CD)
- [ ] Argo CD installed, own namespace, watching `swarmops-deployments` — not installed anywhere;
      no live cluster to install it on right now.
- [ ] `AppProject` (scoped repos/destinations) + top-level `Application` — **written and ready**
      (`swarmops-deployments/argocd/`), not yet applied.
- [ ] Auto sync + self-heal + prune on — can't verify, nothing installed yet.
- [x] Each service's CI edits only its own image file, via `yq` — verified by reading the
      workflow code itself: every repo's `publish` job scopes its `yq` call to exactly its own
      `environments/production/images/<service>.yaml`, never another service's file. True
      regardless of the OIDC blocker above, since this is about what the code *would* do once it
      runs, not whether it has run successfully yet.
- [ ] Only a scoped bot identity can bypass `swarmops-deployments` branch protection — resolved
      differently than planned: a fine-grained PAT (Contents: Read/write, scoped to just this
      repo) from an existing account, not a separate GitHub App identity. Meets the scoping
      *goal* (one repo, one permission, not a broad personal token) but image-bump commits show
      as that person's account, not a distinct bot — a deliberate, documented simplification, not
      an oversight.
- [ ] Verified: drift correction, prune, rollback via Git revert — not testable without a live
      Argo CD install.

## Observability
- [ ] kube-prometheus-stack + Loki/Alloy, each its own Argo CD Application — **not started at
      all** (confirmed by grepping every repo — zero implementation, only planning-doc mentions).
      Can't start in earnest before Argo CD itself is real (M8).
- [ ] Every service exposes `/metrics` (no PII/IDs in labels), has a `ServiceMonitor` — the
      `/metrics` half is done on all 7 services, confirmed live; the `ServiceMonitor` half doesn't
      exist yet (blocked on kube-prometheus-stack above). Leaving the box unchecked since it's a
      two-part requirement and only one part is real.
- [x] Structured JSON logs, no secrets/PII — done on all 7 services, confirmed live.
- [ ] One Grafana dashboard — not started, no Grafana installed.
- [ ] Alerts — not started, no Alertmanager installed.

## Required extension
- [ ] Argo Rollouts canary on `planning-service` — installed, working, rehearsed (ship a bad
      build, watch it roll back) — **`Rollout` + `AnalysisTemplate` written 2026-07-29**
      (`swarmops-deployments/helm/swarmops/templates/planning-service-{rollout,analysistemplate}.yaml`),
      basic canary (20% → analysis-gated hold → 50% → hold → 100%), planning-service already
      excluded from the plain-Deployment loop. Not installed or rehearsed yet — needs a live
      cluster (destroyed right now) and the OIDC fix above (so a real build can even reach ECR)
      first. The `AnalysisTemplate`'s Prometheus address and metric-label scoping are both
      best-guesses flagged inline in that file, to confirm once kube-prometheus-stack actually
      exists.

## Demo day
- [ ] Dev auth-bypass removed from frontend (real `auth-service` login only)
- [ ] Every Argo CD Application shows `Synced` + `Healthy`
- [ ] Traffic flows: ALB → gateway → services
- [ ] Grafana dashboard shows live data, an alert fires on demand
- [ ] Logs queryable through Loki
- [ ] Canary rollback rehearsal works live
- [ ] `terraform destroy` path confirmed (teardown after demo)

(All correctly still open — none of these are meaningful to check until the items above they
depend on are actually live, not just written.)

## Talk-track ready (not extra work, just be able to answer)
- [ ] **Security** — where creds live, OIDC/IRSA everywhere, least-privilege IAM/RBAC, nothing over-exposed
- [ ] **Cost** — requests/limits set, what's actually costing money, real teardown path
- [ ] **Performance** — what's measured vs. assumed, known slowest hop
- [ ] **Caching** — anything recomputed that shouldn't be; worth a cache layer or not

(Human readiness, not code-verifiable — leaving as-is.)
