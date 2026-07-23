import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const MODELS = [
  {
    name: "Drone",
    fields: [
      ["id", "string"],
      ["name", "string"],
      ["status", "idle | flying | charging | maintenance"],
      ["position", "{ lat, lng }"],
      ["battery_pct", "number"],
      ["max_range_km", "number"],
      ["speed_kmh", "number"],
      ["payload_capacity_kg", "number"],
      ["current_payload_type", "string"],
    ],
  },
  {
    name: "Mission",
    fields: [
      ["id", "string"],
      ["priority", "1–5"],
      ["deadline", "datetime"],
      ["target_locations", "[ { lat, lng } ]"],
      ["required_payload_type", "string"],
      ["estimated_duration_min", "number"],
      ["status", "pending | assigned | in_progress | complete"],
    ],
  },
  {
    name: "Plan",
    fields: [
      ["id", "string"],
      ["drone_id", "string"],
      ["mission_ids", "[ string ] — ordered"],
      ["route", "[ waypoint ]"],
      ["estimated_battery_at_completion", "number"],
      ["status", "string"],
    ],
  },
  {
    name: "Telemetry event",
    fields: [
      ["drone_id", "string"],
      ["timestamp", "datetime"],
      ["position", "{ lat, lng }"],
      ["battery_pct", "number"],
      ["event_type", "string"],
    ],
  },
];

const API = [
  { method: "POST", path: "/missions", purpose: "Create a mission" },
  { method: "GET", path: "/missions?status=pending", purpose: "List missions by status" },
  { method: "GET", path: "/fleet/drones?status=idle", purpose: "List available drones" },
  { method: "POST", path: "/planning/solve", purpose: "Trigger a full re-plan" },
  { method: "GET", path: "/planning/plans/{drone_id}", purpose: "Current plan for a drone" },
  { method: "POST", path: "/planning/simulate", purpose: "What-if simulation (non-committing)" },
  { method: "POST", path: "/telemetry/ingest", purpose: "Simulated drone reports position/battery" },
];

const METHOD_COLOR = {
  GET: "text-cyan-300 border-cyan-400/30 bg-cyan-400/10",
  POST: "text-violet-300 border-violet-400/30 bg-violet-400/10",
};

export default function DataModels() {
  return (
    <section id="data" className="relative py-28 md:py-36 border-t border-[color:var(--border-soft)]">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <SectionHeading
          eyebrow="Data & API"
          title="Representative data models and API surface."
          description="MongoDB-backed documents per service, and a REST surface fronted by the gateway. Trimmed to the fields that matter for the pitch — the full schemas live in each service's repo."
        />

        <div className="grid md:grid-cols-2 gap-5 mb-16">
          {MODELS.map((m, i) => (
            <Reveal key={m.name} delay={i * 60} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-panel)] overflow-hidden">
              <div className="px-5 py-3.5 border-b border-[color:var(--border-soft)] flex items-center justify-between">
                <span className="font-semibold text-sm text-[color:var(--text-h)]">{m.name}</span>
                <span className="mono text-[10px] text-[color:var(--text-dim)] uppercase tracking-wider">document</span>
              </div>
              <table className="w-full text-xs">
                <tbody>
                  {m.fields.map(([k, v]) => (
                    <tr key={k} className="border-b border-[color:var(--border-soft)] last:border-0">
                      <td className="px-5 py-2.5 mono text-cyan-200/90 whitespace-nowrap">{k}</td>
                      <td className="px-5 py-2.5 text-[color:var(--text-dim)] text-right">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <h3 className="mono text-xs uppercase tracking-wider text-[color:var(--text-dim)] mb-5">API surface (representative)</h3>
          <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-panel)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[560px]">
                <tbody>
                  {API.map((a) => (
                    <tr key={a.path} className="border-b border-[color:var(--border-soft)] last:border-0 hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3.5 w-24">
                        <span className={`mono text-[11px] font-semibold px-2 py-0.5 rounded border ${METHOD_COLOR[a.method]}`}>
                          {a.method}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 mono text-[color:var(--text-h)] whitespace-nowrap">{a.path}</td>
                      <td className="px-5 py-3.5 text-[color:var(--text-dim)]">{a.purpose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
