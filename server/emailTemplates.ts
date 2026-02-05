import type { QuizScores } from "@shared/schema";

export interface EmailResultsData {
  recipientEmail: string;
  archetype: {
    id: string;
    title: string;
    tagline: string;
    description: string;
  };
  scores: QuizScores;
  resultsUrl: string;
}

export function generateResultsEmail(data: EmailResultsData): { subject: string; html: string } {
  const { archetype, scores, resultsUrl } = data;

  const subject = `Your Productivity Archetype: ${archetype.title}`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #1e293b;
          background-color: #f8fafc;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
        }
        .header {
          background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0 0 10px 0;
          font-size: 28px;
          font-weight: 700;
        }
        .header p {
          margin: 0;
          font-size: 16px;
          opacity: 0.95;
        }
        .content {
          padding: 40px 30px;
        }
        .archetype-card {
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          border: 2px solid #3b82f6;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 32px;
        }
        .archetype-title {
          color: #1e40af;
          font-size: 24px;
          font-weight: 700;
          margin: 0 0 8px 0;
        }
        .archetype-tagline {
          color: #3b82f6;
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 16px 0;
        }
        .archetype-description {
          color: #475569;
          font-size: 15px;
          line-height: 1.6;
          margin: 0;
        }
        .scores-section {
          margin-bottom: 32px;
        }
        .scores-title {
          color: #1e293b;
          font-size: 20px;
          font-weight: 700;
          margin: 0 0 20px 0;
        }
        .score-item {
          margin-bottom: 16px;
        }
        .score-label {
          display: flex;
          justify-content: space-between;
          margin-bottom: 6px;
          font-size: 14px;
          font-weight: 600;
          color: #475569;
        }
        .score-bar-container {
          background-color: #e2e8f0;
          border-radius: 8px;
          height: 12px;
          overflow: hidden;
        }
        .score-bar {
          background: linear-gradient(90deg, #4f46e5 0%, #3b82f6 100%);
          height: 100%;
          border-radius: 8px;
          transition: width 0.3s ease;
        }
        .cta-section {
          text-align: center;
          padding: 32px 0;
          border-top: 2px solid #e2e8f0;
          border-bottom: 2px solid #e2e8f0;
          margin-bottom: 32px;
        }
        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%);
          color: white;
          text-decoration: none;
          padding: 16px 32px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          margin-top: 16px;
        }
        .footer {
          background-color: #f8fafc;
          padding: 30px;
          text-align: center;
          color: #64748b;
          font-size: 14px;
        }
        .footer-link {
          color: #3b82f6;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎯 Your Productivity Archetype Results</h1>
          <p>Discover how you work best and maximize your potential</p>
        </div>
        
        <div class="content">
          <div class="archetype-card">
            <h2 class="archetype-title">${archetype.title}</h2>
            <p class="archetype-tagline">${archetype.tagline}</p>
            <p class="archetype-description">${archetype.description}</p>
          </div>

          <div class="scores-section">
            <h3 class="scores-title">Your 4-Axis Productivity Profile</h3>
            
            <div class="score-item">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 6px;">
                <tr>
                  <td style="font-size: 14px; font-weight: 600; color: #475569; text-align: left;">Structure Orientation</td>
                  <td style="font-size: 14px; font-weight: 600; color: #475569; text-align: right;">${scores.structure}/35</td>
                </tr>
              </table>
              <div class="score-bar-container">
                <div class="score-bar" style="width: ${(scores.structure / 35) * 100}%"></div>
              </div>
            </div>

            <div class="score-item">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 6px;">
                <tr>
                  <td style="font-size: 14px; font-weight: 600; color: #475569; text-align: left;">Motivation Style</td>
                  <td style="font-size: 14px; font-weight: 600; color: #475569; text-align: right;">${scores.motivation}/35</td>
                </tr>
              </table>
              <div class="score-bar-container">
                <div class="score-bar" style="width: ${(scores.motivation / 35) * 100}%"></div>
              </div>
            </div>

            <div class="score-item">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 6px;">
                <tr>
                  <td style="font-size: 14px; font-weight: 600; color: #475569; text-align: left;">Cognitive Focus</td>
                  <td style="font-size: 14px; font-weight: 600; color: #475569; text-align: right;">${scores.cognitive}/35</td>
                </tr>
              </table>
              <div class="score-bar-container">
                <div class="score-bar" style="width: ${(scores.cognitive / 35) * 100}%"></div>
              </div>
            </div>

            <div class="score-item">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 6px;">
                <tr>
                  <td style="font-size: 14px; font-weight: 600; color: #475569; text-align: left;">Task Relationship</td>
                  <td style="font-size: 14px; font-weight: 600; color: #475569; text-align: right;">${scores.task}/35</td>
                </tr>
              </table>
              <div class="score-bar-container">
                <div class="score-bar" style="width: ${(scores.task / 35) * 100}%"></div>
              </div>
            </div>
          </div>

          <div class="cta-section">
            <p style="font-size: 16px; color: #475569; margin: 0 0 8px 0;">
              View your complete results, personalized tool recommendations, and actionable insights:
            </p>
            <a href="${resultsUrl}" class="cta-button">
              View Full Results →
            </a>
          </div>

          <p style="color: #64748b; font-size: 14px; line-height: 1.6;">
            This assessment is based on research-backed psychological frameworks including Executive Function Theory, 
            Self-Determination Theory, and Flow State research. Your results provide personalized strategies to 
            optimize your productivity and align your work style with effective tools and methods.
          </p>
        </div>

        <div class="footer">
          <p>
            <strong>Prolific Personalities</strong><br>
            Science-backed productivity assessment
          </p>
          <p style="margin-top: 16px;">
            <a href="${resultsUrl}" class="footer-link">View Results</a> | 
            <a href="https://prolificpersonalities.com" class="footer-link">Take Another Assessment</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return { subject, html };
}

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

  const subject = `Your Premium ${archetype.title} Playbook is Here`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #1e293b;
          background-color: #f8fafc;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
        }
        .header {
          background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0 0 10px 0;
          font-size: 32px;
          font-weight: 700;
        }
        .header p {
          margin: 0;
          font-size: 18px;
          opacity: 0.95;
        }
        .content {
          padding: 40px 30px;
        }
        .success-icon {
          text-align: center;
          font-size: 64px;
          margin-bottom: 24px;
        }
        .message-box {
          background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
          border: 2px solid #10b981;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 32px;
        }
        .message-box h2 {
          color: #065f46;
          font-size: 20px;
          margin: 0 0 12px 0;
        }
        .message-box p {
          color: #047857;
          margin: 0;
          font-size: 16px;
        }
        .attachment-info {
          background: #f0f9ff;
          border-left: 4px solid #3b82f6;
          padding: 16px 20px;
          margin-bottom: 24px;
          border-radius: 4px;
        }
        .attachment-info p {
          margin: 0;
          color: #1e40af;
          font-weight: 600;
        }
        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%);
          color: white;
          text-decoration: none;
          padding: 16px 32px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          text-align: center;
          margin: 24px 0;
        }
        .whats-included {
          background: #fafafa;
          border-radius: 8px;
          padding: 24px;
          margin: 24px 0;
        }
        .whats-included h3 {
          color: #1e293b;
          margin: 0 0 16px 0;
          font-size: 18px;
        }
        .whats-included ul {
          margin: 0;
          padding-left: 20px;
        }
        .whats-included li {
          color: #475569;
          margin-bottom: 8px;
          line-height: 1.6;
        }
        .footer {
          background-color: #f8fafc;
          padding: 32px 30px;
          text-align: center;
          border-top: 1px solid #e2e8f0;
        }
        .footer p {
          margin: 8px 0;
          color: #64748b;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Payment Successful!</h1>
          <p>Your Premium Productivity Playbook is Ready</p>
        </div>
        
        <div class="content">
          <div class="success-icon">✅</div>
          
          <div class="message-box">
            <h2>Thank You for Your Purchase!</h2>
            <p>Your payment has been processed successfully. Your premium ${archetype.title} playbook is attached to this email.</p>
          </div>

          <div class="attachment-info">
            <p>📎 Your 100+ page personalized playbook is attached as a PDF</p>
          </div>

          <div class="whats-included">
            <h3>What's Inside Your Premium Playbook:</h3>
            <ul>
              <li><strong>Complete Implementation Guide:</strong> Step-by-step instructions tailored to ${archetype.title}</li>
              <li><strong>30-Day Action Plan:</strong> Daily actionable tasks to transform your productivity</li>
              <li><strong>Tool Setup Guides:</strong> Detailed tutorials for recommended productivity tools</li>
              <li><strong>Common Pitfalls & Solutions:</strong> Learn from others' mistakes and succeed faster</li>
              <li><strong>Customizable Templates:</strong> Ready-to-use planners, trackers, and worksheets</li>
              <li><strong>Scientific Research:</strong> Evidence-based strategies explained in depth</li>
            </ul>
          </div>

          <div style="text-align: center;">
            <a href="${resultsUrl}" class="cta-button">View Your Full Results</a>
          </div>

          <p style="margin-top: 32px; color: #64748b; font-size: 14px;">
            <strong>Need help?</strong> Reply to this email or contact us at 
            <a href="mailto:support@prolificpersonalities.com" style="color: #3b82f6;">support@prolificpersonalities.com</a>
          </p>
        </div>

        <div class="footer">
          <p><strong>Prolific Personalities</strong></p>
          <p>Science-backed productivity insights tailored to your unique working style</p>
          <p style="margin-top: 16px;">
            <a href="${resultsUrl}" style="color: #3b82f6; text-decoration: none;">View Results</a> •
            <a href="https://prolificpersonalities.com" style="color: #3b82f6; text-decoration: none;">Visit Website</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return { subject, html };
}

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

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #1e293b;
          background-color: #f8fafc;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
        }
        .header {
          background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0 0 10px 0;
          font-size: 24px;
          font-weight: 700;
        }
        .content {
          padding: 40px 30px;
        }
        .greeting {
          font-size: 16px;
          color: #475569;
          margin-bottom: 24px;
        }
        .archetype-badge {
          display: inline-block;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          border: 2px solid #3b82f6;
          border-radius: 8px;
          padding: 8px 16px;
          font-weight: 700;
          color: #1e40af;
          margin-bottom: 24px;
        }
        .quick-start {
          background-color: #f8fafc;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
        }
        .quick-start h2 {
          color: #1e293b;
          font-size: 18px;
          margin: 0 0 16px 0;
        }
        .strategy {
          background-color: white;
          border-left: 4px solid #4f46e5;
          padding: 16px;
          margin-bottom: 12px;
          border-radius: 0 8px 8px 0;
        }
        .strategy-number {
          font-weight: 700;
          color: #4f46e5;
          margin-right: 8px;
        }
        .strength-box {
          background-color: #ecfdf5;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 16px;
        }
        .strength-box strong {
          color: #059669;
        }
        .pitfall-box {
          background-color: #fef2f2;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 24px;
        }
        .pitfall-box strong {
          color: #dc2626;
        }
        .science-box {
          background-color: #f0fdf4;
          border: 1px solid #86efac;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 24px;
          font-size: 14px;
        }
        .cta-section {
          text-align: center;
          padding: 24px 0;
          border-top: 2px solid #e2e8f0;
          margin-top: 24px;
        }
        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%);
          color: white;
          text-decoration: none;
          padding: 14px 28px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
        }
        .premium-teaser {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border-radius: 12px;
          padding: 24px;
          margin-top: 24px;
        }
        .premium-teaser h3 {
          color: #92400e;
          margin: 0 0 12px 0;
        }
        .footer {
          background-color: #f8fafc;
          padding: 30px;
          text-align: center;
          color: #64748b;
          font-size: 14px;
        }
        .unsubscribe {
          margin-top: 16px;
          font-size: 12px;
        }
        .unsubscribe a {
          color: #94a3b8;
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>You're ${archetype.title}</h1>
        </div>
        
        <div class="content">
          <p class="greeting">Hey,</p>
          
          <p>If you've ever felt like productivity advice just doesn't work for your brain, you're not alone.</p>
          
          <p>You just took the first step toward understanding why.</p>
          
          <p>Your archetype:</p>
          
          <div class="archetype-badge">${archetype.title}</div>
          
          <p>This isn't about being "lazy" or "undisciplined." It's about understanding how YOUR brain actually works, so you can stop fighting yourself and start working with your natural tendencies.</p>
          
          <div class="science-box">
            <strong>Why this matters:</strong> Unlike generic personality tests, every strategy in your guide is backed by peer-reviewed research on executive function, motivation psychology, and cognitive load theory. Studies show personalized approaches improve effectiveness by 27-42%.
          </div>
          
          <div class="quick-start">
            <h2>3 strategies that actually work for ${archetype.title}s:</h2>
            
            ${quickWins.strategies.map((strategy, index) => `
              <div class="strategy">
                <span class="strategy-number">${index + 1}.</span> ${strategy}
              </div>
            `).join('')}
          </div>
          
          <div class="strength-box">
            <strong>Your unfair advantage:</strong> ${quickWins.strength}
          </div>
          
          <div class="pitfall-box">
            <strong>The trap to avoid:</strong> ${quickWins.pitfall}
          </div>
          
          <div class="cta-section">
            <p style="margin: 0 0 16px 0; color: #64748b;">Your full results are saved:</p>
            <a href="${resultsUrl}" class="cta-button">View Your Results</a>
          </div>
          
          <div class="premium-teaser">
            <h3>Ready to go deeper?</h3>
            <p style="margin: 0; color: #78350f;">The Premium Playbook (<span style="text-decoration: line-through;">$29</span> $19) gives you 100+ pages of research-backed strategies, a 30-day action plan with daily tasks, and productivity tools rated specifically for your archetype. It's the difference between knowing your type and actually transforming how you work.</p>
          </div>
        </div>

        <div class="footer">
          <p><strong>Prolific Personalities</strong></p>
          <p>Research-backed productivity for how your brain actually works</p>
          <p class="unsubscribe">
            <a href="${unsubscribeUrl}">Unsubscribe</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

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

  const subject = `Still thinking about the ${archetype.title} Playbook?`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #1e293b;
          background-color: #f8fafc;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
        }
        .header {
          background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 700;
        }
        .content {
          padding: 40px 30px;
        }
        .greeting {
          font-size: 16px;
          color: #475569;
        }
        .science-note {
          background-color: #f0fdf4;
          border: 1px solid #86efac;
          border-radius: 8px;
          padding: 16px;
          margin: 20px 0;
          font-size: 14px;
        }
        .benefits-list {
          background-color: #f8fafc;
          border-radius: 12px;
          padding: 24px;
          margin: 24px 0;
        }
        .benefits-list h3 {
          color: #1e293b;
          margin: 0 0 16px 0;
        }
        .benefit-item {
          padding: 12px 0;
          border-bottom: 1px solid #e2e8f0;
        }
        .benefit-item:last-child {
          border-bottom: none;
        }
        .benefit-item strong {
          color: #4f46e5;
        }
        .price-box {
          text-align: center;
          padding: 24px;
          margin: 24px 0;
        }
        .price {
          font-size: 32px;
          font-weight: 700;
          color: #1e293b;
        }
        .price-note {
          color: #64748b;
          font-size: 14px;
        }
        .guarantee {
          background-color: #ecfdf5;
          border-radius: 8px;
          padding: 16px;
          text-align: center;
          margin: 24px 0;
        }
        .guarantee strong {
          color: #059669;
        }
        .cta-button {
          display: block;
          background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%);
          color: white;
          text-decoration: none;
          padding: 16px 32px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 18px;
          text-align: center;
          margin: 24px 0;
        }
        .footer {
          background-color: #f8fafc;
          padding: 30px;
          text-align: center;
          color: #64748b;
          font-size: 14px;
        }
        .unsubscribe {
          margin-top: 16px;
          font-size: 12px;
        }
        .unsubscribe a {
          color: #94a3b8;
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Take Your Time</h1>
        </div>
        
        <div class="content">
          <p class="greeting">Hey,</p>
          
          <p>I noticed you were checking out the <strong>${archetype.title} Playbook</strong> yesterday. No rush—I get it. $19 is still money, and you want to know it's worth it.</p>
          
          <p>Here's what I'll say: if you've spent years trying productivity systems that felt wrong for how you actually think, this is different.</p>
          
          <div class="science-note">
            <strong>The research angle:</strong> Every strategy in the playbook is backed by peer-reviewed studies on executive function and motivation psychology. We're not just repackaging "wake up at 5 AM" advice. Studies show personalized approaches like this improve productivity by 27-42%.
          </div>
          
          <div class="benefits-list">
            <h3>What you'd get:</h3>
            
            <div class="benefit-item">
              <strong>A 30-day action plan</strong> with specific daily tasks designed for how ${archetype.title}s actually work (not generic advice that assumes everyone's brain is the same)
            </div>
            <div class="benefit-item">
              <strong>Your specific failure modes</strong> — the traps other ${archetype.title}s fall into, so you can avoid them
            </div>
            <div class="benefit-item">
              <strong>Tool recommendations</strong> rated for your archetype (which apps work for you vs. which ones will waste your time)
            </div>
            <div class="benefit-item">
              <strong>Interactive progress tracking</strong> so you can see your improvement over time
            </div>
          </div>
          
          <div class="price-box">
            <div class="price">$19</div>
            <div class="price-note">One-time purchase. Keep forever.</div>
          </div>
          
          <div class="guarantee">
            <strong>30-day satisfaction guarantee.</strong><br>
            If it doesn't resonate with you, I'll refund it. No awkward questions.
          </div>
          
          <a href="${checkoutUrl}" class="cta-button">Get the Playbook</a>
          
          <p style="color: #64748b; font-size: 14px;">Questions? Just reply to this email. I read every one.</p>
        </div>

        <div class="footer">
          <p><strong>Prolific Personalities</strong></p>
          <p>Research-backed productivity for how your brain actually works</p>
          <p class="unsubscribe">
            <a href="${unsubscribeUrl}">Unsubscribe</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

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
    emoji: "🚀",
    headerGradient: "linear-gradient(135deg, #4f9a94 0%, #3d8b85 100%)",
    introText: (archetype) => `As a ${archetype}, your unique strengths set you up for a powerful week. Let's build on that momentum.`,
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
    emoji: "🧠",
    headerGradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    introText: (archetype) => `Happy Monday! As a ${archetype}, your mindset is your greatest asset. Let's set the tone for an intentional week.`,
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
    emoji: "⚡",
    headerGradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    introText: (archetype) => `Time for an energy check! As a ${archetype}, understanding what energizes you is key to sustainable productivity.`,
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
    emoji: "🎯",
    headerGradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    introText: (archetype) => `Let's prepare for a week of focused work. As a ${archetype}, you have unique ways of achieving deep concentration.`,
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
    emoji: "📊",
    headerGradient: "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
    introText: (archetype) => `Let's take your progress pulse! As a ${archetype}, tracking your wins helps you build on what's working.`,
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
    emoji: "🔄",
    headerGradient: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
    introText: (archetype) => `Time for a strategic reset! As a ${archetype}, periodic resets help you stay aligned with what matters most.`,
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
    emoji: "💪",
    headerGradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
    introText: (archetype) => `Let's spotlight your strengths! As a ${archetype}, leaning into what you do best accelerates your results.`,
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
    emoji: "🌟",
    headerGradient: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
    introText: (archetype) => `Let's set intentions for the week ahead! As a ${archetype}, clarity of purpose drives your best work.`,
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
  const subject = `${theme.themeTitle}: Your ${archetype} Weekly Check-in`;
  
  const reflectionHtml = theme.reflectionQuestions.map(q => `
    <div style="display: flex; align-items: flex-start; margin-bottom: 8px; color: #475569;">
      <div style="width: 20px; height: 20px; border: 2px solid #4f9a94; border-radius: 4px; margin-right: 12px; flex-shrink: 0;"></div>
      <span>${q}</span>
    </div>
  `).join('');
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1e293b; background-color: #f8fafc; margin: 0; padding: 0;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        
        <div style="background: ${theme.headerGradient}; color: white; padding: 40px 30px; text-align: center;">
          <span style="display: inline-block; background: rgba(255,255,255,0.2); padding: 4px 16px; border-radius: 20px; font-size: 14px;">Week ${((weekNumber - 1) % 8) + 1} of 8</span>
          <h1 style="margin: 10px 0 0 0; font-size: 28px; font-weight: 700;">${theme.themeTitle}</h1>
        </div>
        
        <div style="padding: 40px 30px;">
          <p style="font-size: 18px; margin-bottom: 20px;">${greeting},</p>
          
          <p style="margin-bottom: 20px;">${theme.introText(archetype)}</p>
          
          <div style="background: linear-gradient(135deg, #f0f9ff 0%, #f0fdf4 100%); border-left: 4px solid #4f9a94; padding: 20px; margin: 24px 0; border-radius: 0 8px 8px 0;">
            <h3 style="font-size: 16px; font-weight: 600; color: #4f9a94; margin: 0 0 12px 0;">${theme.challengeTitle}</h3>
            <p style="color: #334155; margin: 0; font-size: 15px;">${weeklyTip}</p>
          </div>
          
          <div style="text-align: center; padding: 24px; background: #fef3c7; border-radius: 8px; margin: 24px 0;">
            <p style="font-style: italic; font-size: 18px; color: #92400e; margin: 0 0 8px 0;">"${quote.quote}"</p>
            <span style="color: #b45309; font-size: 14px;">— ${quote.author}</span>
          </div>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 24px 0;">
            <h3 style="font-weight: 600; margin: 0 0 12px 0; color: #1e293b;">Quick Weekly Reflection</h3>
            ${reflectionHtml}
          </div>
          
          <p style="margin-bottom: 20px;">${theme.closingText}</p>
          
          <div style="text-align: center;">
            <a href="https://prolificpersonalities.com/dashboard" style="display: inline-block; background: linear-gradient(135deg, #4f9a94 0%, #3d8b85 100%); color: white !important; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; margin-top: 20px;">${theme.ctaText}</a>
          </div>
          
          <p style="margin-top: 30px; color: #64748b; font-size: 14px;">Keep going — you're building something great,</p>
          <p style="color: #1e293b; font-weight: 600;">— A.</p>
        </div>

        <div style="text-align: center; padding: 30px; background: #f1f5f9; color: #64748b; font-size: 14px;">
          <p style="margin: 0;"><strong>Prolific Personalities</strong></p>
          <p style="margin: 8px 0 0 0;">Your Partner in Productivity</p>
          <p style="margin-top: 16px; font-size: 12px;">
            You're receiving this as a Partner subscriber.<br>
            <a href="https://prolificpersonalities.com/settings" style="color: #94a3b8;">Manage email preferences</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return { subject, html };
}

import { getArchetypeContent, formatArchetypeName } from './email-content';

const BASE_URL = process.env.APP_URL || 'https://prolificpersonalities.com';

function getEmailBaseStyles(): string {
  return `
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.7;
      color: #1e293b;
      background-color: #f8fafc;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      padding: 30px 30px 20px;
      text-align: center;
      border-bottom: 1px solid #e2e8f0;
    }
    .logo {
      width: 180px;
      height: auto;
    }
    .content {
      padding: 40px 30px;
    }
    .content p {
      margin: 0 0 20px 0;
      font-size: 16px;
    }
    .highlight-box {
      background: #f0fdf4;
      border-left: 4px solid #4f9a94;
      padding: 20px;
      margin: 24px 0;
      border-radius: 0 8px 8px 0;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #4f9a94 0%, #3d8b85 100%);
      color: white !important;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
    }
    .cta-center {
      text-align: center;
      margin: 32px 0;
    }
    .footer {
      text-align: center;
      padding: 30px;
      background: #f1f5f9;
      color: #64748b;
      font-size: 14px;
    }
    .footer a {
      color: #4f9a94;
    }
    .unsubscribe {
      margin-top: 16px;
      font-size: 12px;
    }
    .unsubscribe a {
      color: #94a3b8;
    }
    .signature {
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #e2e8f0;
    }
  `;
}

function getEmailHeader(): string {
  return `
    <div class="header">
      <h2 style="text-align:center;color:#2d2d2d;font-family:Arial,sans-serif;margin:0;font-size:24px;">Prolific Personalities</h2>
    </div>
  `;
}

function getEmailFooter(email: string): string {
  const unsubscribeUrl = `${BASE_URL}/unsubscribe?email=${encodeURIComponent(email)}`;
  return `
    <div class="footer">
      <p><strong>Prolific Personalities</strong></p>
      <p>prolificpersonalities.com</p>
      <p class="unsubscribe">
        <a href="${unsubscribeUrl}">Unsubscribe</a>
      </p>
    </div>
  `;
}

export interface NurtureEmailUser {
  email: string;
  archetype: string;
}

export function generateAbandonedCartEmailV2(user: NurtureEmailUser): { subject: string; html: string } {
  const archetypeName = formatArchetypeName(user.archetype);
  const checkoutUrl = `${BASE_URL}/results?archetype=${user.archetype}#upsell`;
  
  const subject = "Still thinking it over? Here's what helped me decide";
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>${getEmailBaseStyles()}</style>
    </head>
    <body>
      <div class="container">
        ${getEmailHeader()}
        <div class="content">
          <p>Hey,</p>
          
          <p>I noticed you started checking out the ${archetypeName} Playbook but didn't complete your purchase. No worries at all — $19 is still a decision worth thinking about.</p>
          
          <p>I want to be straight with you about what you're getting:</p>
          
          <div class="highlight-box">
            <p style="margin: 0 0 16px 0;"><strong>This is for you if:</strong></p>
            <ul style="margin: 0; padding-left: 20px;">
              <li>You've taken the quiz and want a complete system designed for your specific archetype</li>
              <li>You're ready to actually implement strategies, not just read about them</li>
              <li>You want research-backed approaches, not generic productivity advice</li>
            </ul>
          </div>
          
          <div class="highlight-box" style="background: #fef2f2; border-color: #ef4444;">
            <p style="margin: 0 0 16px 0;"><strong>This probably isn't for you if:</strong></p>
            <ul style="margin: 0; padding-left: 20px;">
              <li>You're looking for a magic fix — this requires your participation</li>
              <li>You already have a productivity system that's working well</li>
              <li>You're more interested in reading about productivity than changing your habits</li>
            </ul>
          </div>
          
          <p>Either way, there's a <strong>30-day money-back guarantee</strong>. If the strategies don't help, you get a full refund. No questions, no hassle.</p>
          
          <p>If you decide it's right for you, here's the link:</p>
          
          <div class="cta-center">
            <a href="${checkoutUrl}" class="cta-button">Complete Your Purchase</a>
          </div>
          
          <div class="signature">
            <p style="margin: 0;">— A.<br><span style="color: #64748b;">Founder, Prolific Personalities</span></p>
          </div>
        </div>
        ${getEmailFooter(user.email)}
      </div>
    </body>
    </html>
  `;
  
  return { subject, html };
}

export function generateDay3NurtureEmail(user: NurtureEmailUser): { subject: string; html: string } {
  const content = getArchetypeContent(user.archetype);
  const archetypeName = content?.name || formatArchetypeName(user.archetype);
  
  const subject = `The hidden advantage of being a ${archetypeName}`;
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>${getEmailBaseStyles()}</style>
    </head>
    <body>
      <div class="container">
        ${getEmailHeader()}
        <div class="content">
          <p>Hey,</p>
          
          <p>Three days ago you discovered you're a <strong>${archetypeName}</strong>. Let me tell you why that's actually a significant advantage.</p>
          
          <p>${content?.day3Advantage || "Your unique productivity profile gives you strengths that others don't have. The key is learning to work with your natural tendencies rather than against them."}</p>
          
          <div class="highlight-box">
            <p style="margin: 0 0 8px 0;"><strong>Quick Win for Today:</strong></p>
            <p style="margin: 0;">${content?.day3QuickTip || "Start by identifying one task you've been avoiding and approach it in a new way that matches your natural working style."}</p>
          </div>
          
          <p>This is just scratching the surface. The full ${archetypeName} Playbook goes deep on how to turn these insights into daily systems that actually stick.</p>
          
          <p>More coming in a couple days.</p>
          
          <div class="signature">
            <p style="margin: 0;">— A.<br><span style="color: #64748b;">Founder, Prolific Personalities</span></p>
          </div>
        </div>
        ${getEmailFooter(user.email)}
      </div>
    </body>
    </html>
  `;
  
  return { subject, html };
}

export function generateDay5NurtureEmail(user: NurtureEmailUser): { subject: string; html: string } {
  const content = getArchetypeContent(user.archetype);
  const archetypeName = content?.name || formatArchetypeName(user.archetype);
  const playbookUrl = `${BASE_URL}/results?archetype=${user.archetype}#upsell`;
  
  const subject = `The #1 mistake ${archetypeName}s make (and it's not what you think)`;
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>${getEmailBaseStyles()}</style>
    </head>
    <body>
      <div class="container">
        ${getEmailHeader()}
        <div class="content">
          <p>Hey,</p>
          
          <p>I've analyzed thousands of ${archetypeName} profiles. There's one mistake that shows up over and over — and it's probably not what you'd expect.</p>
          
          <p>${content?.day5Mistake || "The most common mistake isn't about willpower or discipline. It's about using strategies designed for a different type of brain."}</p>
          
          <div class="highlight-box">
            <p style="margin: 0 0 8px 0;"><strong>The Fix:</strong></p>
            <p style="margin: 0;">${content?.day5Fix || "Try one small experiment today: approach your biggest task in a completely different way than you normally would."}</p>
          </div>
          
          <p>The ${archetypeName} Playbook has the complete system for avoiding this trap — including specific tools and workflows designed for your cognitive style.</p>
          
          <div class="cta-center">
            <a href="${playbookUrl}" class="cta-button">See the Full System</a>
          </div>
          
          <div class="signature">
            <p style="margin: 0;">— A.<br><span style="color: #64748b;">Founder, Prolific Personalities</span></p>
          </div>
        </div>
        ${getEmailFooter(user.email)}
      </div>
    </body>
    </html>
  `;
  
  return { subject, html };
}

export function generateDay7NurtureEmail(user: NurtureEmailUser): { subject: string; html: string } {
  const content = getArchetypeContent(user.archetype);
  const archetypeName = content?.name || formatArchetypeName(user.archetype);
  const playbookUrl = `${BASE_URL}/results?archetype=${user.archetype}#upsell`;
  
  const subject = "Stop using the wrong tools for your brain";
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>${getEmailBaseStyles()}</style>
    </head>
    <body>
      <div class="container">
        ${getEmailHeader()}
        <div class="content">
          <p>Hey,</p>
          
          <p>Here's something most productivity advice gets wrong: tool effectiveness depends entirely on your cognitive profile.</p>
          
          <p>Research on person-environment fit (Kristof-Brown et al., 2005) shows that the same tool can be transformative for one person and useless for another. It's not about finding the "best" tool — it's about finding the right tool <em>for you</em>.</p>
          
          <p>As a ${archetypeName}, here's what the research suggests:</p>
          
          <div class="highlight-box">
            <p style="margin: 0;">${content?.day7Tool || "Choose tools that match your natural working style. The best productivity system is one you'll actually use consistently."}</p>
          </div>
          
          <p>The playbook includes a complete tool-matching guide with specific recommendations for each aspect of the ${archetypeName} profile.</p>
          
          <div class="cta-center">
            <a href="${playbookUrl}" class="cta-button">Get the Tool Matching Guide</a>
          </div>
          
          <div class="signature">
            <p style="margin: 0;">— A.<br><span style="color: #64748b;">Founder, Prolific Personalities</span></p>
          </div>
        </div>
        ${getEmailFooter(user.email)}
      </div>
    </body>
    </html>
  `;
  
  return { subject, html };
}

export function generateDay10NurtureEmail(user: NurtureEmailUser): { subject: string; html: string } {
  const content = getArchetypeContent(user.archetype);
  const archetypeName = content?.name || formatArchetypeName(user.archetype);
  const playbookUrl = `${BASE_URL}/results?archetype=${user.archetype}#upsell`;
  
  const subject = `How a ${archetypeName} went from stuck to unstoppable`;
  
  const stories: Record<string, { before: string; after: string; quote: string }> = {
    "chaotic-creative": {
      before: "I had 47 open browser tabs, 12 half-finished projects, and couldn't remember why I started any of them.",
      after: "Now I capture everything in one place and rotate between my top 3 projects daily. I've shipped more in the last month than the previous six.",
      quote: "The rotation system changed everything. I don't fight my brain anymore — I work with it."
    },
    "anxious-perfectionist": {
      before: "I was spending 4 hours on emails that should take 20 minutes. Everything had to be perfect before I could hit send.",
      after: "I now set timers and ship at 80%. The quality is still excellent, but I'm actually finishing things.",
      quote: "My 80% really is other people's 100%. I just needed permission to believe that."
    },
    "structured-achiever": {
      before: "My systems were so rigid that any unexpected change would derail my entire week. I was productive but fragile.",
      after: "I built in checkpoint reviews and buffer time. My consistency is now sustainable instead of brittle.",
      quote: "Learning when to break my own rules was the unlock I didn't know I needed."
    },
    "novelty-seeker": {
      before: "I'd find a great productivity system, use it for a week, get bored, and abandon it. Repeat forever.",
      after: "I stopped trying to find the 'perfect' system and started rotating between three that work. Boredom is now part of the plan.",
      quote: "Rotation IS my system. I wish someone had told me that years ago."
    },
    "strategic-planner": {
      before: "I spent weeks researching the best approach and never actually started. Analysis paralysis was my default state.",
      after: "I now set decision deadlines with specific criteria. Research has a purpose instead of being procrastination in disguise.",
      quote: "Pre-committing to when I'll decide removed the infinite loop."
    },
    "flexible-improviser": {
      before: "I was great at putting out fires but had no sense of what I was building toward. Busy but not productive.",
      after: "One weekly review changed everything. 30 minutes of planning gives me direction without killing my adaptability.",
      quote: "I needed minimal structure, not no structure. Big difference."
    }
  };
  
  const story = stories[user.archetype] || stories["chaotic-creative"];
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>${getEmailBaseStyles()}</style>
    </head>
    <body>
      <div class="container">
        ${getEmailHeader()}
        <div class="content">
          <p>Hey,</p>
          
          <p>I wanted to share a story that might sound familiar.</p>
          
          <p><strong>Before:</strong></p>
          <p style="font-style: italic; color: #64748b;">"${story.before}"</p>
          
          <p><strong>After working through the ${archetypeName} strategies:</strong></p>
          <p style="font-style: italic; color: #64748b;">"${story.after}"</p>
          
          <div class="highlight-box">
            <p style="margin: 0; font-style: italic;">"${story.quote}"</p>
          </div>
          
          <p>If this resonates, the ${archetypeName} Playbook has the complete system that made this transformation possible.</p>
          
          <div class="cta-center">
            <a href="${playbookUrl}" class="cta-button">Get the ${archetypeName} Playbook</a>
          </div>
          
          <div class="signature">
            <p style="margin: 0;">— A.<br><span style="color: #64748b;">Founder, Prolific Personalities</span></p>
          </div>
        </div>
        ${getEmailFooter(user.email)}
      </div>
    </body>
    </html>
  `;
  
  return { subject, html };
}

export function generateDay14NurtureEmail(user: NurtureEmailUser): { subject: string; html: string } {
  const content = getArchetypeContent(user.archetype);
  const archetypeName = content?.name || formatArchetypeName(user.archetype);
  const playbookUrl = `${BASE_URL}/results?archetype=${user.archetype}#upsell`;
  
  const subject = "I procrastinated on building an anti-procrastination platform (true story)";
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>${getEmailBaseStyles()}</style>
    </head>
    <body>
      <div class="container">
        ${getEmailHeader()}
        <div class="content">
          <p>Hey,</p>
          
          <p>True confession: I procrastinated on launching a platform designed to help people stop procrastinating. For <em>months</em>.</p>
          
          <p>I have ADHD. I know what it's like when your brain won't cooperate with your intentions. I've read every productivity book, tried every system, and blamed myself for every failure.</p>
          
          <p>Then I discovered Dr. Tim Pychyl's research at Carleton University. The breakthrough? <strong>Procrastination isn't a time management problem. It's an emotion regulation problem.</strong></p>
          
          <p>We don't avoid tasks because we're lazy. We avoid them because they trigger uncomfortable emotions — anxiety, boredom, frustration — and our brains choose short-term relief over long-term goals.</p>
          
          <p>The fix isn't better planning. It's understanding your specific emotional patterns and building systems that work <em>with</em> your brain instead of against it.</p>
          
          <p>That's what Prolific Personalities is. That's what the ${archetypeName} Playbook contains. Research-backed strategies designed for the brain you actually have — not the brain productivity gurus assume you should have.</p>
          
          <div class="cta-center">
            <a href="${playbookUrl}" class="cta-button">Get the ${archetypeName} Playbook — $19</a>
          </div>
          
          <p style="text-align: center; color: #64748b; font-size: 14px;">No countdown timer. No "limited spots." Just research-backed strategies designed for your archetype.</p>
          
          <div class="highlight-box" style="background: #f8fafc; border-color: #94a3b8;">
            <p style="margin: 0; font-size: 14px; color: #64748b;"><strong>Note:</strong> This is the last email in this series. I won't keep filling your inbox. If you want the playbook, great. If not, no hard feelings.</p>
          </div>
          
          <div class="signature">
            <p style="margin: 0;">— A.<br><span style="color: #64748b;">Founder, Prolific Personalities</span></p>
          </div>
        </div>
        ${getEmailFooter(user.email)}
      </div>
    </body>
    </html>
  `;
  
  return { subject, html };
}

export function generateDay3OnboardEmail(user: NurtureEmailUser): { subject: string; html: string } {
  const content = getArchetypeContent(user.archetype);
  const archetypeName = content?.name || formatArchetypeName(user.archetype);
  const playbookUrl = `${BASE_URL}/playbook/${user.archetype}`;
  
  const subject = `Quick question about your ${archetypeName} playbook`;
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>${getEmailBaseStyles()}</style>
    </head>
    <body>
      <div class="container">
        ${getEmailHeader()}
        <div class="content">
          <p>Hey,</p>
          
          <p>Quick question: have you tried one strategy from the playbook yet?</p>
          
          <p>Research on implementation intentions (Gollwitzer, 1999) shows that specificity beats motivation every time. "I'll be more productive" doesn't work. "I'll try the 2-minute brain dump right after I finish my morning coffee" does.</p>
          
          <p>You don't need to do everything at once. Start with the strategy that feels least intimidating. The one where you think "yeah, I could probably do that today."</p>
          
          <div class="highlight-box">
            <p style="margin: 0;"><strong>Pro tip:</strong> The first strategy in Chapter 1 is designed to be the easiest starting point. Even if you just read that section and try one thing, you're ahead of 90% of people who buy self-improvement resources.</p>
          </div>
          
          <div class="cta-center">
            <a href="${playbookUrl}" class="cta-button">Open Your Playbook</a>
          </div>
          
          <p>Hit reply and let me know what you tried — I read every email.</p>
          
          <div class="signature">
            <p style="margin: 0;">— A.<br><span style="color: #64748b;">Founder, Prolific Personalities</span></p>
          </div>
        </div>
        ${getEmailFooter(user.email)}
      </div>
    </body>
    </html>
  `;
  
  return { subject, html };
}

export function generateDay7OnboardEmail(user: NurtureEmailUser): { subject: string; html: string } {
  const content = getArchetypeContent(user.archetype);
  const archetypeName = content?.name || formatArchetypeName(user.archetype);
  const playbookUrl = `${BASE_URL}/playbook/${user.archetype}`;
  
  const subject = "One week in — here's what matters";
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>${getEmailBaseStyles()}</style>
    </head>
    <body>
      <div class="container">
        ${getEmailHeader()}
        <div class="content">
          <p>Hey,</p>
          
          <p>It's been a week since you got the ${archetypeName} Playbook. Here's what I want you to know:</p>
          
          <p><strong>If you've implemented one strategy — even imperfectly:</strong><br>
          You're ahead of 90% of people who buy self-improvement resources. Seriously. Research from Lally et al. (2010) shows habit formation takes an average of 66 days. You're in the messy middle. Keep going.</p>
          
          <p><strong>If you tried something and it didn't work:</strong><br>
          That's data, not failure. Every archetype has multiple strategies for a reason — different situations call for different approaches. Try another one.</p>
          
          <p><strong>If you haven't started yet:</strong><br>
          No judgment. Today's a new day. Pick the smallest possible action from the playbook — something that takes less than 5 minutes — and do it before you close this email.</p>
          
          <div class="cta-center">
            <a href="${playbookUrl}" class="cta-button">Continue Your Playbook</a>
          </div>
          
          <p>Remember: progress isn't linear. What matters is that you keep showing up.</p>
          
          <div class="signature">
            <p style="margin: 0;">— A.<br><span style="color: #64748b;">Founder, Prolific Personalities</span></p>
          </div>
        </div>
        ${getEmailFooter(user.email)}
      </div>
    </body>
    </html>
  `;
  
  return { subject, html };
}

export function generateDay30OnboardEmail(user: NurtureEmailUser): { subject: string; html: string } {
  const content = getArchetypeContent(user.archetype);
  const archetypeName = content?.name || formatArchetypeName(user.archetype);
  const quizUrl = `${BASE_URL}/quiz`;
  
  const subject = "30 days later — has your archetype shifted?";
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>${getEmailBaseStyles()}</style>
    </head>
    <body>
      <div class="container">
        ${getEmailHeader()}
        <div class="content">
          <p>Hey,</p>
          
          <p>It's been 30 days since you got the ${archetypeName} Playbook. I have a question for you:</p>
          
          <p><strong>Has your archetype shifted?</strong></p>
          
          <p>The 4-axis framework measures preferences, not fixed traits. As you grow and implement new strategies, your preferences can evolve. That's a sign of growth, not inconsistency.</p>
          
          <p>I'd encourage you to retake the quiz:</p>
          
          <ul style="margin: 20px 0; padding-left: 20px;">
            <li><strong>If you get the same archetype:</strong> Your strategies are reinforcing your natural strengths. You're building on a solid foundation.</li>
            <li><strong>If you get a different archetype:</strong> You've grown! And with lifetime access, you automatically get the new playbook too.</li>
          </ul>
          
          <div class="cta-center">
            <a href="${quizUrl}" class="cta-button">Retake the Assessment</a>
          </div>
          
          <div class="highlight-box">
            <p style="margin: 0 0 12px 0;"><strong>One more thing — would you share your experience?</strong></p>
            <p style="margin: 0;">I'd love to hear from you. Just reply to this email and tell me:</p>
            <ol style="margin: 12px 0 0 0; padding-left: 20px;">
              <li>What was your biggest challenge before the playbook?</li>
              <li>What shifted for you?</li>
              <li>Would you recommend it to others?</li>
            </ol>
          </div>
          
          <p>Thanks for being part of this. Your feedback helps me make this better for everyone.</p>
          
          <div class="signature">
            <p style="margin: 0;">— A.<br><span style="color: #64748b;">Founder, Prolific Personalities</span></p>
          </div>
        </div>
        ${getEmailFooter(user.email)}
      </div>
    </body>
    </html>
  `;
  
  return { subject, html };
}