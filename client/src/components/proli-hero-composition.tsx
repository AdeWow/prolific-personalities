/**
 * Proli mascot hero composition — main Proli centered with 7 archetype
 * variants arranged in a loose arc around it. Used in the homepage hero.
 *
 * Each variant uses a wrapper div for position + rotation, a float div
 * (animate-float-*) that moves img + label together, and a nested hover
 * scale div. This keeps rotate, float, and scale on separate elements.
 *
 * Features:
 * - Archetype labels below each variant (always visible)
 * - SVG connection lines from variants to center (desktop only)
 * - Hover: line brightens, label darkens, image scales up (desktop)
 * - prefers-reduced-motion handled by global CSS rule
 */

import { useState } from "react";

const variants = [
  { src: "/images/proli/chaotic-creative.png", alt: "Proli Chaotic Creative variant", id: "chaotic-creative", label: "Chaotic Creative" },
  { src: "/images/proli/novelty-seeker.png", alt: "Proli Novelty Seeker variant", id: "novelty-seeker", label: "Novelty Seeker" },
  { src: "/images/proli/strategic-planner.png", alt: "Proli Strategic Planner variant", id: "strategic-planner", label: "Strategic Planner" },
  { src: "/images/proli/structured-acheiver.png", alt: "Proli Structured Achiever variant", id: "structured-achiever", label: "Structured Achiever" },
  { src: "/images/proli/anxious-perfectionist.png", alt: "Proli Anxious Perfectionist variant", id: "anxious-perfectionist", label: "Anxious Perfectionist" },
  { src: "/images/proli/flexible-improviser.png", alt: "Proli Flexible Improviser variant", id: "flexible-improviser", label: "Flexible Improviser" },
  { src: "/images/proli/adaptive-generalist.png", alt: "Proli Adaptive Generalist variant", id: "adaptive-generalist", label: "Adaptive Generalist" },
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
  { top: "14%", left: "18%", rotate: "-8deg", floatClass: "animate-float-slow" },
  // 1 — Novelty Seeker (top-center, peeking behind main)
  { top: "10%", left: "42%", rotate: "3deg",  floatClass: "animate-float-mid" },
  // 2 — Strategic Planner (top-right)
  { top: "16%", left: "64%", rotate: "6deg" },
  // 3 — Structured Achiever (right)
  { top: "44%", left: "70%", rotate: "-4deg", floatClass: "animate-float-fast" },
  // 4 — Anxious Perfectionist (bottom-right)
  { top: "66%", left: "62%", rotate: "5deg" },
  // 5 — Flexible Improviser (bottom-left)
  { top: "64%", left: "20%", rotate: "-6deg" },
  // 6 — Adaptive Generalist (left)
  { top: "42%", left: "12%", rotate: "4deg" },
];

/*
 * Approximate center-points of each variant in % of the container.
 * Used for SVG connection lines. Main Proli sits at (50, 50).
 */
const lineCenters = [
  { x: 27, y: 24 },   // 0 — Chaotic Creative
  { x: 51, y: 20 },   // 1 — Novelty Seeker
  { x: 73, y: 26 },   // 2 — Strategic Planner
  { x: 79, y: 54 },   // 3 — Structured Achiever
  { x: 71, y: 76 },   // 4 — Anxious Perfectionist
  { x: 29, y: 74 },   // 5 — Flexible Improviser
  { x: 21, y: 52 },   // 6 — Adaptive Generalist
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
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <>
      {/* ── Desktop / Tablet (≥768px) ─────────────────── */}
      <div
        className="hidden md:block relative w-full max-w-[380px] lg:max-w-[440px] aspect-square mx-auto group"
        role="img"
        aria-label="Proli mascot with 7 archetype variants"
      >
        {/* SVG connection lines — lg+ only */}
        <svg
          className="absolute inset-0 w-full h-full z-[5] pointer-events-none hidden lg:block"
          viewBox="0 0 100 100"
        >
          {lineCenters.map((ep, i) => (
            <line
              key={i}
              x1={ep.x}
              y1={ep.y}
              x2={50}
              y2={50}
              style={{
                stroke: "currentColor",
                strokeWidth: hoveredIdx === i ? 1.2 : 0.4,
                opacity: hoveredIdx === i ? 0.35 : 0.1,
                transition: "opacity 0.3s ease, stroke-width 0.3s ease",
              }}
              className="text-muted-foreground"
            />
          ))}
        </svg>

        {/* Archetype variants — behind the main Proli */}
        {variants.map((v, i) => {
          const pos = desktopPositions[i];
          /* Tablet (md-lg): show only 4 variants (indices 0,1,2,6) */
          const tabletHidden = i === 3 || i === 4 || i === 5;
          const isHovered = hoveredIdx === i;
          const counterRotate = -parseFloat(pos.rotate);

          return (
            <div
              key={v.id}
              className={`absolute ${tabletHidden ? "hidden lg:block" : ""}`}
              style={{
                top: pos.top,
                left: pos.left,
                transform: `rotate(${pos.rotate})`,
              }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Float wrapper — moves img + label together */}
              <div className={pos.floatClass || ""}>
                {/* Hover scale wrapper (separate from float translateY) */}
                <div className={`transition-transform duration-300 ${isHovered ? "scale-110" : ""}`}>
                  <img
                    src={v.src}
                    alt={v.alt}
                    loading="eager"
                    draggable={false}
                    className="w-[70px] lg:w-[85px] h-auto select-none opacity-85 drop-shadow-sm"
                  />
                  {/* Archetype label — counter-rotated to stay horizontal */}
                  <span
                    className={`
                      block text-center text-[10px] lg:text-[12px] font-medium
                      -mt-0.5 whitespace-nowrap select-none pointer-events-none
                      transition-colors duration-300
                      ${isHovered ? "text-foreground" : "text-muted-foreground/60"}
                    `}
                    style={{ transform: `rotate(${counterRotate}deg)` }}
                  >
                    {v.label}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Main Proli — front and center */}
        <img
          src="/images/proli/proli.png"
          alt="Proli, the Prolific Personalities mascot"
          loading="eager"
          draggable={false}
          className="absolute w-[170px] lg:w-[210px] h-auto left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 select-none drop-shadow-lg transition-transform duration-500 group-hover:scale-[1.02]"
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
          const counterRotate = -parseFloat(pos.rotate);

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
              {/* Float wrapper — moves img + label together */}
              <div className={pos.floatClass || ""}>
                <img
                  src={v.src}
                  alt={v.alt}
                  loading="eager"
                  draggable={false}
                  className="w-[55px] h-auto select-none opacity-85 drop-shadow-sm"
                />
                {/* Mobile label — smaller font, no hover effects */}
                <span
                  className="block text-center text-[9px] font-medium -mt-0.5 whitespace-nowrap select-none pointer-events-none text-muted-foreground/60"
                  style={{ transform: `rotate(${counterRotate}deg)` }}
                >
                  {v.label}
                </span>
              </div>
            </div>
          );
        })}

        {/* Main Proli */}
        <img
          src="/images/proli/proli.png"
          alt="Proli, the Prolific Personalities mascot"
          loading="eager"
          draggable={false}
          className="absolute w-[110px] h-auto left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 select-none drop-shadow-lg"
        />
      </div>
    </>
  );
}
