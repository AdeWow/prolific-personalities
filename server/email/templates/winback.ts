import { wrapEmail, ctaButton, aOrAn } from "../wrapper";
import { getArchetypeContent, formatArchetypeName } from "../content/archetype";

export interface WinBackEmailUser {
  email: string;
  firstName?: string;
  archetype: string;
}

function greetingLine(firstName?: string): string {
  return firstName ? `Hey, ${firstName},` : "Hey,";
}

function archetypeSlug(archetype: string): string {
  return archetype;
}

// ── Day 14 Win-Back ──────────────────────────────────────────────────

export function generateWinBackDay14Email(user: WinBackEmailUser): { subject: string; html: string } {
  const archetypeName = getArchetypeContent(user.archetype)?.name || formatArchetypeName(user.archetype);
  const article = aOrAn(archetypeName);
  const pricingUrl = `https://prolificpersonalities.com/pricing?utm_source=email&utm_medium=winback&utm_campaign=win-back-sequence&utm_content=day14`;

  const subject = "You found your pattern. Here is what to do with it.";

  const bodyContent = `
                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">${greetingLine(user.firstName)}</p>

                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">A couple of weeks ago, you discovered you are ${article} ${archetypeName}.</p>

                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">That moment of recognition — "oh, that is why I work this way" — is actually the hardest part. Most people never get there.</p>

                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">But knowing your pattern is only the first step. The second step is building a system that works with it instead of against it.</p>

                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">That is what the ${archetypeName} playbook is built for.</p>

                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">It is not a generic productivity guide. It is a framework built specifically for how you think, what blocks you, and what actually moves you forward.</p>

                    ${ctaButton(`Get My ${archetypeName} Playbook — $19`, pricingUrl)}

                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">And if the timing is not right — no pressure. Your result is saved. Come back when you are ready.</p>`;

  const html = wrapEmail(bodyContent, {
    preheader: "A note from Prolific Personalities.",
  });

  return { subject, html };
}

// ── Day 30 Win-Back ──────────────────────────────────────────────────

export function generateWinBackDay30Email(user: WinBackEmailUser): { subject: string; html: string } {
  const archetypeName = getArchetypeContent(user.archetype)?.name || formatArchetypeName(user.archetype);
  const article = aOrAn(archetypeName);
  const pricingUrl = `https://prolificpersonalities.com/pricing?utm_source=email&utm_medium=winback&utm_campaign=win-back-sequence&utm_content=day30`;

  const subject = "Still thinking about this.";

  const bodyContent = `
                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">${greetingLine(user.firstName)}</p>

                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">I have been thinking about something.</p>

                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">I built Prolific Personalities because I kept watching smart, capable people fail at productivity systems that were never designed for them.</p>

                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">Not because they were lazy. Not because they lacked discipline. But because the system assumed everyone thinks the same way.</p>

                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">You took the quiz. You found out you are ${article} ${archetypeName}. And then — like a lot of people — you moved on.</p>

                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">I get it. Life gets in the way.</p>

                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">But here is what I know: the reason previous systems did not stick for you is the same reason your result was not a surprise. You already knew something was different about how you work. You just did not have a name for it.</p>

                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">The playbook gives you the system that goes with that name.</p>

                    ${ctaButton(`Get My ${archetypeName} Playbook — $19`, pricingUrl)}

                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">If you have questions about whether it is right for you, reply to this email. I read every one.</p>`;

  const html = wrapEmail(bodyContent, {
    preheader: "A note from Adeola.",
  });

  return { subject, html };
}

// ── Day 60 Win-Back ──────────────────────────────────────────────────

const ARCHETYPE_PARAGRAPHS: Record<string, string> = {
  "adaptive-generalist":
    "Your ability to shift between contexts is a genuine advantage — most systems punish you for it. The right framework leans into that flexibility instead of trying to contain it.",
  "anxious-perfectionist":
    "Your standards are not the problem. The problem is a system that does not account for the energy it takes to maintain them. There is a version of productivity that works with your brain, not against it.",
  "chaotic-creative":
    "Your best work does not happen on a schedule — and that is not a character flaw. The question is not how to become more structured. It is how to capture the output when the energy is there.",
  "flexible-improviser":
    "You do not need a rigid system. You need a lightweight one that gives you enough structure to move without enough rigidity to resist. That is a real thing, and it is buildable.",
  "novelty-seeker":
    "The problem is not that you start too many things. The problem is that most systems were built for finishers. Yours needs to be built for starters — with a clear path to the finish line built in.",
  "strategic-planner":
    "The planning is not procrastination — until it is. The framework you need is one that gives your planning brain a defined lane so execution can happen in parallel.",
  "structured-achiever":
    "You are not broken when things fall apart — you are operating without the external scaffolding your brain needs. The right system gives you that scaffolding without requiring you to build it from scratch every time.",
};

export function generateWinBackDay60Email(user: WinBackEmailUser): { subject: string; html: string } {
  const archetypeName = getArchetypeContent(user.archetype)?.name || formatArchetypeName(user.archetype);
  const article = aOrAn(archetypeName);
  const slug = archetypeSlug(user.archetype);
  const blogUrl = `https://prolificpersonalities.com/blog/${slug}-ai-tools?utm_source=email&utm_medium=winback&utm_campaign=win-back-sequence&utm_content=day60`;

  const subject = `One last thing about your ${archetypeName} result.`;

  const archetypeParagraph = ARCHETYPE_PARAGRAPHS[user.archetype] || ARCHETYPE_PARAGRAPHS["chaotic-creative"];

  const bodyContent = `
                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">${greetingLine(user.firstName)}</p>

                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">Two months ago you found out you are ${article} ${archetypeName}.</p>

                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">I want to leave you with one thing — not a pitch, just something worth knowing.</p>

                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">${archetypeParagraph}</p>

                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">If you ever want to go deeper, the playbook is still there.</p>

                    ${ctaButton(`See My ${archetypeName} Playbook`, blogUrl)}

                    <p style="margin:0 0 20px 0;font-size:16px;color:#1a1a1a;line-height:1.7;">Either way — you are not lazy. You are not broken. You just needed a different approach.</p>`;

  const html = wrapEmail(bodyContent, {
    preheader: "Personalized for your archetype.",
  });

  return { subject, html };
}
