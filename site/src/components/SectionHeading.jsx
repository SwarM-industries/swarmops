import Reveal from "./Reveal";

export default function SectionHeading({ eyebrow, title, description, align = "left" }) {
  const isCenter = align === "center";
  return (
    <Reveal className={`max-w-2xl ${isCenter ? "mx-auto text-center" : ""} mb-14`}>
      {eyebrow && (
        <div className="mono text-xs tracking-[0.2em] uppercase text-cyan-300/80 mb-3 flex items-center gap-2" style={{ justifyContent: isCenter ? "center" : "flex-start" }}>
          <span className="h-px w-6 bg-cyan-400/50" />
          {eyebrow}
        </div>
      )}
      <h2 className="text-3xl md:text-[2.5rem] font-semibold tracking-tight leading-[1.15]">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base md:text-lg text-[color:var(--text-dim)] leading-relaxed">
          {description}
        </p>
      )}
    </Reveal>
  );
}
