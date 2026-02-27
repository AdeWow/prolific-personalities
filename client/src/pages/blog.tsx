import { useState, useMemo } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { blogPosts as staticBlogPosts, BlogPost } from '@/data/blog-posts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Header } from '@/components/header';
import { SEOHead } from '@/components/seo-head';
import { EmailCaptureCard } from '@/components/email-capture-card';
import { Calendar, Clock, Pin, ExternalLink, Loader2 } from 'lucide-react';
import { getArchetypeSlug } from '@/data/tools';

const ARCHETYPE_NAMES = [
  "Chaotic Creative",
  "Anxious Perfectionist",
  "Structured Achiever",
  "Novelty Seeker",
  "Strategic Planner",
  "Flexible Improviser",
  "Adaptive Generalist"
];

/** Archetype tags display first on cards, then other categories */
function getPrioritizedTags(tags: string[], limit: number = 3): string[] {
  const sorted = [...tags].sort((a, b) => {
    const priorityA = ARCHETYPE_NAMES.includes(a) ? 1 : 2;
    const priorityB = ARCHETYPE_NAMES.includes(b) ? 1 : 2;
    return priorityA - priorityB;
  });
  return sorted.slice(0, limit);
}

function matchesFilter(tags: string[], filter: string): boolean {
  if (filter === "All") return true;

  if (filter === "Archetypes") {
    return tags.some(tag => ARCHETYPE_NAMES.includes(tag));
  }

  // Exact match against the category name from Notion
  return tags.some(tag => tag === filter);
}

/** Build dynamic filter categories from post data */
function buildFilterCategories(posts: BlogPost[]): string[] {
  const categories: string[] = ["All"];

  // Add "Archetypes" if any posts have archetype tags
  const hasArchetypePosts = posts.some(post =>
    post.tags.some(tag => ARCHETYPE_NAMES.includes(tag))
  );
  if (hasArchetypePosts) {
    categories.push("Archetypes");
  }

  // Extract unique non-archetype tags (these are the category values from Notion)
  const uniqueCategories = new Set<string>();
  posts.forEach(post => {
    post.tags.forEach(tag => {
      if (!ARCHETYPE_NAMES.includes(tag)) {
        uniqueCategories.add(tag);
      }
    });
  });

  // Sort alphabetically and append
  const sorted = [...uniqueCategories].sort((a, b) => a.localeCompare(b));
  categories.push(...sorted);

  return categories;
}

/** Normalize a Notion API post into the same shape as a static BlogPost */
function notionPostToBlogPost(np: any): BlogPost {
  return {
    id: np.id,
    title: np.title,
    slug: np.slug,
    excerpt: np.metaDescription || "",
    content: "", // listing page doesn't need full content
    publishDate: np.publishDate,
    author: np.author || "Prolific Personalities Team",
    readTime: np.readTime ? `${np.readTime} min read` : "5 min read",
    tags: [...(np.archetypeTags || []), np.category].filter(Boolean),
    image: np.featuredImage || undefined,
    pinned: np.pinned === true,
  };
}

function TagBadge({
  tag,
  onClick,
  variant = "secondary"
}: {
  tag: string;
  onClick: (tag: string) => void;
  variant?: "secondary" | "default";
}) {
  const isArchetype = ARCHETYPE_NAMES.includes(tag);
  const archetypeSlug = isArchetype ? getArchetypeSlug(tag) : null;

  return (
    <div className="relative group">
      <Badge
        variant={variant}
        className="cursor-pointer hover:bg-primary/20 transition-colors"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClick(tag);
        }}
        data-testid={`badge-tag-${tag.toLowerCase().replace(/\s+/g, '-')}`}
      >
        {tag}
        {isArchetype && <ExternalLink className="h-2.5 w-2.5 ml-1 opacity-50" />}
      </Badge>
      {isArchetype && archetypeSlug && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
          View archetype profile →
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
        </div>
      )}
    </div>
  );
}

function DateReadTime({ date, readTime }: { date: string; readTime: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <div className="flex items-center gap-1">
        <Calendar className="h-3.5 w-3.5" />
        {new Date(date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })}
      </div>
      <span className="text-slate-300">·</span>
      <div className="flex items-center gap-1">
        <Clock className="h-3.5 w-3.5" />
        {readTime}
      </div>
    </div>
  );
}

export default function BlogPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  // Fetch from Notion API, fall back to static data
  const { data: notionPosts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog/posts"],
    queryFn: async () => {
      const res = await fetch("/api/blog/posts");
      if (!res.ok) throw new Error("Failed to fetch posts");
      const json = await res.json();
      if (!json.success || !json.posts?.length) throw new Error("No posts");
      return json.posts.map(notionPostToBlogPost);
    },
    staleTime: 5 * 60 * 1000, // 5 min — match server cache TTL
    retry: 1,
  });

  // Use Notion posts if available, otherwise fall back to static
  const allPosts: BlogPost[] = notionPosts || staticBlogPosts;

  const sortedPosts = useMemo(() => {
    return [...allPosts]
      .filter(post => !post.pinned)
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
  }, [allPosts]);

  const featuredPost = useMemo(() => {
    return allPosts.find(post => post.pinned);
  }, [allPosts]);

  const filteredPosts = useMemo(() => {
    if (activeFilter === "All") return sortedPosts;
    return sortedPosts.filter(post => matchesFilter(post.tags, activeFilter));
  }, [sortedPosts, activeFilter]);

  const showFeaturedPost = useMemo(() => {
    if (!featuredPost) return false;
    if (activeFilter === "All") return true;
    return matchesFilter(featuredPost.tags, activeFilter);
  }, [featuredPost, activeFilter]);

  // Dynamic filter categories derived from actual post data
  const filterCategories = useMemo(() => buildFilterCategories(allPosts), [allPosts]);

  const filterCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    filterCategories.forEach(filter => {
      if (filter === "All") {
        counts[filter] = allPosts.length;
      } else {
        counts[filter] = allPosts.filter(post => matchesFilter(post.tags, filter)).length;
      }
    });

    return counts;
  }, [allPosts, filterCategories]);

  const handleTagClick = (tag: string) => {
    if (ARCHETYPE_NAMES.includes(tag)) {
      setActiveFilter("Archetypes");
    } else {
      // Set to exact tag name — it matches a dynamic filter category
      setActiveFilter(tag);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <SEOHead
        title="Productivity Insights Blog | Prolific Personalities"
        description="Research-backed strategies for every productivity style. Explore archetype-specific tips, psychology insights, and actionable advice for how your brain actually works."
        keywords="productivity blog, productivity tips, productivity strategies, time management tips, focus techniques, ADHD productivity, productivity research, work style optimization"
        canonicalUrl={typeof window !== 'undefined' ? `${window.location.origin}/blog` : undefined}
      />
      <Header />
      <main id="main-content" role="main">
        <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8" aria-labelledby="blog-title">
          <h1 id="blog-title" className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Productivity Insights
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Research-backed strategies and insights to help you work with your natural productivity style
          </p>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading posts…</span>
          </div>
        )}

        {/* Filter Bar */}
        <div className="flex flex-wrap gap-2 justify-center mb-8 overflow-x-auto pb-2">
          {filterCategories.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                activeFilter === filter
                  ? "bg-slate-800 text-white"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
              data-testid={`filter-${filter.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {filter} ({filterCounts[filter] || 0})
            </button>
          ))}
        </div>

        {/* Featured/Pinned Post */}
        {showFeaturedPost && featuredPost && (
          <Link href={`/blog/${featuredPost.slug}`}>
            <Card className="mb-12 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 border-2 border-primary/20 cursor-pointer" data-testid={`card-featured-${featuredPost.slug}`}>
              <div className="grid md:grid-cols-2 gap-0">
                {featuredPost.image && (
                  <div className="bg-muted dark:bg-card">
                    <img
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      loading="eager"
                      className="w-full h-full object-cover min-h-[250px]"
                      data-testid={`img-featured-${featuredPost.slug}`}
                    />
                  </div>
                )}
                <div className="p-6 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <Badge variant="default" className="bg-primary text-primary-foreground">
                      <Pin className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                    {getPrioritizedTags(featuredPost.tags, 2).map((tag) => (
                      <TagBadge
                        key={tag}
                        tag={tag}
                        onClick={handleTagClick}
                      />
                    ))}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-3 text-foreground hover:text-primary transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-muted-foreground mb-4 text-lg line-clamp-3">
                    {featuredPost.excerpt}
                  </p>
                  <DateReadTime date={featuredPost.publishDate} readTime={featuredPost.readTime} />
                  <div className="mt-4">
                    <Button className="w-fit pointer-events-none" data-testid={`button-read-featured-${featuredPost.slug}`}>
                      Read the Full Story
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        )}

        {/* Blog Posts Grid */}
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <Card className="flex flex-col h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer" data-testid={`card-blog-${post.slug}`}>
                {post.image && (
                  <AspectRatio ratio={16 / 9} className="bg-muted dark:bg-card rounded-t-lg overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      loading="lazy"
                      className="w-full h-full object-contain"
                      data-testid={`img-blog-${post.slug}`}
                    />
                  </AspectRatio>
                )}
                <CardHeader className="pb-2">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {getPrioritizedTags(post.tags, 3).map((tag) => (
                      <TagBadge
                        key={tag}
                        tag={tag}
                        onClick={handleTagClick}
                      />
                    ))}
                  </div>
                  <CardTitle className="text-xl leading-tight hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col">
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-grow">
                    {post.excerpt}
                  </p>
                  <DateReadTime date={post.publishDate} readTime={post.readTime} />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredPosts.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No posts found for "{activeFilter}"</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setActiveFilter("All")}
            >
              Show all posts
            </Button>
          </div>
        )}

        {/* Email Capture */}
        <div className="mt-16 mb-8 max-w-3xl mx-auto">
          <EmailCaptureCard
            title="Get productivity insights in your inbox"
            description="Subscribe for research-backed strategies, archetype deep-dives, and exclusive tips delivered weekly."
            buttonText="Subscribe Free"
            context="blog-listing"
          />
        </div>

        {/* Quiz CTA */}
        <div className="text-center py-8">
          <p className="text-lg text-muted-foreground mb-4">
            Curious which archetype you are?
          </p>
          <Link href="/quiz">
            <Button
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl text-base font-medium"
              data-testid="button-take-quiz-blog"
            >
              Take the Free Assessment
            </Button>
          </Link>
        </div>
        </div>
      </main>
    </div>
  );
}
