import type { InsertTool } from "@shared/schema";

export const toolsData: Omit<InsertTool, 'id'>[] = [
  // === FOCUS TOOLS ===
  {
    toolId: 'freedom',
    name: 'Freedom',
    tagline: 'Block distractions across all your devices',
    description: 'Powerful website and app blocker that works across Mac, Windows, iOS, and Android. Schedule blocking sessions in advance and create recurring blocks for your focus time.',
    logo: '/tools/freedom.png',
    website: 'https://freedom.to',
    category: 'focus',
    archetypeFit: {
      'structured-achiever': 95,
      'chaotic-creative': 60,
      'anxious-perfectionist': 92,
      'novelty-seeker': 55,
      'strategic-planner': 92,
      'flexible-improviser': 70
    },
    pricing: {
      free: false,
      freemium: true,
      startingPrice: 8.99,
      currency: 'USD',
      billingPeriod: 'monthly'
    },
    learningCurve: 'easy',
    platforms: ['web', 'mac', 'windows', 'ios', 'android'],
    pros: [
      'Cross-platform blocking',
      'Schedule sessions in advance',
      'Locked mode prevents cheating'
    ],
    cons: [
      'Requires subscription',
      'Can feel restrictive for flexible workers',
      'Nuclear option (blocks everything)'
    ],
    affiliateLink: 'https://freedom.to/?ref=prolific',
    directLink: 'https://freedom.to',
    tags: ['distraction-blocking', 'focus', 'deep-work'],
    bestFor: ['Chronic procrastinators', 'Social media addicts', 'Deep work enthusiasts'],
    notIdealFor: ['Need flexibility', 'Multitaskers', 'Light browsing needs']
  },
  {
    toolId: 'forest',
    name: 'Forest',
    tagline: 'Stay focused, grow virtual trees',
    description: 'Gamified focus app that plants virtual trees when you stay focused. If you leave the app, your tree dies. Partner with real tree-planting organizations.',
    logo: '/tools/forest.png',
    website: 'https://www.forestapp.cc',
    category: 'focus',
    archetypeFit: {
      'structured-achiever': 75,
      'chaotic-creative': 85,
      'anxious-perfectionist': 70,
      'novelty-seeker': 95,
      'strategic-planner': 65,
      'flexible-improviser': 80
    },
    pricing: {
      free: false,
      freemium: true,
      startingPrice: 3.99,
      currency: 'USD',
      billingPeriod: 'one-time'
    },
    learningCurve: 'easy',
    platforms: ['ios', 'android', 'web'],
    pros: [
      'Gamification makes focus fun',
      'Affordable one-time purchase',
      'Visual progress tracking'
    ],
    cons: [
      'Mobile-first (desktop is web-only)',
      'Gamification might not work for everyone',
      'Limited blocking features'
    ],
    affiliateLink: 'https://www.forestapp.cc/?ref=prolific',
    directLink: 'https://www.forestapp.cc',
    tags: ['gamification', 'focus', 'pomodoro', 'visualization'],
    bestFor: ['Visual learners', 'Gamification lovers', 'Momentum chasers'],
    notIdealFor: ['Need strict blocking', 'Desktop-only workers']
  },
  {
    toolId: 'brain-fm',
    name: 'Brain.fm',
    tagline: 'Music to improve focus in 15 minutes',
    description: 'Science-backed functional music designed to help you focus, relax, or sleep. AI-generated soundscapes based on neuroscience research.',
    logo: '/tools/brainfm.png',
    website: 'https://www.brain.fm',
    category: 'focus',
    archetypeFit: {
      'structured-achiever': 70,
      'chaotic-creative': 90,
      'anxious-perfectionist': 75,
      'novelty-seeker': 85,
      'strategic-planner': 65,
      'flexible-improviser': 95
    },
    pricing: {
      free: false,
      freemium: true,
      startingPrice: 6.99,
      currency: 'USD',
      billingPeriod: 'monthly'
    },
    learningCurve: 'easy',
    platforms: ['web', 'ios', 'android'],
    pros: [
      'Research-backed audio',
      'Different modes (focus, relax, sleep)',
      'Integrates with Spotify'
    ],
    cons: [
      'Requires subscription',
      'Not everyone responds to audio',
      'Limited free trial'
    ],
    affiliateLink: 'https://www.brain.fm/?ref=prolific',
    directLink: 'https://www.brain.fm',
    tags: ['focus-music', 'neuroscience', 'flow-state'],
    bestFor: ['Flow seekers', 'Ambient sound lovers', 'Neuroscience nerds'],
    notIdealFor: ['Prefer silence', 'Budget-conscious', 'Distracted by music']
  },

  // === PLANNING TOOLS ===
  {
    toolId: 'notion',
    name: 'Notion',
    tagline: 'All-in-one workspace',
    description: 'Modular productivity platform combining notes, tasks, databases, and wikis. Highly customizable with templates for every use case.',
    logo: '/tools/notion.png',
    website: 'https://www.notion.so',
    category: 'planning',
    archetypeFit: {
      'structured-achiever': 88,
      'chaotic-creative': 82,
      'anxious-perfectionist': 90,
      'novelty-seeker': 75,
      'strategic-planner': 95,
      'flexible-improviser': 78
    },
    pricing: {
      free: true,
      freemium: true,
      startingPrice: 10,
      currency: 'USD',
      billingPeriod: 'monthly'
    },
    learningCurve: 'moderate',
    platforms: ['web', 'mac', 'windows', 'ios', 'android'],
    pros: [
      'Extremely flexible and customizable',
      'Great for building systems',
      'Generous free tier'
    ],
    cons: [
      'Steep learning curve',
      'Can become overwhelming',
      'Temptation to over-organize'
    ],
    affiliateLink: 'https://www.notion.so/?ref=prolific',
    directLink: 'https://www.notion.so',
    tags: ['notes', 'databases', 'wiki', 'project-management'],
    bestFor: ['System builders', 'Strategic planners', 'Template lovers'],
    notIdealFor: ['Want simplicity', 'Decision fatigue', 'Quick capture']
  },
  {
    toolId: 'todoist',
    name: 'Todoist',
    tagline: 'Simple, powerful task management',
    description: 'Clean task manager with natural language input, recurring tasks, priorities, and productivity tracking. Works everywhere.',
    logo: '/tools/todoist.png',
    website: 'https://todoist.com',
    category: 'task-management',
    archetypeFit: {
      'structured-achiever': 90,
      'chaotic-creative': 65,
      'anxious-perfectionist': 88,
      'novelty-seeker': 70,
      'strategic-planner': 88,
      'flexible-improviser': 72
    },
    pricing: {
      free: true,
      freemium: true,
      startingPrice: 4,
      currency: 'USD',
      billingPeriod: 'monthly'
    },
    learningCurve: 'easy',
    platforms: ['web', 'mac', 'windows', 'ios', 'android', 'linux'],
    pros: [
      'Natural language input',
      'Karma system for gamification',
      'Integrates with everything'
    ],
    cons: [
      'Premium needed for labels and filters',
      'Can get overwhelming with many tasks',
      'No built-in time blocking'
    ],
    affiliateLink: 'https://todoist.com/?ref=prolific',
    directLink: 'https://todoist.com',
    tags: ['tasks', 'gtd', 'productivity', 'organization'],
    bestFor: ['Task-oriented thinkers', 'GTD practitioners', 'Momentum chasers'],
    notIdealFor: ['Need time-blocking', 'Visual planners', 'Dislike lists']
  },
  {
    toolId: 'sunsama',
    name: 'Sunsama',
    tagline: 'Daily planning ritual',
    description: 'Intentional daily planner that imports tasks from Asana, Trello, Slack, etc. Focus on planning your ideal day, not just managing tasks.',
    logo: '/tools/sunsama.png',
    website: 'https://www.sunsama.com',
    category: 'planning',
    archetypeFit: {
      'structured-achiever': 95,
      'chaotic-creative': 50,
      'anxious-perfectionist': 92,
      'novelty-seeker': 60,
      'strategic-planner': 98,
      'flexible-improviser': 60
    },
    pricing: {
      free: false,
      freemium: true,
      startingPrice: 20,
      currency: 'USD',
      billingPeriod: 'monthly'
    },
    learningCurve: 'easy',
    platforms: ['web', 'mac', 'windows', 'ios'],
    pros: [
      'Forces intentional planning',
      'Beautiful, calming interface',
      'Integrates with all major tools'
    ],
    cons: [
      'Expensive ($20/mo)',
      'Requires daily ritual commitment',
      'Too structured for some'
    ],
    affiliateLink: 'https://www.sunsama.com/?ref=prolific',
    directLink: 'https://www.sunsama.com',
    tags: ['daily-planning', 'time-blocking', 'mindful-productivity'],
    bestFor: ['Strategic planners', 'Ritual-oriented', 'High earners'],
    notIdealFor: ['Budget-conscious', 'Flexible schedules', 'Spontaneous']
  },

  // === TIME TRACKING ===
  {
    toolId: 'toggl',
    name: 'Toggl Track',
    tagline: 'Simple time tracking',
    description: 'One-click time tracking for freelancers and teams. Beautiful reports, integrations, and offline sync.',
    logo: '/tools/toggl.png',
    website: 'https://toggl.com',
    category: 'time-tracking',
    archetypeFit: {
      'structured-achiever': 90,
      'chaotic-creative': 60,
      'anxious-perfectionist': 88,
      'novelty-seeker': 68,
      'strategic-planner': 92,
      'flexible-improviser': 75
    },
    pricing: {
      free: true,
      freemium: true,
      startingPrice: 10,
      currency: 'USD',
      billingPeriod: 'monthly'
    },
    learningCurve: 'easy',
    platforms: ['web', 'mac', 'windows', 'ios', 'android', 'linux'],
    pros: [
      'Simple one-click tracking',
      'Beautiful reports',
      'Generous free tier'
    ],
    cons: [
      'Requires manual start/stop',
      'Can feel like surveillance',
      'Premium needed for some reports'
    ],
    affiliateLink: 'https://toggl.com/?ref=prolific',
    directLink: 'https://toggl.com',
    tags: ['time-tracking', 'freelancing', 'productivity-analytics'],
    bestFor: ['Freelancers', 'Billable hours', 'Data-driven improvers'],
    notIdealFor: ['Dislike tracking', 'Want automatic tracking']
  },
  {
    toolId: 'rescuetime',
    name: 'RescueTime',
    tagline: 'Automatic time tracking',
    description: 'Runs in background tracking app and website usage. Shows where your time goes without manual logging.',
    logo: '/tools/rescuetime.png',
    website: 'https://www.rescuetime.com',
    category: 'time-tracking',
    archetypeFit: {
      'structured-achiever': 85,
      'chaotic-creative': 78,
      'anxious-perfectionist': 82,
      'novelty-seeker': 75,
      'strategic-planner': 90,
      'flexible-improviser': 88
    },
    pricing: {
      free: true,
      freemium: true,
      startingPrice: 12,
      currency: 'USD',
      billingPeriod: 'monthly'
    },
    learningCurve: 'easy',
    platforms: ['web', 'mac', 'windows', 'linux'],
    pros: [
      'Fully automatic',
      'Reveals hidden time wasters',
      'Focus time blocking'
    ],
    cons: [
      'Privacy concerns',
      'Desktop only (no mobile)',
      'Can be discouraging'
    ],
    affiliateLink: 'https://www.rescuetime.com/?ref=prolific',
    directLink: 'https://www.rescuetime.com',
    tags: ['automatic-tracking', 'analytics', 'focus-blocking'],
    bestFor: ['Want insights', 'Automatic preference', 'Data lovers'],
    notIdealFor: ['Privacy-concerned', 'Mobile workers']
  },

  // === NOTE-TAKING ===
  {
    toolId: 'obsidian',
    name: 'Obsidian',
    tagline: 'Your second brain, forever',
    description: 'Local-first markdown note-taking with bidirectional linking. Build your personal knowledge graph.',
    logo: '/tools/obsidian.png',
    website: 'https://obsidian.md',
    category: 'note-taking',
    archetypeFit: {
      'structured-achiever': 78,
      'chaotic-creative': 95,
      'anxious-perfectionist': 82,
      'novelty-seeker': 85,
      'strategic-planner': 88,
      'flexible-improviser': 82
    },
    pricing: {
      free: true,
      freemium: false,
      startingPrice: null,
      currency: 'USD',
      billingPeriod: null
    },
    learningCurve: 'steep',
    platforms: ['mac', 'windows', 'linux', 'ios', 'android'],
    pros: [
      'Files stay on your device',
      'Powerful graph view',
      'Huge plugin ecosystem'
    ],
    cons: [
      'Steep learning curve',
      'Markdown knowledge helpful',
      'Can become rabbit hole'
    ],
    affiliateLink: 'https://obsidian.md/?ref=prolific',
    directLink: 'https://obsidian.md',
    tags: ['networked-notes', 'zettelkasten', 'second-brain', 'markdown'],
    bestFor: ['Knowledge workers', 'Writers', 'Researchers', 'PKM enthusiasts'],
    notIdealFor: ['Want simplicity', 'Need collaboration', 'Dislike markdown']
  },
  {
    toolId: 'evernote',
    name: 'Evernote',
    tagline: 'Remember everything',
    description: 'Classic note-taking app with powerful search, web clipper, and document scanning. Sync across all devices.',
    logo: '/tools/evernote.png',
    website: 'https://evernote.com',
    category: 'note-taking',
    archetypeFit: {
      'structured-achiever': 82,
      'chaotic-creative': 65,
      'anxious-perfectionist': 85,
      'novelty-seeker': 60,
      'strategic-planner': 88,
      'flexible-improviser': 70
    },
    pricing: {
      free: true,
      freemium: true,
      startingPrice: 7.99,
      currency: 'USD',
      billingPeriod: 'monthly'
    },
    learningCurve: 'easy',
    platforms: ['web', 'mac', 'windows', 'ios', 'android'],
    pros: [
      'Powerful web clipper',
      'Document scanning',
      'Great search capabilities'
    ],
    cons: [
      'Limited free tier',
      'Feels dated compared to modern tools',
      'Heavy app can be slow'
    ],
    affiliateLink: 'https://evernote.com/?ref=prolific',
    directLink: 'https://evernote.com',
    tags: ['notes', 'web-clipper', 'document-scanning'],
    bestFor: ['Information collectors', 'Research-heavy work', 'Traditional note-takers'],
    notIdealFor: ['Want modern UX', 'Budget-conscious', 'Need advanced linking']
  },

  // === COMMUNICATION ===
  {
    toolId: 'loom',
    name: 'Loom',
    tagline: 'Async video messaging',
    description: 'Record quick video messages to replace meetings. Screen + webcam recording in one click.',
    logo: '/tools/loom.png',
    website: 'https://www.loom.com',
    category: 'communication',
    archetypeFit: {
      'structured-achiever': 75,
      'chaotic-creative': 82,
      'anxious-perfectionist': 78,
      'novelty-seeker': 88,
      'strategic-planner': 85,
      'flexible-improviser': 90
    },
    pricing: {
      free: true,
      freemium: true,
      startingPrice: 12.50,
      currency: 'USD',
      billingPeriod: 'monthly'
    },
    learningCurve: 'easy',
    platforms: ['web', 'mac', 'windows', 'ios', 'android'],
    pros: [
      'Reduces meeting time',
      'Great for async teams',
      'Easy to use'
    ],
    cons: [
      'Video can feel awkward',
      'Limited free tier (5 min videos)',
      'Not ideal for complex discussions'
    ],
    affiliateLink: 'https://www.loom.com/?ref=prolific',
    directLink: 'https://www.loom.com',
    tags: ['async', 'video', 'communication', 'meetings'],
    bestFor: ['Remote teams', 'Async workers', 'Meeting-haters'],
    notIdealFor: ['Camera-shy', 'Complex discussions', 'Budget-conscious']
  },
  {
    toolId: 'slack',
    name: 'Slack',
    tagline: 'Where work happens',
    description: 'Team communication hub with channels, direct messages, and integrations. The standard for remote teams.',
    logo: '/tools/slack.png',
    website: 'https://slack.com',
    category: 'communication',
    archetypeFit: {
      'structured-achiever': 70,
      'chaotic-creative': 75,
      'anxious-perfectionist': 65,
      'novelty-seeker': 78,
      'strategic-planner': 80,
      'flexible-improviser': 85
    },
    pricing: {
      free: true,
      freemium: true,
      startingPrice: 7.25,
      currency: 'USD',
      billingPeriod: 'monthly'
    },
    learningCurve: 'easy',
    platforms: ['web', 'mac', 'windows', 'ios', 'android', 'linux'],
    pros: [
      'Industry standard',
      'Endless integrations',
      'Searchable history'
    ],
    cons: [
      'Can be distracting',
      'Notification overload',
      'Expensive for large teams'
    ],
    affiliateLink: 'https://slack.com/?ref=prolific',
    directLink: 'https://slack.com',
    tags: ['team-chat', 'collaboration', 'integrations'],
    bestFor: ['Remote teams', 'Tech companies', 'Real-time collaboration'],
    notIdealFor: ['Deep work priority', 'Notification-sensitive', 'Solo workers']
  },

  // === AUTOMATION ===
  {
    toolId: 'zapier',
    name: 'Zapier',
    tagline: 'Automate your work',
    description: 'Connect 5,000+ apps to automate workflows. No-code automation platform for productivity.',
    logo: '/tools/zapier.png',
    website: 'https://zapier.com',
    category: 'automation',
    archetypeFit: {
      'structured-achiever': 88,
      'chaotic-creative': 72,
      'anxious-perfectionist': 85,
      'novelty-seeker': 70,
      'strategic-planner': 95,
      'flexible-improviser': 75
    },
    pricing: {
      free: true,
      freemium: true,
      startingPrice: 19.99,
      currency: 'USD',
      billingPeriod: 'monthly'
    },
    learningCurve: 'moderate',
    platforms: ['web'],
    pros: [
      'Connects everything',
      'No coding required',
      'Huge template library'
    ],
    cons: [
      'Expensive at scale',
      'Can be complex',
      'Debugging is frustrating'
    ],
    affiliateLink: 'https://zapier.com/?ref=prolific',
    directLink: 'https://zapier.com',
    tags: ['automation', 'no-code', 'integration', 'workflow'],
    bestFor: ['System optimizers', 'Repetitive tasks', 'Integration needs'],
    notIdealFor: ['Simple needs', 'Budget-conscious', 'Low tech literacy']
  },
  {
    toolId: 'calendly',
    name: 'Calendly',
    tagline: 'Scheduling automation for everyone',
    description: 'Simple scheduling tool that eliminates back-and-forth emails. Share your availability, let others book time.',
    logo: '/tools/calendly.png',
    website: 'https://calendly.com',
    category: 'planning',
    archetypeFit: {
      'structured-achiever': 88,
      'chaotic-creative': 75,
      'anxious-perfectionist': 85,
      'novelty-seeker': 78,
      'strategic-planner': 92,
      'flexible-improviser': 82
    },
    pricing: {
      free: true,
      freemium: true,
      startingPrice: 10,
      currency: 'USD',
      billingPeriod: 'monthly'
    },
    learningCurve: 'easy',
    platforms: ['web'],
    pros: [
      'Eliminates scheduling emails',
      'Calendar integration',
      'Professional appearance'
    ],
    cons: [
      'Limited free tier (1 event type)',
      'Can feel impersonal',
      'Premium needed for teams'
    ],
    affiliateLink: 'https://calendly.com/?ref=prolific',
    directLink: 'https://calendly.com',
    tags: ['scheduling', 'meetings', 'automation'],
    bestFor: ['Client meetings', 'Sales teams', 'Frequent schedulers'],
    notIdealFor: ['Internal meetings only', 'Need advanced features free', 'Prefer personal touch']
  },
  {
    toolId: 'grammarly',
    name: 'Grammarly',
    tagline: 'Write with confidence',
    description: 'AI-powered writing assistant that checks grammar, spelling, tone, and clarity across all your apps.',
    logo: '/tools/grammarly.png',
    website: 'https://www.grammarly.com',
    category: 'note-taking',
    archetypeFit: {
      'structured-achiever': 82,
      'chaotic-creative': 75,
      'anxious-perfectionist': 95,
      'novelty-seeker': 78,
      'strategic-planner': 85,
      'flexible-improviser': 80
    },
    pricing: {
      free: true,
      freemium: true,
      startingPrice: 12,
      currency: 'USD',
      billingPeriod: 'monthly'
    },
    learningCurve: 'easy',
    platforms: ['web', 'mac', 'windows', 'ios', 'android'],
    pros: [
      'Works everywhere',
      'Tone detection',
      'Plagiarism checker (premium)'
    ],
    cons: [
      'Can be overly prescriptive',
      'Premium needed for best features',
      'Privacy concerns (text processing)'
    ],
    affiliateLink: 'https://www.grammarly.com/?ref=prolific',
    directLink: 'https://www.grammarly.com',
    tags: ['writing', 'grammar', 'ai', 'editing'],
    bestFor: ['Writers', 'Non-native speakers', 'Professional communication'],
    notIdealFor: ['Creative writing', 'Privacy-focused', 'Basic needs']
  },
  {
    toolId: 'brain-fm',
    name: 'Brain.fm',
    tagline: 'Music engineered to improve focus',
    description: 'Functional music designed to affect your brain and optimize your performance. Uses AI-generated music proven to increase focus, relaxation, or sleep quality.',
    logo: '/tools/brain-fm.png',
    website: 'https://www.brain.fm',
    category: 'focus',
    archetypeFit: {
      'structured-achiever': 85,
      'chaotic-creative': 90,
      'anxious-perfectionist': 88,
      'novelty-seeker': 92,
      'strategic-planner': 80,
      'flexible-improviser': 85
    },
    pricing: {
      free: false,
      freemium: true,
      startingPrice: 6.99,
      currency: 'USD',
      billingPeriod: 'monthly'
    },
    learningCurve: 'easy',
    platforms: ['web', 'ios', 'android'],
    pros: [
      'Scientifically-backed audio',
      'Works in 15 minutes',
      'Different modes (focus, relax, sleep)'
    ],
    cons: [
      'Requires subscription',
      'Music might not suit everyone',
      'Limited customization'
    ],
    affiliateLink: 'https://www.brain.fm/?ref=prolific',
    directLink: 'https://www.brain.fm',
    tags: ['focus', 'music', 'neuroscience', 'deep-work'],
    bestFor: ['Easily distracted', 'Background music lovers', 'Science enthusiasts'],
    notIdealFor: ['Prefer silence', 'Tight budget', 'Need complete customization']
  },
  {
    toolId: 'sunsama',
    name: 'Sunsama',
    tagline: 'Daily planner for busy professionals',
    description: 'Thoughtful daily planning tool that helps you organize tasks, time-block your calendar, and reflect on your day. Integrates with all major task managers.',
    logo: '/tools/sunsama.png',
    website: 'https://www.sunsama.com',
    category: 'planning',
    archetypeFit: {
      'structured-achiever': 98,
      'chaotic-creative': 70,
      'anxious-perfectionist': 95,
      'novelty-seeker': 65,
      'strategic-planner': 98,
      'flexible-improviser': 75
    },
    pricing: {
      free: false,
      freemium: true,
      startingPrice: 20,
      currency: 'USD',
      billingPeriod: 'monthly'
    },
    learningCurve: 'medium',
    platforms: ['web', 'mac', 'windows'],
    pros: [
      'Beautiful, calm interface',
      'Integrates with everything',
      'Daily planning ritual'
    ],
    cons: [
      'Expensive subscription',
      'Can be overwhelming at first',
      'Requires daily commitment'
    ],
    affiliateLink: 'https://www.sunsama.com/?ref=prolific',
    directLink: 'https://www.sunsama.com',
    tags: ['planning', 'calendar', 'time-blocking', 'reflection'],
    bestFor: ['Overwhelmed professionals', 'Time-blockers', 'Intentional planners'],
    notIdealFor: ['Simple needs', 'Budget-conscious', 'Spontaneous workers']
  },
  {
    toolId: 'clockify',
    name: 'Clockify',
    tagline: 'Free time tracking software',
    description: 'Simple time tracker and timesheet app for teams and freelancers. Track work hours across projects, generate reports, and analyze productivity patterns.',
    logo: '/tools/clockify.png',
    website: 'https://clockify.me',
    category: 'time-tracking',
    archetypeFit: {
      'structured-achiever': 90,
      'chaotic-creative': 75,
      'anxious-perfectionist': 92,
      'novelty-seeker': 70,
      'strategic-planner': 95,
      'flexible-improviser': 78
    },
    pricing: {
      free: true,
      freemium: true,
      startingPrice: 9.99,
      currency: 'USD',
      billingPeriod: 'monthly'
    },
    learningCurve: 'easy',
    platforms: ['web', 'mac', 'windows', 'ios', 'android'],
    pros: [
      'Completely free for unlimited users',
      'Detailed reporting',
      'Browser extension available'
    ],
    cons: [
      'Can feel like surveillance',
      'Advanced features require paid plan',
      'UI could be more modern'
    ],
    affiliateLink: 'https://clockify.me/?ref=prolific',
    directLink: 'https://clockify.me',
    tags: ['time-tracking', 'productivity', 'analytics', 'reporting'],
    bestFor: ['Freelancers', 'Billable hours', 'Data-driven optimizers'],
    notIdealFor: ['Hate tracking time', 'Privacy concerns', 'Need advanced features free']
  },
  {
    toolId: 'roam-research',
    name: 'Roam Research',
    tagline: 'A note-taking tool for networked thought',
    description: 'Revolutionary note-taking app with bi-directional linking and graph visualization. Perfect for building a personal knowledge management system.',
    logo: '/tools/roam.png',
    website: 'https://roamresearch.com',
    category: 'note-taking',
    archetypeFit: {
      'structured-achiever': 75,
      'chaotic-creative': 95,
      'anxious-perfectionist': 80,
      'novelty-seeker': 98,
      'strategic-planner': 88,
      'flexible-improviser': 92
    },
    pricing: {
      free: false,
      freemium: false,
      startingPrice: 15,
      currency: 'USD',
      billingPeriod: 'monthly'
    },
    learningCurve: 'steep',
    platforms: ['web'],
    pros: [
      'Powerful bi-directional linking',
      'Graph view shows connections',
      'Highly customizable'
    ],
    cons: [
      'Steep learning curve',
      'Expensive with no free tier',
      'Web-only (no mobile apps)'
    ],
    affiliateLink: 'https://roamresearch.com/?ref=prolific',
    directLink: 'https://roamresearch.com',
    tags: ['note-taking', 'knowledge-management', 'zettelkasten', 'networked-thinking'],
    bestFor: ['Researchers', 'Writers', 'Knowledge workers'],
    notIdealFor: ['Simple note needs', 'Need mobile apps', 'Budget-conscious']
  },
  {
    toolId: 'loom',
    name: 'Loom',
    tagline: 'Async video messaging for work',
    description: 'Record quick videos of your screen, camera, or both. Perfect for async communication, tutorials, bug reports, and feedback.',
    logo: '/tools/loom.png',
    website: 'https://www.loom.com',
    category: 'communication',
    archetypeFit: {
      'structured-achiever': 85,
      'chaotic-creative': 88,
      'anxious-perfectionist': 75,
      'novelty-seeker': 90,
      'strategic-planner': 82,
      'flexible-improviser': 92
    },
    pricing: {
      free: true,
      freemium: true,
      startingPrice: 12.50,
      currency: 'USD',
      billingPeriod: 'monthly'
    },
    learningCurve: 'easy',
    platforms: ['web', 'mac', 'windows', 'ios', 'android'],
    pros: [
      'Faster than typing',
      'Generous free tier',
      'Easy to share'
    ],
    cons: [
      'Video limit on free plan',
      'Can feel awkward at first',
      'Requires comfort on camera'
    ],
    affiliateLink: 'https://www.loom.com/?ref=prolific',
    directLink: 'https://www.loom.com',
    tags: ['communication', 'video', 'async', 'screen-recording'],
    bestFor: ['Remote teams', 'Bug reporting', 'Quick explanations'],
    notIdealFor: ['Camera-shy', 'Prefer writing', 'Need privacy']
  }
];
