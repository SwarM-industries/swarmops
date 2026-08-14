# SwarmOps — Progress & Vision

*Internal summary, updated 2026-08-14. Companion to `SwarmOps_Business_Overview_{EN,HE}.md` — this
is the team-facing snapshot; those are the outward-facing documents. Backing research now lives in
`SwarmOps_Market_Sizing.md` (market), `../actual_prod.md` (hardware integration) and
`../budget.md` (Phase 1 costs).*

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

**The sharper version, arrived at 2026-08-13 and now the lead argument in every document:** the
problem does not require anyone to own a fleet. *Ten people flying one drone each in the same
sector are a swarm with no brain.* Nobody there has a fleet-size problem; each operator is doing
their job correctly, and the failure sits entirely in the space between them — which no
single-operator tool has any reason to look at, because **every tool in this market is bought by,
installed by and scoped to a single operator.** A layer serving several independent operators is
a different product with a **different buyer**: whoever is accountable for the airspace, who may
own none of the aircraft. That is a structural gap, not an oversight, and manufacturers are not
positioned to close it — their software's job is to fly *their* aircraft well.

**Confirmed by procurement, not just by argument:** the IDF has tendered for **5,000** small
drones (~₪3,500 each) and a further **12,000 FPV aircraft** (₪20–25K each), and is standing up its
own production line to cut cost further. Twelve thousand aircraft, one operator each, nothing
above them. The customer is commoditizing the hardware themselves.

**And the cheapest way in needs no vendor at all:** every compliant drone must broadcast position
and identity over an open standard. A ~$30 receiver assembles the airspace picture from *any*
manufacturer's aircraft, without an SDK and without owning the drone. See `../actual_prod.md`.

### 12-month path: capstone → company

1. **Months 0–3 — real aircraft.** Incorporate. Hardware abstraction layer + first physical
   drone via MAVLink; demonstrate the full loop (assign → route → live telemetry → re-plan) on
   real hardware. Regulatory groundwork with the Civil Aviation Authority.
2. **Months 3–6 — first pilot.** One design partner (infrastructure inspection or campus/site
   security), small mixed fleet on recurring missions, success criteria agreed up front
   (utilization, planning time saved, zero battery incidents).
3. **Months 6–12 — productize.** Multi-tenancy, operator onboarding, pricing validated against
   the pilot; convert pilot to paying reference customer; raise seed on the back of it.

### Market sizing (2026-08-13, `SwarmOps_Market_Sizing.md`)

- **TAM** — global drone fleet operations software, **$2.5–3.9B** (2026, ~18% CAGR). The
  coordination layer specifically is an estimated 10–20% of that, ~**$250–780M**, and no analyst
  tracks it separately. We deliberately do *not* claim the $96B drone market.
- **SAM** — **$6–20M/yr** in Israel (300–800 orgs coordinating 3+ aircraft at $20–25K); Europe+US
  add an estimated $320–800M. **Shared operating areas are not counted in either** and may be the
  larger half.
- **SOM** — **$0.6–1.5M ARR by year 3**, 20–40 customers. Bounded by headcount, not by market.

### Markets, in order of approach

1. **Defense & security logistics** — resupply tasking, patrol/surveillance coverage, inspection
   rounds. Largest fleets, strongest need for centralized coordination.
2. **Infrastructure & energy inspection** — power lines, pipelines, solar; recurring route-heavy
   missions map directly onto the optimizer.
3. **Agriculture** — survey/spraying coordination; acute battery/payload constraints.
4. **Delivery** — last-mile/site-to-site; gated by regulation timeline, not technology.

**Israel is the first market**: one of the densest drone ecosystems in the world, reachable
through the college's industry network.

### The ask — restructured 2026-08-13

The college turned out to be a small institution running 4-month courses: it can give a letter of
support, space, and introductions to its own contacts, and that is all. The English documents were
retargeted at **investors and design partners**; the college is now provenance, not an ask.

Two steps, deliberately:

1. **$12K minimum, non-dilutive.** Three aircraft, a Remote ID receiver, cloud, incorporation, CAAI
   licensing and insurance (`../budget.md` — real Israeli costs came to **~$10.5K**, not the
   $35–45K first assumed). Buys one milestone in ~4 months: **three separately-controlled aircraft
   flying at once, in one live picture.** Not a round; no equity at this price.
2. **~$250K pre-seed, after that milestone.** 12 months, founders full-time. Salaries and a first
   paid design partner — not hardware.

**Worth more than either: one design partner** operating 3+ aircraft, for a scoped pilot with
success criteria agreed up front.

### The key sell

The distance from working system to deployable product is unusually short: the operational
maturity startups typically retrofit in year two — IaC, GitOps, canary delivery, full
observability — already exists.

**And the hardware step is smaller than it looks.** The Unity track already forced
`telemetry-service` to accept telemetry from an external producer over the public gateway, and
forced a vendor-agnostic camera relay to exist. A real aircraft is therefore **a new producer, not
a rebuild** — nothing in planning-service, notification-service, the frontend or the data model
has to move.

**Correction worth remembering:** earlier versions of these documents said integration happens
"via MAVLink". True in general, wrong for this market — the IDF flies **DJI and Autel**, both
closed, both requiring their own SDKs. MAVLink covers custom airframes and export markets.

### Team (2026-08-13)

Four co-founders, all engineers, all combat veterans; **three of four were IDF drone operators**.
Tony Verin, Guy Peres, Harel Valfish built the system; **Amir Shacham** (DevOps engineer +
business/economics, Reichman) joined for commercial. **No titles in the outward-facing documents**
— deliberate: C-suite titles on a pre-revenue four-person team read as inexperienced. Titles are
for incorporation and bank paperwork only.

### Still open

Four team bios (the only thing blocking the EN overview) · `_render/onepager_en.html` (V1 EN) is
stale · **Hebrew one-pager V3 needs a native-speaker pass** — see
`_render/onepager_he_v3_REVIEW.md`.
