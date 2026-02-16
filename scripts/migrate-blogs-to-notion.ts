/**
 * Migration script: Static blog posts → Notion CMS
 *
 * Usage:
 *   NOTION_API_KEY=xxx NOTION_BLOG_DATABASE_ID=yyy npx tsx scripts/migrate-blogs-to-notion.ts --dry-run
 *   NOTION_API_KEY=xxx NOTION_BLOG_DATABASE_ID=yyy npx tsx scripts/migrate-blogs-to-notion.ts
 */

import { Client } from "@notionhq/client";

// ─── Configuration ───────────────────────────────────────────────────

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const DATABASE_ID = process.env.NOTION_BLOG_DATABASE_ID;
const DRY_RUN = process.argv.includes("--dry-run");
const DELAY_MS = 500; // rate-limit delay between posts

// --only slug1,slug2,... to retry specific posts
const ONLY_SLUGS: string[] = (() => {
  const idx = process.argv.findIndex((a) => a === "--only");
  if (idx === -1 || !process.argv[idx + 1]) return [];
  return process.argv[idx + 1].split(",").map((s) => s.trim());
})();

if (!NOTION_API_KEY) {
  console.error("❌ NOTION_API_KEY is required");
  process.exit(1);
}
if (!DATABASE_ID) {
  console.error("❌ NOTION_BLOG_DATABASE_ID is required");
  process.exit(1);
}

const notion = new Client({ auth: NOTION_API_KEY });

// ─── Category mapping ────────────────────────────────────────────────
// Map static tags to Notion Category select values

const ARCHETYPE_NAMES = [
  "Chaotic Creative",
  "Anxious Perfectionist",
  "Structured Achiever",
  "Novelty Seeker",
  "Strategic Planner",
  "Flexible Improviser",
  "Adaptive Generalist",
];

function mapCategory(tags: string[]): string {
  const tagSet = tags.map((t) => t.toLowerCase());

  // Founder Story takes priority
  if (tagSet.includes("founder story") || tagSet.includes("behind the scenes"))
    return "Founder Story";

  // Archetype deep-dives (posts focused on a single archetype)
  const archetypeTags = tags.filter((t) => ARCHETYPE_NAMES.includes(t));
  if (archetypeTags.length === 1) return "Archetype Deep-Dive";

  // Research-heavy posts
  if (
    tagSet.includes("research") ||
    tagSet.includes("productivity science") ||
    tagSet.includes("psychology")
  )
    return "Research & Science";

  // Assessment / quiz-focused
  if (
    tagSet.includes("self-assessment") ||
    tagSet.includes("archetypes") ||
    tagSet.includes("personality")
  )
    return "Assessment Hub";

  // Problem-aware (focus, ADHD, procrastination, routines, etc.)
  if (
    tagSet.includes("adhd") ||
    tagSet.includes("focus") ||
    tagSet.includes("procrastination") ||
    tagSet.includes("routines") ||
    tagSet.includes("habits") ||
    tagSet.includes("executive function") ||
    tagSet.includes("project completion") ||
    tagSet.includes("finishing") ||
    tagSet.includes("concentration") ||
    tagSet.includes("distraction") ||
    tagSet.includes("mental health")
  )
    return "Problem-Aware";

  // Default to Problem-Aware for general productivity content
  return "Problem-Aware";
}

function mapArchetypeTags(tags: string[]): string[] {
  const matched = tags.filter((t) => ARCHETYPE_NAMES.includes(t));
  // Check for "All Archetypes" indicator
  if (tags.some((t) => t.toLowerCase() === "all archetypes")) {
    matched.push("All Archetypes");
  }
  return matched;
}

function parseReadTime(readTime: string): number {
  const match = readTime.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 5;
}

// ─── Markdown → Notion blocks converter ──────────────────────────────

interface NotionBlock {
  type: string;
  [key: string]: any;
}

interface RichTextSegment {
  type: "text";
  text: { content: string; link?: { url: string } | null };
  annotations?: {
    bold?: boolean;
    italic?: boolean;
    strikethrough?: boolean;
    code?: boolean;
  };
}

const SITE_BASE_URL = "https://prolificpersonalities.com";

/** Convert relative URLs (/quiz, /archetypes#x) to absolute */
function resolveUrl(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) return `${SITE_BASE_URL}${url}`;
  if (url.startsWith("#")) return `${SITE_BASE_URL}/${url}`;
  return `${SITE_BASE_URL}/${url}`;
}

function parseInlineMarkdown(text: string): RichTextSegment[] {
  const segments: RichTextSegment[] = [];
  // Regex to match: **bold**, *italic*, ~~strikethrough~~, `code`, [link](url)
  const inlineRegex =
    /(\*\*(.+?)\*\*|\*(.+?)\*|~~(.+?)~~|`(.+?)`|\[([^\]]+)\]\(([^)]+)\))/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = inlineRegex.exec(text)) !== null) {
    // Plain text before this match
    if (match.index > lastIndex) {
      const plain = text.slice(lastIndex, match.index);
      if (plain) {
        segments.push({
          type: "text",
          text: { content: plain },
        });
      }
    }

    if (match[2]) {
      // **bold**
      segments.push({
        type: "text",
        text: { content: match[2] },
        annotations: { bold: true },
      });
    } else if (match[3]) {
      // *italic*
      segments.push({
        type: "text",
        text: { content: match[3] },
        annotations: { italic: true },
      });
    } else if (match[4]) {
      // ~~strikethrough~~
      segments.push({
        type: "text",
        text: { content: match[4] },
        annotations: { strikethrough: true },
      });
    } else if (match[5]) {
      // `code`
      segments.push({
        type: "text",
        text: { content: match[5] },
        annotations: { code: true },
      });
    } else if (match[6] && match[7]) {
      // [link](url) — resolve relative URLs for Notion
      segments.push({
        type: "text",
        text: { content: match[6], link: { url: resolveUrl(match[7]) } },
      });
    }

    lastIndex = match.index + match[0].length;
  }

  // Remaining plain text
  if (lastIndex < text.length) {
    const remaining = text.slice(lastIndex);
    if (remaining) {
      segments.push({
        type: "text",
        text: { content: remaining },
      });
    }
  }

  // If nothing was parsed, return the whole string as plain text
  if (segments.length === 0 && text) {
    segments.push({
      type: "text",
      text: { content: text },
    });
  }

  return segments;
}

/** Notion limits rich_text to 2000 chars per segment */
function truncateRichText(
  segments: RichTextSegment[],
): RichTextSegment[] {
  return segments.map((seg) => {
    if (seg.text.content.length > 2000) {
      return {
        ...seg,
        text: { ...seg.text, content: seg.text.content.slice(0, 2000) },
      };
    }
    return seg;
  });
}

function markdownToNotionBlocks(markdown: string): NotionBlock[] {
  const lines = markdown.split("\n");
  const blocks: NotionBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Skip empty lines
    if (line.trim() === "") {
      i++;
      continue;
    }

    // --- Divider
    if (/^---+$/.test(line.trim())) {
      blocks.push({ type: "divider", divider: {} });
      i++;
      continue;
    }

    // Headings
    if (line.startsWith("### ")) {
      blocks.push({
        type: "heading_3",
        heading_3: {
          rich_text: truncateRichText(
            parseInlineMarkdown(line.slice(4).trim()),
          ),
        },
      });
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      blocks.push({
        type: "heading_2",
        heading_2: {
          rich_text: truncateRichText(
            parseInlineMarkdown(line.slice(3).trim()),
          ),
        },
      });
      i++;
      continue;
    }
    if (line.startsWith("# ")) {
      blocks.push({
        type: "heading_1",
        heading_1: {
          rich_text: truncateRichText(
            parseInlineMarkdown(line.slice(2).trim()),
          ),
        },
      });
      i++;
      continue;
    }

    // Block quotes (> text)
    if (line.startsWith("> ")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        quoteLines.push(lines[i].slice(2));
        i++;
      }
      blocks.push({
        type: "quote",
        quote: {
          rich_text: truncateRichText(
            parseInlineMarkdown(quoteLines.join("\n")),
          ),
        },
      });
      continue;
    }

    // Bulleted list items (- text or * text)
    if (/^[-*] /.test(line)) {
      while (i < lines.length && /^[-*] /.test(lines[i])) {
        const itemText = lines[i].replace(/^[-*] /, "").trim();
        blocks.push({
          type: "bulleted_list_item",
          bulleted_list_item: {
            rich_text: truncateRichText(parseInlineMarkdown(itemText)),
          },
        });
        i++;
      }
      continue;
    }

    // Numbered list items (1. text)
    if (/^\d+\. /.test(line)) {
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        const itemText = lines[i].replace(/^\d+\. /, "").trim();
        blocks.push({
          type: "numbered_list_item",
          numbered_list_item: {
            rich_text: truncateRichText(parseInlineMarkdown(itemText)),
          },
        });
        i++;
      }
      continue;
    }

    // Code blocks (``` ... ```)
    if (line.startsWith("```")) {
      const language = line.slice(3).trim() || "plain text";
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```

      const codeContent = codeLines.join("\n");
      blocks.push({
        type: "code",
        code: {
          rich_text: [
            {
              type: "text",
              text: { content: codeContent.slice(0, 2000) },
            },
          ],
          language: language,
        },
      });
      continue;
    }

    // Regular paragraph
    const richText = truncateRichText(parseInlineMarkdown(line.trim()));
    if (richText.length > 0) {
      blocks.push({
        type: "paragraph",
        paragraph: { rich_text: richText },
      });
    }
    i++;
  }

  return blocks;
}

// ─── Blog post data (imported inline to avoid Vite/asset issues) ────

interface StaticBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  publishDate: string;
  author: string;
  readTime: string;
  tags: string[];
  image?: string;
  pinned?: boolean;
}

async function loadBlogPosts(): Promise<StaticBlogPost[]> {
  // We need to extract the data without Vite asset imports.
  // Use a regex approach to parse the TS file.
  const fs = await import("fs");
  const path = await import("path");
  const filePath = path.resolve(
    import.meta.dirname || process.cwd(),
    "../client/src/data/blog-posts.ts",
  );

  const raw = fs.readFileSync(filePath, "utf-8");

  // Strip import lines and export interface/type lines
  // Find the array start
  const arrayStart = raw.indexOf("export const blogPosts");
  if (arrayStart === -1) {
    throw new Error("Could not find blogPosts array in file");
  }

  // Extract the array portion
  let arrayStr = raw.slice(arrayStart);
  // Remove the export declaration
  arrayStr = arrayStr.replace(
    /export const blogPosts:\s*BlogPost\[\]\s*=\s*/,
    "",
  );

  // Replace image variable references with empty strings
  // Image vars look like: image: someVarName,  or  image: someVarName
  arrayStr = arrayStr.replace(
    /image:\s*([a-zA-Z_]\w*)\s*(,|\n|})/g,
    (_, _varName, end) => `image: ""${end}`,
  );

  // Replace the template literals with regular strings
  // This is tricky — we'll use Function constructor to eval safely
  // Actually, let's just use eval since this is a migration script
  const posts: StaticBlogPost[] = eval(`(${arrayStr.trim().replace(/;$/, "")})`);

  return posts;
}

// ─── Notion API helpers ──────────────────────────────────────────────

async function createNotionPage(
  post: StaticBlogPost,
  category: string,
  archetypeTags: string[],
) {
  const readTimeMin = parseReadTime(post.readTime);

  // Build properties
  const properties: any = {
    Title: {
      title: [{ text: { content: post.title } }],
    },
    Slug: {
      rich_text: [{ text: { content: post.slug } }],
    },
    Status: {
      select: { name: "Published" },
    },
    "Publish Date": {
      date: { start: post.publishDate },
    },
    Category: {
      select: { name: category },
    },
    "Meta Description": {
      rich_text: [
        { text: { content: post.excerpt.slice(0, 2000) } },
      ],
    },
    Author: {
      select: { name: "Adeola" },
    },
    "Read Time (min)": {
      number: readTimeMin,
    },
  };

  // Only add archetype tags if there are any
  if (archetypeTags.length > 0) {
    properties["Archetype Tags"] = {
      multi_select: archetypeTags.map((name) => ({ name })),
    };
  }

  // Create the page (properties only)
  const page = await notion.pages.create({
    parent: { database_id: DATABASE_ID! },
    properties,
  });

  // Convert markdown content to Notion blocks
  const allBlocks = markdownToNotionBlocks(post.content);

  // Notion API limits: max 100 blocks per append call
  for (let j = 0; j < allBlocks.length; j += 100) {
    const chunk = allBlocks.slice(j, j + 100);
    await notion.blocks.children.append({
      block_id: page.id,
      children: chunk as any,
    });
    if (j + 100 < allBlocks.length) {
      await sleep(300); // small delay between chunks
    }
  }

  return page;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Main ────────────────────────────────────────────────────────────

async function main() {
  console.log(DRY_RUN ? "🏃 DRY RUN MODE" : "🚀 LIVE MIGRATION");
  console.log(`Database ID: ${DATABASE_ID}`);
  console.log("");

  let posts = await loadBlogPosts();
  if (ONLY_SLUGS.length > 0) {
    posts = posts.filter((p) => ONLY_SLUGS.includes(p.slug));
    console.log(`Filtering to ${posts.length} posts: ${ONLY_SLUGS.join(", ")}\n`);
  } else {
    console.log(`Found ${posts.length} blog posts to migrate\n`);
  }

  let success = 0;
  let failed = 0;

  for (let idx = 0; idx < posts.length; idx++) {
    const post = posts[idx];
    const category = mapCategory(post.tags);
    const archetypeTags = mapArchetypeTags(post.tags);
    const readTimeMin = parseReadTime(post.readTime);
    const blocks = markdownToNotionBlocks(post.content);

    console.log(
      `[${idx + 1}/${posts.length}] ${post.pinned ? "📌 " : ""}${post.title}`,
    );
    console.log(`   Slug: ${post.slug}`);
    console.log(`   Date: ${post.publishDate}`);
    console.log(`   Category: ${category}`);
    console.log(
      `   Archetype Tags: ${archetypeTags.length > 0 ? archetypeTags.join(", ") : "(none)"}`,
    );
    console.log(`   Read Time: ${readTimeMin} min`);
    console.log(`   Excerpt: ${post.excerpt.slice(0, 80)}...`);
    console.log(`   Content: ${blocks.length} Notion blocks`);

    if (DRY_RUN) {
      console.log(`   ✅ Would create (dry run)\n`);
      success++;
      continue;
    }

    try {
      const page = await createNotionPage(post, category, archetypeTags);
      console.log(`   ✅ Created: ${page.id}\n`);
      success++;
    } catch (err: any) {
      console.error(`   ❌ FAILED: ${err.message}`);
      if (err.body) {
        console.error(`   Body: ${err.body}`);
      }
      console.log("");
      failed++;
    }

    // Rate limit
    if (!DRY_RUN && idx < posts.length - 1) {
      await sleep(DELAY_MS);
    }
  }

  console.log("────────────────────────────────────────");
  console.log(
    `Done! ${success} succeeded, ${failed} failed out of ${posts.length} total`,
  );
  if (DRY_RUN) {
    console.log("(Dry run — nothing was actually created)");
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
