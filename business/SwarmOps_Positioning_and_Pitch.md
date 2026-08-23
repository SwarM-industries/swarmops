# SwarmOps — Positioning Against FlytBase and eyesAtop, and How to Pitch It

**Internal working document, opened 2026-08-19.** Answers four questions in order: how we differ
from the two companies closest to us, where the edge actually is, what to **build** that neither
has, and how to say it to **the army** and to **investors** — which are two different pitches and
should not be the same slides.

Companions: `SwarmOps_Competitive_Battlecard.md` (the full field, money, contracts),
`SwarmOps_Competitor_eyesAtop.md` (the deep profile), `SwarmOps_Drone_Fact_Pack.md` (counts,
platforms, facts).

Source discipline unchanged: **[SOURCED]** / **[MODELLED]** / **[ASSUMPTION]** / **[PRIMARY]**.

---

## 0. The finding this whole document rests on

**[PRIMARY — three observers, one line infantry unit, Dec 2025 and Aug 2026]:**

- Tony flew drones in an infantry unit (~Dec 2025). **DJI and Autel only — Mavic, Matrice, EVO.**
  Each aircraft with its own OEM controller and its own operator. **No unified control or
  coordination system of any kind, in his unit or in the others he saw.**
- **August 2026:** an **officer** and a **drone pilot** from the same unit — **still no system for
  controlling or coordinating drones, and neither recognises the name "Ronen"** (eyesAtop/Aitan's
  product, the market-leading system).
- **August 2026:** a **drone specialist described as one of the IDF's leading experts** — **also
  did not recognise "Ronen."** This one is not another unit-level data point; it is the person
  whose job is to know what is fielded across the force, so **"wrong unit" stops explaining it.**

**What that licenses us to say, exactly:** *"As of August 2026 we asked four people — one who flew
these drones in service, a pilot who flies them now, an officer who commands, and one of the IDF's
leading drone specialists. None described a coordination system in use. None recognised the
market-leading product by name."*

**What it does not license.** It says nothing about the Digital Bat programme or about the specific
reconnaissance and special units where the sourced material places eyesAtop. **Never say "the IDF
has no drone coordination system."** Say the sentence above — narrower, checkable, and stronger
*because* it is bounded.

**The open question is now closed — and it closed in the best possible way.** The concern was that
an expert not recognising a *name* might only mean the system is designated differently in service.
So Tony described **the capability** rather than the name — one controller flying several drone
types from different manufacturers, shared feeds, coordinated tasking.

**The capability was also unfamiliar. And the specialist asked to test SwarmOps in his unit — a
drone R&D unit.** [PRIMARY, 2026-08-19]

Two consequences, and the second one changes what this company is doing next:

1. **Reading (A) in `SwarmOps_Competitor_eyesAtop.md` §5.0a is supported.** It is not a naming
   artifact. A leading IDF drone specialist did not recognise the capability, described in plain
   terms, with no name attached. **The gap is real.**
2. **We have an inbound pilot request from inside the customer.** See §9.

**Why this is the whole business case in one paragraph:** the volume tier of the Israeli drone
estate is COTS quads at line-unit level (`SwarmOps_Israel_Drone_Landscape.md` §1.3a). The best-
funded competitor is deployed in the specialist tier and has not reached the volume tier. **The fat
part of the distribution has nothing in it, right now, confirmed by people inside it.**

---

## 1. The three-way comparison

Read this column-wise. The row that matters most is **"shape of the fleet it serves."**

| | **FlytBase** | **eyesAtop / "Ronen"** | **SwarmOps** |
|---|---|---|---|
| **What it sells** | Enterprise software platform | Software + universal controller + edge AI compute | Software only |
| **Primary buyer** | Industrial / critical infrastructure | Defense (IDF, expanding to US + allies) | **Defense — the market thesis. Public safety — the fast reference customer** (§8) |
| **Aircraft assumption** | Docked drone-in-a-box + some piloted | Aircraft the customer already has, 20+ types | Aircraft the customer already has, unmodified |
| **Physical footprint** | Docks, nests, fixed site infrastructure | **New hardware in the operator's hands** | **None** — no dock, no new controller |
| **Shape of the fleet it serves** | **One site, several aircraft, no operators** | **One crew, several aircraft, one operator** | **Many operators, one aircraft each, many units** |
| **Human role** | Removed (autonomous site patrol) | **Consolidated** — 3–4 soldiers become 1 | **Kept, but directed** — the human still flies; the system decides *what* and *whether it is possible* |
| **Core algorithm** | Automation + workflow + AI anomaly detection | Multi-drone C2, edge autonomy, kill-chain compression | **Assignment + sequencing + battery-feasible routing** |
| **Time constant** | Continuous, scheduled patrols | **Minutes** — identification to strike | **Hours** — fleet workload, coverage, endurance |
| **Battery** | Logged (health, cycles, assignment records) | **Not mentioned in any source** | **The binding constraint the planner solves against** |
| **Connectivity** | Cloud, site network | Edge AI, designed for disconnected tactical use | **Cloud/K8s today — a real gap, see §3.3** |
| **Scope** | Industrial inspection & security | Surveillance, logistics, **strike**, ISR | **Observation-and-carry quads — current phase.** Other classes kept as future R&D reference, not closed off (Landscape §0, amended 2026-08-19) |
| **Sequencing** | n/a | n/a | **Defense-first, confirmed 2026-08-19** — see §8 |
| **Business model** | SaaS, custom enterprise pricing | "Mission-ready capability packages" — solution sales | Undecided — seats vs per-aircraft (`Market_Sizing` §3.2) |
| **Scale today** | ~$10.8M ARR, ~98 people | 500,000+ combat flight hours, ~50 people, national MoD contract | Pre-revenue, 4 people |

---

## 2. Where we honestly do NOT differ

Put this first, because a pitch that claims eight differentiators and has two is worse than a pitch
that claims two. **Every item below is something we might be tempted to say and should not.**

- **"Vendor-neutral / manufacturer-agnostic."** FlytBase's headline claim. eyesAtop's founder says
  it almost word-for-word. Auterion says it. **This is table stakes now, not a differentiator.**
- **"One screen for the whole fleet."** Everyone has a multi-drone console.
- **"AI-powered."** Universal, meaningless, and in eyesAtop's case backed by 500,000 hours of real
  operational data we cannot match.
- **"Live video from every aircraft."** Solved, commoditised, and not our layer.
- **"Real-time re-planning when things change."** FlytBase re-tasks. eyesAtop re-tasks. The
  differentiator is not *that* we re-plan, it is *what constraint we re-plan against* (§3.1).
- **"Built by people who served."** True, and worth saying once for credibility — but eyesAtop's
  founders have a war story that cannot be competed with and should not be competed with.

---

## 3. Where the edge actually is — four claims

> **Which of these is load-bearing — revised 2026-08-19, Tony's framing and it is the better one.**
>
> An earlier version of this section ranked **battery feasibility (§3.1) first** because it is the
> claim nobody contests. That confused *the strongest evidence* with *the strongest position*.
>
> **The category claim is §3.2: coordination between independent single-drone operators.** That is
> what we are, and it is structural. Battery feasibility is the **mechanism** — the reason our
> coordination is worth anything rather than a shared map — but a funded competitor could add
> battery-aware planning in a quarter. **No competitor can easily change what shape of fleet their
> product is built for.** eyesAtop's entire value proposition is *three or four soldiers become
> one*: it exists to shrink a crew. A product built to consolidate operators cannot pivot to
> coordinating a hundred of them without becoming a different product with a different buyer.
>
> **Copyable vs structural is the right axis.** §3.1 is defensible and demoable and should be shown
> — it is the proof the coordination is real. **§3.2 is the position, and it goes first.**
>
> **The precision that keeps §3.2 true, and it must travel with the claim:** coordination *between*
> independent operators is not unowned — **Airwayz and High Lander do it, under a CAAI licence, as
> airspace separation.** Airwayz has run **20 drones from 5 companies** in one urban airspace and
> **70+ vendors** at the Port of Rotterdam. What nobody does — what is inside no licensed scope and
> no shipped product — is ***task assignment* between independent operators**: deciding who covers
> what, in what order, and whether they can finish. **Say "task assignment," never just
> "coordination."** The unqualified version is falsifiable in one search; the qualified version is
> true.

Ordered below by evidence strength, not by importance — see the box above.

### 3.1 We plan against battery feasibility. Nobody else does.

**The single strongest technical claim we have, and the only one nobody contests.**

- Absent from every description of Ronen across six independent sources.
- Fleet platforms track battery **health, charge cycles, storage temperature, assignment records** —
  maintenance and compliance, not planning [SOURCED].
- The research literature states the gap in its own words: *"current route optimization programs
  lack the ability to model the operational challenges of drone delivery, such as battery capacity,
  drone reuse, no-fly zones and multiple charging depots"* [SOURCED].

**Why nobody built it:** if you own the aircraft, feasibility is a firmware problem solved per
aircraft. It only becomes hard — and only becomes *software* — when the fleet is mixed and the
aircraft are not yours. **Our weakness (no hardware) and our differentiator are the same fact.**

**The demo that proves it in 30 seconds:** the system is asked to send an aircraft on a task and
**refuses** — *"this airframe cannot reach that waypoint and return; here is one that can, and here
is the same aircraft's route with a charging stop inserted."* **No competitor demo refuses.**
Refusal is more persuasive than assignment, because it proves the model is real rather than
cosmetic.

### 3.2 We serve the opposite fleet shape — and it is the bigger one

- eyesAtop's proposition: **three or four soldiers become one.** It compresses a heavy crew flying
  several aircraft. That is Filter A — one operator, many aircraft.
- The line-unit reality (§0): **many soldiers, one aircraft each, spread across many units.** That
  is Filter B (`SwarmOps_Market_Sizing.md` §3.1) — identified there as the larger market and, until
  now, an assumption. **§0 is the first first-hand evidence that it is real and unserved.**
- **Shrinking a crew does not coordinate a hundred independent single-aircraft operators.**
  Different problem, not merely a different customer.

### 3.3 We require nothing new in the operator's hands — and this is bigger than it sounds

eyesAtop's model needs a **universal controller issued to the operator**. FlytBase needs **docks
and site infrastructure**. Both are procurement events with unit cost, logistics, training, and a
budget line.

**A coordination layer that ingests position and returns task assignments needs none of that.** The
soldier keeps the Mavic and the OEM controller they already have. **Deployment cost per additional
operator approaches zero** — which is the only economics that work for a tier measured in thousands
of one-aircraft operators.

**Say it as a procurement argument, not a technical one:** *"Nobody has to be issued anything."*

**The honest counterweight, and it must be in the same breath:** SwarmOps today is a cloud
Kubernetes system that assumes connectivity. eyesAtop runs **edge AI for disconnected operation**.
**In a tactical context they are architecturally ahead of us and we should say so before someone
else does.** §4.4 is the fix.

### 3.4 Scope discipline is a feature — stated as what it is

Observation-and-carry quadcopters in the current phase — no loitering munitions, no strike
coordination (`SwarmOps_Israel_Drone_Landscape.md` §0, amended 2026-08-19: **a current-phase scope,
with other aircraft classes kept as future R&D reference, not a permanent boundary**). eyesAtop
coordinates strike and holds the national attack-drone contract.

Three places this pays today: **export licensing** is simpler; **civil buyers** (police, fire,
utilities) can buy without a defense-adjacency problem; and **investors** who will not touch weapons
systems can hold us.

**Say it accurately, because this is the one claim where overreach is unrecoverable:** *"We
coordinate observation-and-carry quadcopters. Strike coordination is not in the product and not on
the roadmap."* True, checkable, and enough. **Do not say "structurally impossible" or "we never
could"** — the scope is a strategic decision, and a diligence question that establishes that after
we claimed otherwise costs more than the claim was ever worth.

---

## 4. What to build that neither of them has

Ranked by (nobody has it) × (buildable on the current stack) × (demos in under a minute).

### 4.1 Feasibility refusal + repair — **build first**
The planner returns *"not possible, and here is what is"*: an alternative aircraft, a re-ordered
route, or the same route with a charging stop inserted. **PRD §4.2 already specifies the battery
model and fleet-service already owns charging stations.** Mostly finishing, not inventing.
**This is the demo. Everything else supports it.**

### 4.2 Coordination without control — **the strategic one**
**We do not need to command the aircraft.** Ingest position (Remote ID broadcast, an operator's
phone, or the vendor SDK where allowed) and output **task assignments to humans**, not commands to
airframes.

Why this is the most important idea in this document:

- **It matches the reality in §0 exactly.** Those soldiers are not asking for autonomy. They have
  no coordination at all. Telling four operators who covers which sector is a step change from
  nothing, and it needs no autonomy stack.
- **It sidesteps DJI's military-use prohibition entirely** (`SwarmOps_Competitive_Battlecard.md`
  §2.8) — no vendor SDK relationship, no terms exposure, no dependence on a Chinese vendor's policy.
- **It works on aircraft we have zero integration with.** Coverage on day one instead of after an
  adapter.
- **It does not compete with eyesAtop's controller** — it sits above whatever anyone is flying,
  including Ronen.
- Mature open ecosystem to build on: `djicot` (DJI→TAK), `DroneCOT` (Remote ID/ODID→Cursor-on-
  Target), ATAK **UAS Tool**, DroneControl's ATAK integration.

**Limit, stated plainly:** broadcast gives **position and identity, not command**. Planning yes,
tasking of the aircraft no — the human executes. **For the line-unit tier that is not a compromise,
it is the correct design.**

### 4.3 Human deconfliction — sector and slot assignment
The load-bearing question nobody can answer: *when four units fly over the same square kilometre,
what stops them colliding and who decides who covers what?* Assign **sectors and time slots to
operators who have no datalink to each other**, delivered to a phone. Low-tech output, high
operational value, and **directly the gap §0 describes**.

### 4.4 Edge / degraded-comms operation — **closes our worst gap**
Plan computed centrally when connected, distributed as a **static task list** that stays valid
offline; re-plan on reconnection. Later: planner runs at the edge. **Without this we lose every
tactical comparison to eyesAtop.** Real work, and it must be on the roadmap before any defense
pitch.

### 4.5 Endurance-aware persistent coverage
Keep an area continuously observed by **rotating aircraft as batteries deplete** — a scheduling
problem that falls straight out of §4.1 and that nobody sells. Immediately legible to anyone who
has run a shift.

### 4.6 What-if rehearsal
`/planning/simulate` is already specced and the simulator exists. **Training and pre-mission
rehearsal is often a separate budget line in defense** — sometimes easier to buy than operations
software.

### 4.7 Cross-unit / cross-organization tenancy
The multi-agency incident (police + fire + MDA, three fleets, one airspace) and the multi-unit
military equivalent. Licensed to nobody, built by nobody. Real work — tenancy, permissions, trust
boundaries. **Sequence after 4.1–4.3.**

**Do not build:** aircraft autonomy, airspace separation/UTM, counter-UAS, strike coordination, our
own drone, **or one-operator-many-drones teleoperation** — that is eyesAtop's fielded product with
half a million flight hours behind it.

---

## 5. The pitch to the army

**Do not walk in with a product.** Walk in with the question they cannot answer, and let them say
the gap out loud.

**Open with the question, not the slide:**
> *"When four units are flying Mavics over the same square kilometre — what stops them colliding,
> and who decides who covers what?"*

Then, only after they answer:
> *"We asked three people in one unit. An officer, a pilot, and one of us who flew them. All three
> said the same thing: there is no system. We built the thing that answers that question."*

**What to lead with, in order:**

1. **Nobody gets issued anything.** No new controller, no dock, no modification to the aircraft.
   The soldier keeps the Mavic and the controller they have. (§3.3)
2. **It says no.** The system refuses a task an airframe cannot complete and returns, and proposes
   the one that can. (§3.1)
3. **Sectors, not autonomy.** It tells operators who covers what. Humans still fly. (§4.2, §4.3)
4. **Observation aircraft only.** Not a weapons system, structurally. (§3.4)

**What to ask for:** a **bounded pilot at one company or one battalion**, routed through **MAFAT
Green Lane / Innofense** — which exists for exactly this: IP retained, 30-day payment terms,
**exemption from ISO and guarantees**, and a DDR&D project officer who facilitates operational
testing with a unit (`SwarmOps_Competitive_Battlecard.md` §7).

**What not to do, and each of these is a way to lose the room:**

- **Do not pitch one-operator-many-drones.** eyesAtop's sentence, half a million flight hours.
- **Do not say the IDF has no coordination system.** Say what the three people said. (§0)
- **Do not claim to beat Ronen.** If they know it, position above/beside it. If they do not, that is
  data — write it down and do not sell against a name they have not heard.
- **Do not speculate about anything classified.** If it is not in an open source, it does not go in
  a document or a deck. Let them tell you.
- **Do not treat an officer's interest as procurement interest.** Capture it as evidence about the
  *problem*.

**The three questions worth more than the pitch** — ask them every time:
what happens today when a battery runs low mid-task; who assigns areas between operators; and
whether anyone has ever had two aircraft nearly meet.

---

## 6. The pitch to investors

Different order, different emphasis. The army cares about the gap; investors care about whether the
gap is defensible and whether we are honest about who else is in it.

**Slide order that survives diligence:**

1. **The market, from the fleet up.** Israel Police: 16 models, 3 manufacturers, one agency
   (`Drone_Fact_Pack` §2). IDF ambition of 100,000 drones/year. **Mixed fleets are the normal case.**
2. **Name the competitors first, before the question comes.** eyesAtop (fielded, national contract),
   FlytBase ($10.8M ARR), Airwayz and High Lander (Israeli, licensed), Auterion, XTEND. **Naming
   them first converts the hardest question in the room into a demonstration of homework.**
3. **The layer diagram** (`Competitive_Battlecard` §3.6): aircraft autonomy / airspace separation /
   **mission coordination ← us** / data & compliance.
4. **The primary evidence.** Three people in one unit, August 2026, no system, no recognition of the
   leading product's name. **Bounded and attributed.** This is the most credible slide we own —
   nobody else in a pre-seed room has direct evidence from inside the customer.
5. **The demo: refusal.** The system says no, then repairs the plan. Thirty seconds. (§3.1)
6. **Why now, twice over.** Israel made UTM connection a precondition of flight, so every civil
   aircraft is already telemetry-connected. The US put DJI on the FCC Covered List (21 Dec 2025),
   so American fleets are becoming mixed by regulation.
7. **The risks, stated by us.** Category may not be buyer-perceived yet (FlytBase at $10.8M ARR
   after a decade is the evidence). Defense cycles are 12–24 months. eyesAtop is ahead. **Say them.**
8. **The ask**, against a plan that reaches a civil reference customer before the defense cycle
   closes.

**Two sentences to have ready verbatim:**

> *"How is this different from eyesAtop?"* — **"They make three soldiers into one operator flying
> several drones. We coordinate a hundred soldiers who each have one drone. They compress a kill
> chain in minutes; we schedule a fleet's work over hours against the battery it actually has.
> Their system is fielded in reconnaissance units and it is very good. It has not reached the line
> units, and that is where the volume is."**

> *"How is this different from FlytBase?"* — **"FlytBase automates a fixed site with docks. Our
> aircraft move with people and there is no infrastructure. And they log battery health; we plan
> against it."**

---

## 7. What would falsify this — check before betting the roadmap

1. ~~**FlytBase ships battery-feasible planning.**~~ **CHECKED 2026-08-19 — it does not. §3.1
   holds.** Their full documentation index (122 pages) was read. Findings:
   - **No page** on route optimization, mission assignment, endurance planning, feasibility
     checking, or charging scheduling. The word "optimization" does not appear as a feature.
   - **Mission Scheduler** = manual: *"Select the drone from the **Drone** dropdown."* The operator
     picks the aircraft and the time slot. No documented consideration of battery, flight time, or
     charge state.
   - **Mission Planning** = manual: *"A mission is a pre-defined flight path set by the operator
     prior to launching the drone."* Operator draws waypoints and sets speed/altitude. No flight-
     time estimation, no battery validation, no automated routing documented.
   - **Fleet Management** = a monitoring dashboard. The battery bar (green = enough for the
     mission, yellow = RTH reserve, red = landing reserve) is **display-only for operator
     awareness**; the operator decides whether to proceed. Nothing gates dispatch.
   - **Battery appears only as failsafe thresholds** — low battery configurable 20–50%, critical
     10–15%, triggering DJI's own RTH/landing behaviour.
   **Conclusion: FlytBase shows the operator a battery bar and lets DJI's firmware handle the
   consequences. It does not plan against battery. The distinction in §3.1 is real and now
   verified against primary vendor documentation.**

   **Bonus finding, and it is worth more than the answer we went looking for.** FlytBase's own docs
   state: *"FlytBase does not have any custom failsafes at this time since **DJI does not allow
   access to its cloud APIs** for the same. Instead, the DJI Dock and Drone initiate a 'Return to
   Home' or other failsafe protocol as outlined by DJI."* **A $10.8M-ARR competitor documenting
   that DJI's API access limits what it can build.** Two consequences: (a) it corroborates the
   vendor-dependency risk in `SwarmOps_Competitive_Battlecard.md` §2.8 from a commercial source,
   and (b) **it is an argument for §4.2 (coordination without control)** — a design that does not
   depend on DJI granting anything cannot be limited by DJI withdrawing it.

   **Caveat kept honestly:** absence from documentation is not absence from the product. But a
   122-page manual whose scheduler page says "select from the dropdown" is strong evidence. If
   this ever becomes load-bearing in a funding conversation, confirm it in a demo or a sales call.
2. **Ronen already does endurance planning** and it simply is not in the press. Six sources say
   nothing; that is not proof.
3. **The §0 gap is unit-specific.** Three observers, one unit, one branch. Ask Guy and Valfish the
   identical questions — different units, different periods
   (`SwarmOps_Israel_Drone_Landscape.md` §7.6).
4. **Line units do not want coordination.** They may prefer autonomy at the edge to being assigned
   sectors from above. **This is the real risk of §4.3 and only a pilot answers it.**
5. **Digital Bat expands to the observation fleet.** eyesAtop's contract is the attack fleet today;
   its fielded product already spans surveillance and ISR.

---

---

## 8. Sequencing — defense first, confirmed 2026-08-19

**Decision, taken by Tony on 2026-08-19: defense is the market thesis; public safety is the fast
reference customer.** This restates the direction already set after the August 2026 pre-investor
meeting (`SwarmOps_Israel_Drone_Landscape.md` §1.4) and reverses a drafting error in an earlier
version of this document, which listed public safety as the primary buyer without flagging that it
contradicted a decision already made.

**The reasoning that had pointed the other way, kept because it is still true and has to be
managed:** eyesAtop occupies the defense specialist tier and holds a national contract; DJI's terms
prohibit military use of its products (`SwarmOps_Competitive_Battlecard.md` §2.8) while civil use is
fully supported; and the defense cycle runs 12–24 months against a pre-seed runway. **None of these
are reasons to abandon defense. They are the three things the defense plan has to survive** —
and §4.2 (coordination without control) answers the second one directly, which is why it moves up
the roadmap under this decision.

### 8.1 "There is competition, so there is no room for us" — the counter-argument, with evidence

Tony's point, 2026-08-19: **competition in a field does not mean there is no place in it.** The
Israeli defense buyer evaluates many vendors in parallel rather than picking one and closing the
category. **This is correct, and the evidence is stronger than the recollection that prompted it.**

- **The MoD tested 20 counter-drone technologies** — Elbit, Rafael and IAI **alongside startups** —
  in an accelerated competitive process assessing interception across ranges, speeds and altitudes
  [SOURCED — cuashub]. **Twenty, in one process, primes and startups side by side.**
- **None of the drone-on-drone interception systems achieved over 50% success** (May 2026). A
  security official: *"We will continue to refine them operationally. We will accumulate lessons
  and improve."* **Six** counter-drone models remain in advanced trials — warhead drones,
  net-droppers, rammers — and the MoD issued a **public call for fiber-optic-drone solutions in
  April 2026** [SOURCED — Walla, N12, Times of Israel].
- **MAFAT's own throughput says the same thing:** **19 calls for proposals in H1 2025 → 661
  proposals → 220 into the accelerator** (`SwarmOps_Competitive_Battlecard.md` §7).
- **Different rounds, different winners.** XTEND won an earlier multi-drone-OS competition;
  eyesAtop + Kela won Digital Bat in July 2026, beating US rival Ondas. **The same buyer ran the
  category twice and picked different companies.**
- **Units buy independently.** The 55th Paratroopers Brigade acquired 100+ commercial drones outside
  the central pipeline. **Israel Police runs three manufacturers concurrently.**

**Conclusion, and it belongs in the investor deck:** **the Israeli defense establishment is a
structurally multi-vendor buyer that runs parallel evaluations and re-runs categories.** It is not
winner-take-all. eyesAtop holding Digital Bat does not close the field any more than XTEND's $20M
contract closed it before them.

**Two caveats, without which this argument backfires in a diligence room:**

1. **Counter-UAS is a different category from ours.** `SwarmOps_Market_Sizing.md` §5.9 puts
   counter-UAS outside our market — we coordinate friendly fleets, we do not defeat hostile ones.
   **Use the 20-system trial as evidence about how this buyer procures, not as evidence about our
   category.** Said the first way it is airtight; said the second way, someone technical will point
   out we just cited a market we are not in.
2. **A trial is not revenue.** 661 proposals produced 220 accelerator slots, and NIS 1.08B of orders
   spread across a whole cohort. **Being one of twenty tested is not being one of one procured** —
   and "nothing exceeded 50%" also means this buyer churns vendors, which is easy to enter and hard
   to stay in. Plan for the entry, budget for the churn.

**One observation, with its boundary attached.** The counter-drone answer is shaping up to be
*multiple drone-based systems from multiple vendors* — interceptors, net-droppers, rammers — and
the stated operational problem is **"the ability to bring enough systems to enough places."** That
is a fleet allocation problem. **It is also counter-UAS, which is out of scope by decision.** Note
it as an adjacency and a possible partner conversation; **do not let it pull the roadmap.**

---

## 9. Live opportunity — an IDF drone R&D unit asked to test it

**[PRIMARY, 2026-08-19]** Tony described the coordination capability to a drone specialist
described as one of the IDF's leading experts. The specialist did not recognise the capability,
**became interested, and asked to test SwarmOps in his unit — a drone R&D unit.**

**This is the most important thing in this document.** Everything above is an argument that a gap
exists. This is someone inside the customer saying so and offering to prove it.

### 9.1 Why an R&D unit is the right first customer — not a consolation prize

- **It has a mandate to evaluate.** Testing immature technology is the job, not a favour. A line
  unit would need a procurement decision to do the same thing.
- **It short-circuits the 12–24 month cycle** that `SwarmOps_Market_Sizing.md` §4 identifies as the
  structural problem with defense-first. **Evaluation is not procurement, but it is the gate that
  precedes it** — and it is the gate we could not otherwise reach with four people and no supplier
  status.
- **It is the exact tier the competitor has not reached** (§3.2). Validation from there is
  validation of the specific claim we are making, not a generic reference.
- **It converts our best asset into our best channel.** The founders' service is why this
  conversation happened at all.

**And say this part honestly in every investor conversation:** *interest is not a contract.* An
R&D unit asking to test something is a strong signal about the **problem**, a weaker one about the
**budget**. Record it as evidence, not as pipeline.

### 9.2 Do these first, this week

1. **Write down exactly what was described and what he responded to — today, before it drifts.**
   Which words, which capability, what he said back, what he asked about. **That transcript is a
   validated product spec** and it is worth more than any roadmap we have written. It will not
   survive a week of memory.
2. **Ask what "test" means to them.** What would they measure, what does success look like, over
   what period, and what would they need from us — on-prem? offline? their own aircraft or a
   simulated fleet? **Their answer defines the deliverable. Do not guess it and build the wrong
   thing.**
3. **Scope to what exists or is two weeks away.** The demo is §3.1's refusal plus §4.3's sector
   assignment, on a single on-prem node. **Nothing that needs internet, no autonomy claims, no
   strike anything.**
4. **Put it on a formal footing early, via MAFAT.** Green Lane / Innofense exists for exactly this:
   IP retained, 30-day terms, ISO and guarantee exemptions, and a DDR&D project officer who
   facilitates operational testing with a unit (`SwarmOps_Competitive_Battlecard.md` §7). **An
   interested unit attached to a MAFAT application is a dramatically stronger application than a
   cold one** — the hard part of that programme is finding a unit that wants the thing.
5. **Close the on-prem prerequisites** (`onprem_deployment.md` §6 items 1–4). Mongo credentials,
   per-service secrets, auth on `POST /telemetry/events`, and a `values-onprem.yaml` that installs
   from a mirror with no internet. **Roughly a week, and it is the difference between a demo and a
   deployment.**

### 9.3 How to lose this — each of these has ended pilots before

- **Over-promising.** He is an expert. Anything claimed that the product does not do will be found
  in the first hour, and there is no second first impression with a senior technical evaluator.
  **Show the refusal demo, which is real, and say "not yet" to everything else.**
- **Bringing anything that needs the internet.** In that environment it does not work, and it
  signals we do not understand where we are.
- **Taking classified information.** Let them define what can be discussed. Nothing that is not in
  an open source goes into a document, a deck, or this repository. **If in doubt, it does not get
  written down.**
- **Treating one enthusiastic person as an organization.** Ask early who else would need to agree,
  and what the unit's own approval path looks like.
- **Building the demo we want instead of the test they asked for.** Item 2 above exists for this
  reason.

### 9.4 What it changes in the investor story

The §6 deck order stands, but slide 4 upgrades substantially. It was *"we asked four people and
found a gap."* It becomes:

> **"We asked four people, including one of the IDF's leading drone specialists. None recognised
> the capability. He asked to test it in his unit."**

That is the difference between a founder's hypothesis and a validated one, and it is the single
strongest slide this company has. **State the limits with it** — one unit, R&D not procurement,
interest not commitment — because the bounded version is the credible one.

---

## Sources

**Multi-vendor procurement evidence (§8.1)**
- [cUAS Hub — Israel's MOD completes testing of 20 counter-drone technologies](https://cuashub.com/en/content/israels-mod-completes-testing-of-20-counter-drone-technologies/)
- [Walla (HE) — הניסויים שיקבעו: כך יתמודד צה"ל עם איום הרחפנים](https://news.walla.co.il/item/3837851) — **none of the drone-on-drone interception systems exceeded 50%**
- [Walla (HE) — המאמץ נגד איום רחפני חיזבאללה: אופטימיות זהירה במשרד הביטחון](https://news.walla.co.il/item/3842478)
- [N12 (HE) — מרשתות ועד בובות ראווה: החיפוש אחר התשובה לאיום הרחפנים](https://www.mako.co.il/news-military/2026_q2/Article-5ce6407d6697e91027.htm)
- [Jerusalem Post — IDF testing counter-drone technologies ahead of security meeting](https://www.jpost.com/israel-news/defense-news/article-896070)
- [Times of Israel — Fatal Hezbollah attack exposes gaps in IDF preparedness for FPV drones](https://www.timesofisrael.com/fatal-hezbollah-attack-exposes-gaps-in-idf-preparedness-for-first-person-view-drones/)

**FlytBase documentation (§7.1)** — primary vendor docs, read 2026-08-19
- [FlytBase docs — complete index (122 pages)](https://docs.flytbase.com/llms.txt)
- [FlytBase docs — Mission Scheduler](https://docs.flytbase.com/pre-flight-modules/planning/mission-scheduler) · [Mission Planning](https://docs.flytbase.com/pre-flight-modules/planning/mission-planning) · [Fleet Management](https://docs.flytbase.com/in-flight-modules/how-to-manage-your-flight-operations/fleet-management) · [Failsafes (DJI cloud API limitation)](https://docs.flytbase.com/device-management/device-management/hextronics-docks/settings-failsafes)

Everything else is sourced in `SwarmOps_Competitive_Battlecard.md`, `SwarmOps_Competitor_eyesAtop.md`
and `SwarmOps_Drone_Fact_Pack.md`.

---

*Opened 2026-08-19. §0's primary evidence is the most perishable and the most valuable thing here —
re-ask the same questions every few months, and record who answered, when, and in what role.*
