import { useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { SEOHead } from '@/components/seo-head';
import { ArrowLeft, Star } from 'lucide-react';

export default function FounderPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5">
      <SEOHead
        title="Founder Story"
        description="Learn why I built Prolific Personalities - a personal journey from productivity struggle to self-understanding. Discover the story behind the assessment."
        keywords="founder story, productivity journey, prolific personalities origin, about the founder"
      />
      <main id="main-content" role="main">
        <div className="container mx-auto px-4 py-16 max-w-6xl">
          {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" className="mb-8" data-testid="button-back-home">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        {/* Header */}
        <div className="text-center mb-12" aria-labelledby="founder-title">
          <h1 id="founder-title" className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Why I Built Prolific Personalities
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A personal journey from productivity struggle to self-understanding
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Founder Story */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  For most of my life, I've carried big dreams—huge ones. But too often, I found myself stuck in the same painful loop: overthinking, procrastinating, planning instead of doing.
                </p>
                <p>
                  So I did what most people do—I tried to fix it with systems. I bought every planner, tried every app, every method that promised to help me "finally get organized." Some worked for a while, but eventually, they all fell apart.
                </p>
                <p className="font-semibold text-foreground">
                  Then one day, it hit me: it's not that I was broken or lazy—it's that those systems were never made for me.
                </p>
                <p>
                  I started digging into behavioral psychology, cognitive science, and executive function—and what I found changed everything. Real productivity begins with self-understanding.
                </p>
                <p className="italic text-muted-foreground border-l-4 border-primary pl-4">
                  "I thought I was just lazy. Turns out, I just needed to stop forcing myself to work like everyone else."
                </p>
                <p className="font-semibold text-foreground">
                  That's exactly what this project does—to free people from the shame of "not being productive enough" and help them find flow on their own terms.
                </p>
              </div>
            </div>
          </div>

          {/* Social Proof / Testimonials */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-foreground mb-6">What Users Say</h3>
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="flex text-yellow-500"><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /></div>
                    <span className="font-semibold text-foreground">Sarah M.</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold">
                      The Structured Achiever
                    </span>
                  </div>
                  <p className="text-muted-foreground italic">
                    "After discovering I'm a Structured Achiever, I doubled my output in three weeks. The personalized framework actually fits how my brain works."
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="flex text-yellow-500"><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /></div>
                    <span className="font-semibold text-foreground">David K.</span>
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-semibold">
                      The Chaotic Creative
                    </span>
                  </div>
                  <p className="text-muted-foreground italic">
                    "I've tried every productivity system out there. This is the first one that actually understands me instead of forcing me into a generic mold."
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="flex text-yellow-500"><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /></div>
                    <span className="font-semibold text-foreground">Lisa R.</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-semibold">
                      The Strategic Planner
                    </span>
                  </div>
                  <p className="text-muted-foreground italic">
                    "The 4-axis framework helped me understand why time-blocking never worked for me. Now I use strategies that match my natural flow state."
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center bg-white rounded-2xl p-12 shadow-lg">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to discover your productivity archetype?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Take the free assessment and get personalized strategies tailored to how you naturally work.
          </p>
          <Link href="/quiz">
            <Button size="lg" className="gradient-primary text-white px-8 py-4 rounded-xl font-semibold text-lg" data-testid="button-take-quiz">
              Take the Quiz
            </Button>
          </Link>
        </div>
        </div>
      </main>
    </div>
  );
}
