import fs from "fs";
import path from "path";
import type { Express, Request, Response } from "express";
import { archetypeData } from "./archetypeData";

const SITE_URL = "https://www.prolificpersonalities.com";
const SITE_NAME = "Prolific Personalities";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

// ─── Meta tag replacement ──────────────────────────────────────────

interface PageMeta {
  title: string;
  description: string;
  ogType?: string;
  ogImage?: string;
  canonical?: string;
  articlePublishedTime?: string;
  jsonLd?: object;
}

/**
 * Replace default meta tags in the HTML template with page-specific values.
 * Designed to be idempotent — works on the raw index.html template.
 */
export function injectMeta(html: string, meta: PageMeta): string {
  // Replace <title>
  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${escHtml(meta.title)}</title>`,
  );

  // Replace meta description
  html = html.replace(
    /<meta name="description" content="[^"]*" \/>/,
    `<meta name="description" content="${escAttr(meta.description)}" />`,
  );

  // Build OG + Twitter + canonical block
  const ogTags = [
    `<meta property="og:title" content="${escAttr(meta.title)}" />`,
    `<meta property="og:description" content="${escAttr(meta.description)}" />`,
    `<meta property="og:type" content="${meta.ogType || "website"}" />`,
    `<meta property="og:image" content="${escAttr(meta.ogImage || DEFAULT_OG_IMAGE)}" />`,
    `<meta property="og:url" content="${escAttr(meta.canonical || SITE_URL)}" />`,
    `<meta name="twitter:title" content="${escAttr(meta.title)}" />`,
    `<meta name="twitter:description" content="${escAttr(meta.description)}" />`,
    `<meta name="twitter:image" content="${escAttr(meta.ogImage || DEFAULT_OG_IMAGE)}" />`,
  ];

  if (meta.articlePublishedTime) {
    ogTags.push(
      `<meta property="article:published_time" content="${escAttr(meta.articlePublishedTime)}" />`,
    );
  }

  if (meta.canonical) {
    ogTags.push(`<link rel="canonical" href="${escAttr(meta.canonical)}" />`);
  }

  // Inject JSON-LD
  if (meta.jsonLd) {
    ogTags.push(
      `<script type="application/ld+json">${JSON.stringify(meta.jsonLd)}</script>`,
    );
  }

  // Replace the existing og:site_name line (which sits between description and og:type)
  // and insert all OG tags there
  html = html.replace(
    /<meta property="og:site_name" content="[^"]*" \/>\s*<meta property="og:type" content="[^"]*" \/>\s*<meta property="og:image" content="[^"]*" \/>\s*<meta name="twitter:card" content="[^"]*" \/>/,
    `<meta property="og:site_name" content="${SITE_NAME}" />\n    <meta name="twitter:card" content="summary_large_image" />\n    ${ogTags.join("\n    ")}`,
  );

  return html;
}

function escHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escAttr(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ─── Route-specific meta resolvers ─────────────────────────────────

const STATIC_META: Record<string, PageMeta> = {
  "/": {
    title: "Prolific Personalities — Discover Your Productivity Archetype",
    description:
      "Take our free 5-minute assessment. Discover your productivity archetype and get research-backed strategies that match how your brain actually works.",
    canonical: SITE_URL,
  },
  "/quiz": {
    title: "Free Productivity Assessment | Prolific Personalities",
    description:
      "Discover your unique productivity archetype in under 5 minutes. Get personalized, research-backed strategies for how your brain actually works.",
    canonical: `${SITE_URL}/quiz`,
  },
  "/blog": {
    title:
      "Blog | Prolific Personalities — Research-Backed Productivity",
    description:
      "Evidence-based productivity strategies matched to how your brain actually works. Articles on procrastination, focus, and personalized productivity systems.",
    canonical: `${SITE_URL}/blog`,
  },
  "/science": {
    title: "The Science Behind Productivity Archetypes | Prolific Personalities",
    description:
      "Explore the peer-reviewed research behind our productivity assessment — cognitive psychology, executive function theory, and behavioral science.",
    canonical: `${SITE_URL}/science`,
  },
  "/archetypes": {
    title: "Productivity Archetypes | Prolific Personalities",
    description:
      "Explore all seven productivity archetypes. Find research-backed strategies tailored to how your brain processes tasks, energy, and motivation.",
    canonical: `${SITE_URL}/archetypes`,
  },
};

/**
 * Resolve meta tags for a given URL path.
 * Returns null for API routes and static assets — those should pass through.
 */
export async function resolvePageMeta(
  urlPath: string,
): Promise<PageMeta | null> {
  // Static pages
  const staticMeta = STATIC_META[urlPath];
  if (staticMeta) return staticMeta;

  // Blog post: /blog/:slug
  const blogPostMatch = urlPath.match(/^\/blog\/([a-z0-9-]+)$/);
  if (blogPostMatch) {
    const slug = blogPostMatch[1];
    try {
      const { getPostBySlug } = await import("./notion");
      const post = await getPostBySlug(slug);
      if (post) {
        return {
          title: `${post.title} | ${SITE_NAME}`,
          description: post.metaDescription || post.title,
          ogType: "article",
          ogImage:
            post.featuredImage ||
            DEFAULT_OG_IMAGE,
          canonical: `${SITE_URL}/blog/${slug}`,
          articlePublishedTime: post.publishDate
            ? new Date(post.publishDate).toISOString()
            : undefined,
          jsonLd: {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.metaDescription || post.title,
            image: post.featuredImage || DEFAULT_OG_IMAGE,
            datePublished: post.publishDate
              ? new Date(post.publishDate).toISOString()
              : undefined,
            author: {
              "@type": "Person",
              name: post.author || "Prolific Personalities Team",
            },
            publisher: {
              "@type": "Organization",
              name: SITE_NAME,
              url: SITE_URL,
            },
          },
        };
      }
    } catch {
      // Fall through to default meta
    }
  }

  // Archetype page: /archetypes/:slug
  const archetypeMatch = urlPath.match(/^\/archetypes\/([a-z0-9-]+)$/);
  if (archetypeMatch) {
    const slug = archetypeMatch[1];
    const info = archetypeData[slug];
    if (info) {
      return {
        title: `${info.title} — Productivity Archetype | ${SITE_NAME}`,
        description: info.tagline,
        canonical: `${SITE_URL}/archetypes/${slug}`,
      };
    }
  }

  // Unknown client-side route — return homepage defaults so the SPA still works
  return null;
}

// ─── Sitemap ────────────────────────────────────────────────────────

export function registerSeoRoutes(app: Express) {
  // robots.txt
  app.get("/robots.txt", (_req: Request, res: Response) => {
    res.type("text/plain").send(
      `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`,
    );
  });

  // sitemap.xml
  app.get("/sitemap.xml", async (_req: Request, res: Response) => {
    try {
      const urls: Array<{
        loc: string;
        lastmod?: string;
        changefreq: string;
        priority: number;
      }> = [];

      // Static pages
      urls.push({
        loc: SITE_URL,
        changefreq: "weekly",
        priority: 1.0,
      });
      urls.push({
        loc: `${SITE_URL}/quiz`,
        changefreq: "monthly",
        priority: 0.9,
      });
      urls.push({
        loc: `${SITE_URL}/blog`,
        changefreq: "weekly",
        priority: 0.8,
      });
      urls.push({
        loc: `${SITE_URL}/science`,
        changefreq: "monthly",
        priority: 0.6,
      });
      urls.push({
        loc: `${SITE_URL}/archetypes`,
        changefreq: "monthly",
        priority: 0.7,
      });

      // Archetype pages
      for (const slug of Object.keys(archetypeData)) {
        urls.push({
          loc: `${SITE_URL}/archetypes/${slug}`,
          changefreq: "monthly",
          priority: 0.6,
        });
      }

      // Blog posts from Notion
      try {
        const { getPublishedPosts } = await import("./notion");
        const posts = await getPublishedPosts();
        for (const post of posts) {
          if (post.slug) {
            urls.push({
              loc: `${SITE_URL}/blog/${post.slug}`,
              lastmod: post.publishDate
                ? new Date(post.publishDate).toISOString().split("T")[0]
                : undefined,
              changefreq: "monthly",
              priority: 0.7,
            });
          }
        }
      } catch {
        // If Notion is unavailable, sitemap still includes static pages
      }

      const xml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...urls.map(
          (u) =>
            `  <url>\n    <loc>${escXml(u.loc)}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ""}\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`,
        ),
        "</urlset>",
      ].join("\n");

      res.type("application/xml").send(xml);
    } catch (err) {
      console.error("[SEO] Sitemap generation failed:", err);
      res.status(500).type("text/plain").send("Sitemap generation failed");
    }
  });
}

function escXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
