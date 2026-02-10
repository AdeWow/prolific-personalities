import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

async function run() {
  const response = await client.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 200,
    messages: [
      { role: "user", content: "Say 'Claude is connected' and nothing else." },
    ],
  });

  for (const block of response.content) {
    if (block.type === "text") console.log(block.text);
  }
}

run();
