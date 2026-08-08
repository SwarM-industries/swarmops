# Last Day Addons

## Expose Grafana + Argo CD without port-forward

Simplest approach: reuse existing NGINX gateway, add path routes, protect with basic auth.
No new ALB, no new public Ingress — keeps single external surface (per plan.md:191-192 lock:
"Ingress/ALB in front of gateway is the only externally reachable thing").

### Steps

1. Create htpasswd + K8s Secret:
   ```
   htpasswd -c auth admin
   kubectl create secret generic gateway-basic-auth --from-file=auth
   ```

2. NGINX config block (per protected path):
   ```
   auth_basic "restricted";
   auth_basic_user_file /etc/nginx/.htpasswd;
   ```

3. Add path routes:
   ```
   location /grafana/ { proxy_pass http://grafana.<ns>.svc.cluster.local; }
   location /argocd/  { proxy_pass http://argocd-server.<ns>.svc.cluster.local; }
   ```

### Tradeoff

Basic auth = weak (shared password, no MFA/audit) vs OAuth2-proxy/SSO, but zero new infra,
good enough for demo-scale. Not for prod.

### Note

plan.md:241 already flags "Grafana open with no auth" as unresolved risk — this addresses it.

## Frontend feedback on re-plan events

**⚠️ additional discussion needed before building.**

Live map should visibly flag *why* a re-plan happened (telemetry event → conflict), not just
silently show new routes. Makes event-driven core visible to non-technical viewers — matches
deck sheet 07's emphasis on `simulator → telemetry → RabbitMQ → planning` chain.

Open questions to discuss: where does the trigger reason surface (toast? map annotation? side
panel?), does planning-service already emit a reason code with re-plan events or does that need
adding, whose track owns frontend map changes (Valfish, per plan.md §1).

## Camera feed staleness/lag detection

Follow-up, not built (Tony's request, 2026-08-04, `milestones.md`:562-577). `cameraFeed.ts`
relays frames blind today — no per-frame timestamp, no age check, no distinction between "quiet
feed" and "frozen/dead feed." Two separate gaps:

1. **Staleness** — `CameraFeedStreamer.cs` (Unity) already tags each frame; add a producer-side
   timestamp to that tag. Frontend computes `now - frame_timestamp`, shows a "feed stale"
   indicator past ~2s instead of silently displaying a frozen last frame with no visual cue.
2. **Lag under backpressure** — today's `bufferedAmount` guard (`a0ca1a1`) fixes OOM by dropping
   a frame once a client falls behind, but stays strict FIFO otherwise, so a lagging client stays
   lagging (catch-up in slow motion). Fix: "latest-frame-wins" — drop the whole backlog except
   the newest frame when a client is behind. Standard live-video relay pattern, not implemented
   here yet.

Owner: `swarmops-telemetry-service` + `swarmops-unity-simulator` (Guy's + Tony's shared surface),
frontend needs the staleness indicator too.

Flag before actual demo defense if camera feed is a focal point — not required for a basic run.

## DevOps addons (deployment/monitoring side, not app features)

### Argo CD → Discord notifications

Built-in Argo CD Notifications controller — fires on sync failure / health-degraded straight to
a Discord webhook. Reuses the channel the team already checks (per CLAUDE.md's status-note
workflow), zero new infra.

Steps:
1. Notifications controller ships with Argo CD (or install separately if not bundled in the
   current install) — confirm with `kubectl get pods -n argocd | grep notifications`.
2. Add Discord webhook URL to `argocd-notifications-secret`.
3. Configure `argocd-notifications-cm` with a `service.discord` entry + triggers
   (`on-sync-failed`, `on-health-degraded`).
4. Subscribe the `swarmops` `Application` via annotation:
   `notifications.argoproj.io/subscribe.on-sync-failed.discord: ""`.

~30min, no new pods beyond the (often-already-present) notifications controller.

### OpenCost

**⚠️ additional discussion needed before building.**

Live per-namespace/per-service cost breakdown, scrapes your **existing** Prometheus — no new
metrics stack. Directly answers plan.md:242-244's still-open "resources and cost" review
criterion — turns the static `resources.md` snapshot into a live Grafana panel instead of a
point-in-time manual check.

Steps:
1. `helm install opencost opencost/opencost -n monitoring` (own chart, points at the
   kube-prometheus-stack Prometheus already live).
2. Import OpenCost's community Grafana dashboard (JSON, one import, sidecar auto-discovers it
   same as "SwarmOps Overview" does).
3. Point it at the real AWS billing data (Cost and Usage Report integration) if actual $-values
   matter, or leave it on resource-request-based estimation for a demo-only cluster.

### Trivy (image vuln scan in CI)

**⚠️ additional discussion needed before building.**

One step added to the shared CI workflow template (plan.md:200-202, the one Tony/Guy copy into
all 9 service repos) — scans the built image before push, fails/warns on critical CVEs.

Steps:
1. Add `aquasecurity/trivy-action` step after image build, before ECR push, in the reusable
   workflow template.
2. Start in warn-only mode (don't block `main` pushes on it yet — CVE noise on day one would be
   a bad time to discover that), tighten to fail-on-critical once baseline is known.

Cheap, real signal for the "security" review criterion, touches every repo via one shared file.

### Chaos Mesh

**⚠️ additional discussion needed before building.**

CNCF chaos-engineering platform — controller + CRDs that deliberately inject failures (pod
kill, network latency/loss, CPU/mem pressure) against pods matched by label selector, on
demand or scheduled. Comes with its own dashboard showing what's running and blast radius.

Concrete use here: re-trigger the RabbitMQ-pod-rescheduled incident that was fixed for real
(`milestones.md`:501-529, reconnect-on-drop in fleet-/notification-/telemetry-service) —
on command, repeatably, instead of relying on an accidental reschedule like last time.

Steps:
1. `helm install chaos-mesh chaos-mesh/chaos-mesh -n chaos-mesh --create-namespace`.
2. Example experiment — kill the RabbitMQ pod:
   ```yaml
   apiVersion: chaos-mesh.org/v1alpha1
   kind: PodChaos
   metadata:
     name: kill-rabbitmq
     namespace: swarmops
   spec:
     action: pod-kill
     mode: one
     selector:
       labelSelectors:
         app.kubernetes.io/name: rabbitmq
   ```
3. Apply once, live during the demo — watch `/health` on the three affected services flip to
   `503`, kubelet restart them, reconnect clean. Same self-heal already verified live
   2026-08-04, just staged instead of accidental.

Good demo moment since the underlying fix already exists — this only makes it repeatable.
