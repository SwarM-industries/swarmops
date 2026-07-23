import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const METRICS = [
  {
    title: "Assignment quality",
    desc: "Total distance / flight time versus a naive greedy baseline.",
    accent: "cyan",
  },
  {
    title: "Feasibility",
    desc: "Zero drones stranded — battery-infeasible routes — across simulation runs.",
    accent: "violet",
  },
  {
    title: "Responsiveness",
    desc: "Time to re-solve after a disruptive event: new urgent mission, battery anomaly.",
    accent: "amber",
  },
  {
    title: "System reliability",
    desc: "Successful GitOps deploys via Argo CD; canary rollouts on planning-service complete with no manual rollback in the demo.",
    accent: "cyan",
  },
  {
    title: "Observability completeness",
    desc: "Grafana dashboards reflect live fleet state within a few seconds of telemetry ingestion.",
    accent: "violet",
  },
];

const ACCENTS = {
  cyan: { text: "text-cyan-300", ring: "border-cyan-400/25", glow: "bg-cyan-400/10" },
  violet: { text: "text-violet-300", ring: "border-violet-400/25", glow: "bg-violet-400/10" },
  amber: { text: "text-amber-300", ring: "border-amber-400/25", glow: "bg-amber-400/10" },
};

export default function Metrics() {
  return (
    <section id="metrics" className="relative py-28 md:py-36 border-t border-[color:var(--border-soft)]">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <SectionHeading
          eyebrow="Success metrics"
          title="How we'd know it actually worked."
          description="Five measurable signals — from optimization quality to deployment reliability — rather than a subjective demo."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {METRICS.map((m, i) => {
            const a = ACCENTS[m.accent];
            return (
              <Reveal key={m.title} delay={i * 60} className={`relative rounded-2xl border ${a.ring} bg-[color:var(--bg-panel)] p-7 overflow-hidden`}>
                <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full ${a.glow} blur-2xl`} />
                <div className={`mono text-xs mb-4 ${a.text}`}>0{i + 1}</div>
                <h5 className="font-semibold text-[color:var(--text-h)] mb-2 relative">{m.title}</h5>
                <p className="text-sm text-[color:var(--text-dim)] leading-relaxed relative">{m.desc}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
