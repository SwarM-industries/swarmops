# SwarmOps — Use Cases: Civilian & Defense

**Companion document to `SwarmOps_Business_Overview_{EN,HE}.md`.** That document makes the
company case; this one makes the *product* case, sector by sector. Every row states a real
operational problem, what SwarmOps does about it, and how much of that is built today versus
roadmap. Nothing here overstates current capability — see the **Status** column.

**Status legend:**
- **Built** — exists in the deployed capstone system today, demonstrable live.
- **Phase 1–3** — roadmap phase from the Business Overview §7 (0–3mo hardware, 3–6mo pilot,
  6–12mo productization). A sector-specific extension of existing architecture, not new
  research.
- **Future** — beyond the 12-month roadmap; directionally correct, not yet scoped.

---

## 1. The cross-cutting problem

Every sector below hits the same wall once a fleet grows past a handful of aircraft, and it's
the same wall regardless of whether the operator is a farm co-op or a military unit:

> **A human can hold maybe 3–5 drones in their head at once** — where they are, how much
> battery they have left, what they're carrying, what they're supposed to do next. Past that,
> assignment reverts to intuition, utilization drops, and nobody can *prove* a route was
> battery-feasible until the drone either makes it back or doesn't.

SwarmOps replaces intuition with computation at the fleet level. The four recurring pain points
this document keeps coming back to:

1. **No centralized picture.** Fleet state — position, battery, maintenance status, current
   task — lives in radio calls, spreadsheets, or separate per-vendor apps. No one commanding the
   whole fleet sees the whole fleet.
2. **Manual tasking is provably suboptimal.** A dispatcher assigning drones to missions by
   experience cannot out-perform an optimizer, and cannot *prove* a route won't strand a drone —
   they estimate.
3. **Maintenance is reactive, not predictive.** Battery degradation and wear are caught after a
   failure (a drone doesn't come back, or underperforms mid-mission), not before.
4. **Re-planning doesn't happen fast enough.** When conditions change — urgent task arrives, a
   drone goes offline, battery drains faster than expected — a human has to notice, then
   manually re-work the schedule. By the time they do, the fleet has been running on a stale
   plan for minutes.

Everything below is a variation on solving these four problems for a specific sector.

---

## 2. Defense & security (IDF-oriented)

Framed at the capability level — operational concepts and coordination problems that are public
and doctrine-agnostic, not unit-specific or classified detail. Positioning is unchanged from the
Business Overview: SwarmOps is a vendor-neutral coordination layer above whatever aircraft a
unit already owns, not a weapons system and not a manufacturer.

| # | Problem | Current state (pain) | SwarmOps solution | Status |
|---|---|---|---|---|
| 2.1 | **Fleet maintenance is tracked manually per unit.** Flight hours, battery cycle count, and wear are logged by hand or not at all; a drone's degraded battery or airframe issue is discovered mid-mission, not before it's tasked. | Maintenance logs live outside the tasking system, so a scheduler can assign a mission to a drone that shouldn't fly. | `fleet-service` already carries `status: maintenance` per drone. Extend with **predictive health scoring** (flight-hour and battery-cycle thresholds) that automatically excludes a drone from the assignable pool before it fails, and surfaces a maintenance queue to the tasking officer. | Core status field: **Built**. Predictive scoring + auto-exclusion: **Phase 2** |
| 2.2 | **No centralized picture across units/bases.** Each unit or base runs its drones independently — no single view of what's airborne, what's available, and what's tasked, across the organization. | Command has no fleet-wide operational picture; cross-unit asset sharing (e.g. borrowing a drone from an adjacent unit for an urgent tasking) is a phone call, not a system decision. | The control-room live map + dashboard already aggregates every drone in one view. Extend with **hierarchical multi-org support** (unit → base → command) so each echelon sees its own drones by default and command sees the roll-up — same multi-tenancy work already on the roadmap for civilian multi-org customers, applied to a unit hierarchy instead of a client list. | Single-fleet live map: **Built**. Multi-unit hierarchy: **Phase 3** |
| 2.3 | **Manual tasking is measurably worse than optimized tasking.** Today a human operator decides which drone flies which mission by experience — this is the single biggest inefficiency SwarmOps targets. It under-utilizes expensive airframes, has no way to prove a route is battery-feasible before launch, and cannot react to a new urgent tasking without manually re-working the whole schedule. | Wasted flight time, missed high-priority taskings buried under routine ones, drones tasked into routes that turn out to be infeasible only once airborne. | This is the core engine, already built and already benchmarked: Hungarian assignment + OR-Tools routing outperforms greedy/manual assignment on total travel and lateness; every route is proven battery-feasible (as a function of distance *and* payload) before it's issued, not estimated after the fact. Priority/deadline weighting already resolves competing taskings; extend with **mission-classification-aware weighting** (e.g. tasking priority tiers specific to a military context) as a pilot-driven refinement. | Assignment + routing + battery feasibility: **Built**. Classification-aware priority weighting: **Phase 2**, pilot-driven |
| 2.4 | **Resupply tasking is radio-coordinated, not system-coordinated.** Forward units request resupply ad hoc; fulfillment depends on whoever's monitoring the net noticing and manually scheduling a drone. | Slow reaction to urgent requests, no queue, no visibility into what's already been tasked vs. still pending. | Resupply requests enter as prioritized missions on the mission board; the optimizer treats an urgent resupply exactly like any other high-priority mission — it gets folded into the fleet-wide plan and triggers re-plan on the affected drones within seconds, not the whole fleet. | **Phase 2** (pilot use case named explicitly in Business Overview §4 target segments) |
| 2.5 | **Patrol/surveillance coverage degrades silently when a drone is diverted or lost.** A manually-scheduled patrol plan doesn't self-heal — if a drone assigned to a sector goes offline or is redirected, the coverage gap persists until a human notices and re-tasks. | Coverage blind spots, inconsistent patrol cadence, gap duration depends on how attentive the human dispatcher is. | Event-driven re-planning already reacts to a drone going offline or an abnormal battery drain within seconds — the affected coverage is automatically reassigned to another available drone, not queued for a human to notice. | **Built** (re-planning engine), sector-coverage-as-mission-type is a **Phase 2** application of it |
| 2.6 | **Inspection rounds over dispersed, sensitive infrastructure** (perimeter fencing, installations, remote outposts) are scheduled manually and don't adapt to changing priority. | Recurring inspection missions compete for the same aircraft as everything else, scheduled by hand. | Recurring missions are a natural fit for the optimizer — same mechanism as civilian infrastructure inspection (§3.2 below); no new engineering, a scheduling pattern applied to a different customer. | **Built** core, **Phase 2** applied |
| 2.7 | **Airspace deconfliction is static.** No-fly zones and restricted areas change (temporary restrictions, active-operation zones); a routing system that only knows fixed no-fly zones will route through a zone that became restricted an hour ago. | Manual cross-checking against current airspace restrictions before every flight. | No-fly-zone avoidance is already a first-class routing constraint (`fleet-service` owns the zones, `planning-service` routes around them). Extend with **dynamic/temporary zone updates** pushed in real time so a newly-declared restricted area immediately affects in-flight re-planning, not just future missions. | Static no-fly-zone avoidance: **Built**. Dynamic/temporary zones: **Phase 2** |
| 2.8 | **No auditable record of what was tasked, flown, and why.** After-action review needs to reconstruct fleet activity; if it's not logged systematically, that reconstruction is manual. | Time-consuming after-action reconstruction from fragmented logs/radio records. | Structured JSON logs, full mission history, and telemetry archives are already part of the observability stack (Prometheus/Grafana/Loki) by design, not bolted on. Extend with a **formal after-action export** (mission timeline + route + telemetry, packaged per operation). | Structured logging + telemetry history: **Built**. Formal export/report format: **Phase 3** |

**Why this sector first:** largest fleets, strongest institutional need for centralized
coordination, and — per the Business Overview — the strongest local ecosystem access through the
college's network. It is also the sector where "eliminate the inefficiency of manual, per-drone
human tasking" (row 2.3) is most acute, because the cost of a suboptimal assignment is measured
in missed taskings and stranded aircraft, not just idle flight hours.

---

## 3. Civilian sectors

The same four underlying problems (§1), applied to non-defense operators. Each row deliberately
mirrors a defense row above where the underlying mechanism is identical — that reuse *is* the
point: one coordination layer, many customers.

| # | Sector | Problem | SwarmOps solution | Status | Mirrors |
|---|---|---|---|---|---|
| 3.1 | **Infrastructure & energy inspection** | Power lines, pipelines, solar fields need recurring route-heavy inspection; today scheduled manually, utilization of inspection drones is low, and there's no proof a route was battery-feasible before an inspection drone is sent out on a long, remote line. | Recurring missions map directly onto the optimizer; battery feasibility is proven per route including payload (sensor package weight); auto-inserted charging stops handle long linear routes (a pipeline or power line longer than one battery leg). | Core engine **Built**; recurring-mission scheduling pattern **Phase 2** | 2.6 |
| 3.2 | **Agriculture (survey & spraying)** | Battery/payload constraints are the most acute of any sector — spraying payload directly trades off against range, across large multi-field areas, seasonally concentrated (short high-volume windows where inefficiency is expensive). | Battery-feasibility-as-first-class-constraint (function of distance *and* payload) is exactly the binding constraint this sector needs solved; multi-drone coordination across large areas is a direct application of per-drone routing + fleet-wide assignment. | **Built** core, **Phase 2** applied | 2.3, 2.4 |
| 3.3 | **Fleet operators / drone service companies** (companies operating drones as a service across multiple client contracts) | No centralized picture across contracts/sites; each client relationship is managed semi-independently, so fleet-wide utilization across all contracts is invisible. | Multi-org/multi-tenant control room — one operator, many client "tenants," one fleet-wide optimization and utilization view underneath. | **Phase 3** (multi-tenancy, named explicitly in Business Overview roadmap) | 2.2 |
| 3.4 | **Predictive maintenance for commercial fleets** | Same as 2.1: battery/airframe wear discovered reactively; for a commercial operator this is direct cost (grounded revenue-generating asset) rather than mission risk. | Predictive health scoring auto-excludes degrading drones from the assignable pool before failure, surfaces a maintenance queue. | **Phase 2** | 2.1 |
| 3.5 | **Search & rescue** | Time-critical, area-coverage problem: multiple drones need to search a grid efficiently and *immediately* re-task the whole search pattern the moment one drone finds something or a search area is updated — a manually-run search cannot re-organize itself fast enough. | Event-driven re-planning (already built for battery/offline disruptions) applies directly to "new information changes priority" — the same second-scale re-plan mechanism, a different trigger. | Re-plan engine **Built**; SAR-specific mission types/coverage patterns **Future** | 2.5 |
| 3.6 | **Disaster response / emergency mapping** | Situation evolves faster than a manual re-plan cycle — new hazards, changed access routes, shifting priority areas — while multiple agencies' drones may be operating in the same airspace. | Same re-planning core as 3.5; dynamic no-fly/hazard-zone updates (2.7's mechanism) apply directly to "this area just became unsafe to fly." | **Future** — real hardware + multi-agency coordination both need to exist first | 2.5, 2.7 |
| 3.7 | **Last-mile / site-to-site delivery** | Longest-term civilian opportunity; the gate is regulatory (BVLOS approval timelines), not the technology — the assignment/routing/battery-feasibility problem is the same one already solved for other payload types. | No new core engineering; deferred deliberately per Business Overview §4 ("regulatory timeline is the gate, not the technology"). | **Future**, technology-ready | 2.3, 2.4 |

---

## 4. Reading this document alongside the roadmap

Business Overview §7 defines three phases (0–3mo hardware, 3–6mo pilot, 6–12mo productization).
This document doesn't add new phases — it shows what *becomes possible inside each phase* once
it lands, across more sectors than the single pilot the company will actually run in year one.

The pilot design-partner conversation (Phase 2, one partner, infrastructure inspection or
campus/site security) is the proof point. Everything else in this document is the argument for
*why the same core, once proven once, generalizes* — not a promise to build all of it in year
one.

**What this document is not:** a commitment to build every row above. It is a map of where the
existing architecture already reaches, and where a defined, bounded extension of it reaches
next — so that when a defense or civilian design partner asks "can it also do X," the honest
answer (built / straightforward extension / real research) is already known instead of
improvised in the room.
