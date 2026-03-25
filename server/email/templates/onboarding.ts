import { wrapEmail, ctaButton, aOrAn, getPublicBaseUrl } from "../wrapper";
import { getArchetypeContent, formatArchetypeName } from "../content/archetype";
import type { NurtureEmailUser } from "./nurture";

export function generateDay3OnboardEmail(user: NurtureEmailUser): { subject: string; html: string } {
  const content = getArchetypeContent(user.archetype);
  const archetypeName = content?.name || formatArchetypeName(user.archetype);
  const playbookUrl = `${getPublicBaseUrl()}/playbook/${user.archetype}?utm_source=email&utm_medium=onboarding&utm_campaign=onboarding&utm_content=day3`;

  const subject = `Quick question about your ${archetypeName} playbook`;

  const bodyContent = `
                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">Hey,</p>

                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">Quick question: have you tried one strategy from the playbook yet?</p>

                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">Research on implementation intentions (Gollwitzer, 1999) shows that specificity beats motivation every time. "I'll be more productive" doesn't work. "I'll try the 2-minute brain dump right after I finish my morning coffee" does.</p>

                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">You don't need to do everything at once. Start with the strategy that feels least intimidating. The one where you think "yeah, I could probably do that today."</p>

                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0fdf4;border-left:4px solid #396969;margin-bottom:24px;border-radius:0 8px 8px 0;">
                      <tr>
                        <td style="padding:20px;">
                          <p style="margin:0;font-size:16px;line-height:1.7;"><strong>Pro tip:</strong> The first strategy in Chapter 1 is designed to be the easiest starting point. Even if you just read that section and try one thing, you're ahead of 90% of people who buy self-improvement resources.</p>
                        </td>
                      </tr>
                    </table>

                    ${ctaButton('Open Your Playbook', playbookUrl)}

                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">Hit reply and let me know what you tried — I read every email.</p>`;

  const html = wrapEmail(bodyContent, {
    preheader: `Have you tried one strategy from the ${archetypeName} playbook yet?`,
  });

  return { subject, html };
}

export function generateDay7OnboardEmail(user: NurtureEmailUser): { subject: string; html: string } {
  const content = getArchetypeContent(user.archetype);
  const archetypeName = content?.name || formatArchetypeName(user.archetype);
  const playbookUrl = `${getPublicBaseUrl()}/playbook/${user.archetype}?utm_source=email&utm_medium=onboarding&utm_campaign=onboarding&utm_content=day7`;

  const subject = "One week in — here's what matters";

  const bodyContent = `
                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">Hey,</p>

                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">It's been a week since you got the ${archetypeName} Playbook. Here's what I want you to know:</p>

                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;"><strong>If you've implemented one strategy — even imperfectly:</strong><br>
                    You're ahead of 90% of people who buy self-improvement resources. Seriously. Research from Lally et al. (2010) shows habit formation takes an average of 66 days. You're in the messy middle. Keep going.</p>

                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;"><strong>If you tried something and it didn't work:</strong><br>
                    That's data, not failure. Every archetype has multiple strategies for a reason — different situations call for different approaches. Try another one.</p>

                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;"><strong>If you haven't started yet:</strong><br>
                    No judgment. Today's a new day. Pick the smallest possible action from the playbook — something that takes less than 5 minutes — and do it before you close this email.</p>

                    ${ctaButton('Continue Your Playbook', playbookUrl)}

                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">Remember: progress isn't linear. What matters is that you keep showing up.</p>`;

  const html = wrapEmail(bodyContent, {
    preheader: "One week in with your playbook — here's what matters most.",
  });

  return { subject, html };
}

export function generateDay30OnboardEmail(user: NurtureEmailUser): { subject: string; html: string } {
  const content = getArchetypeContent(user.archetype);
  const archetypeName = content?.name || formatArchetypeName(user.archetype);
  const playbookUrl = `${getPublicBaseUrl()}/playbook/${user.archetype}?utm_source=email&utm_medium=onboarding&utm_campaign=onboarding&utm_content=day30`;

  const subject = "30 days with your archetype — what changed?";

  const bodyContent = `
                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">Hey,</p>

                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">It has been 30 days since you got your ${archetypeName} playbook.</p>

                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">I wanted to check in — not to sell you anything, but to ask a genuine question: what has shifted?</p>

                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">Maybe the system clicked immediately. Maybe it took a few weeks. Maybe you are still figuring out which parts fit.</p>

                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">All of that is normal. Archetypes are not prescriptions — they are starting points. The fact that you are still here means something is resonating.</p>

                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">If you have not opened your playbook in a while, this is a good moment to revisit the 30-Day Plan section. It was built for exactly this point.</p>

                    ${ctaButton('Open My Playbook', playbookUrl)}

                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">And if something specific is not working, reply to this email. I read every one.</p>`;

  const html = wrapEmail(bodyContent, {
    preheader: 'A check-in from Prolific Personalities.',
  });

  return { subject, html };
}
