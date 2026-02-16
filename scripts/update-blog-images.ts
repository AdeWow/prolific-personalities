import { Client } from "@notionhq/client";

const DRY_RUN = process.argv.includes("--dry-run");
const DELAY_MS = 500;

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const DATABASE_ID =
  process.env.NOTION_BLOG_DATABASE_ID || "0457aaf1feb64a85b6288b3e23fc2c76";
const IMAGE_BASE = "https://assets.prolificpersonalities.com/blog-images";

if (!NOTION_API_KEY) {
  console.error("❌ NOTION_API_KEY env var is required");
  process.exit(1);
}

const notion = new Client({ auth: NOTION_API_KEY });

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getAllPages() {
  const pages: any[] = [];
  let cursor: string | undefined;

  do {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      start_cursor: cursor,
      page_size: 100,
    });
    pages.push(...response.results);
    cursor = response.has_more ? (response.next_cursor as string) : undefined;
  } while (cursor);

  return pages;
}

async function main() {
  console.log(DRY_RUN ? "🏃 DRY RUN MODE\n" : "🚀 LIVE UPDATE\n");
  console.log(`Database ID: ${DATABASE_ID}`);
  console.log(`Image base:  ${IMAGE_BASE}\n`);

  const pages = await getAllPages();
  console.log(`Found ${pages.length} pages in database\n`);

  let updated = 0;
  let skippedHasImage = 0;
  let skippedNoSlug = 0;

  let skippedArchived = 0;

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];

    // Skip archived/trashed pages (leftover shells from failed migrations)
    if (page.archived) {
      skippedArchived++;
      continue;
    }

    // Extract title
    const titleProp = page.properties["Title"];
    const title =
      titleProp?.title?.map((t: any) => t.plain_text).join("") || "(untitled)";

    // Extract slug
    const slugProp = page.properties["Slug"];
    const slug =
      slugProp?.rich_text?.map((t: any) => t.plain_text).join("") || "";

    // Extract existing featured image URL
    const imageProp = page.properties["Featured Image URL"];
    const existingImage = imageProp?.url || "";

    // Skip: no slug
    if (!slug) {
      console.log(`⏭️  Skipped (no slug): ${title}`);
      skippedNoSlug++;
      continue;
    }

    // Skip: already has image
    if (existingImage) {
      console.log(`⏭️  Skipped (has image): ${title} → ${existingImage}`);
      skippedHasImage++;
      continue;
    }

    const imageUrl = `${IMAGE_BASE}/${slug}.png`;

    if (DRY_RUN) {
      console.log(`📋 Would update: ${title} → ${imageUrl}`);
      updated++;
      continue;
    }

    // Live update
    await notion.pages.update({
      page_id: page.id,
      properties: {
        "Featured Image URL": {
          url: imageUrl,
        },
      },
    });

    console.log(`✅ Updated: ${title} → ${imageUrl}`);
    updated++;

    // Rate limit
    if (i < pages.length - 1) {
      await sleep(DELAY_MS);
    }
  }

  console.log("\n────────────────────────────────────────");
  console.log(`Done! ${updated} ${DRY_RUN ? "would be updated" : "updated"}`);
  console.log(`Skipped (already has image): ${skippedHasImage}`);
  console.log(`Skipped (no slug): ${skippedNoSlug}`);
  console.log(`Skipped (archived): ${skippedArchived}`);
  if (DRY_RUN) {
    console.log("(Dry run — nothing was actually changed)");
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
