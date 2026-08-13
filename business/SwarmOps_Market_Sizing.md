# SwarmOps — Market Sizing (TAM / SAM / SOM) & Expansion Research

**Internal working document, August 2026.** Companion to `SwarmOps_Business_Overview_{EN,HE}.md`
(§4 of that document deliberately omits quantitative sizing pending third-party sources — this
document is that work) and to `SwarmOps_UseCases.md` (which maps capability by sector).

**Read this before quoting any number from it.** Two different kinds of figure appear below and
they are not interchangeable:

- **[SOURCED]** — comes from a named third-party research firm or regulator. Safe to cite, with
  the source named. Note that analyst estimates for the same market disagree by up to 4× — that
  disagreement is itself a finding, handled in §2.
- **[MODELLED]** — our own bottom-up construction from sourced inputs plus stated assumptions.
  Defensible in a room *if the assumptions are stated with it*. Never present as a market fact.
- **[ASSUMPTION]** — an input we have not yet validated. These are the things to go measure
  before this document is used in a fundraising conversation. Collected in §8.

---

## 1. Definitions, applied to this business

| Layer | Generic meaning | For SwarmOps |
|---|---|---|
| **TAM** | Total revenue if we captured 100% of the category, worldwide, no competition | Global spend on drone **fleet coordination / operations software** — not drones, not drone software generally |
| **SAM** | The slice our actual product, business model, and geography can reach | Organizations operating **multi-drone fleets past the human coordination threshold**, in markets we can sell into |
| **SOM** | What we can realistically win in ~3 years given team, capital, competition | Named beachhead customers, bottom-up, at a validated price point |

**The single most important framing decision in this document:** SwarmOps's TAM is *not* the
drone market. The overall drone market is projected at **$96.4B in 2026** and the commercial
drone market at **$28.0B in 2026** [SOURCED — Grand View Research], but the overwhelming majority
of that is aircraft, sensors, and services — hardware and labour we do not sell and do not take a
cut of. Quoting a $96B TAM for a coordination-software company is the exact error that gets
punished in a diligence conversation (see the note in §2.3). Our honest TAM is a fraction of a
fraction of it, and the argument has to be made on growth rate and structural position, not on
headline size.

---

## 2. TAM — Total Addressable Market

### 2.1 The layered view

Sizing works by narrowing from the outermost credible category inward. Each row narrows the one
above it.

| Layer | 2026 size | Source / note |
|---|---|---|
| Total drone market (all hardware, software, services) | **$96.4B** (→ $182.4B by 2033) | [SOURCED] Grand View Research. **Not our TAM.** Listed only to show what we are *excluding*. |
| Commercial drone market (excl. consumer/military hardware) | **$28.0B** (→ $52.1B by 2033) | [SOURCED] Grand View Research. Still not our TAM — mostly aircraft and services. |
| Drone **software** (all categories: flight control, mapping/photogrammetry, analytics, fleet ops) | **$5.2B – $20.2B** | [SOURCED] Range across Mordor Intelligence, Fortune Business Insights, SkyQuest, Research & Markets, Business Research Insights. ~19.9% CAGR through 2035. The 4× spread is real; see §2.3. |
| **Drone fleet management & operations software** ← *our category* | **$2.5B – $3.9B** | [SOURCED] Fact.MR: $2.5B, 17.7% CAGR to 2036. Market Growth Reports: $3.92B, 18.3% CAGR. (A $18.9B estimate from Global Market Statistics is a clear outlier against every other source and is discarded.) |
| **Fleet *coordination/optimization* specifically** — the assignment/routing/feasibility layer, not logging, compliance, or media management | **no third party sizes this separately** | [MODELLED] See §2.2. This is our real TAM and it does not appear as a line in any published report. |

### 2.2 Why our real TAM has to be modelled, not cited

"Drone fleet management software" as analysts define it bundles four things that are commercially
distinct:

1. **Compliance & records** — flight logs, pilot certification tracking, airworthiness records.
   (Dronedesk, Airdata, Kittyhawk-lineage products.)
2. **Media & data processing** — photogrammetry, mapping, model generation. (DroneDeploy,
   Pix4D.) This is where most of the category's revenue actually sits today.
3. **Single-aircraft flight control & autonomy** — manufacturer software. (DJI, Skydio, Auterion,
   Autel.)
4. **Fleet coordination** — who flies what, in what order, can they finish it. **Us.** Almost
   nobody's primary product.

Categories 1–3 are mature and crowded. Category 4 barely exists as a purchased line item, because
until fleets crossed the coordination threshold there was nothing to buy. **That is
simultaneously the opportunity and the risk**: a TAM this narrow is either a new category forming
(good — first mover in it) or evidence that operators don't perceive the problem as software-
shaped yet (bad — long, expensive market education). Which of the two it is, is the single
highest-value thing the Phase 2 pilot can answer, and the pilot should be scoped to answer it
explicitly.

**[MODELLED] Coordination-layer TAM:** taking the sourced category at $2.5–3.9B and assigning
coordination/optimization a **10–20%** share of coordination-relevant platform spend gives a
**~$250M – $780M** TAM today, growing at the category's ~18% CAGR to roughly **$1.2B – $3.6B by
2033**. The 10–20% share is an [ASSUMPTION] — it is our judgement of how a platform contract
splits between "records/compliance/media" and "the planning brain," and is the weakest link in
this chain. It is validated the first time we price a real deal (§8).

### 2.3 On the analyst spread — say this out loud, don't hide it

The published 2026 estimates for the drone software market range from $5.17B to $20.23B — a 4×
disagreement about the size of a market that already exists. The reason is definitional
(does "drone software" include manufacturer firmware? defense programs? services attached to
software?), not measurement error.

**Practical consequence:** cite a *range with two named sources*, never a single point estimate.
A one-pager that says "the $20B drone software market" invites the reader to find the $5B number
and stop trusting the rest of the document. A one-pager that says "$5–20B depending on
definition; the fleet-operations slice is ~$2.5–3.9B (Fact.MR, Market Growth Reports)" reads as
someone who has actually done the work. This is a credibility asset, not a hedge.

---

## 3. SAM — Serviceable Addressable Market

### 3.1 The filter that actually matters: the coordination threshold

**There are two different filters here, and the second one is the real market.**

#### Filter A — one operator, several aircraft (the obvious case)

**Threshold: ≥3 aircraft.** `SwarmOps_UseCases.md` §1 says a human can hold roughly 3–5 drones in
their head at once, and an earlier version of this document read that as "sell to 5+." That was
too conservative, and it mis-stated the pain. **At 3–4 aircraft an operator is not comfortable —
they are at the ceiling.** They are managing it, but with no slack: one disruption (a drone
draining faster than expected, an urgent task arriving, an aircraft dropping off) and the picture
is gone, because it was never written down anywhere but in someone's head. They also have no way
to *prove* a route was flyable before launch, and no record afterwards. The 3-aircraft operator
has the problem; they just haven't been sold a name for it yet.

#### Filter B — many operators, one aircraft each (the real market, and much larger)

**The coordination problem does not require anyone to own a fleet.** Ten people each flying one
drone in the same area *is* a fleet — it just has no owner, no shared picture, and no one
responsible for deconflicting it. At scale it is a swarm that happens to be controlled by many
hands rather than one system.

This is precisely the 7 October failure in Business Overview §2: **two teams, one drone each, no
coordination, same sector, contradictory reports.** Neither team had a fleet-size problem. Both
were individually operating fine. The failure was entirely in the space *between* them, which no
per-operator tool has any reason to look at — and which is exactly the gap the IDF still has
today (§3.3).

The implications are substantial and they change the shape of the business:

1. **The buyer is not the drone owner.** It is whoever is accountable for the shared airspace —
   a base or sector commander, a site security director, a general contractor over subcontracted
   pilots, a municipality, an event authority, a national programme. They may own zero aircraft.
2. **SAM is not counted in fleets.** It is counted in **operating areas where 3+ aircraft fly
   concurrently under separate control**. A single site with 10 independent one-drone operators
   is one customer, and a valuable one — while ten separate 1-drone businesses are zero customers.
3. **It explains why no incumbent covers this.** Every tool in §2.2 is sold to, installed by, and
   scoped to a single operator. A product that sits *above* multiple independent operators is a
   different product with a different buyer, which is why the manufacturers have not built it and
   structurally are not positioned to (their software's job is to make *their* aircraft fly well).
4. **It makes multi-tenancy core, not a Phase 3 feature.** The hierarchy work already on the
   roadmap (`SwarmOps_UseCases.md` 2.2, unit → base → command) is not a convenience for large
   customers — under Filter B it *is* the product. Worth re-examining its roadmap position.
5. **It is the direct on-ramp to the national-layer idea in §5.9.** A country is just the largest
   possible instance of Filter B.

**Filter B has now been confirmed by procurement, at a scale that settles the argument.** [SOURCED]
Israeli small-drone purchasing over 2025–26: an initial tender of **5,000 units** (₪20M ≈ $5.9M,
~₪3,500 each) from Xtend, then a further tender for **12,000 FPV aircraft** at ₪20,000–25,000
each, plus an in-house IDF production line stood up explicitly to cut per-unit cost. By contrast
the primes' small precision systems — Rafael's Spike Firefly, Elbit's Lanius (1.25 kg, marketed
for swarm use), IAI's Rotem L — are low-volume and unit-selective; Firefly's price is undisclosed
but the closest public comparable (Poland's Warmate) was **$26,460 per unit in 2017**, which is
why a rifleman does not carry one. Confirmed independently: a team member serving in an infantry
role as recently as late 2025 never encountered them.

**Three conclusions follow, and they change the strategy more than the numbers do:**

1. **The volume tier is cheap aircraft, one operator each.** Twelve thousand aircraft in a single
   tender, individually flown, with no layer above them. This is not an analogy for Filter B — it
   is Filter B, procured, at a scale no radio net absorbs.
2. **The customer is commoditising the hardware themselves.** An in-house production line built to
   lower unit cost is the clearest possible signal that aircraft are becoming the cheap,
   replaceable part of the system. That is our thesis (§2.2) demonstrated by our prospective
   customer's own capital allocation — and it is a decisive argument against ever manufacturing.
3. **It weakens the manufacturer-partnership channel.** If the buyer purchases cheap aircraft in
   bulk and increasingly builds its own, coordination software is bought **directly by the
   operator or the force**, not licensed through an OEM. Partner-led distribution is a smaller
   part of the path than it first appears.

**Scope decision this forces, and it should be made deliberately rather than drifted into.** Much
of the volume above is armed. `SwarmOps_UseCases.md` §2 states plainly that SwarmOps is "not a
weapons system"; coordinating strike aircraft crosses that line, and carries heavier export
licensing, a narrower customer set, a different investor conversation, and foreclosure of parts of
the civilian market sized in §3.4. **The ISR, patrol-coverage and resupply framing carries none of
those costs and addresses the same coordination gap over the same aircraft.** Recommendation:
size and sell the coordination layer, stay deliberately silent on payload, and let the customer
decide what the aircraft carries. Revisit only with counsel, not in a meeting.

**Honest counterweight:** Filter B customers are harder to find and harder to sell than Filter A
customers. The pain is obvious to whoever holds responsibility for the airspace, but the budget
sometimes sits with no one, and the purchase requires authority over parties who do not report to
each other. In defense and at guarded sites that authority exists and is clear — which is another
reason those segments come first. In loose civilian settings it often does not, and those should
be approached only after a defense or site-security reference exists.

#### Counting the market — Filter A only

The wider threshold is also the right *commercial* choice, for a reason beyond count: **a
3-aircraft customer today is a 10-aircraft customer in two years.** Fleets in this market grow.
Landing them small and expanding with them is a materially better position than waiting for them
to cross an arbitrary line and then competing for them against whoever they already bought from.

Applying it:

- **[SOURCED]** The FAA recorded **424,516 active commercial drone registrations** and **493,396
  certified remote pilots** as of December 2025 (projected 628,600 pilots by 2030).
- **[SOURCED]** Europe has **1.6M+ registered drone operators** under EASA rules.
- **[ASSUMPTION]** Most are single-operator with 1–2 aircraft. We model **2–5% of registered
  commercial operators as running ≥3 aircraft** (versus 1–3% at ≥5). An earlier draft used 3–7%;
  that produced a SAM exceeding this document's own coordination-share ceiling (§2.2), which is
  how we caught it — see the cross-check in §3.4.

That gives roughly **32,000 – 80,000 organizations** across the US and Europe inside the
threshold [MODELLED], up from 16,000–48,000 at ≥5. Add defense/government units — not in civil
registration counts, and structurally the largest fleets — and the order of magnitude holds.

**The honest cost of widening the threshold:** the organizations we just added are small, and a
3-aircraft fleet at $150/aircraft/month is **~$5,400/year**. That is far below the cost of an
enterprise sales motion — a founder-led sale that takes three meetings loses money at that price.
So the wider threshold only works with **two distinct motions**:

| Fleet size | Motion | ACV | Role in the business |
|---|---|---|---|
| **3–9 aircraft** | Self-serve / low-touch, published pricing, no bespoke deployment | **$5K – $18K** | Volume, funnel, land-and-expand. Must cost near-zero to serve or it destroys margin |
| **10+ aircraft, defense, multi-site** | Direct, founder-led then sales-led | **$20K – $300K** | Where the revenue actually is |

Widening to 3 roughly **doubles-to-triples the customer count and lowers blended ACV**, so
revenue does not scale with the count — see §4. The gain is funnel, market presence, and the
expansion path, not immediate ARR. **Do not build the self-serve motion in year one**; year one
is the direct motion against Israeli defense and infrastructure. The ≥3 threshold is what the
market *is*, and it changes the sizing below; the self-serve product that monetizes the small end
of it is a year-two decision.

**Every number in §3.3 and §3.4 is Filter A only.** Registration data counts operators and
aircraft; nobody publishes a count of shared operating areas, so the Filter B population cannot
be sized from public sources. **Filter B is therefore upside that is not in the tables** — stated
plainly so nobody reads the SAM figures as though they already contained it. Measuring it is
§8.1, and it may well be the larger half of the market.

### 3.2 Pricing anchors — what this market already pays

Real comparables, not guesses:

- **[SOURCED, weakly]** Drone fleet management platforms price at **$50–500 per aircraft per
  month**; enterprise tiers with analytics and real-time visualisation reach **~$2,000/month** per
  organization. **Source quality caveat:** this band comes from vendor trade guides (Dronedesk,
  DroneBundle), which are content marketing, not research. It is directionally useful and
  corroborated by the DroneDeploy figures above, but it should not be presented as a research
  finding, and a real quote from a real deal supersedes it (§8.3).
- **[SOURCED — corrected 2026-08-13]** DroneDeploy publishes **$329/user/year (Individual)** and
  **$599/user/year (Advanced)**; Teams and Enterprise are quoted privately (Capterra). Its
  **automated flight planning supports DJI aircraft only** — other manufacturers' imagery can be
  processed, but non-DJI operators cannot use the core flight-planning function. **An earlier
  draft of this document said "$329–499 per seat per *month*" and "DJI only" without
  qualification.** Both came from a review published by Skyebrowse — a direct competitor of
  DroneDeploy — which is exactly the kind of source that should not have been load-bearing. The
  per-month reading overstated the price by roughly 12×. Corrected against Capterra and
  DroneDeploy's own supported-hardware documentation.
- **[SOURCED]** Skydio's R10 runs ~$6,000 plus a ~$3,000/year service fee — i.e., recurring
  software attach on hardware is an established norm buyers already accept.

**[MODELLED] SwarmOps ACV assumption:** a coordination layer priced at **$150/aircraft/month**
($1,800/aircraft/year) — deliberately mid-range, since we are one layer of a stack and not the
system of record — against an average addressable fleet of ~10 aircraft, plus a platform base
fee, gives:

| Customer type | Modelled ACV | Rationale |
|---|---|---|
| Civilian fleet operator (10–20 aircraft) | **$20K – $40K** | Per-aircraft pricing at mid-market rate |
| Large civilian / multi-site (50+ aircraft) | **$75K – $150K** | Volume discount offset by multi-tenancy and integration |
| Defense / security — **site or formation** level (a base, a security directorate, one formation), on-prem or air-gapped | **$100K – $300K** | Deployment model, support obligations, and procurement norms all raise ACV — see §5.7 |
| Defense — **force level** (coordination across a force operating aircraft in the thousands) | **$1M – $5M** [MODELLED] | Not a departmental purchase — a program. See §3.2a for the two derivations. 12–24 month procurement cycle; treated as upside, never as plan |

#### 3.2a Two corrections the FPV procurement forces on this pricing model

**(a) The per-aircraft unit does not survive contact with expendable fleets.** Everything above is
priced per aircraft per month, which is correct for a reusable inspection or patrol drone and
meaningless for an aircraft consumed in a single flight. Applying $150/aircraft/month to a
12,000-unit FPV holding yields **$21.6M/yr**, which is fiction and would be caught instantly. For
expendable-heavy fleets the billable unit is **per formation, per site, or per program** — never
per airframe. Quote the wrong unit once and the rest of the model loses credibility with it.

**(b) The old $100–300K defense ceiling was set by analogy to a large civilian customer, not by
anything about defense.** Two independent derivations of a force-level program, both rough
[MODELLED]:

| Method | Working | Result |
|---|---|---|
| Share of hardware spend | 12,000 × ₪20–25K ≈ ₪240–300M (~$65–80M) of aircraft; coordination software at 1–3% annually | **$0.7M – $2.4M/yr** |
| Per formation | 20–40 formations × $50–150K each | **$1M – $6M/yr** |

Both land at roughly **$1–5M/yr for an Israeli force-level coordination layer** — against a total
Israeli SAM of $6–20M (§3.3). So a single force-level program would be a material fraction of the
entire national market, and would exceed the whole three-year SOM in §4.

**This does not raise the SOM, and that distinction matters.** SOM is bounded by our capacity to
sell and deliver, not by market size: four people, pre-seed, no sales function, against a 12–24
month defense procurement cycle. A larger prize does not compress that cycle. What changes is the
**variance**, not the plan — the base case is unchanged, the upside tail is far fatter. A plan that
only works if the defense program lands is a plan an investor discounts; ours works without it.

### 3.3 Israel first — the primary market, in detail

**Strategic position: Israel-first, not Israel-only.** Israel is where we sell, pilot, and prove.
Other regions are not excluded — they are sequenced after a proven reference, and the
architecture and pricing model are built so nothing about the Israeli focus forecloses them
(§3.5). This section sizes Israel properly rather than treating it as a footnote to a global
number.

#### Israeli buyer segments

| Segment | Who | Fleet character | Modelled ACV | Access path |
|---|---|---|---|---|
| **Defense & security units** | IDF formations, security directorates, base/perimeter security | Largest fleets; heterogeneous vendors; hardest coordination problem | **$100–300K** per site/formation; **$1–5M** at force level (§3.2a) | The founders' own service background; college defense network; the 7 Oct account (Business Overview §2) is a first-hand credential here, not a marketing line |

> **What the IDF is actually missing — state it this way, not as "optimization."** The primary
> gap is not that assignment is suboptimal. It is that **nothing aggregates every drone currently
> airborne into one picture.** Each unit flies its own aircraft on its own controller; no screen
> anywhere shows everything in the air at once, who is flying it, and what it is tasked to. The
> optimizer is what SwarmOps does *once it has that picture* — but the picture itself is the
> thing that is missing, and it is what a commander recognizes instantly in a demo.
>
> **Sizing consequence:** this reframes the defense sale from *efficiency* (a budget line that
> must be justified against savings) to *situational awareness / command and control* (a budget
> line that already exists and is defended). Same product, materially higher willingness to pay,
> and it explains the ACV gap between the defense row above and every civilian row below. It
> also plays directly to feed aggregation (§5.2) — the same argument extended from "where is
> everything" to "what is everything seeing" — which, contrary to what these documents said until
> 2026-08-13, is **already built** at single-fleet scale. See `SwarmOps_UseCases.md` 2.2 and 2.9:
> what remains roadmap in both is the *cross-unit* half, not the capability itself.
| **Critical infrastructure** | Israel Electric Corp, Mekorot, Netivei Israel, Noble/Energean onshore facilities, rail | Recurring, route-heavy inspection — maps directly onto the optimizer | **$40K – $150K** | Procurement is slow but public and enumerable; strongest civilian fit |
| **Security & guarding companies** | Site/campus security integrators operating drone patrols | Mid-size, growing fastest as drone-as-first-responder spreads | **$20K – $60K** | Named as a Phase 2 pilot candidate already |
| **Agriculture** | Kibbutz/moshav co-ops, agri-service providers | Acute battery/payload constraint; seasonal but high-volume | **$15K – $40K** | Dense, referral-driven, geographically concentrated |
| **Drone service companies** | Operators flying under contract for multiple clients | Multi-tenant by nature — our Phase 3 feature is their core need | **$25K – $75K** | 117 drone startups registered in Israel [SOURCED — Tracxn], though most are *manufacturers*, not fleet operators; the operator subset must be enumerated by hand (§8.4) |

**[MODELLED] Israeli SAM: 300–800 organizations past the ≥3-aircraft threshold [ASSUMPTION],
blended ACV $20–25K → roughly $6M – $20M/yr civilian + defense combined.** The blend is derived
from the two-motion table in §3.1 rather than asserted: at a ≥3 threshold the population skews
small, so ~70–80% sit in the $5–18K self-serve band and ~20–30% in the $20–300K direct band
(0.75 × $10K + 0.25 × $60K ≈ $22K). An earlier draft used $32K blended, which silently assumed a
customer mix far larger than the threshold admits. Against a national UAV market sourced at **$557.6M (2025) → $855.7M (2030), 8.9%
CAGR** [SOURCED — MarketsandMarkets], a coordination-software slice of that order is consistent
rather than optimistic.

**Plus Filter B, uncounted:** every guarded site, base, infrastructure corridor, and municipal
area in Israel where several independently-controlled aircraft fly in the same space. Israel is
unusually dense in exactly these — small country, continuous security activity, mixed
civil/military airspace. **This is very likely the larger half of the Israeli market and none of
it is in the $10–26M figure above.**

#### Why Israel is structurally the right first market — beyond proximity

Four things make Israel a genuinely better beachhead than "it's where we live," and all four are
citable:

1. **Regulatory head start on the constraint that defines our SAM.** BVLOS is what pushes
   operators past the coordination threshold (§3.1). The US is still waiting on Part 108
   (§5.4) — but Israel has been running **the National Drone Initiative (INDI/NAAMA)** since
   2020: CAAI, Ministry of Transport, Ayalon Highways, C4IR and the Israel Innovation Authority
   jointly operating nationwide BVLOS trials under managed airspace, with a 2020–2022 phase that
   met all pre-defined metrics and a second phase running 24 monthly nationwide trial weeks from
   January 2023 [SOURCED]. Israel has also tested **BVLOS flight in GPS-denied environments** at
   the Yeruham test range [SOURCED] — which is precisely the contested-environment problem in
   §5.6. **Israel's operators cross our threshold earlier than America's do.** That is a real
   first-market advantage, not a patriotic one.
2. **Non-dilutive capital that matches our stage.** The Israel Innovation Authority's Startup
   Fund raised its maximum investment as of **15 July 2026 to NIS 2M at Pre-Seed and NIS 6M at
   Seed** for approved DeepTech companies, and is funding **up to three new technological
   incubators at up to NIS 40M each over five years, explicitly including robotics and
   defense-tech** [SOURCED]. This is directly relevant to the Business Overview §9 ask: part of
   the pre-seed need may be addressable non-dilutively, and the college's incubation affiliation
   strengthens an Innovation Authority application rather than competing with it.
3. **A defense-tech funding environment at an unusual peak.** Israeli defense-tech startups
   working with the Ministry of Defense raised **~$3B in H1 2026**, with defense-tech and
   dual-use companies taking nearly **30% of the $8.4B** in total Israeli private hi-tech
   investment over the same period [SOURCED]. We are positioned in the segment currently
   attracting the largest share of local capital — timing that will not necessarily hold, which
   argues for moving on the seed conversation rather than waiting for more product.
4. **Israeli deployment is an export asset, not a limitation.** A coordination layer proven with
   Israeli security or infrastructure operators carries evidentiary weight in exactly the export
   markets we would enter next. Israel's defense industry exported over **$2.4B in drones between
   2017 and 2020** [SOURCED] — the credibility channel from an Israeli reference to an
   international buyer is well-worn and already exists.

### 3.4 Other regions — sequenced, not excluded

| Market | Addressable orgs (≥5 aircraft) | Modelled SAM | When it opens |
|---|---|---|---|
| **Europe** | share of **1.6M+ registered EASA operators** [SOURCED] passing the fleet filter | part of the **$320M – $800M/yr** below | After one Israeli reference customer. EASA's single cross-border rule set means one compliance posture serves all member states — cheaper to enter than it looks |
| **United States** | share of **424,516 active commercial registrations / 493,396 remote pilots** [SOURCED, FAA Dec 2025] | as above | Gated on Part 108 (§5.4). The largest single-country civilian opportunity, and the one whose SAM expands discontinuously the day BVLOS lands |
| **Europe + US combined, civilian** | 32,000 – 80,000 [MODELLED, §3.1] | **$320M – $800M/yr** | At $10K blended ACV — lower than the Israeli blend, since the population outside Israel is not defense-weighted. **Cross-check, and this one bites:** §2.2 puts coordination at 10–20% of the $2.5–3.9B category, i.e. a $250M–$780M ceiling. The earlier $480M–$1.3B estimate breached that ceiling by ~1.7×, meaning two parts of this document contradicted each other. Corrected by tightening the fleet-size share (§3.1), not by adjusting the ceiling to fit |
| **Global defense (export)** | — | not modelled | Military drone market sourced at **$22.8B by 2030 (7.6% CAGR)** [SOURCED — MarketsandMarkets], though the same firm publishes **$109.22B by 2031** on a different scope definition — a discrepancy to resolve before the figure is used anywhere. Israeli defense credibility is the entry mechanism (§3.3, point 4) |

**Nothing in the Israel-first plan forecloses these.** The three things that would — hard-coding
Israeli regulatory assumptions into routing, pricing only in shekels against local procurement
norms, and building a Hebrew-only operator interface — are all cheap to avoid now and expensive
to undo later. Treat them as architectural constraints from the start: keep airspace rules as
data rather than logic, keep the pricing model currency-neutral, and keep the UI localizable.

### 3.5 Two conclusions from §3 that change strategy

**(a) Israel is where the company is built; export is what makes it venture-scale.** At $6–20M
counted, plus uncounted Filter B upside, the Israeli SAM is large enough to support a real,
growing, fundable company for the first several years — this is a market to take seriously and lead with, not a stepping stone to
apologize for. It is not, on its own, a Series-A-to-exit story at meaningful share. The honest
framing for leadership and investors: **Israel is the market we win; Europe and the US are the
markets that make the outcome large.** Both halves of that sentence matter, and the second one
does not require doing anything differently in year one beyond the three constraints in §3.4.

**(b) The top-down and bottom-up numbers now agree, and getting there was the useful part.** Our
bottom-up US+EU civilian SAM ($320M–$800M) sits inside the $250M–$780M coordination ceiling implied
independently by §2.2, having been corrected once when it did not. Two independently-constructed
numbers landing in the same range is the strongest single argument in this document — and the fact
that the first attempt failed this check, and was fixed rather than rationalised, is what makes it
worth trusting. Two independently-constructed numbers landing in the same order of
magnitude is the strongest single argument in this document — stronger than either number alone.
Lead with the agreement, not with the size.

---

## 4. SOM — Serviceable Obtainable Market

Built bottom-up against the roadmap in Business Overview §7, **entirely within Israel through
year 2** — every customer below is an Israeli logo unless marked otherwise. These are small
numbers on purpose. Small credible numbers raise money; large uncredible ones do not.

| Period | Roadmap phase | Customers | ARR [MODELLED] | Gate |
|---|---|---|---|---|
| **Months 0–6** | Phase 1–2 | 1 design partner (likely unpaid or at-cost) | **$0 – $25K** | Hardware integration must land first — nothing is sellable against a simulated fleet |
| **Months 6–12** | Phase 3 | 2–4 paying, incl. converting the pilot | **$50K – $120K** | Multi-tenancy; a validated price point; one referenceable outcome |
| **Year 2** | post-seed | 8–15 | **$200K – $500K** | First non-founder sales motion; defense reference unlocks the segment |
| **Year 3** | — | 20–40, incl. 2–3 defense/on-prem and the **first 2–4 non-Israeli logos** | **$600K – $1.5M** | First export motion (Europe before US — no Part 108 dependency, §3.4); ≥1 expansion vector from §5 shipped |

**The SOM figure is bounded by headcount, not by the market.** Every row of the expansion track
(§5) converts directly into additional addressable customers, and none of them is blocked by
research risk or by absent demand — they are blocked by four people choosing what to build next.
The relationship is direct: **more engineers → more of §5 delivered per year → more segments
sellable.** The $0.6–1.5M figure assumes the team stays at its current size; it is a floor set by
our own capacity, not a ceiling set by the opportunity.

**Do not overstate this.** Headcount compresses engineering time, not procurement time: a defense
cycle runs 12–24 months regardless of hiring, and engineers do not create customers. Hiring widens
*what we can offer and to whom*; it does not shorten the calendar of the institutions we sell to.
Both facts belong in the model — a headcount-elastic SOM is a fair argument for funding, and a
claim that funding compresses the timeline is not.

**Two share figures, and the Israeli one is the honest one to lead with:** ~$1M year-3 ARR is
roughly **5–15% of the $6–20M counted Israeli SAM** (about 8% at both midpoints) — a credible share
of a market we can name customer by customer — and ~0.2–0.3% of the combined Europe+US SAM, which
is the headroom argument rather than the plan. Both are deliberately conservative and the right shape for a first-time team with
no prior sales motion. The number that matters to an investor here is neither of them: it is the
**ACV × logo count trajectory**, and whether ACV rises with the expansion vectors below.

---

## 5. Expansion & R&D vectors — what changes these numbers

Per the brief for this document: this section deliberately does **not** reason from what is built
today. Each vector states what it does to the sizing above, and what it costs. Status legend
matches `SwarmOps_UseCases.md` (Built / Phase 1–3 / Future).

### 5.1 Multi-domain fleets — the largest single TAM multiplier

**The core engine does not know it is flying.** The planner solves a VRPTW variant where an
energy budget (not a fixed capacity) is the binding constraint and depends on distance and
payload. That description is equally true of **ground robots, AMRs in warehouses, delivery
robots, and unmanned surface vessels** — battery-constrained vehicles, tasks with priorities and
deadlines, dynamic re-planning on disruption. The domain-specific parts (no-fly zones, 3D routing,
telemetry schema) are a thin adapter over a domain-agnostic core.

- **Effect on sizing:** SAM multiplier, not an increment. "Robot fleet management software" is
  tracked as its own analyst category [SOURCED — Custom Market Insights publishes a
  2026–2035 robot fleet management software report; **we have not yet extracted its figure and
  must before citing this**]. Plausibly doubles-to-triples addressable organizations without a
  new core algorithm.
- **Cost:** moderate. Telemetry/route abstraction plus a per-domain adapter. The existing
  architecture (drones as producers of telemetry, consumers of routes) already anticipates it.
- **Risk:** dilutes positioning. "Fleet coordination for anything" is a weaker pitch at seed
  stage than "drone fleet coordination." **Recommendation: build the abstraction, market the
  focus.** Keep it as an architectural fact and a Series A story, not a year-one message.
- **Status:** Future. Highest leverage per engineering hour of anything in this section.

### 5.2 Live feed aggregation — the largest single ACV multiplier

**Correction (2026-08-13): this already exists.** An earlier version of this section, following
`SwarmOps_UseCases.md` 2.9 and `milestones.md`, stated that no video existed in the system. That
was wrong when written — the camera feed shipped over 2026-07/08 (Unity `CameraFeedStreamer.cs`
→ `telemetry-service`'s WebSocket relay → the frontend's per-drone camera panel, multi-drone
concurrent, with backpressure and staleness guards). The fleet being simulated, feeds originate
from the simulator rather than physical cameras; feeds from real aircraft come with the vendor
adapters in Phase 1.

The sizing conclusion is unchanged but now much stronger, because it describes a built capability
rather than a proposal: this moves SwarmOps from the (small, forming) coordination budget line
into the **ISR / video management** budget line, which is far larger and already funded in
exactly the defense and security organizations we target first.

- **Effect on sizing:** ACV 2–3×; changes which budget the purchase comes out of. Does not
  change customer count.
- **Path (researched separately, see the team memory note on real-drone hardware integration):**
  vendor SDK live-push (DJI `LiveStreamManager`, Autel's equivalent) → self-hosted **MediaMTX**
  ingest → WebRTC to the control room, one stream per `drone_id`. Video and telemetry stay
  separate pipelines joined only in the UI. This is materially less work than "build a VMS"
  because the coordination index — which drone is where, tasked to what — is what makes a feed
  wall useful, and we already have it.
- **Status:** **Built** at single-organization scale. What remains is (a) feeds from real aircraft,
which arrive with Phase 1 hardware integration, and (b) a true multi-feed wall across
organizations — today the commander selects one feed at a time, and cross-org aggregation is the
same Phase 3 multi-tenancy work as everything else in §3.1 Filter B.

### 5.3 Learning from flight history

Every plan issued and every telemetry event returned is already stored. An optimizer that plans
from what an airframe *actually* achieves in a given sector and season, rather than from its spec
sheet, is a data-compounding moat — each customer-month makes plans measurably better, which is
the defensibility question every investor asks and which pure optimization software otherwise
answers badly.

- **Effect on sizing:** does not move TAM/SAM. Moves **retention, expansion revenue, and defensibility** — i.e. the multiple, not the market.
- **Cost:** low to start (the training set is accumulating for free), high to do well.
- **Status:** Future. The cheapest thing to *start* on: keep the archive clean and schema-stable
  now, even if the modelling is years out.

### 5.4 UTM / airspace management at density

Not built today — the current system does simplified no-fly-zone and route-conflict checking only,
not ATC-grade 3D deconfliction. (This was written up as a PRD non-goal; that was capstone scope and
no longer binds.) But a layer already holding every aircraft's position, plan, and
intent is the natural home for it, and regulation is moving that way.

- **Regulatory clock [SOURCED]:** FAA **Part 108** (BVLOS) — NPRM published 7 Aug 2025, comments
  closed 6 Oct 2025 (3,000+ responses), reopened 28 Jan – 11 Feb 2026 on contested issues, final
  rule at OIRA since 10 Jul 2026. **Publication most likely late 2026 or early 2027.** Until
  then BVLOS remains waiver-only under Part 107.
- **Why this matters to sizing more than any other single external factor:** BVLOS is what
  multiplies aircraft-per-operator, which is what pushes organizations over the coordination
  threshold in §3.1 — the filter that defines our entire SAM. **Part 108 landing is a direct
  expansion of our SAM, not merely a tailwind.** Every year of delay slows the rate at which our
  addressable population grows.
- **Israel is ahead of this clock, which is the point of going Israel-first (§3.3).** INDI/NAAMA
  has been running nationwide managed-airspace BVLOS trials since 2020 [SOURCED]. We do not have
  to wait for the American rule to find operators with fleets large enough to need us — we wait
  for it only to *scale into* the US.
- **Effect on sizing:** a genuinely new TAM, regulatory-gated, long-horizon.
- **Status:** Future, deliberately outside the funded roadmap. Track the rule; do not build ahead
  of it.

### 5.5 Predictive maintenance / fleet health index

Already scoped as Phase 2 in `SwarmOps_UseCases.md` 2.1 / 3.4. From a sizing view it is an
**ACV add-on** (+15–30% [ASSUMPTION]) with an unusually clean ROI story for commercial operators:
a grounded revenue-generating airframe is a directly quantifiable loss, which makes the
willingness-to-pay conversation concrete instead of abstract.

### 5.6 Contested-environment operation (GPS-denied, comms-degraded)

`SwarmOps_UseCases.md` 2.10 separates this correctly into routing around known jammed areas
(built mechanism), detecting implausible telemetry and pulling an aircraft from the plan
(extension), and onboard autonomy (autopilot's job, not ours). The sizing observation to add:
**an edge/onboard planner that keeps coordinating when the cloud link is gone** is a defense
procurement unlock, not a feature. Cloud-dependent coordination is disqualifying for a
meaningful class of defense buyer, and the disqualification happens silently, at requirements
review, before anyone talks to us.

- **Effect on sizing:** gates access to the highest-ACV segment entirely. Worth knowing before
  the first defense conversation, so we do not discover it as a lost deal.
- **Status:** Future / R&D. Architecturally significant — a planner that can run degraded at the
  edge is a different deployment shape, and retrofitting it is expensive.

### 5.7 Deployment model as a pricing lever

On-prem and air-gapped delivery is not a feature customers want, it is a precondition for a
segment. It raises ACV substantially (§3.2), and it cuts against the GitOps/cloud delivery model
that is currently one of the venture's strongest assets. Worth scoping deliberately rather than
discovering under deal pressure.

### 5.8 A unified Israeli coordination layer — becoming the national standard

**The idea:** rather than selling one platform per organization, become the layer *every* Israeli
drone operator plugs into — one national picture of what is airborne, built to Israel's actual
conditions rather than adapted from an American or European product. Every operator keeps their
own aircraft, their own tasking, their own data; what they gain is a shared airspace picture and
deconfliction with everyone else in it.

**This is Filter B (§3.1) at national scale**, and it is the natural end point of the reframe:
the country is simply the largest instance of "many people flying one drone each with nothing
between them."

**Why Israel specifically can support this, where most countries cannot:**

- **Small enough to unify.** A national picture is a tractable engineering and political problem
  at Israel's size in a way it is not for the US or the EU.
- **The convening body already exists.** INDI/NAAMA already assembles CAAI, the Ministry of
  Transport, Ayalon Highways, C4IR and the Israel Innovation Authority around exactly this
  question, and has run nationwide managed-airspace trials since 2020 [SOURCED, §3.3]. A national
  coordination layer does not need a new institution invented for it — it needs to attach to one
  that is running.
- **Israel's requirements genuinely differ**, which is what makes an adapted product a real
  product rather than a localization: continuous mixed civil/military airspace use; frequent
  temporary restrictions declared at short notice; GPS jamming and spoofing as a routine
  condition rather than an edge case (Israel has already trialled BVLOS in GPS-denied conditions
  at Yeruham [SOURCED]); very short distances, so route margins are thin; dense population under
  most flight paths; and Hebrew-language operations with Israeli procedural norms. A platform
  built for FAA-shaped assumptions handles several of these badly.
- **Standards are won early or not at all.** Whoever the national programme's operators integrate
  against becomes the default, and that position is close to unassailable afterwards.

**What it does to the sizing:** this is not an increment to the SAM tables — it is a different
business model. Instead of ~$22K × 300–800 organizations, it is a **national programme contract
plus per-operator connection fees**, with the government or a national body as anchor customer.
Not modelled here; it would need its own construction once the INDI conversation (§8.6) reveals
whether such a role is even available.

**And it is the export story, not a distraction from it.** The strategically valuable thing is
not the Israeli contract — it is that *proving a national coordination layer works in the hardest
airspace anyone operates in* is what makes it sellable to the next country. Israel's defense
industry has exported this way for decades. Same channel, same credibility mechanism (§3.3,
point 4).

**Status: Future**, and honestly assessed: this is a 5-year ambition, not a plan. The concrete
near-term action is not to build toward it but to **ask, during Phase 2, whether SwarmOps can
participate in INDI at all** (§8.6) — and meanwhile to keep the architecture from foreclosing it,
which mostly means keeping multi-tenancy hierarchical (unit → base → command generalizes to
operator → region → national) and airspace rules as data rather than logic. Both are already the
right calls for other reasons.

**Do not put this in the college document as a plan.** It belongs in a conversation, framed as
where the architecture points — an ambition stated as an ambition. Written as a roadmap item it
would undermine the credibility that the rest of these documents are carefully built on.

### 5.9 Lower-priority vectors, noted for completeness

- **Simulation / what-if planning as a sellable product** — the simulator and planner already
  exist; packaged as training and pre-mission rehearsal it is a second SKU against the same
  buyer. Low cost, modest ACV lift.
- **Capacity sharing between operators** — a marketplace where one operator's idle aircraft
  serves another's mission. Interesting network-effect story, requires density we will not have
  for years. Do not build; do not promise.
- **Counter-UAS adjacency** — Israel-specific ecosystem access (D-Fend and others are local). We
  coordinate friendly fleets, we do not detect hostile ones; the honest position is *integration
  partner*, not competitor. Cheap to say, valuable in the room, nothing to build.

---

## 6. Sensitivity — what would move these numbers most

Ranked by impact on the SAM figure in §3:

1. **Whether Filter B (§3.1) is real and buyable.** Not a number that scales our SAM — a question
   of whether a second, possibly larger market exists at all, with an identifiable buyer who has
   budget and authority. **Highest-value unknown in this document by a wide margin**, because
   every other item on this list only adjusts a figure while this one changes what the company
   sells and to whom.
2. **The ≥3-aircraft share of registered operators (§3.1), and specifically the Israeli fleet-size
   distribution.** Filter A SAM moves linearly with it. We assume 2–5%; if the true figure is
   0.5%, SAM drops ~5× and the plan needs defense weighting from the start rather than as an
   option. Cheapest to resolve in Israel, where the operator population is small enough to
   enumerate by hand (§8.5).
3. **BVLOS timing — but asymmetrically by region (§5.4).** Israel's INDI/NAAMA trials already put
   Israeli operators ahead of the curve, so our *first-market* SAM is not gated on regulation.
   US Part 108 (currently pointing at late 2026 / early 2027 [SOURCED]) gates the *expansion*
   SAM, not the beachhead. This asymmetry is a direct argument for the Israel-first sequencing.
4. **Coordination's share of platform spend (§2.2).** Our 10–20% assumption. Validated by the
   first real price negotiation.
5. **Defense procurement cycle length.** Highest ACV, slowest close. A 24-month cycle against an
   18-month runway is a plan failure regardless of how good the product is.
6. **Manufacturer encroachment.** If DJI, Skydio, or Auterion ship credible cross-vendor fleet
   coordination, our category thesis weakens. Current evidence is against it — DroneDeploy is
   DJI-only [SOURCED], and vendor lock is a *business model* choice for them, not an oversight,
   which is precisely why a neutral layer has room.

---

## 7. What is safe to put in outward-facing documents

The Business Overview currently omits figures deliberately, which is the right default. If
leadership wants sizing in it, these are the defensible statements:

✅ **Safe:** the drone fleet management & operations software market at **$2.5–3.9B in 2026,
growing ~18% CAGR** (Fact.MR; Market Growth Reports) · Israel's UAV market at **$557.6M (2025) →
$855.7M (2030), 8.9% CAGR** (MarketsandMarkets) · Israeli defense-tech startups raising **~$3B in
H1 2026, ~30% of all Israeli private hi-tech investment** (Haifa DefenseTech Forum, via Jerusalem
Post) · **INDI/NAAMA** nationwide BVLOS trials since 2020, incl. GPS-denied testing at Yeruham
(Israel Innovation Authority / C4IR) · Innovation Authority Startup Fund at **NIS 2M pre-seed /
NIS 6M seed** for DeepTech from 15 Jul 2026 · **424,516 US commercial registrations / 493,396
remote pilots** (FAA, Dec 2025) · **1.6M+ registered European operators** (EASA) · **$50–500 per
aircraft per month** as the established pricing band · DroneDeploy at **$329–499/seat/month,
DJI-only**.

⚠️ **Only with assumptions stated:** every [MODELLED] figure — the SAM tables, the ACV tiers, the
SOM trajectory.

❌ **Never:** "the $96B drone market" as our TAM · any single-point drone-software figure without
its source and the competing estimate · the $18.9B fleet-management outlier · the $109.22B
military drone figure until its scope discrepancy is resolved (§3.3).

---

## 8. Open questions — what to go measure

In priority order. Items 1–4 are answerable inside the Phase 2 pilot and should be written into
its success criteria alongside the operational metrics already planned.

1. **How many shared operating areas are there — the Filter B denominator (§3.1)?** How many
   sites, bases, corridors, and municipal areas in Israel routinely have 3+ independently-
   controlled aircraft in the same space, and **who there holds authority over all of them**?
   No public source counts this, which is exactly why it is worth counting: it may be the larger
   half of the market and none of it is in our tables. Answerable by asking a handful of base
   security officers and site managers directly.
2. **What fraction of commercial operators actually run ≥3 aircraft?** Ask CAAI for Israeli
   fleet-size distribution; check whether FAA's annual UAS operator survey breaks out fleet size.
   Drives §3.1 Filter A and therefore every number in §3.3–3.4.
3. **What does a real buyer pay for coordination specifically?** Not the platform — the planning
   brain. Answered the first time we quote a deal. Validates §2.2 and §3.2.
4. **Is the problem perceived as software-shaped?** Do operators past the threshold currently
   describe coordination as a problem they'd fund, or as "how it's always been done"? Determines
   whether §2.2 is category creation or category education.
5. **Israeli buyer census.** Enumerate actual multi-drone fleet operators by
   name: defense/security units, IEC, Mekorot, Netivei Israel, agri co-ops, security integrators,
   drone service companies. Replace the [ASSUMPTION] range of 150–400 with a real list. Israel is
   small enough that this is genuinely enumerable rather than estimated — which means our
   primary market can be sized from a list of names while every other region stays a model.
   That is a real advantage of the Israel-first choice, and it is directly actionable through the
   college's industry network. Cheapest high-value item in this document.
6. **INDI/NAAMA participation path.** Can SwarmOps join or attach to the National Drone Initiative
   as a coordination-layer participant? It is run by CAAI, Ministry of Transport, Ayalon Highways,
   C4IR and the Israel Innovation Authority — an introduction target for the college, a source of
   real multi-operator flight data, and a credential. Ask before Phase 2 partner selection, since
   it may *be* the partner.
7. **Israel Innovation Authority eligibility.** Startup Fund (NIS 2M pre-seed / NIS 6M seed from
   15 Jul 2026) and the new deep-tech incubators covering robotics and defense-tech. Determine
   whether an incubated-at-the-college structure strengthens or complicates an application, and
   how much of the Business Overview §9 pre-seed ask this could cover non-dilutively.
8. **Robot fleet management software market size** — extract the actual figure to support §5.1.
9. **Resolve the military drone market scope discrepancy** ($22.8B by 2030 vs $109.22B by 2031,
   same research firm).
10. **Competitive census of fleet coordination specifically** — not fleet management generally.
   Who else sells the assignment/routing/feasibility layer as a primary product, vendor-neutrally?
   Run it against the Israeli field first (Airobotics, vHive, Percepto and the rest of the local
   ecosystem are the nearest neighbours, most of them hardware-anchored). The working hypothesis
   is "almost nobody sells the coordination layer neutrally," and it needs to be tested rather
   than assumed, because it is the load-bearing claim of the whole positioning.

---

## Sources

- [Grand View Research — Commercial Drone Market, 2026–2033](https://www.grandviewresearch.com/industry-analysis/global-commercial-drones-market)
- [Grand View Research — Drone Market Report, 2026–2033](https://www.grandviewresearch.com/industry-analysis/drone-market-report)
- [Mordor Intelligence — Drone Software Market](https://www.mordorintelligence.com/industry-reports/drone-software-market)
- [Fortune Business Insights — Drone Software Market](https://www.fortunebusinessinsights.com/drone-software-market-103527)
- [SkyQuest — Drone Software Market](https://www.skyquestt.com/report/drone-software-market)
- [Business Research Insights — Drone Software Market to 2035](https://www.businessresearchinsights.com/market-reports/drone-software-market-127428)
- [GlobeNewswire — Drone Software Market, 19.92% CAGR through 2035](https://www.globenewswire.com/news-release/2026/07/14/3327155/0/en/drone-software-market-commercial-uav-adoption-autonomous-flight-technologies-ai-powered-analytics-and-geospatial-applications-are-expected-to-support-a-cagr-of-19-92-through-2035.html)
- [Fact.MR — Enterprise Drone Management Solutions Market to 2036](https://www.factmr.com/report/enterprise-drone-management-solutions-market)
- [Market Growth Reports — Drone Fleet Management & Operations Software](https://www.marketgrowthreports.com/market-reports/drone-fleet-management-and-operations-software-market-100884)
- [Verified Market Reports — Drone Fleet Management & Operations Software](https://www.verifiedmarketreports.com/product/drone-fleet-management-and-operations-software-market/)
- [Custom Market Insights — Robot Fleet Management Software Market 2026–2035](https://www.custommarketinsights.com/report/robot-fleet-management-software-market/)
- [MarketsandMarkets — Israel UAV Market](https://www.marketsandmarkets.com/Market-Reports/geography/unmanned-aerial-vehicles-uav-market/israel)
- [MarketsandMarkets — Military Drone Market to 2030](https://www.globenewswire.com/news-release/2026/07/17/3329117/0/en/military-drone-uav-market-to-reach-usd-22-81-billion-by-2030-growing-at-7-6-cagr-says-marketsandmarkets.html)
- [MarketsandMarkets — Military Drone Market to 2031](https://www.prnewswire.com/news-releases/military-drone-market-worth-109-22-billion-by-2031---exclusive-report-by-marketsandmarkets-302779914.html)
- [Tracxn — Drone Startups in Israel](https://tracxn.com/d/explore/drones-startups-in-israel/__tSl4Ba8npVAfZK4DH3M3UvAr3_0NmHvrIwtVlhzvfpM)
- [Israel Innovation Authority — National Drone Initiative, second phase](https://innovationisrael.org.il/en/press_release/israels-national-drone-initiative-enters-second-phase/)
- [Israel Innovation Authority — National Drone Delivery Network Program](https://innovationisrael.org.il/en/programs/national-drone-delivery-network-program/)
- [C4IR Israel — Israel National Drone Initiative (INDI)](https://www.c4irisrael.org/israel-national-drone-initiative)
- [Unmanned Airspace — Israeli pilot programme tests BVLOS in GPS-denied environments (Yeruham)](https://www.unmannedairspace.info/uncategorized/israeli-pilot-programme-tests-drone-flights-in-gps-denied-environments-for-commercial-operations/)
- [Israel Innovation Authority — Startup Fund expansion for early-stage DeepTech (eff. 15 Jul 2026)](https://innovationisrael.org.il/en/press_release/startup-fund-updates/)
- [Jerusalem Post — Israel shifts toward 'Defense-Tech Nation' as start-ups surge to $3b in funding](https://www.jpost.com/defense-and-tech/article-902741)
- [Axis Intelligence — Drone Statistics 2026 (FAA registration & certification figures)](https://axis-intelligence.com/drone-statistics/)
- [Expanded Ramblings — Drone Statistics: US registrations, commercial fleet](https://expandedramblings.com/index.php/drone-statistics/)
- [EASA — Drones (UAS) FAQ](https://www.easa.europa.eu/en/the-agency/faqs/drones-uas)
- [Dronedesk — Drone Fleet Management Guide 2026 (pricing bands)](https://dronedesk.io/drone-fleet-management-guide)
- [DroneBundle — Drone Fleet Management Software Guide (pricing bands)](https://dronebundle.com/blog/drone-fleet-management-software-complete-guide-2025)
- [Capterra — DroneDeploy pricing ($329/$599 per user per year)](https://www.capterra.com/p/197016/DroneDeploy/pricing/) — **use this, not the competitor-published review**
- [PricingSaaS — DroneDeploy plan history](https://pricingsaas.com/companies/dronedeploy)
- [DroneDeploy — supported hardware](https://www.dronedeploy.com/product/supported-hardware)
- [RTE — GNSS jamming and spoofing in aviation, incl. Eastern Mediterranean](https://www.rte.ie/brainstorm/2026/0413/1567940-aviation-satellite-systems-jamming-spoofing-interference-disruption/)
- [GlobalAir — FAA flags global surge in GPS jamming and spoofing](https://www.globalair.com/articles/faa-flags-global-surge-in-gps-jamming-and-spoofing-updates-its-playbook/12178)
- [Airdata — FAA Part 108 Explained, 2026](https://airdata.com/blog/2026/part-108)
- [Drone Authority — Part 108 current BVLOS status, 2026](https://droneauthority.org/laws/part-108)
- [Israel drone laws / CAAI overview](https://drone-laws.com/drone-laws-in-israel/)
- [Jerusalem Post — IDF to buy thousands of FPV drones](https://www.jpost.com/defense-and-tech/article-893200)
- [Times of Israel — IDF FPV drone purchase from XTEND](https://www.timesofisrael.com/liveblog_entry/idf-to-buy-millions-of-dollars-worth-of-first-person-view-drones-from-xtend/)
- [Militarnyi — IDF purchases FPV attack drones for the first time](https://militarnyi.com/en/news/idf-purchases-fpv-attack-drones-for-the-first-time/)
- [Jerusalem Post — IDF in-house FPV drone production line](https://www.jpost.com/defense-and-tech/article-895890)
- [Janes — Elbit launches Lanius search-and-attack quadcopter](https://www.janes.com/defence-intelligence-insights/defence-news/air/elbit-launches-lanius-search-and-attack-quadcopter)
- [Breaking Defense — Israeli soldiers training on Firefly loitering munition](https://breakingdefense.com/2023/09/in-the-desert-with-the-israeli-soldiers-training-on-new-firefly-loitering-munition/)
- [Wikipedia — WB Electronics Warmate (unit-cost comparable)](https://en.wikipedia.org/wiki/WB_Electronics_Warmate)
- [Jerusalem Post — XTEND to trade on Nasdaq](https://www.jpost.com/defense-and-tech/article-886987)

*All figures retrieved August 2026. Market research estimates carry the definitional caveats in
§2.3; re-check before any figure is used in a funding conversation more than ~6 months from now.*
