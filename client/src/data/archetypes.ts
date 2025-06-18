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
    id: 'accelerator',
    name: 'The Accelerator',
    title: 'High-Energy Achiever',
    description: 'High-energy, deadline-driven achiever who thrives under pressure and delivers results fast.',
    icon: 'fas fa-rocket',
    color: 'red',
    gradientFrom: 'from-red-400',
    gradientTo: 'to-pink-400',
    tags: ['Fast-paced', 'Goal-oriented', 'Competitive'],
    strengths: [
      'Thrives under pressure',
      'Quick decision making',
      'High energy execution',
      'Deadline focused'
    ],
    growthAreas: [
      'Patience with details',
      'Long-term planning',
      'Work-life balance',
      'Quality over speed'
    ],
    tools: [
      { name: 'Sprint Planning', match: 95 },
      { name: 'Deadline Tracking', match: 92 },
      { name: 'Quick Wins', match: 88 }
    ],
    scoreRanges: {
      structure: { min: -10, max: 10 },
      motivation: { min: 20, max: 40 },
      cognitive: { min: -10, max: 10 },
      task: { min: -10, max: 10 }
    }
  },
  {
    id: 'strategist',
    name: 'The Strategist',
    title: 'Methodical Planner',
    description: 'Methodical planner who excels at long-term thinking and systematic approach to complex projects.',
    icon: 'fas fa-chess',
    color: 'blue',
    gradientFrom: 'from-blue-400',
    gradientTo: 'to-indigo-400',
    tags: ['Strategic', 'Organized', 'Systematic'],
    strengths: [
      'Strategic planning',
      'Risk assessment',
      'Long-term vision',
      'Systematic execution'
    ],
    growthAreas: [
      'Delegation skills',
      'Adaptability',
      'Quick decisions',
      'Spontaneity'
    ],
    tools: [
      { name: 'Project Planning', match: 95 },
      { name: 'Time Blocking', match: 88 },
      { name: 'Goal Tracking', match: 92 }
    ],
    scoreRanges: {
      structure: { min: 20, max: 40 },
      motivation: { min: -10, max: 20 },
      cognitive: { min: 10, max: 30 },
      task: { min: -20, max: 10 }
    }
  },
  {
    id: 'innovator',
    name: 'The Innovator',
    title: 'Creative Problem-Solver',
    description: 'Creative problem-solver who generates breakthrough ideas and thrives on variety and experimentation.',
    icon: 'fas fa-lightbulb',
    color: 'green',
    gradientFrom: 'from-green-400',
    gradientTo: 'to-emerald-400',
    tags: ['Creative', 'Flexible', 'Experimental'],
    strengths: [
      'Creative thinking',
      'Problem solving',
      'Adaptability',
      'Innovation'
    ],
    growthAreas: [
      'Follow-through',
      'Routine tasks',
      'Structure',
      'Consistency'
    ],
    tools: [
      { name: 'Brainstorming', match: 95 },
      { name: 'Mind Mapping', match: 90 },
      { name: 'Experimentation', match: 88 }
    ],
    scoreRanges: {
      structure: { min: -20, max: 10 },
      motivation: { min: 0, max: 30 },
      cognitive: { min: 20, max: 40 },
      task: { min: -10, max: 20 }
    }
  },
  {
    id: 'collaborator',
    name: 'The Collaborator',
    title: 'Team-Oriented Achiever',
    description: 'Team-oriented achiever who maximizes productivity through relationships and shared goals.',
    icon: 'fas fa-users',
    color: 'purple',
    gradientFrom: 'from-purple-400',
    gradientTo: 'to-violet-400',
    tags: ['Social', 'Supportive', 'Inclusive'],
    strengths: [
      'Team building',
      'Communication',
      'Consensus building',
      'Mentoring'
    ],
    growthAreas: [
      'Independent work',
      'Difficult conversations',
      'Solo decision making',
      'Personal boundaries'
    ],
    tools: [
      { name: 'Team Collaboration', match: 95 },
      { name: 'Communication', match: 92 },
      { name: 'Shared Goals', match: 88 }
    ],
    scoreRanges: {
      structure: { min: -10, max: 20 },
      motivation: { min: 0, max: 25 },
      cognitive: { min: -10, max: 20 },
      task: { min: -40, max: -10 }
    }
  },
  {
    id: 'harmonizer',
    name: 'The Harmonizer',
    title: 'Balanced Achiever',
    description: 'Balanced achiever who integrates work and life seamlessly while maintaining steady progress.',
    icon: 'fas fa-balance-scale',
    color: 'amber',
    gradientFrom: 'from-amber-400',
    gradientTo: 'to-orange-400',
    tags: ['Balanced', 'Steady', 'Sustainable'],
    strengths: [
      'Work-life balance',
      'Sustainable pace',
      'Stress management',
      'Holistic thinking'
    ],
    growthAreas: [
      'Urgency',
      'Ambition',
      'Risk taking',
      'Speed'
    ],
    tools: [
      { name: 'Balance Tracking', match: 95 },
      { name: 'Wellness', match: 90 },
      { name: 'Boundaries', match: 85 }
    ],
    scoreRanges: {
      structure: { min: 0, max: 25 },
      motivation: { min: -20, max: 10 },
      cognitive: { min: -10, max: 15 },
      task: { min: 10, max: 40 }
    }
  },
  {
    id: 'analyzer',
    name: 'The Analyzer',
    title: 'Detail-Oriented Perfectionist',
    description: 'Detail-oriented perfectionist who excels at deep work and produces high-quality, thorough results.',
    icon: 'fas fa-microscope',
    color: 'teal',
    gradientFrom: 'from-teal-400',
    gradientTo: 'to-cyan-400',
    tags: ['Analytical', 'Thorough', 'Precise'],
    strengths: [
      'Deep analysis',
      'Quality control',
      'Attention to detail',
      'Research skills'
    ],
    growthAreas: [
      'Speed',
      'Delegation',
      'Big picture',
      'Perfectionism'
    ],
    tools: [
      { name: 'Deep Work', match: 95 },
      { name: 'Quality Control', match: 92 },
      { name: 'Analysis Tools', match: 90 }
    ],
    scoreRanges: {
      structure: { min: 15, max: 35 },
      motivation: { min: -15, max: 15 },
      cognitive: { min: 15, max: 40 },
      task: { min: 10, max: 35 }
    }
  }
];
