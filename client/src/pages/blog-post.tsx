import { useRoute, Link } from 'wouter';
import { useEffect, useRef, useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { blogPosts, BlogPost } from '@/data/blog-posts';
import { NotionRenderer } from '@/components/notion-renderer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ArrowRight, ChevronRight, ExternalLink, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { trackEvent } from '@/lib/analytics';
import { SEOHead } from '@/components/seo-head';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ARCHETYPE_SLUGS: Record<string, string> = {
  'Chaotic Creative': 'chaotic-creative',
  'Anxious Perfectionist': 'anxious-perfectionist',
  'Structured Achiever': 'structured-achiever',
  'Novelty Seeker': 'novelty-seeker',
  'Strategic Planner': 'strategic-planner',
  'Flexible Improviser': 'flexible-improviser',
  'Adaptive Generalist': 'adaptive-generalist',
};

function calculateReadTime(content: string): string {
  const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
  const minutes = Math.ceil(wordCount / 250);
  return `${minutes} min read`;
}

function getWordCount(content: string): number {
  return content.split(/\s+/).filter(word => word.length > 0).length;
}

function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const article = document.querySelector('article');
      if (!article) return;

      const articleTop = article.offsetTop;
      const articleHeight = article.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;

      const start = articleTop;
      const end = articleTop + articleHeight - windowHeight;
      const current = scrollY - start;
      const total = end - start;

      const percentage = Math.min(Math.max((current / total) * 100, 0), 100);
      setProgress(percentage);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-[3px] bg-slate-200 z-50">
      <div
        className="h-full bg-teal-500 transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

function Breadcrumbs({ postTitle }: { postTitle: string }) {
  return (
    <nav className="text-sm text-slate-400 mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center flex-wrap">
        <li>
          <Link href="/" className="hover:text-teal-600 transition-colors">Home</Link>
        </li>
        <ChevronRight className="h-3 w-3 mx-2" />
        <li>
          <Link href="/blog" className="hover:text-teal-600 transition-colors">Blog</Link>
        </li>
        <ChevronRight className="h-3 w-3 mx-2" />
        <li className="text-slate-500 truncate max-w-[200px] md:max-w-none">{postTitle}</li>
      </ol>
    </nav>
  );
}

function MidArticleCTA({ archetypeTags }: { archetypeTags: string[] }) {
  const isArchetypeSpecific = archetypeTags.length > 0;
  const archetype = archetypeTags[0];

  return (
    <div className="my-10 mx-auto max-w-xl bg-slate-50 border border-slate-200 rounded-xl p-6 text-center">
      <p className="text-lg font-semibold text-slate-800 mb-2">
        {isArchetypeSpecific
          ? `Think you might be a ${archetype}?`
          : "Curious what's actually going on?"
        }
      </p>
      <p className="text-sm text-slate-500 mb-4">
        {isArchetypeSpecific
          ? "Take our free 5-minute assessment to find out — and get strategies built for how your brain actually works."
          : "Take our free 5-minute assessment to discover your productivity archetype — and get strategies that actually match how your brain works."
        }
      </p>
      <Link href="/quiz">
        <Button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl text-sm font-medium">
          Discover Your Type
        </Button>
      </Link>
    </div>
  );
}

function EndOfArticleCTA() {
  return (
    <div className="mt-12 mb-8 bg-slate-800 rounded-xl p-8 text-center">
      <p className="text-xl font-semibold text-white mb-2">
        Ready to stop fighting your brain?
      </p>
      <p className="text-sm text-slate-300 mb-5">
        Discover your productivity archetype and get a personalized strategy in 5 minutes.
      </p>
      <Link href="/quiz">
        <Button className="bg-teal-500 hover:bg-teal-400 text-white px-8 py-3 rounded-xl text-base font-medium">
          Take the Free Assessment
        </Button>
      </Link>
    </div>
  );
}

function RelatedArchetypeLinks({ archetypeTags }: { archetypeTags: string[] }) {
  if (archetypeTags.length === 0) return null;

  return (
    <div className="mt-8 pt-6 border-t border-slate-200">
      <p className="text-sm font-medium text-slate-500 mb-3">
        Learn more about {archetypeTags.length > 1 ? 'these archetypes' : 'this archetype'}
      </p>
      <div className="flex flex-wrap gap-3">
        {archetypeTags.map(archetype => {
          const slug = ARCHETYPE_SLUGS[archetype];
          if (!slug) return null;
          return (
            <Link key={archetype} href={`/archetypes/${slug}`}>
              <span className="text-teal-600 hover:text-teal-700 text-sm underline inline-flex items-center gap-1">
                {archetype} — Full Profile
                <ExternalLink className="h-3 w-3" />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function RelatedPosts({ currentPost, allPosts }: { currentPost: BlogPost; allPosts: BlogPost[] }) {
  const relatedPosts = useMemo(() => {
    const otherPosts = allPosts.filter(p => p.id !== currentPost.id);

    const scored = otherPosts.map(post => {
      let score = 0;
      const currentArchetypes = currentPost.tags.filter(t => ARCHETYPE_SLUGS[t]);
      const postArchetypes = post.tags.filter(t => ARCHETYPE_SLUGS[t]);

      currentArchetypes.forEach(arch => {
        if (postArchetypes.includes(arch)) score += 10;
      });

      currentPost.tags.forEach(tag => {
        if (post.tags.includes(tag) && !ARCHETYPE_SLUGS[tag]) score += 2;
      });

      return { post, score };
    });

    scored.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(b.post.publishDate).getTime() - new Date(a.post.publishDate).getTime();
    });

    return scored.slice(0, 3).map(s => s.post);
  }, [currentPost, allPosts]);

  if (relatedPosts.length === 0) return null;

  return (
    <div className="mt-10 pt-8 border-t border-slate-200">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">You might also like</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {relatedPosts.map(post => (
          <Link key={post.id} href={`/blog/${post.slug}`}>
            <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              {post.image && (
                <div className="h-32 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <h4 className="font-medium text-slate-800 text-sm line-clamp-2 mb-2">
                  {post.title}
                </h4>
                <p className="text-xs text-slate-400">
                  {new Date(post.publishDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

function insertMidArticleCTA(content: string, archetypeTags: string[]): { before: string; after: string } {
  const lines = content.split('\n');
  let headingCount = 0;
  let insertIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('## ')) {
      headingCount++;
      if (headingCount === 2) {
        let endOfSection = i + 1;
        while (endOfSection < lines.length && !lines[endOfSection].startsWith('## ')) {
          endOfSection++;
        }
        insertIndex = endOfSection;
        break;
      }
    }
  }

  if (insertIndex === -1) {
    let paragraphCount = 0;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim() !== '' && !lines[i].startsWith('#') && !lines[i].startsWith('-') && !lines[i].startsWith('*')) {
        paragraphCount++;
        if (paragraphCount === 5) {
          insertIndex = i + 1;
          break;
        }
      }
    }
  }

  if (insertIndex === -1) {
    insertIndex = Math.floor(lines.length * 0.4);
  }

  return {
    before: lines.slice(0, insertIndex).join('\n'),
    after: lines.slice(insertIndex).join('\n')
  };
}

/** Split Notion blocks at roughly the 2nd heading for mid-article CTA insertion */
function splitNotionBlocks(blocks: any[]): { before: any[]; after: any[] } {
  let headingCount = 0;
  let splitIndex = -1;

  for (let i = 0; i < blocks.length; i++) {
    const type = blocks[i].type;
    if (type === 'heading_1' || type === 'heading_2') {
      headingCount++;
      if (headingCount === 2) {
        // find end of this section (next heading or end)
        let end = i + 1;
        while (end < blocks.length && blocks[end].type !== 'heading_1' && blocks[end].type !== 'heading_2') {
          end++;
        }
        splitIndex = end;
        break;
      }
    }
  }

  if (splitIndex === -1) {
    splitIndex = Math.floor(blocks.length * 0.4);
  }

  return {
    before: blocks.slice(0, splitIndex),
    after: blocks.slice(splitIndex),
  };
}

export default function BlogPostPage() {
  const [, params] = useRoute('/blog/:slug');
  const slug = params?.slug;

  // Try fetching from Notion API
  const { data: notionPost, isLoading, isError } = useQuery({
    queryKey: ["/api/blog/posts", slug],
    queryFn: async () => {
      const res = await fetch(`/api/blog/posts/${slug}`);
      if (!res.ok) throw new Error("Not found");
      const json = await res.json();
      if (!json.success || !json.post) throw new Error("No post");
      return json.post;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  // Fall back to static post
  const staticPost = blogPosts.find(p => p.slug === slug);

  // Determine which source to use
  const isNotion = !!notionPost?.content;
  const post = isNotion
    ? {
        // Normalize Notion post into BlogPost shape for shared components
        id: notionPost.id,
        title: notionPost.title,
        slug: notionPost.slug,
        excerpt: notionPost.metaDescription || "",
        content: "", // Notion content is blocks, not markdown
        publishDate: notionPost.publishDate,
        author: notionPost.author || "Prolific Personalities Team",
        readTime: notionPost.readTime ? `${notionPost.readTime} min read` : "5 min read",
        tags: [...(notionPost.archetypeTags || []), notionPost.category].filter(Boolean),
        image: notionPost.featuredImage || undefined,
        pinned: false,
      } as BlogPost
    : staticPost;

  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (post) {
      trackEvent('blog_post_viewed', 'Blog', post.title);
      startTimeRef.current = Date.now();

      return () => {
        if (startTimeRef.current) {
          const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
          if (timeSpent > 5) {
            trackEvent('blog_post_time_spent', 'Blog', post.title, timeSpent);
          }
        }
      };
    }
  }, [post]);

  // Loading state
  if (isLoading && !staticPost) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading post…</span>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-foreground">Post Not Found</h1>
          <Link href="/blog">
            <Button data-testid="button-back-blog">← Back to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://prolificpersonalities.com';
  const canonicalUrl = `${origin}/blog/${post.slug}`;
  const archetypeTags = post.tags.filter(tag => ARCHETYPE_SLUGS[tag]);

  // For static posts, compute read time + split content for mid-CTA
  const dynamicReadTime = isNotion ? post.readTime : calculateReadTime(post.content);
  const wordCount = isNotion ? 0 : getWordCount(post.content);

  const publishDateISO = new Date(post.publishDate).toISOString();
  const absoluteImageUrl = post.image
    ? (post.image.startsWith('http') ? post.image : `${origin}${post.image}`)
    : undefined;

  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt,
    ...(absoluteImageUrl && { "image": absoluteImageUrl }),
    "datePublished": publishDateISO,
    "dateModified": publishDateISO,
    "author": {
      "@type": "Person",
      "name": "Adeola",
      "url": `${origin}/about`
    },
    "publisher": {
      "@type": "Organization",
      "name": "Prolific Personalities",
      "logo": {
        "@type": "ImageObject",
        "url": `${origin}/logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    },
    ...(wordCount > 0 && { "wordCount": wordCount }),
    "articleSection": post.tags[0] || "Productivity",
    "keywords": post.tags.join(", ")
  };

  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": origin
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": `${origin}/blog`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": canonicalUrl
      }
    ]
  };

  const combinedStructuredData = [articleStructuredData, breadcrumbStructuredData];

  const proseClasses = `prose prose-lg prose-slate dark:prose-invert max-w-none
    prose-headings:text-gray-900 dark:prose-headings:text-white
    prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:font-bold prose-h2:mt-12 prose-h2:mb-6
    prose-h3:text-xl prose-h3:md:text-2xl prose-h3:font-bold prose-h3:mt-10 prose-h3:mb-4
    prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6
    prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-li:my-1
    prose-ul:pl-6 prose-ol:pl-6 prose-ul:my-4 prose-ol:my-4
    prose-strong:font-semibold prose-strong:text-gray-900 dark:prose-strong:text-white
    prose-a:text-primary prose-a:font-medium hover:prose-a:underline
    prose-hr:my-10 prose-hr:border-gray-200 dark:prose-hr:border-gray-700
    prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-pre:rounded-lg prose-pre:p-6
    prose-code:text-gray-800 dark:prose-code:text-gray-200`;

  // Render content — Notion blocks or static markdown
  const renderContent = () => {
    if (isNotion && notionPost?.content) {
      const { before, after } = splitNotionBlocks(notionPost.content);
      return (
        <>
          <div className={proseClasses}>
            <NotionRenderer blocks={before} />
          </div>
          <MidArticleCTA archetypeTags={archetypeTags} />
          <div className={`${proseClasses} mb-16`}>
            <NotionRenderer blocks={after} />
          </div>
        </>
      );
    }

    // Static markdown fallback
    const { before, after } = insertMidArticleCTA(post.content, archetypeTags);
    return (
      <>
        <div className={proseClasses}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {before}
          </ReactMarkdown>
        </div>
        <MidArticleCTA archetypeTags={archetypeTags} />
        <div className={`${proseClasses} mb-16`}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {after}
          </ReactMarkdown>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <ReadingProgressBar />
      <SEOHead
        title={post.title}
        description={post.excerpt}
        ogImage={absoluteImageUrl}
        keywords={post.tags.join(", ")}
        canonicalUrl={canonicalUrl}
        structuredData={combinedStructuredData}
        article={{
          publishedTime: publishDateISO,
          modifiedTime: publishDateISO,
          author: `${origin}/about`,
          tags: post.tags,
        }}
      />
      <main id="main-content" role="main">
        <article className="container mx-auto px-4 py-16 max-w-4xl">
          <Breadcrumbs postTitle={post.title} />

          <header className="mb-12" aria-labelledby="post-title">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" data-testid={`badge-tag-${tag.toLowerCase().replace(/\s+/g, '-')}`}>
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 id="post-title" className="text-4xl md:text-5xl font-bold mb-6 text-foreground leading-tight" data-testid="text-post-title">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center text-xs font-medium text-slate-600">
                  A
                </div>
                <span className="font-medium" data-testid="text-post-author">Adeola</span>
              </div>
              <div className="flex items-center gap-2" data-testid="text-post-date">
                <Calendar className="h-4 w-4" />
                {new Date(post.publishDate).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
              <div className="flex items-center gap-2" data-testid="text-post-readtime">
                <Clock className="h-4 w-4" />
                {dynamicReadTime}
              </div>
            </div>
          </header>

          {post.image && (
            <div className="mb-12 -mx-4 sm:mx-0">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-auto rounded-lg"
                  data-testid="img-featured"
                />
              </div>
            </div>
          )}

          {renderContent()}

          <EndOfArticleCTA />

          <RelatedArchetypeLinks archetypeTags={archetypeTags} />

          <RelatedPosts currentPost={post} allPosts={blogPosts} />

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <Link href="/blog">
              <Button variant="outline" data-testid="button-view-all-posts">
                View All Posts
              </Button>
            </Link>
          </div>
        </article>
      </main>
    </div>
  );
}
