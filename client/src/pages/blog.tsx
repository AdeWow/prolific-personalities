import { Link } from 'wouter';
import { blogPosts } from '@/data/blog-posts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Header } from '@/components/header';
import { SEOHead } from '@/components/seo-head';
import { EmailCaptureCard } from '@/components/email-capture-card';
import { Calendar, Clock } from 'lucide-react';

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <SEOHead
        title="Productivity Insights Blog"
        description="Research-backed productivity strategies, tips, and insights to help you work smarter. Discover articles tailored to your unique working style."
        keywords="productivity blog, productivity tips, time management, focus strategies, work efficiency, productivity research"
      />
      <Header />
      
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            Productivity Insights
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Research-backed strategies and insights to help you work with your natural productivity style
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Card key={post.id} className="flex flex-col hover:shadow-lg transition-shadow" data-testid={`card-blog-${post.slug}`}>
              {post.image && (
                <AspectRatio ratio={16 / 9} className="bg-gray-100 dark:bg-gray-800">
                  <img
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                    className="w-full h-full object-cover rounded-t-lg"
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
                  <Link href={`/blog/${post.slug}`}>
                    <a className="hover:text-primary transition-colors" data-testid={`link-blog-${post.slug}`}>
                      {post.title}
                    </a>
                  </Link>
                </CardTitle>
                <CardDescription className="mt-2">
                  {post.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
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
    </div>
  );
}
