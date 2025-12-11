import anxiousPerfectionistImage from "@assets/7d8c5462-febe-45f3-b3bd-207fb697cc04_1762297180709.png";
import chaoticCreativeImage from "@assets/763894fc-7172-473f-b45a-30417b2f157a_1762297193215.png";
import strategicPlannerImage from "@assets/ae5e43be-19bd-4df2-b053-48732a922fc6_1762297362107.png";
import structuredAchieverImage from "@assets/e3fac029-7f4f-4a16-a237-d141ea58b5d6_1762297404337.png";
import flexibleImproviserImage from "@assets/84c5e71b-0e9d-4158-b8a2-ea2b5f1f0abd_1762297453206.png";
import noveltySeekerImage from "@assets/56861868-15df-4eb4-a0ae-f1629437f82e_1762297512686.png";
import adaptiveGeneralistImage from "@assets/d9e893a7-c0ec-4b6f-92b2-d9222bdeafbc_1765447835628.png";

export interface Archetype {
  id: string;
  name: string;
  title: string;
  tagline: string;
  icon: string;
  image?: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  tags: string[];
  struggle: string[];
  superpowers: Array<{
    title: string;
    description: string;
  }>;
  blockers: Array<{
    title: string;
    description: string;
  }>;
  quickWins: Array<{
    title: string;
    description: string;
  }>;
  framework: {
    name: string;
    why: string;
  };
  premiumIncludes: {
    frameworks: string[];
    tools: string[];
    plan: string[];
    special: string[];
  };
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
    tagline: 'You thrive on systems, accountability, and clear goals. Structure is your superpower.',
    icon: '📊',
    image: structuredAchieverImage,
    color: 'blue',
    gradientFrom: 'from-blue-400',
    gradientTo: 'to-indigo-400',
    tags: ['Organized', 'Goal-oriented', 'Detail-focused'],
    struggle: [
      "You're the person who color-codes their calendar, batch-processes emails, and gets a dopamine hit from checking boxes. When systems are in place, you're unstoppable. But here's the problem: life doesn't always cooperate with your plans.",
      "Unexpected changes derail you. Open-ended creative projects feel paralyzing without clear success metrics. You might over-optimize systems instead of doing the work (hello, productivity porn). And when external accountability disappears—remote work, self-directed projects—your motivation can crater.",
      "Research shows that highly conscientious individuals excel in structured environments but struggle when ambiguity is high or when intrinsic motivation is required. You're not broken—you're just mismatched with environments that require constant improvisation."
    ],
    superpowers: [
      { title: 'Reliability', description: 'When you commit, you deliver. Deadlines are sacred.' },
      { title: 'Efficiency', description: 'You optimize workflows others find tedious.' },
      { title: 'Accountability', description: 'External deadlines and team expectations drive you to excellence.' },
      { title: 'Execution', description: 'Once the plan is clear, you execute flawlessly.' }
    ],
    blockers: [
      { title: 'Ambiguous goals', description: 'You freeze without clear success criteria' },
      { title: 'Lack of external accountability', description: 'Solo work feels unmotivating' },
      { title: 'Over-planning', description: 'You spend more time optimizing systems than doing the work' }
    ],
    quickWins: [
      { 
        title: 'Time-Box Your Planning', 
        description: 'Set a 15-minute timer for planning each day. When it rings, stop planning and start executing. Over-planning is procrastination in disguise for your type.' 
      },
      { 
        title: 'Create Fake Deadlines', 
        description: 'Tell a friend, colleague, or online community when you will finish something. Public commitment = external accountability = your motivational fuel.' 
      },
      { 
        title: 'Use Implementation Intentions', 
        description: 'For any vague task, rewrite it as: "When [trigger], I will [specific action]." Example: "When I sit at my desk at 9am, I will write 500 words before checking email."' 
      }
    ],
    framework: {
      name: '📅 Time Blocking (Cal Newport Method)',
      why: 'Transforms abstract time into concrete appointments. Gives you the structure and external commitment your brain craves.'
    },
    premiumIncludes: {
      frameworks: ['Time Blocking (with templates)', 'Implementation Intentions', 'External Brain / GTD-Lite'],
      tools: ['Best calendar apps for time blocking', 'Accountability apps (Focusmate, Beeminder)', 'Project management for solo work'],
      plan: ['Week 1: Build your time blocking system', 'Week 2: Create accountability loops', 'Week 3: Handle unexpected changes without derailing', 'Week 4: Optimize and sustain'],
      special: ['How to stop over-optimizing', 'Working without external deadlines', 'Handling creative, ambiguous projects']
    },
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
    tagline: 'Your mind is a fireworks show of ideas. The challenge? Turning sparks into finished projects.',
    icon: '🎨',
    image: chaoticCreativeImage,
    color: 'purple',
    gradientFrom: 'from-purple-400',
    gradientTo: 'to-violet-400',
    tags: ['Creative', 'Flexible', 'Visionary'],
    struggle: [
      "You're brilliant at connecting dots, seeing possibilities, and generating ideas that make others go \"whoa.\" But here's what nobody tells you: your brain is wired for exploration, not execution.",
      "Starting projects feels electric. Finishing them feels like death by a thousand paper cuts. You've got 47 tabs open, 12 unfinished projects, and a graveyard of abandoned plans. When something becomes routine, your brain screams \"BORING!\" and wanders off to the next shiny thing.",
      "Research on executive function shows that task initiation and sustained attention are separate neural systems—you're strong on ideation but struggle with follow-through. The guilt about unfinished projects creates emotional avoidance, making the problem worse."
    ],
    superpowers: [
      { title: 'Creativity', description: 'You see solutions and connections others miss.' },
      { title: 'Adaptability', description: 'When plans change, you pivot easily.' },
      { title: 'Passion', description: 'When interested, you enter hyperfocus and produce magic.' },
      { title: 'Innovation', description: 'Your refusal to do things "the normal way" leads to breakthroughs.' }
    ],
    blockers: [
      { title: 'Task initiation paralysis', description: 'Starting feels impossibly hard' },
      { title: 'Novelty addiction', description: 'You abandon projects when the excitement fades' },
      { title: 'Guilt spirals', description: 'Shame about procrastination creates more avoidance' }
    ],
    quickWins: [
      { 
        title: 'The 2-Minute Start Rule', 
        description: 'Don\'t commit to finishing anything. Just commit to 2 minutes. "I will write one sentence." "I will open the document." Your brain can\'t resist continuing once you start.' 
      },
      { 
        title: 'Pair Boring Tasks with Stimulation', 
        description: 'Body double (work alongside someone, even virtually). Listen to music or podcasts. Add novelty to override boredom.' 
      },
      { 
        title: 'Externalize Your Brain', 
        description: 'Capture every idea immediately in a notes app. Your working memory is terrible (not your fault—it\'s neurology). Get it out of your head so you can focus on ONE thing.' 
      }
    ],
    framework: {
      name: '⏱️ Pomodoro + Body Doubling',
      why: 'Short sprints match your attention span. External presence (body double) reduces task initiation friction. Breaks prevent burnout.'
    },
    premiumIncludes: {
      frameworks: ['Pomodoro + Body Doubling (ADHD-adapted)', 'Implementation Intentions (for task initiation)', 'Energy Management (work WITH your hyperfocus cycles)'],
      tools: ['Body doubling platforms (Focusmate, Flow Club, Caveday)', 'Pomodoro apps that actually work for your brain', 'Capture tools for idea management'],
      plan: ['Week 1: Build your Pomodoro practice', 'Week 2: Find your body double system', 'Week 3: Handle the "boring middle" of projects', 'Week 4: Finish ONE thing (proof you can do it)'],
      special: ['Why you love learning systems but never implement', 'The ONE system rule (and how to stick to it)', 'How to resist the next shiny productivity method']
    },
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
    tagline: 'High standards drive your excellence—but perfectionism is sabotaging your progress.',
    icon: '🎯',
    image: anxiousPerfectionistImage,
    color: 'teal',
    gradientFrom: 'from-teal-400',
    gradientTo: 'to-cyan-400',
    tags: ['Perfectionist', 'Detail-oriented', 'Anxious'],
    struggle: [
      "You care deeply about quality. You want to do things RIGHT. But here's the trap: perfectionism and procrastination are twins.",
      "You delay starting because you're terrified it won't be good enough. You ruminate over details others would ship in 5 minutes. You revise endlessly instead of moving forward. The irony? Your perfectionism doesn't produce better work—it produces LESS work, delivered late, while you burn out from anxiety.",
      "Research shows perfectionism is strongly correlated with procrastination, anxiety, and depression—not with higher quality output. Your brain conflates \"good enough\" with \"failure,\" creating emotional avoidance that masquerades as high standards."
    ],
    superpowers: [
      { title: 'Quality', description: 'When you ship, it\'s excellent.' },
      { title: 'Conscientiousness', description: 'You catch errors others miss.' },
      { title: 'Reliability', description: 'People trust you with important work.' },
      { title: 'Growth mindset', description: 'You genuinely want to improve.' }
    ],
    blockers: [
      { title: 'Analysis paralysis', description: 'Fear of imperfection prevents starting' },
      { title: 'Revision loops', description: 'You can\'t stop tweaking and ship the work' },
      { title: 'Emotional avoidance', description: 'Anxiety about the task makes you procrastinate' }
    ],
    quickWins: [
      { 
        title: 'Version 0 Mindset', 
        description: 'Rename your first draft "Version 0" and give yourself permission for it to suck. Separate creation (Version 0) from refinement (Version 1+). You can\'t edit a blank page.' 
      },
      { 
        title: 'Time-Box Revision', 
        description: 'Set a timer for 15 minutes. Revise ONLY during that time. When it rings, you are done. Ship it. Most revision is anxiety management, not quality improvement.' 
      },
      { 
        title: 'The "Good Enough" Mantra', 
        description: 'Before starting, define what "good enough" looks like. Write it down. When you hit that bar, you are done. Exceeding it is optional, not required.' 
      }
    ],
    framework: {
      name: '📝 Implementation Intentions + Self-Compassion',
      why: 'Removes decision paralysis. Pre-commits to "good enough." Breaks the perfectionism-shame cycle with research-backed self-compassion practices.'
    },
    premiumIncludes: {
      frameworks: ['Implementation Intentions (decision automation)', 'Time Blocking with "Good Enough" standards', 'Self-Compassion Practices (break the shame cycle)'],
      tools: ['Anxiety tracking apps', '"Good enough" templates for common tasks', 'Deadline accountability tools'],
      plan: ['Week 1: Define "good enough" for your key tasks', 'Week 2: Practice Version 0 mindset', 'Week 3: Ship imperfect work (on purpose)', 'Week 4: Celebrate progress over perfection'],
      special: ['Research on why perfectionism doesn\'t improve quality', 'How to separate excellence from perfectionism', 'When "good enough" is strategically better']
    },
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
    tagline: 'You\'re powered by excitement and new challenges. The routine? That\'s your kryptonite.',
    icon: '🚀',
    image: noveltySeekerImage,
    color: 'red',
    gradientFrom: 'from-red-400',
    gradientTo: 'to-pink-400',
    tags: ['Novelty-driven', 'Energetic', 'Visionary'],
    struggle: [
      "You're a dopamine-seeking missile. New projects? Hell yes. Routine maintenance? You'd rather watch paint dry. You start strong, riding the wave of excitement, then crash when the novelty fades and the boring middle work begins.",
      "The challenge: most valuable work requires sustained attention on repetitive tasks. You need external stakes (deadlines, competition, accountability) to push through the tedium. Without novelty or external pressure, your motivation evaporates.",
      "Research on ADHD and novelty-seeking shows that dopamine dysregulation makes routine tasks neurologically painful—you're not lazy, your brain literally experiences boredom differently."
    ],
    superpowers: [
      { title: 'Adaptability', description: 'You thrive in changing environments.' },
      { title: 'Enthusiasm', description: 'Your energy is contagious.' },
      { title: 'Learning', description: 'You absorb new skills quickly.' },
      { title: 'Crisis mode', description: 'When stakes are high, you\'re unbeatable.' }
    ],
    blockers: [
      { title: 'Boredom intolerance', description: 'Routine tasks feel physically painful' },
      { title: 'Need for external pressure', description: 'Without stakes, you don\'t act' },
      { title: 'Project abandonment', description: 'You start strong but lose interest' }
    ],
    quickWins: [
      { 
        title: 'Gamify Everything', 
        description: 'Turn boring tasks into challenges. "How fast can I do this?" Use timers, streaks, leaderboards. Your brain needs the dopamine hit—give it one.' 
      },
      { 
        title: 'Rotate Tasks Frequently', 
        description: 'Don\'t work on one thing for hours. Switch every 25-30 minutes. Match your task rotation to your attention span, not someone else\'s advice.' 
      },
      { 
        title: 'Create Artificial Stakes', 
        description: 'Bet money on completing tasks (Beeminder). Tell someone when you will finish. Make it hurt to not follow through.' 
      }
    ],
    framework: {
      name: '🎮 Gamification + External Accountability',
      why: 'Adds novelty and competition to routine work. External stakes replace missing intrinsic motivation. Turns productivity into a game you can win.'
    },
    premiumIncludes: {
      frameworks: ['Gamification strategies (with tool stack)', 'Body Doubling + Accountability partners', 'Task rotation systems (prevent boredom)'],
      tools: ['Beeminder, Habitica, Forest (gamification)', 'Focusmate, productivity Discord servers', 'Task management apps that support variety'],
      plan: ['Week 1: Build your gamification system', 'Week 2: Find accountability partners', 'Week 3: Master task rotation without losing focus', 'Week 4: Handle the "boring middle" of projects'],
      special: ['Why you abandon projects (and how to stop)', 'Distinguishing between strategic pivots and shiny object syndrome', 'Building sustainable systems that accommodate your need for variety']
    },
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
    tagline: 'You see the big picture and build the roadmap. Execution is your superpower—when the vision is clear.',
    icon: '🗺️',
    image: strategicPlannerImage,
    color: 'indigo',
    gradientFrom: 'from-indigo-400',
    gradientTo: 'to-blue-400',
    tags: ['Strategic', 'Self-motivated', 'Visionary'],
    struggle: [
      "You're the architect. You love designing systems, planning strategies, and connecting long-term goals to daily actions. When you have clarity on the \"why,\" you execute flawlessly.",
      "The problem? You can over-plan and under-execute. Strategic thinking is your comfort zone—taking messy, uncertain action feels risky. You might spend weeks perfecting a plan when you should be testing and iterating. And when priorities shift unexpectedly, you need time to reorient.",
      "You're intrinsically motivated (you do things because they matter to YOU), but you need structure to channel that drive into action."
    ],
    superpowers: [
      { title: 'Vision', description: 'You see possibilities years ahead.' },
      { title: 'Strategic thinking', description: 'You connect dots others miss.' },
      { title: 'Self-direction', description: 'You don\'t need external validation.' },
      { title: 'Systems design', description: 'You build frameworks that scale.' }
    ],
    blockers: [
      { title: 'Over-planning', description: 'You optimize the strategy instead of testing it' },
      { title: 'Ambiguous execution', description: 'Without clear steps, you delay action' },
      { title: 'Shifting priorities', description: 'Changes require mental reorientation' }
    ],
    quickWins: [
      { 
        title: 'The 80/20 Planning Rule', 
        description: 'Spend 20% of your time planning, 80% executing. Set a timer. When planning time is up, act—even if the plan isn\'t perfect.' 
      },
      { 
        title: 'Build Backward from Your Vision', 
        description: 'Start with the end state you want in 1 year. Work backward to define THIS quarter, THIS month, THIS week. Connect daily tasks to the big picture.' 
      },
      { 
        title: 'Create a "Done is Better Than Perfect" Trigger', 
        description: 'When you catch yourself planning for more than 2 hours, ask: "What is the smallest version I can test TODAY?"' 
      }
    ],
    framework: {
      name: '📊 Time Blocking + Strategic Reviews',
      why: 'Aligns daily execution with long-term vision. Weekly reviews keep you connected to the big picture while daily time blocks ensure follow-through.'
    },
    premiumIncludes: {
      frameworks: ['Time Blocking (with strategic alignment)', 'Deep Work + Quarterly Planning', 'Implementation Intentions (connect vision to action)'],
      tools: ['Strategic planning tools (Notion, Obsidian)', 'Time blocking calendars', 'Quarterly goal-setting frameworks'],
      plan: ['Week 1: Define your 1-year vision', 'Week 2: Build time blocking system aligned to goals', 'Week 3: Test and iterate (action over planning)', 'Week 4: Install quarterly review cadence'],
      special: ['How to know when planning becomes procrastination', 'Building bias toward action', 'Strategic pivots vs. distraction']
    },
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
    tagline: 'You ride the waves of change with ease. Planning is optional; action is your default.',
    icon: '🌊',
    image: flexibleImproviserImage,
    color: 'green',
    gradientFrom: 'from-green-400',
    gradientTo: 'to-emerald-400',
    tags: ['Action-oriented', 'Flexible', 'Adaptive'],
    struggle: [
      "You're the anti-planner. You wake up, assess the situation, and dive in. You adapt to changes without stress, pivot easily, and trust yourself to figure it out as you go. This is a genuine superpower in chaotic environments.",
      "The challenge? You might lack consistency on long-term goals. You can be reactive rather than proactive. Without external structure, you might drift toward whatever feels urgent or interesting instead of what's important.",
      "Your spontaneity is powerful, but without some minimal scaffolding, you risk spinning your wheels on low-impact work or losing track of bigger objectives."
    ],
    superpowers: [
      { title: 'Adaptability', description: 'You thrive in chaos and uncertainty.' },
      { title: 'Action bias', description: 'You start before others finish planning.' },
      { title: 'Resilience', description: 'Setbacks don\'t paralyze you.' },
      { title: 'Resourcefulness', description: 'You make the most of what you have.' }
    ],
    blockers: [
      { title: 'Lack of direction', description: 'Without goals, you drift aimlessly' },
      { title: 'Reactive mode', description: 'You respond to urgency, not importance' },
      { title: 'Inconsistent progress', description: 'Long-term goals stall without structure' }
    ],
    quickWins: [
      { 
        title: 'The Daily Anchor', 
        description: 'Pick ONE thing that matters most today and do it first. No plan required—just one priority before reacting to the world.' 
      },
      { 
        title: 'Weekly Check-In (5 minutes)', 
        description: 'Every Monday, ask: "What is the ONE goal I want to move forward this week?" Then improvise daily toward it.' 
      },
      { 
        title: 'Capture Without Commitment', 
        description: 'Keep a running list of ideas and tasks. Review weekly. This gives you options without forcing rigid plans.' 
      }
    ],
    framework: {
      name: '🎯 North Star + Daily Anchor',
      why: 'Gives you just enough direction (one clear priority) without killing your spontaneity. Weekly reviews keep you aligned without daily rigidity.'
    },
    premiumIncludes: {
      frameworks: ['North Star Goal Setting', 'Energy-Based Scheduling', 'Opportunistic Time Blocking'],
      tools: ['Flexible planning apps (Trello, Notion)', 'Quick capture tools', 'Weekly review templates'],
      plan: ['Week 1: Define your North Star goal', 'Week 2: Establish daily anchor habit', 'Week 3: Add weekly reviews', 'Week 4: Balance spontaneity with progress'],
      special: ['How to maintain momentum without burnout', 'Distinguishing between flexibility and distraction', 'Building structure that doesn\'t feel restrictive']
    },
    scoreRanges: {
      structure: { min: 7, max: 21 },
      motivation: { min: 7, max: 28 },
      cognitive: { min: 7, max: 28 },
      task: { min: 7, max: 21 }
    }
  },
  {
    id: 'adaptive-generalist',
    name: 'The Adaptive Generalist',
    title: 'Context-Shifting Polymath',
    tagline: 'You don\'t have one productivity style—you have many. Your superpower is matching approach to context.',
    icon: '🔄',
    image: adaptiveGeneralistImage,
    color: 'teal',
    gradientFrom: 'from-teal-400',
    gradientTo: 'to-cyan-400',
    tags: ['Adaptable', 'Multi-Modal', 'Context-Aware'],
    struggle: [
      "You scored in the balanced range on most productivity axes. This means you don't strongly prefer one approach over another—you're highly adaptable and context-dependent.",
      "Traditional productivity advice says 'find YOUR system and stick to it.' But that's never worked for you. Different projects need different approaches. Your energy and context vary significantly. One-size-fits-all just doesn't fit.",
      "Research on cognitive flexibility shows this isn't a flaw—it's a different kind of productivity profile. You're not 'in between' archetypes. You're multi-modal, able to shift approaches based on what the situation demands."
    ],
    superpowers: [
      { title: 'Cognitive Flexibility', description: 'You can switch between different mental modes based on what\'s needed.' },
      { title: 'Context Awareness', description: 'You intuitively know when to plan vs. dive in, when to focus on details vs. big picture.' },
      { title: 'Versatility', description: 'You can work structured OR flexibly, with internal OR external motivation.' },
      { title: 'Problem-Solving', description: 'You bring multiple tools to every challenge instead of one rigid approach.' }
    ],
    blockers: [
      { title: 'Decision fatigue', description: 'Having to choose an approach for each task is mentally taxing' },
      { title: 'No default mode', description: 'You lack the autopilot that other types have for routine tasks' },
      { title: 'Inconsistency concerns', description: 'You may worry that switching approaches means you\'re doing it wrong' }
    ],
    quickWins: [
      { 
        title: 'Context-First Assessment', 
        description: 'Before starting any task, ask: "What does THIS task need?" High stakes = more structure. Creative exploration = more flexibility. Match approach to context.' 
      },
      { 
        title: 'Build a Toolkit, Not a System', 
        description: 'Create a menu of approaches you can choose from: "For creative work, I do X. For admin tasks, I do Y. For deep focus, I do Z." Variety is your strength.' 
      },
      { 
        title: 'Weekly Mode Review', 
        description: 'Every Sunday, look at your week ahead and pre-decide which mode each major task needs. This reduces daily decision fatigue.' 
      }
    ],
    framework: {
      name: '🔄 Context-Mode Matching',
      why: 'Instead of forcing one approach everywhere, you explicitly match your approach to what each task actually needs. This turns your adaptability from a liability into a superpower.'
    },
    premiumIncludes: {
      frameworks: ['Context-Mode Matching', 'Energy-Based Task Assignment', 'Multi-Modal Productivity Toolkit'],
      tools: ['Flexible task managers (Notion, Todoist)', 'Energy tracking apps', 'Context-switching rituals'],
      plan: ['Week 1: Map your modes and when to use each', 'Week 2: Build your personal productivity toolkit', 'Week 3: Reduce decision fatigue with pre-planning', 'Week 4: Optimize your context-switching'],
      special: ['Why consistency is overrated for you', 'Embracing productive inconsistency', 'When to borrow from other archetypes']
    },
    scoreRanges: {
      structure: { min: 15, max: 28 },
      motivation: { min: 15, max: 28 },
      cognitive: { min: 15, max: 28 },
      task: { min: 15, max: 28 }
    }
  }
];
