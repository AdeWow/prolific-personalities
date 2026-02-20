/**
 * Send all 14 email template previews via the dev server.
 *
 * Usage:
 *   npx tsx scripts/send-all-email-previews.ts
 *   npx tsx scripts/send-all-email-previews.ts you@example.com
 *   npx tsx scripts/send-all-email-previews.ts you@example.com --archetype "Structured Achiever"
 *
 * Requires the dev server running on port 5000 (npm run dev).
 */

const BASE_URL = "http://localhost:5000";

const TEMPLATES = [
  "welcome",
  "results",
  "nurture-day3",
  "nurture-day5",
  "nurture-day7",
  "nurture-day10",
  "nurture-day14",
  "abandoned-cart",
  "playbook-delivery",
  "onboarding-day3",
  "onboarding-day7",
  "onboarding-day30",
  "weekly-accountability",
  "payment-failure",
];

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  // Parse CLI args
  const args = process.argv.slice(2);
  let to = "support@prolificpersonalities.com";
  let archetype = "Chaotic Creative";

  // First positional arg = email
  if (args[0] && !args[0].startsWith("--")) {
    to = args[0];
  }

  // --archetype flag
  const archIdx = args.indexOf("--archetype");
  if (archIdx !== -1 && args[archIdx + 1]) {
    archetype = args[archIdx + 1];
  }

  console.log(`\n📧 Sending all ${TEMPLATES.length} email templates`);
  console.log(`   To: ${to}`);
  console.log(`   Archetype: ${archetype}`);
  console.log(`   Server: ${BASE_URL}\n`);

  let sent = 0;
  let failed = 0;

  for (let i = 0; i < TEMPLATES.length; i++) {
    const template = TEMPLATES[i];
    const label = `[${i + 1}/${TEMPLATES.length}]`;

    try {
      const response = await fetch(`${BASE_URL}/api/test/email-preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template, to, archetype }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        console.error(`❌ ${label} ${template} → ${response.status}: ${(body as any).message || "unknown error"}`);
        failed++;
      } else {
        const body = await response.json() as any;
        console.log(`✅ ${label} ${template} → sent (${body.resendId || "no id"})`);
        sent++;
      }
    } catch (err: any) {
      console.error(`❌ ${label} ${template} → ${err.message || err}`);
      failed++;
    }

    // Wait 2 seconds between sends (except after the last one)
    if (i < TEMPLATES.length - 1) {
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
