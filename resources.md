# AWS/cluster resource summary

Snapshot as of 2026-08-07, taken live via `kubectl`/`aws`/`gh` against the running
`swarmops` EKS cluster and `swarmops-deployments`. Not auto-updated — re-run the
checks below if this drifts.

> **Cost note added 2026-08-14.** `budget.md` prices twelve months of this cluster at
> **$1,000–2,500**, not the $6–8K an earlier draft assumed: the EKS control plane is ~$73/month,
> two small nodes plus an ALB put continuous operation at $150–250/month, and the environment is
> already torn down between sessions. **It may be $0** — AWS Activate grants startups $1K–100K in
> credits and this project qualifies. Worth applying before the next billing cycle.
>
> If real drone hardware is connected (`actual_prod.md`), one thing here changes: the Stage 0
> ingest route `POST /telemetry/events` becomes internet-facing for a non-simulated producer, and
> it **still has no auth** — flagged in `UNITY_SIMULATOR_PLAN.md` Stage 4 and still open.

## Cluster

- **Name**: `swarmops` (EKS 1.34, `eks.30`, status `ACTIVE`)
- **Account**: `769638986113`, region `us-east-1`

## Nodes

5× `t3.medium`, SPOT capacity — 2 in `us-east-1a`, 3 in `us-east-1b`.
Total capacity: **10 vCPU / 18.7Gi RAM / 85 pod-slots**.

## Pods

**62 total**, by namespace:

| Namespace | Pods |
|---|---|
| kube-system | 22 |
| monitoring | 16 |
| swarmops | 15 |
| argocd | 7 |
| argo-rollouts | 2 |

**Deployments**: 23 total across all namespaces.

## Argo CD Applications

All `Synced`/`Healthy`: `swarmops`, `kube-prometheus-stack`, `loki-stack`,
`argo-rollouts`, `external-dns`.

## Argo Rollouts

1 canary rollout: `swarmops-planning-service` (5/5 up-to-date) — the one service
with progressive delivery per the deployment contract.

## ECR images currently deployed

Pulled from `swarmops-deployments`'s tracked tags (direct ECR API access is
blocked for this IAM user — `ecr:Describe*` denied).

| Service | Tag |
|---|---|
| auth-service | `0.1.0-2f10ef4` |
| fleet-service | `0.1.0-d7790cf` |
| mission-service | `0.1.0-c0486a2` |
| planning-service | `0.1.0-cd5ba55` |
| telemetry-service | `0.1.0-bdd7ade` |
| notification-service | `0.1.0-6e33f19` |
| gateway | `0.1.0-cc0397b` |
| drone-simulator | `0.1.0-ee46361` |
| frontend | `0.0.0-31b8803` |

## Persistent storage

6 PVCs, all `gp3`:

| Volume | Size |
|---|---|
| Mongo | 5Gi |
| RabbitMQ | 8Gi |
| Prometheus | 5Gi |
| Loki | 5Gi |
| Grafana | 1Gi |
| Alertmanager | 1Gi |

**Total: 25Gi**
