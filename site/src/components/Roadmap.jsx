import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const PHASES = [
  {
    n: 1,
    title: "Foundation",
    desc: "All five services scaffolded, talking over the gateway. Basic CRUD for drones and missions. Greedy assignment algorithm. Static map showing current state.",
  },
  {
    n: 2,
    title: "Optimization core",
    desc: "Replace greedy assignment with matching / OR-Tools-based solver. Add battery-aware route feasibility checks.",
  },
  {
    n: 3,
    title: "Live system",
    desc: "Drone simulator + telemetry-service + message bus. Live map updates via WebSocket. Re-planning triggered by telemetry/mission events.",
  },
  {
    n: 4,
    title: "Infrastructure",
    desc: "Helm charts, Terraform (VPC/EKS), GitHub Actions CI with OIDC, Argo CD GitOps, kube-prometheus-stack + Loki/Alloy observability.",
  },
  {
    n: 5,
    title: "Extension & polish",
    desc: "Argo Rollouts canary on planning-service, what-if simulator, algorithm performance dashboards, final demo scenarios.",
  },
];

export default function Roadmap() {
  return (
    <section id="roadmap" className="relative py-28 md:py-36 border-t border-[color:var(--border-soft)]">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <SectionHeading eyebrow="Roadmap" title="Five build phases, greedy to production." />

        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-[15px] top-2 bottom-2 w-px bg-[color:var(--border)]" />
          <div className="space-y-6">
            {PHASES.map((p, i) => (
              <Reveal key={p.n} delay={i * 70} className="relative pl-12">
                <span className="absolute left-0 top-6 w-[31px] h-[31px] rounded-full bg-[color:var(--bg)] border border-cyan-400/40 flex items-center justify-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                </span>
                <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-panel)] p-6 hover:border-cyan-400/30 transition-colors">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="mono text-[10px] uppercase tracking-wider text-cyan-300/80">Phase {p.n}</span>
                    <h5 className="font-semibold text-[color:var(--text-h)]">{p.title}</h5>
                  </div>
                  <p className="text-sm text-[color:var(--text-dim)] leading-relaxed">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
