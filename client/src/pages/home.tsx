import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArchetypeCard } from "@/components/archetype-card";
import { Header } from "@/components/header";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SEOHead } from "@/components/seo-head";
import { archetypes } from "@/data/archetypes";
import { User, Shield, FlaskConical } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { trackLandingView, trackQuizStart } from "@/lib/posthog";
import { Link } from "wouter";
import quizHeroImage from "@assets/HomePage_laptop_quiz_taking_1765660797490.png";
import logoImage from "@assets/Logo5Nobackground_1762407438507.png";

export default function Home() {
  const [previewAnswer, setPreviewAnswer] = useState<number | null>(null);
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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <SEOHead
        title="Discover Your Productivity Archetype"
        description="Discover your productivity archetype with Prolific Personalities. Science-backed strategies personalized to your working style. Take the free 5-minute assessment now."
        keywords="productivity assessment, productivity archetype, time management, procrastination, focus, executive function, working style"
        canonicalUrl={origin}
        structuredData={structuredData}
      />
      <Header />

      {/* Main Content - 508 Compliance */}
      <main id="main-content" role="main">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden" aria-labelledby="hero-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 id="hero-heading" className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                  Stop fighting your brain.{" "}
                  <span className="text-gradient">
                    Start working with it.
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  You're not lazy—you just need strategies that match how your brain works. Take our 5-minute assessment to find your productivity archetype.
                </p>
              </div>
              
              <Link href="/quiz">
                <Button 
                  className="gradient-primary text-white px-8 py-6 rounded-xl font-semibold text-lg shadow-lg"
                  data-testid="button-start-quiz"
                  onClick={() => trackEvent('hero_cta_click', 'Conversion', 'Take the Quiz')}
                >
                  Take the Free Quiz
                </Button>
              </Link>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <img 
                src={quizHeroImage} 
                alt="Person taking the productivity archetype quiz on laptop"
                className="w-full h-auto rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Discover */}
      <section className="py-12 bg-white border-y border-muted">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-foreground text-center mb-8">What You'll Discover</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4">
              <span className="text-primary mt-1">✓</span>
              <p className="text-muted-foreground">Why productivity systems that work for others quietly fail you</p>
            </div>
            <div className="flex items-start gap-3 p-4">
              <span className="text-primary mt-1">✓</span>
              <p className="text-muted-foreground">The hidden pattern behind how you start, stall, and finish work</p>
            </div>
            <div className="flex items-start gap-3 p-4">
              <span className="text-primary mt-1">✓</span>
              <p className="text-muted-foreground">What kind of structure energizes you — and what drains you fast</p>
            </div>
            <div className="flex items-start gap-3 p-4">
              <span className="text-primary mt-1">✓</span>
              <p className="text-muted-foreground">The productivity archetype that shapes how you work at your best</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Quiz Preview */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Try the first question
            </h2>
            <p className="text-muted-foreground">
              5 minutes to discover your archetype
            </p>
          </div>
          
          {/* Interactive First Question */}
          <Card className="bg-white shadow-lg border-0 overflow-hidden mb-8">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-primary">Question 1 of 28</span>
                <span className="text-sm text-muted-foreground">5 min total</span>
              </div>
              
              <h3 className="text-xl font-medium text-foreground mb-6">
                I feel most productive when my day follows a predictable routine.
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between text-xs sm:text-sm text-muted-foreground px-1">
                  <span>Strongly Disagree</span>
                  <span className="hidden sm:inline">Neutral</span>
                  <span>Strongly Agree</span>
                </div>
                <RadioGroup
                  value={previewAnswer?.toString() || ''}
                  onValueChange={(val) => setPreviewAnswer(parseInt(val))}
                  className="flex justify-between gap-2"
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <div key={num} className="flex-1">
                      <RadioGroupItem
                        value={num.toString()}
                        id={`preview-likert-${num}`}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={`preview-likert-${num}`}
                        data-testid={`preview-option-${num}`}
                        className={cn(
                          "flex items-center justify-center cursor-pointer py-3 sm:py-4 rounded-xl border-2 text-base sm:text-lg font-semibold transition-all",
                          "hover:scale-105 active:scale-95",
                          previewAnswer === num
                            ? "border-primary bg-primary text-white shadow-lg"
                            : "border-muted bg-white text-muted-foreground hover:border-primary/60 hover:bg-primary/5"
                        )}
                      >
                        {num}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Link href="/quiz">
              <Button 
                className={cn(
                  "px-10 py-6 rounded-xl font-semibold text-xl transition-all duration-200",
                  previewAnswer 
                    ? "gradient-primary text-white hover:shadow-lg transform hover:-translate-y-0.5" 
                    : "bg-muted text-muted-foreground"
                )}
                data-testid="button-continue-quiz"
              >
                {previewAnswer ? (
                  <>
                    Continue Quiz
                    <ChevronRight className="ml-2 h-5 w-5 inline" />
                  </>
                ) : (
                  "Select an answer to continue"
                )}
              </Button>
            </Link>
            <p className="text-muted-foreground mt-4 text-sm">
              27 more questions • Free • Instant results
            </p>
          </div>
        </div>
      </section>

      {/* Intro Video */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              Why This Works (2 min)
            </h2>
          </div>
          <div 
            className="aspect-video rounded-xl shadow-lg overflow-hidden"
            onClick={() => trackEvent('video_play', 'Engagement', 'Intro Video')}
          >
            <iframe
              src="https://www.youtube.com/embed/ukFjVt1YjPM?rel=0&enablejsapi=1"
              title="Prolific Personalities Introduction"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
              data-testid="video-intro"
            />
          </div>
        </div>
      </section>

      {/* Built By a Real Person */}
      <section className="py-16 bg-muted">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <User className="w-10 h-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Built by a Real Person</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Not a faceless corporation. Created by someone who struggled with the same problems.
                </p>
                <Link href="/founder" className="text-primary hover:text-primary/80 text-sm font-medium" data-testid="link-meet-founder">
                  Meet the founder →
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <Shield className="w-10 h-10 text-teal-600 mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Privacy Promise</h3>
                <p className="text-muted-foreground text-sm">
                  Your answers stay private. No email required to see your results. No spam, ever.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <FlaskConical className="w-10 h-10 text-accent mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Research-Based</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Built on Executive Function Theory, Self-Determination Theory, and flow research.
                </p>
                <Link href="/science" className="text-primary hover:text-primary/80 text-sm font-medium" data-testid="link-see-science">
                  See the science →
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What You'll Get - Concrete Deliverables */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground text-center mb-8">
            Your Free Results Include
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4">
              <span className="text-primary">✓</span>
              <p className="text-muted-foreground">Your productivity archetype with personalized strategies</p>
            </div>
            <div className="flex items-start gap-3 p-4">
              <span className="text-primary">✓</span>
              <p className="text-muted-foreground">Your top 3 productivity blockers and how to overcome them</p>
            </div>
            <div className="flex items-start gap-3 p-4">
              <span className="text-primary">✓</span>
              <p className="text-muted-foreground">Starter strategies you can implement today</p>
            </div>
            <div className="flex items-start gap-3 p-4">
              <span className="text-primary">✓</span>
              <p className="text-muted-foreground">Tool recommendations matched to your working style</p>
            </div>
          </div>
        </div>
      </section>

      {/* Archetype Preview */}
      <section className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              The Six Archetypes
            </h2>
            <p className="text-muted-foreground">
              Which one describes how you work?
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {archetypes
              .filter((archetype) => archetype.id !== 'adaptive-generalist')
              .map((archetype) => (
                <ArchetypeCard key={archetype.id} archetype={archetype} clickable={true} />
              ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <img src={logoImage} alt="Prolific Personalities Logo" className="w-10 h-10" />
                <h3 className="text-xl font-bold">Prolific Personalities</h3>
              </div>
              <p className="text-muted-foreground">
                Science-backed strategies for how you work best.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Assessment</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/quiz" className="hover:text-white transition-colors">Take Quiz</Link></li>
                <li><Link href="/archetypes" className="hover:text-white transition-colors">Archetypes</Link></li>
                <li><Link href="/science" className="hover:text-white transition-colors">Science</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/blog" className="hover:text-white transition-colors" data-testid="link-footer-blog">Blog</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><Link href="/refund-policy" className="hover:text-white transition-colors" data-testid="link-footer-refund">Refund Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-muted-foreground pt-8 mt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground">© 2024 Prolific Personalities. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-muted-foreground hover:text-white transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-muted-foreground hover:text-white transition-colors">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="#" className="text-muted-foreground hover:text-white transition-colors">
                <i className="fab fa-github"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>
      </main>
    </div>
  );
}
