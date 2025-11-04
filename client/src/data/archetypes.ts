export interface Archetype {
  id: string;
  name: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  tags: string[];
  strengths: string[];
  growthAreas: string[];
  tools: Array<{
    name: string;
    match: number;
  }>;
  scoreRanges: {
    structure: { min: number; max: number };
    motivation: { min: number; max: number };
    cognitive: { min: number; max: number };
    task: { min: number; max: number };
  };
}

export const archetypes: Archetype[] = [
  {
    id: 'structured-achiever',
    name: 'The Structured Achiever',
    title: 'Organized Goal-Crusher',
    description: 'Highly organized, externally motivated achiever who thrives on clear goals, accountability, and detailed execution. You need structure and external validation to perform at your best.',
    icon: 'fas fa-trophy',
    color: 'blue',
    gradientFrom: 'from-blue-400',
    gradientTo: 'to-indigo-400',
    tags: ['Organized', 'Goal-oriented', 'Detail-focused'],
    strengths: [
      'Excellent at following through on commitments',
      'Thrives with clear deadlines and accountability',
      'Detail-oriented execution',
      'Responds well to external rewards and recognition'
    ],
    growthAreas: [
      'Self-motivation without external pressure',
      'Flexibility when plans change',
      'Big-picture strategic thinking',
      'Working without clear structure'
    ],
    tools: [
      { name: 'Accountability Apps', match: 95 },
      { name: 'Deadline Trackers', match: 92 },
      { name: 'Detailed Task Lists', match: 90 }
    ],
    scoreRanges: {
      structure: { min: 22, max: 35 },
      motivation: { min: 22, max: 35 },
      cognitive: { min: 7, max: 21 },
      task: { min: 7, max: 21 }
    }
  },
  {
    id: 'chaotic-creative',
    name: 'The Chaotic Creative',
    title: 'Free-Spirited Innovator',
    description: 'Flexible, intrinsically motivated creative who thrives on big-picture thinking but struggles with task initiation and structure. You need freedom to explore but may procrastinate on execution.',
    icon: 'fas fa-palette',
    color: 'purple',
    gradientFrom: 'from-purple-400',
    gradientTo: 'to-violet-400',
    tags: ['Creative', 'Flexible', 'Visionary'],
    strengths: [
      'Innovative big-picture thinking',
      'Adaptable to changing circumstances',
      'Self-motivated by personal interest',
      'Creative problem solving'
    ],
    growthAreas: [
      'Starting tasks without overthinking',
      'Working within structured systems',
      'Attention to execution details',
      'Meeting external deadlines'
    ],
    tools: [
      { name: 'Creative Capture Tools', match: 95 },
      { name: 'Gentle Accountability', match: 88 },
      { name: 'Mind Mapping', match: 92 }
    ],
    scoreRanges: {
      structure: { min: 7, max: 21 },
      motivation: { min: 7, max: 21 },
      cognitive: { min: 22, max: 35 },
      task: { min: 22, max: 35 }
    }
  },
  {
    id: 'anxious-perfectionist',
    name: 'The Anxious Perfectionist',
    title: 'Detail-Obsessed Procrastinator',
    description: 'Structured, detail-oriented perfectionist who excels at quality work but struggles with task avoidance due to high standards and anxiety about starting.',
    icon: 'fas fa-microscope',
    color: 'teal',
    gradientFrom: 'from-teal-400',
    gradientTo: 'to-cyan-400',
    tags: ['Perfectionist', 'Detail-oriented', 'Anxious'],
    strengths: [
      'Exceptional attention to detail',
      'High-quality, thorough work',
      'Systematic problem-solving',
      'Strong analytical skills'
    ],
    growthAreas: [
      'Starting tasks without perfect conditions',
      'Managing anxiety and overwhelm',
      'Accepting "good enough"',
      'Overcoming procrastination patterns'
    ],
    tools: [
      { name: 'Pomodoro Technique', match: 92 },
      { name: 'Task Breakdown Systems', match: 90 },
      { name: 'Anxiety Management', match: 88 }
    ],
    scoreRanges: {
      structure: { min: 22, max: 35 },
      motivation: { min: 7, max: 28 },
      cognitive: { min: 7, max: 21 },
      task: { min: 22, max: 35 }
    }
  },
  {
    id: 'novelty-seeker',
    name: 'The Novelty Seeker',
    title: 'Stimulus-Driven Explorer',
    description: 'Flexible, externally motivated innovator who craves novelty and needs external stimulation. You thrive on big-picture ideas and variety but require accountability to maintain focus.',
    icon: 'fas fa-rocket',
    color: 'red',
    gradientFrom: 'from-red-400',
    gradientTo: 'to-pink-400',
    tags: ['Novelty-driven', 'Energetic', 'Visionary'],
    strengths: [
      'Thrives in dynamic, changing environments',
      'Quick to spot new opportunities',
      'High energy and enthusiasm',
      'Creative big-picture thinking'
    ],
    growthAreas: [
      'Sustained focus on one project',
      'Follow-through on routine tasks',
      'Self-directed motivation',
      'Working independently without external stimulation'
    ],
    tools: [
      { name: 'Gamification Apps', match: 95 },
      { name: 'Accountability Partners', match: 92 },
      { name: 'Novelty-based Planning', match: 90 }
    ],
    scoreRanges: {
      structure: { min: 7, max: 21 },
      motivation: { min: 22, max: 35 },
      cognitive: { min: 22, max: 35 },
      task: { min: 7, max: 35 }
    }
  },
  {
    id: 'strategic-planner',
    name: 'The Strategic Planner',
    title: 'Visionary Architect',
    description: 'Structured, intrinsically motivated strategist who combines big-picture thinking with methodical execution. You excel at long-term planning and self-directed goal achievement.',
    icon: 'fas fa-chess',
    color: 'indigo',
    gradientFrom: 'from-indigo-400',
    gradientTo: 'to-blue-400',
    tags: ['Strategic', 'Self-motivated', 'Visionary'],
    strengths: [
      'Excellent long-term strategic planning',
      'Self-motivated and disciplined',
      'Balances vision with execution',
      'Systematic approach to complex goals'
    ],
    growthAreas: [
      'Flexibility when plans need adjustment',
      'Delegating and trusting others',
      'Quick tactical decisions',
      'Attention to small details'
    ],
    tools: [
      { name: 'Strategic Planning Tools', match: 95 },
      { name: 'Vision Boards', match: 90 },
      { name: 'Long-term Goal Trackers', match: 92 }
    ],
    scoreRanges: {
      structure: { min: 22, max: 35 },
      motivation: { min: 7, max: 21 },
      cognitive: { min: 22, max: 35 },
      task: { min: 7, max: 21 }
    }
  },
  {
    id: 'flexible-improviser',
    name: 'The Flexible Improviser',
    title: 'Adaptive Action-Taker',
    description: 'Action-oriented, flexible executor who excels at starting tasks and adapting on the fly. You thrive with ambiguity and prefer momentum over planning.',
    icon: 'fas fa-running',
    color: 'green',
    gradientFrom: 'from-green-400',
    gradientTo: 'to-emerald-400',
    tags: ['Action-oriented', 'Flexible', 'Adaptive'],
    strengths: [
      'Quick to start and take action',
      'Adapts easily to changing circumstances',
      'Comfortable with ambiguity',
      'Maintains momentum and energy'
    ],
    growthAreas: [
      'Long-term strategic planning',
      'Working within rigid structures',
      'Detailed analysis before action',
      'Consistency in routines'
    ],
    tools: [
      { name: 'Quick Capture Apps', match: 95 },
      { name: 'Flexible Planning Tools', match: 90 },
      { name: 'Momentum Trackers', match: 88 }
    ],
    scoreRanges: {
      structure: { min: 7, max: 21 },
      motivation: { min: 7, max: 28 },
      cognitive: { min: 7, max: 28 },
      task: { min: 7, max: 21 }
    }
  }
];
