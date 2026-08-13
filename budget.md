# Phase 1 Budget — What It Actually Costs to Fly Real Aircraft

**Working document, August 2026. Not yet reflected in the business documents** — the one-pager
currently says $40K and the overview says `[amount]`, both of which this supersedes. See §6 for
what needs changing before either goes out.

Companion to `actual_prod.md` (the technical plan this budget funds). Figures are Israeli-market
where a source exists; every estimate is marked.

---

## 1. The headline

**Roughly $10,500 buys the Phase 1 milestone** — several real aircraft tracked live in the control
room — and **~$17,000** adds an SDK-capable aircraft so the optimizer can actually command a
flight.

Earlier drafts of this budget said $35–45K. That was wrong in five places, each of them padding
rather than a real cost. Corrections in §4.

---

## 2. Two versions

### 2.1 Cheap start — the airspace picture, three real aircraft

| Line | Cost | Source |
|---|---|---|
| DJI Neo 2 Fly More Combo | ₪1,399 (~$378) | Israeli retail |
| DJI Mini 4 Pro | ₪2,899 (~$780) | Israeli retail |
| DJI Avata 2 + Goggles Integra | ₪3,499 (~$945) | Israeli retail |
| ESP32 Remote ID receiver + parts | ~$30 | — |
| AWS / EKS, 12 months | $1,500 | Estimated, see §4.1 |
| Incorporation: registrar ₪2,611 + lawyer + agreements | $3,000 | Registrar fee sourced; lawyer estimated |
| CAAI commercial licence, one operator | $800 | Sourced, §3 |
| Third-party liability insurance, 12 months | $950 | Sourced, §3 |
| Bookkeeping, 12 months | $1,200 | Estimated |
| Contingency 10% | $950 | — |
| **Total** | **≈ $10,500** | |

**What this proves:** three independently-controlled aircraft flying at once, all visible in one
live picture, tracked by Remote ID with **no vendor SDK, no integration deal, and no aircraft we
control.** That is the Filter B demo — the commander who owns none of the aircraft — and it is
the capability the business documents call the differentiator.

**What it does not prove:** that we can command an aircraft. Remote ID is read-only.

### 2.2 With command — add one SDK-capable aircraft

| Line | Cost |
|---|---|
| Everything in 2.1 | $10,500 |
| DJI Mavic 3 Enterprise (Israeli retail incl. VAT) | ~$6,000 |
| Additional contingency | ~$600 |
| **Total** | **≈ $17,000** |

Adds: full telemetry via Mobile SDK v5 on the controller, live video into the existing relay, and
**WaypointV3 upload — a route computed by `planning-service` flown by a real aircraft.**

---

## 3. Sourced Israeli figures

**CAAI commercial drone licence (up to 25 kg), per person:**

| | |
|---|---|
| Preparation course | ₪890–2,490 |
| Examination fee | ₪420 |
| Licence fee | ₪770 |
| Drone registration | ₪30 |
| **Total** | **₪2,110–3,710 (~$570–1,000)** |

One licensed operator is enough to begin. Three of the four founders were IDF drone operators;
that experience does not transfer to civil licensing automatically, but it should make the course
and exam straightforward.

**Third-party liability insurance:** mandatory under CAAI rules for every commercial flight —
this is not optional and not something to defer. **~$950/year** for urban operation, varying by
insurer.

**Company registration:** ₪2,611 to the Corporations Authority. Lawyer ₪5,000–20,000 depending on
scope; a four-founder company with templated agreements sits at the low end.

**Aircraft:** consumer prices are Israeli retail as listed by local sellers. Mavic 3 Enterprise is
$4,599–4,950 in the US; Israeli distribution through Benda adds VAT, so budget ₪20,000–24,000.

---

## 4. What was wrong in the earlier $35–45K version

Recorded because the same padding will creep back otherwise.

1. **AWS at $6–8K.** EKS control plane is $73/month; two small nodes and an ALB put continuous
   operation at $150–250/month, and the cluster is already torn down between sessions. **Real:
   $1,000–2,500/year — plausibly $0**, since AWS Activate gives startups $1K–100K in credits and
   this project qualifies.
2. **CAAI licensing at $3–6K.** Actual published fees total ₪2,110–3,710 per person (§3). **Real:
   ~$800.**
3. **Insurance at $2–4K.** Mandatory, but **~$950**.
4. **Accounting at $3–5K.** Pre-revenue, no payroll, nothing to reconcile. **Real: ~$1,200**, and
   deferrable.
5. **Contingency at 15%.** Padding on a budget this small and this well-understood. **10%.**

One line moved the other way: **the Mavic 3 Enterprise is more expensive than assumed** —
$4,599–4,950 in the US, ~$6,000 in Israel with VAT, against the $3,899 used earlier.

**Also wrong: the hardware itself.** Earlier drafts budgeted Pixhawk/PX4 development kits. The
Israeli market flies DJI and Autel; MAVLink matters for custom airframes and for export, not for
the beachhead. See `actual_prod.md` §6.

---

## 5. Why the cheap version is the better demo

Counter-intuitive but worth stating: **three cheap aircraft beat one expensive one at this stage.**

- One Mavic 3E demonstrates *control of a drone*. Impressive, but it is what a manufacturer's own
  app already does.
- Three aircraft flying simultaneously, from different controllers, all in one picture,
  demonstrates *coordination between separately-controlled aircraft* — which is the thing nobody
  sells and the whole argument of the business documents.

The second demo costs about a third as much and lands the differentiator rather than the feature.

---

## 6. What this means for funding — and for the business documents

**At $10.5K, this is not a funding round.** It is an amount four founders can cover between them,
or one small grant, or a modest equipment contribution from an institution. That changes the ask
materially:

- **We do not need the college's money.** We need their letter of support, their space, and their
  introductions — all of which they can actually give.
- **The pre-seed conversation moves after the milestone, not before it.** $10.5K and roughly four
  months produces a demonstrable multi-aircraft picture; raising against that is a different
  conversation from raising against a plan to build it.
- **A pre-seed round remains ~$200–250K**, and its purpose is founder salaries and a first paid
  design partner — not hardware. Say so plainly; "we need money for drones" invites the obvious
  question of why so little.

**Changes still needed in the business documents (none applied yet):**

1. **One-pager §07** says **$40K now**. Should be ~$12K (cheap start plus buffer) or ~$18K (with
   the SDK aircraft). The current figure is 3–4× the real cost and would not survive a question.
2. **Overview §9** still reads as a college ask — incubation, mentorship, industry introductions,
   `[amount]` — and still says *"2–3 development drones and autopilot kits"*, which is the
   corrected Pixhawk assumption. Both need rewriting for an investor audience.
3. **Overview §3.5 and §7** describe real-aircraft integration *"via the MAVLink protocol, the
   de-facto standard supported by most commercial autopilots."* True generally, wrong for this
   market: DJI and Autel are closed and require their own SDKs. `actual_prod.md` has the accurate
   version.
4. **Remote ID appears in no business document**, and it is arguably the most commercially
   significant technical finding we have: the airspace-owner buyer can be served with **no vendor
   integration at all**. That belongs in the differentiation section, not buried in a technical
   plan.

---

## Sources

- CAAI licence fees and course costs: Israeli drone-training providers (TAKE-FPV, PREFLIGHT,
  BetterFly Academy) and [gov.il commercial drone licence service](https://www.gov.il/he/service/request-for-parachute-license)
- Third-party liability insurance requirement and cost: [AirWorks — licensing and insurance](https://www.airworks.co.il/license)
- Israeli drone law overview 2026: [TAKE-FPV](https://takefpv.co.il/%D7%97%D7%93%D7%A9%D7%95%D7%AA/drone-laws-israel-2026)
- Mavic 3 Enterprise pricing: [DroneFly](https://www.dronefly.com/products/dji-mavic-3e), [Global Drone HQ](https://globaldronehq.com/products/dji-mavic-3-enterprise); Israeli distributor [Benda DJI Store](https://www.djistore.benda.co.il/product/mavic-3-enterprise-m3e/)
- Consumer aircraft prices: Israeli retail listings, August 2026
- Company registration fee: Israeli Corporations Authority, ₪2,611 (2026)
