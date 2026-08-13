# Real Hardware Integration — What It Actually Takes

**Status: planning, not built. Nothing in this document exists in the system today.**

This is Phase 1 of the commercial roadmap (`business/SwarmOps_Business_Overview_EN.md` §7). The
business documents claim real-aircraft integration is *"an engineering task with a clear path, not
a research risk"* — this is that path, written down so the claim is backed by something.

The capstone deliberately excluded real hardware (PRD §1.3). That boundary was the *academic
project's*, the capstone is finished, and it no longer applies — see `CLAUDE.md`. Build against
this document, not against the PRD's scope section.

Written August 2026. Prices and SDK support change fast — re-check before spending money.

---

## 1. The thing that makes this cheap: we already built the ingest surface

The Unity simulator track (M9.5) did something more valuable than it was scoped to do. It forced
`telemetry-service` to accept telemetry from **an external producer over the public gateway**,
and it forced a **vendor-agnostic video relay** to exist:

- **`POST /telemetry/events`** — schema-validated HTTP ingest, alongside the RabbitMQ consumer
  path, reached through the gateway's existing `/telemetry` route. Built for Unity. It does not
  care what is on the other end.
- **`telemetry-service/src/websocket/cameraFeed.ts`** — a deliberately protocol-agnostic
  broadcast relay. It does not parse what it forwards; per-drone tagging is a producer/consumer
  agreement. Built for Unity's `CameraFeedStreamer.cs`. Equally happy with H.264 from a real
  aircraft.

**Consequence:** a real drone is a *new producer*, not a change to the system. Nothing in
planning-service, notification-service, the frontend, or the data model needs to move. The
integration work is entirely in a new adapter that speaks vendor SDK on one side and our existing
`Telemetry event` schema (`drone_id, timestamp, position, battery_pct, event_type`) on the other.

That is the difference between "a clear path" and marketing copy, and it should be said out loud
in any technical conversation with an investor or a design partner.

---

## 2. Two capabilities, very different costs

Do not conflate these. They have different hardware requirements, different vendor dependencies,
and different value to a buyer.

| | **Overview** — see everything airborne | **Control** — command the fleet |
|---|---|---|
| What it gives | Position, identity, and (SDK paths only) battery/status/video | Upload and execute routes the optimizer produced |
| Vendor cooperation | None required for Remote ID | Required — Enterprise SDK only |
| Maps to | The airspace picture; the Filter B buyer; the 7 October failure | The optimizer's output actually flying |
| Cheapest path | ~$30 of hardware, weeks of work | One Enterprise aircraft, ~2–4 months |

**Overview is the product's differentiator and it is far cheaper to reach.** Build it first.

---

## 3. Overview — three paths, cheapest first

### 3.1 Remote ID receiver (ground-based, nothing touches the aircraft)

Every compliant drone broadcasts position, identity and operator location over Bluetooth/Wi-Fi
because regulation requires it. A ground receiver reads all of it, from every vendor, including
aircraft we neither own nor control.

- **Hardware:** ESP32 (~$10–30) for a DIY receiver — the protocol is an open industry standard and
  open-source decoders exist. Off-the-shelf alternatives: **Dronetag RIDER** (drone-agnostic,
  reads DJI/Autel/Parrot, up to ~5 km), **DroneScout** (open source, no fees, root access).
- **Software:** decoder → normalize to our `Telemetry event` shape → `POST /telemetry/events`.
  Same producer contract Unity already uses.
- **Effort:** weeks.
- **Gives:** position + identity, any brand, no SDK, no vendor deal, no ownership of the aircraft.
- **Does not give:** battery, payload, mission state, or any control. The battery-feasibility
  engine stays SDK-dependent.

**Why this matters strategically:** the buyer our business documents describe — the commander or
site manager accountable for the airspace who *owns none of the aircraft* — is reachable with
this alone. No vendor integration required to serve them.

**Limits, stated honestly:**
- Range ~1–5 km line of sight. Fine for a base, a site, or an installation. Useless for a national
  picture without dense receiver deployment.
- Military aircraft can and do disable Remote ID.
- Custom-built FPV drones often broadcast nothing at all — which cuts directly against the
  12,000-unit FPV tender that is our best market evidence.
- **Israel's Remote ID mandate status is unverified.** FAA and EASA require it; we have not
  confirmed the Israeli position. **This determines whether the path works here at all — check
  with CAAI before building on it.** (See §8.)

### 3.2 App on the controller (preferred SDK path)

DJI's **RC Pro / RC Plus / Smart Controller are Android devices.** An Android app built on
**Mobile SDK v5** runs on the controller itself — or on a phone tethered to it — reads the full
telemetry stream, and pushes it to our backend over Wi-Fi/LTE.

- **Hardware attached to the aircraft: none.** This is the whole appeal.
- **Constraint, not a preference: Android only.** DJI abandoned the iOS Mobile SDK entirely.
- **Effort:** 1–2 months.
- **Gives:** position, battery, status, aircraft state — and video (§5).
- **Aircraft:** DJI Enterprise line only (see §6).

Architecturally this is the same shape as Unity's Stage 4 two-machine setup: an external producer
POSTing over HTTPS to the public gateway. That path is already designed, including the note that
the ingest endpoint needs auth before it is internet-facing.

### 3.3 Companion computer on the aircraft (Payload SDK)

Raspberry Pi or Jetson on the drone's payload port, reading telemetry over serial via DJI's
**Payload SDK**, pushing out over its own link.

- Requires a **Matrice-class aircraft with a real payload port** (M30/M300/M350). The Mavic 3E
  cannot do this properly.
- **$10K+ of aircraft for telemetry we can get free from the controller.**
- **Verdict: skip.** Revisit only if a customer needs onboard autonomy or processing that must
  survive loss of the controller link — which is a Phase 2+ contested-environment question, not a
  Phase 1 integration question.

**Arduino is not a candidate for any of this.** No usable SDK stack, insufficient compute. The
Pi's only role is the PSDK path above or as a ground-side Remote ID box; an ESP32 is the correct
and cheaper chip for the receiver.

---

## 4. Control — commanding the fleet

**Through the same controller app.** MSDK v5 supports **WaypointV3 missions**: upload a route,
execute it. That is genuine command authority with no modification to the aircraft.

- **Effort:** +1–2 months on top of telemetry.
- **Aircraft:** DJI Enterprise only.
- **This is the step where the optimizer stops being a planner and starts being a controller** —
  the demo where a plan computed by `planning-service` is flown by a real aircraft.

**Autel** works the same way through their Enterprise SDK, but access is gated: expect an
application/approval process and materially thinner documentation and community than DJI. Budget
extra time and treat approval as a real risk, not a formality.

**The easiest control target is the one nobody expects.** A unit building its own FPV drones — as
the 12,000-unit tender implies — can run **ArduPilot or PX4, speaking MAVLink**, which is fully
open. Complete command authority, no vendor gatekeeper, no SDK approval. If a design partner
builds their own airframes, integrate them *first*, not last.

---

## 5. Video

Separate pipeline from telemetry. Joined only in the UI, by `drone_id` — same model the Unity
camera feed already uses.

- **DJI:** `LiveStreamManager` in MSDK v5 pushes RTMP to a URL we specify. Alternatively the raw
  H.264 callback (`VideoFeeder` / video-data listener) for frame-level control.
- **Autel:** equivalent live-push module on EVO Max / Enterprise.
- **Our side:** either point the vendor's RTMP push at a self-hosted **MediaMTX** instance (one
  ingest URL per `drone_id`, which re-serves as WebRTC to the frontend), or decode in the adapter
  and feed frames into the **existing `cameraFeed.ts` WebSocket relay** exactly as
  `CameraFeedStreamer.cs` does.

The second option reuses infrastructure that is already built, tested, and hardened (role-aware
broadcast, backpressure ceiling, staleness detection). Prefer it unless per-drone latency or
scale demands a real media server.

---

## 6. Aircraft compatibility

| Aircraft | Overview | Control | Notes |
|---|---|---|---|
| **DJI Mavic 3E / 3T** | ✅ MSDK v5 | ✅ Waypoints | **Best entry point.** ~$3,899. Same SDK surface as Matrice |
| DJI Matrice 30 / 30T | ✅ MSDK + PSDK | ✅ Full | ~$9,800. Buys nothing over the 3E for our purposes |
| DJI M300 / M350 RTK | ✅ MSDK + PSDK | ✅ Full | Payload port, onboard compute possible |
| **Autel EVO Max 4T** | ✅ Autel SDK (gated) | ✅ | ~$8,999. Second-vendor proof. Defer or borrow |
| Autel EVO II Enterprise | ✅ Autel SDK (gated) | ✅ | Cheaper Autel entry |
| **DJI Mini / Air / Avata / FPV** | ⚠️ **Remote ID only** | ❌ **None** | No dependable SDK. Do not plan around it |
| **Custom ArduPilot / PX4 FPV** | ✅ MAVLink | ✅ Full | **Easiest of all.** Open protocol, no gatekeeper |

**The consumer tier is closing, not opening.** DJI retired support for 100+ products, killed the
iOS SDK, and gave the Mini 3 series Android-only support. **Autel exited consumer drones
entirely.** Any plan that depends on consumer aircraft being programmable is a plan with an
expiry date.

---

## 7. What to build, in order — and what it costs

| Step | What | Hardware | Effort |
|---|---|---|---|
| **1** | Remote ID receiver → `POST /telemetry/events` → live map | ESP32, ~$30 | Weeks |
| **2** | Android app on a DJI RC → telemetry into the live map | 1 × Mavic 3E, ~$3,899 + an Android device | 1–2 months |
| **3** | Video from the same aircraft into the existing relay | none extra | 2–4 weeks |
| **4** | WaypointV3 upload — the optimizer's plan actually flies | none extra | 1–2 months |
| **5** | Autel adapter | EVO Max ~$8,999 (borrow if possible) | Gated on SDK approval |
| **6** | MAVLink adapter | none, if a partner builds their own | Weeks |

**Total hardware through step 4: one Mavic 3E, one ESP32, an Android device we likely already
own — roughly $4,000.**

That is the number worth carrying into a funding conversation: **~$4K and about four months
separates a simulated fleet from a real one flying an optimizer-generated plan.** The reason it
is that small is §1 — the ingest surface already exists.

Order rationale: step 1 is the cheapest possible proof of the capability that differentiates us
and needs no vendor's permission. Steps 2–4 prove the full loop on one real aircraft. Step 5 is
deferred because SDK approval is outside our control and a single-vendor proof is enough to sign
a design partner. Step 6 is opportunistic — if the partner builds their own airframes it may
become step 2.

---

## 8. Open questions — resolve before committing money

1. **Does Israel mandate Remote ID, and in what form?** Determines whether §3.1 — the cheapest and
   most strategically valuable path — works here at all. **Ask CAAI.** Highest-value unknown in
   this document.
2. **Do the units we would sell to disable Remote ID as standard practice?** If yes, the ground
   receiver reaches civilian and site-security customers only, and the defense pitch depends
   entirely on the SDK path.
3. **What do the FPV aircraft in the 12,000-unit tender actually run?** If ArduPilot/PX4, control
   is easy and open. If a closed vendor stack (Xtend and similar), it is a per-vendor negotiation.
   This single fact changes the difficulty of our best market opportunity by an order of magnitude.
4. **Autel Enterprise SDK access** — what is the approval process, how long, and are there terms
   that conflict with a vendor-neutral product?
5. **Does the ingest endpoint have auth yet?** Flagged in `UNITY_SIMULATOR_PLAN.md` Stage 4 as
   required before the endpoint is internet-facing, and still open. A real-aircraft producer makes
   this urgent rather than theoretical.
6. **Flight permissions and insurance for our own test flights in Israel** — CAAI operator
   licensing, where we are allowed to fly, and liability cover. Budgeted in the business plan; not
   yet investigated.

---

## 9. What this does *not* change

- **The data model is the constraint, not the scope section.** PRD §6/§7 (data models, API
  surface) remain authoritative; §1.3's non-goals do not.
- **The data model does not move.** A real aircraft produces the same `Telemetry event` shape a
  simulated one does. If an adapter wants to change that shape, that is a cross-team contract
  change and goes through the process in `CLAUDE.md`, not into a vendor adapter quietly.
- **The simulator does not go away.** It stays the way the system is developed and demoed without
  flying anything, and it remains the only way to exercise fleet sizes we will never own.

---

## Sources

Prices and SDK support verified August 2026 and volatile — re-check before purchase.

- DJI Mobile SDK v5 — supported products, Android-only status: [developer.dji.com/mobile-sdk](https://developer.dji.com/mobile-sdk/), [MSDK V5 supported products](https://sdk-forum.dji.net/hc/en-us/articles/25552010279961-What-devices-does-Mobile-SDK-V5-support)
- DJI iOS SDK discontinued: [DroneDJ](https://dronedj.com/2023/11/30/dji-ios-sdk-android-app/)
- DJI end-of-service for 100+ products: [Heliguy](https://www.heliguy.com/blogs/posts/dji-hardware-end-of-service-announcement/)
- Autel exiting consumer drones: [TechRadar](https://www.techradar.com/cameras/drones/another-dji-rival-bites-the-dust-autel-quits-consumer-drones-heres-what-you-need-to-know)
- Remote ID receivers, vendor-agnostic: [Dronetag RIDER](https://www.dronetag.com/products/rider), [DroneScout](https://dronescout.co/dronescout-remote-id-receiver/)
- Remote ID broadcast mechanics: [FAA Remote ID guide](https://rotatepilot.com/guides/remote-id-guide)
- Aircraft pricing: [DJI Mavic 3 Enterprise](https://dronerater.com/dji-mavic-3-enterprise-price/), [DJI vs Autel enterprise comparison 2026](https://globaldronehq.com/blogs/news/dji-vs-autel-enterprise-drones-complete-2026-comparison)

**Internal references:** `UNITY_SIMULATOR_PLAN.md` (the producer contract and Stage 4 two-machine
setup this reuses) · `milestones.md` 2026-08-13f (what the camera pipeline actually does) ·
`business/SwarmOps_Business_Overview_EN.md` §7 (Phase 1) · `business/SwarmOps_Market_Sizing.md`
§3.1 (why the overview capability matters more than control).
