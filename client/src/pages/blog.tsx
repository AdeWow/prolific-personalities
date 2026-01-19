import { Link } from 'wouter';
import { blogPosts } from '@/data/blog-posts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Header } from '@/components/header';
import { SEOHead } from '@/components/seo-head';
import { EmailCaptureCard } from '@/components/email-capture-card';
import { Calendar, Clock, Pin } from 'lucide-react';

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <SEOHead
        title="Productivity Blog - Tips, Strategies & Research | Prolific Personalities"
        description="Research-backed productivity tips, strategies, and insights. Learn about productivity archetypes, time management, focus techniques, and personalized approaches that work for your unique brain."
        keywords="productivity blog, productivity tips, productivity strategies, time management tips, focus techniques, ADHD productivity, productivity research, work style optimization"
        canonicalUrl={typeof window !== 'undefined' ? `${window.location.origin}/blog` : undefined}
      />
      <Header />
      <main id="main-content" role="main">
        <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12" aria-labelledby="blog-title">
          <h1 id="blog-title" className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Productivity Insights
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Research-backed strategies and insights to help you work with your natural productivity style
          </p>
        </div>

        {/* Featured/Pinned Post */}
        {blogPosts.filter(post => post.pinned).map((post) => (
          <Card key={post.id} className="mb-12 overflow-hidden hover:shadow-lg transition-shadow border-2 border-primary/20" data-testid={`card-featured-${post.slug}`}>
            <div className="grid md:grid-cols-2 gap-0">
              {post.image && (
                <div className="bg-muted dark:bg-card">
                  <img
                    src={post.image}
                    alt={post.title}
                    loading="eager"
                    className="w-full h-full object-cover min-h-[250px]"
                    data-testid={`img-featured-${post.slug}`}
                  />
                </div>
              )}
              <div className="p-6 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="default" className="bg-primary text-primary-foreground">
                    <Pin className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                  {post.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-3 text-foreground">
                  <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors" data-testid={`link-featured-${post.slug}`}>
                    {post.title}
                  </Link>
                </h2>
                <p className="text-muted-foreground mb-4 text-lg">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(post.publishDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {post.readTime}
                  </div>
                </div>
                <Link href={`/blog/${post.slug}`}>
                  <Button className="w-fit" data-testid={`button-read-featured-${post.slug}`}>
                    Read the Full Story
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}

        {/* Blog Posts Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.filter(post => !post.pinned).map((post) => (
            <Card key={post.id} className="flex flex-col hover:shadow-lg transition-shadow" data-testid={`card-blog-${post.slug}`}>
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
              <CardHeader>
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" data-testid={`badge-tag-${tag.toLowerCase()}`}>
                      {tag}
                    </Badge>
                  ))}
                </div>
                <CardTitle className="text-xl leading-tight">
                  <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors" data-testid={`link-blog-${post.slug}`}>
                    {post.title}
                  </Link>
                </CardTitle>
                <CardDescription className="mt-2">
                  {post.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1" data-testid={`text-date-${post.slug}`}>
                    <Calendar className="h-4 w-4" />
                    {new Date(post.publishDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                  <div className="flex items-center gap-1" data-testid={`text-readtime-${post.slug}`}>
                    <Clock className="h-4 w-4" />
                    {post.readTime}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/blog/${post.slug}`}>
                  <Button variant="outline" className="w-full" data-testid={`button-read-${post.slug}`}>
                    Read More
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Email Capture */}
        <div className="mt-16 mb-12 max-w-3xl mx-auto">
          <EmailCaptureCard 
            title="Get productivity insights in your inbox"
            description="Subscribe for research-backed strategies, archetype deep-dives, and exclusive tips delivered weekly."
            buttonText="Subscribe Free"
            context="blog-listing"
          />
        </div>

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Link href="/">
            <Button variant="ghost" data-testid="button-back-home">
              ← Back to Home
            </Button>
          </Link>
        </div>
        </div>
      </main>
    </div>
  );
}
