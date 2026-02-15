import { Client } from "@notionhq/client";

// Lazily initialize the Notion client on first use
// (ensures env vars are available and avoids esbuild bundling issues)
let _notion: Client | null = null;

function getNotionClient(): Client {
  if (!_notion) {
    const apiKey = process.env.NOTION_API_KEY;
    if (!apiKey) {
      throw new Error("NOTION_API_KEY is not set");
    }
    console.log("[Notion] Initializing client with API key:", `${apiKey.slice(0, 8)}...`);
    _notion = new Client({ auth: apiKey });
  }
  return _notion;
}

function getDatabaseId(): string {
  const id = process.env.NOTION_BLOG_DATABASE_ID;
  if (!id) {
    throw new Error("NOTION_BLOG_DATABASE_ID is not set");
  }
  return id;
}

// Cache for blog posts (5 minute TTL)
let postsCache: { data: any[]; timestamp: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function getPublishedPosts() {
  // Return cache if fresh
  if (postsCache && Date.now() - postsCache.timestamp < CACHE_TTL) {
    return postsCache.data;
  }

  const notion = getNotionClient();
  const databaseId = getDatabaseId();

  console.log("[Notion] Querying database:", `${databaseId.slice(0, 8)}...`);

  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      and: [
        { property: "Status", select: { equals: "Published" } },
        {
          property: "Publish Date",
          date: { on_or_before: new Date().toISOString() },
        },
      ],
    },
    sorts: [{ property: "Publish Date", direction: "descending" }],
  });

  console.log("[Notion] Query returned", response.results.length, "results");

  const posts = response.results.map((page: any) => ({
    id: page.id,
    title: page.properties["Title"]?.title?.[0]?.plain_text || "",
    slug: page.properties["Slug"]?.rich_text?.[0]?.plain_text || "",
    publishDate: page.properties["Publish Date"]?.date?.start || "",
    category: page.properties["Category"]?.select?.name || "",
    archetypeTags:
      page.properties["Archetype Tags"]?.multi_select?.map(
        (t: any) => t.name,
      ) || [],
    metaDescription:
      page.properties["Meta Description"]?.rich_text?.[0]?.plain_text || "",
    featuredImage: page.properties["Featured Image"]?.url || "",
    author: page.properties["Author"]?.select?.name || "",
    readTime: page.properties["Read Time"]?.number || 5,
  }));

  postsCache = { data: posts, timestamp: Date.now() };
  return posts;
}

export async function getPostBySlug(slug: string) {
  const posts = await getPublishedPosts();
  const post = posts.find((p) => p.slug === slug);
  if (!post) return null;

  // Fetch the full page content (blocks)
  const blocks = await getPageBlocks(post.id);
  return { ...post, content: blocks };
}

async function getPageBlocks(pageId: string) {
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

// Clear cache (useful for webhook or manual refresh)
export function clearBlogCache() {
  postsCache = null;
}
