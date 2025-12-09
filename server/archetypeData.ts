// Lightweight archetype data for backend use (no frontend asset imports)
export interface ArchetypeInfo {
  id: string;
  title: string;
  tagline: string;
  description: string;
}

export const archetypeData: Record<string, ArchetypeInfo> = {
  'structured-achiever': {
    id: 'structured-achiever',
    title: 'The Structured Achiever',
    tagline: 'You thrive on systems, accountability, and clear goals. Structure is your superpower.',
    description: "You're the person who color-codes their calendar, batch-processes emails, and gets a dopamine hit from checking boxes. When systems are in place, you're unstoppable. But here's the problem: life doesn't always cooperate with your plans.",
  },
  'chaotic-creative': {
    id: 'chaotic-creative',
    title: 'The Chaotic Creative',
    tagline: 'You thrive in organized chaos, driven by inspiration and tight deadlines.',
    description: "Your desk looks like a crime scene, your browser has 47 tabs open, and you do your best work at 2 AM the night before a deadline. To outsiders, you're a mess. To yourself, you're a genius who just needs the right pressure to perform.",
  },
  'anxious-perfectionist': {
    id: 'anxious-perfectionist',
    title: 'The Anxious Perfectionist',
    tagline: 'You set impossibly high standards and struggle with fear of failure.',
    description: "You rewrite the same email five times, agonize over minor details others don't notice, and feel like an impostor even when you're objectively succeeding. Your work is excellent—but the mental cost is brutal.",
  },
  'novelty-seeker': {
    id: 'novelty-seeker',
    title: 'The Novelty Seeker',
    tagline: 'You crave new experiences and struggle to finish what you start.',
    description: "You have 12 half-finished projects, a graveyard of abandoned hobbies, and a brain that lights up for shiny new ideas but goes dark when it's time to execute the boring parts.",
  },
  'strategic-planner': {
    id: 'strategic-planner',
    title: 'The Strategic Planner',
    tagline: 'You excel at big-picture thinking and long-term planning.',
    description: "You see patterns others miss, plan three moves ahead, and excel at connecting dots across complex systems. You're the person who reads strategy books for fun and actually implements the frameworks.",
  },
  'flexible-improviser': {
    id: 'flexible-improviser',
    title: 'The Flexible Improviser',
    tagline: 'You adapt effortlessly to change and thrive in dynamic environments.',
    description: "You're the person everyone wants on their team when plans fall apart. Unexpected changes don't stress you—they energize you. You think on your feet, pivot without panic, and turn chaos into opportunity.",
  },
  'adaptive-generalist': {
    id: 'adaptive-generalist',
    title: 'The Adaptive Generalist',
    tagline: "You don't have one productivity style—you have many. Your superpower is matching approach to context.",
    description: "You scored in the balanced range on most productivity axes. This means you don't strongly prefer one approach over another—you're highly adaptable and context-dependent. Traditional productivity advice says 'find YOUR system and stick to it.' But that's never worked for you.",
  },
};

export function getArchetypeInfo(archetypeId: string): ArchetypeInfo | null {
  return archetypeData[archetypeId] || null;
}
