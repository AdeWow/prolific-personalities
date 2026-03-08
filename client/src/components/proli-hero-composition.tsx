/**
 * Proli mascot hero composition — main Proli centered with 7 archetype
 * variants arranged in a loose arc around it. Used in the homepage hero.
 *
 * Each variant uses a wrapper div for position + rotation, and a nested
 * img for the optional float animation. This avoids the CSS animation
 * overwriting the inline `rotate()` transform.
 */

const variants = [
  { src: "/images/proli/chaotic-creative.png", alt: "Proli Chaotic Creative variant", id: "chaotic-creative" },
  { src: "/images/proli/novelty-seeker.png", alt: "Proli Novelty Seeker variant", id: "novelty-seeker" },
  { src: "/images/proli/strategic-planner.png", alt: "Proli Strategic Planner variant", id: "strategic-planner" },
  { src: "/images/proli/structured-acheiver.png", alt: "Proli Structured Achiever variant", id: "structured-achiever" },
  { src: "/images/proli/anxious-perfectionist.png", alt: "Proli Anxious Perfectionist variant", id: "anxious-perfectionist" },
  { src: "/images/proli/flexible-improviser.png", alt: "Proli Flexible Improviser variant", id: "flexible-improviser" },
  { src: "/images/proli/adaptive-generalist.png", alt: "Proli Adaptive Generalist variant", id: "adaptive-generalist" },
] as const;

/*
 * Desktop positions — clockwise from top-left, relative to the container.
 * Each variant is absolutely positioned; values are percentages.
 * Rotation adds organic tilt so it doesn't feel grid-rigid.
 */
const desktopPositions: Array<{
  top: string; left: string; rotate: string; floatClass?: string;
}> = [
  // 0 — Chaotic Creative (top-left, slight tilt)
  { top: "2%",  left: "8%",  rotate: "-8deg", floatClass: "animate-float-slow" },
  // 1 — Novelty Seeker (top-center, peeking behind main)
  { top: "0%",  left: "40%", rotate: "3deg",  floatClass: "animate-float-mid" },
  // 2 — Strategic Planner (top-right)
  { top: "5%",  left: "72%", rotate: "6deg" },
  // 3 — Structured Achiever (right)
  { top: "42%", left: "80%", rotate: "-4deg", floatClass: "animate-float-fast" },
  // 4 — Anxious Perfectionist (bottom-right)
  { top: "72%", left: "68%", rotate: "5deg" },
  // 5 — Flexible Improviser (bottom-left)
  { top: "70%", left: "10%", rotate: "-6deg" },
  // 6 — Adaptive Generalist (left)
  { top: "40%", left: "0%",  rotate: "4deg" },
];

/* Mobile: main Proli + 3 variants above the headline */
const mobilePositions: Array<{
  top: string; left: string; rotate: string; floatClass?: string;
}> = [
  // 0 — Chaotic Creative (left)
  { top: "10%", left: "2%",  rotate: "-6deg", floatClass: "animate-float-slow" },
  // 1 — Novelty Seeker (top-center, behind main)
  { top: "0%",  left: "38%", rotate: "3deg",  floatClass: "animate-float-mid" },
  // 2 — Strategic Planner (right)
  { top: "10%", left: "72%", rotate: "5deg" },
];

export function ProliHeroComposition() {
  return (
    <>
      {/* ── Desktop / Tablet (≥768px) ─────────────────── */}
      <div
        className="hidden md:block relative w-full max-w-[380px] lg:max-w-[440px] aspect-square mx-auto group"
        role="img"
        aria-label="Proli mascot with 7 archetype variants"
      >
        {/* Archetype variants — behind the main Proli */}
        {variants.map((v, i) => {
          const pos = desktopPositions[i];
          /* Tablet (md-lg): show only 4 variants (indices 0,1,2,6) */
          const tabletHidden = i === 3 || i === 4 || i === 5;
          return (
            <div
              key={v.id}
              className={`absolute ${tabletHidden ? "hidden lg:block" : ""}`}
              style={{
                top: pos.top,
                left: pos.left,
                transform: `rotate(${pos.rotate})`,
              }}
            >
              <img
                src={v.src}
                alt={v.alt}
                loading="eager"
                draggable={false}
                className={`
                  w-[70px] lg:w-[85px] h-auto select-none
                  opacity-85 drop-shadow-sm
                  ${pos.floatClass || ""}
                `}
              />
            </div>
          );
        })}

        {/* Main Proli — front and center */}
        <img
          src="/images/proli/proli.png"
          alt="Proli, the Prolific Personalities mascot"
          loading="eager"
          draggable={false}
          className="absolute w-[180px] lg:w-[220px] h-auto left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 select-none drop-shadow-lg transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </div>

      {/* ── Mobile (<768px) ───────────────────────────── */}
      <div
        className="md:hidden relative w-full max-w-[260px] mx-auto"
        style={{ height: "200px" }}
        role="img"
        aria-label="Proli mascot with archetype variants"
      >
        {/* Show 3 variants on mobile */}
        {variants.slice(0, 3).map((v, i) => {
          const pos = mobilePositions[i];
          return (
            <div
              key={v.id}
              className="absolute"
              style={{
                top: pos.top,
                left: pos.left,
                transform: `rotate(${pos.rotate})`,
              }}
            >
              <img
                src={v.src}
                alt={v.alt}
                loading="eager"
                draggable={false}
                className={`
                  w-[55px] h-auto select-none
                  opacity-85 drop-shadow-sm
                  ${pos.floatClass || ""}
                `}
              />
            </div>
          );
        })}

        {/* Main Proli */}
        <img
          src="/images/proli/proli.png"
          alt="Proli, the Prolific Personalities mascot"
          loading="eager"
          draggable={false}
          className="absolute w-[130px] h-auto left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 select-none drop-shadow-lg"
        />
      </div>
    </>
  );
}
