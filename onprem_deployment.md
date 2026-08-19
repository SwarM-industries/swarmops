# On-Prem Deployment — Running SwarmOps Inside a Military Network

**Opened 2026-08-19.** Answers the connectivity objection raised in
`business/SwarmOps_Positioning_and_Pitch.md` §3.3: *SwarmOps is a cloud Kubernetes system that
assumes connectivity; eyesAtop runs edge AI for disconnected tactical operation.*

**Direction set by Tony, 2026-08-19: deploy the application on-prem, with connectivity over the
army's own private network.** This document says what that actually costs, what it fixes, and —
importantly — what it does not fix.

Companion to `actual_prod.md` (real hardware) and `budget.md` (what it costs to fly). Same status:
a plan, not built.

---

## 1. The two connectivity problems, which are not the same problem

The objection collapses two different things. Separating them is the whole point of this document.

| | **Tier 1 — where the server lives** | **Tier 2 — the operator's link to it** |
|---|---|---|
| Problem | The platform runs in AWS, on the public internet. A defense customer cannot use that | A soldier with a Mavic on a hillside has intermittent or no link to *any* server, on-prem or not |
| Fixed by on-prem? | **Yes, completely** | **No** |
| Effort | **Small — see §2. The stack is already portable** | **Real work — see §4** |
| Kills the deal if unsolved? | **Yes.** "It's in the cloud" ends a defense conversation | No, but it is where eyesAtop is genuinely ahead |

**On-prem is the right call and it removes the objection that would actually have ended the
conversation.** It does not remove the tactical-edge one, and we should not claim it does.

---

## 2. Tier 1 — the on-prem port is small, because the stack was built portable

**Verified against the repos, 2026-08-19.** The important finding:

> **`swarmops-deployments/helm/swarmops/values.yaml` — the base values file — targets minikube and
> contains no AWS at all.** `values-aws.yaml` is a pure overlay on top of it. **A working non-AWS
> deployment profile already exists and is exercised every time someone runs it locally.**

### 2.1 What is genuinely cloud-agnostic already

- **Chart dependencies are self-hosted subcharts** — Bitnami **MongoDB** and **RabbitMQ**
  (`Chart.yaml`). No managed cloud database, no managed queue, no cloud-specific service in the
  application path.
- **All inter-service addressing is Kubernetes Service DNS** — `http://auth-service:3001`,
  `mongodb://mongo:27017/auth_db`, `amqp://…@rabbitmq:5672`. **Identical strings on minikube and on
  EKS.** Nothing resolves through a cloud provider.
- **No AWS SDK in any application service.** The AWS coupling is entirely in delivery and
  infrastructure, not in the code that would run inside the network.
- **One parent chart, `range`-generated services** (`_helpers.tpl`, `templates/service.yaml`) —
  adding a deployment target is a values file, not a manifest rewrite.

### 2.2 The complete list of AWS couplings, and the on-prem substitute for each

| Coupling | Where | On-prem substitute | Effort |
|---|---|---|---|
| **Image registry** — ECR URLs on all 9 services | `values-aws.yaml`, `environments/production/images/*.yaml` | Internal registry (Harbor/Nexus/registry:2). Values change only | Trivial — **but see §3.1, mirroring is the real work** |
| **Storage class `gp3`** | `values-aws.yaml` (mongodb + rabbitmq persistence) | Whatever the on-prem cluster provides (local-path, Ceph/Rook, vSphere CSI, NetApp) | Trivial |
| **Ingress: ALB + ACM certificate ARN** | `values-aws.yaml` `ingress:` | ingress-nginx + an internally-issued certificate. Base values already ship `ingress.enabled: false` | Small |
| **external-dns → Route53** | `argocd/external-dns-application.yaml` | Drop it. Internal DNS is managed by the network, not by us | Trivial — deletion |
| **EKS itself** | `swarmops-infrastructure/infra/cluster/*.tf` | Their cluster, or a bare-metal/RKE2/OpenShift install. **Terraform is not portable and should not be** | Out of our scope — it is their platform |
| **AWS OIDC in CI** | GitHub Actions workflows | Irrelevant inside the network — see §3.2 | n/a |

**The deliverable is a third values file — `values-onprem.yaml` — plus a mirrored registry.**
That is the honest size of Tier 1. **We should build it before the first defense conversation, not
after**, because "we can deploy on-prem" is a much weaker sentence than "here is the on-prem values
file and here is it running."

---

## 3. What actually makes it hard — and none of it is the application

### 3.1 Air-gap: everything must be mirrored, and the chart currently pulls from the internet

The chart pulls Bitnami subcharts from `oci://registry-1.docker.io/bitnamicharts` and images from
Docker Hub. **Inside a military network there is no Docker Hub.** Every image and subchart must be
vendored into an internal registry, once, with pinned digests.

**This intersects an existing scar.** `values.yaml`'s own comments record that Bitnami moved
maintained images behind a paid tier, forcing `bitnamilegacy/rabbitmq` as a free fallback — which
in turn has **no arm64 build**, so MongoDB deliberately does *not* get the same override. **On-prem
turns that from a recurring annoyance into a one-time decision that must be made deliberately:**
pin exact digests for Mongo, RabbitMQ, and every observability chart, mirror them, and stop
depending on a vendor's free tier existing next quarter. **Do this once and the air-gap problem is
mostly solved.**

### 3.2 GitOps: Argo CD watches GitHub, and there is no GitHub in there

`CLAUDE.md`'s deployment contract is explicit — *a deploy is a Git commit, full stop* — and Argo CD
watches `swarmops-deployments` with auto-sync, self-heal and prune. **That contract survives
on-prem unchanged; only the remote moves** to an internal Git server, with an import path for
bringing new versions across the boundary. **Keep the contract.** It is a genuine selling point in
an accreditation conversation: every change to what is running is a signed, reviewable commit.

### 3.3 Security posture — currently dev-grade, and accreditation makes it blocking

The repo is honest about this already; on-prem changes it from deferred to blocking. All of the
following will be found in the first security review:

- **MongoDB runs with `auth.enabled: false`** — the comment in `values.yaml` says so explicitly and
  correctly calls it parity with local dev, not a security decision.
- **Shared plaintext secrets in the values files** — `JWT_SECRET: local-dev-only-shared-secret`,
  `SERVICE_ACCOUNT_PASSWORD`, RabbitMQ credentials — **committed to the repo**, and the same value
  reused across every service.
- **`POST /telemetry/events` has no authentication** — already flagged in `UNITY_SIMULATOR_PLAN.md`
  Stage 4 and `resources.md`, still open. It is the ingest path a real drone would use.

**None of these is hard to fix and all of them are cheap now and expensive later.** Real Mongo
credentials, per-service secrets from a secret store (or at minimum sealed/external secrets), and
auth on the ingest endpoint. **Treat this as a prerequisite for the on-prem values file, not a
follow-up** — an accreditation finding on a first deployment is far more costly than a week of work
before it.

### 3.4 No phone-home

Anything that reaches outward has to be removable, not merely unused: external-dns (deletion),
ACM (n/a once ingress is internal), image pulls (mirrored), and the observability stack's chart
sources (mirrored). **The base `values.yaml` already ships `ingress.enabled: false`**, which is the
right default and shows the conditionality is there.

### 3.5 Scale, downward

`resources.md` sizes the current cluster at 5× `t3.medium`, 62 pods, 25Gi of PVs. An on-prem pilot
at one unit or one command post may be **a single node**. The chart supports it (`replicas`,
resource requests are per-service in values) but the planning-service Rollout is set to
`replicas: 5` to give the canary steps a meaningful split — **that is an EKS-shaped choice and
should collapse to a plain Deployment in the on-prem profile.**

---

## 4. Tier 2 — the operator's link, which on-prem does not fix

**The army's private network reaches bases, command posts and vehicles. It does not reach a soldier
on a hillside with a Mavic and no signal.** That is the gap eyesAtop's edge AI addresses, and
moving our server on-prem does nothing about it.

The fix — already scoped as item 4.4 in `business/SwarmOps_Positioning_and_Pitch.md`, and this
document raises its priority:

1. **The plan must survive disconnection.** Compute centrally when connected; distribute the result
   as a **static task list that remains valid offline** — sector, sequence, and the battery budget
   for each assignment. If the link drops, the operator still knows what they are doing.
2. **Re-plan on reconnection**, reconciling what actually happened against what was planned.
3. **Later: the planner runs at the edge** — a single-node profile at a command post, or eventually
   on a laptop with the unit.

**Why this is tractable for us specifically:** the §4.2 design — *coordination without control* —
already assumes we do not command the aircraft. **A system that outputs task assignments to humans
degrades gracefully in a way a system that flies aircraft cannot.** A dropped link means a stale
task list, not a lost aircraft. **That is a genuinely better failure mode and it is worth saying
out loud in a defense room.**

---

## 5. What this changes in the pitch

**Replace** the §3.3 counterweight — *"we're cloud, they're edge, they're ahead"* — with:

> **"It deploys on-prem, inside your network. No cloud, no internet, no data leaving. The whole
> platform is one Helm chart with self-hosted Mongo and RabbitMQ — no managed cloud services
> anywhere in it, which is why the same chart already runs on a laptop. And because we assign tasks
> to people rather than fly the aircraft, a dropped link means a stale task list, not a lost
> drone."**

Three claims there, each true and each checkable: **on-prem by architecture**, **no cloud
dependencies in the application path**, **graceful degradation by design**.

**Do not claim edge autonomy.** We do not have it, eyesAtop does, and §4 is honest about the
difference.

---

## 6. Action list

| # | Action | Blocking for | Size |
|---|---|---|---|
| 1 | **Fix the security posture** (§3.3): Mongo credentials, per-service secrets, auth on `POST /telemetry/events` | Any on-prem conversation | ~1 week |
| 2 | **Write `values-onprem.yaml`** — internal registry, cluster-native storage class, ingress-nginx, no external-dns, planning-service as a plain Deployment | The demo | Small |
| 3 | **Vendor and pin every image and subchart** with digests; document the mirror procedure | Air-gapped install | Moderate, one-time |
| 4 | **Prove it** — install the whole platform on a disconnected single-node cluster with no internet, from the mirror only. **Time it.** | The claim in §5 | 1–2 days once 2 and 3 are done |
| 5 | **Static offline task list** (§4.1) | The tactical-edge answer | Real work — roadmap |
| 6 | Document the internal-Git GitOps path (§3.2) | Accreditation conversation | Small |

**Items 1–4 are what turn "we can deploy on-prem" into "here it is, installed, offline, in eleven
minutes."** That demo is worth more than any slide in the deck.
