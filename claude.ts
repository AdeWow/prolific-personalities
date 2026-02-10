import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

async function run() {
  const response = await client.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 800,
    messages: [
      {
        role: "user",
        content: "Refactor this code for clarity and performance."
      }
    ],
  });

  console.log(response.content[0].text);
}

run();
