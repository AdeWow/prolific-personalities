import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { Card, CardContent } from "@/components/ui/card";
import { SEOHead } from "@/components/seo-head";
import { trackEvent } from "@/lib/analytics";
import { trackLandingView } from "@/lib/posthog";
import { Link } from "wouter";
import { Brain, Target, Zap, Clock, ChevronRight, Users, AlertTriangle, Fingerprint, ClipboardList, BookOpen } from "lucide-react";
import { FooterNewsletter } from "@/components/footer-newsletter";
import { HeroBrainIllustration } from "@/components/hero-brain-illustration";
import { testimonials } from "@/data/testimonials";
import logoImage from "@assets/Logo5Nobackground_1762407438507.png";

export default function Home() {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  useEffect(() => {
    trackLandingView();
  }, []);
  
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${origin}/#organization`,
        "name": "Prolific Personalities",
        "url": origin,
        "logo": {
          "@type": "ImageObject",
          "url": `${origin}/og-image.png`
        },
        "description": "Science-backed productivity assessment platform helping people discover their unique working style"
      },
      {
        "@type": "WebSite",
        "@id": `${origin}/#website`,
        "url": origin,
        "name": "Prolific Personalities",
        "description": "Discover your productivity archetype through our research-backed assessment",
        "publisher": {
          "@id": `${origin}/#organization`
        }
      },
      {
        "@type": "WebApplication",
        "name": "Productivity Archetype Assessment",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Free Productivity Test - Discover Your Work Style in 5 Minutes"
        description="Take our free 5-minute productivity quiz and discover your unique archetype. Get personalized, science-backed strategies matched to how your brain works."
        keywords="productivity test, productivity quiz, free productivity assessment, work style quiz, productivity archetype, time management test, focus assessment, procrastination quiz, executive function test, ADHD productivity"
        canonicalUrl={origin}
        structuredData={structuredData}
      />
      <Header />

      <main id="main-content" role="main">
        {/* Hero Section */}
        <section className="py-20 lg:py-28" aria-labelledby="hero-heading">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="text-center lg:text-left">
                <h1 id="hero-heading" className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                  Work with your brain,{" "}
                  <span className="text-gradient">not against it</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 mb-10">
                  Discover your productivity archetype in 5 minutes. Get personalized strategies that actually work for how you think.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link href="/quiz">
                    <Button
                      className="gradient-primary text-white px-8 py-6 rounded-xl font-semibold text-lg"
                      data-testid="button-start-quiz"
                      onClick={() => trackEvent('hero_cta_click', 'Conversion', 'Take the Quiz')}
                    >
                      Take the Free Quiz
                      <ChevronRight className="ml-2 h-5 w-5" aria-hidden="true" />
                    </Button>
                  </Link>
                  <Link href="/the-research">
                    <Button
                      variant="outline"
                      className="px-8 py-6 rounded-xl font-semibold text-lg"
                      data-testid="button-see-research"
                    >
                      See the Research
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="flex justify-center lg:justify-end">
                <HeroBrainIllustration />
              </div>
            </div>
          </div>
        </section>

        {/* Problem → Solution Bridge */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-foreground text-center mb-4">
              Most productivity advice ignores how you actually think
            </h2>
            <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-14">
              That's why it hasn't worked — yet.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-0 shadow-sm bg-white border-t-4 border-t-rose-400">
                <CardContent className="p-8">
                  <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center mb-5">
                    <Users className="h-6 w-6 text-rose-500" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    One-size-fits-all doesn't work
                  </h3>
                  <p className="text-muted-foreground text-base leading-relaxed">
                    Generic productivity systems assume everyone's brain works the same way. Research shows personality traits moderate intervention effectiveness by 27–42%.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm bg-white border-t-4 border-t-amber-400">
                <CardContent className="p-8">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mb-5">
                    <AlertTriangle className="h-6 w-6 text-amber-500" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    You're not broken, you're mismatched
                  </h3>
                  <p className="text-muted-foreground text-base leading-relaxed">
                    When a system doesn't fit your cognitive style, it feels like a personal failure. It's not. It's a design failure.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm bg-white border-t-4 border-t-primary">
                <CardContent className="p-8">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                    <Fingerprint className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    Personalization changes everything
                  </h3>
                  <p className="text-muted-foreground text-base leading-relaxed">
                    Our 4-axis assessment identifies your unique productivity archetype and matches you with strategies that work WITH your brain — not against it.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="py-24">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Why this works
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Generic productivity advice fails because it ignores how you actually think and work.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-0 shadow-sm bg-white">
                <CardContent className="p-8">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                    <Brain className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    Understand your patterns
                  </h3>
                  <p className="text-muted-foreground text-base leading-relaxed">
                    Learn why you start, stall, and finish work the way you do.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm bg-white">
                <CardContent className="p-8">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                    <Target className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    Get matched strategies
                  </h3>
                  <p className="text-muted-foreground text-base leading-relaxed">
                    Receive tactics designed for your specific working style.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm bg-white">
                <CardContent className="p-8">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                    <Zap className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    Take action today
                  </h3>
                  <p className="text-muted-foreground text-base leading-relaxed">
                    Start with simple changes that fit how your brain works.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 bg-muted/30">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                How it works
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center">
                <ClipboardList className="h-8 w-8 text-primary mx-auto mb-4" aria-hidden="true" />
                <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-6 text-xl font-semibold">
                  1
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Answer 28 questions
                </h3>
                <p className="text-muted-foreground text-base">
                  Takes about 5 minutes. No email required.
                </p>
              </div>

              <div className="text-center">
                <Fingerprint className="h-8 w-8 text-primary mx-auto mb-4" aria-hidden="true" />
                <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-6 text-xl font-semibold">
                  2
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Get your archetype
                </h3>
                <p className="text-muted-foreground text-base">
                  Discover which archetype matches your style.
                </p>
              </div>

              <div className="text-center">
                <BookOpen className="h-8 w-8 text-primary mx-auto mb-4" aria-hidden="true" />
                <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-6 text-xl font-semibold">
                  3
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Apply your strategies
                </h3>
                <p className="text-muted-foreground text-base">
                  Use personalized tactics designed for you.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Research Credibility Stats */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-2xl font-bold text-foreground">35+</p>
                <p className="text-sm text-muted-foreground mt-1">Peer-reviewed studies</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">7</p>
                <p className="text-sm text-muted-foreground mt-1">Distinct productivity archetypes</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">82,000+</p>
                <p className="text-sm text-muted-foreground mt-1">Words of personalized guidance</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">4-axis</p>
                <p className="text-sm text-muted-foreground mt-1">Psychological framework</p>
              </div>
            </div>
          </div>
        </section>

        {/* User Quotes */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-3xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((t) => (
                <div key={t.name} className="border-l-2 border-primary pl-6">
                  <p className="text-base italic text-foreground leading-relaxed">
                    "{t.quote}"
                  </p>
                  <p className="text-sm text-muted-foreground mt-3">— {t.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-6 text-muted-foreground text-base">
              <Clock className="h-5 w-5" aria-hidden="true" />
              <span>5 minutes • Free • Instant results</span>
            </div>
            
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to work smarter?
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-lg mx-auto">
              Join thousands who've discovered their productivity archetype and started working with their brain, not against it.
            </p>
            
            <Link href="/quiz">
              <Button 
                className="gradient-primary text-white px-10 py-6 rounded-xl font-semibold text-lg"
                data-testid="button-final-cta"
                onClick={() => trackEvent('final_cta_click', 'Conversion', 'Take the Quiz')}
              >
                Take the Free Quiz
                <ChevronRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </Button>
            </Link>
            
            <p className="text-muted-foreground text-base mt-6">
              No signup required. Your answers stay private.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-foreground text-white py-16">
          <div className="max-w-5xl mx-auto px-6">
            <FooterNewsletter variant="dark" />
            <div className="border-b border-white/20 pb-8 mb-8" />
            <div className="grid md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <img src={logoImage} alt="Prolific Personalities Logo" className="w-10 h-10" />
                  <span className="text-lg font-semibold">Prolific Personalities</span>
                </div>
                <p className="text-gray-400 text-base">
                  Science-backed strategies for how you work best.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4 text-base">Assessment</h4>
                <ul className="space-y-3 text-gray-400 text-base">
                  <li><Link href="/quiz" className="hover:text-white transition-colors">Take Quiz</Link></li>
                  <li><Link href="/archetypes" className="hover:text-white transition-colors">Archetypes</Link></li>
                  <li><Link href="/the-research" className="hover:text-white transition-colors">Research</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4 text-base">Resources</h4>
                <ul className="space-y-3 text-gray-400 text-base">
                  <li><Link href="/blog" className="hover:text-white transition-colors" data-testid="link-footer-blog">Blog</Link></li>
                  <li><Link href="/resources" className="hover:text-white transition-colors">Tools</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4 text-base">Company</h4>
                <ul className="space-y-3 text-gray-400 text-base">
                  <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                  <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                  <li><Link href="/feedback" className="hover:text-white transition-colors">Feedback</Link></li>
                  <li><Link href="/refund-policy" className="hover:text-white transition-colors" data-testid="link-footer-refund">Refund Policy</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-white/20 pt-8 mt-12 text-center text-gray-400 text-base">
              <p>© {new Date().getFullYear()} Prolific Personalities. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
