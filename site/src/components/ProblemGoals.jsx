import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const GOALS = [
  "Automatically assign drones to missions by priority, deadline, payload fit, and battery feasibility.",
  "Compute efficient multi-stop routes per drone.",
  "Detect and resolve conflicts — e.g. two urgent missions competing for the same drone.",
  "Re-plan in real time as conditions change: new mission, faster-than-predicted battery drain, drone going offline.",
  "Visualize the entire fleet and mission state on a live map.",
  "Prove the idea as a realistic distributed system — real optimization core, event-driven telemetry, production-style delivery.",
];

const NON_GOALS = [
  "Real hardware integration — simulated drones and telemetry only.",
  "Full air-traffic-control-grade collision avoidance — simplified no-fly-zone and route-conflict checks only.",
  "Multi-tenant / multi-org support — single fleet, single ops team.",
];

const PERSONAS = [
  { role: "Mission planner / dispatcher", need: "Clear view of pending/assigned missions, ability to override assignments" },
  { role: "Fleet operator", need: "Visibility into battery/maintenance state, ability to take drones offline" },
  { role: "Observer / commander", need: "Fleet utilization, mission completion rate, active alerts at a glance" },
];

export default function ProblemGoals() {
  return (
    <section id="problem" className="relative py-28 md:py-36 border-t border-[color:var(--border-soft)]">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <SectionHeading
          eyebrow="The problem"
          title="Manual dispatch doesn't scale past a handful of drones."
          description="Coordinating a fleet against a changing set of missions is a constrained optimization problem, not a scheduling checklist. Past a handful of drones, a human dispatcher can't reliably track battery limits, payload requirements, priority conflicts, and mid-mission failures at once — leading to wasted flight time, missed deadlines, and drones stranded without enough charge to get home."
        />

        <div className="grid lg:grid-cols-2 gap-6 mb-16">
          <Reveal className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-panel)] p-8">
            <h3 className="mono text-xs tracking-[0.15em] uppercase text-cyan-300/80 mb-5">Goals</h3>
            <ul className="space-y-4">
              {GOALS.map((g, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-[color:var(--text)]">
                  <span className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  {g}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={100} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-panel)] p-8">
            <h3 className="mono text-xs tracking-[0.15em] uppercase text-violet-300/80 mb-5">Explicit non-goals</h3>
            <ul className="space-y-4">
              {NON_GOALS.map((g, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-[color:var(--text)]">
                  <span className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-violet-400" />
                  {g}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-[color:var(--text-dim)] leading-relaxed border-t border-[color:var(--border-soft)] pt-5">
              Keeping scope tight here is what makes the optimization core and the delivery pipeline
              deep instead of the whole system shallow.
            </p>
          </Reveal>
        </div>

        <Reveal>
          <h3 className="mono text-xs tracking-[0.15em] uppercase text-[color:var(--text-dim)] mb-5">Who it's for</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {PERSONAS.map((p, i) => (
              <div key={i} className="rounded-xl border border-[color:var(--border)] p-6 bg-white/[0.015]">
                <div className="font-semibold text-[color:var(--text-h)] text-sm mb-2">{p.role}</div>
                <div className="text-sm text-[color:var(--text-dim)] leading-relaxed">{p.need}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
