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
              <div class="score-label">
                <span>Structure Orientation</span>
                <span>${scores.structure}/35</span>
              </div>
              <div class="score-bar-container">
                <div class="score-bar" style="width: ${(scores.structure / 35) * 100}%"></div>
              </div>
            </div>

            <div class="score-item">
              <div class="score-label">
                <span>Motivation Style</span>
                <span>${scores.motivation}/35</span>
              </div>
              <div class="score-bar-container">
                <div class="score-bar" style="width: ${(scores.motivation / 35) * 100}%"></div>
              </div>
            </div>

            <div class="score-item">
              <div class="score-label">
                <span>Cognitive Focus</span>
                <span>${scores.cognitive}/35</span>
              </div>
              <div class="score-bar-container">
                <div class="score-bar" style="width: ${(scores.cognitive / 35) * 100}%"></div>
              </div>
            </div>

            <div class="score-item">
              <div class="score-label">
                <span>Task Relationship</span>
                <span>${scores.task}/35</span>
              </div>
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
            <p>Your payment of $27 has been processed successfully. Your premium ${archetype.title} playbook is attached to this email.</p>
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

  const subject = `Welcome, ${archetype.title}! Your Productivity Guide Is Here`;

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
          <h1>Your Productivity Guide Is Here</h1>
        </div>
        
        <div class="content">
          <p class="greeting">Hi there,</p>
          
          <p>Congratulations on discovering your productivity archetype:</p>
          
          <div class="archetype-badge">${archetype.title}</div>
          
          <p>You're one of the rare individuals who understands that productivity isn't one-size-fits-all. That's already a huge advantage.</p>
          
          <div class="quick-start">
            <h2>Your Quick-Start Guide: 3 Strategies for ${archetype.title}s</h2>
            
            ${quickWins.strategies.map((strategy, index) => `
              <div class="strategy">
                <span class="strategy-number">${index + 1}.</span> ${strategy}
              </div>
            `).join('')}
          </div>
          
          <div class="strength-box">
            <strong>Your Key Strength:</strong> ${quickWins.strength}
          </div>
          
          <div class="pitfall-box">
            <strong>Watch Out For:</strong> ${quickWins.pitfall}
          </div>
          
          <div class="cta-section">
            <p style="margin: 0 0 16px 0; color: #64748b;">Your results are saved and ready to view anytime:</p>
            <a href="${resultsUrl}" class="cta-button">View Your Full Results</a>
          </div>
          
          <div class="premium-teaser">
            <h3>Want the complete playbook?</h3>
            <p style="margin: 0; color: #78350f;">Your free results give you the overview, but the Premium Playbook ($27) gives you 100+ pages of strategies, a 30-day implementation plan, and tool recommendations rated for your archetype.</p>
          </div>
        </div>

        <div class="footer">
          <p><strong>Prolific Personalities</strong></p>
          <p>Science-backed productivity insights tailored to your unique working style</p>
          <p class="unsubscribe">
            <a href="${unsubscribeUrl}">Unsubscribe from these emails</a>
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

  const subject = `Your ${archetype.title} Playbook is waiting`;

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
          <h1>You Left Something Behind</h1>
        </div>
        
        <div class="content">
          <p class="greeting">Hi there,</p>
          
          <p>I noticed you started to get your <strong>${archetype.title} Premium Playbook</strong> but didn't finish checking out.</p>
          
          <p>No pressure at all - I just wanted to make sure nothing went wrong on our end.</p>
          
          <div class="benefits-list">
            <h3>Quick reminder of what's inside your personalized playbook:</h3>
            
            <div class="benefit-item">
              <strong>Deep-dive analysis</strong> of how ${archetype.title}s think, work, and thrive
            </div>
            <div class="benefit-item">
              <strong>30-day action plan</strong> with specific daily tasks (not generic advice)
            </div>
            <div class="benefit-item">
              <strong>Tool recommendations</strong> rated specifically for your working style
            </div>
            <div class="benefit-item">
              <strong>Common failure modes</strong> so you don't fall into the typical ${archetype.title} traps
            </div>
            <div class="benefit-item">
              <strong>Bonus:</strong> Implementation worksheets you can print and use
            </div>
          </div>
          
          <div class="price-box">
            <div class="price">$27</div>
            <div class="price-note">One-time payment (not a subscription)</div>
          </div>
          
          <div class="guarantee">
            <strong>30-day satisfaction guarantee.</strong><br>
            If it doesn't help, you get a full refund. No questions asked.
          </div>
          
          <a href="${checkoutUrl}" class="cta-button">Complete My Purchase</a>
          
          <p style="color: #64748b; font-size: 14px;">If you have any questions about whether it's right for you, just reply to this email. I'm happy to help.</p>
        </div>

        <div class="footer">
          <p><strong>Prolific Personalities</strong></p>
          <p>Science-backed productivity insights tailored to your unique working style</p>
          <p class="unsubscribe">
            <a href="${unsubscribeUrl}">Unsubscribe from these emails</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return { subject, html };
}