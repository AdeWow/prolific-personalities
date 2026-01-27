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

  const subject = `Your Premium ${archetype.title} Playbook is Here! 🎉`;

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
            <p style="margin: 0; color: #78350f;">The Premium Playbook ($27) gives you 100+ pages of research-backed strategies, a 30-day action plan with daily tasks, and productivity tools rated specifically for your archetype. It's the difference between knowing your type and actually transforming how you work.</p>
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

// Weekly accountability email for Partner subscribers
export interface WeeklyAccountabilityEmailData {
  firstName: string | null;
  archetype: string;
  weekNumber: number;
}

const weeklyTips: { [key: string]: string[] } = {
  'the-dynamo': [
    "This week, try timeboxing your most ambitious project into 25-minute sprints. Dynamos thrive with focused bursts followed by quick wins.",
    "Challenge yourself: delegate one task you normally do yourself. Your visionary energy is needed for the big picture.",
    "Schedule your most creative work for the first 2 hours of your day—that's when your energy signature peaks.",
    "Try the 'two-list' method: keep your main goals list short (3 items max) and a separate 'parking lot' for ideas that excite you but aren't priorities.",
  ],
  'the-catalyst': [
    "This week, experiment with 'energy matching'—tackle collaborative tasks when you're feeling social, solo work when you need to recharge.",
    "Set up three quick check-ins with teammates this week. Your collaborative nature drives team momentum.",
    "Try documenting your decision-making process this week. It'll help you understand your intuitive leaps.",
    "Schedule a 'creative collision' meeting—bring together two people who don't usually work together for fresh ideas.",
  ],
  'the-architect': [
    "Focus on optimizing one system this week. Small process improvements compound over time for Architects.",
    "Schedule 90-minute deep work blocks for your most complex projects. Protect these times fiercely.",
    "This week, document a process you've mastered. Your systematic approach helps others level up.",
    "Try 'pre-mortem' thinking: before starting a project, imagine what could go wrong and plan around it.",
  ],
  'the-harmonizer': [
    "This week, prioritize relationship-building alongside your tasks. Your strength is in connection.",
    "Try batch-processing your communication—dedicate specific times for emails and messages to stay focused.",
    "Schedule a 'listening tour'—have coffee with three colleagues to understand their challenges better.",
    "This week, practice saying 'let me think about it' before committing to new requests.",
  ],
  'the-explorer': [
    "Embrace your curiosity this week: allocate 30 minutes daily to explore a topic tangent to your main work.",
    "Try connecting two unrelated ideas from different projects. Your exploratory mind finds unexpected solutions.",
    "This week, start documenting your exploration journey—future you will thank you for the breadcrumbs.",
    "Schedule 'wandering time' in your calendar. Explorers need space to discover unexpected connections.",
  ],
  'the-anchor': [
    "This week, reflect on how your consistent approach has helped your team. Stability is a superpower.",
    "Try introducing one small change to your routine. Anchors grow by expanding comfort zones gradually.",
    "Mentor someone this week—your reliable presence helps others feel grounded.",
    "Create a 'consistency playbook' for a recurring task. Others can benefit from your systematic approach.",
  ],
};

const motivationalQuotes = [
  { quote: "Progress, not perfection, is the goal.", author: "Unknown" },
  { quote: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { quote: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
  { quote: "Productivity is never an accident. It is always the result of commitment to excellence.", author: "Paul J. Meyer" },
  { quote: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { quote: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
];

export function generateWeeklyAccountabilityEmail(data: WeeklyAccountabilityEmailData): { subject: string; html: string } {
  const { firstName, archetype, weekNumber } = data;
  const archetypeKey = archetype.toLowerCase().replace(/ /g, '-');
  const tips = weeklyTips[archetypeKey] || weeklyTips['the-architect'];
  const weeklyTip = tips[weekNumber % tips.length];
  const quote = motivationalQuotes[weekNumber % motivationalQuotes.length];
  
  const greeting = firstName ? `Hi ${firstName}` : "Hey there";
  const subject = `Week ${weekNumber}: Your ${archetype} Productivity Check-in`;
  
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
          background: linear-gradient(135deg, #4f9a94 0%, #d4a574 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0 0 10px 0;
          font-size: 28px;
          font-weight: 700;
        }
        .header .week-badge {
          display: inline-block;
          background: rgba(255,255,255,0.2);
          padding: 4px 16px;
          border-radius: 20px;
          font-size: 14px;
        }
        .content {
          padding: 40px 30px;
        }
        .greeting {
          font-size: 18px;
          margin-bottom: 20px;
        }
        .tip-card {
          background: linear-gradient(135deg, #f0f9ff 0%, #f0fdf4 100%);
          border-left: 4px solid #4f9a94;
          padding: 20px;
          margin: 24px 0;
          border-radius: 0 8px 8px 0;
        }
        .tip-title {
          font-size: 16px;
          font-weight: 600;
          color: #4f9a94;
          margin: 0 0 12px 0;
        }
        .tip-text {
          color: #334155;
          margin: 0;
          font-size: 15px;
        }
        .quote-section {
          text-align: center;
          padding: 24px;
          background: #fef3c7;
          border-radius: 8px;
          margin: 24px 0;
        }
        .quote-text {
          font-style: italic;
          font-size: 18px;
          color: #92400e;
          margin: 0 0 8px 0;
        }
        .quote-author {
          color: #b45309;
          font-size: 14px;
        }
        .checklist {
          background: #f8fafc;
          padding: 20px;
          border-radius: 8px;
          margin: 24px 0;
        }
        .checklist-title {
          font-weight: 600;
          margin: 0 0 12px 0;
          color: #1e293b;
        }
        .checklist-item {
          display: flex;
          align-items: flex-start;
          margin-bottom: 8px;
          color: #475569;
        }
        .checkbox {
          width: 20px;
          height: 20px;
          border: 2px solid #4f9a94;
          border-radius: 4px;
          margin-right: 12px;
          flex-shrink: 0;
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
          margin-top: 20px;
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
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <span class="week-badge">Week ${weekNumber}</span>
          <h1>Your Weekly Check-in</h1>
        </div>
        
        <div class="content">
          <p class="greeting">${greeting},</p>
          
          <p>Welcome to your weekly productivity check-in as a <strong>${archetype}</strong>. Let's make this week count!</p>
          
          <div class="tip-card">
            <h3 class="tip-title">This Week's Focus</h3>
            <p class="tip-text">${weeklyTip}</p>
          </div>
          
          <div class="quote-section">
            <p class="quote-text">"${quote.quote}"</p>
            <span class="quote-author">— ${quote.author}</span>
          </div>
          
          <div class="checklist">
            <h3 class="checklist-title">Quick Weekly Reflection</h3>
            <div class="checklist-item">
              <div class="checkbox"></div>
              <span>What was your biggest win last week?</span>
            </div>
            <div class="checklist-item">
              <div class="checkbox"></div>
              <span>What challenge slowed you down?</span>
            </div>
            <div class="checklist-item">
              <div class="checkbox"></div>
              <span>What's your #1 priority this week?</span>
            </div>
          </div>
          
          <p>Remember: small, consistent progress beats sporadic bursts of productivity. You've got this!</p>
          
          <div style="text-align: center;">
            <a href="https://prolificpersonalities.com/dashboard" class="cta-button">View Your Progress</a>
          </div>
        </div>

        <div class="footer">
          <p><strong>Prolific Personalities</strong></p>
          <p>Your Partner in Productivity</p>
          <p class="unsubscribe">
            You're receiving this as a Partner subscriber.<br>
            <a href="https://prolificpersonalities.com/settings">Manage email preferences</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return { subject, html };
}