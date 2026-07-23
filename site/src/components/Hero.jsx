import Reveal from "./Reveal";

export default function Hero() {
  return (
    <section id="top" className="relative min-h-screen flex items-center overflow-hidden pt-16">
      <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_70%_60%_at_50%_20%,black,transparent)]" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-cyan-500/10 blur-[160px]" />
      <div className="absolute top-40 right-0 w-[500px] h-[500px] rounded-full bg-violet-500/10 blur-[140px]" />

      <HeroFlightPaths />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 py-24 w-full">
        <div className="max-w-3xl">
          <Reveal className="mono inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[color:var(--text-dim)] border border-[color:var(--border)] rounded-full px-3.5 py-1.5 mb-8 bg-white/[0.02]">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Capstone project · v1.0
          </Reveal>

          <Reveal delay={80}>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.02]">
              Dispatch a drone fleet
              <br />
              like it's <span className="text-gradient">solved math</span>,
              <br />
              not a checklist.
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-8 text-lg md:text-xl text-[color:var(--text-dim)] leading-relaxed max-w-2xl">
              <strong className="text-[color:var(--text-h)] font-semibold">SwarmOps</strong> automatically
              assigns drones to missions and computes battery-feasible routes — respecting priority, deadlines,
              payload, and no-fly zones — then re-plans in real time as conditions change.
            </p>
          </Reveal>

          <Reveal delay={240} className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#map"
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 text-[#04121a] font-semibold px-5 py-3 text-sm hover:bg-cyan-300 transition-colors"
            >
              Explore the live fleet map
              <ArrowIcon />
            </a>
            <a
              href="#architecture"
              className="inline-flex items-center gap-2 rounded-lg border border-[color:var(--border)] px-5 py-3 text-sm font-medium text-[color:var(--text)] hover:border-cyan-400/40 hover:text-cyan-200 transition-colors"
            >
              View system architecture
            </a>
          </Reveal>

          <Reveal delay={320} className="mt-16 grid grid-cols-3 gap-8 max-w-lg">
            <Stat value="6" label="microservices" />
            <Stat value="VRPTW" label="core algorithm" />
            <Stat value="~2s" label="re-plan target" />
          </Reveal>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[color:var(--text-dim)]">
        <span className="mono text-[10px] tracking-[0.2em] uppercase">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-cyan-400/60 to-transparent" />
      </div>
    </section>
  );
}

function Stat({ value, label }) {
  return (
    <div>
      <div className="mono text-2xl font-semibold text-[color:var(--text-h)]">{value}</div>
      <div className="text-xs text-[color:var(--text-dim)] mt-1">{label}</div>
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HeroFlightPaths() {
  const paths = [
    "M -50 120 C 200 60, 400 220, 700 140 S 1100 60, 1400 160",
    "M -50 320 C 250 380, 500 240, 800 340 S 1150 260, 1450 320",
    "M -50 480 C 300 420, 600 520, 900 440 S 1200 400, 1500 480",
  ];
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.35] pointer-events-none"
      viewBox="0 0 1400 600"
      preserveAspectRatio="xMidYMid slice"
    >
      {paths.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke={i === 1 ? "#a78bfa" : "#22d3ee"}
          strokeWidth="1.5"
          strokeDasharray="6 10"
          style={{ animation: `dash-flow ${6 + i * 1.5}s linear infinite` }}
        />
      ))}
    </svg>
  );
}
