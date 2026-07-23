export default function Footer() {
  return (
    <footer className="border-t border-[color:var(--border-soft)] py-10">
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[color:var(--text-dim)]">
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
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
          <span>SwarmOps — capstone project pitch deck, v1.0</span>
        </div>
        <span>Drone fleet mission planning & route optimization</span>
      </div>
    </footer>
  );
}
