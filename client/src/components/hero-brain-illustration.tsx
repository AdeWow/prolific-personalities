/**
 * Abstract constellation illustration representing the 7 productivity archetypes.
 * Used in the homepage hero section. Pure SVG, no external images.
 */
export function HeroBrainIllustration() {
  // 7 archetype nodes arranged in a heptagon (r=90, center=160,160)
  const archetypes = [
    { color: '#14B8A6', x: 160, y: 70 },    // Structured Achiever — teal
    { color: '#A855F7', x: 230, y: 104 },   // Chaotic Creative — purple
    { color: '#3B82F6', x: 248, y: 180 },   // Anxious Perfectionist — blue
    { color: '#F97316', x: 199, y: 241 },   // Novelty Seeker — orange
    { color: '#22C55E', x: 121, y: 241 },   // Strategic Planner — green
    { color: '#EAB308', x: 72, y: 180 },    // Flexible Improviser — yellow
    { color: '#6366F1', x: 90, y: 104 },    // Adaptive Generalist — indigo
  ];

  const cx = 160;
  const cy = 160;

  // Heptagon edges (adjacent node connections)
  const edges = archetypes.map((_, i) => [i, (i + 1) % 7] as const);

  // Cross connections for visual depth (skip-1 connections)
  const crossEdges: readonly (readonly [number, number])[] = [
    [0, 2], [1, 3], [2, 4], [3, 5], [4, 6], [5, 0], [6, 1],
  ];

  return (
    <svg
      viewBox="0 0 320 320"
      className="w-52 h-52 sm:w-64 sm:h-64 lg:w-80 lg:h-80"
      role="img"
      aria-label="Abstract illustration of 7 interconnected productivity archetypes"
    >
      <defs>
        {archetypes.map((a, i) => (
          <radialGradient key={i} id={`hero-glow-${i}`}>
            <stop offset="0%" stopColor={a.color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={a.color} stopOpacity="0" />
          </radialGradient>
        ))}
      </defs>

      {/* Subtle reference rings */}
      <circle cx={cx} cy={cy} r="100" fill="none" stroke="currentColor" strokeOpacity="0.05" strokeWidth="1" />
      <circle cx={cx} cy={cy} r="55" fill="none" stroke="currentColor" strokeOpacity="0.04" strokeWidth="0.75" />

      {/* Cross connections (lighter) */}
      {crossEdges.map(([a, b], i) => (
        <line
          key={`cross-${i}`}
          x1={archetypes[a].x} y1={archetypes[a].y}
          x2={archetypes[b].x} y2={archetypes[b].y}
          stroke="currentColor" strokeOpacity="0.06" strokeWidth="1"
        />
      ))}

      {/* Spoke lines from center to each node */}
      {archetypes.map((a, i) => (
        <line
          key={`spoke-${i}`}
          x1={cx} y1={cy} x2={a.x} y2={a.y}
          stroke={a.color} strokeOpacity="0.12" strokeWidth="1"
        />
      ))}

      {/* Heptagon edges */}
      {edges.map(([a, b], i) => (
        <line
          key={`edge-${i}`}
          x1={archetypes[a].x} y1={archetypes[a].y}
          x2={archetypes[b].x} y2={archetypes[b].y}
          stroke="currentColor" strokeOpacity="0.1" strokeWidth="1.5"
        />
      ))}

      {/* Glow behind each node */}
      {archetypes.map((a, i) => (
        <circle key={`glow-${i}`} cx={a.x} cy={a.y} r="26" fill={`url(#hero-glow-${i})`} />
      ))}

      {/* Center dot — brand teal */}
      <circle cx={cx} cy={cy} r="5" fill="hsl(172, 34%, 43%)" opacity="0.35" />

      {/* Archetype nodes */}
      {archetypes.map((a, i) => (
        <circle key={`node-${i}`} cx={a.x} cy={a.y} r="10" fill={a.color} opacity="0.85" />
      ))}
    </svg>
  );
}
