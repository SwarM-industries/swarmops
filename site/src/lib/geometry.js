function dist(a, b) {
  return Math.hypot(b[0] - a[0], b[1] - a[1]);
}

/**
 * Places a point along a closed loop of waypoints given total distance
 * traveled (px), looping forever. Returns position + heading angle (deg)
 * so a marker can visibly orient toward its direction of travel.
 */
export function pointOnLoop(waypoints, traveled) {
  const segLens = waypoints.map((p, i) => dist(p, waypoints[(i + 1) % waypoints.length]));
  const total = segLens.reduce((a, b) => a + b, 0);
  let d = traveled % total;
  if (d < 0) d += total;

  for (let i = 0; i < waypoints.length; i++) {
    const segLen = segLens[i];
    if (d <= segLen || i === waypoints.length - 1) {
      const a = waypoints[i];
      const b = waypoints[(i + 1) % waypoints.length];
      const t = segLen === 0 ? 0 : d / segLen;
      const x = a[0] + (b[0] - a[0]) * t;
      const y = a[1] + (b[1] - a[1]) * t;
      const angle = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
      return { x, y, angle };
    }
    d -= segLen;
  }
  const [x, y] = waypoints[0];
  return { x, y, angle: 0 };
}

export function pathD(points) {
  return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ");
}
