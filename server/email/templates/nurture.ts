import { wrapEmail, ctaButton, aOrAn, getPublicBaseUrl } from "../wrapper";
import { getArchetypeContent, formatArchetypeName } from "../content/archetype";

export const BASE_URL = getPublicBaseUrl();

export function getEmailBaseStyles(): string {
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
      border-left: 4px solid #396969;
      padding: 20px;
      margin: 24px 0;
      border-radius: 0 8px 8px 0;
    }
    .cta-button {
      display: inline-block;
      background-color: #396969;
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
      color: #396969;
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

export function getEmailHeader(): string {
  return `
    <div class="header">
      <h2 style="text-align:center;color:#396969;font-family:Georgia,serif;margin:0;font-size:20px;font-weight:bold;letter-spacing:0.02em;">Prolific Personalities</h2>
    </div>
  `;
}

export function getEmailFooter(email: string): string {
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
  const checkoutUrl = `${BASE_URL}/results?archetype=${user.archetype}&utm_source=email&utm_medium=nurture&utm_campaign=nurture-sequence&utm_content=abandoned-cart#upsell`;

  const subject = "Still thinking it over? Here's what helped me decide";

  const bodyContent = `
                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">Hey,</p>

                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">I noticed you started checking out the ${archetypeName} Playbook but didn't complete your purchase. No worries at all — $19 is still a decision worth thinking about.</p>

                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">I want to be straight with you about what you're getting:</p>

                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0fdf4;border-left:4px solid #396969;margin-bottom:24px;border-radius:0 8px 8px 0;">
                      <tr>
                        <td style="padding:20px;">
                          <p style="margin:0 0 16px 0;font-size:16px;"><strong>This is for you if:</strong></p>
                          <ul style="margin:0;padding-left:20px;line-height:1.7;">
                            <li>You've taken the quiz and want a complete system designed for your specific archetype</li>
                            <li>You're ready to actually implement strategies, not just read about them</li>
                            <li>You want research-backed approaches, not generic productivity advice</li>
                          </ul>
                        </td>
                      </tr>
                    </table>

                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fef2f2;border-left:4px solid #ef4444;margin-bottom:24px;border-radius:0 8px 8px 0;">
                      <tr>
                        <td style="padding:20px;">
                          <p style="margin:0 0 16px 0;font-size:16px;"><strong>This probably isn't for you if:</strong></p>
                          <ul style="margin:0;padding-left:20px;line-height:1.7;">
                            <li>You're looking for a magic fix — this requires your participation</li>
                            <li>You already have a productivity system that's working well</li>
                            <li>You're more interested in reading about productivity than changing your habits</li>
                          </ul>
                        </td>
                      </tr>
                    </table>

                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">Either way, there's a <strong>30-day money-back guarantee</strong>. If the strategies don't help, you get a full refund. No questions, no hassle.</p>

                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">If you decide it's right for you, here's the link:</p>

                    ${ctaButton('Complete Your Purchase', checkoutUrl)}`;

  const html = wrapEmail(bodyContent, {
    preheader: `The ${archetypeName} Playbook — here's what helped me decide.`,
  });

  return { subject, html };
}

export function generateDay3NurtureEmail(user: NurtureEmailUser): { subject: string; html: string } {
  const content = getArchetypeContent(user.archetype);
  const archetypeName = content?.name || formatArchetypeName(user.archetype);

  const subject = `The hidden advantage of being ${aOrAn(archetypeName)} ${archetypeName}`;

  const bodyContent = `
                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">Hey,</p>

                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">Three days ago you discovered you're ${aOrAn(archetypeName)} <strong>${archetypeName}</strong>. Let me tell you why that's actually a significant advantage.</p>

                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">${content?.day3Advantage || "Your unique productivity profile gives you strengths that others don't have. The key is learning to work with your natural tendencies rather than against them."}</p>

                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0fdf4;border-left:4px solid #396969;margin-bottom:24px;border-radius:0 8px 8px 0;">
                      <tr>
                        <td style="padding:20px;">
                          <p style="margin:0 0 8px 0;font-size:16px;"><strong>Quick Win for Today:</strong></p>
                          <p style="margin:0;font-size:16px;line-height:1.7;">${content?.day3QuickTip || "Start by identifying one task you've been avoiding and approach it in a new way that matches your natural working style."}</p>
                        </td>
                      </tr>
                    </table>

                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">This is just scratching the surface. The full ${archetypeName} Playbook goes deep on how to turn these insights into daily systems that actually stick.</p>

                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">More coming in a couple days.</p>`;

  const html = wrapEmail(bodyContent, {
    preheader: `The hidden advantage of being ${aOrAn(archetypeName)} ${archetypeName}.`,
  });

  return { subject, html };
}

export function generateDay5NurtureEmail(user: NurtureEmailUser): { subject: string; html: string } {
  const content = getArchetypeContent(user.archetype);
  const archetypeName = content?.name || formatArchetypeName(user.archetype);
  const playbookUrl = `${BASE_URL}/results?archetype=${user.archetype}&utm_source=email&utm_medium=nurture&utm_campaign=nurture-sequence&utm_content=day5#upsell`;

  const subject = `The #1 mistake ${archetypeName}s make (and it's not what you think)`;

  const bodyContent = `
                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">Hey,</p>

                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">I've analyzed thousands of ${archetypeName} profiles. There's one mistake that shows up over and over — and it's probably not what you'd expect.</p>

                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">${content?.day5Mistake || "The most common mistake isn't about willpower or discipline. It's about using strategies designed for a different type of brain."}</p>

                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0fdf4;border-left:4px solid #396969;margin-bottom:24px;border-radius:0 8px 8px 0;">
                      <tr>
                        <td style="padding:20px;">
                          <p style="margin:0 0 8px 0;font-size:16px;"><strong>The Fix:</strong></p>
                          <p style="margin:0;font-size:16px;line-height:1.7;">${content?.day5Fix || "Try one small experiment today: approach your biggest task in a completely different way than you normally would."}</p>
                        </td>
                      </tr>
                    </table>

                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">The ${archetypeName} Playbook has the complete system for avoiding this trap — including specific tools and workflows designed for your cognitive style.</p>

                    ${ctaButton('See the Full System', playbookUrl)}`;

  const html = wrapEmail(bodyContent, {
    preheader: `The #1 mistake ${archetypeName}s make — and the fix.`,
  });

  return { subject, html };
}

export function generateDay7NurtureEmail(user: NurtureEmailUser): { subject: string; html: string } {
  const content = getArchetypeContent(user.archetype);
  const archetypeName = content?.name || formatArchetypeName(user.archetype);
  const playbookUrl = `${BASE_URL}/results?archetype=${user.archetype}&utm_source=email&utm_medium=nurture&utm_campaign=nurture-sequence&utm_content=day7#upsell`;

  const subject = "Stop using the wrong tools for your brain";

  const bodyContent = `
                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">Hey,</p>

                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">Here's something most productivity advice gets wrong: tool effectiveness depends entirely on your cognitive profile.</p>

                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">Research on person-environment fit (Kristof-Brown et al., 2005) shows that the same tool can be transformative for one person and useless for another. It's not about finding the "best" tool — it's about finding the right tool <em>for you</em>.</p>

                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">As ${aOrAn(archetypeName)} ${archetypeName}, here's what the research suggests:</p>

                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0fdf4;border-left:4px solid #396969;margin-bottom:24px;border-radius:0 8px 8px 0;">
                      <tr>
                        <td style="padding:20px;">
                          <p style="margin:0;font-size:16px;line-height:1.7;">${content?.day7Tool || "Choose tools that match your natural working style. The best productivity system is one you'll actually use consistently."}</p>
                        </td>
                      </tr>
                    </table>

                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">The playbook includes a complete tool-matching guide with specific recommendations for each aspect of the ${archetypeName} profile.</p>

                    ${ctaButton('Get the Tool Matching Guide', playbookUrl)}`;

  const html = wrapEmail(bodyContent, {
    preheader: 'Tool effectiveness depends entirely on your cognitive profile.',
  });

  return { subject, html };
}

export function generateDay10NurtureEmail(user: NurtureEmailUser): { subject: string; html: string } {
  const content = getArchetypeContent(user.archetype);
  const archetypeName = content?.name || formatArchetypeName(user.archetype);
  const playbookUrl = `${BASE_URL}/results?archetype=${user.archetype}&utm_source=email&utm_medium=nurture&utm_campaign=nurture-sequence&utm_content=day10#upsell`;

  const subject = `How ${aOrAn(archetypeName)} ${archetypeName} went from stuck to unstoppable`;

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

  const bodyContent = `
                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">Hey,</p>

                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">I wanted to share a story that might sound familiar.</p>

                    <p style="margin:0 0 8px 0;font-size:16px;color:#1a1a1a;"><strong>Before:</strong></p>
                    <p style="margin:0 0 20px 0;font-style:italic;color:#666666;font-size:16px;line-height:1.7;">"${story.before}"</p>

                    <p style="margin:0 0 8px 0;font-size:16px;color:#1a1a1a;"><strong>After working through the ${archetypeName} strategies:</strong></p>
                    <p style="margin:0 0 20px 0;font-style:italic;color:#666666;font-size:16px;line-height:1.7;">"${story.after}"</p>

                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0fdf4;border-left:4px solid #396969;margin-bottom:24px;border-radius:0 8px 8px 0;">
                      <tr>
                        <td style="padding:20px;">
                          <p style="margin:0;font-style:italic;font-size:16px;line-height:1.7;">"${story.quote}"</p>
                        </td>
                      </tr>
                    </table>

                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">If this resonates, the ${archetypeName} Playbook has the complete system that made this transformation possible.</p>

                    ${ctaButton(`Get the ${archetypeName} Playbook`, playbookUrl)}`;

  const html = wrapEmail(bodyContent, {
    preheader: `How ${aOrAn(archetypeName)} ${archetypeName} went from stuck to unstoppable.`,
  });

  return { subject, html };
}

export function generateDay14NurtureEmail(user: NurtureEmailUser): { subject: string; html: string } {
  const content = getArchetypeContent(user.archetype);
  const archetypeName = content?.name || formatArchetypeName(user.archetype);
  const playbookUrl = `${BASE_URL}/results?archetype=${user.archetype}&utm_source=email&utm_medium=nurture&utm_campaign=nurture-sequence&utm_content=day14#upsell`;

  const subject = "I procrastinated on building an anti-procrastination platform (true story)";

  const bodyContent = `
                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">Hey,</p>

                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">True confession: I procrastinated on launching a platform designed to help people stop procrastinating. For <em>months</em>.</p>

                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">I have ADHD. I know what it's like when your brain won't cooperate with your intentions. I've read every productivity book, tried every system, and blamed myself for every failure.</p>

                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">Then I discovered Dr. Tim Pychyl's research at Carleton University. The breakthrough? <strong>Procrastination isn't a time management problem. It's an emotion regulation problem.</strong></p>

                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">We don't avoid tasks because we're lazy. We avoid them because they trigger uncomfortable emotions — anxiety, boredom, frustration — and our brains choose short-term relief over long-term goals.</p>

                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">The fix isn't better planning. It's understanding your specific emotional patterns and building systems that work <em>with</em> your brain instead of against it.</p>

                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">That's what Prolific Personalities is. That's what the ${archetypeName} Playbook contains. Research-backed strategies designed for the brain you actually have — not the brain productivity gurus assume you should have.</p>

                    ${ctaButton(`Get the ${archetypeName} Playbook — $19`, playbookUrl)}

                    <p style="text-align:center;color:#666666;font-size:14px;margin:0 0 24px 0;">No countdown timer. No "limited spots." Just research-backed strategies designed for your archetype.</p>

                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;border-left:4px solid #94a3b8;margin-bottom:24px;border-radius:0 8px 8px 0;">
                      <tr>
                        <td style="padding:16px 20px;">
                          <p style="margin:0;font-size:14px;color:#666666;line-height:1.7;"><strong>Note:</strong> This is the last email in this series. I won't keep filling your inbox. If you want the playbook, great. If not, no hard feelings.</p>
                        </td>
                      </tr>
                    </table>`;

  const html = wrapEmail(bodyContent, {
    preheader: 'I procrastinated on building an anti-procrastination platform. True story.',
  });

  return { subject, html };
}
