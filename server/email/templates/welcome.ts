import { wrapEmail, ctaButton, stripThe } from "../wrapper";

// Archetype-specific quick wins for welcome emails
const archetypeQuickWins: Record<string, { strength: string; pitfall: string; strategies: string[] }> = {
  'structured-achiever': {
    strength: 'Your exceptional ability to create and follow systems',
    pitfall: 'Over-planning at the expense of action',
    strategies: [
      'Start each day with your 3 most important tasks written down before checking email',
      'Use time-blocking to protect your deep work hours - schedule them like meetings',
      'Create a "shutdown ritual" to cleanly end your workday and prevent burnout'
    ]
  },
  'chaotic-creative': {
    strength: 'Your natural ability to generate innovative ideas and see connections others miss',
    pitfall: 'Jumping between projects without completing them',
    strategies: [
      'Capture ideas immediately in a single "inbox" (note app, voice memo) then process later',
      'Set a weekly "project completion day" where you finish one thing before starting anything new',
      'Use a visual progress tracker to stay motivated on longer projects'
    ]
  },
  'anxious-perfectionist': {
    strength: 'Your attention to detail and commitment to quality',
    pitfall: 'Analysis paralysis and procrastination from fear of imperfection',
    strategies: [
      'Set a "good enough" threshold before starting any task and honor it',
      'Break overwhelming tasks into 15-minute chunks to reduce anxiety',
      'Create a "done list" at the end of each day to recognize your progress'
    ]
  },
  'novelty-seeker': {
    strength: 'Your enthusiasm and ability to quickly learn new things',
    pitfall: 'Losing interest once the novelty wears off',
    strategies: [
      'Add variety to routine tasks by changing your environment or approach',
      'Partner with someone who excels at follow-through to complement your strengths',
      'Gamify your work with challenges, streaks, or rewards for completion'
    ]
  },
  'strategic-planner': {
    strength: 'Your ability to see the big picture and think long-term',
    pitfall: 'Getting lost in planning without taking action',
    strategies: [
      'For every plan you create, identify the very next physical action you can take today',
      'Set "planning budgets" - limit strategy sessions to 30 minutes then execute',
      'Use the 80/20 rule: identify which 20% of actions will deliver 80% of results'
    ]
  },
  'flexible-improviser': {
    strength: 'Your adaptability and ability to handle unexpected changes',
    pitfall: 'Lack of consistent systems and routines',
    strategies: [
      'Create a minimal daily routine with just 3 non-negotiable habits',
      'Use "if-then" planning for common situations instead of detailed schedules',
      'Review your week every Sunday to spot patterns and adjust course'
    ]
  },
  'adaptive-generalist': {
    strength: 'Your cognitive flexibility - you can switch between different mental modes based on context',
    pitfall: 'Decision fatigue from having to choose an approach for each task',
    strategies: [
      'Before starting any task, ask: "What does THIS task need?" Match approach to context.',
      'Build a toolkit of approaches rather than one system - variety is your strength',
      'Pre-decide modes for your week on Sunday to reduce daily decision fatigue'
    ]
  }
};

export interface WelcomeEmailData {
  recipientEmail: string;
  archetype: {
    id: string;
    title: string;
  };
  resultsUrl: string;
  unsubscribeUrl: string;
}

export function generateWelcomeEmail(data: WelcomeEmailData): { subject: string; html: string } {
  const { archetype, resultsUrl, unsubscribeUrl } = data;
  const quickWins = archetypeQuickWins[archetype.id] || archetypeQuickWins['structured-achiever'];

  const subject = `You're not broken. You just need a different approach.`;

  const strategiesHtml = quickWins.strategies.map((strategy, index) => `
                      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-left:4px solid #396969;margin-bottom:12px;border-radius:0 8px 8px 0;">
                        <tr>
                          <td style="padding:16px;">
                            <span style="font-weight:700;color:#396969;margin-right:8px;">${index + 1}.</span> ${strategy}
                          </td>
                        </tr>
                      </table>`).join('');

  const bodyContent = `
                    <p style="font-size:16px;color:#475569;margin:0 0 24px 0;">Hey,</p>

                    <p style="margin:0 0 20px 0;font-size:15px;color:#1a1a1a;line-height:1.6;">If you've ever felt like productivity advice just doesn't work for your brain, you're not alone.</p>

                    <p style="margin:0 0 20px 0;font-size:15px;color:#1a1a1a;line-height:1.6;">You just took the first step toward understanding why.</p>

                    <p style="margin:0 0 12px 0;font-size:15px;color:#1a1a1a;line-height:1.6;">Your archetype:</p>

                    <table cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                      <tr>
                        <td style="background-color:#f0f9ff;border:2px solid #396969;border-radius:8px;padding:8px 16px;font-weight:700;color:#396969;">${archetype.title}</td>
                      </tr>
                    </table>

                    <p style="margin:0 0 20px 0;font-size:15px;color:#1a1a1a;line-height:1.6;">This isn't about being "lazy" or "undisciplined." It's about understanding how YOUR brain actually works, so you can stop fighting yourself and start working with your natural tendencies.</p>

                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0fdf4;border:1px solid #86efac;border-radius:8px;margin-bottom:24px;">
                      <tr>
                        <td style="padding:16px;font-size:14px;color:#1a1a1a;line-height:1.6;">
                          <strong>Why this matters:</strong> Unlike generic personality tests, every strategy in your guide is backed by peer-reviewed research on executive function, motivation psychology, and cognitive load theory. Studies show personalized approaches improve effectiveness by 27-42%.
                        </td>
                      </tr>
                    </table>

                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;border-radius:8px;margin-bottom:24px;">
                      <tr>
                        <td style="padding:24px;">
                          <h2 style="color:#1a1a1a;font-size:18px;margin:0 0 16px 0;">3 strategies that actually work for ${stripThe(archetype.title)}s:</h2>
                          ${strategiesHtml}
                        </td>
                      </tr>
                    </table>

                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#ecfdf5;border-radius:8px;margin-bottom:16px;">
                      <tr>
                        <td style="padding:16px;">
                          <strong style="color:#059669;">Your unfair advantage:</strong> ${quickWins.strength}
                        </td>
                      </tr>
                    </table>

                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fef2f2;border-radius:8px;margin-bottom:24px;">
                      <tr>
                        <td style="padding:16px;">
                          <strong style="color:#dc2626;">The trap to avoid:</strong> ${quickWins.pitfall}
                        </td>
                      </tr>
                    </table>

                    <p style="margin:0 0 8px 0;color:#666666;font-size:14px;">Your full results are saved:</p>
                    ${ctaButton('View Your Results', `${resultsUrl}${resultsUrl.includes('?') ? '&' : '?'}utm_source=email&utm_medium=transactional&utm_campaign=welcome`)}

                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fef3c7;border-radius:8px;margin-top:24px;">
                      <tr>
                        <td style="padding:24px;">
                          <h3 style="color:#92400e;margin:0 0 12px 0;">Ready to go deeper?</h3>
                          <p style="margin:0;color:#78350f;font-size:15px;line-height:1.6;">The Premium Playbook (<span style="text-decoration:line-through;">$29</span> $19) gives you 100+ pages of research-backed strategies, a 30-day action plan with daily tasks, and productivity tools rated specifically for your archetype. It's the difference between knowing your type and actually transforming how you work.</p>
                        </td>
                      </tr>
                    </table>`;

  const html = wrapEmail(bodyContent, {
    preheader: `You're ${archetype.title}. Here are 3 strategies that work for your brain.`,
    footerNote: 'Research-backed productivity for how your brain actually works',
  });

  return { subject, html };
}

export function generateNewsletterWelcomeHtml(email: string, baseUrl: string): string {
  const bodyContent = `
                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">Thanks for subscribing! You'll receive weekly insights on productivity strategies matched to how your brain actually works.</p>

                    <p style="margin:0 0 16px 0;font-size:16px;color:#1a1a1a;line-height:1.7;"><strong>What to expect:</strong></p>
                    <ul style="margin:0 0 20px 0;padding-left:20px;font-size:16px;line-height:1.8;">
                      <li>Research-backed productivity strategies</li>
                      <li>Tips tailored to different working styles</li>
                      <li>Actionable micro-challenges you can try today</li>
                    </ul>

                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">Haven't discovered your productivity archetype yet? It only takes 5 minutes:</p>

                    ${ctaButton('Take the Free Quiz', `${baseUrl}/quiz?utm_source=email&utm_medium=transactional&utm_campaign=welcome`)}`;

  return wrapEmail(bodyContent, {
    preheader: 'Welcome! Weekly productivity insights matched to how your brain works.',
    footerNote: `You're receiving this because you subscribed at prolificpersonalities.com`,
  });
}
