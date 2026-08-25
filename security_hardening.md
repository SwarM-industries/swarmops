# Security Hardening Plan

**Opened 2026-08-25 (Tony).** Trigger: the move to on-prem and the intent to put this in front of
army and police buyers. `onprem_deployment.md` §3.3 already said the security posture was
"dev-grade, and accreditation makes it blocking" — this document is the actual audit and the fix
plan.

**Everything below was verified against the repos on 2026-08-25**, file and line cited. Nothing is
inherited from another document — one of the three findings `onprem_deployment.md` listed turned
out to already be fixed (§6.1), which is exactly why this was re-checked rather than copied.

**Companion to:** `onprem_deployment.md` (the on-prem port, §6 item 1 is this work) ·
`algo_newfeat.md` §3.6 (authority-scoped tasking — a security control that is also a
differentiator) · `CLAUDE.md`'s deployment contract, which several fixes here depend on.

---

## 1. Findings

Severity is stated **for a defense/police accreditation review**, which is the bar that matters now
— not for the capstone the system was built as. Where exploitation requires access we currently
control (private repos, cluster reachable only through the gateway), that is stated rather than
glossed over.

| # | Finding | Where | Severity |
|---|---|---|---|
| 1 | One shared secret for JWT signing, RabbitMQ, Erlang cookie and service accounts — committed to git | `values.yaml:67,77,109,123,135,173,175,200,213,246` + `values-aws.yaml` | **Critical** |
| 2 | MongoDB runs with authentication disabled | `values.yaml:43` | **Critical** |
| 3 | No NetworkPolicy anywhere — flat pod network | `helm/swarmops/templates/` (zero hits) | **High** |
| 4 | Camera feed accepts frames from any authenticated client | `cameraFeed.ts:125,129` | **High** |
| 5 | No pod security context — no `runAsNonRoot`, no read-only FS, no dropped capabilities | `helm/swarmops/templates/` (zero hits) | **High** |
| 6 | No TLS in transit inside the cluster | Mongo, RabbitMQ, inter-service HTTP | **High** |
| 7 | WebSocket token passed in the query string | `cameraFeed.ts:100` | **Medium** |
| 8 | Wildcard CORS on all five Node services | `app.use(cors())` — auth, fleet, mission, telemetry, notification | **Medium** |
| 9 | No rate limiting, no `helmet`, anywhere | all services + gateway (zero hits) | **Medium** |
| 10 | No image scanning, signing or SBOM in CI | `.github/workflows/ci.yml` (zero hits for trivy/snyk/audit/cosign) | **Medium** |
| 11 | 8-hour tokens, no refresh, no revocation | `config/env.ts:15` | **Medium** |
| 12 | `verifyToken` pins no algorithm, no issuer, no audience | `auth/jwt.ts:16` | **Low** |
| 13 | `verifyJwt.ts` is copy-pasted into five services | five separate copies | **Low, but structural** |

### 1.1 Detail on the ones that need it

**#1 — the shared secret.** `local-dev-only-shared-secret` is the JWT signing key for every
service, *and* the RabbitMQ password, *and* the Erlang cookie, *and* `SERVICE_ACCOUNT_PASSWORD`.
One string is the entire authentication and messaging trust boundary. Because it is in the values
files it is in git history, so rotating the live value does not close the historical exposure —
that has to be assessed separately (repos are private, which limits but does not eliminate it).

The deeper problem is architectural: **a symmetric shared secret means every service can mint
tokens for every other service.** Compromise the least-important service and you are admin
everywhere. This is the finding to fix first, and the fix is not just "use a stronger string."

**#2 + #3 together are worse than either alone.** Mongo with `auth.enabled: false` on a flat pod
network means anything that gets a foothold in the cluster reads and writes every database in the
system — users, drones, missions, plans, telemetry — with no credential at all. The comment in
`values.yaml` is honest that this was local-dev parity rather than a security decision, which is
the right way to have recorded it, but on-prem is where that stops being acceptable.

**#4 — camera feed frame injection.** `cameraFeed.ts:125` reads `role` from a **client-supplied
query parameter**, and that role only filters who *receives* frames. The message handler at :129
relays binary data from **any** connected socket to every viewer. So any user holding a valid token
— including a plain `viewer` — can push arbitrary imagery into the operational picture. For a
police or military customer, injecting false video into what a commander is looking at is not a
bug-tracker item; it is the kind of finding that ends an evaluation. Producer status must come from
the verified token's role, never from the URL.

**#7 — token in the query string.** `?token=` lands in nginx access logs, any intermediate proxy's
logs, and browser history. The code comment correctly explains *why* (browsers cannot set an
`Authorization` header on a WebSocket handshake), so this is a known constraint with a known fix,
not an oversight — a short-lived single-use ticket issued over HTTPS, or the
`Sec-WebSocket-Protocol` header carrying the token.

**#8 — wildcard CORS.** `app.use(cors())` with no options allows every origin. Because we
authenticate with bearer tokens rather than cookies, this is not the classic CSRF disaster — but it
is default-open on five services and a reviewer will flag it in seconds. Restrict to the frontend's
origin per environment.

**#12 — stated accurately, not inflated.** `jwt.verify(token, env.jwtSecret)` passes no
`algorithms`, `issuer` or `audience`. With a string secret, `jsonwebtoken` restricts itself to the
HMAC family and rejects `none`, so this is **not** a live algorithm-confusion vulnerability today.
It is standard hardening that a reviewer will ask for, and it becomes genuinely load-bearing the
moment #1's fix introduces asymmetric keys. Fix it as part of that change, not before.

**#13 — why a "low" finding is on this list.** `verifyJwt.ts` was deliberately copied into each
service (its own header comment says to do exactly that). That was a reasonable polyrepo call at
the time. It means **every fix in #11 and #12 has to be applied five times and can silently drift
between services** — which is a security-maintenance problem even though today's five copies agree.
Worth a shared package once the auth changes land, not before.

### 1.2 What is already right — do not "fix" these

Stated so the fix work does not churn things that are correct:

- **Passwords are bcrypt-hashed** (`auth.routes.ts:29`, cost 10). Raise to 12 opportunistically;
  not urgent.
- **Every route that should be authenticated is.** `verifyJwt` is applied consistently, and
  `requireRole` genuinely restricts writes — `POST /fleet/drones` to operator/admin, no-fly zones
  and charging stations to admin only.
- **The telemetry ingest path is authenticated** (`telemetry.routes.ts:25`) — see §6.1.
- **The gateway is the only exposed port**, and the `auth` htpasswd file is correctly gitignored.
- **Structured JSON logs with no secrets and no PII** is already the stated convention in
  `CLAUDE.md`, and the observability work honoured it (no user/mission/drone IDs in metric labels).
  That is an accreditation asset — say it out loud.
- **Images are tagged `<semver>-<git-hash>`, never `latest`.** Provenance is already traceable,
  which makes #10's signing work an extension rather than a rewrite.

---

## 2. Phase 0 — blocking before any defense conversation

**Target: 2–3 weeks.** `onprem_deployment.md` §6 estimated one week against three findings; there
are thirteen. Order is by blast radius, not by ease.

| Step | Work | Repos |
|---|---|---|
| 0.1 | **Move JWT to asymmetric signing (RS256).** auth-service holds the private key; every other service verifies with the public key. A compromised downstream service can no longer mint tokens. Pin `algorithms`, add `issuer`/`audience` in the same change (#12) | auth-service + 4 consumers + deployments |
| 0.2 | **Distinct secrets per service, out of the repo.** Sealed Secrets or External Secrets minimum; Vault if the customer has one. Nothing secret in any values file. Rotate RabbitMQ credentials and the Erlang cookie to their own values | deployments, all services |
| 0.3 | **Enable MongoDB authentication**, per-service database users with least privilege — each service reaches only its own logical database | deployments, all services |
| 0.4 | **Fix camera-feed producer authorization.** Producer status from the verified token's role, not the query string. Reject binary frames from non-producers outright | telemetry-service |
| 0.5 | **Default-deny NetworkPolicy** plus explicit allows. The chart's `range`-generated structure makes this one template, not nine | deployments |
| 0.6 | **Pod security context** on every workload: `runAsNonRoot`, non-root UID, `readOnlyRootFilesystem` where the service tolerates it, `drop: [ALL]`, seccomp `RuntimeDefault`. Expect one or two services to need a writable temp mount | deployments, possibly Dockerfiles |
| 0.7 | **Lock CORS** to the frontend origin per environment | 5 Node services |
| 0.8 | **`helmet` + rate limiting**, with the tightest limit on `POST /auth/login` | 5 Node services, gateway |

**Verification for Phase 0 is not "it deploys."** Each item needs a demonstrated negative: a token
signed by a downstream service is rejected; an unauthenticated `mongosh` from another pod fails; a
`viewer` socket's frames do not reach any client; a pod cannot open a connection to Mongo unless
policy allows it. **Write those checks down as they land** — they are also the answers to the
questions an assessor will ask.

---

## 3. Phase 1 — accreditation readiness

Not blocking for a first conversation. Blocking for a first *deployment* inside their network.

| Step | Work | Notes |
|---|---|---|
| 1.1 | **TLS in transit inside the cluster** | Service mesh with mTLS is the complete answer; TLS on Mongo and RabbitMQ plus HTTPS between services is the cheap 80% |
| 1.2 | **Encryption at rest** + a **tested** backup/restore | "Tested" matters — an untested restore is not a control |
| 1.3 | **Token lifetime, refresh and revocation** (#11) | 8h with no revocation is the current state. Shorter access tokens + refresh + a revocation path. Needs a design decision on where revocation state lives |
| 1.4 | **Image signing (cosign), SBOM per build, vulnerability gate in CI** (#10) | Extends the existing tagging convention. Also the air-gap mirror story in `onprem_deployment.md` §3.1 — signing and pinning are the same conversation |
| 1.5 | **Admin MFA**; remove shared admin credentials | Includes confirming whether the `auth` htpasswd hash flagged in `actual_prod.md` was ever rotated — **unknown, see §5** |
| 1.6 | **Audit trail: who did what, immutable** | This is `algo_newfeat.md` §3.6. **Build it once and it is both a control and a differentiator** — unusual, and worth planning around |
| 1.7 | **Shared auth package** to replace the five copies (#13) | Do after 0.1/1.3 land, so the shared thing is the finished thing |
| 1.8 | **Document the internal-Git GitOps path** | `onprem_deployment.md` §6 item 6. "Every change to what runs is a signed, reviewable commit" is a strong accreditation sentence and we already live it |

---

## 4. Phase 2 — process, not fixes

What keeps the posture from decaying, and what an assessor asks about after the technical review:

- **Security review in the definition of done.** `DEFINITION_OF_DONE.md` exists; add it there.
- **Dependency updates on a cadence**, with the air-gap mirror refreshed deliberately rather than
  drifting (`onprem_deployment.md` §3.1's Bitnami scar is the warning).
- **Secret rotation procedure**, written and exercised — not just possible.
- **Incident response**: who is called, what gets isolated, how a compromised token is revoked
  (depends on 1.3).
- **Access review** on the cluster. Note `project_tony_team_lead` context — the widened EKS access
  entry is deliberate, but "deliberate" needs to be *documented* for an assessor, not just true.

---

## 4.5 New layers worth adding — and when

**Asked directly (Tony, 2026-08-25): should we add a new security layer, or is it not needed?**

**Not before Phase 0.** Every finding in §1 is a **missing control in a layer we already have**, not
a missing layer — Mongo has an auth mechanism and it is switched off; Kubernetes has NetworkPolicy
and we wrote none; JWT supports asymmetric signing and we chose a shared secret. Stacking something
new on top of unauthenticated Mongo is the exact pattern an assessor is trained to find, and it
reads *worse* than having no extra layer: it says we chose the visible control over the load-bearing
one.

After Phase 0, three are genuinely additive, and they are ordered here by what they buy the customer
rather than by what is interesting to build.

### 4.5.1 Identity federation — probably not optional

**Neither the army nor the police will want a local user table sitting in our MongoDB.** They have a
directory, and access will need to come from it — OIDC, SAML, or LDAP/Active Directory, whichever
they run. auth-service stops being the identity *source* and becomes a consumer of theirs.

**This layer deletes work rather than adding it:** no password storage (bcrypt hashing becomes moot),
no local account lifecycle, joiners/movers/leavers handled by a process they already run and already
audit, and MFA becomes theirs — which removes most of Phase 1 item 1.5.

**Ask about it in the same conversation as the accreditation framework (§5.1), because it changes
auth-service's shape and it is much cheaper to know before Phase 0 step 0.1 rewrites the token
flow.** If the answer is "yes, federate", 0.1 should be designed with that end state in mind rather
than redone six weeks later.

### 4.5.2 Admission policy (Kyverno or OPA Gatekeeper) — cheapest, most underrated

**It enforces the Phase 0 controls so they cannot regress.** No container runs as root, no image
without a valid signature, no workload without resource limits, no pod outside policy — rejected at
admission rather than discovered later.

Two reasons it matters more than its size suggests:
- **It converts "we documented a control" into "the cluster rejects a violation."** That is a
  materially stronger answer in an accreditation conversation, and it produces an audit artifact as
  a by-product.
- **It protects Phase 0 from us.** Every one of those fixes is a values file or a template away from
  being quietly undone in six months by someone debugging something else.

Sequence it immediately after Phase 0 — it is the thing that makes Phase 0 durable.

### 4.5.3 Service mesh with mTLS — real, but size it honestly

Already Phase 1 item 1.1. Genuinely a new layer: every service gets a cryptographic identity, so
"which service is calling me" stops being an assumption. It subsumes finding #6 (TLS in transit) and
upgrades #3 from IP-based to identity-based network rules.

**But the cost is real and recurring** — a mesh is an operational burden, and on the single-node
on-prem profile that `onprem_deployment.md` §3.5 describes it may be disproportionate to what it
buys. Decide per deployment size, not once for all deployments. TLS on Mongo and RabbitMQ plus
HTTPS between services is the cheap 80% and may be the right permanent answer for a small install.

### 4.5.4 What not to add

- **WAF, IDS, SIEM.** The customer almost certainly runs these already and will want us to **feed**
  them, not duplicate them. Ask what their logging and monitoring stack is and emit to it — our
  structured JSON logs are already in reasonable shape for that (§1.2). Building our own is cost
  with no credit.
- **Our own "security service."** There is no gap in the architecture that one would fill.
- **Anything custom-crypto.** Obvious, stated in writing anyway.

---

## 5. Open questions — answer before committing to an order

1. **Which framework are they accrediting against?** Israeli National Cyber Directorate guidance, an
   internal MoD standard, ISO 27001, something else — **this changes the priority order
   significantly**, and asking early reads as competence rather than ignorance. Question for the
   contact, per `SwarmOps_Competitive_Battlecard.md` §6.4's "ask, don't assume" discipline.
2. **Do they federate identity, and against what?** OIDC, SAML or LDAP/AD — see §4.5.1. Ask in the
   same conversation as question 1. **A "yes" changes the design of Phase 0 step 0.1**, so this is
   the one open question that can waste real work if it goes unasked.
3. **Was the `auth` htpasswd hash rotated?** Flagged in `actual_prod.md` (2026-08-13g) as needing
   rotation if live anywhere. The file is gitignored and was never committed; whether the credential
   itself was changed is unrecorded.
4. **How exposed is the git history?** #1's secret is in the history of a private repo. Whether that
   needs history rewriting or only rotation depends on who has ever had read access.
5. **Do they supply the cluster?** If the customer provides Kubernetes, several Phase 0/1 items
   (pod security standards, network policy enforcement, secret store) become *their* platform's
   controls and we conform rather than build. Changes the estimate materially — ask.

---

## 6. Corrections to other documents

### 6.1 `onprem_deployment.md` §3.3 is stale on telemetry ingest

It states *"`POST /telemetry/events` has no authentication"*. **Not true as of 2026-08-25.** The
ingest route is `POST /telemetry/ingest` and it is behind `verifyJwt`
(`swarmops-telemetry-service/src/routes/telemetry.routes.ts:25`); `GET /telemetry/events` is also
authenticated (:98). The other two findings in that section — Mongo auth and plaintext shared
secrets — are still accurate and are #1 and #2 here.

**That document should be corrected before anyone reads it ahead of a meeting**, because walking
into a defense conversation having overstated our own weakness is only marginally better than
having understated it.

### 6.2 `onprem_deployment.md` §6 item 1 is undersized

"~1 week" was scoped against three findings. Thirteen are now recorded and Phase 0 alone is 2–3
weeks. Update the action list there rather than leaving two numbers in two documents.

---

## 7. What we say in the room

The honest framing is strong even with all of the above outstanding, because on-prem removes the
objection that actually ends a defense conversation, and the architecture genuinely supports it —
self-hosted Mongo and RabbitMQ, no managed cloud service in the application path, Kubernetes
Service DNS throughout, and a base values file that already targets minikube.

Two disciplines:

- **Do not present the current posture as production-hardened.** Present it as *dev-grade by
  deliberate sequencing, with the hardening plan written and costed* — this document. An
  accreditation finding on a first deployment costs vastly more than saying it first.
- **Do not let the fixes become the pitch either.** None of Phase 0 is a differentiator; it is the
  entry fee. The exception is 1.6 (the audit trail), which is a control and a product feature at
  once — that one is worth talking about.
