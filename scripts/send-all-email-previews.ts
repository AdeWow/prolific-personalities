/**
 * Send all 14 email template previews directly via Resend.
 *
 * Usage:
 *   RESEND_API_KEY=re_xxx npx tsx scripts/send-all-email-previews.ts
 *   RESEND_API_KEY=re_xxx npx tsx scripts/send-all-email-previews.ts you@example.com
 *   RESEND_API_KEY=re_xxx npx tsx scripts/send-all-email-previews.ts you@example.com --archetype "Structured Achiever"
 *
 * No dev server needed — calls template functions directly and sends via Resend.
 */

import { Resend } from "resend";
import {
  generateWelcomeEmail,
  generateResultsEmail,
  generatePremiumPlaybookEmail,
  generateAbandonedCartEmail,
  generateWeeklyAccountabilityEmail,
  generateDay3NurtureEmail,
  generateDay5NurtureEmail,
  generateDay7NurtureEmail,
  generateDay10NurtureEmail,
  generateDay14NurtureEmail,
  generateDay3OnboardEmail,
  generateDay7OnboardEmail,
  generateDay30OnboardEmail,
} from "../server/emailTemplates";
import { getArchetypeInfo } from "../server/archetypeData";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
if (!RESEND_API_KEY) {
  console.error("❌ RESEND_API_KEY env var is required");
  process.exit(1);
}

const resend = new Resend(RESEND_API_KEY);

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  // Parse CLI args
  const args = process.argv.slice(2);
  let to = "support@prolificpersonalities.com";
  let archetypeName = "Chaotic Creative";

  if (args[0] && !args[0].startsWith("--")) {
    to = args[0];
  }

  const archIdx = args.indexOf("--archetype");
  if (archIdx !== -1 && args[archIdx + 1]) {
    archetypeName = args[archIdx + 1];
  }

  const archetypeSlug = archetypeName
    .toLowerCase()
    .replace(/^the\s+/, "")
    .replace(/\s+/g, "-");

  const archetypeInfo = getArchetypeInfo(archetypeSlug);
  if (!archetypeInfo) {
    console.error(`❌ Unknown archetype: "${archetypeName}" (slug: ${archetypeSlug})`);
    process.exit(1);
  }

  const baseUrl = "https://www.prolificpersonalities.com";
  const resultsUrl = `${baseUrl}/results?session=test-preview-123`;
  const unsubscribeUrl = `${baseUrl}/unsubscribe?email=${encodeURIComponent(to)}`;
  const checkoutUrl = `${baseUrl}/quiz`;
  const sampleScores = { structure: 28, motivation: 22, cognitive: 25, task: 30 };
  const nurtureUser = { email: to, archetype: archetypeSlug };

  const STANDARD_FROM = "Prolific Personalities <support@prolificpersonalities.com>";
  const JOHN_FROM = "John from Prolific Personalities <support@prolificpersonalities.com>";

  // Build all 14 templates
  const templates: Array<{
    name: string;
    from: string;
    subject: string;
    html: string;
  }> = [];

  // 1. welcome
  const welcome = generateWelcomeEmail({
    recipientEmail: to,
    archetype: { id: archetypeInfo.id, title: archetypeInfo.title },
    resultsUrl,
    unsubscribeUrl,
  });
  templates.push({ name: "welcome", from: STANDARD_FROM, ...welcome });

  // 2. results
  const results = generateResultsEmail({
    recipientEmail: to,
    archetype: archetypeInfo,
    scores: sampleScores,
    resultsUrl,
  });
  templates.push({ name: "results", from: STANDARD_FROM, ...results });

  // 3-7. nurture sequence
  const nurtureGenerators = [
    { name: "nurture-day3", fn: generateDay3NurtureEmail },
    { name: "nurture-day5", fn: generateDay5NurtureEmail },
    { name: "nurture-day7", fn: generateDay7NurtureEmail },
    { name: "nurture-day10", fn: generateDay10NurtureEmail },
    { name: "nurture-day14", fn: generateDay14NurtureEmail },
  ];
  for (const { name, fn } of nurtureGenerators) {
    const r = fn(nurtureUser);
    templates.push({ name, from: JOHN_FROM, ...r });
  }

  // 8. abandoned-cart
  const cart = generateAbandonedCartEmail({
    recipientEmail: to,
    archetype: { id: archetypeInfo.id, title: archetypeInfo.title },
    checkoutUrl,
    unsubscribeUrl,
  });
  templates.push({ name: "abandoned-cart", from: STANDARD_FROM, ...cart });

  // 9. playbook-delivery (no attachment in this script)
  const playbook = generatePremiumPlaybookEmail({
    recipientEmail: to,
    archetype: {
      id: archetypeInfo.id,
      title: archetypeInfo.title,
      tagline: archetypeInfo.tagline,
    },
    resultsUrl,
  });
  templates.push({ name: "playbook-delivery", from: STANDARD_FROM, ...playbook });

  // 10-12. onboarding sequence
  const onboardGenerators = [
    { name: "onboarding-day3", fn: generateDay3OnboardEmail },
    { name: "onboarding-day7", fn: generateDay7OnboardEmail },
    { name: "onboarding-day30", fn: generateDay30OnboardEmail },
  ];
  for (const { name, fn } of onboardGenerators) {
    const r = fn(nurtureUser);
    templates.push({ name, from: JOHN_FROM, ...r });
  }

  // 13. weekly-accountability
  const weekly = generateWeeklyAccountabilityEmail({
    firstName: null,
    archetype: archetypeInfo.title,
    weekNumber: 1,
  });
  templates.push({ name: "weekly-accountability", from: STANDARD_FROM, ...weekly });

  // 14. payment-failure
  templates.push({
    name: "payment-failure",
    from: STANDARD_FROM,
    subject: "Action Required: Payment Failed for Your Productivity Partner Subscription",
    html: `
      <h2>Payment Failed</h2>
      <p>We were unable to process your subscription payment. Please update your payment method to continue your Productivity Partner benefits.</p>
      <p><a href="${baseUrl}/dashboard">Update Payment Method</a></p>
      <p>If you have questions, reply to this email.</p>
    `,
  });

  // Send them all
  console.log(`\n📧 Sending all ${templates.length} email templates`);
  console.log(`   To: ${to}`);
  console.log(`   Archetype: ${archetypeInfo.title} (${archetypeSlug})\n`);

  let sent = 0;
  let failed = 0;

  for (let i = 0; i < templates.length; i++) {
    const t = templates[i];
    const label = `[${String(i + 1).padStart(2)}/14]`;

    try {
      const { data, error } = await resend.emails.send({
        from: t.from,
        to,
        subject: `[TEST] ${t.subject}`,
        html: t.html,
      });

      if (error) {
        console.error(`❌ ${label} ${t.name} → ${(error as any).message || error}`);
        failed++;
      } else {
        console.log(`✅ ${label} ${t.name} → sent (${data?.id || "no id"})`);
        sent++;
      }
    } catch (err: any) {
      console.error(`❌ ${label} ${t.name} → ${err.message || err}`);
      failed++;
    }

    // 2-second delay between sends
    if (i < templates.length - 1) {
      await sleep(2000);
    }
  }

  console.log(`\n✨ Done: ${sent} sent, ${failed} failed\n`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
