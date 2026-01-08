import { useRoute, Link } from 'wouter';
import { useEffect, useRef } from 'react';
import { blogPosts } from '@/data/blog-posts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Calendar, Clock, ArrowLeft, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { trackEvent } from '@/lib/analytics';
import { SEOHead } from '@/components/seo-head';

function renderInlineFormatting(text: string): (string | JSX.Element)[] {
  const elements: (string | JSX.Element)[] = [];
  let remaining = text;
  let keyIndex = 0;
  
  while (remaining.length > 0) {
    // Check for links [text](url)
    const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);
    // Check for bold **text**
    const boldMatch = remaining.match(/\*\*([^*]+)\*\*/);
    // Check for italic *text* (but not bold)
    const italicMatch = remaining.match(/(?<!\*)\*([^*]+)\*(?!\*)/);
    
    // Find the earliest match
    const matches = [
      { type: 'link', match: linkMatch, index: linkMatch?.index ?? Infinity },
      { type: 'bold', match: boldMatch, index: boldMatch?.index ?? Infinity },
      { type: 'italic', match: italicMatch, index: italicMatch?.index ?? Infinity },
    ].filter(m => m.match).sort((a, b) => a.index - b.index);
    
    if (matches.length === 0) {
      elements.push(remaining);
      break;
    }
    
    const first = matches[0];
    
    // Add text before the match
    if (first.index > 0) {
      elements.push(remaining.slice(0, first.index));
    }
    
    if (first.type === 'link' && first.match) {
      const [fullMatch, linkText, url] = first.match;
      elements.push(
        <a key={keyIndex++} href={url} className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
          {linkText}
        </a>
      );
      remaining = remaining.slice(first.index + fullMatch.length);
    } else if (first.type === 'bold' && first.match) {
      const [fullMatch, boldText] = first.match;
      elements.push(
        <strong key={keyIndex++} className="font-semibold text-gray-900 dark:text-white">
          {boldText}
        </strong>
      );
      remaining = remaining.slice(first.index + fullMatch.length);
    } else if (first.type === 'italic' && first.match) {
      const [fullMatch, italicText] = first.match;
      elements.push(
        <em key={keyIndex++} className="italic">
          {italicText}
        </em>
      );
      remaining = remaining.slice(first.index + fullMatch.length);
    }
  }
  
  return elements;
}

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
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Post Not Found</h1>
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <SEOHead
        title={post.title}
        description={post.excerpt}
        ogImage={post.image}
        keywords={post.tags.join(", ")}
        structuredData={structuredData}
      />
      <article className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Back Button */}
        <Link href="/blog">
          <Button variant="ghost" className="mb-8" data-testid="button-back-blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </Link>

        {/* Article Header */}
        <header className="mb-12">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" data-testid={`badge-tag-${tag.toLowerCase()}`}>
                {tag}
              </Badge>
            ))}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white leading-tight" data-testid="text-post-title">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-400">
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
        <div className="prose prose-lg dark:prose-invert max-w-none mb-16">
          {post.content.split('\n\n').map((paragraph, index) => {
            // Handle H2 headings
            if (paragraph.startsWith('## ')) {
              const heading = paragraph.replace('## ', '');
              return (
                <h2 key={index} className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">
                  {heading}
                </h2>
              );
            }
            
            // Handle H3 headings
            if (paragraph.startsWith('### ')) {
              const heading = paragraph.replace('### ', '');
              return (
                <h3 key={index} className="text-2xl font-bold mt-10 mb-4 text-gray-900 dark:text-white">
                  {heading}
                </h3>
              );
            }
            
            // Handle horizontal rules
            if (paragraph.trim() === '---') {
              return <hr key={index} className="my-8 border-gray-200 dark:border-gray-700" />;
            }
            
            // Handle bullet lists (lines starting with -)
            if (paragraph.includes('\n-') || paragraph.startsWith('-')) {
              const lines = paragraph.split('\n').filter(line => line.trim());
              return (
                <ul key={index} className="mb-6 space-y-2 ml-4">
                  {lines.map((line, i) => {
                    const content = line.replace(/^-\s*/, '');
                    return (
                      <li key={i} className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc ml-4">
                        {renderInlineFormatting(content)}
                      </li>
                    );
                  })}
                </ul>
              );
            }
            
            // Handle numbered lists
            if (/^\d+\.\s/.test(paragraph)) {
              const lines = paragraph.split('\n').filter(line => line.trim());
              return (
                <ol key={index} className="mb-6 space-y-2 ml-4">
                  {lines.map((line, i) => {
                    const content = line.replace(/^\d+\.\s*/, '');
                    return (
                      <li key={i} className="text-gray-700 dark:text-gray-300 leading-relaxed list-decimal ml-4">
                        {renderInlineFormatting(content)}
                      </li>
                    );
                  })}
                </ol>
              );
            }
            
            // Regular paragraphs with inline formatting
            return (
              <p key={index} className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
                {renderInlineFormatting(paragraph)}
              </p>
            );
          })}
        </div>

        {/* CTA Card */}
        <Card className="bg-gradient-to-r from-indigo-50 to-teal-50 dark:from-indigo-900/20 dark:to-teal-900/20 border-2 border-indigo-200 dark:border-indigo-800 p-8 text-center" data-testid="card-cta-assessment">
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
    </div>
  );
}
