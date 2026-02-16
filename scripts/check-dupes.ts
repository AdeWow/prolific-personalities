import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY! });
const DB = "0457aaf1feb64a85b6288b3e23fc2c76";

async function main() {
  const pages: any[] = [];
  let cursor: string | undefined;
  do {
    const r = await notion.databases.query({
      database_id: DB,
      start_cursor: cursor,
      page_size: 100,
    });
    pages.push(...r.results);
    cursor = r.has_more ? (r.next_cursor as string) : undefined;
  } while (cursor);

  const slugMap = new Map<string, Array<{ id: string; title: string; created: string }>>();

  for (const p of pages) {
    const title =
      p.properties?.Title?.title?.map((t: any) => t.plain_text).join("") || "?";
    const slug =
      p.properties?.Slug?.rich_text?.map((t: any) => t.plain_text).join("") ||
      "(no slug)";
    const created = p.created_time || "?";

    const arr = slugMap.get(slug) || [];
    arr.push({ id: p.id, title, created });
    slugMap.set(slug, arr);
  }

  console.log(`Total pages: ${pages.length}`);
  console.log(`Unique slugs: ${slugMap.size}\n`);

  let dupeCount = 0;
  for (const [slug, entries] of slugMap) {
    if (entries.length > 1) {
      dupeCount++;
      console.log(`DUPLICATE slug: "${slug}" (${entries.length} copies)`);
      for (const e of entries) {
        console.log(`  ${e.id} | created ${e.created} | ${e.title}`);
      }
      console.log("");
    }
  }

  if (dupeCount === 0) {
    console.log("No duplicates found.");
  } else {
    console.log(`Found ${dupeCount} slugs with duplicates.`);
  }
}

main().catch(console.error);
