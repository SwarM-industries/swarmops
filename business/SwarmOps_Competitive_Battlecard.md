# SwarmOps — Competitive Battlecard: Who Wins What, and Where We Get In

**Internal working document, opened 2026-08-19.** Companion to
`SwarmOps_Drone_Fact_Pack.md` §3, which named the competitors. **This document puts money,
customers and contracts against each name, states honestly where we lose, and identifies what is
actually unbuilt or unblocked** so the proposal targets a gap instead of a wall.

Source discipline unchanged: **[SOURCED]** / **[MODELLED]** / **[ASSUMPTION]** / **[PRIMARY]**.

> ### The one-paragraph version
>
> We are not early to this category and we are not funded to fight it head-on. XTEND does
> **>$100M revenue** with a **$20M Israeli MoD multi-drone-OS contract**; Skydio is worth **$4.4B**
> with **1,200+ public safety agencies**; Auterion books **~$100M from a single Ukraine
> deployment**. But **the two companies that hold the Israeli multi-fleet coordination position —
> Airwayz ($12M raised, 37 people) and High Lander ($19.2M raised, 51 people) — are small**, and
> **every large player is hardware-anchored or OS-anchored**, meaning their coordination only spans
> aircraft they control. **Three things are genuinely unclaimed: battery-feasibility as a
> first-class planning constraint, cross-organization task assignment, and the "your fleet is about
> to become mixed" migration layer.** Those three are the proposal.
>
> **And in the two accounts we can actually reach (§6): both have incumbents, neither occupies our
> layer.** Airwayz has run Israel Police drone operations under its UTM; Elbit's Dominion-X is at
> TRL9 inside IDF operations and Rafael's Fire Weaver is fielded in armoured brigades — but every
> one of those is airspace separation or sensor-to-shooter effects. **Nothing in either account
> decides which of the aircraft they already own takes which task, or whether it has the battery to
> finish.** That is the meeting.

---

## 1. The money table — what we are actually up against

| Company | Raised | Revenue | Customers / contracts | Headcount |
|---|---|---|---|---|
| **Skydio** (US) | **$966M** total; $110M Series F Apr 2026 at **$4.4B** valuation | **>$100M/yr**, "hypergrowth", strong unit economics | **1,200+ public safety agencies** (2× YoY), **3,800+ enterprise**, 45 of 51 state DOTs. **US Army: 2,500× X10D for $52M+** (largest single-vendor tactical sUAS order in Army history, Mar 2026). $9M+ USAFCENT order. Entire lineup on **Blue UAS Cleared List** (Jul 2026); only Blue-cleared DFR system | large |
| **XTEND** (IL) | **$100M** ($70M Series B + $30M extension) | **+113% YoY**, expects **>$100M this year**; **~$50M order backlog** | **50+ organizations**; **$20M exclusive Israeli MoD contract** for the multi-drone OS; **$8.8M** DoD IWTSD contract; further Army/USMC/Navy contracts; **Lockheed Skunk Works** MDCX integration | — |
| **Auterion** (CH/US) | **$130M** (Sept 2025) | **~$100M** from the Ukraine deployment alone | **33,000 Skynode strike kits** to Ukraine ($50M Pentagon contract); **50,000 Shrike drones** w/ SkyFall (~€90M, shipping Jul 2026); German JV contract for thousands of strike systems; Pentagon Gauntlet production award; Blue UAS exemption | — |
| **Percepto** (IL) | **$128–134M** over 5 rounds | **$26M** (2024) | Siemens Energy, Delek US, Koch Fertilizer, ICL Dead Sea Works. **CAAI BVLOS at 3 Israeli industrial sites incl. Mekorot Eshkol** + FAA waiver | 173 (2024) |
| **High Lander** (IL) | **$19.2M** — incl. strategic investment from **EDGE (Abu Dhabi)**, Paras Defense, Israel Innovation Authority | not disclosed | **CAAI U-space licence for all of Israel** (world's first mandatory-UTM licence). Deployments: **Israel, Canada** (Transport Canada / NAV CANADA RTM programme), **Brazil** (BIRDS/DECEA), **Kenya** (Konza national drone corridor). Products: Vega UTM, **Vega HighSite**, Vega CIS, **ORION fleet management** | **51** |
| **Airwayz** (IL) | **$12M** (seed led by Besadno, Jun 2022; IDA, Iron Nation, BuiltUp, Dhuna) | not disclosed | Selected by **Israel** for national multi-fleet airspace; **Port of Rotterdam** (70+ vendors, one airspace); **$7M IEC contract** w/ Propeller Drones for BVLOS | **37** |
| **FlytBase** (IN/US) | ~$1.6M disclosed | **~$10.8M ARR** (2025), **$32.3M** valuation | Enterprise/industrial; multi-vendor mixed fleets; **FlytBase One + Verkos AI agents** (Feb 2026) | ~98 |
| **SkyfireAI** (US) | **$11M seed** (Apr 2026, Mucker Capital / AI Fund) | pre-revenue-ish | Public safety + defense, dual-use, AI-native multi-drone orchestration | small |
| **Flock Safety / Aerodome** (US) | (Flock is a multi-$B ALPR company) | — | Acquired Aerodome Oct 2024. **Flock Alpha DFR: 86s average response, 78% of calls answered by drone first.** Moving from middleware to full-stack | large |
| **BRINC** (US) | — | — | Responder drone + Responder Station nest, **<70s to a 911 call**; **national DFR program with the National League of Cities** (Mar 2026); Motorola Solutions partnership | — |
| **eyesAtop** (IL) | **~$15M** (incl. Kevin Weil, ex-OpenAI CPO; Ben Ling) | — | **The closest competitor we have found, in any market.** Universal controller + plug-and-play platform, **one operator controls multiple drones from different manufacturers**, **20+ drone platform types** (surveillance, logistics, strike, ISR). **Widely deployed by IDF infantry brigades since Oct 2023; 500,000+ operational flight hours.** Won the MoD **"Digital Bat"** tender with Kela, **14 Jul 2026** | small |
| **Kela** (IL) | **$200M** | — | Founded post-Oct-7 by Hamutal Meridor & Alon Dror. Platform architecture: ingests **military and commercial** sources, real-time, unified command interface. **Digital Bat** co-winner — modular so new drone platforms integrate **without replacing core systems** | — |
| **ASIO** (IL) | **$15M** | — | GeoFusion; coordination and comms for **joint multi-force operations**; in IDF hands ~a decade | — |
| **Elbit Systems** (IL) | public co. | — | **Dominion-X** (ex-Legion-X) heterogeneous multi-domain swarm C2; **TRL9, deployed in IDF operations** | prime |

[All SOURCED — see §7. Figures are press/database-sourced and go stale; Percepto's revenue is 2024,
Airwayz's raise is 2022.]

### 1.1 What the table actually says

- **The big money is in hardware and strike, not coordination.** Skydio, XTEND and Auterion all
  monetize aircraft or kits; coordination software is the thing that makes their hardware sellable.
  **None of them makes money selling coordination on someone else's fleet.** That is our category
  and it is worth ~$10M ARR to its best pure-play (FlytBase), on a $32M valuation.
- **That cuts both ways, and the bad half must be said out loud.** A $10.8M-ARR leader after ten
  years is *evidence* for the risk `SwarmOps_Market_Sizing.md` §2.2 already names: operators may not
  perceive the problem as software-shaped. **The category being uncrowded is not automatically good
  news.** It is the single most important thing the Phase 2 pilot has to disprove.
- **The Israeli coordination incumbents are small and beatable on product.** Airwayz: 37 people,
  $12M, last disclosed round 2022. High Lander: 51 people, $19.2M. **These are not Skydio.** They
  hold *position* (licence, national programme) rather than scale. Position is harder to take than
  scale — but it is also partnerable.
- **High Lander sells ORION, a drone fleet management product, alongside Vega.** This was not in
  our earlier research and it matters: they are **already extending from airspace into fleet ops.**
  Read ORION specifically — it is the product most likely to be sitting on our roadmap.

---

## 2. Where we lose — stated plainly, before anyone else says it

Ranked by how badly.

1. **Capital and time.** Four people, pre-seed, against $100M–$966M war chests. We cannot outspend,
   out-hire, or out-wait anyone in §1. **Any plan that requires us to win a two-year enterprise
   bake-off loses.**
2. **We do not make aircraft.** Skydio, XTEND, BRINC, Flock and Percepto sell the drone *and* the
   software. In a public-safety or defense buy, coordination software arrives free in the box.
   **Our product must be worth paying for on top of software the buyer already got for nothing.**
3. **No certifications, no clearances, no past performance.** Blue UAS, NDAA compliance, FedRAMP,
   Israeli MoD supplier status, ISO — we have none. Every large contract in §1 sits behind at least
   one of these.
4. **No airspace licence.** High Lander holds the CAAI U-space licence for all of Israel. We will
   never hold that and should stop implying the national-layer role
   (`SwarmOps_Market_Sizing.md` §5.8 still needs the revision flagged in the Landscape doc §5).
5. **Autonomy is not our edge and we should stop implying it is.** Shield AI ($5.3B), Skydio and
   Auterion do per-aircraft autonomy far beyond anything we will build. **We assign and sequence
   tasks; we do not fly aircraft.** Saying otherwise invites a comparison we lose.
6. **XTEND already sold the IDF a multi-drone OS.** $20M, exclusive, multi-year. In an IDF
   conversation we are the *second* multi-drone control system in the room. This is the single
   hardest objection we face and §4.3 is the only answer we currently have.
7. **Defense sales cycle 12–24 months** against a pre-seed runway — already documented in
   `SwarmOps_Market_Sizing.md` §4, unchanged, and it interacts badly with #1.
8. **DJI forbids military use of its products, and that lands directly on our defense plan.**
   [SOURCED — DJI's own statements] DJI **does not provide after-sales service** for products
   identified as used for military purposes; it **opposes weapon attachment**, **refuses to
   customize or enable modifications for military use**, and **requires distributors and partners
   not to sell to customers who plan military use**, terminating those who do not comply.
   **Consequence:** a defense product whose core dependency is the DJI SDK sits on a vendor
   relationship that the vendor's own policy prohibits. The IDF *retrofits* DJI aircraft — it does
   not get DJI's support for doing so. **This is the structural reason the "low-tech DJI/Autel
   defense field" looks uncontested: it is not an undiscovered gap, it is a space the vendor
   forbids, so every serious defense player builds on aircraft it controls instead.** Mitigations
   in §5 item 8; it does not affect civil/public-safety use, which is DJI-supported and where this
   objection disappears entirely.

---

## 3. Where we win — the four claims that survive scrutiny

### 3.1 Everyone's coordination stops at the edge of their own fleet

| Competitor | Coordination spans | The lock |
|---|---|---|
| Skydio | Skydio aircraft | own hardware |
| XTEND XOS | mostly XTEND aircraft + integrated classes | own hardware + defense integration |
| Auterion Nemyx | any manufacturer — **that flashes AuterionOS** | own OS on the airframe |
| Flock / BRINC | own DFR aircraft | own hardware, full-stack |
| Percepto | own drone-in-a-box | own hardware, single site |
| High Lander / Airwayz | any aircraft — but **airspace separation**, not task assignment | licensed scope |
| **FlytBase** | **genuinely multi-vendor** | none — **our real peer** |
| **SwarmOps** | **any aircraft with a vendor SDK, unmodified** | none |

**The sentence:** *"Auterion coordinates any drone that runs their operating system. We coordinate
the drone the customer already bought, unmodified."* That is a real, technical, checkable
distinction — and it is the whole reason Israel Police's 16 models from 3 manufacturers cannot be
run from any single vendor's console.

**Honest caveat:** FlytBase makes the same claim and ships it today. Against FlytBase our
differentiation is §3.2, not vendor-neutrality.

### 3.2 Battery feasibility is genuinely unbuilt as a commercial product

This is the strongest finding in this document.

- Academic literature is rich: battery-constrained routing, charging-station placement, joint
  routing–recharging, energy-aware path planning — a decade of papers [SOURCED — arXiv, ScienceDirect,
  AIAA, Wiley].
- The commercial products are **not there**. Fleet-management platforms track **battery health,
  charge cycles, storage temperature and assignment records** — *maintenance and compliance*, not
  planning. And the research literature itself states the gap explicitly: *"current route
  optimization programs lack the ability to model the operational challenges of drone delivery,
  such as battery capacity, drone reuse, no-fly zones and multiple charging depots"* [SOURCED].
- **That sentence is a description of `SwarmOps_PRD.md` §4.2.** Battery range as the binding
  constraint, varying with distance and payload; no-fly-zone avoidance; charging-station insertion
  on infeasible routes; drone reuse across missions. We are building the thing the literature says
  the products do not do.

**Why nobody built it:** the incumbents don't need to. If you own the aircraft you know its battery
curve and you solve feasibility per-aircraft in firmware. **The problem only becomes hard, and
only becomes software-shaped, when the fleet is mixed** — which is precisely the fleet none of them
coordinate. **Our disadvantage (no hardware) and our differentiator are the same fact.** Say it
that way; it turns the weakness into the thesis.

### 3.3 Cross-organization coordination is licensed to nobody

High Lander and Airwayz coordinate *airspace* between organizations — separation, authorization,
deconfliction. **Nobody assigns *tasks* between organizations.** The multi-agency incident scene
(police + fire + MDA over one event, three fleets, three consoles, one airspace) is a Filter-B case
with no product in it, and it is not inside anyone's licensed scope. This is the largest genuinely
empty space we found.

### 3.4 Geography: Israel is the one market where the DJI thesis is legal

**This is new and it changes sequencing.** [SOURCED]

- **NDAA FY25 §1709** required DJI **and Autel** to go onto the FCC Covered List absent a favourable
  national-security determination.
- **21 Dec 2025: the interagency determination came back affirmative; the FCC added DJI to the
  Covered List the next day.** New DJI equipment cannot get FCC authorization → effectively blocked
  from normal US import and sale. Existing aircraft stay legal to fly; US retail stock is depleting.
- Jan 2026: carve-outs for **Blue UAS Cleared List** drones and Buy-American (65% domestic).
  Software/security updates for existing DJI drones waived only **through at least 1 Jan 2027**.
- **Autel's exact FCC status is [uncertain] — §1709 names it, but we have only confirmed DJI's
  addition. Verify before stating it.**

**Two consequences, in tension. Both are true and the proposal has to hold both:**

| | US | Israel |
|---|---|---|
| DJI/Autel adapter value | **Decaying.** New DJI sales blocked; the installed base is a shrinking, unsupported asset after Jan 2027 | **Full.** No ban, no geofence — DJI never restricted Israel even while suspending Russia and Ukraine sales in 2022 |
| Fleet heterogeneity | **Rising then falling.** Agencies are mid-migration off DJI onto mixed Blue UAS vendors — maximum heterogeneity *right now* — but DFR is consolidating around Flock/Skydio/BRINC full-stack, which re-homogenizes it | **Rising.** Police already at 3 manufacturers / 16 models; IDF adds an in-house FPV line to a DJI+Autel base |
| Our position | **Time-boxed wedge** (§4.5) | **Structural home market** |

**The sentence for the room:** *"The US just made its fleets mixed by regulation and is spending two
years sorting it out. Israel's fleets are mixed by procurement and nobody is sorting it out at all —
and Israel is the only developed market where the majority-share aircraft is still legal to buy."*

---

## 4. How we take each one — per-competitor play

### 4.1 High Lander → **partner on Vega, compete with ORION**
They hold the licence; we cannot get it. **But ORION is not a fleet-management sidecar — it is a
drone-in-a-box DFR product that "can manage hundreds of drones simultaneously," launches on
event triggers (gunshot, burglary), runs AI/thermal search, and is being actively sold to US police
departments** — East Baton Rouge Sheriff's Office tested it ~5 times, with demo tours in San Diego,
Phoenix and Miami, backed by up to $1M from the US–Israel BIRD Foundation [SOURCED — The Intercept,
May 2024]. Play: **integrate as the mission layer above Vega; expect a fight over ORION.** A
licensed U-space provider with no optimizer is still the natural counterpart to an optimizer with no
licence — but ORION is closed-loop around High Lander's own docked aircraft, which is the same
single-vendor limit as Percepto. **Our opening against ORION is the fleet the customer already
owns.** Concrete ask: read Vega HighSite and ORION properly, then approach for a technical
integration conversation, not a sales one. **Risk if we wait: ORION grows into our product and the
partner window closes.**

### 4.2 Airwayz → **the one to actually beat, on product**
37 people, $12M, last public raise 2022, but they hold the national-programme and IEC relationships.
They are **airspace-first**: dynamic UTM, deconfliction, "drones from many companies interact
without human intervention." They do not claim battery-feasible task assignment. Play: **compete
where they are thin (assignment, endurance, payload feasibility), reference where they are strong
(they are the airspace layer under us).** Do not pitch against them on airspace.

### 4.3 XTEND → **the hardest, and the answer must be built not argued**
XOS is human-guided teleoperation — *one operator commanding dozens of drones,* with a human in the
loop per aircraft, on mostly XTEND hardware. **Our claim has to be unattended assignment across a
fleet nobody vendor owns.** Two things follow:
- **Verify the XOS product boundary before relying on this.** It is an inference from public
  material. Until verified, tag it [ASSUMPTION].
- **They are also our #3 adapter target.** The coherent story is *integration*, not displacement:
  XTEND aircraft become one manufacturer inside a heterogeneous fleet we coordinate. Selling
  "we coordinate your XTEND drones alongside your DJI ones" is a far better opening than
  "we replace XOS."

### 4.4 Auterion → **the OS-layer distinction, and stay out of strike**
Nemyx = multi-manufacturer *if* AuterionOS is on the airframe. We = unmodified COTS via vendor SDK.
Different integration contract, different customer: they sell to forces that **build** drones
(Ukraine, Germany, Pentagon); we sell to forces that **buy** them off a shelf. Also: Nemyx is a
kill-chain product. §0 of the Landscape doc keeps us out of that — **use the scope decision as
differentiation, not apology.**

### 4.5 Skydio / Flock / BRINC → **the migration wedge, and it has an expiry date**
1,200+ public safety agencies on Skydio and 1,000+ US agencies cleared for DFR, all mid-transition
off DJI. **For the next ~18 months, every one of those agencies is running a mixed fleet whether it
wants to or not** — legacy DJI they may not replace before support lapses (Jan 2027), plus new Blue
UAS aircraft from two or three vendors. Nobody's console spans that. **That is a real, dated,
addressable pain.** [MODELLED — the pain is inferred from the regulatory timeline plus the
2×-YoY agency growth; no agency has been interviewed. Validate with one before pitching it.]
**Caveat that must travel with it:** DFR consolidation around full-stack vendors is actively
closing this window. It is a wedge, not a market.

### 4.6 FlytBase → **the peer, and the honest fight**
Same vendor-neutral claim, $10.8M ARR, shipped. We do not beat them on breadth or maturity. We beat
them — if at all — on §3.2 (battery-feasible assignment as the core algorithm rather than a
dashboard field) and on §3.3 (across organizations, not within one site).

**Documentation checked 2026-08-19 — 122 pages — and §3.2 survives.** No page on optimization,
assignment, endurance planning or feasibility. **Mission Scheduler is manual** (*"Select the drone
from the Drone dropdown"*); **Mission Planning is manual** (*"a pre-defined flight path set by the
operator"*); **Fleet Management is a monitoring dashboard** whose battery bar is display-only —
nothing gates dispatch. Battery appears only as **failsafe thresholds** (low 20–50%, critical
10–15%) handing off to DJI's own RTH. **They show a battery bar; we plan against it.**

**And their docs hand us an argument:** *"FlytBase does not have any custom failsafes at this time
since **DJI does not allow access to its cloud APIs** for the same."* A funded competitor
documenting that DJI's API policy limits its product — corroborating §2.8 from a commercial source,
and making the case for the coordination-without-control design (§5 item 8) from outside our own
reasoning. Detail in `SwarmOps_Positioning_and_Pitch.md` §7.1.

### 4.7 eyesAtop + Kela → **the specialist tier is occupied; the line-unit tier is not**

> **Full profile: `SwarmOps_Competitor_eyesAtop.md`.** Company rebranded **Aitan**; the product
> soldiers know is the **"Ronen"** operating system.
>
> **Revised 2026-08-19 after [PRIMARY] negative observations — now four observers.** Tony flew
> drones in an infantry unit in late 2025 and **never encountered any unified multi-drone control
> system**. In August 2026 an **officer**, a **drone pilot**, and **one of the IDF's leading drone
> specialists** all reported the same: no coordination system in use, and **none recognised the
> name "Ronen."** The expert is the one that matters — "wrong unit" no longer explains it.
> **Caveat that travels with it:** an expert not knowing a name may mean the system is absent, or
> that **it is designated differently in service**. Close that before it goes in a deck —
> `SwarmOps_Competitor_eyesAtop.md` §5.0a. Ronen's strongest sourced deployment claim is
> **reconnaissance** units;
> Calcalist's "widely deployed by infantry brigades" is the one claim a first-hand account does
> not support. **Read: strong in the specialist tier, absent from the line-unit COTS-quad tier** —
> which is the fat part of the distribution and the market SwarmOps targets. Structural reason it
> may persist: Ronen's proposition is *one operator replaces three or four*, which shrinks a heavy
> crew. It does not coordinate a hundred soldiers flying one Mavic each. **Different problem, not
> just a different customer.** Limits on this claim in the profile §5.1 — it is one observer and
> never becomes "Ronen is not in the infantry."

**Added 2026-08-19 in answer to "how much real competition is there in defense for the low-tech
DJI/Autel field."** The honest answer is: **more than we thought, and it is Israeli, fielded, and
five weeks old as a national contract.**

- **eyesAtop makes our vendor-neutrality claim, and makes it about aircraft rather than an OS.**
  Founder, quoted: *"if an attack drone from vendor A is in operation at one point and the next
  month there is an attack drone that is better and cheaper from vendor B, you can just swap them,
  and the system will work."* **20+ drone platform types.** That is the sentence we were planning
  to say.
- **It is not a demo.** Widely deployed across IDF infantry and reconnaissance brigades since
  Oct 2023, **500,000+ operational flight hours**, north and south.
- **14 Jul 2026: eyesAtop + Kela won the MoD tender for the "Digital Bat" programme** — a
  **national platform for autonomous management and command of the IDF's attack drone fleet**,
  explicitly modular so new platforms integrate without replacing core systems. Kela raised
  **$200M**. XTEND won the earlier competition and is preparing a Nasdaq listing at ~$1.5B.

**Business model — checked 2026-08-19, because it decides whether they are our shape:**
**They do not make drones.** eyesAtop sells **software + ground control + edge AI compute** — a
universal remote controller with integrated handheld screens, an edge box, and the platform on top.
Founded 2015, self-described **"AI-native robotics orchestration,"** OEM-agnostic by design,
integrating **commercial and military-grade drones alike**. Delivered as modular **"mission-ready
capability packages"** (border surveillance, recon for manoeuvring forces, heavy-lift logistics,
coordinated strike) — solution sales, **not SaaS seats**. Explicitly: *"not competing on the drone
itself, but selling the brain that integrates whatever drones those nations already operate or plan
to buy."*

**This breaks the framing in §3.1.** That table says every serious player is hardware-anchored or
OS-anchored, so their coordination stops at their own fleet. **eyesAtop is the exception**: no
aircraft, no OS on the airframe, genuinely cross-vendor, and fielded. They are our shape — with
half a million combat flight hours and a national MoD contract. The §3.1 argument still holds
against Skydio, XTEND, Auterion, Flock and Percepto; **it does not hold against eyesAtop, and we
must not use it in any room where they might be known.**

Two real differences remain, both worth confirming rather than asserting:

- **Edge compute, no cloud dependency.** Their AI runs at the edge for disconnected tactical
  operation. **SwarmOps is a cloud/Kubernetes microservice system that assumes connectivity** —
  a genuine gap for defense, and one that favours them, not us. [Their architecture is SOURCED;
  the comparison is ours.]
- **Integration depth.** They replace the OEM controller. **How they achieve 20+ platform
  integrations — control-link level, SDK, or per-vendor deals — is not public. [ASSUMPTION: do not
  claim a mechanism we have not verified.]** It matters because if it is control-link level, it
  also explains how they work with DJI-class aircraft without a DJI SDK relationship (§2.8).

**What is still genuinely distinct — three things, and they are thinner than we would like:**

1. **Digital Bat is the *attack* fleet.** Our scope decision (§0 of the Landscape doc) is
   observation-and-carry quads. Their national mandate is loitering/strike. **But eyesAtop's
   *fielded* product already spans surveillance, logistics, strike and ISR**, so this is a
   boundary of the contract, not of the company.
2. **They consolidate operators; we remove them from the loop.** eyesAtop's value is *three or
   four soldiers become one* — a human still flies, just fewer humans, and the win is compressing
   the targeting cycle to minutes. Ours is unattended assignment: nobody flies, the planner decides
   who takes what and whether the battery closes the loop. **This is now the third time we have
   drawn this same line (XTEND §4.3, Auterion §4.4, here). A distinction we have to make three
   times is a positioning problem, not a moat.**
3. **Battery feasibility is still absent from every one of them** (§3.2). It remains our only
   claim that nobody else is making.

**What to do.** Do not walk into an IDF room pitching one-operator-many-drones; that is eyesAtop's
sentence and they have half a million flight hours behind it. **But their presence does not close
the field** — the MoD tested **20** counter-drone technologies in a single competitive process,
MAFAT ran 19 calls → 661 proposals in H1 2025, and the same buyer ran the multi-drone-OS category
twice with different winners (XTEND, then eyesAtop). **This is a structurally multi-vendor buyer.**
Full argument and its two caveats: `SwarmOps_Positioning_and_Pitch.md` §8.1.

**Sequencing set 2026-08-19: defense first, public safety as the fast reference customer.** Three
moves, in order: **(a) the tier they have not reached** — line units, one aircraft per operator, no
system today (§4.7 header); **(b) under them** — battery-feasible planning as a component inside a
Kela-style open architecture, explicitly built to integrate new capability without replacing core
systems, and **the one door in this sector documented as open**; **(c) public safety in parallel** —
police, fire, critical infrastructure, where eyesAtop is absent, DJI is legal and supported, and the
mixed-fleet problem is documented (§6.1).

### 4.8 Percepto / Airobotics / vHive → **not competitors, reference customers' neighbours**
Closed single-vendor systems. Our opening exists only where a site runs several of them or mixes
them with hand-flown aircraft. Find a **named** instance of that before sizing it (this is already
research brief item 3 in the Landscape doc).

---

## 5. What to build — unclaimed, unblocked, and reachable from what we already have

Ranked by (genuinely unclaimed) × (buildable on the current stack) × (sellable in a demo).

| # | Build | Why it is open | Cost from where we are | Sell |
|---|---|---|---|---|
| **1** | **Battery-feasible assignment with charging-station insertion** — the PRD §4.2 core, finished and demoed against a mixed fleet | §3.2 — literature says commercial tools don't model it; incumbents don't need to | **Already the plan.** planning-service + fleet-service charging stations exist | *"Watch it refuse an infeasible plan and re-sequence through a charger."* No competitor demo does this |
| **2** | **Mixed-fleet demo: one DJI + one Autel + one simulated FPV, one console** | Nobody vendor-neutral at the aircraft has an Israeli defense story | DJI+Autel adapters = the day-one milestone in `actual_prod.md`; budget already costed in `budget.md` | The single most persuasive 90 seconds we could show anyone |
| **3** | **What-if / pre-mission rehearsal** (`/planning/simulate`) | Nobody in §1 sells simulation as a product; already noted as a second SKU in Market Sizing §5.9 | Endpoint is specced; simulator exists | Training + rehearsal is a *separate budget line* in defense — often easier to buy than operations software |
| **4** | **Multi-organization task assignment** (multi-tenant planning across agencies) | §3.3 — licensed to nobody, built by nobody | Real work: tenancy, permissions, trust boundaries. PRD §1.3 excluded it; CLAUDE.md now says non-goals are historical | The multi-agency incident scene. High narrative value, low near-term budget |
| **5** | **Fleet-migration mode** — coordinate a fleet that is *changing manufacturer* mid-life; per-vendor capability profiles, graceful degradation as aircraft retire | §3.4 — created by regulation on 21 Dec 2025, addressed by no product | Falls out of the adapter architecture almost free | The US wedge (§4.5). Dated — build it while the window is open |
| **6** | **Degraded-comms / GPS-denied re-planning** | Market Sizing §5.6. Shield AI owns per-aircraft; nobody owns *fleet-level* replanning under degradation | Meaningful algorithmic work | The most defense-credible feature on this list. Sequence after 1–3 |
| **7** | **Endurance/health-informed assignment** — assign by *actual* battery state of health, not nameplate | Fleet platforms already log charge cycles and SoH; **nobody feeds it back into who gets the mission** | Small, given #1 | Cheap, concrete, and instantly legible to an operator |

| **8** | **Remote ID / DroneID → TAK ingestion path**, as an alternative to the vendor SDK: consume the **broadcast** identity+position stream instead of asking DJI for an API | Sidesteps loss #8 in §2 entirely — no vendor relationship, no ToS exposure, and it works on aircraft we have **no** integration with. Mature open ecosystem to build on: `djicot` (DJI→TAK gateway), `DroneCOT` (Remote ID/ODID→Cursor-on-Target), the ATAK **UAS Tool** plugin, DroneControl's native ATAK integration | Moderate. Different ingest adapter; the planner is unchanged | **Changes what we can honestly claim in a defense room**: coordination over aircraft nobody integrated. Caveat: broadcast gives position and identity, **not command** — planning yes, tasking no |

**Explicitly do not build:** aircraft autonomy, airspace separation/UTM, counter-UAS, strike
coordination, our own drone, **and — added 2026-08-19 — one-operator-many-drones teleoperation
consolidation**, which is eyesAtop's fielded product with 500,000+ flight hours behind it (§4.7). Every one is owned by someone with 100× our capital, and the last two
are outside the current-phase scope (§0 of the Landscape doc, amended 2026-08-19: current phase,
not a permanent boundary — other classes kept as future R&D reference).

---

## 6. Who is already inside the two accounts we can reach

**We have direct connections to IDF and Israel Police officials.** That makes this the most
commercially important section in the document: not "who exists" but **"who is already in the room
we can walk into."** Answer: both accounts have incumbents, neither incumbent occupies our layer,
and in both cases the regulation has already built the data pipe we would need.

### 6.1 Israel Police — the airspace layer is taken; the fleet layer is empty

| Already inside | What they do there | Status |
|---|---|---|
| **Airwayz** | Israel Police ran a **drone network under Airwayz's AI Dynamic UTM** — patrol drones along a route plus tethered drones over crowd concentrations, **multiple operators in one urban airspace**, run from **Ayalon Highways' Tel Aviv command centre**, with real-time image analytics flagging events for police attention. Tel Aviv Marathon, ~40,000 runners | [SOURCED] **but the reference is Feb 2022.** Whether it is a standing contract or an event deployment is **not public — ask the contact** |
| **High Lander** | Holds the CAAI U-space licence covering all Israeli civil airspace; **ORION** is being sold as a police DFR product (in the US so far) | [SOURCED] |
| **Cellebrite / SCG** | Drone **forensics** covering 80+ platforms | [SOURCED — HaMakom, Mar 2026] |
| **Counter-drone programmes** | Police preparing urban drone **interception** | [SOURCED — Calcalist HE] |
| **DJI, Autel, Aero Sol** | The aircraft: **11 + 2 + 3 models**, ₪10.05M in 2025 | [SOURCED — Calcalist, Apr 2026] |

**The gap, stated as a question we can ask the contact directly:** *when the Police flies its own
16 models from 3 manufacturers at a real incident — not a marathon with a pre-planned route — what
decides which aircraft goes to which call, and what tells the commander whether it has the battery
to get there and back?* Airwayz answers *where may it fly*. ORION answers *launch my box*. **Nobody
answers that question, and it is the only question our product answers.**

**Precedent that helps us:** the Marathon deployment proves the Police will run a **multi-operator,
multi-drone, single-airspace pilot at a scheduled public event** with a startup's software in the
loop. That is a template we can ask for by name — and events are the lowest-risk way in, because
the airspace is pre-coordinated and the failure mode is embarrassment rather than an operational
loss.

### 6.2 IDF — the C2 layer is taken by primes, but not at our altitude

| Already inside | What it is | Status |
|---|---|---|
| **Elbit Dominion-X** (ex-Legion-X) | Heterogeneous multi-domain swarm C2 — UAS + UGVs, intelligence collection, target location, weapon guidance. **Elbit states TRL9 and deployment in IDF operations** | [SOURCED — Defensemirror / Elbit] |
| **XTEND XOS** | $20M exclusive MoD contract; **systems used operationally in Gaza and Lebanon** | [SOURCED — Ynet, Robot Report] |
| **Rafael Fire Weaver** | Sensor-to-shooter network **procured by the IDF and integrated into armoured brigades**; software **assigns targets to the most appropriate effector**. Built jointly by Rafael, DDR&D and IDF Ground Forces | [SOURCED — Janes] |
| **Elbit Torch-X** | Digital C5ISR / battle-management family; the recent war was the **first time the IDF deployed a fully digital C2 system**, synchronising firepower units; "full support for manned and unmanned autonomous platforms" | [SOURCED — Elbit] |

**Read this carefully, because it is both the biggest threat and the clearest opening.**

- **Fire Weaver is task allocation, in service, today.** Software that assigns a target to the best
  effector is structurally the same shape as software that assigns a mission to the best drone.
  **Anyone technical in an IDF room will make that connection, so we must make it first.** The
  distinction: Fire Weaver optimizes an *engagement* — sensor to shooter, seconds, effects. We
  optimize a *fleet's workload over hours* — who flies what, in what order, and whether the battery
  lasts. Different objective function, different time constant, different aircraft class.
- **The primes' systems are all effects-oriented.** Dominion-X guides weapons. Fire Weaver picks
  effectors. Torch-X coordinates fires. None is about keeping N cheap quadcopters usefully tasked at
  company level.
- **That tier is contested but not closed — corrected twice, 2026-08-19.** **eyesAtop/Aitan
  ("Ronen") is fielded near that altitude**: reconnaissance units, 20+ platform types, 500,000+
  operational flight hours since Oct 2023, and as of 14 Jul 2026 it holds the MoD **Digital Bat**
  national platform contract with **Kela** ($200M raised). **ASIO** has ~a decade in IDF hands on
  joint multi-force coordination. *(First correction: an earlier draft said nobody occupied this
  space — wrong.)* **But a [PRIMARY] infantry account from late 2025 saw none of it**, and Ronen's
  own strongest claim is *reconnaissance* units. **Net: the specialist tier is taken; the
  line-infantry COTS-quad tier — the volume tier — still has nothing in it.** §4.7 and
  `SwarmOps_Competitor_eyesAtop.md` §5.
- **The deconfliction gap is still unclaimed in open sources.** We checked again. No published
  doctrine, tender, C2 system or after-action document describes how simultaneous tactical drone
  flights are coordinated between units. **The strongest honest claim remains: no open source
  describes one** — plus a founder's first-hand account. Do not upgrade that to "there is none."
- **The 55th Brigade fact belongs in this conversation.** A formation buying 100+ of its own
  drones outside the central pipeline is the argument for a coordination layer that does not assume
  central procurement — and it is an argument made *by the IDF's own behaviour*, not by us.

### 6.3 The regulatory pipe is already built — for both accounts

**CAAI Regulation 10916 (23 Nov 2023):** any drone ≥200 g is forbidden to fly in very-low-level
airspace unless connected to and continuously communicating with an authorized UTM network — **and
that UTM data must be shareable, on request, with the military, the police, the intelligence
services and other homeland-security bodies** [SOURCED].

Three consequences, and they are all in our favour:

1. **The telemetry integration barrier is gone by law.** Every civil aircraft in Israel is already
   streaming position data to an approved network.
2. **The Police and the IDF already have a legal right to that feed.** We do not need to build a
   data-sharing agreement; we need to build the thing that *uses* the feed to decide who flies what.
3. **It defines our layer for us, in the regulator's own language.** UTM is the licensed
   separation/authorization function. Assignment, sequencing and battery feasibility are outside it.
   **That is the cleanest possible answer to "isn't this High Lander's job?" — no, and the licence
   says so.**

### 6.4 What to actually ask for in those meetings

Not a sale. **A co-development pilot with a defined, bounded question.** Concretely:

- **To the Police contact:** *"You fly 16 models from 3 manufacturers. Who decides which one takes
  the call? Would you run a scheduled-event pilot — the Marathon pattern — where our layer does the
  assignment and Airwayz keeps the airspace?"* Position **with** Airwayz, not against. Ask what
  their standing arrangement with Airwayz actually is; we do not know.
- **To the IDF contact:** *"Not another C2 system — Dominion-X and Torch-X own that. The question
  is the company-level quad tier: when four units are flying Mavics over the same square kilometre,
  what stops them colliding and what decides who covers what?"* Then ask the two questions that are
  worth more than any pitch: **is there a system for that today, and if not, whose problem is it
  considered to be?** If the answer is "nobody's," that is the single most valuable sentence
  available to this company and it costs one conversation.
- **Ask both:** what would have to be true for a pilot — which unit, which budget line, which
  approval. **Route it through MAFAT (§7) rather than trying to sell direct.** Green Lane exists
  precisely so a four-person company can run an operational test with a unit without holding ISO
  certification or a supplier number.
- **Do not** ask either contact for a purchase commitment, and **do not** claim the IDF has no
  coordination system — you are talking to people who would know, and being wrong in that room is
  unrecoverable.

**Two cautions before these meetings.** First, an official's informal interest is not procurement
interest; capture what they say as evidence about the *problem*, not as pipeline. Second,
everything in this section is open-source. **Let them tell us what is classified; never speculate
about it in writing or in a deck.**

---

## 7. The channel finding — how this actually gets bought

**MAFAT (DDR&D) has a startup route and it is designed for exactly our situation.** [SOURCED]

- **Green Lane** and **Innofense/Innotal** — MAFAT's startup programmes with the IDF's Technology &
  Logistics Division.
- Terms: **startup retains IP**, a dedicated DDR&D project officer, **payment terms shortened to 30
  days**, and **exemptions from guarantees and ISO certification** — which directly cancels loss #3
  in §2.
- Volume: **19 calls for proposals in H1 2025 → 661 proposals → 220 into the accelerator.**
- Outcome: **Israeli defense-tech startups took NIS 1.08B in government orders during 2025**
  (MAFAT report, 21 Jan 2026).
- Critically, MAFAT **facilitates operational testing with IDF units** — which is the validation
  step that turns a capstone into a procurement.

**This is the most actionable item in this document.** It shortens the 12–24 month cycle that §2.7
says is our biggest structural problem, it does not require certifications we lack, and it lets us
keep IP. **Action: find the next open call and the eligibility terms.**

Second channel, unexploited: **DFR does not exist in Israel.** 1,000+ US agencies are cleared for
drone-as-first-responder; Israel's Fire & Rescue Authority spends ₪300K/yr on aircraft and its
emergency-response sector is being described in the press as mid-revolution. Low budget, high
narrative, and a category we could import rather than invent. [ASSUMPTION — no Israeli agency has
been asked.]

---

## 8. What to verify — before the meetings, then before the investors

**Ask the contacts (§6.4) — cheapest and highest value, nobody else can get these:**

1. **Is Airwayz a standing Israel Police contract or was it an event deployment?** Our only
   reference is Feb 2022. This decides whether §4.2 is "partner inside the account" or "beat them
   to it."
2. **Is there any system today for coordinating multiple tactical quads at company level?**
   If the answer is "no," it is the most valuable sentence this company owns. If "yes," we need to
   know whose it is before we pitch.
3. **What would a bounded pilot require** — which unit, which budget line, which approval path.

**Desk research — items 4–6 are blocking for the next investor meeting:**

4. **High Lander ORION** — now known to be a DFR drone-in-a-box managing "hundreds of drones."
   Remaining question: does it coordinate **third-party** aircraft or only High Lander's own?
   Determines whether §4.1 is "partner" or "displaced."
5. **XTEND XOS product boundary** — teleoperation or autonomous assignment? §4.3 rests on an
   inference.
6. **FlytBase's planning model** — does it do battery-feasible routing, or battery *logging*?
   If the former, §3.2 collapses and we reposition onto §3.3.
7. **Rafael Fire Weaver's actual scope** — how close is its allocation model to ours? §6.2 says
   "different objective function"; verify that before saying it to anyone who works on it.
8. **Autel's FCC Covered List status** — §1709 names it; only DJI's addition is confirmed.
9. **Airwayz's product boundary** — task assignment, or purely airspace?
10. **One US public-safety agency interview** to test the §4.5 migration pain before it goes in a deck.
11. **MAFAT open calls** — next date, eligibility, whether a college-incubated structure helps or hurts.
12. **Percepto/FlytBase current revenue** — our figures are 2024/2025.

---

## 9. The revised pitch, in five sentences

> Every drone company coordinates its own aircraft and nobody else's. Israel's police force flies
> 16 models from 3 manufacturers, its army buys DJI and Autel off the shelf while standing up its
> own FPV line, and America just made its entire installed base illegal to replenish — so mixed
> fleets are now the normal case everywhere. The layer that decides *which aircraft takes which
> task, in what order, and whether it can finish on the battery it has* is missing from every
> product on the market, and the research literature says so explicitly. We build that layer,
> vendor-neutrally, against unmodified aircraft — and we are Israeli, which is the one developed
> market where the majority-share aircraft is still legal to buy and where the regulator has
> already forced every operator to be telemetry-connected. We are not competing for the airspace
> licence or the airframe; we sit above both, and both are our route to market.

---

## Sources

**Financials & contracts**
- [DroneLife — Skydio raises $110M Series F at $4.4B](https://dronelife.com/2026/04/28/skydio-series-f-110m-funding-us-manufacturing/) · [Skydio — Series F announcement](https://www.skydio.com/blog/skydio-series-f) · [Skydio — full lineup on Blue UAS Cleared List](https://www.skydio.com/blog/skydio-blue-uas-cleared-list-2026) · [DroneXL — Skydio Blue UAS clearance & Army order](https://dronexl.co/2026/07/23/skydio-full-lineup-blue-uas-cleared-list/)
- [PRNewswire — XTEND $30M extension completing $70M Series B](https://www.prnewswire.com/news-releases/xtend-secures-30m-extension-to-complete-70m-series-b-to-scale-its-battle-proven-autonomous-ai-robots-across-america-302505634.html) · [Ynet — Xtend secures $70M Series B](https://www.ynetnews.com/business/article/r1v1kkriex) · [Calcalist — XTEND lands $8.8M Pentagon contract](https://www.calcalistech.com/ctechnews/article/skq0jsbhyg) · [DroneLife — XTEND wins $20M Israeli MoD multi-drone OS contract](https://dronelife.com/2023/01/19/xtend-wins-israeli-defense-contract-for-human-guided-multi-drone-operating-system/) · [Israel Defense — XOS into Lockheed Skunk Works MDCX](https://www.israeldefense.co.il/en/node/67245)
- [Auterion — 33,000 Skynode strike kits to Ukraine](https://auterion.com/auterion-secures-contract-to-deliver-33000-skynode-drone-strike-kits-to-ukraine/) · [Auterion — 50,000 Shrike drones with SkyFall](https://auterion.com/auterion-and-skyfall-to-ship-50000-shrike-strike-drones-to-ukraines-front-lines/) · [Auterion — German JV first contract](https://auterion.com/auterion-airlogix-joint-venture-receives-first-contract-from-germany/) · [Auterion — Nemyx launch](https://auterion.com/auterion-launches-nemyx-enabling-fully-coordinated-drone-swarms/)
- [Getlatka — Percepto $26M revenue, 173 staff](https://getlatka.com/companies/percepto.co) · [Percepto — $67M Series C + FAA waiver](https://percepto.co/percepto-raises-67m-series-c-receives-faa-waiver-ushering-in-new-era-of-autonomous-drone-inspections-at-industrial-sites/) · [StartupHub — Percepto $134M raised](https://www.startuphub.ai/startups/percepto)
- [Getlatka — FlytBase $10.8M ARR, $32.3M valuation](https://getlatka.com/companies/flytbase.com) · [DroneLife — FlytBase One (Feb 2026)](https://dronelife.com/2026/02/18/flytbase-unveils-flytbase-one-management-system/)
- [Crunchbase — High Lander profile](https://www.crunchbase.com/organization/high-lander) · [Tracxn — High Lander funding & headcount](https://tracxn.com/d/companies/highlander/__uwefazJ4qwkedjwr3i2HaA1p4w8XxGZzvsTGTB754jw) · [Unmanned Airspace — EDGE invests in High Lander](https://www.unmannedairspace.info/urban-air-mobility/edge-invests-in-utm-company-high-lander-to-grow-military-and-civil-autonomous-operations/) · [suasnews — Vega UTM in Canada's RPAS traffic project](https://www.suasnews.com/2024/11/high-landers-vega-utm-to-power-consortium-in-canadian-national-rpas-traffic-management-project/) · [Commercial UAV News — BIRDS/Vega in Brazil](https://www.commercialuavnews.com/birds-authorized-by-decea-to-use-vega-utm-in-brazilian-national-utm-project) · [Unmanned Airspace — Vega for Kenya's Konza drone corridor](https://www.unmannedairspace.info/uncategorized/high-landers-vega-utm-system-will-support-kenyas-konza-technopolis-smart-city-drone-operations/)
- [StartupHub — Airwayz $12M raised](https://www.startuphub.ai/startups/airwayz) · [Tracxn — Airwayz profile, 37 employees](https://tracxn.com/d/companies/airwayz/__H555qmxL7offNavdLyJbMqWSOtfn5bRx0r5bewZxITY) · [DroneLife — Propeller/Airwayz $7M IEC contract](https://dronelife.com/2024/11/20/propeller-drones-and-airwayz-collaborate-on-7-million-iec-contract-for-bvlos-autonomous-flights/) · [Inside Unmanned Systems — Airwayz at Port of Rotterdam](https://insideunmannedsystems.com/inside-ai-largest-port-in-europe-taps-israels-airwayz-to-demonstrate-utm-system-in-rotterdam/)
- [DroneLife — SkyfireAI $11M seed](https://dronelife.com/2026/04/28/skyfireai-autonomous-drone-operations-11m-funding/)

**Regulatory**
- [Rupprecht Law — NDAA §1709 and drones](https://jrupprechtlaw.com/national-defense-authorization-act-ndaa-2025-and-drones/) · [UAV Coach — The DJI ban, updated 2026](https://uavcoach.com/dji-ban/) · [Pillsbury — FCC categorical prohibition on foreign-produced UAS](https://www.pillsburylaw.com/en/news-and-insights/fcc-categorical-prohibition-foreign-produced-uas-critical-components.html) · [SPH Engineering — DJI ban concerns & outlook](https://www.sphengineering.com/news/dji-ban-concerns)

**DFR market**
- [EFF — Drone as First Responder programs: 2025 in review](https://www.eff.org/deeplinks/2025/12/drone-first-responder-programs-2025-review) · [EFF — Hundreds of DFR programs could soon launch](https://www.eff.org/deeplinks/2026/07/hundreds-drone-first-responder-programs-could-soon-be-launched-across-country) · [DroneLife — BRINC + National League of Cities national DFR program](https://dronelife.com/2026/03/17/brinc-nlc-drone-as-first-responder-program/) · [Flock Safety — acquisition of Aerodome](https://www.flocksafety.com/blog/flock-safety-expands-into-drones-for-law-enforcement-with-acquisition-of-aerodome)

**Battery-aware planning gap**
- [arXiv — Drone Delivery Optimization (battery, reuse, no-fly zones, multiple depots)](https://arxiv.org/html/2311.17375) · [ScienceDirect — Routing battery-constrained delivery drones in a depot network](https://www.sciencedirect.com/science/article/abs/pii/S0968090X23001365) · [ACM — Locker-based drone delivery with battery swapping: joint routing–recharging](https://dl.acm.org/doi/10.1145/3787256.3787269) · [ScienceDirect — Locating charging stations and routing drones](https://www.sciencedirect.com/science/article/pii/S0377221724001772)

**Defense COTS-quad competition (§4.7, §2.8)**
- [Calcalist — Israeli startups Kela and eyesAtop to power IDF's autonomous attack drones (Digital Bat, 14 Jul 2026)](https://www.calcalistech.com/ctechnews/article/byjpzaxnfe)
- [Times of Israel — By unifying controls, startup puts drone war in IDF's hands (eyesAtop: 20+ platforms, vendor-swappable, ~$15M)](https://www.timesofisrael.com/by-unifying-controls-startup-led-by-slain-soldiers-brother-puts-drone-war-in-idfs-hands/)
- [Jerusalem Post — ASIO raises $15M for its tactical platforms](https://www.jpost.com/defense-and-tech/article-903083)
- [DJI — Statement on military use of drones](https://www.dji.com/media-center/announcements/dji-statement-on-military-use-of-drones)
- [GitHub — djicot, DJI to TAK gateway](https://github.com/snstac/djicot) · [GitHub — DroneCOT, Remote ID/ODID to Cursor-on-Target](https://github.com/snstac/dronecot) · [DroneControl — native ATAK integration for DJI drones](https://www.dronecontrol.co/post/dronecontrol-launches-native-atak-integration-for-dji-drones)

**Who is inside the accounts (§6)**
- [Unmanned Airspace — Israeli police use Airwayz U-space services and a drone network to monitor the Tel Aviv marathon](https://www.unmannedairspace.info/latest-news-and-information/israeli-police-use-airways-drones-u-space-services-and-network-of-drones-to-monitor-tel-aviv-marathon/)
- [The Intercept — An Israeli company is hawking its self-launching drone system to U.S. police departments (High Lander ORION)](https://theintercept.com/2024/05/17/israel-orione-drone-us-police-louisiana/)
- [Defensemirror — Elbit develops Dominion-X; TRL9, deployed in IDF operations](https://defensemirror.com/news/38878)
- [Elbit Systems — Dominion-X autonomous mission management](https://www.elbitsystems.com/networked-warfare/robotic-and-autonomous-solutions/autonomous-missions-management-system/dominion-x)
- [Janes — IDF orders Fire Weaver networked fire control system](https://www.janes.com/osint-insights/defence-news/idf-orders-fire-weaver-network-fire-control-system)
- [Elbit Systems — Torch-X family](https://www.elbitsystems.com/networked-warfare/network-warfare-systems/torch-x-family)
- [The Robot Report — XTEND drones evolve to support defense missions (operational in Gaza and Lebanon)](https://www.therobotreport.com/xtend-drones-rapidly-evolve-support-defense-missions/)
- [The Drone Girl — CAAI Regulation 10916: mandatory UTM connection, data shareable with military/police/intelligence](https://www.thedronegirl.com/2023/12/01/utm-connection-law-israel/)

**Channel**
- [MAFAT/DDR&D — Green Lane for startups](https://ddrd-mafat.mod.gov.il/en/mafat-for-startups/green-lane) · [MAFAT/DDR&D — Innotal](https://ddrd-mafat.mod.gov.il/en/mafat-for-startups/innotal) · [Jerusalem Post — Defense Ministry orders boost Israeli startups (NIS 1.08B, 2025)](https://www.jpost.com/defense-and-tech/article-884168) · [Olam — the MAFAT allocation: how Israel's MoD funds startups](https://olam.business/the-mafat-10-allocation-how-israels-defense-ministry-funds-startups)

*Retrieved 2026-08-19. Funding and contract figures move monthly in this sector — re-verify §1
before any funding conversation more than ~3 months out.*
