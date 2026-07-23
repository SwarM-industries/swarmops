import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const PHASES = [
  {
    n: "01",
    title: "Greedy baseline",
    desc: "For each mission — sorted by priority, then deadline — assign the nearest available, capable drone with sufficient battery.",
    tag: "Foundation",
  },
  {
    n: "02",
    title: "Optimized assignment",
    desc: "Reformulate as weighted bipartite matching (Hungarian algorithm), minimizing total travel distance plus an urgency penalty.",
    tag: "Matching",
  },
  {
    n: "03",
    title: "Route solving",
    desc: "For multi-stop drones, solve a per-drone routing problem — a small TSP instance — optionally via Google OR-Tools' routing solver.",
    tag: "OR-Tools",
  },
  {
    n: "04",
    title: "Battery-aware feasibility",
    desc: "Simulate battery drain along each candidate route; reject or insert a charging stop before a drone can be stranded.",
    tag: "Feasibility",
  },
  {
    n: "05",
    title: "Real-time re-planning",
    desc: "On new telemetry or mission events, re-solve only the affected portion of the schedule — not the whole fleet.",
    tag: "Live",
  },
];

export default function Algorithm() {
  return (
    <section id="algorithm" className="relative py-28 md:py-36 border-t border-[color:var(--border-soft)]">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <SectionHeading
          eyebrow="Core algorithm"
          title="A VRPTW variant, where battery replaces vehicle capacity."
          description="A variant of the Vehicle Routing Problem with Time Windows — except capacity isn't a fixed number, it's battery range, which depends dynamically on distance flown and payload weight."
        />

        <Reveal className="grid md:grid-cols-2 gap-4 mb-16">
          <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-panel)] p-7">
            <h4 className="mono text-xs uppercase tracking-wider text-cyan-300/80 mb-4">Inputs</h4>
            <p className="text-sm text-[color:var(--text)] leading-relaxed">
              <span className="text-[color:var(--text-h)] font-medium">N drones</span> — position, battery %, speed, payload capacity, status.
              <br className="hidden md:block" /><br className="hidden md:block" />
              <span className="text-[color:var(--text-h)] font-medium">M missions</span> — target location(s), priority, deadline, required payload type, estimated duration.
            </p>
          </div>
          <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-panel)] p-7">
            <h4 className="mono text-xs uppercase tracking-wider text-violet-300/80 mb-4">Output</h4>
            <p className="text-sm text-[color:var(--text)] leading-relaxed">
              An assignment of missions to drones, an ordered route per drone, and a feasibility check confirming
              each drone can complete its route and return — or reach a charging point — without running out of battery.
            </p>
          </div>
        </Reveal>

        <Reveal className="mb-6">
          <h4 className="mono text-xs uppercase tracking-wider text-[color:var(--text-dim)]">Implementation phases</h4>
        </Reveal>

        <div className="relative">
          <div className="hidden lg:block absolute top-[38px] left-0 right-0 h-px bg-gradient-to-r from-cyan-400/40 via-violet-400/40 to-amber-400/40" />
          <div className="grid lg:grid-cols-5 gap-5">
            {PHASES.map((p, i) => (
              <Reveal key={p.n} delay={i * 90} className="relative">
                <div className="relative rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-panel)] p-6 h-full flex flex-col hover:border-cyan-400/30 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <span className="mono text-2xl font-bold text-[color:var(--border)]">{p.n}</span>
                    <span className="mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-[color:var(--border)] text-[color:var(--text-dim)]">
                      {p.tag}
                    </span>
                  </div>
                  <h5 className="font-semibold text-[color:var(--text-h)] mb-2">{p.title}</h5>
                  <p className="text-xs text-[color:var(--text-dim)] leading-relaxed">{p.desc}</p>
                </div>
                {i < PHASES.length - 1 && (
                  <div className="hidden lg:flex absolute top-[38px] -right-5 translate-x-1/2 w-5 items-center justify-center text-cyan-400/60">
                    →
                  </div>
                )}
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="mt-10 rounded-2xl border border-amber-400/20 bg-amber-400/[0.04] p-6 flex gap-4">
          <span className="mono text-xs uppercase tracking-wider text-amber-300/90 shrink-0">Conflict handling</span>
          <p className="text-sm text-[color:var(--text)] leading-relaxed">
            When two missions of competing priority need the same drone in an overlapping window,
            <code className="mono text-xs px-1.5 py-0.5 rounded bg-black/30 mx-1">planning-service</code>
            resolves in favor of the higher-priority / earlier-deadline mission, then reschedules or flags the
            other as unresolved — notifying the dispatcher via <code className="mono text-xs px-1.5 py-0.5 rounded bg-black/30">notification-service</code>.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
