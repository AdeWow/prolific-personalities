export interface WeeklyEmailContent {
  week: number;           // 1-12
  subject: string;
  preheader: string;
  blogTitle: string;
  blogUrl: string;
  universalBody: string;  // full email body as HTML paragraphs
  personalizedContext: {   // archetype-specific opening paragraphs, null if universal week
    [archetypeId: string]: string;
  } | null;
}

export const WEEKLY_CONTENT: WeeklyEmailContent[] = [
  // --- WEEK 1 ---
  {
    week: 1,
    subject: "Why the advice never sticks",
    preheader: "It was never built for how you think.",
    blogTitle: "Why MBTI Can\u2019t Predict How You Work",
    blogUrl: "https://prolificpersonalities.com/blog/why-mbti-cant-predict-how-you-work",
    universalBody:
      `<p>Hey,</p>
<p>Most productivity advice is written for one type of person.</p>
<p>Not because the authors are lazy. Because most of them never questioned the assumption that everyone thinks the same way.</p>
<p>You have probably noticed the gap. The system that works brilliantly for your colleague does nothing for you. The framework that changed someone else\u2019s life sits unopened on your desktop.</p>
<p>That is not a discipline problem. That is a fit problem.</p>`,
    personalizedContext: {
      "adaptive-generalist": "Most productivity advice punishes context-switching. If you are an Adaptive Generalist, that advice was never going to stick.",
      "anxious-perfectionist": "Most productivity advice ignores the cost of maintaining high standards. If you are an Anxious Perfectionist, that overhead is real \u2014 and most systems do not account for it.",
      "chaotic-creative": "Most productivity advice assumes consistent output. If you are a Chaotic Creative, your best work does not work that way.",
      "flexible-improviser": "Most productivity advice requires rigid structure. If you are a Flexible Improviser, that structure works against you, not with you.",
      "novelty-seeker": "Most productivity advice is built for finishers. If you are a Novelty Seeker, the system needs to be built differently from the start.",
      "strategic-planner": "Most productivity advice skips the planning phase. If you are a Strategic Planner, that missing structure is exactly why it never worked.",
      "structured-achiever": "Most productivity advice assumes internal motivation is enough. If you are a Structured Achiever, you know that external scaffolding matters.",
    },
  },

  // --- WEEK 2 ---
  {
    week: 2,
    subject: "The irony of building a productivity app",
    preheader: "A founder note.",
    blogTitle: "I\u2019m Building a Productivity App and It\u2019s Consuming My Life",
    blogUrl: "https://prolificpersonalities.com/blog/im-building-a-productivity-app-and-its-consuming-my-life",
    universalBody:
      `<p>Hey,</p>
<p>There is a specific kind of irony in spending 14-hour days building a tool to help people reclaim their time.</p>
<p>I have lived inside it for the past year.</p>
<p>This post is not polished. It is just honest about what it actually looks like to build something you believe in \u2014 including the parts where the irony is impossible to ignore.</p>`,
    personalizedContext: null,
  },

  // --- WEEK 3 ---
  {
    week: 3,
    subject: "If you only work well under pressure",
    preheader: "There is nothing wrong with you.",
    blogTitle: "I Can Only Work Under Pressure: Is Something Wrong With Me?",
    blogUrl: "https://prolificpersonalities.com/blog/i-can-only-work-under-pressure",
    universalBody:
      `<p>Hey,</p>
<p>\u201cI do my best work the night before the deadline.\u201d</p>
<p>If that sentence describes you, you have probably been told it is a problem to fix.</p>
<p>It might not be. It might just be how you are wired \u2014 and the question is whether your system works with that or against it.</p>`,
    personalizedContext: {
      "flexible-improviser": "Flexible Improvisers often thrive under deadline pressure. That is not procrastination \u2014 it is your brain finding its optimal activation state.",
      "chaotic-creative": "Chaotic Creatives frequently describe pressure as the thing that finally makes the energy arrive. There is a way to build that into your system intentionally.",
      "novelty-seeker": "Novelty Seekers sometimes manufacture pressure when none exists \u2014 tight windows, artificial deadlines \u2014 because that is when focus sharpens. That is a pattern worth understanding.",
    },
  },

  // --- WEEK 4 ---
  {
    week: 4,
    subject: "A dog applied for my Head of Growth position",
    preheader: "His strategy was better than most humans I interviewed.",
    blogTitle: "A Dog Applied for My Head of Growth Position. His Productivity Strategy Is Better Than Yours.",
    blogUrl: "https://prolificpersonalities.com/blog/a-dog-applied-for-my-head-of-growth-position",
    universalBody:
      `<p>Hey,</p>
<p>His name was Benny. He had no relevant experience.</p>
<p>He also had a clearer daily structure than most of the humans I spoke to \u2014 and zero guilt about rest.</p>
<p>This one is lighter. But it makes a point I keep coming back to about how we think about rest, consistency, and what \u201cproductive\u201d actually means.</p>`,
    personalizedContext: null,
  },

  // --- WEEK 5 ---
  {
    week: 5,
    subject: "Six months of AI productivity tools",
    preheader: "What actually worked. What was hype.",
    blogTitle: "I Tested Every AI Productivity Tool for 6 Months \u2014 Here\u2019s What Actually Works",
    blogUrl: "https://prolificpersonalities.com/blog/i-tested-every-ai-productivity-tool-for-6-months",
    universalBody:
      `<p>Hey,</p>
<p>I spent six months testing every AI productivity tool I could find. Not in a sponsored way. Just obsessively.</p>
<p>Most of them were not worth the subscription. A few changed how I work. The difference was not the tool \u2014 it was whether the tool matched how my brain actually operates.</p>`,
    personalizedContext: {
      "adaptive-generalist": "The tools that worked for Adaptive Generalists were not the ones with the most features. They were the ones that matched how Adaptive Generalists actually think and work.",
      "anxious-perfectionist": "The tools that worked for Anxious Perfectionists were not the ones with the most features. They were the ones that matched how Anxious Perfectionists actually think and work.",
      "chaotic-creative": "The tools that worked for Chaotic Creatives were not the ones with the most features. They were the ones that matched how Chaotic Creatives actually think and work.",
      "flexible-improviser": "The tools that worked for Flexible Improvisers were not the ones with the most features. They were the ones that matched how Flexible Improvisers actually think and work.",
      "novelty-seeker": "The tools that worked for Novelty Seekers were not the ones with the most features. They were the ones that matched how Novelty Seekers actually think and work.",
      "strategic-planner": "The tools that worked for Strategic Planners were not the ones with the most features. They were the ones that matched how Strategic Planners actually think and work.",
      "structured-achiever": "The tools that worked for Structured Achievers were not the ones with the most features. They were the ones that matched how Structured Achievers actually think and work.",
    },
  },

  // --- WEEK 6 ---
  {
    week: 6,
    subject: "Society says work mornings. My brain disagrees.",
    preheader: "You are not broken. You are just not a morning person.",
    blogTitle: "I\u2019m Productive at Night But Society Says I Should Work Mornings",
    blogUrl: "https://prolificpersonalities.com/blog/im-productive-at-night-but-society-says-i-should-work-mornings",
    universalBody:
      `<p>Hey,</p>
<p>The 5am club. The morning routine. The \u201cwin the morning, win the day\u201d crowd.</p>
<p>What if your peak cognitive hours are at 10pm?</p>
<p>This is not permission to ignore your obligations. It is a reminder that your schedule should be built around your brain, not the other way around.</p>`,
    personalizedContext: null,
  },

  // --- WEEK 7 ---
  {
    week: 7,
    subject: "When trying to be productive causes burnout",
    preheader: "The system was the problem, not you.",
    blogTitle: "Burnout from Trying to Be Productive: How to Recover",
    blogUrl: "https://prolificpersonalities.com/blog/burnout-from-trying-to-be-productive",
    universalBody:
      `<p>Hey,</p>
<p>Productivity burnout is a specific kind of exhaustion.</p>
<p>It is not from doing too much work. It is from fighting your own brain to do the work \u2014 using systems that were not designed for how you think, and blaming yourself when they fail.</p>
<p>If that sounds familiar, this is worth reading.</p>`,
    personalizedContext: {
      "anxious-perfectionist": "Anxious Perfectionists are particularly vulnerable to productivity burnout \u2014 not because they work too hard, but because the mental overhead of maintaining high standards while using the wrong system is exhausting.",
      "structured-achiever": "Structured Achievers often burn out not from lack of discipline but from maintaining discipline in a system that requires constant manual effort. The scaffolding should do that work, not you.",
      "strategic-planner": "Strategic Planners sometimes burn out at the planning stage itself \u2014 when the gap between the plan and the execution feels impossible to close. That gap is a system problem, not a personal failing.",
    },
  },

  // --- WEEK 8 ---
  {
    week: 8,
    subject: "I take my own quiz every day",
    preheader: "And I get different results. Here is why that matters.",
    blogTitle: "I Take My Own Quiz Every Day and Get Different Results",
    blogUrl: "https://prolificpersonalities.com/blog/i-take-my-own-quiz-every-day-and-get-different-results",
    universalBody:
      `<p>Hey,</p>
<p>People sometimes write to me concerned that their quiz result changes depending on when they take it.</p>
<p>That is not a bug. It is actually the point.</p>
<p>Archetypes are not fixed identities. They are patterns that shift with context, stress, energy, and environment. Your dominant pattern is still real and useful \u2014 even if it is not always the same one.</p>`,
    personalizedContext: null,
  },

  // --- WEEK 9 ---
  {
    week: 9,
    subject: "100 unread tabs",
    preheader: "What it says about your brain.",
    blogTitle: "Why Do I Have 100 Unread Tabs? (And What It Says About Your Brain)",
    blogUrl: "https://prolificpersonalities.com/blog/why-do-i-have-100-unread-tabs",
    universalBody:
      `<p>Hey,</p>
<p>If you have 100 unread tabs, it is not because you are disorganized.</p>
<p>It is because your brain is trying to preserve optionality. Every tab is a \u201cmaybe later\u201d that felt important in the moment. The problem is not the tabs \u2014 it is the system that forces you to use tabs as a memory aid.</p>`,
    personalizedContext: {
      "novelty-seeker": "Novelty Seekers accumulate tabs the way others accumulate started projects \u2014 each one a genuine interest that deserved attention. The tab problem is a capture problem, not a focus problem.",
      "chaotic-creative": "Chaotic Creatives often use open tabs as a working memory system \u2014 keeping threads alive across projects. The issue is not the tabs themselves but the absence of a better capture system.",
      "adaptive-generalist": "Adaptive Generalists tend to accumulate tabs across multiple domains simultaneously. That is not a disorder \u2014 it is context-switching without a good handoff system.",
    },
  },

  // --- WEEK 10 ---
  {
    week: 10,
    subject: "Why accountability partners fail (and when they work)",
    preheader: "It depends on your archetype.",
    blogTitle: "Why Accountability Partners Work (And Why They Don\u2019t)",
    blogUrl: "https://prolificpersonalities.com/blog/why-accountability-partners-work-and-why-they-dont",
    universalBody:
      `<p>Hey,</p>
<p>Accountability partners are one of those things that work brilliantly for some people and do nothing for others.</p>
<p>The difference is not commitment level. It is whether external accountability matches how you are actually motivated.</p>
<p>Some archetypes are wired for internal accountability. External pressure helps others. Knowing which one you are changes how you structure support.</p>`,
    personalizedContext: {
      "anxious-perfectionist": "Anxious Perfectionists often find accountability partners backfire \u2014 adding performance anxiety on top of already high standards. Internal accountability structures tend to work better.",
      "flexible-improviser": "Flexible Improvisers frequently benefit from light-touch accountability \u2014 a check-in rather than a commitment structure, which can feel constraining.",
      "structured-achiever": "Structured Achievers tend to respond well to external accountability when the structure is clear. Ambiguous check-ins are less effective than defined expectations.",
    },
  },

  // --- WEEK 11 ---
  {
    week: 11,
    subject: "The app that consumes its own founder",
    preheader: "The obsession is the point.",
    blogTitle: "My Productivity App Can\u2019t Stop Me From Obsessing Over Building It",
    blogUrl: "https://prolificpersonalities.com/blog/my-productivity-app-cant-stop-me-from-obsessing-over-building-it",
    universalBody:
      `<p>Hey,</p>
<p>There is something specific that happens when you build a product you actually believe in.</p>
<p>The obsession does not feel like a problem. It feels like evidence.</p>
<p>This is about that \u2014 and about the difference between productive obsession and the kind that quietly drains you.</p>`,
    personalizedContext: null,
  },

  // --- WEEK 12 ---
  {
    week: 12,
    subject: "Working under pressure \u2014 the deeper question",
    preheader: "Not whether you do it. Why.",
    blogTitle: "I Can Only Work Under Pressure: Is Something Wrong With Me?",
    blogUrl: "https://prolificpersonalities.com/blog/i-can-only-work-under-pressure",
    universalBody:
      `<p>Hey,</p>
<p>We covered pressure-driven work a few months ago.</p>
<p>I want to go one level deeper today.</p>
<p>The question is not whether you work well under pressure. Most people do. The question is whether you are manufacturing pressure as a substitute for a system that generates natural momentum.</p>
<p>Those are two very different problems with two very different solutions.</p>`,
    personalizedContext: {
      "flexible-improviser": "For Flexible Improvisers, pressure often triggers the right brain state \u2014 but the goal is building a system that creates that state on demand, not just under duress.",
      "chaotic-creative": "For Chaotic Creatives, the real question is whether the pressure is genuine or manufactured \u2014 and whether there is a lighter way to access the same creative activation.",
    },
  },
];
