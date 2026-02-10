import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

async function run() {
  const response = await client.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 800,
    messages: [
      { role: "user", content: "Refactor this code for clarity and performance." },
    ],
  });

  // response.content can contain multiple blocks; print any text blocks
  for (const block of response.content) {
    if (block.type === "text") console.log(block.text);
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
