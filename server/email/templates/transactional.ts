import { wrapEmail, ctaButton, stripThe, aOrAn, getPublicBaseUrl } from "../wrapper";

export interface PremiumPlaybookEmailData {
  recipientEmail: string;
  archetype: {
    id: string;
    title: string;
    tagline: string;
  };
  resultsUrl: string;
}

export function generatePremiumPlaybookEmail(data: PremiumPlaybookEmailData): { subject: string; html: string } {
  const { archetype, resultsUrl } = data;

  const subject = `Your ${stripThe(archetype.title)} Playbook is Here`;

  const bodyContent = `
                    <h1 style="margin:0 0 24px 0;font-size:24px;font-weight:700;color:#1a1a1a;">Payment Successful!</h1>

                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#ecfdf5;border:2px solid #10b981;border-radius:8px;margin-bottom:32px;">
                      <tr>
                        <td style="padding:24px;">
                          <h2 style="color:#065f46;font-size:20px;margin:0 0 12px 0;">Thank You for Your Purchase!</h2>
                          <p style="color:#047857;margin:0;font-size:16px;">Your payment has been processed successfully. Your premium ${stripThe(archetype.title)} playbook is attached to this email.</p>
                        </td>
                      </tr>
                    </table>

                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f9ff;border-left:4px solid #396969;margin-bottom:24px;border-radius:4px;">
                      <tr>
                        <td style="padding:16px 20px;">
                          <p style="margin:0;color:#396969;font-weight:600;">Your 100+ page personalized playbook is attached as a PDF</p>
                        </td>
                      </tr>
                    </table>

                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fafafa;border-radius:8px;margin-bottom:24px;">
                      <tr>
                        <td style="padding:24px;">
                          <h3 style="color:#1a1a1a;margin:0 0 16px 0;font-size:18px;">What's Inside Your Premium Playbook:</h3>
                          <ul style="margin:0;padding-left:20px;color:#475569;line-height:1.8;">
                            <li><strong>Complete Implementation Guide:</strong> Step-by-step instructions tailored to ${stripThe(archetype.title)}s</li>
                            <li><strong>30-Day Action Plan:</strong> Daily actionable tasks to transform your productivity</li>
                            <li><strong>Tool Setup Guides:</strong> Detailed tutorials for recommended productivity tools</li>
                            <li><strong>Common Pitfalls &amp; Solutions:</strong> Learn from others' mistakes and succeed faster</li>
                            <li><strong>Customizable Templates:</strong> Ready-to-use planners, trackers, and worksheets</li>
                            <li><strong>Scientific Research:</strong> Evidence-based strategies explained in depth</li>
                          </ul>
                        </td>
                      </tr>
                    </table>

                    ${ctaButton('View Your Full Results', `${resultsUrl}${resultsUrl.includes('?') ? '&' : '?'}utm_source=email&utm_medium=transactional&utm_campaign=premium-delivery`)}

                    <p style="margin-top:32px;color:#666666;font-size:14px;">
                      <strong>Need help?</strong> Reply to this email or contact us at
                      <a href="mailto:support@prolificpersonalities.com" style="color:#396969;">support@prolificpersonalities.com</a>
                    </p>`;

  const html = wrapEmail(bodyContent, {
    preheader: 'Your Premium Productivity Playbook is ready to download.',
    footerNote: 'Science-backed productivity insights tailored to your unique working style',
  });

  return { subject, html };
}

export interface AbandonedCartEmailData {
  recipientEmail: string;
  archetype: {
    id: string;
    title: string;
  };
  checkoutUrl: string;
  unsubscribeUrl: string;
}

export function generateAbandonedCartEmail(data: AbandonedCartEmailData): { subject: string; html: string } {
  const { archetype, checkoutUrl, unsubscribeUrl } = data;

  const subject = `Still thinking about the ${stripThe(archetype.title)} Playbook?`;

  const bodyContent = `
                    <p style="font-size:16px;color:#475569;margin:0 0 24px 0;">Hey,</p>

                    <p style="margin:0 0 20px 0;font-size:15px;color:#1a1a1a;line-height:1.6;">I noticed you were checking out the <strong>${stripThe(archetype.title)} Playbook</strong> yesterday. No rush—I get it. $19 is still money, and you want to know it's worth it.</p>

                    <p style="margin:0 0 20px 0;font-size:15px;color:#1a1a1a;line-height:1.6;">Here's what I'll say: if you've spent years trying productivity systems that felt wrong for how you actually think, this is different.</p>

                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0fdf4;border:1px solid #86efac;border-radius:8px;margin-bottom:24px;">
                      <tr>
                        <td style="padding:16px;font-size:14px;color:#1a1a1a;line-height:1.6;">
                          <strong>The research angle:</strong> Every strategy in the playbook is backed by peer-reviewed studies on executive function and motivation psychology. We're not just repackaging "wake up at 5 AM" advice. Studies show personalized approaches like this improve productivity by 27-42%.
                        </td>
                      </tr>
                    </table>

                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;border-radius:8px;margin-bottom:24px;">
                      <tr>
                        <td style="padding:24px;">
                          <h3 style="color:#1a1a1a;margin:0 0 16px 0;">What you'd get:</h3>

                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr><td style="padding:12px 0;border-bottom:1px solid #e2e8f0;color:#475569;line-height:1.6;"><strong style="color:#396969;">A 30-day action plan</strong> with specific daily tasks designed for how ${stripThe(archetype.title)}s actually work (not generic advice that assumes everyone's brain is the same)</td></tr>
                            <tr><td style="padding:12px 0;border-bottom:1px solid #e2e8f0;color:#475569;line-height:1.6;"><strong style="color:#396969;">Your specific failure modes</strong> — the traps other ${stripThe(archetype.title)}s fall into, so you can avoid them</td></tr>
                            <tr><td style="padding:12px 0;border-bottom:1px solid #e2e8f0;color:#475569;line-height:1.6;"><strong style="color:#396969;">Tool recommendations</strong> rated for your archetype (which apps work for you vs. which ones will waste your time)</td></tr>
                            <tr><td style="padding:12px 0;color:#475569;line-height:1.6;"><strong style="color:#396969;">Interactive progress tracking</strong> so you can see your improvement over time</td></tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <table width="100%" cellpadding="0" cellspacing="0" style="text-align:center;margin-bottom:24px;">
                      <tr>
                        <td style="padding:24px;">
                          <p style="font-size:32px;font-weight:700;color:#1a1a1a;margin:0;">$19</p>
                          <p style="color:#666666;font-size:14px;margin:8px 0 0 0;">One-time purchase. Keep forever.</p>
                        </td>
                      </tr>
                    </table>

                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#ecfdf5;border-radius:8px;text-align:center;margin-bottom:24px;">
                      <tr>
                        <td style="padding:16px;">
                          <strong style="color:#059669;">30-day satisfaction guarantee.</strong><br>
                          If it doesn't resonate with you, I'll refund it. No awkward questions.
                        </td>
                      </tr>
                    </table>

                    ${ctaButton('Get the Playbook', `${checkoutUrl}${checkoutUrl.includes('?') ? '&' : '?'}utm_source=email&utm_medium=transactional&utm_campaign=abandoned-cart`)}

                    <p style="color:#666666;font-size:14px;margin:0;">Questions? Just reply to this email. I read every one.</p>`;

  const html = wrapEmail(bodyContent, {
    preheader: `The ${stripThe(archetype.title)} Playbook is waiting for you.`,
    footerNote: 'Research-backed productivity for how your brain actually works',
  });

  return { subject, html };
}

// Weekly accountability email for Partner subscribers - 8 unique rotating templates
export interface WeeklyAccountabilityEmailData {
  firstName: string | null;
  archetype: string;
  weekNumber: number;
}

// 8 weeks of archetype-specific tips (rotates every 8 weeks)
const weeklyTipsBy8Weeks: { [archetype: string]: string[] } = {
  'structured-achiever': [
    "Week 1 Challenge: Create a 'flexible buffer' in your schedule — leave one hour unplanned this week. Notice how you adapt when structure bends.",
    "Week 2 Challenge: Pick one task and complete it to 80% instead of 100%. Practice releasing the need for perfection.",
    "Week 3 Challenge: Try a new productivity method outside your comfort zone (mind mapping, voice notes, etc.). Expand your toolkit.",
    "Week 4 Challenge: Delegate one task you usually do yourself. Trust others to handle it — even if differently than you would.",
    "Week 5 Challenge: Schedule 'white space' — 30 minutes with no agenda. Let your structured mind wander creatively.",
    "Week 6 Challenge: Identify one system that's become overly complex. Simplify it. Sometimes less structure means more flow.",
    "Week 7 Challenge: Celebrate progress over perfection. List 3 things you moved forward this week, regardless of completion.",
    "Week 8 Challenge: Ask a colleague for feedback on your work style. Structured Achievers grow by understanding others' perspectives.",
  ],
  'chaotic-creative': [
    "Week 1 Challenge: Create ONE simple structure for your most important project. Just one rule to follow this week.",
    "Week 2 Challenge: Try time-boxing: set a 25-minute timer for a task you've been avoiding. Creativity thrives within constraints.",
    "Week 3 Challenge: Capture your brilliant ideas in ONE place this week. A notes app, a notebook — just one spot.",
    "Week 4 Challenge: Complete something before starting something new. Finish one project, no matter how small.",
    "Week 5 Challenge: Schedule your most creative work during your peak energy hours. Protect that time fiercely.",
    "Week 6 Challenge: Create a 'chaos container' — a specific time block where you allow yourself to explore freely.",
    "Week 7 Challenge: Partner with a Structured Achiever on a project. Let them handle the structure while you drive the vision.",
    "Week 8 Challenge: Review your past week and identify one pattern in your creative process. Self-awareness amplifies your gifts.",
  ],
  'anxious-perfectionist': [
    "Week 1 Challenge: Ship something imperfect on purpose. Send that email, submit that draft — done is better than perfect.",
    "Week 2 Challenge: Set a 'worry window' — 15 minutes to write down all concerns, then close the notebook and move on.",
    "Week 3 Challenge: When you catch yourself over-researching, stop and take action instead. Trust what you already know.",
    "Week 4 Challenge: Practice the 2-minute rule: if a decision takes less than 2 minutes, make it immediately. No deliberation.",
    "Week 5 Challenge: Celebrate a 'good enough' moment from this week. Reframe imperfection as progress.",
    "Week 6 Challenge: Ask yourself: 'What would I do if I wasn't afraid of making a mistake?' Then do that thing.",
    "Week 7 Challenge: Set a deadline for one thing you've been perfecting. Commit to finishing by that date, no extensions.",
    "Week 8 Challenge: Share work-in-progress with someone you trust. Practice vulnerability as a productivity tool.",
  ],
  'novelty-seeker': [
    "Week 1 Challenge: Finish one thing you started before starting anything new. Channel your energy toward completion.",
    "Week 2 Challenge: Create a 'shiny object' parking lot — write down new ideas but commit to exploring them later.",
    "Week 3 Challenge: Find the novelty in a routine task. How can you make something boring more interesting?",
    "Week 4 Challenge: Pair a new exciting task with a necessary boring one. Use novelty as a reward for discipline.",
    "Week 5 Challenge: Set a 'depth goal' — spend more time on one thing instead of breadth across many things.",
    "Week 6 Challenge: Interview someone who does deep, focused work. Learn from their approach to find new inspiration.",
    "Week 7 Challenge: Create consequences for abandoning projects. What will you give up if you don't finish?",
    "Week 8 Challenge: Celebrate sustained focus. Track how many days you stuck with one project this week.",
  ],
  'strategic-planner': [
    "Week 1 Challenge: Start one task without a complete plan. Practice taking action with 70% of the information.",
    "Week 2 Challenge: Set a time limit on planning. When the timer ends, execute — even if the plan isn't perfect.",
    "Week 3 Challenge: Try 'rapid prototyping' — build a quick version instead of planning the perfect version.",
    "Week 4 Challenge: Ask for feedback earlier in your process. Let others' input shape your plans before they're final.",
    "Week 5 Challenge: Identify one area where you're over-planning. What would happen if you just started?",
    "Week 6 Challenge: Practice 'good enough' planning. Create a one-page plan instead of a ten-page document.",
    "Week 7 Challenge: Delegate the planning for one small project. Trust someone else's approach.",
    "Week 8 Challenge: Reflect on when action taught you more than planning. What did spontaneity reveal?",
  ],
  'flexible-improviser': [
    "Week 1 Challenge: Commit to ONE system or routine for the whole week. Just one — and stick to it.",
    "Week 2 Challenge: Plan your tomorrow before today ends. A small structure can amplify your adaptability.",
    "Week 3 Challenge: Document what's working in your improvisational approach. Make your genius repeatable.",
    "Week 4 Challenge: Say 'no' to one opportunity this week. Not everything deserves your flexible attention.",
    "Week 5 Challenge: Create a 'default' for one decision you make repeatedly. Remove that daily choice.",
    "Week 6 Challenge: Partner with a Strategic Planner on a project. Let structure complement your adaptability.",
    "Week 7 Challenge: Set one non-negotiable boundary this week. Flexibility needs fences to be sustainable.",
    "Week 8 Challenge: Review patterns in your improvisations. What themes emerge? Use insights to be more intentional.",
  ],
  'adaptive-generalist': [
    "Week 1 Challenge: Choose ONE mode (structure, creativity, or flexibility) to lean into this week. Go deep, not wide.",
    "Week 2 Challenge: Identify which of your multiple approaches works best for which situations. Create a personal playbook.",
    "Week 3 Challenge: Embrace being 'multi-modal' — schedule different work styles for different days.",
    "Week 4 Challenge: Ask colleagues what they value most about your versatility. Use that insight intentionally.",
    "Week 5 Challenge: Notice when you're spreading too thin across modes. Pick the best approach for your current goal.",
    "Week 6 Challenge: Create 'mode triggers' — specific situations that tell you which approach to use.",
    "Week 7 Challenge: Teach someone else about adaptability. Your ability to shift contexts is a learnable skill.",
    "Week 8 Challenge: Celebrate your range. List three situations where your generalist nature saved the day.",
  ],
};

// 8 unique motivational quotes that rotate weekly
const weeklyQuotes = [
  { quote: "Progress, not perfection, is the goal.", author: "Unknown" },
  { quote: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { quote: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
  { quote: "Productivity is never an accident. It is always the result of commitment to excellence.", author: "Paul J. Meyer" },
  { quote: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { quote: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { quote: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { quote: "What you do today can improve all your tomorrows.", author: "Ralph Marston" },
];

// 8 unique email themes with different formats
interface WeeklyEmailTheme {
  themeTitle: string;
  emoji: string;
  headerGradient: string;
  introText: (archetype: string) => string;
  challengeTitle: string;
  reflectionQuestions: string[];
  closingText: string;
  ctaText: string;
}

const weeklyEmailThemes: WeeklyEmailTheme[] = [
  {
    themeTitle: "Weekly Momentum Check",
    emoji: "\u{1F680}",
    headerGradient: "linear-gradient(135deg, #4f9a94 0%, #3d8b85 100%)",
    introText: (archetype) => `As ${aOrAn(archetype)} ${archetype}, your unique strengths set you up for a powerful week. Let's build on that momentum.`,
    challengeTitle: "This Week's Growth Challenge",
    reflectionQuestions: [
      "What was your biggest win last week?",
      "What challenge slowed you down?",
      "What's your #1 priority this week?",
    ],
    closingText: "Small, consistent progress beats sporadic bursts. You've got this!",
    ctaText: "Track Your Progress",
  },
  {
    themeTitle: "Mindset Monday",
    emoji: "\u{1F9E0}",
    headerGradient: "linear-gradient(135deg, #396969 0%, #396969 100%)",
    introText: (archetype) => `Happy Monday! As ${aOrAn(archetype)} ${archetype}, your mindset is your greatest asset. Let's set the tone for an intentional week.`,
    challengeTitle: "Your Mindset Shift This Week",
    reflectionQuestions: [
      "What limiting belief can you challenge this week?",
      "What's one thing you're grateful for about your work style?",
      "How can you show up as your best self today?",
    ],
    closingText: "Your thoughts shape your productivity. Choose empowering ones.",
    ctaText: "View Your Insights",
  },
  {
    themeTitle: "Energy Audit",
    emoji: "\u{26A1}",
    headerGradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    introText: (archetype) => `Time for an energy check! As ${aOrAn(archetype)} ${archetype}, understanding what energizes you is key to sustainable productivity.`,
    challengeTitle: "This Week's Energy Focus",
    reflectionQuestions: [
      "What activities gave you energy last week?",
      "What drained your energy?",
      "How can you do more of what energizes you?",
    ],
    closingText: "Protect your energy like the valuable resource it is.",
    ctaText: "Optimize Your Energy",
  },
  {
    themeTitle: "Deep Focus Friday Prep",
    emoji: "\u{1F3AF}",
    headerGradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    introText: (archetype) => `Let's prepare for a week of focused work. As ${aOrAn(archetype)} ${archetype}, you have unique ways of achieving deep concentration.`,
    challengeTitle: "Your Focus Challenge",
    reflectionQuestions: [
      "What's the ONE thing that would make this week a success?",
      "What distractions will you eliminate?",
      "When is your peak focus time?",
    ],
    closingText: "Deep focus is a skill. Each week you practice, you get stronger.",
    ctaText: "Plan Your Focus Blocks",
  },
  {
    themeTitle: "Progress Pulse",
    emoji: "\u{1F4CA}",
    headerGradient: "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
    introText: (archetype) => `Let's take your progress pulse! As ${aOrAn(archetype)} ${archetype}, tracking your wins helps you build on what's working.`,
    challengeTitle: "This Week's Progress Target",
    reflectionQuestions: [
      "What did you accomplish that you're proud of?",
      "What's 1% better this week than last?",
      "What habit is becoming more automatic?",
    ],
    closingText: "Celebrate small wins. They compound into massive results.",
    ctaText: "See Your Progress",
  },
  {
    themeTitle: "Strategic Reset",
    emoji: "\u{1F504}",
    headerGradient: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
    introText: (archetype) => `Time for a strategic reset! As ${aOrAn(archetype)} ${archetype}, periodic resets help you stay aligned with what matters most.`,
    challengeTitle: "Your Reset Focus",
    reflectionQuestions: [
      "What's working that you should keep doing?",
      "What's not working that you should stop?",
      "What new approach might help?",
    ],
    closingText: "Sometimes progress means stepping back to leap forward.",
    ctaText: "Refine Your Strategy",
  },
  {
    themeTitle: "Strengths Spotlight",
    emoji: "\u{1F4AA}",
    headerGradient: "linear-gradient(135deg, #396969 0%, #396969 100%)",
    introText: (archetype) => `Let's spotlight your strengths! As ${aOrAn(archetype)} ${archetype}, leaning into what you do best accelerates your results.`,
    challengeTitle: "Leverage Your Strengths",
    reflectionQuestions: [
      "When did you feel 'in the zone' last week?",
      "How can you use your natural talents more?",
      "What strength has others noticed in you?",
    ],
    closingText: "Your unique combination of strengths is your competitive advantage.",
    ctaText: "Explore Your Strengths",
  },
  {
    themeTitle: "Intentional Week Ahead",
    emoji: "\u{1F31F}",
    headerGradient: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
    introText: (archetype) => `Let's set intentions for the week ahead! As ${aOrAn(archetype)} ${archetype}, clarity of purpose drives your best work.`,
    challengeTitle: "Your Weekly Intention",
    reflectionQuestions: [
      "What word or theme will guide your week?",
      "What will you say 'no' to protect your priorities?",
      "How will you know this week was successful?",
    ],
    closingText: "Intention plus action equals transformation.",
    ctaText: "Set Your Intentions",
  },
];

export function generateWeeklyAccountabilityEmail(data: WeeklyAccountabilityEmailData): { subject: string; html: string } {
  const { firstName, archetype, weekNumber } = data;

  // Use modulo 8 to rotate through themes (weeks 1-8 cycle)
  const themeIndex = (weekNumber - 1) % 8;
  const theme = weeklyEmailThemes[themeIndex];
  const quote = weeklyQuotes[themeIndex];

  // Get archetype-specific tip for this week
  // Handle both formats: "The Structured Achiever" -> "structured-achiever" and "structured-achiever"
  const archetypeKey = archetype.toLowerCase().replace(/^the\s+/, '').replace(/ /g, '-');
  const tips = weeklyTipsBy8Weeks[archetypeKey] || weeklyTipsBy8Weeks['adaptive-generalist'];
  const weeklyTip = tips[themeIndex];

  const greeting = firstName ? `Hi ${firstName}` : "Hey there";
  const displayName = stripThe(archetype);
  const subject = `${theme.themeTitle}: Your ${displayName} Weekly Check-in`;

  const reflectionHtml = theme.reflectionQuestions.map(q => `
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
                        <tr>
                          <td style="width:32px;vertical-align:top;padding-top:2px;">
                            <div style="width:18px;height:18px;border:2px solid #396969;border-radius:4px;"></div>
                          </td>
                          <td style="color:#475569;font-size:15px;line-height:1.6;">${q}</td>
                        </tr>
                      </table>`).join('');

  const bodyContent = `
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                      <tr>
                        <td style="text-align:center;">
                          <span style="display:inline-block;background-color:#396969;color:#ffffff;padding:4px 16px;border-radius:20px;font-size:14px;">Week ${((weekNumber - 1) % 8) + 1} of 8</span>
                        </td>
                      </tr>
                    </table>

                    <h1 style="margin:0 0 24px 0;font-size:24px;font-weight:700;color:#1a1a1a;text-align:center;">${theme.emoji} ${theme.themeTitle}</h1>

                    <p style="font-size:17px;margin:0 0 20px 0;color:#1a1a1a;line-height:1.6;">${greeting},</p>

                    <p style="margin:0 0 20px 0;font-size:15px;color:#1a1a1a;line-height:1.6;">${theme.introText(displayName)}</p>

                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f9ff;border-left:4px solid #396969;margin-bottom:24px;border-radius:0 8px 8px 0;">
                      <tr>
                        <td style="padding:20px;">
                          <h3 style="font-size:16px;font-weight:600;color:#396969;margin:0 0 12px 0;">${theme.challengeTitle}</h3>
                          <p style="color:#334155;margin:0;font-size:15px;line-height:1.6;">${weeklyTip}</p>
                        </td>
                      </tr>
                    </table>

                    <table width="100%" cellpadding="0" cellspacing="0" style="text-align:center;padding:24px;background-color:#fef3c7;border-radius:8px;margin-bottom:24px;">
                      <tr>
                        <td style="padding:24px;">
                          <p style="font-style:italic;font-size:18px;color:#92400e;margin:0 0 8px 0;">"${quote.quote}"</p>
                          <span style="color:#b45309;font-size:14px;">— ${quote.author}</span>
                        </td>
                      </tr>
                    </table>

                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;border-radius:8px;margin-bottom:24px;">
                      <tr>
                        <td style="padding:20px;">
                          <h3 style="font-weight:600;margin:0 0 12px 0;color:#1a1a1a;">Quick Weekly Reflection</h3>
                          ${reflectionHtml}
                        </td>
                      </tr>
                    </table>

                    <p style="margin:0 0 20px 0;font-size:15px;color:#1a1a1a;line-height:1.6;">${theme.closingText}</p>

                    ${ctaButton(theme.ctaText, `${getPublicBaseUrl()}/dashboard?utm_source=email&utm_medium=weekly&utm_campaign=accountability`)}

                    <p style="margin-top:30px;color:#666666;font-size:14px;">Keep going — you're building something great,</p>`;

  const html = wrapEmail(bodyContent, {
    preheader: `${theme.themeTitle}: Your weekly ${displayName} check-in is here.`,
    footerNote: "You're receiving this as a Partner subscriber.",
  });

  return { subject, html };
}
