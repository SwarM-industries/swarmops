# SwarmOps — Progress & Vision

*Internal summary, August 2026. Companion to `SwarmOps_Business_Overview_{EN,HE}.md` — this is the
team-facing snapshot; those are the outward-facing documents.*

---

## Where we are

### Product (capstone — complete and live)

- **8 microservices on AWS EKS**: auth, fleet, missions, planning, telemetry, notifications,
  gateway, drone simulator. RabbitMQ event bus, MongoDB (one logical DB per service).
- **Planning engine — the core**: VRPTW variant where battery range, not fixed capacity, is the
  binding constraint. Hungarian assignment (`scipy.linear_sum_assignment`) → OR-Tools per-drone
  routing → battery-drain simulation per route (function of distance + payload, charging stops
  auto-inserted) → event-driven re-planning in seconds from live telemetry.
- **Frontend control room**: live SVG map, mission board, fleet inventory, operational dashboards.
- **Delivery pipeline**: Terraform IaC, GitHub Actions CI (OIDC to AWS, no static keys), Argo CD
  GitOps, canary rollouts on planning-service, Prometheus/Grafana/Loki observability. Every
  deploy is a git commit; nobody touches the cluster by hand.
- **Success metrics defined up front, met**: zero battery-infeasible routes in simulation runs,
  second-scale re-plan latency after disruptions.

### Business (August 2026)

- Presentation landed. College management interested — requested a business document to support
  an incubation/funding decision.
- Delivered and pushed: full business overview EN + HE (markdown + PDF), one-pagers EN + HE
  (PDF), all in this folder. Logo-mark branding. All claims restricted to what is actually
  built; the simulated fleet is stated openly and framed as roadmap Phase 1, not hidden.
- **Open before sending**: surnames, team bios, pre-seed amount, contact details — all marked
  `[...]` in both languages.

---

## The vision

**Thesis:** drone hardware is commoditizing; fleet coordination is not. Manufacturer software
flies one drone well; nobody answers the fleet-level question — *who should do what, and can
they actually finish it?* SwarmOps is the vendor-neutral coordination layer — the operations
brain above whatever aircraft an organization already owns.

### 12-month path: capstone → company

1. **Months 0–3 — real aircraft.** Incorporate. Hardware abstraction layer + first physical
   drone via MAVLink; demonstrate the full loop (assign → route → live telemetry → re-plan) on
   real hardware. Regulatory groundwork with the Civil Aviation Authority.
2. **Months 3–6 — first pilot.** One design partner (infrastructure inspection or campus/site
   security), small mixed fleet on recurring missions, success criteria agreed up front
   (utilization, planning time saved, zero battery incidents).
3. **Months 6–12 — productize.** Multi-tenancy, operator onboarding, pricing validated against
   the pilot; convert pilot to paying reference customer; raise seed on the back of it.

### Markets, in order of approach

1. **Defense & security logistics** — resupply tasking, patrol/surveillance coverage, inspection
   rounds. Largest fleets, strongest need for centralized coordination.
2. **Infrastructure & energy inspection** — power lines, pipelines, solar; recurring route-heavy
   missions map directly onto the optimizer.
3. **Agriculture** — survey/spraying coordination; acute battery/payload constraints.
4. **Delivery** — last-mile/site-to-site; gated by regulation timeline, not technology.

**Israel is the first market**: one of the densest drone ecosystems in the world, reachable
through the college's industry network.

### The ask (from the college)

Incubation (workspace + program affiliation) · mentorship (business development,
defense/aerospace) · industry introductions (operators, integrators, infrastructure companies) ·
pre-seed support (development drones, cloud costs, legal/regulatory setup).

### The key sell

The distance from capstone to deployable product is unusually short: the operational maturity
startups typically retrofit in year two — IaC, GitOps, canary delivery, full observability —
already exists. The only genuinely new engineering between now and a pilot is MAVLink
integration, and every drone-facing interface is already abstracted for it.
