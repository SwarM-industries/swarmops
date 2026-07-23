import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const STAGES = [
  { tag: "Package", title: "Helm", desc: "One chart per service — templated manifests, per-env values." },
  { tag: "Provision", title: "Terraform → EKS", desc: "VPC + EKS via public modules, state in Terraform Cloud." },
  { tag: "CI", title: "GitHub Actions", desc: "OIDC to AWS — no static keys. Build & push images to ECR." },
  { tag: "CD", title: "Argo CD", desc: "GitOps sync from a deployments repo — cluster state matches Git." },
  { tag: "Observe", title: "Prometheus / Loki", desc: "kube-prometheus-stack metrics + alerting; Loki + Alloy for logs." },
];

const CANARY_STEPS = [
  { split: "90 / 10", label: "Canary receives 10%" },
  { split: "50 / 50", label: "Metrics clean → ramp" },
  { split: "0 / 100", label: "Promoted, old pods drained" },
];

export default function Infra() {
  return (
    <section id="infra" className="relative py-28 md:py-36 border-t border-[color:var(--border-soft)]">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <SectionHeading
          eyebrow="Infra & delivery"
          title="Production-style pipeline, not a demo script."
          description="Every push flows through the same GitOps pipeline a real platform team would run — the point is proving the system can be operated, not just built."
        />

        <div className="relative mb-16">
          <div className="hidden lg:block absolute top-[46px] left-0 right-0 h-px bg-[color:var(--border)]" />
          <div className="grid lg:grid-cols-5 gap-5">
            {STAGES.map((s, i) => (
              <Reveal key={s.title} delay={i * 80} className="relative">
                <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-panel)] p-6 h-full hover:border-cyan-400/30 transition-colors">
                  <div className="flex items-center gap-2 mb-5">
                    <span className="w-8 h-8 rounded-full border border-[color:var(--border)] bg-white/[0.03] flex items-center justify-center mono text-xs text-cyan-300">
                      {i + 1}
                    </span>
                    <span className="mono text-[10px] uppercase tracking-wider text-[color:var(--text-dim)]">{s.tag}</span>
                  </div>
                  <h5 className="font-semibold text-[color:var(--text-h)] mb-2">{s.title}</h5>
                  <p className="text-xs text-[color:var(--text-dim)] leading-relaxed">{s.desc}</p>
                </div>
                {i < STAGES.length - 1 && (
                  <div className="hidden lg:flex absolute top-[30px] -right-5 translate-x-1/2 items-center justify-center text-[color:var(--text-dim)]">
                    →
                  </div>
                )}
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="rounded-2xl border border-cyan-400/25 bg-cyan-400/[0.04] p-8 md:p-10">
          <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-12">
            <div className="md:max-w-sm">
              <span className="mono text-[10px] uppercase tracking-wider text-cyan-300/90 border border-cyan-400/30 rounded-full px-2.5 py-1">
                Required extension
              </span>
              <h4 className="text-xl font-semibold text-[color:var(--text-h)] mt-4 mb-2">Argo Rollouts canary — on planning-service</h4>
              <p className="text-sm text-[color:var(--text-dim)] leading-relaxed">
                Applied specifically to <code className="mono text-xs px-1 py-0.5 rounded bg-black/30">planning-service</code>
                — the highest-risk, most frequently iterated service, since it hosts the optimization algorithm.
              </p>
            </div>
            <div className="flex-1 flex items-center gap-3 md:gap-5 overflow-x-auto">
              {CANARY_STEPS.map((c, i) => (
                <div key={c.split} className="flex items-center gap-3 md:gap-5 shrink-0">
                  <div className="rounded-xl border border-[color:var(--border)] bg-[#0b1019] px-5 py-4 text-center min-w-[120px]">
                    <div className="mono text-lg font-semibold text-[color:var(--text-h)]">{c.split}</div>
                    <div className="text-[11px] text-[color:var(--text-dim)] mt-1 leading-snug">{c.label}</div>
                  </div>
                  {i < CANARY_STEPS.length - 1 && <span className="text-cyan-400/60">→</span>}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
