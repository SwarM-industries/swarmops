# SwarmOps — Product Requirements Document

**Drone Fleet Mission Planning & Route Optimization Platform**

Version 1.0 · Capstone Project

---

## 1. Overview

SwarmOps is a system for planning, assigning, and monitoring missions across a fleet of drones. Given a set of missions (surveillance, delivery, or inspection tasks) and a pool of drones with limited battery, speed, and payload capacity, SwarmOps automatically computes the optimal assignment of drones to missions and the most efficient routes — while respecting battery constraints, no-fly zones, and mission priority — and adapts in real time as conditions change.

### 1.1 Problem statement

Coordinating a fleet of drones against a changing set of missions is a constrained optimization problem, not a scheduling checklist. A human dispatcher juggling more than a handful of drones and missions cannot reliably account for battery limits, payload requirements, priority conflicts, and mid-mission failures at the same time. Manual assignment leads to wasted flight time, missed deadlines on urgent missions, and drones stranded without enough charge to return.

### 1.2 Goals

- Automatically assign drones to missions based on priority, deadline, payload fit, and battery feasibility.
- Compute efficient routes per drone, including multi-stop routes where applicable.
- Detect and resolve conflicts (e.g., two urgent missions competing for the same drone).
- Re-plan in real time when conditions change (new mission arrives, a drone's battery drains faster than predicted, a drone goes offline).
- Visualize the entire fleet and mission state on a live map.
- Demonstrate this as a small but realistic distributed system: multiple services, a real optimization core, event-driven telemetry, and production-style deployment infrastructure.

### 1.3 Non-goals

- Real hardware integration (this project uses simulated drones and telemetry).
- Full air-traffic-control-grade collision avoidance (a simplified no-fly-zone and route-conflict check is in scope; full 3D trajectory deconfliction is not).
- Multi-tenant / multi-organization support — single fleet, single operations team.

---

## 2. Users & personas

| Persona | Description | Needs |
|---|---|---|
| Mission planner / dispatcher | Creates missions, monitors the fleet, resolves conflicts the system flags | Clear view of pending/assigned missions, ability to override assignments |
| Fleet operator | Manages drone inventory, maintenance status, availability | Visibility into battery/maintenance state, ability to take drones offline |
| Observer / commander | Wants a high-level readiness and completion view | Dashboards: fleet utilization, mission completion rate, active alerts |

---

## 3. System architecture

Polyrepo, Kubernetes-native architecture, consistent with the base capstone stack.

### 3.1 Services

| Service | Responsibility | Datastore |
|---|---|---|
| `auth-service` | Login, JWT issuance, role-based permissions (planner / operator / admin) | MongoDB |
| `fleet-service` | Drone inventory: position, battery %, speed, payload capacity, status (idle / flying / charging / maintenance) | MongoDB |
| `mission-service` | Mission definitions: targets, priority, deadline, required payload/sensor type, status | MongoDB |
| `planning-service` | Core optimization engine: assigns drones to missions, computes routes, re-plans on events | MongoDB |
| `telemetry-service` | Ingests simulated drone position/battery events, publishes to the message bus, feeds live tracking | MongoDB (recent history) |
| `notification-service` | Alerts operators of conflicts, mission completions, low-battery events | — (stateless) |

### 3.2 Supporting infrastructure

- **Gateway:** NGINX, routing `/auth`, `/fleet`, `/missions`, `/planning`, `/telemetry`, `/notifications`.
- **Frontend:** React/Vite SPA with a live map view (see Section 5).
- **Message bus:** Kafka (or RabbitMQ) between `telemetry-service` and `planning-service` for event-driven re-planning, and between `planning-service` and `notification-service` for alerts.
- **Drone simulator:** a lightweight worker that "flies" each drone along its assigned route at a realistic speed, emitting telemetry events on a timer, with configurable random variance (simulating wind, sensor noise) to trigger re-planning.

### 3.3 Infrastructure & delivery pipeline

- **Packaging:** Helm chart per service.
- **Provisioning:** Terraform (VPC + EKS via public modules), state managed in Terraform Cloud.
- **CI:** GitHub Actions, OIDC-based auth to AWS (no static keys), build and push images to ECR.
- **CD:** Argo CD, GitOps-based sync from a deployments repo.
- **Observability:** kube-prometheus-stack (metrics, alerting), Loki + Alloy (logs).
- **Required extension:** Argo Rollouts (canary deployments), applied specifically to `planning-service` — the highest-risk, most frequently iterated service, since it hosts the optimization algorithm.

---

## 4. Core algorithm

### 4.1 Problem formulation

A variant of the Vehicle Routing Problem with Time Windows (VRPTW), where vehicle capacity is replaced by battery range — a constraint that depends dynamically on distance flown and payload weight rather than a fixed value.

**Inputs:** N drones (position, battery %, speed, payload capacity, status), M missions (target location(s), priority, deadline, required payload type, estimated duration).

**Output:** An assignment of missions to drones, an ordered route per drone, and a feasibility check confirming each drone can complete its route and return (or reach a charging point) without running out of battery.

### 4.2 Implementation phases

1. **Greedy baseline:** For each mission (sorted by priority then deadline), assign the nearest available, capable drone with sufficient battery.
2. **Optimized assignment:** Formulate as a weighted bipartite matching problem (e.g., Hungarian algorithm) minimizing total travel distance plus an urgency penalty.
3. **Route solving:** For drones with multiple stops, solve a per-drone routing problem (small TSP instance), optionally using Google OR-Tools' routing solver for realistic constraint handling.
4. **Battery-aware feasibility:** Simulate battery drain along each candidate route; reject or insert a charging stop if a route would leave a drone stranded.
5. **Real-time re-planning:** On new telemetry or mission events, re-solve affected portions of the schedule rather than the whole fleet where possible.

### 4.3 Conflict handling

When two missions of competing priority require the same resource (drone or equipment) in an overlapping window, `planning-service` resolves in favor of the higher-priority/earlier-deadline mission and either reschedules or flags the lower-priority mission as unresolved, notifying the dispatcher via `notification-service`.

---

## 5. Visual interface

### 5.1 Live fleet map

The centerpiece of the frontend: a map showing real-time fleet and mission state.

- **Drone markers**, color-coded by status: idle, flying, charging, low battery.
- **Mission markers**, color-coded by status: pending, assigned, in progress, complete.
- **Planned routes** drawn as lines/paths from each drone to its ordered mission stops.
- **No-fly zones** shown as shaded regions the router avoids.
- **Live movement:** drone positions update on the map as telemetry events stream in via WebSocket.
- **Status strip:** compact summary bar showing each active drone's state and battery level, plus a legend.

### 5.2 Other views

- **Mission board:** list/kanban of missions by status, with priority and deadline visible; create/edit missions here.
- **Fleet inventory:** drone list with battery, maintenance status, certification/payload compatibility; ability to take a drone offline.
- **What-if simulator:** a panel where a planner can simulate losing a drone or adding an urgent mission and preview the re-solved schedule without committing it.
- **Operations dashboard (Grafana):** fleet utilization over time, average battery efficiency, mission completion rate, algorithm solve time, conflict rate.

---

## 6. Data models (representative)

**Drone**
```
id, name, status, position {lat, lng}, battery_pct,
max_range_km, speed_kmh, payload_capacity_kg, current_payload_type
```

**Mission**
```
id, priority (1-5), deadline, target_locations [ ],
required_payload_type, estimated_duration_min, status
```

**Plan**
```
id, drone_id, mission_ids [ordered], route [waypoints],
estimated_battery_at_completion, status
```

**Telemetry event**
```
drone_id, timestamp, position, battery_pct, event_type
```

---

## 7. API surface (representative)

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/missions` | Create a mission |
| GET | `/missions?status=pending` | List missions by status |
| GET | `/fleet/drones?status=idle` | List available drones |
| POST | `/planning/solve` | Trigger a full re-plan |
| GET | `/planning/plans/{drone_id}` | Current plan for a drone |
| POST | `/planning/simulate` | What-if simulation (non-committing) |
| POST | `/telemetry/ingest` | Simulated drone reports position/battery |

---

## 8. Success metrics

- **Assignment quality:** total distance / flight time versus a naive greedy baseline.
- **Feasibility:** zero drones stranded (battery-infeasible routes) in simulation runs.
- **Responsiveness:** time to re-solve after a disruptive event (new urgent mission, battery anomaly).
- **System reliability:** successful GitOps deploys via Argo CD; canary rollouts on `planning-service` complete without manual rollback in the demo.
- **Observability completeness:** Grafana dashboards reflect live fleet state with no more than a few seconds of lag from telemetry ingestion.

---

## 9. Build phases / roadmap

1. **Foundation:** all five services scaffolded, talking over the gateway; basic CRUD for drones and missions; greedy assignment algorithm; static map showing current state.
2. **Optimization core:** replace greedy assignment with matching/OR-Tools-based solver; add battery-aware route feasibility checks.
3. **Live system:** drone simulator + telemetry-service + message bus; live map updates via WebSocket; re-planning triggered by telemetry/mission events.
4. **Infrastructure:** Helm charts, Terraform (VPC/EKS), GitHub Actions CI with OIDC, Argo CD GitOps, kube-prometheus-stack + Loki/Alloy observability.
5. **Extension & polish:** Argo Rollouts canary on `planning-service`, what-if simulator, algorithm performance dashboards, final demo scenarios.

---

## 10. Open questions

- Map rendering: real-world Leaflet map with lat/lng vs. a simplified abstract grid — trade-off between realism and build time.
- Message bus choice: Kafka (heavier, more "production") vs. RabbitMQ (lighter, faster to stand up).
- Solver choice: hand-rolled Hungarian algorithm vs. OR-Tools — affects both implementation time and how deep the "algorithm story" goes in the final defense.
