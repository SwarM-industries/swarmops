export const VIEWBOX = { w: 1000, h: 620 };

export const DRONE_STATUS = {
  idle: { color: "#94a3b8", label: "Idle" },
  flying: { color: "#22d3ee", label: "Flying" },
  charging: { color: "#a78bfa", label: "Charging" },
  low_battery: { color: "#f5a524", label: "Low battery" },
};

export const MISSION_STATUS = {
  pending: { color: "#64748b", label: "Pending" },
  assigned: { color: "#a78bfa", label: "Assigned" },
  in_progress: { color: "#22d3ee", label: "In progress" },
  complete: { color: "#34d399", label: "Complete" },
};

export const NO_FLY_ZONE = {
  points: [
    [640, 90], [760, 70], [830, 140], [815, 230], [730, 260], [655, 210], [620, 150],
  ],
  label: "NO-FLY ZONE — restricted airspace",
};

export const DEPOT = { x: 110, y: 500, label: "Charging depot" };

export const DRONES = [
  {
    id: "D-01",
    status: "flying",
    battery: 78,
    speed: 62,
    payload: "camera",
    route: [[200, 160], [370, 120], [470, 230], [330, 320], [190, 280]],
  },
  {
    id: "D-02",
    status: "flying",
    battery: 54,
    speed: 48,
    payload: "parcel 2kg",
    route: [[560, 330], [700, 340], [640, 460], [520, 430]],
  },
  {
    id: "D-05",
    status: "low_battery",
    battery: 13,
    speed: 34,
    payload: "sensor pod",
    route: [[430, 470], [300, 500], [180, 495]],
  },
  {
    id: "D-03",
    status: "idle",
    battery: 92,
    payload: "—",
    pos: [160, 470],
  },
  {
    id: "D-04",
    status: "charging",
    battery: 35,
    payload: "—",
    pos: [DEPOT.x + 34, DEPOT.y + 10],
  },
  {
    id: "D-06",
    status: "idle",
    battery: 88,
    payload: "—",
    pos: [230, 555],
  },
];

export const MISSIONS = [
  { id: "M-101", status: "in_progress", priority: 4, pos: [470, 230], droneId: "D-01" },
  { id: "M-102", status: "pending", priority: 3, pos: [860, 400] },
  { id: "M-103", status: "assigned", priority: 5, pos: [700, 340], droneId: "D-02" },
  { id: "M-104", status: "complete", priority: 2, pos: [330, 320], droneId: "D-01" },
  { id: "M-105", status: "pending", priority: 5, pos: [780, 190] },
  { id: "M-106", status: "assigned", priority: 4, pos: [180, 495], droneId: "D-05" },
];
