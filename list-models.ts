import Anthropic from "@anthropic-ai/sdk";

async function main() {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("Missing ANTHROPIC_API_KEY in Replit Secrets.");
  }

  const models = await client.models.list();

  for (const m of models.data) {
    console.log(`${m.id}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
