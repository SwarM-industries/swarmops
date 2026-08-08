# SwarmOps — Definition of Done

Final checklist from the capstone brief. Check off before demo.

**Re-synced 2026-08-08 (Tony, via Claude) against `milestones.md` + `resources.md`** — the
2026-07-29 sync below went stale fast: M8 and M9 both hit real "DONE, verified live" milestones
on 2026-08-01, and `resources.md` (a live `kubectl`/`aws` snapshot taken 2026-08-07) confirms most
of it still holds. Checked boxes below are things confirmed done and verified live, not just
"code exists." Where something is written/ready but not yet actually running, it stays unchecked
with a note explaining exactly what's blocking it — a checklist that just says "not done" with no
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
`prevent_destroy`'d, never torn down) and `infra/cluster` (VPC/EKS, destroy freely). `infra/cluster`
**was live and ACTIVE as of the 2026-08-07 `resources.md` snapshot** (EKS 1.34, 5 nodes, 62 pods) —
a reversal of the 2026-07-29 "currently destroyed" state. Given the team's own cost discipline
(destroy between sessions), re-confirm with `kubectl get nodes` before trusting anything below is
actually reachable *right now* — don't assume the 08-07 snapshot still holds a day-plus later.

## Deploy to cloud
- [x] Images tagged `<semver>-<7-char-hash>`, never `latest`
- [x] Helm points at ECR images via a dedicated AWS values file (`values-aws.yaml`) — base chart
      stays environment-agnostic
- [x] Mongo on EBS-CSI-provisioned PVC (`gp3`, confirmed to survive a pod restart)
- [x] AWS Load Balancer Controller + ALB/Ingress — only thing reachable from outside

(M7, confirmed done 2026-07-28, and confirmed reachable again per the 2026-08-07 `resources.md`
snapshot — same "re-verify before trusting" caveat as the cloud infra note above.)

## CI (GitHub Actions)
- [x] One workflow per repo — all 9 service repos have `.github/workflows/ci.yml`
- [x] PRs: lint/test/build only — never publish, never touch cluster
- [x] `main` push: version + OIDC auth (no static keys) + build + push to ECR — **fixed**, no
      longer failing at "Configure AWS credentials via OIDC." `resources.md` (2026-08-07) shows
      real, distinct `<semver>-<7-char-hash>` tags deployed for all 9 services, which only happens
      if CI actually published them — confirms this end-to-end, not just that the workflow file
      is correct.

## GitOps (Argo CD)
- [x] Argo CD installed, own namespace, watching `swarmops-deployments` — confirmed live,
      `resources.md`: 7 pods in `argocd` namespace, 2026-08-07.
- [x] `AppProject` + top-level `Application` — applied; 5 Argo CD Applications
      (`swarmops`, `kube-prometheus-stack`, `loki-stack`, `argo-rollouts`, `external-dns`) all
      `Synced`/`Healthy` per `resources.md`.
- [x] Auto sync + self-heal + prune on — exercised, not just configured: M8's own exit criteria
      ("delete a pod by hand → self-heal restores it; edit a live Deployment by hand → Argo CD
      reverts drift") is recorded as met, `milestones.md`:287.
- [x] Each service's CI edits only its own image file, via `yq` — verified by reading the
      workflow code, and now also by the real distinct tags in `resources.md` matching what each
      service's own CI would have written.
- [ ] Only a scoped bot identity can bypass `swarmops-deployments` branch protection — still
      resolved differently than planned: a fine-grained PAT (Contents: Read/write, scoped to just
      this repo) from an existing account, not a separate GitHub App identity. Meets the scoping
      *goal* but image-bump commits show as that person's account, not a distinct bot — a
      deliberate, documented simplification, unchanged since 2026-07-29.
- [x] Verified: drift correction, prune, rollback via Git revert — same M8 exit-criteria evidence
      as the self-heal box above.

## Observability
- [x] kube-prometheus-stack + Loki/Alloy, each its own Argo CD Application — both live and
      `Synced`/`Healthy` per `resources.md` (2026-08-07); 16 pods in the `monitoring` namespace.
- [ ] Every service exposes `/metrics` (no PII/IDs in labels), has a `ServiceMonitor` — `/metrics`
      confirmed live on all 7 services. `ServiceMonitor` is templated and merged
      (`templates/servicemonitor.yaml`), but `frontend`/`gateway` actually exposing `/metrics` is
      still explicitly unconfirmed (`milestones.md`:309, gateway is plain NGINX) — leaving
      unchecked until that's checked, not because the mechanism is missing.
- [x] Structured JSON logs, no secrets/PII — done on all 7 services, confirmed live.
- [x] One Grafana dashboard — "SwarmOps Overview" (cluster/pod health, request/error
      rate/latency, planning-service's 3 algorithm metrics) is live with real data, not just
      merged — the pitch deck's sheets 21-22 (`milestones.md`:785-793) are screenshots of it
      actually rendering.
- [ ] Alerts — `PrometheusRule` (service down, replicas unavailable, crash-looping, high error
      rate) is merged and deployed, but "an alert fires on demand" hasn't been explicitly
      exercised/confirmed anywhere in `milestones.md` — leaving unchecked until someone actually
      triggers one (e.g. scale a deployment to 0) and watches it fire.

## Required extension
- [x] Argo Rollouts canary on `planning-service` — installed, working, **and rehearsed for real**:
      `milestones.md`:229, 2026-08-01, "the canary rollback rehearsal passed for real against a
      deliberately broken image." `resources.md` (2026-08-07) confirms the rollout is still live,
      5/5 up-to-date. Runbook for re-running it: `swarmops-deployments/docs/canary-rollback-rehearsal.md`.
      Worth re-running once more before the actual defense (cluster gets destroyed/rebuilt between
      sessions; the rehearsal itself hasn't been repeated since 08-01, only re-confirmed as healthy).

## Demo day
- [ ] Dev auth-bypass removed from frontend (real `auth-service` login only)
- [x] Every Argo CD Application shows `Synced` + `Healthy` — true as of the 2026-08-07 snapshot,
      re-verify same-day as demo.
- [x] Traffic flows: ALB → gateway → services — confirmed reachable (Deploy to cloud section
      above), SPA 504 that briefly broke this was root-caused and fixed live 2026-08-04
      (`milestones.md`:473).
- [x] Grafana dashboard shows live data — see Observability section above; **alert fires on
      demand still unconfirmed**, keeping this box's second half honest.
- [ ] Logs queryable through Loki — Loki is installed and healthy (Observability section), but no
      entry in `milestones.md` confirms someone actually ran a query against it.
- [x] Canary rollback rehearsal works live — see Required extension above (2026-08-01, real).
- [ ] `terraform destroy` path confirmed (teardown after demo)

(Most of this now genuinely testable — the remaining open boxes are things nobody has explicitly
exercised yet, not things blocked on missing infra like the 2026-07-29 version of this section.)

## Talk-track ready (not extra work, just be able to answer)
- [x] **Security** — Guy's services: see `TALK_TRACK_GUY.md` (2026-07-29)
- [x] **Cost** — Guy's services: see `TALK_TRACK_GUY.md`
- [x] **Performance** — Guy's services: see `TALK_TRACK_GUY.md`
- [x] **Caching** — Guy's services: see `TALK_TRACK_GUY.md`

(Human readiness, not code-verifiable in general — but Guy's own 4 answers are now written down
and grounded in real repo facts, not generic. Tony/Valfish still need their own equivalents for
their tracks.)
