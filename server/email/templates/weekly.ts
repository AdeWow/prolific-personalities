import { wrapEmail, ctaButton } from '../wrapper';
import { formatArchetypeName } from '../content/archetype';
import { WEEKLY_CONTENT } from '../content/weeklyContent';

export interface WeeklyRotationUser {
  email: string;
  firstName?: string | null;
  archetype?: string | null;  // archetype ID or undefined/null
  weekNumber: number;          // 1-12
}

/**
 * Replace the second <p>...</p> in an HTML string with a new paragraph.
 * The second <p> is the one we personalize for archetype-specific openings.
 */
function replaceSecondParagraph(html: string, replacement: string): string {
  let count = 0;
  return html.replace(/<p>[\s\S]*?<\/p>/g, (match) => {
    count++;
    if (count === 2) {
      return `<p>${replacement}</p>`;
    }
    return match;
  });
}

export function generateWeeklyRotationEmail(user: WeeklyRotationUser): { subject: string; html: string } {
  // 1. Get content entry, fallback to week 1 if out of range
  const index = user.weekNumber >= 1 && user.weekNumber <= 12 ? user.weekNumber - 1 : 0;
  const content = WEEKLY_CONTENT[index];

  const utmBase = `utm_source=email&utm_medium=weekly&utm_campaign=weekly-rotation&utm_content=week${content.week}`;

  // 2. Determine body: personalized or universal
  const archetypeId = user.archetype || undefined;
  const hasPersonalization =
    archetypeId &&
    content.personalizedContext &&
    content.personalizedContext[archetypeId];

  let bodyHtml: string;
  if (hasPersonalization) {
    bodyHtml = replaceSecondParagraph(
      content.universalBody,
      content.personalizedContext![archetypeId!]
    );
  } else {
    bodyHtml = content.universalBody;
  }

  // 3. Add blog link
  const blogUrlWithUtm = `${content.blogUrl}?${utmBase}`;
  bodyHtml += `\n<p><a href="${blogUrlWithUtm}" style="color:#396969;text-decoration:underline;">${content.blogTitle} \u2192</a></p>`;

  // 4. Add CTA for specific weeks
  if (content.week === 1) {
    const ctaUrl = `https://prolificpersonalities.com?${utmBase}`;
    bodyHtml += ctaButton('Find Your Productivity Archetype', ctaUrl);
  } else if (content.week === 5) {
    if (archetypeId) {
      const toolsUrl = `https://prolificpersonalities.com/blog/${archetypeId}-ai-tools?${utmBase}`;
      bodyHtml += ctaButton('See Tools Built for Your Archetype', toolsUrl);
    } else {
      const resultsUrl = `https://prolificpersonalities.com/results?${utmBase}`;
      bodyHtml += ctaButton('See Tools Built for Your Archetype', resultsUrl);
    }
  }

  // 5. Wrap with email chrome
  const html = wrapEmail(bodyHtml, { preheader: content.preheader });

  return { subject: content.subject, html };
}
