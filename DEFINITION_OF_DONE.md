# SwarmOps — Definition of Done


Final checklist from the capstone brief. Check off before demo.

## Repo & team setup
- [ ] All repos: protected `main`, README, `.gitignore`, `feature/bugfix/hotfix` branches
- [ ] PM board (GitHub Projects/Linear/Jira) in use
- [ ] Team chat (Discord/Slack) in use

## Local run *(optional — practice, not graded)*
- [ ] (optional) Docker Compose: gateway is the only exposed port, Mongo named volume, seed runs only on empty data dir
- [ ] (optional) Local k8s (kind/minikube): raw manifests, Bitnami Mongo chart, seed via read-only ConfigMap, exposed only through gateway

## Helm chart
- [ ] One parent chart, MongoDB + RabbitMQ as Bitnami dependencies
- [ ] `range`/`_helpers.tpl` template generates services (not copy-pasted per service)
- [ ] Install, upgrade, rollback, uninstall all work
- [ ] Mongo data survives all of the above

## Cloud infra (Terraform)
- [ ] VPC + EKS via public modules (`terraform-aws-modules`)
- [ ] Terraform Cloud workspace, remote state, state never in Git
- [ ] One ECR repo per service, IAM roles, core add-ons installed
- [ ] No app workload deployed manually during this step

## Deploy to cloud
- [ ] Images tagged `<semver>-<7-char-hash>`, never `latest`
- [ ] Helm points at ECR images via a dedicated AWS values file (base chart stays environment-agnostic)
- [ ] Mongo on EBS-CSI-provisioned PVC
- [ ] AWS Load Balancer Controller + ALB/Ingress — only thing reachable from outside

## CI (GitHub Actions)
- [ ] One workflow per repo
- [ ] PRs: lint/test/build only — never publish, never touch cluster
- [ ] `main` push: version + OIDC auth (no static keys) + build + push to ECR

## GitOps (Argo CD)
- [ ] Argo CD installed, own namespace, watching `swarmops-deployments`
- [ ] `AppProject` (scoped repos/destinations) + top-level `Application`
- [ ] Auto sync + self-heal + prune on
- [ ] Each service's CI edits only its own image file, via `yq`
- [ ] Only a scoped bot identity can bypass `swarmops-deployments` branch protection
- [ ] Verified: drift correction, prune, rollback via Git revert — no manual `helm upgrade`/`kubectl apply`

## Observability
- [ ] kube-prometheus-stack + Loki/Alloy, each its own Argo CD Application
- [ ] Every service exposes `/metrics` (no PII/IDs in labels), has a `ServiceMonitor`
- [ ] Structured JSON logs, no secrets/PII
- [ ] One Grafana dashboard: node/pod health, request rate, error rate, latency
- [ ] Alerts: service down, replicas unavailable, crash-looping, high error rate

## Required extension
- [ ] Argo Rollouts canary on `planning-service` — installed, working, rehearsed (ship a bad build, watch it roll back)

## Demo day
- [ ] Dev auth-bypass removed from frontend (real `auth-service` login only)
- [ ] Every Argo CD Application shows `Synced` + `Healthy`
- [ ] Traffic flows: ALB → gateway → services
- [ ] Grafana dashboard shows live data, an alert fires on demand
- [ ] Logs queryable through Loki
- [ ] Canary rollback rehearsal works live
- [ ] `terraform destroy` path confirmed (teardown after demo)

## Talk-track ready (not extra work, just be able to answer)
- [ ] **Security** — where creds live, OIDC/IRSA everywhere, least-privilege IAM/RBAC, nothing over-exposed
- [ ] **Cost** — requests/limits set, what's actually costing money, real teardown path
- [ ] **Performance** — what's measured vs. assumed, known slowest hop
- [ ] **Caching** — anything recomputed that shouldn't be; worth a cache layer or not
