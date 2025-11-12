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
