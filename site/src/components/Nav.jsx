const LINKS = [
  { href: "#problem", label: "Problem" },
  { href: "#architecture", label: "Architecture" },
  { href: "#algorithm", label: "Algorithm" },
  { href: "#map", label: "Live Map" },
  { href: "#data", label: "Data & API" },
  { href: "#infra", label: "Infra" },
  { href: "#roadmap", label: "Roadmap" },
  { href: "#metrics", label: "Metrics" },
];

export default function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-[#06090f]/70 border-b border-[color:var(--border-soft)]">
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2.5 shrink-0">
          <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="3.4" fill="#22d3ee" />
            <g stroke="#22d3ee" strokeWidth="1.6" strokeLinecap="round">
              <line x1="16" y1="16" x2="6" y2="6" />
              <line x1="16" y1="16" x2="26" y2="6" />
              <line x1="16" y1="16" x2="6" y2="26" />
              <line x1="16" y1="16" x2="26" y2="26" />
            </g>
            <g fill="#a78bfa">
              <circle cx="6" cy="6" r="3" />
              <circle cx="26" cy="6" r="3" />
              <circle cx="6" cy="26" r="3" />
              <circle cx="26" cy="26" r="3" />
            </g>
          </svg>
          <span className="font-semibold tracking-tight text-[color:var(--text-h)]">SwarmOps</span>
        </a>
        <nav className="hidden lg:flex items-center gap-7 mono text-[13px] text-[color:var(--text-dim)]">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-cyan-300 transition-colors">
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href="#map"
          className="hidden sm:inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 text-[13px] font-medium text-cyan-200 hover:bg-cyan-400/20 transition-colors"
        >
          See it live
        </a>
      </div>
    </header>
  );
}
