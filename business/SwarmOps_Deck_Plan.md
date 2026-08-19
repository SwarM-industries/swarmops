# SwarmOps — Pitch Deck Plan

**Opened 2026-08-19.** Review of Tony's 9-slide outline, a revised running order, and — the part
that matters most — **what data and visual actually exists for each slide, and where it lives.**

This is the plan for the *investor* deck. The army conversation is a different thing and is
covered in `SwarmOps_Positioning_and_Pitch.md` §5 — do not merge them.

---

## 1. Verdict on the proposed outline

The proposed nine: (1) problem data · (2) solution high level · (3) capabilities · (4) competition ·
(5) steps after investment / first client · (6) what differs us · (7) how it works, flight data,
simulation · (8) case study — army stories · (9) future developments, target audience.

**What is right, and worth keeping deliberately:**

- **Problem first, with data.** Correct, and it is where our best material is.
- **Competition has its own slide.** Most pre-seed decks bury this. Given eyesAtop, hiding it would
  be fatal — an investor who knows the sector finds them in one search, and then everything else in
  the deck is discounted.
- **"Steps after the investment" is included.** Use of funds and the first customer is a question
  we would otherwise be asked without an answer.
- **The army case study is in the deck at all.** It is the single most credible thing this company
  owns.

**Four problems, in order of severity:**

1. **The army story is at slide 8. It is the evidence for slide 1.** A founder's first-hand account
   presented near the end reads as colour. Presented as *the proof of the problem*, it is the whole
   argument. **Move it to slide 2, fused with the problem.** Nothing else in this deck is
   first-hand; everything else is a citation anyone could have found.
2. **Slides 3, 4 and 6 are three slides doing two jobs.** "Capabilities," "comparison against
   competition" and "what differs us" overlap almost completely. **Merge 6 into 4** — differentiation
   *is* the competition slide's conclusion — and let 3 be capabilities shown, not listed.
3. **Four mandatory slides are missing:** **the ask** (amount, milestones, use of funds — slide 5
   describes steps but never says how much), **the team** (three combat veterans, two of them drone
   operators, in Israeli defense-tech — this is a top-tier asset, not a formality), **market size**
   (we have TAM/SAM/SOM already modelled), and **why now** (two genuinely strong regulatory facts).
4. **Slide 7 as written is a credibility risk.** "Flight data" and "testing improvement from
   simulation" — **our fleet is simulated.** Presented loosely this implies operational flight data
   we do not have, against a competitor that has 500,000 hours of the real thing. `business/_render/README.md`
   already warns about exactly this failure mode for the video claim. **Reframe the slide as
   architecture and validation method, and state the simulator plainly as a simulator.** Said
   honestly it is still a good slide: a simulated fleet is how you test a re-planner at all.

---

## 2. Revised running order — 13 slides

Their nine, re-sequenced, with the four gaps filled. Slide numbers in brackets map back to the
original.

| # | Slide | Job | Origin |
|---|---|---|---|
| 1 | **The problem, with data** | Mixed fleets are the normal case; nothing coordinates them | [1] |
| 2 | **We were the ones with the problem** | The army account + the four-observer finding | [8] — **moved up** |
| 3 | **Why now** | Mandatory UTM in Israel; DJI on the FCC Covered List | **new** |
| 4 | **The solution, one sentence and one diagram** | The layer picture | [2] |
| 5 | **How it works** | Architecture + how it is validated. Simulator named as a simulator | [7] — **reframed** |
| 6 | **What it does — the refusal demo** | Capability *shown*, not listed | [3] |
| 7 | **Market** | TAM/SAM/SOM, target audience, buyer segments | **new** (absorbs half of [9]) |
| 8 | **Competition, and what differs us** | Honest map, then our three claims | [4] + [6] merged |
| 9 | **Where we are** | Built and running; the R&D unit request | **new** |
| 10 | **Team** | Three combat veterans, two drone operators | **new** |
| 11 | **After the money — first customer** | Pilot plan, milestones | [5] |
| 12 | **Roadmap** | Phases and future capability | [9] |
| 13 | **The ask** | Amount, milestones it buys, what it proves | **new** |

**If it must be shorter:** cut 12 (fold two lines into 13) and 5 (architecture is an appendix
slide). **Never cut 2, 8, 9 or 10.**

---

## 3. Slide-by-slide — what data exists and what the visual should be

### Slide 1 — The problem
**Claim:** real fleets are mixed by procurement, and no vendor's software coordinates a competitor's
aircraft.
**Data (all sourced, all quotable):** Israel Police **11 DJI + 2 Autel + 3 Aero Sol models**,
**₪10.05M in 2025**; Fire & Rescue 8 DJI; Prison Service 5 DJI + 1 Skydio + 1 XTEND (Calcalist,
Apr 2026). → `SwarmOps_Israel_Drone_Landscape.md` §1.1.
**Visual: the single best one we have — "16 models, 3 manufacturers, one agency."** A stacked
breakdown of one police fleet. It makes the argument without a sentence.

### Slide 2 — We were the ones with the problem ← **the most important slide**
**Content:** Tony's account (infantry, ~Dec 2025 — DJI and Autel, Mavic/Matrice/EVO, each with its
own controller and operator, no coordination system). Then the four-observer finding: a pilot, an
officer, and one of the IDF's leading drone specialists, August 2026, **none describing a
coordination system and none recognising the market-leading product even by capability.**
→ `SwarmOps_Competitor_eyesAtop.md` §5, `SwarmOps_Positioning_and_Pitch.md` §0.
**Visual:** four figures, four roles, one question, one answer. Deliberately plain — this slide is
carried by what it says, and decorating it weakens it.
**Constraint, non-negotiable:** bounded and attributed. *"We asked four people"* — never *"the IDF
has no coordination system."* Nothing classified. See §4.

### Slide 3 — Why now
**Two facts, both sourced:** Israel is the **first country to make UTM connection a precondition of
flight** (CAAI Reg 10916) — every civil aircraft is already telemetry-connected, which removes the
integration barrier. And **DJI went onto the FCC Covered List on 21 Dec 2025** — US fleets are
becoming mixed by regulation. → `SwarmOps_Drone_Fact_Pack.md` §4.2, `SwarmOps_Competitive_Battlecard.md` §3.4.
**Visual:** a two-item timeline. Restraint — two dates, two consequences.

### Slide 4 — The solution
**One sentence:** *"SwarmOps decides which drone takes which task, in what order, and whether it can
finish on the battery it has — across aircraft from any manufacturer, unmodified."*
**Visual: the four-layer diagram** — aircraft autonomy / airspace separation / **mission
coordination ← us** / data & compliance, with the competitor names sitting in the layers they own.
→ `SwarmOps_Competitive_Battlecard.md` §3.6. **This is the strongest diagram in the whole set** and
it does double duty on slide 8.

### Slide 5 — How it works *(reframed)*
**Content:** the architecture, and how it is validated. Greedy → Hungarian assignment → per-drone
routing → battery-feasibility check → event-driven re-plan (PRD §4.2). The simulated fleet emits
realistic telemetry so re-planning has genuine triggers.
**Say this plainly on the slide:** *"Fleet is simulated today. Real-aircraft integration is Phase 1."*
**Do not** say "flight data" or imply operational history. **Do not** claim learning-from-history —
it is Future (`SwarmOps_UseCases.md`).
**Visual:** the pipeline as a flow, plus one re-plan sequence — event in, new plan out.

### Slide 6 — What it does: the refusal
**The demo, not a bullet list.** The system is asked to send an aircraft, **refuses** — *"cannot
reach that waypoint and return"* — and proposes the aircraft that can, or the same route with a
charging stop inserted.
**Why it lands:** verified 2026-08-19 against FlytBase's own 122-page documentation — their
scheduler is a dropdown, their battery bar is display-only, nothing gates dispatch. Battery is
absent from every description of eyesAtop across six sources.
→ `SwarmOps_Positioning_and_Pitch.md` §3.1 and §7.1.
**Visual: a screen recording, not a chart.** Refusal is more persuasive than assignment because it
proves the model is real rather than cosmetic.

### Slide 7 — Market
**Data:** the category is **$2.5–3.9B** (fleet management & ops software); the coordination layer
specifically **is not sized by any analyst** — that is the opportunity and the risk, and we say
both. Pricing anchors: DroneDeploy $329–599/seat/yr; Skydio ~$6,000 + ~$3,000/yr.
→ `SwarmOps_Market_Sizing.md` §2.1, §3.2.
**Target audience** (absorbs half of original [9]): **defense first — the market thesis; public
safety the fast reference customer** (`SwarmOps_Positioning_and_Pitch.md` §8).
**Visual:** the layered market with our slice highlighted — and label the slice honestly as
modelled.

### Slide 8 — Competition, and what differs us *(merged [4] + [6])*
**Name them first.** eyesAtop/Aitan (fielded, national Digital Bat contract, ~$15M), FlytBase
($10.8M ARR), Airwayz and High Lander (Israeli, licensed), Auterion ($130M), XTEND (>$100M revenue).
**Naming them before you are asked converts the hardest question in the room into evidence of
homework.**
**Then the claims that survive, in this order** (`SwarmOps_Positioning_and_Pitch.md` §3):
**(1) the opposite fleet shape** — they make 4 soldiers into 1 operator; we coordinate 100 soldiers
with 1 drone each. **This leads, because it is structural**: a competitor can add battery planning
in a quarter, but cannot change what shape of fleet its product exists to serve.
**(2) battery feasibility** — the mechanism that makes our coordination worth more than a shared
map, and the thing to *demo* (slide 6). **(3) nothing new in the operator's hands.**
**Wording discipline: "task assignment between independent operators," never bare "coordination
between operators"** — Airwayz and High Lander do the latter under a CAAI licence (20 drones /
5 companies; 70+ vendors at Rotterdam). The unqualified claim is falsifiable in one search.
**Visual: two fleet-shape diagrams side by side.** One crew with many aircraft, versus many
operators with one aircraft each. **That single picture is the whole differentiation** and it is
better than any feature matrix.
**Also include the honest table** — us vs eyesAtop vs FlytBase, from
`SwarmOps_Positioning_and_Pitch.md` §1. Include rows we lose.

### Slide 9 — Where we are
**Traction is not only revenue.** Built and running: nine services on Kubernetes, GitOps delivery,
canary releases on the planning service, live multi-drone camera feeds, a simulated fleet, an
observability stack. **And: an IDF drone R&D unit has asked to test it**
(`SwarmOps_Positioning_and_Pitch.md` §9).
**Visual:** a built/in-progress/future band across the capability list. Colour-coded honestly —
the tagging discipline in `SwarmOps_UseCases.md` is the credibility model, and this slide is where
it shows.

### Slide 10 — Team
Three combat veterans; **two are drone operators**. This is verified, not a claim
(`project_team_background`). In Israeli defense-tech this is a top-three slide — it is why the
slide-2 conversations happened at all.
**Visual:** faces and one line each. No stock imagery.

### Slide 11 — After the money: the first customer
The R&D unit pilot, scoped: on-prem, offline, single node, refusal + sector assignment, routed
through **MAFAT Green Lane** (IP retained, ISO exemption, 30-day terms).
→ `SwarmOps_Positioning_and_Pitch.md` §9.2, `onprem_deployment.md` §6.
**Visual:** a milestone timeline with dates.

### Slide 12 — Roadmap
Adapters DJI → Autel → XTEND; on-prem/offline; cross-org tenancy; scope beyond quads as future R&D
(`SwarmOps_Israel_Drone_Landscape.md` §0, amended — current-phase scope, not a permanent boundary).
**Visual:** phase bands, not a Gantt.

### Slide 13 — The ask
Amount, the milestones it buys, and **what those milestones prove**. Tie each milestone to a
question an investor would otherwise ask.
**Note:** the pre-seed figure is still a `[...]` placeholder in the business documents
(`business/_render/README.md`). **Decide it before the deck exists.**

---

## 4. On "most slides should have data / charts / diagrams"

**Right instinct, with one serious caution.**

**The caution: most of our numbers are other people's.** Charting third-party market figures makes a
deck look like a research report. **Chart what is ours or what is structural**, and cite the rest as
text with the source named.

**Never chart these:**

- **Airframe counts.** Our civilian figure is a **modelled 25k–60k band** and no IDF inventory
  figure is public. **A chart makes a band look like a measurement** — it is the most dangerous
  possible way to overstate the one thing our own documents say never to state as fact
  (`SwarmOps_Drone_Fact_Pack.md` §1, boxed warning). If it appears at all, it appears as a range
  with the method on the slide.
- **Vendor share as a pie.** The 75% / 81% figures are **model counts across three agencies**, not
  market share. A pie chart silently converts one into the other. Use a labelled model-count bar.
- **Our own performance metrics.** We have no operational flight data. Any performance chart would
  be simulator output, and must be labelled as such or not shown.

**The visuals actually worth building, ranked:**

1. **Two fleet shapes side by side** (slide 8) — one crew/many aircraft vs many operators/one
   aircraft each. **The single most valuable picture in the deck.** It is our whole thesis and no
   competitor's material has it.
2. **The four-layer diagram** (slides 4 and 8) — with competitor names in their layers.
3. **"16 models, 3 manufacturers, one agency"** (slide 1) — real, sourced, striking.
4. **The refusal, as a screen recording** (slide 6) — motion beats a chart here.
5. **Built / in-progress / future bands** (slide 9) — honesty rendered visually.
6. **Re-plan sequence diagram** (slide 5) — event in, new plan out.
7. **Two-date why-now timeline** (slide 3).

**Everything else can be type.** A deck where seven slides carry one strong graphic each beats one
where thirteen carry a decorative chart.

**When we build these:** use the `dataviz` skill for anything that is a chart, and
`artifact-diagramming` for the layer and fleet-shape diagrams. `PITCH_DESIGN.md` holds the existing
visual system and the deck itself lives in `Fabelino-Presentatsiya/` (see the project memory —
`site/` is superseded).

---

## 5. What is actually backed by data — slide by slide

Four grades. **Sourced** = named third party, quotable, someone else's reporting. **Primary** = our
own first-hand account, attributed and dated. **Modelled** = our construction from sourced inputs
with the method stated. **None** = argument, definition or plan — no data exists and none should be
manufactured.

| # | Slide | Grade | What is behind it |
|---|---|---|---|
| 1 | Problem | **Sourced — strongest data slide in the deck** | Calcalist (Apr 2026), from official procurement documents: Police **11 DJI + 2 Autel + 3 Aero Sol**, ₪10.05M (2025) / ₪4M (2024) / ₪9.65M (2023); Fire & Rescue **8 DJI**, ₪300K; Prison Service **5 DJI + 1 Skydio + 1 XTEND**, ₪2.1M |
| 2 | We had the problem | **Primary** | Four named-role observers, dated. **Not data and cannot be charted** — its power is attribution and checkability |
| 3 | Why now | **Sourced, both facts** | CAAI Regulation 10916 (23 Nov 2023); FCC Covered List addition 21 Dec 2025 under NDAA §1709, Blue UAS carve-out Jan 2026, update waiver to ~1 Jan 2027 |
| 4 | Solution | **None, correctly** | A definition and a diagram. Nothing to source. **Do not decorate it with a number** |
| 5 | How it works | **None external** | Architecture. The only fact is that it is built and runs — demonstrable, not citable. **Simulator output is not evidence** |
| 6 | Refusal demo | **The demo is the evidence; the claim is Sourced** | Verified against FlytBase's own 122-page documentation (scheduler is a dropdown, battery bar display-only, nothing gates dispatch) — primary vendor documentation, the best kind. Plus the research-literature statement of the gap. **Weaker leg:** battery absent from six eyesAtop sources — that is absence of evidence, say it as such |
| 7 | Market | **Mixed — the softest slide, and where the hardest questions land** | $2.5–3.9B category **Sourced** (Fact.MR, Market Growth Reports). Coordination slice **Modelled — no analyst sizes it**. Israeli SAM 300–800 orgs / $6–20M **Modelled with an [ASSUMPTION] inside**. Pricing anchors **Sourced**: DroneDeploy $329–599/seat/yr, Skydio ~$6K + ~$3K/yr, and **XTEND's $20M MoD contract — the best anchor we have** |
| 8 | Competition | **Sourced throughout — highest data density after slide 1** | Every funding, revenue and contract figure has a named source: eyesAtop ~$15M + Digital Bat (14 Jul 2026), Kela $200M, FlytBase $10.8M ARR / $32.3M valuation, Airwayz $12M / 37 people, High Lander $19.2M / 51 people, Auterion $130M, XTEND $100M raised / >$100M revenue, Skydio $966M / $4.4B. **The differentiation claims themselves are argument, not data** — except battery, which is verified |
| 9 | Where we are | **Internal fact + Primary** | The system is built and runs — verifiable by demo, not by citation. The R&D unit request is Primary. **Needs no third-party data and should not pretend to have any** |
| 10 | Team | **Verified, but biography not data** | Confirmed background. Credential, not a statistic |
| 11 | First customer | **Plan — but the channel is Sourced** | The pilot is a plan. MAFAT terms are sourced: IP retained, 30-day payment, ISO/guarantee exemption; 19 calls → 661 proposals → 220 accelerator (H1 2025); NIS 1.08B in orders to defense-tech startups in 2025 |
| 12 | Roadmap | **None — and that is correct** | A plan. **But the adapter order is justified by slide 1's data** — DJI + Autel are 81% of documented public-safety models. Say that; it turns a roadmap into a conclusion |
| 13 | The ask | **None, and the number does not exist yet** | Still a `[...]` placeholder in the business documents |

### 5.1 What the table says

**Six slides carry real third-party data: 1, 3, 6, 7, 8, 11.** Two are carried by first-hand
evidence: **2 and 9**. Five have no data by nature — **4, 5, 10, 12, 13** — and that is correct, not
a gap.

**Three observations worth acting on:**

1. **The deck has data exactly where it needs it and none where data would be fake.** Problem, why
   now, and competition are the slides an investor tests, and all three are sourced. Solution,
   roadmap and ask are argument and plan, and inventing numbers for them is what makes a deck look
   padded.
2. **Slide 7 is the weak point.** It is the only slide where the load-bearing figure is ours rather
   than someone else's, and it is where the hardest question comes from — *"if this category is
   $2.5–3.9B, why is its leading independent vendor at $10.8M ARR?"* **Answer it on the slide**
   (`SwarmOps_Market_Sizing.md` §9.1) rather than being asked. The two comparables that make the
   defense case — **eyesAtop's reported revenue and XTEND's $20M MoD contract** — belong here, not
   only on slide 8.
3. **The strongest evidence in the deck is not data, and the strongest data is not ours.** Slide 2
   is four people's testimony; slide 1 is Calcalist's reporting. **That is a fine position** — but
   it means the deck's credibility rests on discipline in how both are stated, not on the volume of
   numbers. Every rule in §6 exists to protect exactly that.

---

## 6. Rules that apply to every slide

Inherited from `business/_render/README.md` and the source discipline in the research documents.
They exist because each has been broken at least once.

1. **No Future capability written in the present tense.** Built / Phase N / Future, and the tagging
   is the credibility model.
2. **The fleet is simulated — say so wherever fleet behaviour or video appears.**
3. **Model counts are not airframe counts.** Say "models" every time.
4. **The army account stays bounded and attributed.** Four people, what they said, dates and roles.
   Never "the IDF has no coordination system."
5. **Nothing classified, ever.** If it is not in an open source, it does not go in the deck, a
   document, or this repository.
6. **Name eyesAtop before being asked.**
7. **Do not claim the scope boundary is structural.** Current-phase scope, other classes are future
   R&D (`SwarmOps_Israel_Drone_Landscape.md` §0, amended 2026-08-19).
8. **No implementation detail in investor-facing material** — no Kubernetes, Argo CD, OR-Tools,
   Hungarian algorithm. "Secure, distributed cloud infrastructure." Slide 5 is the one partial
   exception and it should stay at the level of the pipeline, not the stack.
