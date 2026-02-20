import { Client } from "@notionhq/client";

// ─── Notion client (reuses same lazy pattern as notion.ts) ───

let _notion: Client | null = null;

function getNotionClient(): Client {
  if (!_notion) {
    const apiKey = process.env.NOTION_API_KEY;
    if (!apiKey) throw new Error("NOTION_API_KEY is not set");
    _notion = new Client({ auth: apiKey });
  }
  return _notion;
}

function getNewsletterDatabaseId(): string {
  const id = process.env.NOTION_NEWSLETTER_DATABASE_ID;
  if (!id) throw new Error("NOTION_NEWSLETTER_DATABASE_ID is not set");
  return id;
}

// ─── Types ───

export interface ScheduledNewsletter {
  id: string;
  title: string;
  subjectLine: string;
  audience: string;
  archetypeFilter: string;
  sendDate: string;
}

// ─── Query scheduled newsletters ───

export async function getScheduledNewsletters(): Promise<ScheduledNewsletter[]> {
  const notion = getNotionClient();
  const databaseId = getNewsletterDatabaseId();

  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      and: [
        { property: "Status", select: { equals: "Scheduled" } },
        {
          property: "Send Date",
          date: { on_or_before: new Date().toISOString() },
        },
      ],
    },
  });

  return response.results.map((page: any) => ({
    id: page.id,
    title: page.properties["Title"]?.title?.[0]?.plain_text || "",
    subjectLine:
      page.properties["Subject Line"]?.rich_text?.[0]?.plain_text || "",
    audience: page.properties["Audience"]?.select?.name || "All Subscribers",
    archetypeFilter:
      page.properties["Archetype Filter"]?.select?.name || "",
    sendDate: page.properties["Send Date"]?.date?.start || "",
  }));
}

// ─── Fetch newsletter page content and convert to email HTML ───

export async function getNewsletterContent(pageId: string): Promise<string> {
  const blocks = await getPageBlocks(pageId);
  const bodyHtml = blocksToEmailHtml(blocks);
  return wrapInEmailLayout(bodyHtml);
}

async function getPageBlocks(pageId: string): Promise<any[]> {
  const notion = getNotionClient();
  const blocks: any[] = [];
  let cursor: string | undefined;

  do {
    const response = await notion.blocks.children.list({
      block_id: pageId,
      start_cursor: cursor,
      page_size: 100,
    });
    blocks.push(...response.results);
    cursor = response.has_more
      ? (response.next_cursor as string)
      : undefined;
  } while (cursor);

  return blocks;
}

// ─── Get newsletter subject line from Notion page ───

export async function getNewsletterSubject(pageId: string): Promise<string> {
  const notion = getNotionClient();
  const page = (await notion.pages.retrieve({ page_id: pageId })) as any;
  return (
    page.properties["Subject Line"]?.rich_text?.[0]?.plain_text ||
    page.properties["Title"]?.title?.[0]?.plain_text ||
    "Newsletter"
  );
}

// ─── Update newsletter status in Notion ───

export async function updateNewsletterStatus(
  pageId: string,
  status: "Sent" | "Failed",
  sendCount?: number,
  notes?: string,
): Promise<void> {
  const notion = getNotionClient();

  const properties: Record<string, any> = {
    Status: { select: { name: status } },
  };

  if (sendCount !== undefined) {
    properties["Send Count"] = { number: sendCount };
  }

  if (notes) {
    properties["Send Notes"] = {
      rich_text: [{ text: { content: notes } }],
    };
  }

  await notion.pages.update({ page_id: pageId, properties });
}

// ─── Notion blocks → email-safe HTML ───

const NOTION_COLOR_MAP: Record<string, string> = {
  gray: "#9b9a97",
  brown: "#64473a",
  orange: "#d9730d",
  yellow: "#dfab01",
  green: "#0f7b6c",
  blue: "#0b6e99",
  purple: "#6940a5",
  pink: "#ad1a72",
  red: "#e03e3e",
  gray_background: "#ebeced",
  brown_background: "#e9e5e3",
  orange_background: "#faebdd",
  yellow_background: "#fbf3db",
  green_background: "#ddedea",
  blue_background: "#ddebf1",
  purple_background: "#eae4f2",
  pink_background: "#f4dfeb",
  red_background: "#fbe4e4",
};

function richTextToHtml(richTexts: any[]): string {
  if (!richTexts || richTexts.length === 0) return "";

  return richTexts
    .map((rt: any) => {
      let text = escapeHtml(rt.plain_text || "");
      if (!text) return "";

      const a = rt.annotations || {};

      if (a.bold) text = `<strong>${text}</strong>`;
      if (a.italic) text = `<em>${text}</em>`;
      if (a.strikethrough) text = `<s>${text}</s>`;
      if (a.underline) text = `<u>${text}</u>`;
      if (a.code)
        text = `<code style="background:#f4f4f4;padding:2px 6px;border-radius:3px;font-size:14px;">${text}</code>`;

      // Color annotations
      if (a.color && a.color !== "default") {
        const colorValue = NOTION_COLOR_MAP[a.color];
        if (colorValue) {
          if (a.color.endsWith("_background")) {
            text = `<span style="background-color:${colorValue};padding:2px 4px;border-radius:3px;">${text}</span>`;
          } else {
            text = `<span style="color:${colorValue};">${text}</span>`;
          }
        }
      }

      // Links
      if (rt.href) {
        text = `<a href="${escapeHtml(rt.href)}" style="color:#6B4C9A;text-decoration:underline;">${text}</a>`;
      }

      return text;
    })
    .join("");
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function blocksToEmailHtml(blocks: any[]): string {
  const parts: string[] = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];
    const type = block.type;

    // Handle consecutive list items
    if (type === "bulleted_list_item" || type === "numbered_list_item") {
      const tag = type === "bulleted_list_item" ? "ul" : "ol";
      const items: string[] = [];

      while (i < blocks.length && blocks[i].type === type) {
        const content = richTextToHtml(blocks[i][type]?.rich_text || []);
        items.push(
          `<li style="margin:0 0 8px 0;font-size:16px;line-height:1.6;color:#333333;">${content}</li>`,
        );
        i++;
      }

      parts.push(
        `<${tag} style="margin:0 0 16px 0;padding-left:24px;">${items.join("")}</${tag}>`,
      );
      continue;
    }

    switch (type) {
      case "paragraph": {
        const content = richTextToHtml(block.paragraph?.rich_text || []);
        // Skip empty paragraphs but preserve spacing
        if (content) {
          parts.push(
            `<p style="margin:0 0 16px 0;font-size:16px;line-height:1.6;color:#333333;">${content}</p>`,
          );
        } else {
          parts.push(`<p style="margin:0 0 16px 0;">&nbsp;</p>`);
        }
        break;
      }

      case "heading_1": {
        const content = richTextToHtml(block.heading_1?.rich_text || []);
        parts.push(
          `<h1 style="margin:0 0 16px 0;font-size:24px;font-weight:700;color:#1a1a1a;">${content}</h1>`,
        );
        break;
      }

      case "heading_2": {
        const content = richTextToHtml(block.heading_2?.rich_text || []);
        parts.push(
          `<h2 style="margin:0 0 12px 0;font-size:20px;font-weight:600;color:#1a1a1a;">${content}</h2>`,
        );
        break;
      }

      case "heading_3": {
        const content = richTextToHtml(block.heading_3?.rich_text || []);
        parts.push(
          `<h3 style="margin:0 0 10px 0;font-size:18px;font-weight:600;color:#1a1a1a;">${content}</h3>`,
        );
        break;
      }

      case "quote": {
        const content = richTextToHtml(block.quote?.rich_text || []);
        parts.push(
          `<blockquote style="margin:0 0 16px 0;padding:12px 20px;border-left:4px solid #6B4C9A;background:#f9f7fc;font-style:italic;color:#555;">${content}</blockquote>`,
        );
        break;
      }

      case "divider": {
        parts.push(
          `<hr style="margin:24px 0;border:none;border-top:1px solid #e0e0e0;">`,
        );
        break;
      }

      case "image": {
        const url =
          block.image?.file?.url ||
          block.image?.external?.url ||
          "";
        const caption = block.image?.caption?.[0]?.plain_text || "";
        if (url) {
          parts.push(
            `<img src="${escapeHtml(url)}" alt="${escapeHtml(caption)}" style="max-width:100%;height:auto;margin:0 0 16px 0;border-radius:8px;">`,
          );
        }
        break;
      }

      case "callout": {
        const icon = block.callout?.icon?.emoji || "";
        const content = richTextToHtml(block.callout?.rich_text || []);
        parts.push(
          `<div style="margin:0 0 16px 0;padding:16px 20px;background:#f0edfa;border-radius:8px;font-size:16px;color:#333;">${icon ? icon + " " : ""}${content}</div>`,
        );
        break;
      }

      case "code": {
        const content = block.code?.rich_text?.[0]?.plain_text || "";
        parts.push(
          `<pre style="margin:0 0 16px 0;padding:16px;background:#f4f4f4;border-radius:6px;overflow-x:auto;font-size:14px;line-height:1.5;"><code>${escapeHtml(content)}</code></pre>`,
        );
        break;
      }

      case "toggle": {
        const content = richTextToHtml(block.toggle?.rich_text || []);
        parts.push(
          `<div style="margin:0 0 16px 0;padding:12px 16px;background:#f8f9fa;border-radius:6px;border:1px solid #e2e8f0;"><strong>▸ ${content}</strong></div>`,
        );
        break;
      }

      default:
        // Skip unsupported block types (table_of_contents, bookmark, etc.)
        break;
    }

    i++;
  }

  return parts.join("\n");
}

// ─── Email layout wrapper ───

function wrapInEmailLayout(bodyHtml: string): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Prolific Personalities</title>
</head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#f8fafc;">
<tr>
<td align="center" style="padding:20px 10px;">
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width:600px;background-color:#ffffff;border-radius:8px;overflow:hidden;">

<!-- Header -->
<tr>
<td style="padding:30px 30px 20px;text-align:center;border-bottom:1px solid #e2e8f0;">
<h1 style="margin:0;font-size:24px;font-weight:700;color:#6B4C9A;">Prolific Personalities</h1>
</td>
</tr>

<!-- Body -->
<tr>
<td style="padding:30px;">
${bodyHtml}
</td>
</tr>

<!-- Footer -->
<tr>
<td style="padding:24px 30px;background:#f1f5f9;text-align:center;border-top:1px solid #e2e8f0;">
<p style="margin:0 0 8px 0;font-size:14px;font-weight:600;color:#64748b;">Prolific Personalities</p>
<p style="margin:0 0 12px 0;font-size:13px;color:#94a3b8;">prolificpersonalities.com</p>
<p style="margin:0;font-size:12px;color:#94a3b8;">
<a href="https://www.prolificpersonalities.com/unsubscribe" style="color:#94a3b8;text-decoration:underline;">Unsubscribe</a>
</p>
</td>
</tr>

</table>
</td>
</tr>
</table>
</body>
</html>`;
}
