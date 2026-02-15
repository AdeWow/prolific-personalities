import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

// Database ID will be set as env var
const BLOG_DATABASE_ID = process.env.NOTION_BLOG_DATABASE_ID;

// Cache for blog posts (5 minute TTL)
let postsCache: { data: any[]; timestamp: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function getPublishedPosts() {
  // Return cache if fresh
  if (postsCache && Date.now() - postsCache.timestamp < CACHE_TTL) {
    return postsCache.data;
  }

  if (!BLOG_DATABASE_ID) {
    throw new Error("NOTION_BLOG_DATABASE_ID is not set");
  }

  const response = await notion.databases.query({
    database_id: BLOG_DATABASE_ID,
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
