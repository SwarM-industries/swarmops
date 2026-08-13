# SwarmOps - Business Overview

**Drone Fleet Coordination & Mission Optimization Platform**

**Team:** Tony Verin, Guy Peres, Harel Valfish, Amir Shacham

---

## 1. Executive Summary

SwarmOps is a software platform that solves the part of drone operations nobody currently owns: **the space between aircraft.** It builds one live picture of everything airborne, and decides in real time which drone should fly which mission, in what order and along which route - while guaranteeing that no drone runs out of battery mid-flight. Critically, the problem it addresses does not require anyone to operate a large fleet: several people each flying one drone in the same area face it just as acutely, and have even less to solve it with.

SwarmOps is not a concept or a slide deck. It is a working distributed system, deployed and demonstrable today on AWS: a real optimization engine solving a variant of the Vehicle Routing Problem with Time Windows (VRPTW), an event-driven architecture that re-plans the fleet within seconds of a disruption, a live operational map, and a fully automated, production-grade delivery pipeline of the kind used by mature software companies.

The current version coordinates a simulated fleet - a deliberate scope decision, not a technical limitation. The coordination layer is hardware-agnostic by design, and integration with real drone hardware is the first, well-defined step of commercialization.

**We are raising $250,000 pre-seed to take SwarmOps from a validated engineering foundation to a piloted commercial product within 12 months** - and looking for one design partner operating three or more aircraft to run that pilot with.

---

## 2. The Problem

Drone fleets are growing faster than the tools used to run them - and the gap is not where most people assume it is.

**Nobody sees the whole airspace.** Every drone flies on its own controller, in its own app, under its own operator. No screen anywhere shows everything currently airborne: who is flying it, where it is, and what it is tasked to. The questions that matter at the level above the individual aircraft therefore go unanswered - who covers what, who already swept it, whose report is current.

**This is not a fleet-size problem. It is a coordination problem.** The obvious version - one organization operating more drones than a dispatcher can hold in their head - is real, and it is what most people picture. But the more common and more damaging version needs nobody to own a fleet at all: **ten people each flying one drone in the same area are a swarm with no brain.** Each of them is operating correctly. The failure sits entirely in the space between them, which no single-operator tool has any reason to look at, because every tool in this market is bought by, installed by, and scoped to one operator.

Both versions get worse with scale, and for the same underlying reason: battery limits that depend on distance *and* payload weight, payload-to-mission compatibility, mission priorities and deadlines, no-fly zones, charging logistics, and mid-mission disruptions (a drone drains faster than predicted, an urgent mission arrives, a drone goes offline) - all interacting at once, faster than a person can track.

**This is not hypothetical, and the scale is already public.** The IDF has procured small drones in quantities that make individual coordination impossible: an initial tender for **5,000 units** (₪20M, roughly $5.9M, at about ₪3,500 each), followed by a further tender for **12,000 first-person-view aircraft** at ₪20,000–25,000 each - and the establishment of an in-house production line, explicitly on cost grounds. Twelve thousand aircraft, each flown by one person, with nothing above them assembling a shared picture. That is the problem in this section, at a scale no radio net can absorb - and it is the direction the hardware is moving in every military that has studied recent conflicts. Note what is being commoditised there: the aircraft. What is not being solved by cheaper aircraft is the coordination between them.

The operational consequences are consistent across sectors:

- **Wasted flight time and low utilization** of expensive aircraft, because assignments are made by intuition rather than optimization.
- **Missed deadlines on high-priority missions**, because a human cannot re-plan the whole fleet every time conditions change.
- **Stranded aircraft**, because battery feasibility is estimated rather than computed.
- **Duplicate coverage and an inaccurate operational picture**, because without central coordination two teams can sweep the same ground and report it differently.
- **No single operational picture**, because fleet state lives across separate tools, spreadsheets, and radio calls.

> **Why we built this - this is not a theoretical scenario for us.** On 7 October 2023, during the fighting in the kibbutzim, two teams from the same company launched drones at the same time. With no coordination between them, both swept the same sector - one team identified hostiles, the other reported a friendly force in the same place. The contradiction in the situational picture delayed a critical operational decision - one that could have saved lives and carried the mission forward. That is the problem SwarmOps was built to solve.

Existing tooling is largely built by drone *manufacturers* and is drone-centric and vendor-locked: it flies one aircraft well, but it does not answer the fleet-level question - *who should do what, and can they actually complete it?* That coordination layer is the gap SwarmOps fills.

It is worth being precise about why that gap has stayed open. A layer that sits *above* several independent operators is a different product with a different buyer - the party accountable for the airspace, who may own no aircraft at all. Manufacturers have not built it and are structurally not positioned to, because their software's job is to make *their* aircraft fly well. The gap is not an oversight anyone is about to correct by accident.

This problem is directly relevant to defense and security logistics - resupply tasking, patrol and surveillance coverage, inspection rounds over dispersed infrastructure - as well as to civilian sectors such as energy and infrastructure inspection, agriculture, and last-mile delivery.

---

## 3. The Product - What Exists Today

Everything in this section is built, deployed, and demonstrable live. Nothing here is planned or projected.

### 3.1 Optimization engine

The core of SwarmOps is a mission-assignment and routing engine that treats the fleet, not the individual drone, as the unit of operation:

- **Optimal assignment** of drones to missions (Hungarian algorithm / weighted bipartite matching), minimizing total travel while penalizing lateness on urgent missions - benchmarked against a greedy baseline.
- **Per-drone multi-stop routing** (Google OR-Tools) for drones carrying several missions.
- **Battery feasibility as a first-class constraint**: the engine simulates battery drain along every candidate route - as a function of distance flown and payload weight, not a fixed capacity - and rejects any plan that would strand a drone, automatically inserting charging-station stops where needed.
- **Conflict resolution**: when two missions compete for the same drone, the engine resolves in favor of priority and deadline, and flags what it could not resolve to a human dispatcher.

### 3.2 Real-time, event-driven re-planning

Telemetry from the fleet (position, battery, status) streams through a message bus into the planning engine. When reality diverges from the plan - a new urgent mission, an abnormal battery drain, a drone dropping offline - the system re-solves the affected portion of the schedule automatically, within seconds, without a human pressing "re-plan."

### 3.3 Operational interface

A web-based control room: a live map showing every drone, mission, planned route, and no-fly zone, updating in real time; a mission board for creating and tracking missions; fleet inventory with battery and maintenance state; and operational dashboards (fleet utilization, mission completion rate, solve time, conflict rate).

**The control room also carries live video.** Every aircraft streams a camera feed concurrently into the platform, and the commander selects which to watch - each feed tied to the drone's identity, position and current mission, with automatic detection of a stale or frozen feed. This is the capability that distinguishes an operational picture from a map: the commander sees not only where each aircraft is and what it was tasked to do, but what it is looking at. To be precise about the current source: the fleet is simulated (§3.5), so the feeds today originate from the simulator rather than from physical cameras. Everything above the aircraft - transport, relay, per-drone routing of feeds, and the operator interface - is built and running.

### 3.4 Production-grade engineering

SwarmOps was built end-to-end to the operating standard of a commercial software company, and this is a core asset of the venture:

- **Architecture:** eight independent microservices (authentication, fleet, missions, planning, telemetry, notifications, gateway, fleet simulator) communicating over an event bus (RabbitMQ), each independently deployable and scalable.
- **Cloud:** running on AWS (Kubernetes/EKS), with all infrastructure defined as code (Terraform) - the entire environment can be destroyed and rebuilt from scratch on demand, which also keeps cloud spend controlled.
- **Delivery:** fully automated CI/CD (GitHub Actions, keyless OIDC authentication to AWS) with GitOps-based deployment (Argo CD) - every deployment is a Git commit; no one touches the cluster by hand. The highest-risk service (the planning engine) ships through automated canary rollouts with automatic rollback.
- **Observability:** full metrics and structured-log coverage (Prometheus, Grafana, Loki) with live operational dashboards.

The significance is this: the distance from working system to deployable product is unusually short, because the operational maturity that startups typically retrofit in year two already exists.

### 3.5 Current scope - stated plainly

The current fleet is **simulated**: a high-fidelity simulator flies each drone along its assigned route at realistic speeds with randomized variance (wind, sensor noise), generating the genuine telemetry stream the re-planner reacts to. Real hardware integration was deliberately outside the scope of the first build. Because every drone-facing interface in the system is already abstracted (drones are producers of telemetry and consumers of routes), integrating real aircraft is an engineering task with a clear path, not a research risk: a real drone connects to the platform as a new source of telemetry, which the system already accepts from an external producer over its public gateway. The path is written up in detail, per vendor. It is Phase 1 of the roadmap below.

---

## 4. Market Opportunity

### 4.1 Market size

Two kinds of figure appear below and they are not interchangeable. **Sourced** figures come from named third-party research firms or regulators. **Estimated** figures are our own bottom-up construction from those inputs; the assumptions behind each are documented in full and available on request. Published estimates for this category vary widely by definition, so ranges are given rather than single figures.

| | | |
|---|---|---|
| **TAM** — the category we sell into | **$2.5–3.9B / year** | Global drone fleet operations software, 2026, growing ~18% annually. That category also spans flight logging and photo processing; the coordination layer specifically is an estimated **10–20% of it, some $250–780M**, and is not tracked separately by any analyst. *Sourced: Fact.MR; Market Growth Reports. Slice: estimated.* |
| **SAM** — who we can actually sell to | **$6–20M / year** (Israel) | 300–800 Israeli organizations coordinating 3+ aircraft, at $20–25K each annually. Europe and the US add an estimated $320–800M. *Estimated.* |
| **SOM** — what we plan to win | **$0.6–1.5M ARR by year 3** | 20–40 subscribing customers, of which 2–3 defense or on-premise; roughly 5–15% of the Israeli market. Year 1 is a single pilot. *Estimated.* |

**What actually limits the SOM figure is our headcount, not the size of the market.** This is worth stating plainly, because it is the difference between a company that has found a small opportunity and one that is capacity-constrained inside a large one. Every row of the expansion track in §7.1 - predictive fleet health, on-premise deployment for defense, multi-organization support, other vehicle types - converts directly into additional addressable customers. None of them is blocked by research risk or by market demand. They are blocked by four people having to choose what to build next.

So the relationship is direct: **more engineers → more of the expansion track delivered per year → more segments we can sell into.** The $0.6–1.5M figure assumes we stay small. It is a floor set by our own capacity, not a ceiling set by the opportunity, and it is the most concrete argument for why funding at this stage changes the outcome rather than merely accelerating it.

**The honest limit on that argument:** headcount compresses *engineering* time, not *procurement* time. A defense sales cycle runs 12–24 months regardless of how many people we hire, and adding engineers does not create customers by itself. Hiring widens what we can offer and how many segments we can serve; it does not shorten the calendar of the institutions we sell to. We plan against both facts rather than the more flattering one.

**We do not claim the drone market as our TAM.** That market is projected at roughly $96B in 2026 (*Grand View Research*), but it is overwhelmingly aircraft, sensors and services - hardware and labour we neither build nor sell.

**One material figure is missing from the SAM above, and it may be the larger half.** The estimates count organizations by fleet size, because that is what registration data records. They do not count *shared operating areas* - sites, bases, corridors and sectors where several independently-controlled drones fly at once, which per §2 is the more common form of the problem. No public source counts these. Establishing that number is the first thing the pilot phase is designed to do.

**All figures above and below are recurring subscription revenue** - paid monthly or annually for as long as the customer operates the platform, not one-time licence sales. This is what makes a small early customer count compound rather than reset each year.

**What this market already pays** (*sourced*): comparable platforms price at **$50–500 per aircraft per month** - a band drawn from industry trade guides rather than research firms, and treated accordingly; DroneDeploy, the category's best-known name, publishes tiers at **$329–599 per user per year** (team and enterprise pricing is quoted privately), and **its automated flight planning works with DJI aircraft only** - a direct illustration of the vendor lock-in a neutral layer exists to solve. Note that DroneDeploy solves a different problem (post-flight mapping from drone imagery); it is cited as a price reference and a lock-in example, not as a competitor. Our working assumption is **$150 per aircraft per month**, putting a ten-aircraft customer at roughly **$20K per year recurring** and a defense or on-premise deployment at **$100–300K per year recurring** for a single site or formation.

**Two caveats on that pricing, both of which follow from the procurement scale in §2.** First, per-aircraft pricing is right for a reusable inspection or patrol drone and wrong for one consumed in a single flight - for expendable fleets the billable unit is per formation, per site or per program, never per airframe. Second, **a force-level coordination program is not a departmental purchase and is not priced like one.** Sized two independent ways - as 1–3% of the annual aircraft spend implied by the tenders in §2, or as 20–40 formations at $50–150K each - it lands at roughly **$1–5M per year** (*estimated*). We deliberately exclude this from the plan in §7 and from the SOM above: a 12–24 month defense procurement cycle is not something a four-person company can schedule around. It is stated as upside, and the plan is built to work without it.

### 4.2 Why now

Three converging trends make fleet-level coordination software valuable now:

1. **Fleets are scaling.** Drone operations in defense, inspection, and delivery are moving from single-pilot, single-drone operations to multi-drone fleets - and regulation worldwide is progressively enabling beyond-visual-line-of-sight (BVLOS) operations, which multiplies the number of aircraft one operator is responsible for and makes manual dispatch untenable.
2. **Hardware is commoditizing; coordination is not.** The differentiating layer is shifting from the aircraft to the software that decides what the fleet does. Manufacturer software does not solve cross-fleet optimization, and it locks operators into one vendor.
3. **Israel is ahead of the curve that creates the need** - see §4.3, which sets out the case rather than resting on proximity.

**Target segments, in order of approach:**

| Segment | Use case | Why early |
|---|---|---|
| Defense & security logistics | Resupply tasking, patrol/surveillance coverage planning, inspection rounds | Largest fleets, strongest need for centralized coordination, strong local ecosystem |
| Infrastructure & energy inspection | Power lines, pipelines, solar fields - recurring, route-heavy missions | Scheduled, repeatable missions map directly onto the optimizer |
| Agriculture | Survey and spraying coordination across large areas | Battery/payload constraints are acute; seasonal but high-volume |
| Logistics & delivery | Last-mile and site-to-site delivery | Longer-term; regulatory timeline is the gate, not the technology |

**Positioning:** SwarmOps does not build drones and does not compete with manufacturers. It is the vendor-neutral coordination layer - the operations brain - above whatever aircraft an organization already owns.

### 4.3 Israel first - and why, specifically

Israel is where this company is built. That is a strategic choice with reasons behind it, not a matter of convenience, and none of it closes off other markets:

1. **Israeli operators reach fleet scale before American ones do.** Beyond-visual-line-of-sight (BVLOS) flight is what multiplies the number of aircraft one organization is responsible for - which is what creates the problem in §2. The equivalent US rule remains unpublished. Israel's **National Drone Initiative** has run nationwide managed-airspace BVLOS trials since 2020 - jointly convened by the Civil Aviation Authority, the Ministry of Transport, Ayalon Highways, C4IR Israel and the Israel Innovation Authority - including flights under **GPS-denied conditions**. Our first market is therefore not waiting on a regulator.
2. **Israel's operating requirements are genuinely different**, which makes a product built for them a real product rather than a translation: continuously mixed civil and military airspace, restrictions declared at short notice, very short distances and correspondingly thin route margins, dense population beneath most flight paths - and satellite-navigation interference as a standing condition rather than an edge case. IATA reports global GNSS interference up **193% in 2025 against 2023**, with the Eastern Mediterranean among the worst-affected regions; navigation failures have been documented on aircraft departing Tel Aviv.
3. **The timing in this sector is unusual.** Israeli defense-tech companies working with the Ministry of Defense raised approximately **$3B in the first half of 2026** - close to **30%** of all private investment in Israeli high-tech over the same period. This is the segment currently attracting the largest share of local capital, and that will not necessarily hold.
4. **The aircraft are being commoditised in front of us, which is the whole thesis playing out.** The volume is not in the large platforms or in the expensive precision systems built by the primes - those are low-volume and unit-selective. It is in cheap aircraft bought in thousands (§2), now supplemented by in-house production chosen specifically to cut per-unit cost. Hardware is becoming the inexpensive, replaceable part of the system. The coordination layer above it is not, and nobody is currently supplying it.
5. **National funding tracks fit this stage.** The Israel Innovation Authority's deep-tech track runs to **NIS 2M at Pre-Seed and NIS 6M at Seed** (effective 15 July 2026), alongside new technological incubators covering robotics and defense-tech. A formal incubation affiliation materially strengthens an application to either.
6. **Israel's UAV market is sized at $557.6M (2025) growing to $855.7M (2030)**, an 8.9% CAGR (*MarketsandMarkets*).

**Israel is the market we win; export is what makes the outcome large.** A coordination layer proven in the most demanding airspace anyone operates in is precisely what makes it sellable abroad - the channel by which Israeli defense technology has reached international buyers for decades. Europe is the natural second market (a single cross-border rule set means one compliance posture serves all member states); the US is the largest civilian opportunity and expands sharply whenever its BVLOS rule lands.

### 4.4 Where this points

Stated as direction, not as plan. **None of the following is built, funded, or part of the 12-month roadmap in §7**, and it is set out here because it shapes the architecture rather than because it is being promised.

The natural end point of the problem in §2 is not one platform per organization but **a layer every Israeli operator connects to**: a single national picture of what is airborne, built around Israel's own conditions and standards rather than adapted from a foreign product. Israel is small enough for that to be tractable where it would not be in the US or the EU, and the convening body already exists in the National Drone Initiative. The two capabilities such a layer would be assembled from - fleet-wide coordination, and a live feed bound to each aircraft - already work today at single-organization scale (§3.3); what does not exist is the multi-organization hierarchy above them, which is Phase 3 of §7.

Separately, and more quietly: **the optimization engine does not know it is flying.** It solves a general problem - vehicles with limited energy, tasks with priorities and deadlines, and a plan that must survive disruption - which describes ground robots, warehouse fleets, delivery robots and unmanned surface vessels equally well. Reaching those markets requires an adapter per vehicle type rather than a new algorithm. We deliberately exclude this from the funded plan: focus is what wins the first customers. It is what the same core work is worth afterwards.

---

## 5. Differentiation

- **We can see aircraft we have no relationship with.** Every compliant drone is required to broadcast its position and identity, over an open standard, to anyone in range. The fleet-wide picture - the capability this company exists to provide - can therefore be assembled from **any manufacturer's aircraft, without that manufacturer's cooperation, without an SDK, and without owning the drone.** It is why the buyer described below, the person accountable for an airspace who owns none of the aircraft in it, is reachable at all. A manufacturer cannot follow us here: their software's purpose is to fly their own aircraft well, and this buyer flies everyone's.
- **It sits above operators, not inside one.** Every other tool in this market is bought by, installed by and scoped to a single operator, which is why none of them addresses the failure described in §2. A layer serving several independent operators at once is a different product with a different buyer, and manufacturers are structurally not positioned to build it.
- **Optimization-first.** Assignment and routing are the core of the product, not a scheduling screen bolted onto a flight app. The engine produces measurably better plans than manual/greedy assignment and proves battery feasibility for every route it emits.
- **Event-driven by architecture.** Re-planning is triggered by live telemetry in seconds. This is an architectural property, not a feature toggle - retrofitting it onto a request/response system is a rewrite.
- **Vendor-neutral and hardware-agnostic - concretely.** The aircraft that matter in this market are closed: **DJI** and **Autel** dominate, and each requires its own SDK. **MAVLink**, the open autopilot standard, covers custom-built airframes and most other professional aircraft. Each becomes a thin per-vendor adapter that normalizes telemetry into one internal format and routes that aircraft's video into the control room's existing feed relay. A mixed fleet appears as one fleet rather than one console per brand - which is exactly where manufacturer tools fail.
- **Operationally mature from day one.** Automated, auditable, canary-gated deployment and full observability - properties that materially de-risk early pilots with security-sensitive customers.

---

## 6. Status & Traction

- The full system is deployed on AWS and demonstrable live, end to end, on demand.
- In simulation runs, the planner produces zero battery-infeasible routes, and event-driven re-planning responds to fleet disruptions within seconds - success criteria defined up front and met.
- The system was built and presented as an engineering project before the company existed; following that presentation, the institution's management expressed interest in supporting its growth into a startup - the immediate cause of this document.

---

## 7. Roadmap - the next 12 months

**Phase 1 (months 0–3): Real aircraft.**
Incorporate. Build the hardware abstraction layer and integrate real aircraft - DJI and Autel via their SDKs, MAVLink for custom airframes - and demonstrate the full loop (assignment → route → live telemetry → re-plan) on real hardware. Begin regulatory groundwork with the Civil Aviation Authority of Israel.

**Phase 2 (months 3–6): First pilot.**
A scoped pilot with one design partner - infrastructure inspection or campus/site security are the natural candidates - running a small mixed fleet on recurring missions. Success criteria defined with the partner up front (utilization, planning time saved, zero battery incidents).

**Phase 3 (months 6–12): Productization.**
Multi-organization support (multi-tenancy), operator onboarding, pricing model validated against the pilot; convert the pilot to a paying reference customer; raise a seed round on the back of it.

Real hardware and multi-tenancy were deliberately outside the scope of the first build; they appear here as roadmap phases. Nothing on this roadmap contradicts what has been built - it extends it.

### 7.1 Beyond the 12 months - the expansion track

The 12-month plan above is what we are asking to fund. This section is what it opens onto, and it is included because the *ordering* is the argument: each step is chosen to be the cheapest available increase in revenue at that moment, and each one is built on the step before rather than starting a new bet.

**None of the following is funded, committed, or a promise to build.** It is stated so that a partner asking "and then what?" gets a considered answer rather than an improvised one.

| Stage | What we add | What it unlocks | Why it sits here in the order |
|---|---|---|---|
| **Year 2** — deepen | Predictive fleet health (battery wear and flight-hour scoring that pulls a degrading aircraft from the assignable pool before it fails); dynamic no-fly zones; mission-priority weighting tuned per sector | **+15–30% ACV on existing customers** | The cheapest revenue available is the customer already paying. No new market, no new sales motion, and the ROI story is concrete - a grounded revenue-generating airframe is a quantifiable loss |
| **Year 2, second half** — sell to the airspace owner | Multi-organization hierarchy (unit → base → command, or site → region → operator), so the customer can be the party accountable for shared airspace rather than the owner of the aircraft | **A buyer no product currently serves** - and the larger half of the market (§4.1) | This is the Phase 3 multi-tenancy work of §7 carried one step further - meaning **the engineering lands inside the funded 12-month plan, not two years later.** What gates the sale is not code but a reference customer and someone to do the selling. Until it exists, the party responsible for a shared airspace has no way to buy a solution to the problem in §2, because every available product is scoped to a single operator |
| **Year 2–3** — unlock defense | On-premise and air-gapped deployment; a planner that keeps coordinating when the cloud link degrades or GPS is jammed | **The $100–300K ACV tier** | Cloud-dependent coordination is disqualifying for a meaningful class of defense buyer, and the disqualification happens silently at requirements review. This is a gate, not a feature - worth knowing before the first defense conversation rather than after a lost one |
| **Year 3+** — widen | An adapter layer per vehicle type | **A multiple on the addressable market, with no new algorithm** | The optimization engine does not know it is flying: limited energy, prioritised tasks, deadlines, and a plan that must survive disruption describes ground robots, warehouse fleets, delivery robots and unmanned surface vessels equally. Deliberately last - focus is what wins the first customers |
| **Year 3+** — mobile basing | Autonomous launch and recovery onto **moving platforms** - vehicle-mounted, ship deck, or relocatable ground stations | **Fleets that operate without a fixed base** | The battery-feasibility engine already inserts charging stops at fixed stations; making those stations mobile is the same constraint with a moving target. Directly relevant to a force operating from vehicles rather than an airfield, and to maritime and convoy use - and it removes the assumption, built into every competitor, that a drone returns to where it started. **Research-stage:** precision recovery onto a moving deck is a genuinely hard control problem, not a configuration of what exists |
| **Continuous** | Learning from accumulated flight history: planning from what an airframe *actually* achieves in a given sector and season rather than from its specification | **Defensibility** | Every plan issued and every telemetry event returned is already stored. Each customer-month makes the plans measurably better, which is the answer to the question every investor asks about a software company with no hardware |
| **Long horizon** | A national coordination layer (§4.4) | A different business model entirely | Regulatory- and institution-gated rather than engineering-gated. Stated as direction, not plan |

**The ordering principle, in one line:** deepen the customers we have before widening to customers we do not, and open the highest-value segment only once we can survive its procurement requirements.

---

## 8. Team

**All four co-founders are engineers and combat veterans, and three of the four served as drone operators in the IDF.** The coordination failure this company exists to solve is one we have been on the wrong end of personally, not one we researched - see §2. It is also why the product's assumptions about how a fleet is actually tasked come from experience rather than from interviews.

Three of the four designed, built, and operate the entire system: algorithms, services, frontend, cloud infrastructure, and delivery pipeline.

- **Tony Verin** - co-founder. [1–2 lines: focus areas, e.g., CI/CD pipeline, cloud infrastructure, planning engine.]
- **Guy Peres** - co-founder. [1–2 lines: focus areas.]
- **Harel Valfish** - co-founder. [1–2 lines: focus areas, e.g., GitOps, progressive delivery, observability.]
- **Amir Shacham** - co-founder. DevOps engineer; business and economics, Reichman University. Owns commercial strategy, pricing and fundraising. [1–2 lines: focus areas.]

The team has operated as a distributed engineering organization - independent repositories, contract-first interfaces, protected mainlines, and automated deployment - which is precisely the working model the company will scale with.

---

## 9. The Ask

We are raising in two steps, deliberately, because the second is worth much more after the first has happened.

**Step one - $12,000 minimum, non-dilutive.** Three aircraft, a Remote ID receiver, twelve months of cloud, incorporation, a CAAI commercial operator licence and the third-party insurance it requires. This is not a funding round and we are not offering equity for it: at this amount, selling equity would price the company at a level neither we nor a future investor should want to anchor to. We are seeking it as a grant, an equipment contribution, or covering it ourselves.

What it buys is specific and dated: **within roughly four months, three separately-controlled aircraft flying at once, all visible in a single live picture** - the coordination failure described in §2, demonstrated on real hardware rather than argued from a slide. The integration surface for this already exists; a real aircraft connects to the platform as a new source of telemetry, not as a rebuild.

**Step two - a pre-seed round of approximately $250,000, after that milestone.** Twelve months with the four founders full-time. The round funds salaries and a first paid design partner - not hardware, which is why step one is so small. We would rather raise against an aircraft that is flying than against a plan to make one fly, and we are structuring the ask so that we can.

**What would help more than either - one design partner.** An organization operating three or more aircraft: a security operator, an infrastructure company, or a unit. A scoped pilot with success criteria agreed in advance, on their real missions. A single introduction of that kind is worth more to us right now than the first cheque, and it is the thing we cannot manufacture ourselves.

SwarmOps was developed under the Discharged Combat Veterans Program. **A live demonstration of the deployed system is available on request, end to end, at any time.**

---

**Contact:** Tony Verin - toniv7891@gmail.com · +972-52-4328627
