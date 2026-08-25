# SwarmOps — Algorithm Gaps & New Feature Plan

**Opened 2026-08-25 (Tony).** The team decided to resume development and present a
**feature-fuller MVP**. This document is the candidate list: what is algorithmically weak in what
we already shipped, what is worth adding, and — §3 — seven capabilities aimed specifically at a
defense buyer that no competitor in `business/SwarmOps_Competitive_Battlecard.md` currently sells.

**Audience for the resulting demo:** design partner / pilot, defense buyer, internal. **Not
investor-first** — so weight operational depth and procurement gates over pitch polish.

> ## Status — three approved, everything else DECIDE LATER
>
> **Approved to build (Tony, 2026-08-25):**
>
> | § | Feature | One line |
> |---|---|---|
> | **3.8** | Sensor footprint on the map | Draw the ground polygon each drone can see, not just a dot for where it is |
> | **3.9** | Controllable gimbal + true visible area | Slew the sim's camera, and compute the real visible ground from altitude and angle — dead spots included |
> | **3.10** | Real DJI airframes with published specs | Replace invented drone numbers with actual models and their manufacturer specs |
>
> **Everything else in §1, §2 and §3.1–§3.7 is DECIDE LATER** — a menu the team picks from, not a
> backlog anyone should start burning down. §4's build order is a *recommended* sequence if the
> whole thing were taken, not an assignment; nothing there has an owner and none of it is in
> `plan.md`.
>
> **§6 is a third bucket — FURTHER DISCUSSION.** Those are not features, they are *wedges*: answers
> to "why would this specific customer buy anything at all," built on the two accounts we can
> actually reach. Different kind of decision, so do not fold them into either list above.
>
> **Before any decide-later item leaves this document:** it gets an owner and a track in `plan.md`,
> and if it changes a shared shape (§1.1, §2.5, §3.4, §3.6 all do) it goes through `plan.md`'s sync
> points first. **Before any §3 item is said out loud to a buyer:** §5's verification runs — that
> applies to the approved three as much as the rest.

**How to read this:**
- §1 is *verified against the code*, file and line cited. Every gap named there was checked in
  `swarmops-planning-service/src/solver.py` on 2026-08-25, not inferred from a doc.
- §2 and §3 are proposals. §3's "nobody else has this" claims are marked
  **[ASSUMPTION]** — they are derived from the competitor set already in the Battlecard, **not**
  from fresh product research. Verify before any of it is said in a room. The Battlecard's own
  lesson applies: a claim that three of our documents agreed on was still wrong, because none of
  them checked the source.

**Related:** `business/SwarmOps_Competitive_Battlecard.md` §5 (its own eight-item build list —
this document does not repeat those, it extends them) · `actual_prod.md` (real-hardware path) ·
`business/SwarmOps_Business_Overview_EN.md` §7/§7.1 (roadmap phases) · `SwarmOps_PRD.md` §4.2/§6/§7
(the algorithm spec and the locked data shapes).

---

## 0. What is already built — do not re-plan these

Checked in the repos, 2026-08-25. Listed because at least two of them have been described as
missing in conversation.

| Thought to be missing | Actually |
|---|---|
| What-if simulator endpoint | **Built.** `POST /planning/simulate`, `routes/planning.py:360`. Non-committing, reuses `solve_matching`. |
| What-if simulator UI | **Built.** `swarmops-frontend/src/components/dashboard/WhatIfSimulator.tsx`. |
| No-fly-zone avoidance | **Built and real.** Visibility-graph + Dijkstra with an inflated-polygon clearance margin (`_bypass_route`, `solver.py:326`). Not reject-and-fail — it routes around. |
| Charging-station insertion | **Built.** `_route_with_charging`, `solver.py:106`. Falls back to the drone's start as an implicit charger. |
| Mid-flight route patching | **Built.** `reconcile.py` patches routes in place; `swarmops-drone-simulator` now re-reads them every poll instead of only at dispatch. |
| Camera feed | **Built.** Unity → `telemetry-service/src/websocket/cameraFeed.ts` → `DroneCameraPanel.tsx`. |

So the honest framing of this document: the system's *coordination* layer is real. What is thin is
**time, energy realism, and everything a defense buyer asks about after the first demo.**

---

## 1. Algorithm gaps — verified in `solver.py`

Ranked by (leverage) ÷ (cost). Every item names the file and what it would touch.

| # | Gap | Where | Effort | Contract change? |
|---|---|---|---|---|
| 1 | No time in the model at all | `solver.py` throughout | L | Additive (Plan gains ETAs) |
| 2 | One drone = one mission, ever | `solve_matching:563` | L | No |
| 3 | Battery ignores payload weight | `_route_with_charging:141` | S | No |
| 4 | No battery reserve floor | `_route_with_charging` | XS | Config only |
| 5 | Match cost sees only `target_locations[0]` | `_pair_cost:34` | S | No |
| 6 | Re-plan churn — nothing penalizes reassignment | `solve_matching` | S | No |
| 7 | Euclidean distance on lat/lng | `_distance:20` | S | No |
| 8 | `URGENCY_WEIGHT_KM` hardcoded | `solver.py:17` | XS | Additive |
| 9 | No optimality gap, only vs-greedy ratio | `assignment_quality_vs_greedy:648` | M | No |
| 10 | No inter-drone deconfliction | absent | M (needs #1) | Additive |

### 1.1 Time is not in the model — the highest-leverage gap

`speed_kmh` is on the Drone shape (PRD §6) and **the planning service never reads it** — confirmed,
zero occurrences in `swarmops-planning-service/src/`. `deadline` is read in exactly one place,
`solve_greedy:479`, and `solve_greedy` is now only ever called as the *baseline metric* inside
`assignment_quality_vs_greedy:658`. **So no deadline anywhere influences a real plan.**

`CLAUDE.md` and the PRD describe the problem as "a VRPTW variant". There are currently **no time
windows**. That is a claim we should either build or stop making — it is the kind of thing a
technical evaluator checks.

What building it unlocks, all at once:
- **ETA per waypoint and per mission** — the single most-requested number on any ops console.
- **Deadline feasibility** — "this mission cannot be met by any drone" becomes answerable, and
  becomes a new `_unresolved_reason` case alongside payload/range/zone.
- **Time-on-station** — how long a drone can loiter at the target *after* arriving and still get
  home. This is the number a commander actually plans around, and we cannot compute it today.
- **Charging-station occupancy** becomes meaningful again. Capacity was dropped to
  "assume infinity" (2026-08-06) precisely because with no time model there was no queue to
  model. With time, capacity is a real constraint and a real scheduling problem.
- **Deconfliction** (#10) becomes computable — two routes only conflict if they are in the same
  place *at the same time*.

Implementation shape: add a time dimension to the route walk in `_route_with_charging` (arrival
time per waypoint from `speed_kmh` plus a per-mission service/loiter time), then a soft deadline
penalty in `_pair_cost` and a hard-infeasible check per plan. Charge time needs a real number —
today recharge is instantaneous in the model (`remaining_range_km = max_range_km`).

**Sell:** "It tells you what time each drone is where, and refuses the mission it cannot make."

### 1.2 One drone, one mission — this is assignment, not routing

`linear_sum_assignment` produces a *perfect matching*: each drone gets at most one mission per
solve. A drone with 90% battery finishing a 2 km mission sits idle until the next solve rather than
chaining a second nearby mission. `_order_route` does TSP **within** one mission's
`target_locations`, never across missions.

This is the largest utilization loss in the system, and utilization is exactly the metric a pilot
partner will define success against (`business/SwarmOps_Business_Overview_EN.md` §7 Phase 2).

Path, in order, so nothing is built on an unproven step:
1. Keep Hungarian as the seed assignment (it is fast and it is already correct).
2. Add a **cheapest-insertion** pass: for each unassigned mission, try inserting it into each
   existing plan's route; accept if the battery-feasibility walk still passes with reserve.
3. Add **or-opt / 2-opt** local search across drone routes to clean up the insertions.
4. Only then consider replacing the whole thing with an OR-Tools multi-vehicle model with battery
   as a `Dimension` — we already have the `ortools` dependency, but this is the step that can
   quietly eat a month, so it goes last and only if 2–3 measurably underperform.

**Sell:** the utilization delta is a chart. "Same fleet, same missions, N% more missions completed."

### 1.3 Battery ignores payload weight — a claim the PRD already makes

PRD §4.2 says battery range "depends dynamically on distance flown **+ payload weight**".
`solver.py:141` is `remaining_range_km = (battery_pct / 100) * max_range_km` — pure linear distance.
`payload_capacity_kg` is on the Drone shape and is **never read by the planner** (confirmed, zero
occurrences).

Model to add: `drain = base_rate(distance) × weight_factor(payload_kg) + hover_rate × loiter_time`
(loiter needs #1). Even a crude coefficient is defensible and closes a gap between what the PRD
promises and what the code does. The Battlecard's §3.2 — *"battery feasibility is genuinely unbuilt
as a commercial product"* — is our strongest claim; it should not have a hole this obvious in it.

**Sell:** "Load it heavier and watch the plan change." Sixty seconds, unarguable.

### 1.4 No battery reserve floor

Nothing stops a plan ending at 0%. A configurable no-go reserve (20% typical) that
`_route_with_charging` treats as the floor rather than zero. One constant plus a config field.
Smallest item on this list and the one most likely to be the *first question* from anyone who has
lost an aircraft.

### 1.5 Match cost prices only the first stop

`_pair_cost:34` takes `mission["target_locations"][0]`. A six-stop mission and a one-stop mission at
the same first waypoint cost identically at match time; the real route is only built afterward in
`_order_route`/`_route_with_charging`. So the Hungarian optimum is over the wrong numbers whenever
missions are multi-stop.

Fix: cost against a cheap lower bound over all stops (nearest-neighbour tour length, or the convex
hull perimeter) rather than the first one. Cheap, and it makes the "global optimum" claim honest.

### 1.6 Re-plan churn

`reconcile.py` re-solves on telemetry events and on a 30s backstop. Nothing in `solve_matching`
penalizes taking a drone off a mission it is already flying, so a small telemetry change can
reshuffle assignments that were fine. Operators tolerate a slightly worse plan far better than a
plan that flickers.

Fix: a stickiness term in `_pair_cost` — a discount for the drone currently assigned to that
mission, sized so a reassignment must be meaningfully better to happen. Also a cheap guard against
solve storms (a partial one already exists as the Mongo solve lock, 2026-08-06).

### 1.7 Euclidean on lat/lng

`_distance:20` is `math.hypot` over lat/lng treated as grid coordinates — a deliberate, documented
choice for the abstract SVG map. It is wrong the day a real aircraft is in the fleet, and
`actual_prod.md`'s first milestone puts one there. Haversine, plus altitude delta, plus (see §3.4) a
wind vector. Isolated to one function; everything else calls through it.

### 1.8 Priority weight is a constant

`URGENCY_WEIGHT_KM = 10` (`solver.py:17`), commented as "tunable; not specified by the PRD". The
roadmap sells per-sector mission-priority weighting as a Year-2 "+15–30% ACV" item
(`Business_Overview_EN.md` §7.1). Make it configurable per organization and per mission type. Small
now; a contract change and a migration later.

### 1.9 No optimality gap

`assignment_quality_vs_greedy:648` reports `greedy_distance / matched_distance`. "Better than the
naive baseline" is a weak claim. A lower bound (LP relaxation, or the unconstrained Hungarian cost
before feasibility filtering) turns it into "within X% of optimal", which is what a technical
evaluator wants.

### 1.10 No deconfliction

Two plans can route two drones through the same point at the same time. PRD §1.3 excluded
ATC-grade collision avoidance; `CLAUDE.md` now says the non-goals are historical. **Scope this
carefully** — the Battlecard's "explicitly do not build" list rules out airspace separation / UTM,
which is High Lander's and Airwayz's licensed territory. What is in scope for us is
*self-deconfliction inside one fleet's own plan*: our optimizer not sending our own two aircraft
through the same volume at the same moment. That is a planning constraint, not an airspace service,
and the distinction must be stated exactly that way in any room.

---

## 2. Product features — general

Not defense-specific. Ordered by demo value per unit of work.

**Two things deliberately not repeated here:** *multi-organization hierarchy* and the
*degraded-comms planner* are already items #4 and #6 on `business/SwarmOps_Competitive_Battlecard.md`
§5's build list. They belong to that document; listing them again here would double-count them when
the team compares the two. A third — a *deadline / ETA panel with miss alerts* — is not a separate
item because it falls straight out of §1.1's time model rather than being work of its own.

**2.1 Extend the what-if simulator.** It exists but takes only `exclude_drone_ids` and
`extra_missions`. Add: toggle a no-fly zone on/off, take a charging station offline, set a drone's
battery to an arbitrary value, and a **side-by-side diff** of the current plan vs. the simulated one
rather than just the simulated result. The endpoint is non-committing already, so this is mostly
frontend plus a wider request body.

**2.2 After-action replay.** Every telemetry event is already stored. Scrub a timeline: fleet
positions, plan revisions, and *why* each re-plan fired (the trigger is already known inside
`reconcile.py`, it just is not persisted as a reasoned record). Near-zero new data model, very high
value for incident review, and it is the twin of §3.6's audit trail.

**2.3 Operator overrides.** Pin a drone to a mission; ground a drone; force a route; forbid a
reassignment. The solver must respect the locks as hard constraints. Every real operator asks "can
I overrule it" within the first ten minutes, and "no" is a bad answer.

**2.4 Predictive fleet health.** Cycle count and flight hours → degradation score → pull a
degrading airframe from the assignable pool *before* it fails. Roadmap Year-2 "deepen" item.
**Note the cheap real-hardware tie-in:** `actual_prod.md` §3.4 C — the DJI smart-battery UART
reader, ~$10, no vendor, no approval — returns real cycle count, per-cell voltages and
state-of-health for every pack we own. That is the one hardware item that feeds a software feature
directly, and it can be done off-sequence at any time.

**2.5 Dynamic / time-boxed no-fly zones.** Zones with active windows and pop-up TFRs, with
mid-flight re-route. Half exists: `reconcile.py` already patches routes in place and the simulator
now picks the patch up. Adding a time window to the zone shape is a contract change to
`fleet-service` (additive).

**2.6 Weather layer.** Wind vector as both a routing cost and a battery-drain multiplier. Pairs
with §1.3 and §1.7. Also the honest half of the story: a headwind leg is where battery estimates
actually go wrong.

**2.7 Mission templates and recurring schedules.** Recurring patrol/inspection cadence rather than
hand-created missions. Straight pilot-workflow need, no algorithmic content.

---

## 3. Defense differentiators — seven researched, plus §3.8

**Selection rules applied:** none of these duplicates the Battlecard §5 list (battery-feasible
assignment · mixed-fleet demo · what-if · multi-org tasking · fleet-migration mode · degraded-comms
replanning · health-informed assignment · Remote ID→TAK ingest). None crosses the Battlecard's
"explicitly do not build" line — no aircraft autonomy, no airspace separation/UTM, no counter-UAS,
no strike coordination, no hardware of our own, no one-operator-many-drones teleoperation. Every one
sits in the planning layer, which is the layer we actually hold.

**[ASSUMPTION] on all seven:** "no competitor sells this" is reasoned from the competitor set
already profiled in the Battlecard (XTEND, Skydio, Auterion, Flock, BRINC, Percepto, High Lander,
Airwayz, FlytBase, eyesAtop/Aitan, Kela). It is **not** the product of fresh research against their
current documentation. §5 lists what to verify. Do not put any of these in front of a buyer as
"nobody does this" until that verification is done.

### 3.1 Coverage freshness as the objective function

Today the planner answers *"which drone visits which point."* A commander does not think in points.
They think: **which parts of my area are currently known, and how stale is that knowledge.**

Build: a persistent coverage state over the operating area — each cell carrying last-observed
timestamp, which sensor observed it, and a confidence that **decays over time**. The planner's
objective becomes *minimize the area's staleness*, not *minimize route distance*. Missions stop
being a list of waypoints and become a standing requirement: "keep this sector under 20 minutes
old."

- **Why it is ours:** it is a change to the objective function of a planner we already own. Nobody
  can bolt it onto a product whose coordination stops at their own hardware.
- **Why defense buys it:** this is the 7 October failure in `Business_Overview_EN.md` §2 stated as
  a data structure — two teams, neither knowing what the other had covered. And it survives
  handoff between shifts, which a route plan does not.
- **The demo line:** a heat map of the area cooling from green to red in real time, and the fleet
  self-tasking to the red. No competitor demo looks like that.
- **Effort:** M. New state store (own collection), new objective term, new map layer. Needs §1.1
  (time) to be meaningful.

### 3.2 Persistent-stare scheduling — continuity across battery swaps

A target or corridor must be **continuously observed**. Aircraft cannot do that; a fleet can. The
scheduling problem is: launch the relief aircraft *before* the incumbent hits reserve, so coverage
never drops, and compute the minimum fleet size to hold a stare for a given duration.

- **Why it is ours:** it is battery-feasibility (§3.2 of the Battlecard, our strongest claim) turned
  from a per-mission check into a *fleet-level scheduling guarantee*. Same engine, harder question.
- **Why defense buys it:** "how many aircraft do I need to keep eyes on this wadi for twelve hours,
  and when does each one launch" is a question a commander asks constantly and currently answers on
  a whiteboard. We can answer it with arithmetic and then execute it.
- **The demo line:** a Gantt of overlapping sorties with the handover windows shaded, and a live
  run where the relief launches on its own.
- **Effort:** M–L. Needs §1.1 (time) and §1.4 (reserve). Charge-time modelling becomes load-bearing.

### 3.3 Attrition-aware planning — plan for losing aircraft

Civil fleet software assumes the fleet it starts with is the fleet it ends with. Defense does not
get that assumption.

Build: **k-resilient assignment.** For a proposed plan, compute whether the mission set still
completes if any *k* aircraft are lost, surface a fragility score per plan, and pre-compute the
fallback assignment so a loss triggers an instant re-task instead of a solve. Then let the operator
plan *to* a robustness target: "no single loss may drop a priority-5 mission."

- **Why it is ours:** it is a property of the assignment problem, which is the thing we own. It has
  no meaning for a product that coordinates one aircraft at a time.
- **Why defense buys it:** it is the difference between software written for inspection contractors
  and software written for people who lose aircraft. It is also legible instantly — one number.
- **The demo line:** kill an aircraft mid-demo. The plan does not degrade; it *steps* to a
  pre-computed alternative, visibly, in under a second.
- **Effort:** M. Re-solve under each single-drone-removal scenario is embarrassingly parallel and
  our solves are fast. `POST /planning/simulate` is already the right shape to build it on.

### 3.4 RF-threat-aware routing — jamming and spoofing as a cost layer

Distinct from the Battlecard's §5 #6 (degraded-comms replanning), which is about *our* link
degrading. This is about **the map**: known jamming, spoofing, and RF-denied areas as a routing
cost, not a binary obstacle.

Build: threat regions with a cost weight rather than an on/off polygon; route to minimize exposure
time; flag any mission that *requires* transiting a denied pocket; keep dead-reckoning viability in
the feasibility check (a drone that loses GPS mid-leg must still be able to get home); and
comms-relay awareness — keep at least one aircraft positioned to hold the link for the ones deeper
in.

- **Why it is ours:** `_bypass_route` (`solver.py:326`) is already a visibility-graph shortest path
  over polygon obstacles. Weighted-region routing is the same algorithm with a cost surface instead
  of a hard blocker. This is genuinely the cheapest of the seven relative to its sales value.
- **Why defense buys it:** GPS jamming is a daily condition in our home market, not a scenario.
  Every buyer we can reach has personally flown into it.
- **The demo line:** the same mission planned twice, with and without the EW layer, and the two
  routes are visibly different. Then the honest part: "here is the mission we told you not to fly."
- **Effort:** M. Contract change: no-fly zones gain a cost weight and a type (additive to
  `fleet-service`'s shape — cross-team, flag it in `plan.md`).

### 3.5 EMCON planning — a fleet that must not be detected

Commercial drone software wants the aircraft to be **maximally** visible and connected — Remote ID,
constant telemetry, live video. A military operator frequently wants the exact opposite.

Build: signature-aware routing (route and altitude choices that reduce acoustic and RF exposure
near known enemy observation positions), plus **radio-silence windows** — the aircraft flies a
pre-loaded plan with the downlink off and reports on egress, and the planner accounts for the fact
that it will be flying blind and unre-taskable for that window.

- **Why it is ours:** it is a constraint on the plan, not a property of the airframe. Any aircraft
  can fly a quiet profile if something computes one for it.
- **Why defense buys it:** it is the most obviously non-civilian feature on this list, and it
  signals we understand the customer rather than reskinning a delivery product.
- **The demo line:** the drone goes dark on the map for a planned window and comes back exactly
  where the plan said it would. That moment lands.
- **Honest caveat:** signature modelling without real acoustic and RF measurement is an
  approximation, and we should say so. The *planning* structure is real; the coefficients need
  field data we do not have.
- **Effort:** M–L. Needs §1.1 (time). Depends on threat-position data we do not currently ingest.

### 3.6 Authority-scoped tasking with a signed order trail

Every product in the Battlecard has user roles. **None models command authority.** Those are
different things: a role says what a user may click, authority says who may commit *this* aircraft
to *that* task over *that* ground, and who signed for it.

Build: authority scopes attached to zones and mission classes; plans above a threshold require
sign-off before dispatch; every issued order carries an immutable record — who tasked it, who
approved it, at what time, on what information the system held at that moment. Exportable as an
after-action package.

- **Why it is ours:** it is a property of the tasking layer. A product that only flies aircraft has
  nowhere to put it.
- **Why defense buys it:** accountability artifacts are a procurement checkbox, not a nice-to-have,
  and this one is genuinely hard to retrofit. It also pairs directly with §2.2's replay — the same
  record, read forwards for review and backwards for accountability.
- **The demo line:** "here is exactly what the commander knew at the moment they approved it." That
  sentence sells to a buyer who has sat through an inquiry.
- **Effort:** M. Touches `auth-service` (scopes) and `planning-service` (gate + record). Contract
  change, cross-team.

### 3.7 Edge tasking — the plan reaches the person on the ground

The Battlecard's §5 #8 proposes TAK **ingest** (Remote ID → our picture). This is the reverse
direction, and it is the more valuable one.

Build: push the plan *out* to the edge — an ATAK plugin or a lightweight handheld view where the
dismounted user sees which aircraft is theirs, its ETA, its remaining time-on-station, and can
**request a look**. That request enters the optimizer as a new mission with a priority, gets
resolved against everything else in flight, and comes back accepted-with-an-ETA or refused-with-a-
reason (the `_unresolved_reason` machinery at `solver.py:522` already produces exactly that
sentence).

- **Why it is ours:** we are the only layer that *can* answer "no, and here is why, and here is when
  instead." That answer requires knowing the whole fleet's commitments, which is precisely what
  nobody else's product knows.
- **Why defense buys it:** it turns the platform from an ops-room console into something the actual
  consumer of the ISR touches — and the consumer requesting directly is the coordination failure in
  §2 of the business overview, closed.
- **The demo line:** a request goes in from a phone; the fleet re-plans; the phone gets an ETA. End
  to end, on stage, in fifteen seconds.
- **Effort:** M. New consumer surface, no new algorithm. TAK/CoT format work is the bulk of it.

### 3.8 Sensor footprint on the map — draw what each drone can actually see — **APPROVED**

**Tony's, 2026-08-25.** Every drone on the map renders as a point. A point tells an operator where
the aircraft *is*. It says nothing about what it can *see* — which is the only reason the aircraft
is up there. Draw the ground footprint instead: a wedge (or a quad, see below) projected from each
drone in 2D, showing its actual sensor coverage right now.

This is small, immediately legible, and it is the **visual and data primitive that §3.1 needs.**
Coverage freshness is exactly "the union of these footprints over time, decaying" — so building
this first makes §3.1 a much shorter step, and this is worth doing on its own merits even if §3.1
is never built.

**What the system can support today, honestly:**

| Input needed | Have it? |
|---|---|
| Position | ✅ `TelemetryEvent.position` |
| **Heading** | ❌ **nowhere in the system.** Derivable — see below |
| **Altitude** | ❌ **not in any model.** The whole system is 2D today |
| **Sensor FOV / range** | ❌ no sensor spec on the Drone shape at all |
| **Gimbal yaw/pitch** | ❌ not modelled; the Unity camera has a real transform that could publish it |

Confirmed 2026-08-25: `swarmops-contracts/src/telemetry-event.ts` is `drone_id, timestamp,
position, battery_pct, event_type` — nothing else. Zero hits for `heading`, `altitude`, `yaw` or
`fov` across contracts, fleet-service models and telemetry-service models.

**So build it in three steps, cheapest first — each is useful alone:**

1. **Derived heading, fixed cone. No contract change.** Heading comes from the vector between the
   drone's last two known positions, which the frontend already holds (and the planner holds the
   whole route, so heading is known ahead of time for a drone flying a plan). Cone half-angle and
   range as frontend constants first. This is an afternoon of SVG in `LiveMap` and it already looks
   right on a demo. Caveat to keep in mind: a hovering or loitering drone has no movement vector,
   so heading is undefined — hold the last known heading and say so.
2. **Real sensor spec per drone.** Add `sensor: { fov_deg, range_km, type }` to the Drone shape in
   `fleet-service` — additive, but a cross-team contract change, so `plan.md` sync point. Now a
   thermal drone and an optical drone draw *different* footprints, which is the point: it makes
   payload heterogeneity visible, and heterogeneity is our whole thesis (Battlecard §3.1).
3. **Altitude and gimbal.** Adds the real footprint — a quad on the ground from a pitched gimbal at
   a known altitude, not a flat wedge from the airframe. Needs altitude in the data model, which
   the system currently does not have anywhere, and a gimbal orientation the Unity simulator can
   publish and a real aircraft's SDK genuinely provides. **This step is large enough to be its own
   item — see §3.9, which supersedes it.**

**Why it is worth more than it looks:**
- **It exposes what the planner is actually optimizing.** Right now the map shows routes; it does
  not show *coverage*. A commander looking at overlapping footprints can see redundancy and gaps
  instantly — that is the §2 coordination failure made visible with no algorithm at all.
- **It makes every other feature demo better.** Attrition (§3.3) shows a hole opening in coverage,
  not just an icon disappearing. RF-threat routing (§3.4) shows the sensor swinging away from a
  threat area. Persistent stare (§3.2) shows the relief footprint overlapping the incumbent's
  before it leaves.
- **It sets up the honest version of the coverage claim.** Once footprints are drawn, "we swept
  this area" becomes checkable rather than asserted — including checkable *against us*, which is
  the right way round.
- **[ASSUMPTION] on differentiation:** sensor-footprint overlay is **not** exotic — ISR and mapping
  products draw it, and a footprint on a map is likely present in several of §1's competitors.
  **Do not sell this as a differentiator on its own.** What is plausibly unclaimed is footprint
  *accumulated and decayed over time as the planner's objective* (§3.1). Draw the polygon because
  it makes the product legible and unblocks §3.1 — not because it is novel.

**Effort:** step 1 is S (frontend only). Step 2 is S–M plus a contract change. Step 3 is M and
needs a data-model addition the system has never had.

### 3.9 Controllable gimbal + true visible area, computed against real terrain — **APPROVED**

**Tony's, 2026-08-25.** Supersedes §3.8 step 3. Two halves, and the second is the valuable one:

**(a) Make the simulator's camera controllable** — gimbal yaw and pitch slewable from the frontend,
and altitude a real, varying quantity rather than a constant hover offset.

**(b) Compute what the drone can *actually* see from that** — the true ground polygon, **including
dead spots**: area inside the camera frustum that is hidden behind a ridge, a building, or the
aircraft's own body, and area the gimbal physically cannot reach.

**Why this is unusually cheap here, and it is not obvious until you look:** the simulator already
has everything the computation needs and publishes none of it.

| Needed | Already in the sim |
|---|---|
| A real camera with a real FOV | ✅ `CameraFeedStreamer.cs:70` — `_fpvCamera`, a `Camera` with a `targetTexture`. `fieldOfView` is on it. |
| Real 3D terrain to occlude against | ✅ `TelemetrySimulator.cs:290` — `Terrain.activeTerrain.SampleHeight` |
| Real altitude per drone | ✅ `TelemetrySimulator.cs:232` — `GroundHeight(groundPoint) + hoverHeight + bob`. **Computed every frame and thrown away.** |
| Gimbal orientation | ❌ not modelled — the camera is rigidly parented |
| Any of it leaving Unity | ❌ none of it is published anywhere |

So the sim is not missing the physics. It is missing a publisher and a gimbal joint.

**How to compute the visible polygon (start coarse, it is good enough):**
1. Project the camera frustum's four corner rays onto the terrain (`Physics.Raycast` against the
   terrain collider) → the ground quad. If a ray misses — camera near-horizontal, ray goes to the
   horizon — clamp it at the sensor's max usable range rather than returning an unbounded shape.
2. Cast a coarse grid inside the frustum (16×16 = 256 rays per drone per tick is nothing) and
   classify each sample **visible** or **occluded** by whether the ray's first hit is at the
   expected ground point or short of it. The occluded samples *are* the dead spots.
3. Simplify to a polygon with holes and publish that — **8–16 vertices, not a raster.** Bandwidth
   discipline matters here; this is per-drone, per-tick.

A GPU depth-pass reprojection is the more accurate version and is worth knowing about, but do not
start there — the raycast grid is simpler, debuggable, and visibly correct at demo resolution.

**Dead spots that are real and worth modelling explicitly:**
- **Terrain masking** — behind the ridge. The one everybody recognizes, and the whole reason a
  commander cares.
- **Gimbal limits** — a real DJI gimbal pitches roughly straight down to a little above horizontal;
  it cannot look up or behind. So there is a permanent blind cone the aircraft simply cannot see,
  and drawing it is honest in a way a full-coverage circle is not.
- **Self-occlusion** — the airframe, arms and props in frame. Minor, but free once raycasting.
- **Range floor and ceiling** — below a minimum altitude the footprint is uselessly small; past a
  maximum slant range the pixels-per-metre stop being enough to identify anything. Coverage is not
  binary and pretending it is oversells us.

**Transport — do not put this in `TelemetryEvent`.** That shape is locked, cross-team, and already
the highest-traffic message in the system; adding a polygon to it would be a contract change
touching four services for something only the frontend and the coverage store consume. **Follow the
camera-feed precedent instead:** `cameraFeed.ts` deliberately never touches RabbitMQ or the
telemetry schema, and that call has held up well. A separate footprint channel, same shape of
decision.

**The control half is a bigger deal than it looks.** Today nothing commands a drone — the planner
writes routes, the simulator polls and adopts them. Slewing a gimbal from the UI is the system's
**first real downlink command**, which means a command channel, command authority (§3.6 lands
directly on top of this), and an acknowledgement path. Worth building for that reason alone. But
state the real-hardware cost honestly: on an actual aircraft, camera control is
`actual_prod.md` §2's **Control** column — Enterprise SDK, vendor cooperation, the expensive half.
Sim-side gimbal control is cheap; real-side is gated, and we should never let a demo blur the two.

**What it buys:**
- **§3.1 becomes real rather than geometric.** Coverage freshness accumulated from *true* visible
  polygons is a defensible claim. Accumulated from idealized cones it is a nice picture.
- **"Dead spot" is a word every operator already owns.** Showing a commander the parts of their
  area nobody can see, and then having the planner task to close them, is a complete story told in
  one screen.
- **§3.5 (EMCON) is the same computation inverted** — "where can I not be seen from" is a
  visibility query against the same terrain. Build one, get most of the other.
- **It transfers to real hardware.** DJI's SDKs expose gimbal attitude and altitude, so the adapter
  publishes the same fields and the same math runs. This is not sim-only theater — worth saying,
  because a sharp evaluator will ask exactly that.

**Honest limits:** dead spots are only as true as the terrain model. Unity's terrain is our terrain,
not the world's — on real hardware this needs a real DEM/DTM for the operating area, and buildings
and vegetation are not in either model today. Say "terrain-masked", not "everything that blocks
line of sight."

**Effort:** M–L. Unity gimbal + footprint computation, a new publish path, a new frontend layer, a
command channel, and a coverage store if §3.1 follows. Contract change: additive, but new.

### 3.10 Real DJI airframes in the simulator, with their published specs — **APPROVED**

**Tony's, 2026-08-25.** The simulated fleet is generic drones with invented numbers. Make them
**actual models** — Mavic 3E, Matrice 30T, Matrice 350 RTK, Mini 4 Pro, Autel EVO Max 4T — each
carrying its manufacturer's published endurance, speed, payload and sensor specs.

**Why it is worth more than realism polish:**

- **It is the mixed-fleet demo, for free.** Battlecard §5 #2 calls one DJI + one Autel + one FPV on
  one console *"the single most persuasive 90 seconds we could show anyone"* — and prices it at
  real adapters and real hardware. A simulated version of that same screen costs a data file. It is
  not the same claim and must never be presented as one, but it is the same *picture*, available
  now, and it is what makes heterogeneity legible.
- **It kills invented numbers.** Every spec on screen becomes checkable by anyone in the room who
  flies these aircraft — which, in our two reachable accounts, is everyone.
- **It exposes a real modelling error, which is the most valuable part.** See below.

**The modelling problem real specs force us to confront:** our Drone shape has `max_range_km`
(PRD §6). **No manufacturer publishes range.** They publish **flight time in minutes** and **max
speed**, because endurance is what a battery actually bounds and range is a derived, conditional
quantity — hover burns endurance at zero range, wind changes it, payload changes it, and the return
leg has to come out of the same budget.

So importing real specs means either deriving `max_range_km ≈ endurance × cruise_speed` (defensible,
and immediately wrong for any loitering mission) or **moving the model to endurance-minutes as the
primitive**, which is what operators think in and what §1.1 needs anyway. Real specs make §1.1 not
optional. That is the finding, and it is worth having before someone builds on the current shape.

Two more that fall out of the same import: **`payload_capacity_kg` is currently never read by the
planner** (§1.3), and real specs give it teeth — an M350 carries ~2–3 kg, a Mavic 3E effectively
nothing, so payload capability stops being a uniform field. And the manufacturers publish
endurance *with and without* payload for the heavy-lift models, which is exactly the coefficient
§1.3's drain model needs, sourced rather than guessed.

**Sourcing discipline — this is the part that must not be skipped.** Every number goes in tagged
**[SOURCED]** with a link to the *manufacturer's own* specification page, dated. Not from memory,
not from a review site, not from a reseller listing. `business/SwarmOps_Competitive_Battlecard.md`
records what happened the last time a spec came from a secondary source: DroneDeploy's pricing was
off by ~12× because the source was a competitor's marketing. **The same failure mode is available
here and it is worse, because a buyer who flies an M30T knows its endurance by heart.**

Two specific traps: vendors quote **max** flight time in ideal hover with no payload and no wind
(the real operational figure is meaningfully lower — model a de-rate factor and label it as ours,
not theirs), and specs differ **per battery variant and per region**, so record which one.

**Shape:** a versioned catalog — `airframes.json` or similar, one entry per model, in whichever repo
owns fleet data — carrying endurance, cruise and max speed, payload capacity, sensor package
(FOV, thermal or not, zoom), gimbal pitch range (which §3.9 needs), and vendor + SDK-availability so
it lines up with `actual_prod.md` §6's compatibility table. Seeding a demo fleet then means picking
real models, not typing numbers.

**Do not let this become a claim we have not earned.** A simulated M30T is a simulated M30T. The
line is: *"these are the real aircraft our customers fly, with their published specs, and here is
the adapter work that connects to the physical ones"* — pointing at `actual_prod.md`, not past it.

**Effort:** S for the catalog and the seed data. M if it triggers the endurance-vs-range model
change, which it should.

### Where they sit against each other

| # | Feature | Effort | Depends on | Defense pull | Demo punch |
|---|---|---|---|---|---|
| **3.8** | **Sensor footprint (step 1)** | **S** | — | Medium (not novel alone) | **High, per unit of work** |
| **3.10** | **Real DJI airframes + specs** | **S** (M if it moves the model) | — | Medium–High | High |
| **3.9** | **Gimbal control + true visible area** | **M–L** | §3.8, terrain | High | **Highest** |
| 3.4 | RF-threat routing | M | §1.7 | Highest | High |
| 3.3 | Attrition-aware planning | M | `/simulate` | High | **Highest** |
| 3.1 | Coverage freshness | M | §1.1 | High | High |
| 3.2 | Persistent stare | M–L | §1.1, §1.4 | High | Medium |
| 3.7 | Edge tasking | M | — | Medium–High | **Highest** |
| 3.6 | Authority + order trail | M | §2.2 | Procurement gate | Low |
| 3.5 | EMCON | M–L | §1.1, threat data | Medium | Medium |

---

## 4. Build order

Sequenced so nothing is built on an unproven step, and so something is demoable early.

**Wave 0 — the two things worth doing before deciding anything.**
`§3.8` step 1 (derived-heading sensor cone) and `§3.10` (real DJI airframes + specs). Both are
small, neither depends on anything else here, and both make every subsequent demo read better.
`§3.10` also surfaces the endurance-vs-`max_range_km` question early, which is exactly when you
want it — before Wave 1 builds on the current shape.

**Wave 1 — the foundation everything else needs (§1).**
`§1.4` reserve floor → `§1.3` payload-aware drain → `§1.7` haversine → **`§1.1` time**.
Wave 1 ends with a planner that knows *when*, which four later items require. `§1.5` and `§1.6` fold
in here as small independent cleanups.

**Wave 2 — the utilization number.**
`§1.2` multi-mission chaining, via the four-step path in that section. Ends with a measurable
utilization delta against the pre-change system — capture the before number *before* starting.

**Wave 3 — the defense demo.**
`§3.3` attrition-aware (cheapest big punch, builds on `/simulate`) → `§3.4` RF-threat routing
(cheapest relative to sales value) → `§3.9` gimbal control + true visible area → `§3.1` coverage
freshness, which `§3.9` makes defensible rather than geometric. Plus `§2.2` replay and `§2.3`
operator overrides, which are both small and both asked for immediately.

**Wave 4 — procurement and reach.**
`§3.6` authority trail, `§3.7` edge tasking, `§3.2` persistent stare, `§3.5` EMCON.

**Off-sequence, do whenever:** `actual_prod.md` §3.4 C — the $10 smart-battery UART reader. It is
the cheapest real capability we have available and it feeds `§2.4` predictive health directly.

**Ownership:** not assigned here. `plan.md` §1 holds the ownership tracks; this document should be
reconciled against it before work starts, and any item that crosses a track boundary (§1.1, §3.4,
§3.6 all change shared contracts) goes through `plan.md`'s sync points rather than being changed in
one service and discovered by the others at integration.

---

## 5. Verify before selling any of §3

The Battlecard's source discipline applies. Each of these is a claim that a competitor could
falsify in a meeting:

1. **Does FlytBase, our closest peer, do any of the seven?** They are genuinely multi-vendor and
   they ship today. They are the most likely falsifier.
2. **Does XTEND's XOS already do §3.3 or §3.5?** They have a $20M Israeli MoD multi-drone-OS
   contract and a defense-native product. If any of the seven is already in XOS, it is that one.
3. **Does Auterion Nemyx do §3.4?** Ukraine deployment at scale means they have met jamming for
   real. Assume they have *something* until shown otherwise.
4. **§3.7 — is there an existing ATAK plugin that already does drone task-request?** The ecosystem
   is mature (`djicot`, `DroneCOT`, the UAS Tool plugin are already in the Battlecard). Check
   before claiming the direction is empty.
5. **§3.1 — search the literature, not just products.** Persistent-coverage and information-decay
   planning is an established academic area; the claim that must hold is that no *product* sells
   it, which is the same shape as the Battlecard's §3.2 finding and should be established the same
   way.
6. **§3.6 — is authority-scoped tasking already a requirement in an Israeli MoD spec?** If it is a
   stated requirement rather than an unmet need, it is a gate we must pass, not a differentiator we
   can sell.
7. **§3.8 — assume the footprint overlay is NOT novel** until shown otherwise; ISR and mapping
   products draw sensor footprints routinely. It earns its place by unblocking §3.1 and by making
   the product legible, not by being unclaimed. The claim to verify is the §3.1 one — coverage
   *decay as the objective* — not the polygon.

Also honest internally: **§1.1's absence means we should stop calling the system a VRPTW variant**
until time windows exist. It is in `CLAUDE.md` and it is not true today.

---

## 6. Account-shaped wedges — FURTHER DISCUSSION

**Opened 2026-08-25 (Tony): "like it — add to further discussion."** A third bucket, distinct from
both approved and decide-later. **Everything in §1–§3 is a *feature*. This section is a *wedge* —
an answer to "why would this specific customer buy anything at all."** Different kind of decision,
so it is tracked separately and it is not something anyone starts building.

The gaps below are **not invented.** Each is quoted from
`business/SwarmOps_Competitive_Battlecard.md` §6, which is the research on the two accounts we can
actually reach. That is the reason to take this section seriously relative to the rest of the
document.

### 6.1 Unilateral deconfliction at company level — the IDF wedge

**The problem, in the IDF's own shape:** four units flying Mavics over the same square kilometre.
What stops them colliding, and what decides who covers what. Battlecard §6.2: *no published
doctrine, tender, C2 system or after-action document describes how simultaneous tactical drone
flights are coordinated between units* — plus a founder's first-hand account. The 55th Brigade
buying 100+ of its own drones outside the central pipeline proves the fleet exists **below** where
the primes operate: Dominion-X guides weapons, Fire Weaver picks effectors, Torch-X coordinates
fires. **None of them is about keeping cheap quads usefully tasked at company level.**

**Why every attempt at this dies, and this is the actual insight:** coordination software is
worthless until everyone adopts it. Unit A installs it, sees nothing, uninstalls. The gap is open
not because nobody thought of it but because nobody can bootstrap it.

**What breaks that, and we already have it written down:** `actual_prod.md` §3.4 A — **DJI DroneID
is unencrypted and broadcast.** Every DJI aircraft airborne announces serial, position, altitude,
velocity, **home point and operator position**, whether or not its unit has ever heard of us.

**So one unit installs and immediately sees the other three units' aircraft. The other units
install nothing, agree to nothing, procure nothing.** Unilateral value from a coordination product,
which is not supposed to be possible — the picture improves as more units join, but it is never
worthless, and a single company commander can adopt it without anyone's permission.

Day one, with no integration with anybody:
- Every drone in the sector on one screen, including ones we neither own nor can talk to
- Collision warning between our aircraft and a neighbouring unit's, with no link between the units
- Coverage overlap — two units sweeping the same wadi while a third area is uncovered, which is the
  7 October failure exactly
- Operator position, which DroneID also broadcasts — so the commander knows *who* to raise on the
  net, not just that something is up there

**The line that must be drawn precisely, or we walk into High Lander's licence:** this is **not
UTM.** UTM is regulated *civil* airspace separation, and it is licensed. Tactical unit-to-unit
deconfliction inside an operation is neither civil airspace nor inside anyone's licensed scope. The
Battlecard's "explicitly do not build airspace separation" still stands — what this is, is a
**situational picture for the operator**, not an authorization service. Say it in exactly those
words.

**Cost:** SDR-class hardware (~$300+, AntSDR E200 class), `dragonsdr_dji_droneid` publishes decoded
output over ZMQ, straight into the existing `POST /telemetry/events`. Adapter work, not a rebuild —
§1 of `actual_prod.md` is the reason.

**Two blockers, both real:**
1. **`actual_prod.md` §8 open question 7 — is passive DroneID reception lawful to operate as a
   product in Israel?** Unverified. It gates the whole wedge and it is a question for a lawyer, not
   for us.
2. **Do not tell an IDF room there is no coordination system** (Battlecard §6.4). Ask whether one
   exists and whose problem it is considered to be. If the answer is "nobody's", that is the single
   most valuable sentence available to this company, and it costs one conversation.

### 6.2 Incident dispatch with a return guarantee — the Police wedge

Battlecard §6.1 states the gap as a question to ask the contact directly: *when the Police flies its
own 16 models from 3 manufacturers at a **real incident** — not a marathon with a pre-planned route
— what decides which aircraft goes to which call, and what tells the commander whether it has the
battery to get there and back?*

Airwayz answers *where may it fly*. ORION answers *launch my box*. **Nobody answers that question,
and it is the only question our product answers.**

**The feature:** a call comes in; the system picks from the mixed fleet by capability (thermal vs
optical vs zoom), by ETA, and by battery-to-get-there-and-back-with-reserve — and **refuses** the
aircraft that cannot make it, with the reason. That is §1.1 (time), §1.4 (reserve) and the existing
battery engine pointed at a dispatch decision instead of a planning run.

**Position with Airwayz, not against** — they keep the airspace, we do the assignment. And ask what
their standing arrangement actually is, because we do not know whether the Feb 2022 Marathon
deployment was a contract or an event.

**The pipe already exists by law.** CAAI Regulation 10916: any drone ≥200 g must be connected to
and continuously communicating with an authorized UTM network, and that data is shareable on
request with the police, the military and homeland-security bodies. **We do not need to build a
data-sharing agreement. We need to build the thing that uses the feed to decide who flies what.**

**The ask, per Battlecard §6.4:** not a sale — a scheduled-event pilot on the Marathon pattern,
where our layer does the assignment. Events are the lowest-risk way in: airspace is pre-coordinated
and the failure mode is embarrassment rather than an operational loss.

### 6.3 Battery locker readiness — the unglamorous one

A unit with forty packs in a room has no idea which are charged, which are degrading, and which are
about to fail mid-sortie. `actual_prod.md` §3.4 C: a **$10 USB-UART adapter** on a DJI smart
battery's gauge pads returns state of charge, per-cell voltages, cycle count, temperature and
health — **with the battery off, no drone, no vendor, no approval.**

No wow in a pitch. But every drone operator has been burned by it, it feeds §2.4 predictive fleet
health directly, and it is the kind of detail that makes an operator believe we have actually
flown. Already noted as off-sequence in `actual_prod.md` §7 — do it whenever.

### 6.4 Also parked from the same discussion — three big swings

Not written up; recorded so they are not lost. Each has a real academic literature and research
code, and **no commercial product** — which is the same shape as the Battlecard's strongest finding
(§3.2: literature rich, products absent), and a far safer claim than "nobody thought of this."

- **Inter-org capacity market.** Each organization runs its own planner and they exchange *bids*,
  not control — "thermal look at grid X within 10 minutes" priced by what serving it would cost the
  responder in bumped missions and burned battery. Nobody reveals fleet, plan or intent. Fits us
  because `_pair_cost` + `_unresolved_reason` already computes that number — **the bid is the delta
  in our objective function.** Prior art: Contract Net, Dias & Stentz, combinatorial auctions for
  MRTA. Highest risk (needs multi-org plus two willing organizations), biggest framing: airborne
  capacity as a tradeable resource, which is a business model rather than a feature.
- **Adversary-aware patrol scheduling.** Measure how predictable a patrol pattern is, show where an
  adversary would move through it, and generate a randomized schedule that holds expected coverage
  while destroying exploitability. Prior art: Stackelberg security games (Tambe/Teamcore; fielded at
  LAX, US ports, air-marshal scheduling). Applied to airborne fleet tasking, not a product. **The
  best demo of the three** — telling a commander something true and uncomfortable about their own
  current operation beats any feature list.
- **Counterfactual value ledger.** Store, per plan issued, what would have happened under the manual
  or naive alternative; accumulate into flight hours saved, battery incidents avoided, coverage gaps
  closed faster — computed from real execution rather than asserted in a slide.
  `assignment_quality_vs_greedy` (`solver.py:648`) is already a primitive version. Cheapest by far,
  lowest wow, highest odds of closing a renewal.
