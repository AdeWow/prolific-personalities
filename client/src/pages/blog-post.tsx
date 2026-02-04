import { useRoute, Link } from 'wouter';
import { useEffect, useRef } from 'react';
import { blogPosts } from '@/data/blog-posts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ArrowLeft, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { trackEvent } from '@/lib/analytics';
import { SEOHead } from '@/components/seo-head';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function BlogPostPage() {
  const [, params] = useRoute('/blog/:slug');
  const post = blogPosts.find(p => p.slug === params?.slug);
  const startTimeRef = useRef<number | null>(null);

  // Track blog post view and time spent
  useEffect(() => {
    if (post) {
      trackEvent('blog_post_viewed', 'Blog', post.title);
      startTimeRef.current = Date.now();
      
      return () => {
        if (startTimeRef.current) {
          const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000); // in seconds
          if (timeSpent > 5) { // Only track if spent more than 5 seconds
            trackEvent('blog_post_time_spent', 'Blog', post.title, timeSpent);
          }
        }
      };
    }
  }, [post]);

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

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  
  const structuredData = origin ? {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.image || `${origin}/og-image.png`,
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Prolific Personalities",
      "logo": {
        "@type": "ImageObject",
        "url": `${origin}/og-image.png`
      }
    },
    "datePublished": post.publishDate,
    "dateModified": post.publishDate,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${origin}/blog/${post.slug}`
    },
    "keywords": post.tags.join(", ")
  } : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <SEOHead
        title={`${post.title} | Productivity Blog`}
        description={post.excerpt}
        ogImage={post.image}
        keywords={post.tags.join(", ")}
        canonicalUrl={origin ? `${origin}/blog/${post.slug}` : undefined}
        structuredData={structuredData}
      />
      <main id="main-content" role="main">
        <article className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Back Button */}
        <Link href="/blog">
          <Button variant="ghost" className="mb-8" data-testid="button-back-blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </Link>

        {/* Article Header */}
        <header className="mb-12" aria-labelledby="post-title">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" data-testid={`badge-tag-${tag.toLowerCase()}`}>
                {tag}
              </Badge>
            ))}
          </div>
          
          <h1 id="post-title" className="text-4xl md:text-5xl font-bold mb-6 text-foreground leading-tight" data-testid="text-post-title">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
            <div className="flex items-center gap-2" data-testid="text-post-author">
              <span className="font-medium">{post.author}</span>
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
              {post.readTime}
            </div>
          </div>
        </header>

        {/* Featured Image */}
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

        {/* Article Content */}
        <article className="prose prose-lg prose-slate dark:prose-invert max-w-none mb-16
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
          prose-code:text-gray-800 dark:prose-code:text-gray-200">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </article>

        {/* CTA Card */}
        <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10 border-2 border-primary/20 dark:border-primary/30 p-8 text-center" data-testid="card-cta-assessment">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            🚀 Discover Your Productivity Archetype
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            Take the Prolific Personalities Assessment to discover your unique productivity archetype — and get personalized strategies to help you stop fighting your nature and start thriving in it.
          </p>
          <Link href="/quiz">
            <Button size="lg" className="text-lg px-8 py-6" data-testid="button-take-assessment">
              Take the Free Assessment
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </Card>

        {/* Footer Navigation */}
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
