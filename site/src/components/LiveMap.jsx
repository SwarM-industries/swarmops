import { useMemo, useRef, useState } from "react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { useNow } from "../hooks/useNow";
import { pointOnLoop, pathD } from "../lib/geometry";
import { VIEWBOX, DRONE_STATUS, MISSION_STATUS, NO_FLY_ZONE, DEPOT, DRONES, MISSIONS } from "../lib/mapData";

export default function LiveMap() {
  const now = useNow(50);
  const startRef = useRef(now);
  const elapsedSec = (now - startRef.current) / 1000;

  const [selected, setSelected] = useState({ type: "drone", id: "D-01" });

  const dronePositions = useMemo(() => {
    const map = {};
    for (const d of DRONES) {
      if (d.route) {
        const { x, y, angle } = pointOnLoop(d.route, elapsedSec * d.speed);
        map[d.id] = { x, y, angle };
      } else {
        map[d.id] = { x: d.pos[0], y: d.pos[1], angle: 0 };
      }
    }
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Math.floor(elapsedSec * 20)]);

  const selectedEntity = useMemo(() => {
    if (selected.type === "drone") return DRONES.find((d) => d.id === selected.id);
    return MISSIONS.find((m) => m.id === selected.id);
  }, [selected]);

  return (
    <section id="map" className="relative py-28 md:py-36 border-t border-[color:var(--border-soft)]">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <SectionHeading
          eyebrow="Live interface"
          title="The fleet map — the centerpiece of the frontend."
          description="Drone and mission markers, planned routes, and no-fly zones update live as telemetry streams in over WebSocket. This is a working mock with simulated positions — click a marker to inspect it."
        />

        <Reveal className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-panel)] overflow-hidden">
          <div className="relative">
            <svg
              viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`}
              className="w-full h-auto block"
              style={{ background: "#080c14" }}
            >
              <defs>
                <pattern id="mapgrid" width="32" height="32" patternUnits="userSpaceOnUse">
                  <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(255,255,255,0.045)" strokeWidth="1" />
                </pattern>
                <pattern id="nofly-hatch" width="10" height="10" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="0" y2="10" stroke="#fb7185" strokeWidth="2.5" opacity="0.35" />
                </pattern>
                <radialGradient id="vignette" cx="50%" cy="45%" r="75%">
                  <stop offset="60%" stopColor="black" stopOpacity="0" />
                  <stop offset="100%" stopColor="black" stopOpacity="0.55" />
                </radialGradient>
              </defs>

              <rect x="0" y="0" width={VIEWBOX.w} height={VIEWBOX.h} fill="url(#mapgrid)" />

              <polygon
                points={NO_FLY_ZONE.points.map((p) => p.join(",")).join(" ")}
                fill="url(#nofly-hatch)"
                stroke="#fb7185"
                strokeOpacity="0.55"
                strokeWidth="1.5"
                strokeDasharray="5 4"
              />
              <text
                x={NO_FLY_ZONE.points[0][0] + 8}
                y={NO_FLY_ZONE.points[0][1] - 10}
                fill="#fca5a5"
                fontSize="11"
                fontFamily="var(--mono)"
                letterSpacing="0.5"
              >
                NO-FLY ZONE
              </text>

              {/* depot */}
              <g transform={`translate(${DEPOT.x} ${DEPOT.y})`}>
                <rect x="-26" y="-20" width="90" height="60" rx="8" fill="rgba(167,139,250,0.06)" stroke="#a78bfa" strokeOpacity="0.4" strokeDasharray="3 3" />
                <text x="-26" y="-26" fill="#c4b5fd" fontSize="10" fontFamily="var(--mono)">DEPOT / CHARGE</text>
              </g>

              {/* dashed planned routes */}
              {DRONES.filter((d) => d.route).map((d) => (
                <path
                  key={d.id}
                  d={pathD([...d.route, d.route[0]])}
                  fill="none"
                  stroke={DRONE_STATUS[d.status].color}
                  strokeOpacity="0.4"
                  strokeWidth="1.5"
                  strokeDasharray="7 6"
                  style={{ animation: `dash-flow ${3.2}s linear infinite` }}
                />
              ))}

              {/* mission markers */}
              {MISSIONS.map((m) => {
                const color = MISSION_STATUS[m.status].color;
                const isSel = selected.type === "mission" && selected.id === m.id;
                return (
                  <g
                    key={m.id}
                    transform={`translate(${m.pos[0]} ${m.pos[1]})`}
                    onClick={() => setSelected({ type: "mission", id: m.id })}
                    className="cursor-pointer"
                  >
                    {m.status === "in_progress" && (
                      <circle r="6" fill="none" stroke={color} strokeWidth="2" style={{ animation: "svg-pulse 1.6s ease-out infinite" }} />
                    )}
                    <path
                      d="M0,-13 C6,-13 10,-9 10,-4 C10,2 0,13 0,13 C0,13 -10,2 -10,-4 C-10,-9 -6,-13 0,-13 Z"
                      fill={color}
                      fillOpacity={m.status === "complete" ? 0.35 : 0.9}
                      stroke={isSel ? "#f2f4f8" : "rgba(0,0,0,0.4)"}
                      strokeWidth={isSel ? 1.5 : 1}
                    />
                    <circle r="2.4" fill="#080c14" cy="-5" />
                  </g>
                );
              })}

              {/* drone markers */}
              {DRONES.map((d) => {
                const p = dronePositions[d.id];
                const color = DRONE_STATUS[d.status].color;
                const isSel = selected.type === "drone" && selected.id === d.id;
                const pulsing = d.status === "flying" || d.status === "low_battery";
                return (
                  <g
                    key={d.id}
                    transform={`translate(${p.x} ${p.y})`}
                    onClick={() => setSelected({ type: "drone", id: d.id })}
                    className="cursor-pointer"
                  >
                    <circle r="9" fill={color} fillOpacity="0.16" />
                    {pulsing && (
                      <circle r="6" fill="none" stroke={color} strokeWidth="2" style={{ animation: `svg-pulse ${d.status === "low_battery" ? 1.1 : 1.8}s ease-out infinite` }} />
                    )}
                    <g transform={`rotate(${p.angle})`}>
                      <path d="M11,0 L-7,-6 L-3.5,0 L-7,6 Z" fill={color} stroke="#080c14" strokeWidth="0.75" />
                    </g>
                    <circle r="3.5" fill="#080c14" stroke={color} strokeWidth="1.5" />
                    {isSel && <circle r="12" fill="none" stroke="#f2f4f8" strokeWidth="1" strokeDasharray="2 3" />}
                  </g>
                );
              })}

              <rect x="0" y="0" width={VIEWBOX.w} height={VIEWBOX.h} fill="url(#vignette)" pointerEvents="none" />
            </svg>

            <InfoPanel entity={selectedEntity} kind={selected.type} />
          </div>

          <StatusStrip dronePositions={dronePositions} selected={selected} setSelected={setSelected} />
        </Reveal>

        <Reveal delay={100} className="mt-6 grid sm:grid-cols-2 gap-4 text-xs text-[color:var(--text-dim)]">
          <div className="rounded-xl border border-[color:var(--border)] p-4">
            <div className="mono uppercase tracking-wider text-[10px] mb-2.5 text-[color:var(--text-h)]">Drone status</div>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {Object.entries(DRONE_STATUS).map(([k, v]) => (
                <LegendDot key={k} color={v.color} label={v.label} />
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-[color:var(--border)] p-4">
            <div className="mono uppercase tracking-wider text-[10px] mb-2.5 text-[color:var(--text-h)]">Mission status</div>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {Object.entries(MISSION_STATUS).map(([k, v]) => (
                <LegendDot key={k} color={v.color} label={v.label} />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function InfoPanel({ entity, kind }) {
  if (!entity) return null;
  const isDrone = kind === "drone";
  const color = isDrone ? DRONE_STATUS[entity.status].color : MISSION_STATUS[entity.status].color;
  const label = isDrone ? DRONE_STATUS[entity.status].label : MISSION_STATUS[entity.status].label;

  return (
    <div className="absolute top-4 right-4 w-56 rounded-xl border border-[color:var(--border)] bg-[#0b1019]/90 backdrop-blur-sm p-4 text-xs">
      <div className="flex items-center justify-between mb-2">
        <span className="mono font-semibold text-[color:var(--text-h)]">{entity.id}</span>
        <span className="mono px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wide" style={{ color, backgroundColor: `${color}22` }}>
          {label}
        </span>
      </div>
      {isDrone ? (
        <div className="space-y-1.5 text-[color:var(--text-dim)]">
          <Row k="Battery" v={`${entity.battery}%`} />
          <Row k="Payload" v={entity.payload} />
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden mt-2">
            <div
              className="h-full rounded-full"
              style={{ width: `${entity.battery}%`, background: entity.battery < 20 ? "#f5a524" : "#22d3ee" }}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-1.5 text-[color:var(--text-dim)]">
          <Row k="Priority" v={`P${entity.priority}`} />
          <Row k="Assigned drone" v={entity.droneId || "—"} />
        </div>
      )}
    </div>
  );
}

function Row({ k, v }) {
  return (
    <div className="flex justify-between">
      <span>{k}</span>
      <span className="text-[color:var(--text-h)] mono">{v}</span>
    </div>
  );
}

function StatusStrip({ dronePositions, selected, setSelected }) {
  return (
    <div className="border-t border-[color:var(--border-soft)] px-4 md:px-6 py-4 flex gap-3 overflow-x-auto">
      {DRONES.map((d) => {
        const color = DRONE_STATUS[d.status].color;
        const isSel = selected.type === "drone" && selected.id === d.id;
        return (
          <button
            key={d.id}
            onClick={() => setSelected({ type: "drone", id: d.id })}
            className={`shrink-0 flex items-center gap-2.5 rounded-lg border px-3 py-2 transition-colors ${
              isSel ? "border-cyan-400/50 bg-cyan-400/[0.06]" : "border-[color:var(--border)] hover:border-white/20"
            }`}
          >
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
            <span className="mono text-xs text-[color:var(--text-h)]">{d.id}</span>
            <span className="w-12 h-1.5 rounded-full bg-white/10 overflow-hidden hidden sm:block">
              <span className="block h-full rounded-full" style={{ width: `${d.battery}%`, backgroundColor: d.battery < 20 ? "#f5a524" : color }} />
            </span>
            <span className="mono text-[10px] text-[color:var(--text-dim)]">{d.battery}%</span>
          </button>
        );
      })}
    </div>
  );
}

function LegendDot({ color, label }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </div>
  );
}
