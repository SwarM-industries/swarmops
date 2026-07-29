# Talk-track prep — Guy's services

For `DEFINITION_OF_DONE.md`'s "Talk-track ready" section — answers for planning-service,
telemetry-service, drone-simulator, notification-service, RabbitMQ, and the canary setup.
Written 2026-07-29, grounded in what's actually in these repos, not generic answers.

## Security

- **Where creds live today:** every shared secret (`JWT_SECRET`, `RABBITMQ_URL`'s password,
  each service's `SERVICE_ACCOUNT_PASSWORD`) is a plain string in
  `swarmops-deployments/helm/swarmops/values.yaml`/`values-aws.yaml` — `local-dev-only-shared-secret`
  everywhere, by name. **This is the honest gap to own, not hide**: it works for a capstone demo,
  it would not survive a real security review. The fix (K8s `Secret` objects, or better, AWS
  Secrets Manager + the External Secrets Operator) is scoped work, not done — say so directly if
  asked, don't imply it's handled.
- **What *is* real:** planning-service verifies every inbound JWT (`src/verify_jwt.py`, added
  2026-07-26 after finding `/planning/*` had no auth check at all — a real gap that shipped and
  got closed, not a hypothetical). CI → AWS auth is OIDC, no static IAM keys, per the whole
  team's convention (once the trust-policy bug is fixed).
- **Service-to-service auth:** planning-service and drone-simulator both authenticate as their
  own service accounts (`POST /auth/login`) rather than minting their own tokens or trusting an
  internal network boundary — same path a real user's login takes, no backdoor.
- **RabbitMQ:** authenticated (`swarmops`/shared password, same gap as above), fanout exchange
  per consumer queue — no service can accidentally read another's queue contents, but nothing
  stops a compromised pod on the same cluster from connecting to the broker at all (no
  network-policy segmentation yet).

## Cost

- **What's actually expensive here:** planning-service is the one service with bumped resources
  (200m/512Mi limit vs. the 50m/256Mi default) — it's running `scipy`'s Hungarian matching +
  OR-Tools routing, real CPU work, not a thin CRUD service. Worth knowing cold if asked "why does
  this one service get more."
- **Where the real teardown discipline shows:** `swarmops-infrastructure` already had one real
  cost incident — a teardown once took ECR down along with the EKS cluster (not the intent).
  Fixed structurally by splitting `infra/persistent` (ECR + OIDC role, `prevent_destroy`, never
  torn down) from `infra/cluster` (VPC/EKS, destroyed between work sessions to save spend) — and
  that guard has already caught and blocked one accidental destroy attempt for real, not just in
  theory.
- **`terraform destroy` path:** confirmed working — `infra/cluster` is destroyed *right now* as
  of this writing, precisely because that path was exercised.
- **drone-simulator specifically:** deliberately has no `/metrics` endpoint and no Kubernetes
  `Service` — it's a pure background worker, standing up a Service just to expose `/metrics`
  would mean adding network surface that contradicts its own design, flagged to Valfish rather
  than done unilaterally. Cheap and correctly so.

## Performance

- **What's actually measured, not assumed:** planning-service emits three real custom metrics
  (`src/observability/metrics.py`) — `planning_solve_duration_seconds` (histogram),
  `planning_conflict_rate` (gauge), `planning_assignment_quality_vs_greedy` (gauge, real matcher's
  total route distance vs. the M1 greedy baseline on the same input). All three verified live with
  real non-zero values after a real solve — this is the one place in the system with genuine
  "did our optimization work help" data, not a guess.
- **Known slowest hop:** the solve itself (OR-Tools routing is the expensive part of
  `solve_matching`) — that's exactly why `planning_solve_duration_seconds` exists, to have a real
  number instead of "it feels fast enough."
- **Telemetry cadence:** drone-simulator ticks every 2s; the frontend polls at 3s (deliberately
  just above the simulator's own tick, not synced tighter — polling faster than the data actually
  changes would just be wasted load). No WebSocket anywhere in this stack — a deliberate choice
  the whole team made early (`milestones.md` M3 explicitly allows either), not a limitation nobody
  noticed.
- **A real fanout bug, fixed:** `telemetry_events` was originally a single shared RabbitMQ queue
  with fleet-service as sole consumer — adding planning-service/notification-service as more
  consumers on that *same* queue would've round-robin-*split* messages between them instead of
  each getting a full copy, silently dropping updates on all sides. Switched to a proper fanout
  exchange with one bound queue per consumer. Worth having ready as a "we found and fixed a real
  distributed-systems bug" answer, not just a feature list.

## Caching

- **Honest answer: nothing is cached today, and that's a defensible choice, not an oversight.**
  planning-service re-fetches drones/missions fresh on every solve rather than caching either —
  this is a re-planning system whose entire point is reacting correctly to state that just
  changed (a drone that just went `low_battery`, a mission that just got assigned). A stale cache
  here doesn't just cost latency, it produces a *wrong plan* — assigning a mission to a drone that
  isn't actually available anymore. Correctness beats a cache layer for this specific service.
  If pushed on "where *would* caching plausibly help": mission/drone reference data that changes
  rarely (no-fly zones, charging stations) is already fetched fresh per-solve too — a short-TTL
  cache there is more defensible than for live position/battery data, but hasn't been needed at
  this scale/demo traffic level to justify the added staleness-window risk.
