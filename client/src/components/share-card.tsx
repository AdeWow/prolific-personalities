/**
 * ShareCard — styled archetype result card rendered at exact pixel
 * dimensions for social-media sharing. Captured by html2canvas on demand.
 *
 * Two variants:
 *  - portrait  (540 × 960) — stories / download
 *  - landscape (1200 × 630) — Twitter / OG
 *
 * Uses inline styles + system fonts so html2canvas renders reliably.
 */

import { forwardRef } from "react";

/* ── Per-archetype brand hex colours ─────────────────────────── */
const brandColors: Record<string, string> = {
  "chaotic-creative": "#F97316",
  "anxious-perfectionist": "#0EA5E9",
  "structured-achiever": "#22C55E",
  "novelty-seeker": "#A855F7",
  "strategic-planner": "#3B82F6",
  "flexible-improviser": "#14B8A6",
  "adaptive-generalist": "#6366F1",
};

/* ── Proli mascot paths (note: structured-acheiver filename typo) ── */
const proliImageMap: Record<string, string> = {
  "structured-achiever": "/images/proli/structured-acheiver.png",
  "chaotic-creative": "/images/proli/chaotic-creative.png",
  "anxious-perfectionist": "/images/proli/anxious-perfectionist.png",
  "novelty-seeker": "/images/proli/novelty-seeker.png",
  "strategic-planner": "/images/proli/strategic-planner.png",
  "flexible-improviser": "/images/proli/flexible-improviser.png",
  "adaptive-generalist": "/images/proli/adaptive-generalist.png",
};

/* ── One-liner quotes per archetype ──────────────────────────── */
const quotes: Record<string, string> = {
  "anxious-perfectionist":
    "Your standards are a superpower \u2014 when they stop paralyzing you.",
  "structured-achiever":
    "You don\u2019t need more systems. You need the right ones.",
  "chaotic-creative":
    "Your chaos isn\u2019t the problem. Fighting it is.",
  "novelty-seeker":
    "You don\u2019t lack focus. You have a different kind of focus.",
  "strategic-planner":
    "Strategy without execution is just daydreaming with spreadsheets.",
  "flexible-improviser":
    "You don\u2019t need a plan. You need anchor points.",
  "adaptive-generalist":
    "You\u2019re not indecisive. You\u2019re context-dependent.",
};

/* ── Four trait tags per archetype ────────────────────────────── */
const traitTags: Record<string, string[]> = {
  "anxious-perfectionist": [
    "Detail-Oriented",
    "High Standards",
    "Revision-Prone",
    "Quality-Driven",
  ],
  "structured-achiever": [
    "System Builder",
    "Goal-Focused",
    "Efficiency-Driven",
    "Disciplined",
  ],
  "chaotic-creative": [
    "Idea Generator",
    "Energy-Driven",
    "Non-Linear",
    "Spontaneous",
  ],
  "novelty-seeker": [
    "Variety-Driven",
    "Quick Starter",
    "Multi-Passionate",
    "Excitement-Fueled",
  ],
  "strategic-planner": [
    "Big-Picture Thinker",
    "Plan-Heavy",
    "Execution Gap",
    "Vision-Driven",
  ],
  "flexible-improviser": [
    "Adaptable",
    "Flow-Based",
    "Anti-System",
    "Reactive",
  ],
  "adaptive-generalist": [
    "Context-Switcher",
    "Versatile",
    "Multi-Method",
    "Balanced",
  ],
};

/* ── Shared style constants ──────────────────────────────────── */
const FONT =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

/* ── Component ───────────────────────────────────────────────── */

interface ShareCardProps {
  archetypeId: string;
  archetypeName: string;
  variant: "portrait" | "landscape";
}

export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(
  ({ archetypeId, archetypeName, variant }, ref) => {
    const color = brandColors[archetypeId] || "#6366F1";
    const quote = quotes[archetypeId] || "";
    const tags = traitTags[archetypeId] || [];
    const proliSrc = proliImageMap[archetypeId] || "/images/proli/proli.png";

    /* ── Portrait (540 × 960) ───────────────────────────── */
    if (variant === "portrait") {
      return (
        <div
          ref={ref}
          style={{
            width: 540,
            height: 960,
            background: `linear-gradient(180deg, ${color}12 0%, ${color}30 55%, ${color} 100%)`,
            fontFamily: FONT,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "48px 40px 0",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Top pill */}
          <div
            style={{
              backgroundColor: `${color}25`,
              borderRadius: 20,
              padding: "8px 20px",
              marginBottom: 36,
            }}
          >
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#1e293b",
              }}
            >
              My Productivity Archetype
            </span>
          </div>

          {/* Proli mascot */}
          <img
            src={proliSrc}
            alt=""
            crossOrigin="anonymous"
            style={{
              width: 200,
              height: "auto",
              marginBottom: 28,
              filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.12))",
            }}
          />

          {/* Archetype name */}
          <h2
            style={{
              fontSize: 36,
              fontWeight: 800,
              color: "#0f172a",
              textAlign: "center",
              margin: "0 0 14px 0",
              lineHeight: 1.2,
            }}
          >
            {archetypeName}
          </h2>

          {/* Quote */}
          <p
            style={{
              fontSize: 17,
              fontStyle: "italic",
              color: "#334155",
              textAlign: "center",
              margin: "0 0 24px 0",
              lineHeight: 1.5,
              maxWidth: 420,
            }}
          >
            &ldquo;{quote}&rdquo;
          </p>

          {/* Trait tags */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 8,
              marginBottom: "auto",
            }}
          >
            {tags.map((tag) => (
              <span
                key={tag}
                style={{
                  backgroundColor: "rgba(255,255,255,0.7)",
                  borderRadius: 16,
                  padding: "6px 14px",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#334155",
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Bottom CTA bar */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: "#0f172a",
              padding: "18px 0",
              textAlign: "center",
            }}
          >
            <span style={{ fontSize: 15, fontWeight: 600, color: "#ffffff" }}>
              Find yours &rarr; prolificpersonalities.com/quiz
            </span>
          </div>
        </div>
      );
    }

    /* ── Landscape (1200 × 630) ─────────────────────────── */
    return (
      <div
        ref={ref}
        style={{
          width: 1200,
          height: 630,
          background: `linear-gradient(135deg, ${color}12 0%, ${color}30 50%, ${color} 100%)`,
          fontFamily: FONT,
          display: "flex",
          alignItems: "center",
          padding: "0 64px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Left: Proli */}
        <div style={{ flex: "0 0 auto", marginRight: 56 }}>
          <img
            src={proliSrc}
            alt=""
            crossOrigin="anonymous"
            style={{
              width: 260,
              height: "auto",
              filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.12))",
            }}
          />
        </div>

        {/* Right: text content */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              backgroundColor: `${color}25`,
              borderRadius: 20,
              padding: "6px 16px",
              display: "inline-block",
              marginBottom: 20,
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#1e293b",
              }}
            >
              My Productivity Archetype
            </span>
          </div>

          <h2
            style={{
              fontSize: 48,
              fontWeight: 800,
              color: "#0f172a",
              margin: "0 0 14px 0",
              lineHeight: 1.1,
            }}
          >
            {archetypeName}
          </h2>

          <p
            style={{
              fontSize: 20,
              fontStyle: "italic",
              color: "#334155",
              margin: "0 0 28px 0",
              lineHeight: 1.4,
              maxWidth: 500,
            }}
          >
            &ldquo;{quote}&rdquo;
          </p>

          <span style={{ fontSize: 16, fontWeight: 600, color: "#475569" }}>
            Find yours &rarr; prolificpersonalities.com/quiz
          </span>
        </div>
      </div>
    );
  },
);

ShareCard.displayName = "ShareCard";
