# SwarmOps — Drone Fact Pack: Counts, Platforms, Competitors, Talking Points

**Internal working document, opened 2026-08-19.** Four questions, four sections:

1. **How many drones** are actually out there — Israeli defense sector, Israeli civilian sector (§1)
2. **Which drones** — most common platforms and best sellers (§2)
3. **Who else builds what we build** — the competitive census, run properly for the first time (§3)
4. **Fun / mind-blowing facts** — the ones that survive a fact-check and are worth saying out loud (§4)

**How this relates to the documents that already exist.** `SwarmOps_Market_Sizing.md` sizes the
money. `SwarmOps_Israel_Drone_Landscape.md` counts operators and platforms in Israel and is
authoritative on the Israeli fleet composition. **This document does three things neither of them
does:** it puts numeric bands on aircraft counts (§1) instead of only model counts, it names the
actual competitors (§3) — which `SwarmOps_Market_Sizing.md` §8.10 listed as an *open* research
item and which `SwarmOps_Israel_Drone_Landscape.md` §7 flagged as gap #4 — and it collects the
quotable facts in one place (§4).

**Source discipline, inherited unchanged:**

- **[SOURCED]** — named third party, quotable with the source named.
- **[MODELLED]** — our construction from sourced inputs plus stated assumptions.
- **[ASSUMPTION]** — not validated. Measure before using in a funding conversation.
- **[PRIMARY]** — first-hand observation by a named team member, attributed and bounded.

> ### ⚠️ Read this before quoting anything in §1
>
> **Nobody publishes drone airframe counts. Not the IDF, not the CAAI, not the Police.** Every
> number in §1 is either a procurement figure (aircraft *ordered*, which is not aircraft *flying*),
> a model count (which is not an airframe count), or our own arithmetic tagged [MODELLED]. The
> single fastest way to lose a defense-literate room is to state an IDF drone inventory as fact.
> **Say the band and say the method.** That is stronger, not weaker — it signals we know which of
> our numbers are real.

---

## 1. How many drones — the counts

### 1.1 Bottom line

- **Israeli defense sector: tens of thousands of small drones, and the number is about to move an
  order of magnitude.** The IDF's stated ambition is **100,000 drones per year** of domestic
  production [SOURCED — Haaretz, 14 Aug 2026]. Documented orders already on the table total
  **17,000+ FPV airframes**, plus a state-owned production line starting at **1,000 units/month**.
- **No official IDF inventory figure exists.** The best sourced characterisation is from IDF drone
  school instructors: *tens of thousands of systems in ground forces, thousands airborne at any
  given moment* [SOURCED, weak — secondary aggregation, see caveat below].
- **Israeli civilian sector: roughly 25,000–60,000 airframes** [MODELLED — two independent
  constructions, §1.3]. The only official figure ever published is a CAAI estimate of **~20,000
  drones by 2017** [SOURCED — Ynet, Dec 2018], which is **eight years stale**.
- **The interesting number is not the total — it is the ratio.** Israel's civil fleet is roughly
  **1/20th to 1/40th of the US registered fleet** (855,860 FAA registrations, Oct 2026) in an
  airspace about **1/400th the size**, with a mandatory-UTM regime and a live air-defense picture
  on top of it. **Israel is the densest drone airspace problem in the developed world, at small
  absolute scale.** That is the single best framing of why the coordination problem shows up here
  first — and it is a *structural* argument, not a market-size argument.

### 1.2 Defense sector — what is actually sourced

| Figure | Value | Source / tag |
|---|---|---|
| IDF domestic production **ambition** | **100,000 drones/year** | [SOURCED] Haaretz, 14 Aug 2026 (headline confirmed; body paywalled) |
| State-owned FPV production line | **1,000 units/month** initially, "scaling to tens of thousands" | [SOURCED] Defense Express |
| XTEND FPV order | **5,000 units**, ~₪20M (~$6M), ~₪3,500/unit, 10-inch airframe, ≤2.5 kg payload | [SOURCED] Israel Defense, JPost |
| Follow-on FPV tender | **12,000 aircraft** | [SOURCED] JPost |
| Skydio delivery to IDF post-7 Oct 2023 | **100+ surveillance quadcopters** | [SOURCED] |
| 55th Paratroopers Brigade, independent purchase | **100+ commercial drones**, bought outside the central pipeline | [SOURCED] Modern War Institute |
| IDF ground-forces estate, qualitative | "tens of thousands of systems… thousands above the enemy at any given moment" | [SOURCED, **weak**] attributed to IDF drone-school instructors via secondary aggregation. **Do not quote as a number** — quote as "instructors describe it as tens of thousands." |
| Israel Police 2025 aircraft spend | **₪10.05M** (~$3.33M), **11 DJI + 2 Autel + 3 Aero Sol models** | [SOURCED] Calcalist, Apr 2026 |
| Fire & Rescue Authority | **8 DJI models**, ₪300K in 2025 | [SOURCED] Calcalist |
| Israel Prison Service | **5 DJI + 1 Skydio + 1 XTEND models**, ₪2.1M in 2025 | [SOURCED] Calcalist |
| Infantry unit, ~Dec 2025 | Only DJI and Autel encountered — **Mavic, Matrice, EVO** | [PRIMARY — Tony Verin] |

**[MODELLED] — the honest arithmetic on procured FPV airframes:** 5,000 (XTEND, delivered/ordered)
+ 12,000 (follow-on tender) = **17,000 airframes ordered**, before the in-house line, which alone
adds **12,000/year** at its opening rate. Against a stated ambition of 100,000/year, the direction
is unambiguous even though the current inventory is not published. *Assumption: tender quantities
were awarded at the announced size and are not double-counted between the two reports. Both are
press-sourced procurement figures and neither is a delivery confirmation.*

**What this does NOT tell us, and it is the number we actually want:** how many **in-scope
quadcopters** (Mavic/Matrice/EVO class, §0 of the Landscape doc) the IDF holds. FPV quads are
in-scope as airframes, but the surveillance-quad estate — the aircraft our product is built for —
has **no public figure at any confidence level**. Doctrine has placed an organic aerial capability
at company level since 2017, which implies low thousands at minimum, but that is an inference from
a nine-year-old doctrine article and we should not dress it up as a count.

### 1.3 Civilian sector — two independent constructions

**Construction A — extrapolate the CAAI's own estimate.** CAAI assessed **~20,000 drones in Israel
by 2017** (250 g–25 kg) [SOURCED — Ynet, Dec 2018, quoting CAAI]. The same article records the
licensed-aerial-operator count going from **1 in 2014 to ~120 in 2018** — a 120× rise in four
years — and notes registration was not then required for hobby use, so the 20,000 was itself an
estimate of a mostly-unregistered population. Applying even modest growth over eight years lands in
the **40,000–80,000** range.

**Construction B — per-capita against the US.** FAA registrations: **855,860** as of Oct 2026, US
population ~340M → **~2.5 registered drones per 1,000 people**. Israel at ~10M people →
**~25,000 registered-equivalent**. The FAA's own *total fleet* estimate (~3M including sub-250 g
aircraft that need no registration) is ~3.5× its registration count; applying the same multiplier
to Israel gives **~85,000 total airframes**.

**Converged band: ~25,000 registered-equivalent, ~40,000–80,000 total airframes.**
Call it **"tens of thousands"** in a room and **25k–60k** if pressed for a number, with the method
stated. [MODELLED — both constructions, stated assumptions above. Neither is a census; the CAAI has
the real number and has not published it.]

**Global context for scale** [all SOURCED]:

- **855,860** FAA-registered US drones (Oct 2026) — 536,183 recreational / 316,075 commercial
- **~3 million** estimated actual US fleet including unregistered sub-250 g aircraft
- **600,000+** agricultural drones in use worldwide by end-2025 (DJI), with 600,000+ trained operators
- **300,000+** DJI spray drones in China alone
- **5.6 million** projected global commercial UAS fleet by 2050 (Valour Consultancy)
- **117** drone startups registered in Israel (Tracxn) — mostly manufacturers, not fleet operators

### 1.4 Why this section matters commercially

Two things fall out, and only one of them is comfortable:

- **Comfortable:** the defense estate is heterogeneous, growing by an order of magnitude, and
  procured partly *outside* any central pipeline (55th Brigade). You cannot have a unified picture
  of a fleet nobody centrally knows the size of. That is our problem statement, stated by the
  procurement structure itself.
- **Uncomfortable:** the civilian fleet is **tens of thousands of airframes, mostly one-per-operator**.
  Filter A (one operator, several aircraft) is a *small* market in Israel in absolute terms. This is
  further evidence for what `SwarmOps_Market_Sizing.md` §3.1 already says — Filter B is the real
  market — and it should sharpen how hard we push on Filter B rather than being buried.

---

## 2. Which drones — most common platforms and best sellers

### 2.1 Bottom line

- **DJI is the market, by a margin that makes vendor-neutrality a strange-sounding pitch until you
  look at the second manufacturer.** DJI holds **~70%+ of the global consumer and commercial
  market**, **~80% of US consumer**, and accounted for **83.48% of all drone detections worldwide
  in 2025** [SOURCED]. In documented Israeli public-safety fleets it is **75% of models**.
- **The pair that matters is DJI + Autel = 81% of documented Israeli public-safety models**, and —
  independently — the only two manufacturers observed in infantry service in late 2025 [PRIMARY].
  **Two adapters reach most of the aircraft flying in Israel.**
- **The best-selling *enterprise* aircraft are a short list, and it is stable across agencies:**
  DJI Mavic 3 Enterprise / Thermal, DJI Matrice 30T, DJI Matrice 350/400 RTK. Everything else is
  tail.
- **The best-selling *consumer* aircraft is the Mini series**, and its defining property is
  regulatory, not technical: **sub-250 g means no registration in most jurisdictions**. That is
  precisely why civil fleet counts are unknowable (§1.3).
- **The best-selling *military* aircraft in Israel right now is a ~₪3,500 10-inch FPV quad.**
  Volume tier, disposable economics, 17,000+ ordered.

### 2.2 The platform table

| Tier | Platform | Approx. price | Where it shows up | Tag |
|---|---|---|---|---|
| **Enterprise workhorse** | **DJI Matrice 30T** | ~$10,200 | Public safety standard — all-weather thermal + zoom | [SOURCED] |
| **Enterprise heavy** | **DJI Matrice 400 / 350 RTK** | ~$10,450+ | Heavy payload; the Zenmuse H30T thermal payload is the 2026 benchmark | [SOURCED] |
| **Enterprise portable** | **DJI Mavic 3 Enterprise / 3T Thermal** | ~$6,700 | Rapid-deployment thermal; the most common single agency aircraft | [SOURCED] |
| **Consumer best-seller** | **DJI Mini 4 Pro / Mini 5 Pro** | ~$759–1,100 | Sub-250 g, no registration required — the reason fleet counts are guesses | [SOURCED] |
| **Consumer all-rounder** | **DJI Air 3S** | from $1,099 | "Ultimate all-rounder for 2026" per buying guides | [SOURCED] |
| **Consumer flagship** | **DJI Mavic 4 Pro** | premium | 6K video, 100MP stills, 60 mph | [SOURCED] |
| **The #2 manufacturer** | **Autel EVO II / EVO Max 4T** | ~$8,000+ | Israel Police fleet; observed in infantry service | [SOURCED] + [PRIMARY] |
| **US/NDAA alternative** | **Skydio X10 / R10** | ~$6,000 + ~$3,000/yr | Israel Prison Service; 100+ delivered to IDF post-Oct 7 | [SOURCED] |
| **Israeli tactical micro** | **XTEND Xtender / Wolverine**, **Robotican Ninox / Rhino** | n/a | Unit-level ISR; real but **not** what an ordinary infantry unit flies | [SOURCED] + [PRIMARY] |
| **Volume military tier** | **10-inch FPV quad** (XTEND + in-house) | **~₪3,500 (~$950)** | 17,000+ ordered. ≤2.5 kg payload | [SOURCED] |
| **Israeli public-safety local** | **Aero Sol** | n/a | 3 models in Israel Police fleet; Veloryx reportedly nearing a 70% stake | [SOURCED] |
| **Out of scope (§0)** | Lanius, Firefly, Rotem L, Skylark, Hermes 450/900, Heron | — | Named only so nobody re-adds them | [SOURCED] |

### 2.3 One conflict in the sourcing, stated openly

DJI's market share is reported as **43%**, **~70%**, **~80% (US consumer)** and **83.48% (of
detections)** depending on the source and — critically — on what is being measured: revenue,
units, consumer-only, or aircraft observed in the air. **Use "over 70% of the global consumer and
commercial market" and name the measure.** Do not cite the 83.48% detection figure as market
share; it is a detection statistic and a sharp listener will catch the substitution.

### 2.4 What this means for the build

Unchanged from `SwarmOps_Israel_Drone_Landscape.md` §4, now with price data attached:
**DJI + Autel as one day-one milestone → XTEND third.** The commercially useful sentence is that
**two integrations reach most of the aircraft flying in Israel today**, and the price table is
what makes the third point land: the aircraft we coordinate cost $950–$10,000 each, which is why
the coordination layer has to be cheap relative to the fleet and why per-seat pricing beats
per-aircraft pricing at the FPV tier.

---

## 3. Competitors — who else builds this

### 3.1 Bottom line — and this is the section that changes our story

- **The working hypothesis was "almost nobody sells the coordination layer neutrally"
  (`SwarmOps_Market_Sizing.md` §8.10). That hypothesis does not survive this research.** At least
  **six** funded companies sell multi-drone, multi-vendor coordination as a *primary* product, two
  of them Israeli, and three shipped major coordination releases in the last 12 months.
- **The category is not empty. It is forming, fast, and well-funded.** Shield AI at **$5.3B**,
  Anduril's Lattice underpinning **$642M+** in contracts, Auterion **$130M** raised plus a **$50M**
  Pentagon contract, XTEND on a **$20M** Israeli MoD contract, SkyfireAI **$11M** seed in April 2026.
- **Reframe rather than retreat.** "Nobody does this" is now false and saying it is a diligence
  risk. **"This category is forming and we are natively vendor-neutral, battery-feasibility-first,
  and Israeli"** is defensible and true. First-mover is gone; *right-shaped* is still available.
- **The genuinely defensible slice is narrower than the pitch has assumed:** battery-as-binding-
  constraint **assignment and sequencing** for heterogeneous COTS quadcopter fleets. Not swarm
  autonomy (Auterion, Elbit), not airspace separation (High Lander, Airwayz), not single-site
  autonomy (Percepto, FlytBase).

### 3.2 Tier A — Israeli airspace/UTM incumbents (the nearest neighbours)

| Company | What it is | Why it matters to us |
|---|---|---|
| **High Lander Aviation** | **Vega UTM** — holds the **CAAI licence to provide U-space services throughout Israel**. Products: Vega UTM (registration, flight authorization, real-time traffic, counter-UAS), **Vega HighSite** (site-specific airspace management for ports/factories/cities, launched Jul 2025), **Vega CIS** (common information service). Also sells **Universal UTM / Mission Control**, which "allows multiple drone operations to fly safely in overlapping airspace, seamlessly rerouting drones." Exported to India (Paras Aerospace). **Strategic investment from EDGE (UAE).** | **The #1 competitive fact in this document.** Part of the "national coordination layer" role in `SwarmOps_Market_Sizing.md` §5.8 is *already licensed to them*. Their Mission Control product overlaps our Filter-B pitch. **Vega HighSite is the one to read closely — site-specific multi-operator coordination is the closest thing to our product anyone sells in Israel.** Correct framing: UTM = separation/authorization (theirs), SwarmOps = assignment/sequencing/battery feasibility (ours). Partner-or-acquirer as much as rival. |
| **Airwayz** (founded 2018, Tel Aviv) | **Dynamic UTM** — cloud AI that lets "drones from a variety of companies and models interact with one another in shared airspace without human intervention." Combines USS + UTM decision-making. **Selected by Israel** for multi-fleet airspace. Ran **~20 drones from 5 companies simultaneously** (Hadera, 2021) and **50+ drones from 8 teams** in phase two. **70+ vendors in one airspace at the Port of Rotterdam.** Won a **$7M IEC contract** with Propeller Drones for BVLOS. | **The most under-rated competitor we had not named.** Multi-operator, multi-vendor, AI-orchestrated, Israeli, already holds the national-programme relationship *and* a critical-infrastructure contract. If anyone in an investor room knows this space, they know Airwayz. **Read their product boundary before the next meeting — same priority as High Lander.** |

### 3.3 Tier B — defense multi-drone C2 / swarm

| Company | Product | Note |
|---|---|---|
| **XTEND** (IL) | **XOS** — human-guided autonomous OS; **one operator commands dozens of drones** across multiple UAS classes. **$20M exclusive multi-year Israeli MoD contract.** Integrated into **Lockheed Martin Skunk Works' MDCX** autonomy platform. Offices IL/US/SG/LV. | **The single most direct competitor for the Israeli defense buyer.** They are also our #3 adapter target and the supplier of the 5,000-unit FPV tender. **We would be selling coordination software to a customer who already bought coordination software from their drone vendor.** This needs an answer before any defense conversation. |
| **Elbit Systems** (IL) | **Dominion-X** (formerly **Legion-X**) — autonomous networked combat, **heterogeneous swarms** across air/ground/sea. Tablet interface: pick an area, assign a mix of platform types, they navigate autonomously. Demonstrated in IDF exercises with 10+ heterogeneous drones. | Prime-contractor scale, multi-domain, strike-inclusive. **Not our scope** (§0 excludes loitering munitions) but it is what a defense buyer compares us to. Answer: they coordinate a mission kill chain; we coordinate a persistent quadcopter fleet's task assignment and endurance. |
| **Auterion** (CH/US) | **Nemyx** swarm engine (Sept 2025) — "first system coordinating drones from **multiple manufacturers** into a single AI-guided force," any aircraft running AuterionOS. Dec 2025: first multi-manufacturer swarm to complete a full kill chain. Jan 2026: one operator, three FPVs, three simultaneous targets. Pentagon Gauntlet production award; Blue UAS. **$130M raised + $50M Pentagon contract.** | **The most dangerous competitor to our positioning specifically**, because *multi-manufacturer coordination is their headline claim, not ours*. Distinction to hold: Nemyx requires **AuterionOS on the aircraft** — that is vendor-neutral at the *manufacturer* layer but vendor-locked at the *OS* layer. We integrate to unmodified COTS aircraft via vendor SDKs. Say that precisely or it sounds like a quibble. |
| **Anduril** (US) | **Lattice** — full-spectrum autonomous operations platform, not only swarm coordination. $642M+ contracts. | Category-defining, out of our weight class, cited constantly. |
| **Shield AI** (US) | **Hivemind** — autonomy stack, GPS/comms-denied. **$5.3B valuation.** | Autonomy per-aircraft, not fleet assignment. Adjacent, not overlapping. |

### 3.4 Tier C — enterprise fleet operations (the civil competitive set)

| Company | Product | Overlap with us |
|---|---|---|
| **FlytBase** (IN/US) | Enterprise "Physical AI" platform. **Explicitly multi-vendor: "most platforms force standardization on one vendor; FlytBase supports mixed fleets on one platform."** Feb 2026: **FlytBase One** + Verkos AI agents — **Unified Fleet Management** across docked drones, manually piloted drones, counter-UAS, marine sensors, CCTV, ground robots. | **High.** Closest civil analogue to our vendor-neutral claim, and further along. Their anchor is drone-in-a-box site autonomy; ours is battery-feasible task assignment across a mobile fleet. Thin distinction — sharpen it. |
| **SkyfireAI** (US, Huntsville) | **$11M seed, Apr 2026.** "AI-native autonomy and orchestration platform for **coordinated multi-drone operations**." Single operator oversees several drones; plans, deploys, orchestrates, re-tasks in real time. Public safety + defense dual-use. | **Highest structural overlap of anyone on this list, and the most recent.** Same slice, same dual-use framing, seed-funded twelve months ahead of us. **Read their site before writing the next deck.** |
| **Percepto** (IL) | Drone-in-a-box autonomous inspection. **CAAI BVLOS approval at three Israeli industrial sites incl. Mekorot Eshkol.** $67M Series C. | Competitor-shaped, not customer-shaped. Closed single-vendor system — supplies its own aircraft, dock and autonomy. Our opening only exists where a site runs **several** such systems or mixes them with hand-flown aircraft. |
| **Airobotics**, **vHive**, **Tando** (IL) | Site/asset autonomy, indoor fleets | Same shape as Percepto. Hardware-anchored. |
| **DroneHarmony**, **SPH Engineering (UgCS)** | Multi-drone coordination for survey/mapping; UgCS controls fleets of mixed-type, mixed-manufacturer aircraft | Real multi-vendor fleet control, mapping-oriented. Mature, unglamorous, cheap. |
| **DroneDeploy**, **Dronedesk**, **Airdata** | Media/mapping processing; compliance and records; mission assignment as workflow | Categories 1–2 of `SwarmOps_Market_Sizing.md` §2.2. Crowded, mature, **not** coordination — but they are what a buyer already pays for, so they set the price anchor ($329–599/seat/yr). |

**Scale of the field:** Tracxn counts **59 companies** in drone fleet management globally
[SOURCED]. That is the honest denominator for "how crowded is this."

### 3.5 Tier D — manufacturer-locked (the reason we exist)

**DJI FlightHub 2**, **Skydio**, **Autel**, **Auterion** (at the OS layer). Each coordinates its
own aircraft well and a competitor's not at all. This remains true and remains the load-bearing
argument — **Israel Police's 16 models from 3 manufacturers cannot be run from any one of them.**
Watch for encroachment: `SwarmOps_Market_Sizing.md` §6.6 already flags manufacturer cross-vendor
coordination as the top category risk. Auterion's Nemyx **is that risk partially materialising.**

### 3.6 Where SwarmOps actually sits — say it this way

> Four layers, and they are bought separately:
> **(1) Aircraft autonomy** — fly the aircraft. DJI, Skydio, Shield AI, Auterion.
> **(2) Airspace separation** — may it be there, will it hit anything. High Lander, Airwayz. *Licensed. Regulator-facing.*
> **(3) Mission coordination** — which aircraft takes which task, in what order, **can it finish on the battery it has.** ← **us**
> **(4) Data & compliance** — what did it see, is the paperwork right. DroneDeploy, Dronedesk.
>
> Layer 3 has no incumbent that is simultaneously **vendor-neutral at the aircraft**,
> **battery-feasibility-first**, and **not tied to its own hardware**. That intersection is the
> claim — not "nobody does coordination," which is now demonstrably false.

**Three questions we must be able to answer, unprompted:**

1. *"How is this different from Airwayz?"* — They allocate airspace between operators. We allocate
   tasks between aircraft. Complementary; they are a plausible channel.
2. *"How is this different from Auterion Nemyx?"* — Nemyx needs AuterionOS flashed onto the
   aircraft. We integrate unmodified COTS DJI/Autel via vendor SDKs. Different integration
   contract, different customer (they sell to a force that builds its drones; we sell to one that
   buys them off a shelf).
3. *"XTEND already sells the IDF a multi-drone OS. Why you?"* — **This is the hardest one and we do
   not have a clean answer yet.** Current best: XOS is human-guided teleoperation of drones XTEND
   largely supplies; we do unattended assignment and battery-feasible routing across a fleet
   nobody vendor owns. **Verify this before relying on it** — it is an inference from public
   material, not a read of the product.

---

## 4. Fun facts and mind-blowing facts

All [SOURCED] unless tagged. Ordered by how much they land in a room.

### 4.1 Israel invented this entire field

- **The modern battlefield drone is an Israeli invention, and it has a birthday: June 1982, the
  Bekaa Valley.** IAI Scout and Mastiff UAVs baited Syrian SAM radars into revealing themselves.
  **All 28 Syrian SAM sites in the Bekaa were destroyed.** The US military took notice after
  Lebanon 1983 and the entire American UAV programme traces to it.
- **Israel was the world's largest drone exporter — 41% of all global drone exports, 2001–2011**;
  **$4.6B** of systems exported 2005–2012 (Frost & Sullivan). ⚠️ **Caveat:** that study is from
  2013 and the US has vastly expanded exports since. Say "was, and it is a 2013 study."

### 4.2 Israel is a regulatory world-first — and it happens to be our tailwind

- **Israel is the first country anywhere to make a UTM connection a *precondition of flight*.**
  The CAAI ruled drones may fly only while **continuously broadcasting operational data** to an
  approved UTM system. Nowhere else has done this. **Every civil operator in Israel is already
  required to be telemetry-connected** — the integration barrier we assumed we'd have to overcome
  was removed by regulation.
- **In 2018 the CAAI had two enforcement inspectors for the entire country's airspace.** Against a
  ~20,000-drone fleet. That gap is exactly why the mandatory-broadcast rule exists.
- **Feb 2026: 350 drone flights in two days**, multiple operators flying simultaneously, medical
  deliveries + logistics + emergency ops, coordinated by AI traffic management, across multiple
  Israeli locations (Xinhua). The national programme has run since 2019 as **INDI**, targeting
  ~300 flights/day over open areas.
- **2021, Hadera: 20 drones from 5 different companies in one urban airspace, autonomously
  deconflicted** — reported as a world first. Phase two ran **50+ drones from 8 teams**.
- **Israel tested a passenger drone taxi over Jerusalem.**

### 4.3 The war facts

- **The IDF wants to build 100,000 drones a year** (Haaretz, 14 Aug 2026) — and chose to build a
  **state-owned factory** rather than order from private manufacturers, which is itself a telling
  procurement decision.
- **The IDF conducted the first officially acknowledged operational drone swarm in combat** —
  flocks of quadcopters over southern Gaza, each monitoring its own patch of ground, cueing armed
  aircraft or ground units on detection. Used dozens of times by an until-then-classified
  Paratroopers company, from concepts developed by the IDF's experimental **Ghost Unit**.
- **The 55th Paratroopers Brigade bought over one hundred commercial drones by itself**, outside
  the central procurement pipeline. **This is the single best one-line proof that nobody has a
  unified picture of the fleet.** Use it — it's better than any market statistic in our documents.
- **The "Sky Rider" drone unit is credited with eliminating 700+ Hamas and Hezbollah operatives**
  since Oct 2023 — a unit flying small drones, not aircraft.
- **On 18 October 2023, Israel switched its entire civilian drone economy off overnight** — CAAI
  and the Transport Ministry banned private flights and civilian drones outright, to stop friendly
  aircraft being misidentified as threats. **The deconfliction problem, solved by prohibition.**
- **As of 2026 Israel is weighing a sweeping national FPV ban**, with officials quoted:
  *"We do not have a solution."*
- **A Hezbollah drone flew ~70 km from the Lebanese border to Netanyahu's residence in Caesarea and
  struck it without triggering a single siren** (Oct 2024). The defensive mirror image of why
  airspace pictures matter.
- **The IDF retrofits off-the-shelf DJI consumer drones for operational use in Gaza** (Al Jazeera,
  DroneXL, May 2025) — the clearest possible evidence that the COTS quad tier *is* the operational
  tier.

### 4.4 The China fact — awkward, and worth knowing before someone else raises it

- **Israel's public-safety drone fleets run largely on Chinese technology**, at the exact moment of
  peak global scrutiny of that (Calcalist's own framing, Apr 2026). Israel Police: **11 of 16
  models are DJI.**
- **DJI has never geofenced Israel or restricted its drones there** — in sharp contrast to 2022,
  when it suspended all sales to *both* Russia and Ukraine and shipped software limiting where and
  how high its drones could fly. **A single vendor's policy decision could ground a majority of
  Israel's civil and public-safety fleet.** That is not a hypothetical; it has a precedent.
- **Read as a business argument, not a political one:** a vendor-neutral coordination layer is what
  makes a future migration off DJI survivable. The fleet changes underneath; the coordination
  layer and the operators' habits do not. **We are not a counter-China play and must not pitch as
  one** — but the substitution risk is a real argument for a layer above the aircraft.

### 4.5 Scale facts for context

- **600,000+ agricultural drones** are in use worldwide, with **600,000+ trained operators** (DJI,
  end-2025). **DJI alone has 300,000+ spray drones in China.**
- **855,860 drones are registered with the FAA**; the real US fleet is estimated near **3 million**,
  because sub-250 g aircraft need no registration.
- **DJI accounted for 83.48% of all drone detections worldwide in 2025.** Not market share — every
  detection event, everywhere, of any drone. Four out of five drones seen anywhere on earth.
- **Israel Police bought drone-forensics capability covering 80+ platforms** (via Cellebrite's
  acquisition of SCG) — that is how many distinct drone types a single national police force
  expects to have to crack open.

---

## 5. What this changes — action list

| # | Action | Owner | Priority |
|---|---|---|---|
| 1 | **Retire the claim "almost nobody sells the coordination layer neutrally."** It is false (§3.1). Replace with the four-layer framing in §3.6 across the deck, Business Overview EN/HE, and `SwarmOps_Market_Sizing.md` §8.10 | Business | **Critical — before next investor meeting** |
| 2 | **Read Airwayz and High Lander as products**, not press coverage. Both Israeli, both funded, both hold national-programme relationships | Business | **Critical** |
| 3 | **Answer the XTEND question** (§3.6 q3). We currently cannot | Business + Product | **Critical** |
| 4 | Read **SkyfireAI** and **FlytBase One** — closest structural overlap, both shipped in 2026 | Business | High |
| 5 | Add the §3.6 four-layer diagram to the Fabelino deck. It is the cleanest single visual this research produces | Deck | High |
| 6 | Update `SwarmOps_Market_Sizing.md` §6.6 (manufacturer-encroachment risk): the evidence is no longer "against it" — Auterion Nemyx is the risk materialising | Business | High |
| 7 | Ask **CAAI directly** for registered-drone count and fleet-size distribution. Still the cheapest high-value action available (§1.3) | Business | Medium |
| 8 | Interview **Guy and Valfish** with Tony's §1.3a questions. Two conversations, best evidence we can get (Landscape §7.6) | Tony | Medium |

---

## 6. What is safe to say outward-facing

✅ **Safe, sourced, quotable:** everything in §2.2 with its price · DJI **>70% global consumer and
commercial share** (name the measure) · **41% of global drone exports 2001–2011, per a 2013 study**
· **CAAI mandatory UTM broadcast as a precondition of flight — a world first** · **IDF 100,000
drones/year ambition** (Haaretz, Aug 2026) · **17,000+ FPV airframes ordered at ~₪3,500 each** ·
**55th Paratroopers Brigade bought 100+ drones independently** · **Israel Police: 16 models, 3
manufacturers, ₪10.05M in 2025** · **20 drones / 5 companies / one airspace, Hadera 2021** · **350
flights in two days, Feb 2026** · **civilian drone flights banned outright 18 Oct 2023** ·
**Bekaa Valley 1982, all 28 SAM sites** · every competitor fact in §3.

⚠️ **Only with the caveat attached:** the ~20,000 CAAI drone estimate (**2017, stale**) · our
25k–60k civilian band (**[MODELLED], say the method**) · "tens of thousands of IDF systems"
(**attributed to drone-school instructors via a secondary source, not an inventory**) · the 41%
export share (**2013 study**) · DJI's 83.48% (**detections, not market share**).

❌ **Never:** any IDF airframe inventory figure stated as fact · "Israel Police operates 16 drones"
(models) · "nobody else does drone fleet coordination" (§3) · SwarmOps as "Israel's national drone
traffic layer" (licensed to High Lander) · agriculture as a sized segment · anything implying we
coordinate loitering munitions or strike aircraft.

---

## Sources

**Counts & procurement**
- [Haaretz — IDF plans to build 100,000 drones a year (14 Aug 2026)](https://www.haaretz.com/israel-news/israel-security/2026-08-14/ty-article/.premium/as-battlefield-shifts-to-low-altitudes-idf-plans-to-build-100-000-drones-a-year/0000019f-fcf0-df09-abff-fff684040000)
- [Defense Express — Israel MoD builds own FPV factory rather than ordering from private manufacturers](https://en.defence-ua.com/industries/israels_defense_ministry_makes_very_telling_decision_to_build_own_factory_rather_than_order_fpv_drones_from_private_manufacturers-18488.html)
- [Jerusalem Post — IDF to buy thousands of FPV drones](https://www.jpost.com/defense-and-tech/article-893200)
- [Israel Defense — XTEND to supply thousands of FPV drones to the IDF](https://www.israeldefense.co.il/en/node/66080)
- [Modern War Institute — A Case Study on Integrating Tactical Drones: Israel](https://mwi.westpoint.edu/a-case-study-on-integrating-tactical-drones-israel/)
- [Calcalist/Ctech — Israel police's drone fleet runs largely on Chinese technology (Apr 2026)](https://www.calcalistech.com/ctechnews/article/c4pnp0b8i)
- [Ynet (HE) — הפקרות בשמיים (Dec 2018): CAAI ~20,000 drones by 2017; 1→120 aerial operators; 2 inspectors](https://www.ynet.co.il/articles/0,7340,L-5433443,00.html)
- [FAA — By the Numbers (drone registrations)](https://www.faa.gov/node/26)
- [Pilot Institute — Drone statistics 2026](https://pilotinstitute.com/drone-statistics/)
- [Valour Consultancy — global commercial UAS fleet to surpass 5.6M by 2050](https://valourconsultancy.com/press-release-global-commercial-drone-fleet-to-surpass-5-6-million-by-2050-says-valour-consultancy/)
- [PRNewswire — DJI: 600,000+ agricultural drones in use globally by end-2025](https://www.prnewswire.com/news-releases/dji-agriculture-reveals-global-adoption-of-agricultural-drones-cuts-51mt-in-carbon-emissions-and-saves-410mts-of-water-for-farmers-globally-302757309.html)
- [Tracxn — 117 drone startups in Israel](https://tracxn.com/d/explore/drones-startups-in-israel/__tSl4Ba8npVAfZK4DH3M3UvAr3_0NmHvrIwtVlhzvfpM)

**Platforms & market share**
- [Global Drone HQ — Best drones for public safety & first responders 2026 (Mavic 3T, M30T, M400 pricing)](https://globaldronehq.com/blogs/news/best-drones-for-public-safety-and-first-responders-in-2026)
- [Global Drone HQ — DJI enterprise drone buyer's guide 2026](https://globaldronehq.com/blogs/news/dji-enterprise-drone-buyers-guide-2026-every-platform-compared)
- [China Made & Tech — how DJI built a 70% share](https://chinamade.tech/blog/dji-monopoly-story)
- [Axis Intelligence — drone statistics 2026 (detection share)](https://axis-intelligence.com/drone-statistics/)
- [The Drone Girl — best camera drones of 2026](https://www.thedronegirl.com/2026/03/31/best-camera-drones/)

**Competitors**
- [Unmanned Airspace — High Lander granted CAAI licence for U-space services throughout Israel](https://www.unmannedairspace.info/latest-news-and-information/high-lander-aviation-granted-caai-license-to-provide-u-space-services-throughout-israel/)
- [DroneLife — High Lander launches Vega HighSite for local airspace management (Jul 2025)](https://dronelife.com/2025/07/18/high-lander-launches-vega-highsite-for-local-airspace-management/)
- [Unmanned Airspace — EDGE invests in High Lander](https://www.unmannedairspace.info/urban-air-mobility/edge-invests-in-utm-company-high-lander-to-grow-military-and-civil-autonomous-operations/)
- [Unmanned Airspace — Israel selects Airwayz UTM to support multiple drone fleets in the same airspace](https://www.unmannedairspace.info/uncategorized/israel-selects-airwayz-utm-solution-to-support-multiple-drone-fleets-in-the-same-airspace/)
- [Times of Israel — Mimicking an air traffic controller, AI orchestrates multiple drones in flight (Airwayz, 20 drones / 5 companies)](https://www.timesofisrael.com/mimicking-an-air-traffic-controller-ai-orchestrates-multiple-drones-in-flight/)
- [Inside Unmanned Systems — Port of Rotterdam taps Airwayz (70+ vendors, one airspace)](https://insideunmannedsystems.com/inside-ai-largest-port-in-europe-taps-israels-airwayz-to-demonstrate-utm-system-in-rotterdam/)
- [DroneLife — Propeller Drones and Airwayz on $7M IEC BVLOS contract](https://dronelife.com/2024/11/20/propeller-drones-and-airwayz-collaborate-on-7-million-iec-contract-for-bvlos-autonomous-flights/)
- [DroneLife — XTEND wins Israeli defense contract for human-guided multi-drone operating system](https://dronelife.com/2023/01/19/xtend-wins-israeli-defense-contract-for-human-guided-multi-drone-operating-system/)
- [Israel Defense — XTEND and Lockheed Martin advance multi-UAS autonomy with XOS integration](https://www.israeldefense.co.il/en/node/67245)
- [Elbit Systems — Dominion-X autonomous mission management (ex-Legion-X)](https://www.elbitsystems.com/networked-warfare/robotic-and-autonomous-solutions/autonomous-missions-management-system/dominion-x)
- [Forbes — Israel rolls out Legion-X drone swarm for the urban battlefield](https://www.forbes.com/sites/davidhambling/2022/10/24/israel-rolls-out-legion-x-drone-swarm-for-the-urban-battlefield/)
- [Auterion — Launches Nemyx, enabling fully coordinated drone swarms](https://auterion.com/auterion-launches-nemyx-enabling-fully-coordinated-drone-swarms/)
- [Auterion — Global first in combat drone swarms: single operator, three simultaneous targets](https://auterion.com/auterion-global-first-drone-swarm-live-fire/)
- [FlytBase — platform (multi-vendor mixed fleets)](https://flytbase.com/platform)
- [DroneLife — FlytBase unveils FlytBase One management system (Feb 2026)](https://dronelife.com/2026/02/18/flytbase-unveils-flytbase-one-management-system/)
- [DroneLife — SkyfireAI raises $11M to advance autonomous multi-drone operations (Apr 2026)](https://dronelife.com/2026/04/28/skyfireai-autonomous-drone-operations-11m-funding/)
- [SiliconANGLE — SkyfireAI lands $11M for AI autonomy in public safety and defense drones](https://siliconangle.com/2026/04/28/skyfireai-lands-11m-bring-ai-autonomy-public-safety-defense-drones/)
- [Tracxn — top companies in drone fleet management (59 globally)](https://tracxn.com/d/trending-business-models/startups-in-drone-fleet-management/__Kth9vQI5419qgZpaD4c9dRkRUIBuU9TKrOZTHtz20c0/companies)
- [Percepto — CAAI BVLOS approval at three Israeli industrial sites incl. Mekorot Eshkol](https://percepto.co/regulatory-breakthrough-for-percepto-drones-to-fly-at-israeli-industrial-sites-without-operators-onsite/)

**Facts**
- [Wikipedia — IAI Scout (Bekaa Valley 1982)](https://en.wikipedia.org/wiki/IAI_Scout)
- [Times of Israel — Israel leads global drone exports](https://www.timesofisrael.com/israel-leads-global-drone-exports-as-demand-grows/)
- [Times of Israel — Israel world's largest exporter of drones (Frost & Sullivan, 2013)](https://www.timesofisrael.com/israel-is-worlds-largest-exporter-of-drones/)
- [Times of Israel — In apparent world first, IDF deployed drone swarms in Gaza fighting](https://www.timesofisrael.com/in-apparent-world-first-idf-deployed-drone-swarms-in-gaza-fighting/)
- [Ynet — Israel's elite drone unit: 700+ eliminated](https://www.ynetnews.com/article/b1hz7auojx)
- [JNS — Israel bans private flights and civilian drones due to war (18 Oct 2023)](https://www.jns.org/israel-bans-private-flights-and-civilian-drones-due-to-war/)
- [Ynet — 'We do not have a solution': Israel weighs sweeping drone ban over FPV attack fears](https://www.ynetnews.com/article/h15vy8femx)
- [Wikipedia — 2024 drone attack on Netanyahu's residence](https://en.wikipedia.org/wiki/2024_drone_attack_on_Benjamin_Netanyahu%27s_residence)
- [Al Jazeera — Israel retrofitting DJI commercial drones for Gaza operations (May 2025)](https://www.aljazeera.com/amp/news/2025/5/8/israel-retrofitting-dji-commercial-drones-to-bomb-and-surveil-gaza)
- [DroneDJ — DJI drops old drone geofencing rules](https://dronedj.com/2025/11/17/dji-drone-geo-geofencing-unlock/)
- [Xinhua — Israel completes large-scale drone trials, 350 flights (Feb 2026)](https://english.news.cn/20260225/50ac6e83cbf7451b959d172be06b722c/c.html)
- [Israel Innovation Authority — National Drone Initiative](https://innovationisrael.org.il/en/israels-national-drone-initiative-a-blueprint-for-global-collaboration-and-innovation/)
- [Times of Israel — Drone taxis take first test spin in Israel](https://www.timesofisrael.com/drone-taxis-take-first-test-spin-in-israel/)
- [HaMakom (HE) — Israel Police buys drone forensics covering 80+ platforms](https://www.ha-makom.co.il/police-cellebrite-drones/)
- [DroneLife — High Lander Vega UTM: mandatory drone flight management in Israel](https://dronelife.com/2023/12/03/high-landers-vega-utm-pioneering-mandatory-drone-flight-management-in-israel/)

*Retrieved 2026-08-19. Procurement figures and competitor product boundaries go stale fast in this
sector — re-check anything here before using it in a funding conversation more than ~6 months out.*
