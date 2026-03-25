import type { QuizScores } from "@shared/schema";
import { wrapEmail, ctaButton } from "../wrapper";

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

  const bodyContent = `
                    <h1 style="margin:0 0 8px 0;font-size:24px;font-weight:700;color:#1a1a1a;">Your Productivity Archetype Results</h1>
                    <p style="margin:0 0 32px 0;font-size:15px;color:#666666;">Discover how you work best and maximize your potential</p>

                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb;border:2px solid #396969;border-radius:8px;margin-bottom:32px;">
                      <tr>
                        <td style="padding:24px;">
                          <h2 style="color:#396969;font-size:22px;font-weight:700;margin:0 0 8px 0;">${archetype.title}</h2>
                          <p style="color:#396969;font-size:15px;font-weight:600;margin:0 0 16px 0;">${archetype.tagline}</p>
                          <p style="color:#475569;font-size:15px;line-height:1.6;margin:0;">${archetype.description}</p>
                        </td>
                      </tr>
                    </table>

                    <h3 style="color:#1a1a1a;font-size:18px;font-weight:700;margin:0 0 20px 0;">Your 4-Axis Productivity Profile</h3>

                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px;">
                      <tr>
                        <td style="font-size:14px;font-weight:600;color:#475569;text-align:left;">Structure Orientation</td>
                        <td style="font-size:14px;font-weight:600;color:#475569;text-align:right;">${scores.structure}/35</td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding-top:6px;">
                          <div style="background-color:#e2e8f0;border-radius:8px;height:12px;overflow:hidden;">
                            <div style="background-color:#396969;height:100%;border-radius:8px;width:${(scores.structure / 35) * 100}%;"></div>
                          </div>
                        </td>
                      </tr>
                    </table>

                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px;">
                      <tr>
                        <td style="font-size:14px;font-weight:600;color:#475569;text-align:left;">Motivation Style</td>
                        <td style="font-size:14px;font-weight:600;color:#475569;text-align:right;">${scores.motivation}/35</td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding-top:6px;">
                          <div style="background-color:#e2e8f0;border-radius:8px;height:12px;overflow:hidden;">
                            <div style="background-color:#396969;height:100%;border-radius:8px;width:${(scores.motivation / 35) * 100}%;"></div>
                          </div>
                        </td>
                      </tr>
                    </table>

                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px;">
                      <tr>
                        <td style="font-size:14px;font-weight:600;color:#475569;text-align:left;">Cognitive Focus</td>
                        <td style="font-size:14px;font-weight:600;color:#475569;text-align:right;">${scores.cognitive}/35</td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding-top:6px;">
                          <div style="background-color:#e2e8f0;border-radius:8px;height:12px;overflow:hidden;">
                            <div style="background-color:#396969;height:100%;border-radius:8px;width:${(scores.cognitive / 35) * 100}%;"></div>
                          </div>
                        </td>
                      </tr>
                    </table>

                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
                      <tr>
                        <td style="font-size:14px;font-weight:600;color:#475569;text-align:left;">Task Relationship</td>
                        <td style="font-size:14px;font-weight:600;color:#475569;text-align:right;">${scores.task}/35</td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding-top:6px;">
                          <div style="background-color:#e2e8f0;border-radius:8px;height:12px;overflow:hidden;">
                            <div style="background-color:#396969;height:100%;border-radius:8px;width:${(scores.task / 35) * 100}%;"></div>
                          </div>
                        </td>
                      </tr>
                    </table>

                    <p style="font-size:15px;color:#475569;margin:0 0 8px 0;">
                      View your complete results, personalized tool recommendations, and actionable insights:
                    </p>

                    ${ctaButton('View Full Results', `${resultsUrl}${resultsUrl.includes('?') ? '&' : '?'}utm_source=email&utm_medium=transactional&utm_campaign=quiz-results`)}

                    <p style="color:#666666;font-size:14px;line-height:1.6;margin:0;">
                      This assessment is based on research-backed psychological frameworks including Executive Function Theory,
                      Self-Determination Theory, and Flow State research. Your results provide personalized strategies to
                      optimize your productivity and align your work style with effective tools and methods.
                    </p>`;

  const html = wrapEmail(bodyContent, {
    preheader: `You're ${archetype.title}. Discover how you work best.`,
    footerNote: 'Science-backed productivity assessment',
  });

  return { subject, html };
}
