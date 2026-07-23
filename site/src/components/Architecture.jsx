import { useMemo } from "react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { useConnectors } from "../hooks/useConnectors";

const SERVICES = [
  { id: "auth", name: "auth-service", desc: "Login, JWT, RBAC", store: "MongoDB" },
  { id: "fleet", name: "fleet-service", desc: "Drone inventory & status", store: "MongoDB" },
  { id: "mission", name: "mission-service", desc: "Mission definitions", store: "MongoDB" },
  { id: "telemetry", name: "telemetry-service", desc: "Ingests live drone events", store: "MongoDB" },
  { id: "planning", name: "planning-service", desc: "Optimization engine", store: "MongoDB", highlight: true },
  { id: "notification", name: "notification-service", desc: "Alerts & conflicts", store: "stateless" },
];

const EDGES = [
  { from: "frontend", to: "gateway", kind: "route" },
  { from: "gateway", to: "auth", kind: "route" },
  { from: "gateway", to: "fleet", kind: "route" },
  { from: "gateway", to: "mission", kind: "route" },
  { from: "gateway", to: "planning", kind: "route" },
  { from: "gateway", to: "telemetry", kind: "route" },
  { from: "gateway", to: "notification", kind: "route" },
  { from: "simulator", to: "telemetry", kind: "bus", label: "telemetry" },
  { from: "telemetry", to: "planning", kind: "bus", label: "events" },
  { from: "planning", to: "notification", kind: "bus", label: "alerts" },
];

export default function Architecture() {
  const edges = useMemo(() => EDGES, []);
  const { containerRef, register, lines } = useConnectors(edges);

  return (
    <section id="architecture" className="relative py-28 md:py-36 border-t border-[color:var(--border-soft)]">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <SectionHeading
          eyebrow="System architecture"
          title="Six services, one gateway, one message bus."
          description="A polyrepo, Kubernetes-native system: the SPA talks to an NGINX gateway that routes to six services, while a message bus carries telemetry events into the planning engine and alerts out to operators."
        />

        <Reveal>
          <div ref={containerRef} className="relative rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-panel)] p-6 md:p-10 overflow-visible">
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: "visible" }}>
              <defs>
                <marker id="arrow-route" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M0,0 L10,5 L0,10 z" fill="#3a4256" />
                </marker>
                <marker id="arrow-bus" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M0,0 L10,5 L0,10 z" fill="#22d3ee" />
                </marker>
              </defs>
              {lines.map((l, i) =>
                l.kind === "bus" ? (
                  <line
                    key={i}
                    x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
                    stroke="#22d3ee"
                    strokeWidth="1.75"
                    strokeDasharray="5 6"
                    markerEnd="url(#arrow-bus)"
                    style={{ animation: "dash-flow 1.4s linear infinite" }}
                  />
                ) : (
                  <line
                    key={i}
                    x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
                    stroke="#3a4256"
                    strokeWidth="1.5"
                    markerEnd="url(#arrow-route)"
                  />
                )
              )}
            </svg>

            <div className="relative flex flex-col items-center gap-8 md:gap-12">
              <Box id="frontend" register={register} className="w-full max-w-xs">
                <BoxLabel kind="Frontend">React / Vite SPA</BoxLabel>
                <p className="text-xs text-[color:var(--text-dim)] mt-1">Live fleet map · mission board · dashboards</p>
              </Box>

              <Box id="gateway" register={register} className="w-full max-w-xs border-violet-400/30 bg-violet-400/[0.06]">
                <BoxLabel kind="Gateway" color="violet">NGINX</BoxLabel>
                <p className="text-xs text-[color:var(--text-dim)] mt-1 mono">/auth /fleet /missions /planning /telemetry /notifications</p>
              </Box>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5 w-full">
                {SERVICES.map((s) => (
                  <Box
                    key={s.id}
                    id={s.id}
                    register={register}
                    className={s.highlight ? "border-cyan-400/40 bg-cyan-400/[0.06]" : ""}
                  >
                    <div className="font-semibold text-sm text-[color:var(--text-h)] mono">{s.name}</div>
                    <p className="text-xs text-[color:var(--text-dim)] mt-1.5 leading-snug">{s.desc}</p>
                    <div className="mt-3 inline-flex text-[10px] mono uppercase tracking-wide text-[color:var(--text-dim)] border border-[color:var(--border)] rounded px-1.5 py-0.5">
                      {s.store}
                    </div>
                  </Box>
                ))}
              </div>

              <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5">
                <Box
                  id="simulator"
                  register={register}
                  className="col-span-2 sm:col-span-3 lg:col-span-1 lg:col-start-4 border-amber-400/30 bg-amber-400/[0.06]"
                >
                  <BoxLabel kind="Worker" color="amber">Drone simulator</BoxLabel>
                  <p className="text-xs text-[color:var(--text-dim)] mt-1">Flies each drone along its route, emits telemetry on a timer with random variance</p>
                </Box>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-[color:var(--border-soft)] flex flex-wrap gap-x-8 gap-y-3 text-xs text-[color:var(--text-dim)]">
              <Legend swatch="bg-[#3a4256]" label="Gateway routing (HTTP)" />
              <Legend swatch="bg-cyan-400" dashed label="Message bus (Kafka / RabbitMQ)" />
              <Legend swatch="bg-cyan-400/50" label="planning-service — highest-risk, canary-deployed" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Box({ id, register, className = "", children }) {
  return (
    <div
      ref={register(id)}
      className={`rounded-xl border border-[color:var(--border)] bg-white/[0.02] px-4 py-3.5 md:px-5 md:py-4 ${className}`}
    >
      {children}
    </div>
  );
}

function BoxLabel({ kind, color, children }) {
  const colorClass = { violet: "text-violet-300", amber: "text-amber-300" }[color] || "text-cyan-300";
  return (
    <div className="flex items-baseline gap-2">
      <span className={`mono text-[10px] uppercase tracking-wider ${colorClass}`}>{kind}</span>
      <span className="font-semibold text-sm text-[color:var(--text-h)]">{children}</span>
    </div>
  );
}

function Legend({ swatch, label, dashed }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`inline-block w-5 h-[2px] ${swatch} ${dashed ? "opacity-70" : ""}`} style={dashed ? { backgroundImage: "repeating-linear-gradient(90deg, currentColor 0 4px, transparent 4px 8px)" } : {}} />
      {label}
    </div>
  );
}
