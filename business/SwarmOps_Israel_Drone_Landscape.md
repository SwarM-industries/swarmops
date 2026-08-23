# SwarmOps — Israeli Drone Landscape: Who Flies What

**Internal working document, opened 2026-08-18.** Written in response to the pre-investor meeting
notes (college, August 2026), which asked for concrete data on **drone usage in Israel** — which
aircraft are actually operated, by whom, in defense, law enforcement, the wider security sector,
agriculture and commercial operations — and which set the strategic direction of **defense first,
civilian commercial second**.

**How this relates to the documents that already exist.** `SwarmOps_Market_Sizing.md` sizes the
*money*: TAM/SAM/SOM, ACV, pricing. This document counts the *aircraft and the operators*. They
answer different questions and neither replaces the other. Where a fact appears in both, the
market-sizing document remains authoritative on anything expressed in dollars; this one is
authoritative on platforms, models, and fleet composition.

**Source discipline is inherited from `SwarmOps_Market_Sizing.md` §1 and applies unchanged:**

- **[SOURCED]** — named third party. Safe to cite with the source named.
- **[MODELLED]** — our construction from sourced inputs plus stated assumptions.
- **[ASSUMPTION]** — not yet validated. Go measure before using in a funding conversation.

One tag is added here that the market-sizing document does not use:

- **[PRIMARY]** — direct first-hand observation by a named team member, with the date and the role
  stated. Ranks **above** [SOURCED] on questions of what is actually fielded and below it on
  anything numeric, because one person sees one unit. Always attributed, never generalized past
  what the observer saw. See §1.3a.

**Status of this document: v1, partial.** The defense and law-enforcement sections are solidly
sourced. Agriculture is largely a gap. Nothing here is fabricated to fill a section — where we
do not have the data, §7 says so and §8 is the brief for going to get it.

---

## 0. Scope — simple quadcopters **for now**

**Decision, 2026-08-18, amended 2026-08-19: SwarmOps coordinates simple multirotor quadcopters —
for now.** Not loitering munitions, not fixed-wing tactical UAS, not MALE aircraft, not VTOL
hybrids.

**The amendment matters and is Tony's, 2026-08-19: this is a current-phase scope, not a permanent
product boundary.** The excluded classes are **kept as reference for future R&D**, not closed off.
Every platform named below is tagged in-scope or out, and the out-of-scope entries are kept for two
reasons now: so nobody re-adds them believing they were overlooked, **and so the R&D path to them
is already mapped when the company is ready to take it.**

**Consequence for how we argue, and it must be understood before §0.3 is used in a room:** a
current-phase scope is a **plan**, not a structure. It is still a strong answer to the
weapons-system question — the aircraft class we coordinate today is the observation-and-carry
class, and the product genuinely does not do anything else — but it is **no longer a claim that we
*cannot* go there.** See §0.3, rewritten accordingly. Say what is true: *"we coordinate observation
quadcopters; strike coordination is not on our roadmap and not in our product."* Do not say *"we
never could."*

This narrowing is worth more than it costs, in four ways:

1. **It matches the aircraft that are actually everywhere.** The whole finding of this document is
   that the volume tier — in the army, in the Police, in the Fire Authority, in the Prison
   Service — is COTS quads from two manufacturers (§1.1, §1.3a). We are scoping onto the fat part
   of the distribution, not away from it.
2. **It collapses the integration surface to a tractable one.** A quad exposes position, battery,
   heading and a camera stream over a documented vendor SDK. Fixed-wing and MALE platforms sit
   behind military C2 systems we cannot integrate with as a pre-seed company, and loitering
   munitions are consumed on use, which breaks the whole idea of routing an airframe home.
3. **It keeps the weapons-system line clean — as a roadmap commitment, not a structural one.**
   `SwarmOps_UseCases.md` §2 states SwarmOps is not a weapons system, and
   `SwarmOps_Market_Sizing.md` §3.1 flags that coordinating strike aircraft crosses that line and
   carries export-licensing and investor consequences. **Restricting current scope to simple quads
   keeps the product on the right side of that line today.** *(Revised 2026-08-19: an earlier
   version of this section claimed the scope "settles that question structurally instead of by
   promise." With the scope now explicitly current-phase rather than permanent, that claim is
   overstated and has been withdrawn — it would not survive a diligence question that asks whether
   the boundary is technical or strategic. The answer is strategic.)* **The defensible sentence:**
   *"We coordinate observation-and-carry quadcopters. Strike coordination is not in the product and
   not on the roadmap."* Both halves are true and checkable. Do not extend it to "we never could" —
   §0 no longer supports that, and being caught overclaiming on this specific question is
   disproportionately damaging.
4. **It makes the model claim honest.** Battery-as-binding-constraint routing assumes an aircraft
   with a rechargeable battery, hover capability and a return leg. That is a quad. It is not a
   Lanius and it is not a Hermes. **This one *is* structural** — it is a property of the algorithm,
   not a decision — and it is the reason the near-term scope is not arbitrary.

**Cost of the narrowing, stated plainly:** it excludes the highest-unit-cost aircraft in the
Israeli inventory, so anyone reasoning from hardware spend to software spend will size us against
the cheap tier. §1.4's 25× argument survives this — FPV quads are inside scope — but the
loitering-munition and MALE budgets are not ours to point at today, and we should stop pointing at
them.

**What "future R&D reference" means concretely.** The out-of-scope tiers are not deleted, they are
sequenced. Fixed-wing and VTOL hybrids are the natural second class — they have batteries or fuel
budgets, a return leg, and an endurance model our planner's shape already fits. MALE aircraft and
loitering munitions are not: the first sits behind military C2 we cannot reach as a pre-seed
company, and the second is consumed on use, which breaks the return-leg assumption the whole
optimizer rests on. **So the R&D path is: quads → fixed-wing/VTOL → (a different product, if ever)
— not a single ladder to everything.** Record it that way so nobody later reads "not permanent" as
"eventually all of it."

---

## 1. The four findings that change something

Ordered by how much they change what we say and build, not by how interesting they are.

### 1.1 Israeli public-safety fleets are already multi-vendor, and it is documented

[SOURCED — Calcalist/Ctech, April 2026, from official procurement documents]:

| Agency | Fleet composition | 2025 spend | 2024 | 2023 |
|---|---|---|---|---|
| **Israel Police** | **11 DJI models + 2 Autel Robotics models + 3 Aero Sol (Israeli) models** | ₪10.05M (~$3.33M) | ₪4M (~$1.32M) | ₪9.65M (~$3.2M) |
| **Fire & Rescue Authority** | **8 DJI models, exclusively DJI** | ₪300K (~$99K) | ₪230K (~$76K) | ₪43K (~$14K) |
| **Israel Prison Service** | **5 DJI models + 1 Skydio + 1 XTEND** | ₪2.1M (~$695K) | none | ₪640K (~$212K) |

**Why this is the most useful single table we have found.** Every SwarmOps document asserts that
real fleets are heterogeneous and that no manufacturer's software will coordinate a competitor's
aircraft. Until now that was an argument. This is a named public body running **16 distinct
aircraft models from three manufacturers** — and it is the smallest of the three agencies by
model count that matters, because the Police is the one buying at scale. A vendor-locked
coordination product is structurally incapable of covering that fleet. Ours is the only shape
that can.

**Second-order reading, and it is worth saying in the room:** the article's own angle is that
Israeli public-safety drone fleets run largely on **Chinese** technology, at a moment of global
scrutiny of exactly that. A vendor-neutral coordination layer is also the layer that makes a
future *migration* off DJI survivable — the fleet changes underneath, the coordination layer and
the operators' habits do not. We are not a counter-China play and should not pitch as one, but
the substitution risk that agency sits on is an argument for a layer above the aircraft.

**Caveat before this is quoted:** "models" is not "aircraft." Eleven DJI models could be 30
airframes or 300. The unit counts are not public and the model count is the only figure the
source gives. Say *models*, never *drones*.

### 1.2 There is already a *mandatory* UTM regime in Israeli civil airspace — and a licensed incumbent

[SOURCED — CAAI via Unmanned Airspace / DroneLife]: the CAAI issued an emergency ruling that
**drones may fly in Israel only while continuously broadcasting operational data to an approved
UTM system** — the first time a UTM connection has been made a *precondition* of flight approval
anywhere. **High Lander Aviation** holds a CAAI license to provide U-space services throughout
Israel with its **Vega UTM**, and separately sells a **Universal UTM / Mission Control** product
that "allows multiple drone operations to fly safely in overlapping airspace, seamlessly
rerouting drones to avoid collisions, no-fly zones and other obstacles," autonomously approving
and denying flight plans by prioritization protocol. It has been exported (Paras Aerospace,
India).

**This is the most important correction this research forces on our positioning, and it cuts two
ways.**

The bad half: `SwarmOps_Market_Sizing.md` §5.8 proposes SwarmOps as "a unified Israeli
coordination layer — the national standard." Read plainly, part of that role is **already
licensed to someone else**, and the description of Vega's capability overlaps our Filter-B pitch
closely enough that an investor who knows the market will raise it. We should raise it first.
§5.8 needs revising rather than deleting.

The good half, and it is genuinely good:

1. **Mandatory UTM connection means every civil operator in Israel is already required to be
   telemetry-connected.** The integration barrier we assumed we would have to overcome — getting
   operators to stream position data to a third party — has been removed by regulation. That is
   a tailwind almost nowhere else has.
2. **UTM and mission coordination are different products, and the distinction is defensible.**
   UTM answers *may this aircraft be in this airspace, and will it hit anything* — separation and
   authorization, a regulator-facing safety function. SwarmOps answers *which aircraft should
   take which task, in what order, and can it finish on the battery it has* — assignment,
   sequencing, feasibility, a mission-outcome function. Vega approving a flight plan does not
   decide whose flight plan it should have been. **We do not compete for the UTM license; we
   consume it.**
3. **It is a partner-or-acquirer, not just a rival.** A licensed U-space provider with no
   optimizer is the natural integration counterpart to an optimizer with no license.

**Action, not just observation:** the honest competitive claim in `SwarmOps_Market_Sizing.md`
§8.10 — "almost nobody sells the coordination layer neutrally" — needs testing against High
Lander specifically, before the next investor conversation, not after. Read their product pages
and, if possible, get a demo. This is now the highest-priority item in the competitive census.

### 1.3 The IDF's small-drone estate is wide, fragmented, and organized bottom-up

Platforms named in open sources [SOURCED — Modern War Institute case study, plus the procurement
reporting already collected in `SwarmOps_Market_Sizing.md` §3.1]:

| Tier | Platforms | Scope | Notes |
|---|---|---|---|
| **COTS quadcopters** | **DJI Mavic**, **DJI Matrice**, **DJI Avata** (tunnel exploration, 2023), **Autel EVO** | ✅ **in — this is the product** | Bought centrally *and* independently. Confirmed first-hand, §1.3a |
| **Micro / tactical ISR** | **Xtender**, **Wolverine** (micro-drone with robotic arm), **Ninox**, **Rhino** | ✅ in (multirotor) | Xtend and Robotican-class Israeli micro platforms, unit-level |
| **FPV, volume tier** | **XTEND FPV** — 5,000 units, ~₪20M (~$6M), ~₪3,500 each, 10-inch airframe, up to 2.5 kg payload, to Ground Forces special units; a further **12,000-aircraft FPV tender**; plus an **in-house IDF production line** stood up to cut unit cost | ⚠️ in as airframes, payload not our concern | The volume story. Coordinate the aircraft, stay silent on what it carries (Market Sizing §3.1) |
| **Loitering / precision strike** | **Maoz**, **Lanius** (Elbit), Spike **Firefly** (Rafael), **Rotem L** (IAI) | ❌ **out** — §0 | Single-use, so there is no return leg to route. Also the weapons-system line |
| **Tactical fixed-wing** | **Elbit Skylark** (artillery corps, from early 2000s) | ❌ out — §0 | Under ground-unit command, but not a quad |
| **MALE / strategic** | **Hermes 450** (IAF, Palmachim), **Hermes 900** (in service 2012), **IAI Heron** | ❌ out — §0 | Air Force squadrons with existing C2 — *not* our market |

#### 1.3a First-hand: what was actually flying, infantry, late 2025

**[PRIMARY — Tony Verin, infantry service, ~December 2025, recorded 2026-08-18]:** at unit level
the only aircraft encountered were **DJI and Autel** — **Mavic**, **Matrice**, **EVO**. No other
manufacturer, no other class.

This is a single observer in a single role over a bounded period, and it is stated that way. It is
not an inventory. But it is the highest-quality evidence in this document, for a reason worth
naming: **it is the only source here that reports what was in the air rather than what was
procured**, and the two diverge constantly in this sector — a tender is a purchase order, not a
fielded capability, and press coverage tracks tenders because tenders are announced.

Three things it does:

1. **It converges with the civilian data, and that convergence is the finding.** §1.1 says three
   Israeli public-safety agencies fly DJI plus Autel plus a thin tail. §1.3a says an infantry unit
   flew DJI plus Autel. **Two entirely independent segments, same two manufacturers.** Neither
   observation was collected to confirm the other. When a defense sample and a civil-procurement
   sample land on the same answer, the answer is probably the market.
2. **It confirms the adapter order empirically rather than by inference.** §4 derives DJI → Autel
   from a model count. This derives it from what a soldier held. Same conclusion, different
   method — which is the same "two independent constructions agreeing" argument that
   `SwarmOps_Market_Sizing.md` §3.5(b) identifies as the strongest form of evidence in these
   documents. Use it the same way.
3. **It bounds the exotic tier.** It corroborates the existing note in `SwarmOps_Market_Sizing.md`
   §3.1 — the same team member never encountered Rafael/Elbit/IAI precision systems in service —
   and extends it: the Israeli micro platforms (Xtender, Wolverine, Ninox, Rhino) that appear
   prominently in vendor material and in the MWI study were **not** what an ordinary infantry unit
   was flying. They are real, they are fielded somewhere, and they are not the fat part of the
   distribution. Weight the platform table in §1.3 accordingly: **the top row is the market and
   the rest is context.**

**How to use it in a room.** As a first-hand account, attributed, with its limits stated — "one of
us was flying these in an infantry unit eight months ago; it was DJI and Autel, Mavic, Matrice,
EVO." That is credible and it is checkable. Do not generalize it to "the IDF flies only DJI and
Autel," which the observation does not support and which the FPV tenders directly contradict.

#### Structural facts

Three structural facts matter more than the platform list itself:

1. **Drones sit at every echelon simultaneously.** The MWI study describes drones proliferating
   "at all levels of the army," with units operating as "drone bands" flying "packs of
   reconnaissance and attack UAS." Doctrine has placed an organic aerial capability at company
   level since at least 2017, when the IDF fielded Mavic at company-commander level with a
   three-person operating team beneath each commander, and Matrice to Combat Intelligence
   battalions [SOURCED — Times of Israel, 2017; **that article is nine years old and describes
   the origin of the doctrine, not today's inventory** — do not quote its quantities as current].
2. **Procurement is not only central.** The **55th Paratroopers Brigade independently acquired
   over one hundred commercial drones** [SOURCED — MWI]. A formation buying its own aircraft
   outside the central pipeline is the clearest possible evidence that no single system has
   visibility over what is airborne — you cannot have a unified picture of a fleet nobody
   centrally knows the size of.
3. **No open source describes deconfliction between them.** We checked specifically. The MWI case
   study, the procurement reporting, and the ToI coverage all provide **no** information on
   airspace coordination or deconfliction procedures for multiple simultaneous tactical drones.
   Absence of evidence is not evidence of absence and we must not claim otherwise — but it is
   consistent with the gap described first-hand in Business Overview §2, and it means the claim
   in `SwarmOps_Market_Sizing.md` §3.3 ("nothing aggregates every drone currently airborne into
   one picture") is **not contradicted by anything in the public record.** That is the strongest
   statement the sourcing supports. Say exactly that and no more.

### 1.4 Defense-first is now supported by the spending data, not just by our network

The pre-investor direction was to lean defense before civilian commercial. The numbers back it:

- Israel Police, the largest civilian public-safety drone buyer we found, spent **₪10.05M in
  2025** — on aircraft, across the whole national force. That is the *entire hardware* budget of
  the segment; coordination software is a fraction of a fraction of it.
- The FPV tenders alone run to **₪240–300M** of aircraft [SOURCED, via Market Sizing §3.2a].
- Israeli defense-tech startups working with the MoD raised **~$3B in H1 2026**, ~30% of all
  Israeli private hi-tech investment [SOURCED — Jerusalem Post, already cited in Market Sizing
  §3.3].

**The order-of-magnitude gap between the defense and civilian public-safety tiers is roughly 25×
on hardware spend alone.** Defense-first is not a preference; on this data it is the only
sequencing that puts us in front of a budget large enough to matter.

**The counterweight, and it belongs in the same breath.** `SwarmOps_Market_Sizing.md` §4 is
explicit that defense procurement runs **12–24 months**, against a pre-seed runway, with four
people and no sales function. Defense-first raises the prize and lengthens the cycle at the same
time. The coherent version of the strategy — and the version that survives a diligence question —
is: **defense is the market thesis; a fast civilian reference customer is the survival plan.**
Critical infrastructure and site security (§3 below) are where that reference comes from, and
they are adjacent enough to defense that the reference transfers. Do not read "defense first" as
"stop talking to Mekorot."

---

## 2. Segment census — defense & security

### 2.1 IDF

Covered in §1.3. The commercially relevant shape, restated for the deck:

- **The volume is at the bottom.** Thousands of cheap aircraft, one operator each, at unit level.
- **The estate is heterogeneous by construction** — Israeli micro platforms, Israeli loitering
  munitions, Chinese COTS quadcopters, and an in-house production line, all concurrent.
- **Formations buy independently**, so the estate is heterogeneous even *within* a brigade.
- **Air Force MALE assets (Hermes/Heron) are out of scope** and should be explicitly excluded
  when we talk to investors — they are flown by trained aircrew in a squadron structure with
  existing C2, and claiming them inflates the story in a way a defense-literate listener catches
  immediately.

### 2.2 Israel Police

11 DJI + 2 Autel + 3 Aero Sol models; ₪10.05M in 2025, up 2.5× on 2024 [SOURCED — Calcalist]. The
Police is separately preparing **counter-drone / interception** capability in the urban space
[SOURCED — Calcalist Hebrew], and has bought **drone forensics** access covering 80+ platforms
via Cellebrite's acquisition of SCG [SOURCED — HaMakom, March 2026]. Those two are adjacent to us,
not our product — but they are evidence of a force building a whole drone practice, not a pilot.

**Aero Sol** is an Israeli manufacturer in the Police fleet; **Veloryx** is reported to be nearing
a deal for a **70% stake** in it [SOURCED — Ynet]. Worth tracking as a potential hardware partner
with an existing public-safety install base.

### 2.3 Fire & Rescue Authority, Israel Prison Service

Fire & Rescue: **8 DJI models, exclusively DJI**, but tiny budgets (₪300K in 2025) — the *least*
promising near-term buyer in this document despite a genuine coordination need at incident scenes.
Prison Service: **5 DJI + 1 Skydio + 1 XTEND**, ₪2.1M in 2025 [both SOURCED — Calcalist].

Emergency response is moving fast in Israel more broadly [SOURCED — Israel Hayom, March 2026, on
the drone revolution in emergency response] and multi-agency incident scenes are a textbook
Filter-B case: several agencies, several aircraft, one airspace, no shared picture. Low budget,
high narrative value. **Use as a story, not as a forecast.**

### 2.4 Site security & perimeter

Israel's Defense Ministry has awarded contracts to **Autonomous Guard** (via BeeSense for
multi-domain threat detection, Skylock for drone detection), and local authorities are investing
in a "civilian aerial dome" for border-seam areas, with INDI having demonstrated critical-
infrastructure security via managed aerial networks [SOURCED — The Defense Post, March 2026;
Israel Hayom]. Counter-UAS specifically (Innoviz + Cogniteam; DefendAir) is a **partner adjacency,
not our market** — position exactly as `SwarmOps_Market_Sizing.md` §5.9 already says.

---

## 3. Segment census — civilian

### 3.1 Critical infrastructure

**Percepto** is the anchor reference point: drone-in-a-box for autonomous inspection, holder of
**CAAI BVLOS approval for operation at three Israeli industrial sites without an operator on
site**, including **national water company Mekorot's Eshkol site**; raised **$67M Series C** after
a US FAA waiver [SOURCED — Percepto / DroneLife / Times of Israel]. Also active in the segment:
**Airobotics**, **vHive**, **Tando** (indoor autonomous fleets for buildings, data centres,
warehouses).

**Read Percepto correctly — it is a competitor-shaped fact, not a customer-shaped one.** A
single-vendor, single-site, fully-autonomous drone-in-a-box is a *closed* system: it supplies its
own aircraft, its own dock, and its own autonomy. It does not need a coordination layer above it
until a site runs several such systems from different vendors, or mixes them with hand-flown
aircraft. That is the opening, and it is narrower than the infrastructure segment looks from
outside. Size it honestly before leaning on it.

### 3.2 Agriculture — **this is the gap**

We found **no Israel-specific sourced data** on agricultural drone usage: no operator counts, no
platform census, no spray-approval numbers, no CAAI figures. What we have is global context (DJI
reports **600,000+ agricultural drones in use worldwide by end-2025** with **600,000+ trained
operators** [SOURCED — DJI, via PRNewswire]) and Israeli agri-tech that is *adjacent but not our
case*: **Tevel Aerobotics** (Gedera, founded 2016, Series B) flies autonomous **fruit-picking**
robots, not spraying or survey fleets.

**Do not present agriculture as a sized segment.** `SwarmOps_Market_Sizing.md` §3.3 currently
lists agriculture at $15–40K ACV; that figure has no platform-level or operator-level evidence
behind it in this document, and this is exactly the kind of number the pre-investor room asked us
to substantiate. Either go get the data (§8, item 5) or drop the row to a mention. One further
complication worth knowing before we chase it: spraying operations in Israel appear to require
approval and pilot training **beyond** the basic commercial licence [SOURCED, weakly — secondary
regulatory summaries only], which shrinks the operator population and probably concentrates it —
good for enumeration, bad for volume.

### 3.3 Commercial drone-service operators

`SwarmOps_Market_Sizing.md` §3.3 already records **117 drone startups registered in Israel**
[SOURCED — Tracxn] with the correct caveat that most are *manufacturers*, not fleet operators.
Nothing found in this round improves on that. CAAI **does** require every commercially-operated
drone to be individually registered and every commercial pilot to be licensed — so an authoritative
count exists; it is simply not published. **Asking CAAI directly is the single cheapest
high-value research action available to us** and it now has two questions attached to it, not one
(§8, items 1 and 2).

---

## 4. Vendor concentration — and what it means for build order

Counting distinct models across the three public-safety agencies documented in §1.1:

| Manufacturer | Models across Police + Fire & Rescue + Prison Service | Share |
|---|---|---|
| **DJI** | 24 | **75%** |
| **Autel Robotics** | 2 | 6% |
| **Aero Sol** (IL) | 3 | 9% |
| **Skydio** | 1 | 3% |
| **XTEND** (IL) | 1 | 3% |

[MODELLED — simple count over the Calcalist figures. It counts *models*, not airframes, and covers
three agencies only. It is indicative of vendor mix, not a market share.]

**Restricted to simple quadcopters (§0), the picture gets simpler, not more complicated.** DJI and
Autel between them are **81% of documented public-safety models** and — independently — the only
two manufacturers an infantry unit was flying in late 2025 [PRIMARY, §1.3a]. Aero Sol, Skydio and
XTEND are the tail in the civil data and were absent from the military observation. **Two
manufacturers cover the overwhelming majority of the quadcopter estate in both segments.**

That is the whole integration thesis in one line, and it is unusually convenient: a vendor-neutral
coordination layer that is *useful on day one* needs two adapters, not twelve. Say it exactly that
way — "two integrations reach most of the aircraft flying in Israel today" is a de-risking claim,
and de-risking claims are what a pre-seed room is listening for.

**Implication for the Phase 1 hardware-integration work in `actual_prod.md`, and this is the most
directly actionable thing in this document:**

1. **DJI adapter first, and it is not close.** Three of three agencies fly DJI; it is the majority
   of every documented civilian fleet and it is present inside the IDF as COTS. The existing
   research (see the team memory on real-drone hardware integration: DJI `LiveStreamManager` /
   PSDK / MediaMTX) is aimed at the right target.
2. **Autel second, and the case for it is now much stronger than a 6% model count suggests.** It
   is in the Police fleet *and* it is one of only two manufacturers observed in infantry service
   [PRIMARY, §1.3a]. The model count understates it because model counts weight a manufacturer by
   catalogue breadth rather than by how many units are in the air. **DJI + Autel is the pair that
   makes the product usable on day one** (§4) — treat these two as one milestone, not two.
3. **XTEND third, and it is the strategic one rather than the volume one.** Israeli, in the
   Prison Service fleet, and the supplier of the 5,000-unit FPV tender. An XTEND adapter is the
   bridge from the civilian product into the defense conversation.
4. **Skydio and Aero Sol: later.** Low model counts; revisit if a specific deal needs them.

**Say this in the investor conversation as a sequencing claim, not a wish list** — "our first
three integrations cover the aircraft that three named Israeli agencies and the IDF's volume
tender actually fly" is a far stronger sentence than any market-size figure in this document.

---

## 5. What this does to the existing documents

Nothing below is edited yet — flagged here for a decision, per the working agreement that
cross-document claim changes get raised rather than made silently.

| Document | Change needed | Why |
|---|---|---|
| `SwarmOps_Market_Sizing.md` §5.8 (national coordination layer) | **Revise** — acknowledge High Lander's CAAI U-space licence and reframe SwarmOps as the mission-coordination layer above UTM, not as the national traffic layer | §1.2. Currently claims a role that is partly licensed to another company |
| `SwarmOps_Market_Sizing.md` §8.10 (competitive census) | **Re-prioritise** — High Lander becomes item 1, named | §1.2 |
| `SwarmOps_Market_Sizing.md` §3.3 (agriculture ACV row) | **Downgrade or substantiate** | §3.2 — no platform-level evidence |
| `SwarmOps_Market_Sizing.md` §3.3 / §5.4 (BVLOS advantage) | **Strengthen** — add the mandatory-UTM-connection ruling, which is a bigger operator-side tailwind than the INDI trials already cited | §1.2 |
| `SwarmOps_UseCases.md`, Business Overview EN/HE | **Add the §1.1 multi-vendor table** where the heterogeneous-fleet claim is currently asserted without evidence | It converts an argument into a citation |
| `actual_prod.md` | **Confirm adapter order** DJI → Autel → XTEND, with DJI+Autel as a single day-one milestone | §4 |
| `SwarmOps_PRD.md`, `SwarmOps_UseCases.md` §2, `CLAUDE.md` | **Record the simple-quadcopter scope decision** (§0) — it is a product-boundary change, not a research note, and it is the structural answer to the weapons-system question | §0 |
| Fabelino deck | Likely a slide: "16 models, 3 manufacturers, one agency" | Cleanest single visual in this research |

**And the strategy note itself:** defense-first should be written down somewhere durable with the
runway counterweight attached (§1.4), or it will drift into "we stopped selling to civilians"
without anyone deciding that.

---

## 6. What is safe to say outward-facing

✅ **Safe** — sourced, quotable with the source named:
Israel Police operating **11 DJI + 2 Autel + 3 Aero Sol models** and spending **₪10.05M in 2025**
(Calcalist, Apr 2026) · Fire & Rescue on **8 DJI models**, Prison Service on **5 DJI + 1 Skydio +
1 XTEND** (same) · **XTEND 5,000-unit FPV tender at ~₪3,500/unit**, plus a 12,000-aircraft tender
and an in-house IDF line (Jerusalem Post, Times of Israel, Israel Defense) · the **55th Paratroopers
Brigade acquiring 100+ commercial drones independently** (Modern War Institute) · **CAAI requiring
continuous UTM broadcast as a precondition of flight**, with High Lander's Vega first-licensed
(CAAI via Unmanned Airspace, DroneLife) · **Percepto's CAAI BVLOS approval at three Israeli
industrial sites incl. Mekorot Eshkol** (Percepto, DroneLife).

✅ **Safe, and lead with this one** — the first-hand account, attributed and bounded:
*"One of our founders was flying these in an infantry unit eight months ago. It was DJI and Autel —
Mavic, Matrice, EVO."* [PRIMARY, §1.3a]. Checkable, specific, and it converges with the
independent civil-procurement data in §1.1. Strongest sentence in this document.

⚠️ **Only with the caveat attached:**
The 75% DJI / 81% DJI+Autel figures — **model** counts over **three agencies**, not market share
(§4) · the 2017 Times of Israel company-commander deployment — historical doctrine, not current
inventory (§1.3) · "no coordination layer exists in the IDF" — the correct claim is that **no open
source describes one**, plus our own first-hand account (§1.3).

❌ **Never:**
"Israel Police operates 16 drones" (it is 16 *models*) · any aircraft count for the IDF — none is
public and inventing one is instantly disqualifying · agriculture as a sized segment (§3.2) ·
SwarmOps as "Israel's national drone traffic layer" — that role is licensed to High Lander (§1.2) ·
**"the IDF flies only DJI and Autel"** — §1.3a is one observer in one role and the FPV tenders
directly contradict it · any claim that implies we coordinate loitering munitions or strike
aircraft — out of scope by §0, and the scope decision is the answer to that question.

---

## 7. Known gaps in this research

1. **Airframe counts, everywhere.** We have model counts and shekel totals. Nobody publishes units.
2. **Agriculture, entirely** (§3.2).
3. **CAAI registration data** — how many commercial drones registered, fleet-size distribution,
   how many operators hold 3+ aircraft. This is the direct input to `SwarmOps_Market_Sizing.md`
   §8.2 and it is the number that moves Filter A SAM linearly.
4. **High Lander's actual product boundary** (§1.2) — read as a competitor, not from press coverage.
5. **Hebrew-language sources are under-used.** This round was mostly English. Israeli procurement
   reporting, CAAI publications, and agri-sector trade press are all Hebrew-first.
6. **Primary sources are one observer deep.** §1.3a is the only first-hand account in the document
   and it covers one role, one unit, one period. **The cheapest possible improvement to this
   research is more of the same:** three of the four founders served, three were drone operators
   (see the team background note). Ask the other two the identical question — *what were you
   flying, what did you see others flying, and how did you avoid each other* — and record the
   answers with the same [PRIMARY] discipline. Three independent accounts across different units
   and periods would be better evidence than anything in §8's brief, and it costs two
   conversations. Do this before the next investor meeting.

---

## 8. The research brief — run this next

Written to be handed to a deep-research tool or a person and executed without further context.
Prefer Hebrew sources where they exist; prefer primary documents (CAAI, MoD, tenders, procurement
records) over trade press; and return **"not found"** rather than an estimate for anything
unsourced.

> **Brief: Israeli drone platform and operator census, 2026.**
>
> Establish, with named sources and dates, which drone platforms are actually operated in Israel
> and by whom, across five segments. For every figure state whether it is a count of *models*,
> *airframes*, or *operators* — these are constantly conflated in reporting and the distinction is
> the point of the exercise. Where a number cannot be sourced, say so explicitly; do not estimate.
>
> **Scope restriction, applies throughout: simple multirotor quadcopters only.** Exclude loitering
> munitions, fixed-wing tactical UAS, MALE aircraft and VTOL hybrids except where naming them is
> needed to say what was excluded.
>
> 1. **IDF and Ministry of Defense — quadcopters only.** Which quadcopters are in service at unit
>    level, from which suppliers, in what quantities, at which echelon. Priority order: **DJI
>    (Mavic, Matrice, Avata) and Autel (EVO)** — these are the ones a team member observed in
>    infantry service in late 2025 and the ones we most need quantified — then Israeli micro
>    multirotors (XTEND Xtender/Wolverine, Robotican Ninox/Rhino), then FPV quads including the
>    XTEND tenders and the in-house IDF production line. For DJI and Autel specifically: how are
>    they procured (central tender, unit-level purchase, donation), and is there any published
>    figure for how many are in service? Note explicitly that Elbit Skylark, Lanius, Spike Firefly,
>    Rotem L and Hermes/Heron are **out of scope** and should be returned only as exclusions.
>    Then, the question that matters more than the platform list: **is there any published account
>    of how simultaneous tactical drone flights are deconflicted or coordinated between units** —
>    doctrine, C2 system, tender, lessons-learned document, or after-action reporting?
> 2. **Law enforcement and emergency services.** Update and extend the April 2026 Calcalist
>    figures for Israel Police, Fire & Rescue Authority and the Israel Prison Service: models per
>    manufacturer, airframe counts if obtainable, budgets by year, and how drone operations are
>    organized (dedicated unit vs distributed to districts). Add Magen David Adom, the Nature and
>    Parks Authority, the Airports Authority, and municipal enforcement bodies if they operate
>    aircraft. Look for tender documents (מכרזים) directly.
> 3. **Critical infrastructure and site security.** Which operators — Israel Electric Corporation,
>    Mekorot, Netivei Israel, rail, ports, energy — fly drones today, in-house or contracted;
>    which vendors (Percepto, Airobotics, vHive, Tando, others); how many sites; and whether any
>    single site runs aircraft from more than one vendor or mixes autonomous docks with hand-flown
>    aircraft. That mixed case is the customer we are looking for — find named instances of it.
> 4. **Agriculture — highest-priority gap.** How many agricultural drones operate in Israel; which
>    platforms (DJI Agras T-series and others); who operates them (kibbutz/moshav in-house vs
>    contracted spraying services); how many licensed spraying operators exist; and what the CAAI
>    and Ministry of Agriculture require for spray operations beyond a basic commercial licence.
>    Hebrew agricultural trade press and Ministry of Agriculture publications first.
> 5. **Commercial operators and the regulatory layer.** From CAAI: the number of registered
>    commercial drones, the number of licensed commercial pilots, and — critically — **the
>    fleet-size distribution** (what share of operators hold 1, 2, 3–5, 6–10, 10+ aircraft). Then
>    map the mandatory-UTM regime: the text and date of the ruling requiring continuous
>    operational-data broadcast, which providers hold U-space licences besides High Lander, what
>    the licensing process is, and precisely which functions a licensed UTM provider is authorized
>    to perform — specifically whether **mission assignment, task allocation and route
>    optimization** fall inside or outside that licensed scope.
>
> **Deliverable:** a table per segment (operator → platforms → quantity → source → date), plus a
> short answer to each of these three: (a) does any published source describe multi-unit drone
> deconfliction in the IDF; (b) what share of Israeli commercial operators fly 3+ aircraft; (c)
> what exactly is inside a CAAI U-space licence.

---

## Sources

- [Calcalist/Ctech — Israel police's drone fleet runs largely on Chinese technology (Apr 2026)](https://www.calcalistech.com/ctechnews/article/c4pnp0b8i) — **the §1.1 table**
- [Modern War Institute — A Case Study on Integrating Tactical Drones: Israel](https://mwi.westpoint.edu/a-case-study-on-integrating-tactical-drones-israel/)
- [Israel Defense — XTEND to supply thousands of advanced FPV drones to the IDF](https://www.israeldefense.co.il/en/node/66080)
- [Jerusalem Post — IDF to get 5,000 advanced FPV drones from Xtend](https://www.jpost.com/defense-and-tech/article-864805)
- [Jerusalem Post — IDF to buy thousands of FPV drones](https://www.jpost.com/defense-and-tech/article-893200)
- [Jerusalem Post — IDF in-house FPV drone production line](https://www.jpost.com/defense-and-tech/article-895890)
- [Militarnyi — IDF purchases FPV attack drones for the first time](https://militarnyi.com/en/news/idf-purchases-fpv-attack-drones-for-the-first-time/)
- [Times of Israel — IDF company commanders to receive collapsible drones (2017 — historical)](https://www.timesofisrael.com/idf-company-commanders-to-receive-collapsible-drones-by-years-end/)
- [DroneXL — DJI Avata drones in IDF tunnel operations (2023)](https://dronexl.co/2023/11/20/dji-avata-drones-idf-military-operations/)
- [Wikipedia (HE) — רחפנים בצה"ל](https://he.wikipedia.org/wiki/%D7%A8%D7%97%D7%A4%D7%A0%D7%99%D7%9D_%D7%91%D7%A6%D7%94%22%D7%9C)
- [Calcalist (HE) — משטרת ישראל נערכת ליירוט של טיסות רחפנים](https://www.calcalist.co.il/local_news/car/article/s10eg2rdh)
- [HaMakom (HE) — המשטרה קונה פריצה לרחפנים (Cellebrite/SCG, Mar 2026)](https://www.ha-makom.co.il/police-cellebrite-drones/)
- [Ynet — Veloryx nears deal to buy 70% stake in Aero Sol](https://www.ynetnews.com/business/article/sk6vpzkcbl)
- [Unmanned Airspace — High Lander granted CAAI licence for U-space services throughout Israel](https://www.unmannedairspace.info/latest-news-and-information/high-lander-aviation-granted-caai-license-to-provide-u-space-services-throughout-israel/)
- [DroneLife — High Lander Vega UTM, first CAAI licence, mandatory UTM connection](https://dronelife.com/2023/12/03/high-landers-vega-utm-pioneering-mandatory-drone-flight-management-in-israel/)
- [Unmanned Airspace — High Lander Universal UTM tested in busy Israeli airspace](https://www.unmannedairspace.info/uncategorized/high-lander-universal-utm-system-successfully-tested-in-busy-israeli-airspace/)
- [Percepto — CAAI BVLOS approval at three Israeli industrial sites incl. Mekorot Eshkol](https://percepto.co/regulatory-breakthrough-for-percepto-drones-to-fly-at-israeli-industrial-sites-without-operators-onsite/)
- [Times of Israel — Percepto raises $67M after US regulatory nod](https://www.timesofisrael.com/israeli-drone-maker-percepto-raises-67-million-after-us-regulatory-nod/)
- [The Defense Post — Israel taps local firm for counter-drone systems (Autonomous Guard, Mar 2026)](https://thedefensepost.com/2026/03/19/israel-autonomous-guard-drones/)
- [Israel Hayom (HE) — Blood, fire and regulation: the drone revolution reshaping emergency response (Mar 2026)](https://www.israelhayom.com/2026/03/24/blood-fire-and-regulation-the-drone-revolution-reshaping-emergency-response/)
- [Jerusalem Post — Israeli firms unveil drone-detection collaboration (Innoviz/Cogniteam)](https://www.jpost.com/defense-and-tech/article-901829)
- [PRNewswire — DJI Agriculture: 600,000+ agricultural drones in use globally by end-2025](https://www.prnewswire.com/news-releases/dji-agriculture-reveals-global-adoption-of-agricultural-drones-cuts-51mt-in-carbon-emissions-and-saves-410mts-of-water-for-farmers-globally-302757309.html)
- [Tracxn — Tevel Aerobotics company profile](https://tracxn.com/d/companies/tevel-aerobotics-technologies/__Yqleh8iAjhbLujyOgtLXkzySJlCSACD9B4vrOPDqUYc)
- [Library of Congress — Regulation of Drones: Israel](https://maint.loc.gov/law/help/regulation-of-drones/israel.php)
- [Drone Laws — Israel drone laws 2026](https://drone-laws.com/drone-laws-in-israel/)

*Retrieved 2026-08-18. Press-sourced procurement figures go stale fast in this sector — re-check
anything here before it is used in a funding conversation more than ~6 months out.*
