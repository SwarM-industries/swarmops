# Unity Drone Simulator — Side-Track Plan

**Status:** proposed side track, not part of `plan.md`'s phases. Guy signed off on Stage 0
(2026-07-26) — not built yet, just approved. Still needs Valfish's sign-off on Stage 2/4 before
any of that gets built. Do not merge anything from this track into the org repos (`swarmops-*`)
until then, and even after — stays a side branch until the team agrees it should be permanent.

**Goal:** replace/augment `swarmops-drone-simulator` with a Unity-driven simulator for demo
purposes — better visuals + live camera feed than the Node/TS simulator, without changing any
downstream contract (RabbitMQ schema, planning-service, notification-service, frontend).

**Build order — locked:** data transmission first, graphics second. Do not spend time on scene
art, drone models, or camera work until Stage 1 (plain telemetry flowing end-to-end) is proven.

---

## Why this is safe to try

`telemetry-service` only cares about the `Telemetry event` schema
(`drone_id, timestamp, position, battery_pct, event_type`) arriving via RabbitMQ — it doesn't
care what produces it. As long as Unity emits that same schema, swapping producers is a
producer-level change only. Confirmed via grep: PRD/plan.md have zero mentions of
camera/video anywhere, so the camera piece is pure addition, not a schema change.

**Non-goal check:** PRD §1.3 excludes real hardware integration. This track stays simulated data
end to end (Unity is a fake fleet, same spirit as the existing Node simulator) — it does not
cross into real-drone territory. Keep it that way.

---

## Stages

### Stage 0 — generic ingest endpoint (do this regardless of Unity)
- Add `POST /telemetry/events` on `telemetry-service`: schema-validated HTTP route, alongside
  the existing RabbitMQ-consumer path.
- Reached only through the gateway's existing `/telemetry` route — never a direct
  Ingress/ALB rule to `telemetry-service`. Gateway stays the single externally reachable thing,
  same as every other service; this endpoint doesn't get an exception.
- Purpose: any external producer (Unity, a phone bridge, a real drone later) can feed telemetry
  in without needing a native AMQP client.
- Owner note: this is Guy's repo — raise before touching it, even on a branch.

### Stage 1 — data-only proof (no graphics yet)
- Minimal Unity scene: one placeholder object (cube/capsule is fine), simple script driving
  position over time + a fake battery-drain value.
- Script POSTs telemetry JSON to the Stage 0 endpoint on an interval.
- Validate the full existing pipeline reacts unchanged: RabbitMQ → planning-service re-plan →
  frontend SVG grid map update via WebSocket.
- Done when: SwarmOps frontend shows a drone moving, driven entirely by Unity, with zero changes
  to planning-service, notification-service, or frontend code.

### Stage 2 — camera feed (only after Stage 1 works)
- Attach a `Camera` to the drone object, render to a `RenderTexture`.
- Encode frames (JPEG) and push over a separate WebSocket — not RabbitMQ, wrong tool for video.
- New small frontend panel to display the feed. Purely additive; existing telemetry contract
  untouched.
- Stretch: swap MJPEG-over-WebSocket for Unity's WebRTC package if latency/quality matters more
  than build simplicity.

### Stage 3 — simple graphics polish
- Only after Stage 1 (and optionally Stage 2) work end-to-end: swap placeholder shapes for a
  simple drone model/terrain. Keep scene lightweight — this is a demo aid, not a game.

### Stage 4 — two-machine demo setup
- Machine A (presenter): loads the SwarmOps frontend URL (served publicly via the Phase 4/5 AWS
  deployment) — this is the "real product" view.
- Machine B (Unity): runs the simulator, POSTs telemetry over HTTPS to the public gateway's
  `/telemetry/events` route on AWS (Stage 0's endpoint, reached through the same ALB → gateway
  path everything else uses — not a separate ALB rule direct to `telemetry-service`). No direct
  connection between A and B — both talk to AWS independently, same as real users would.
- Requirements before demo day:
  - Stage 0 endpoint reachable via the existing gateway route on the public ALB/Ingress — no new
    Ingress rule, no ClusterIP-only exception.
  - Add lightweight auth (API key or short-lived token from `auth-service`) on that endpoint
    once it's open to the internet — it currently trusts the in-cluster simulator implicitly.
  - TLS reused from whatever cert already terminates the frontend's HTTPS.
  - Test Machine B's network path (hotspot/venue WiFi) ahead of time, not live on demo day.
- Hardware: MacBook Air M4 confirmed sufficient for Machine B at this scene complexity —
  no dedicated GPU needed, WiFi 6 is fine for the telemetry POST rate involved.

---

## Team coordination checklist (do before Stage 0 touches any org repo)

- [x] Raise with Guy: Stage 0 endpoint addition to `telemetry-service`, confirm it doesn't
      collide with his Phase 3 WebSocket/map work. **Approved (2026-07-26)** — doesn't collide,
      Stage 0 not built yet though, just signed off on.
- [ ] Raise with Valfish: Stage 2/4 frontend panel addition, confirm timing vs Phase 3/4 frontend
      work.
- [ ] Confirm this stays a side branch / demo-only addition, not merged into `main` of any
      org repo until the team agrees it should be permanent.
- [ ] Re-check PRD §1.3 non-goals if scope ever drifts toward real hardware — it shouldn't.
