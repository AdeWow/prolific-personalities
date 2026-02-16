import { Client } from "@notionhq/client";

const DRY_RUN = process.argv.includes("--dry-run");
const notion = new Client({ auth: process.env.NOTION_API_KEY! });
const DB = "0457aaf1feb64a85b6288b3e23fc2c76";

// These are the OLDER empty-shell page IDs from the first failed migration run.
// The newer copies (created at 01:53) have full content.
const STALE_PAGE_IDS = [
  "30924ae1-6ef1-811a-9059-cbf21972860d", // ai-brutal-assessment (01:43, empty)
  "30924ae1-6ef1-814b-a5a3-ca92e45b85f6", // dog-applied (01:43, empty)
  "30924ae1-6ef1-8158-bd4a-e3f813a020b8", // confessions-imperfect-founder (01:43, empty)
  "30924ae1-6ef1-81c4-851f-e91393d77e8f", // cant-focus-anymore (01:43, empty)
  "30924ae1-6ef1-8161-9d92-ccf048e363a9", // time-blocking (01:43, empty)
  "30924ae1-6ef1-8190-9959-f3583276a3b2", // constant-stimulation (01:43, empty)
  "30924ae1-6ef1-81b5-a0f5-c8616b459ace", // start-everything (01:43, empty)
  "30924ae1-6ef1-81ad-aad0-ed9dd9067657", // cant-stick-to-routine (01:43, empty)
];

async function main() {
  console.log(
    DRY_RUN
      ? "🏃 DRY RUN — would archive these stale pages:\n"
      : "🗑️  ARCHIVING stale duplicate pages:\n",
  );

  for (const id of STALE_PAGE_IDS) {
    // Fetch title for logging
    const page = await notion.pages.retrieve({ page_id: id }) as any;
    const title =
      page.properties?.Title?.title?.map((t: any) => t.plain_text).join("") ||
      "?";

    if (DRY_RUN) {
      console.log(`📋 Would archive: ${id} | ${title}`);
    } else {
      await notion.pages.update({ page_id: id, archived: true });
      console.log(`✅ Archived: ${id} | ${title}`);
    }
  }

  console.log(
    `\nDone! ${STALE_PAGE_IDS.length} pages ${DRY_RUN ? "would be archived" : "archived"}.`,
  );
}

main().catch(console.error);
