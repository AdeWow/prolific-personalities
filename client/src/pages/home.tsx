import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArchetypeCard } from "@/components/archetype-card";
import { Header } from "@/components/header";
import { SEOHead } from "@/components/seo-head";
import { archetypes } from "@/data/archetypes";
import { Link } from "wouter";
import heroImage from "@assets/adeola2020_an_inclusive_group_of_people_engaged_in_focused_work_d26c58c2-1296-4274-ac46-c7a942411aed_1750379682084.png";
import logoImage from "@assets/Logo5Nobackground_1762407438507.png";

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${window.location.origin}/#organization`,
        "name": "Prolific Personalities",
        "url": window.location.origin,
        "logo": {
          "@type": "ImageObject",
          "url": `${window.location.origin}/og-image.png`
        },
        "description": "Science-backed productivity assessment platform helping people discover their unique working style"
      },
      {
        "@type": "WebSite",
        "@id": `${window.location.origin}/#website`,
        "url": window.location.origin,
        "name": "Prolific Personalities",
        "description": "Discover your productivity archetype through our research-backed assessment",
        "publisher": {
          "@id": `${window.location.origin}/#organization`
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
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "2000"
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-indigo-50">
      <SEOHead
        title="Discover Your Productivity Archetype"
        description="Join 2,000+ achievers using Prolific Personalities to overcome procrastination and thrive. Science-backed strategies personalized to your productivity style. Take the free assessment now."
        keywords="productivity assessment, productivity archetype, time management, procrastination, focus, executive function, working style"
        canonicalUrl={window.location.origin}
        structuredData={structuredData}
      />
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full text-sm font-medium text-primary">
                  <i className="fas fa-sparkles mr-2"></i>
                  Discover Your Productivity Style
                </div>
                <h1 className="text-4xl lg:text-6xl font-bold text-neutral-800 leading-tight">
                  Science-backed strategies, personalized for{" "}
                  <span className="text-gradient">
                    how you work
                  </span>
                </h1>
                <p className="text-xl text-neutral-600 leading-relaxed">
                  Join 2,000+ achievers using Prolific Personalities to overcome procrastination and thrive—with tools and research tailored to your productivity archetype.
                </p>
                <p className="text-lg text-neutral-500 italic">
                  Grounded in peer-reviewed motivation, focus, and executive function research—not generic myths.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/quiz">
                  <Button className="gradient-primary text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
                    <i className="fas fa-play mr-2"></i>
                    Start Assessment
                  </Button>
                </Link>
                <Link href="/archetypes">
                  <Button variant="outline" className="border-2 border-neutral-200 text-neutral-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-primary hover:text-primary transition-colors">
                    <i className="fas fa-info-circle mr-2"></i>
                    Learn More
                  </Button>
                </Link>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-neutral-800">25,847</div>
                  <div className="text-sm text-neutral-600">Assessments Taken</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-neutral-800">4.9</div>
                  <div className="text-sm text-neutral-600">Average Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-neutral-800">6</div>
                  <div className="text-sm text-neutral-600">Unique Archetypes</div>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <img 
                src={heroImage} 
                alt="Diverse group of people engaged in focused, productive work"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-white border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 items-center">
            <div className="text-center space-y-2">
              <div className="text-4xl">🔬</div>
              <h4 className="font-bold text-neutral-800">Research-Backed</h4>
              <p className="text-sm text-neutral-600">Grounded in peer-reviewed psychology</p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl">👥</div>
              <h4 className="font-bold text-neutral-800">2,000+ Users</h4>
              <p className="text-sm text-neutral-600">Validated by real achievers</p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl">🔒</div>
              <h4 className="font-bold text-neutral-800">GDPR Compliant</h4>
              <p className="text-sm text-neutral-600">Your data stays private</p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl">🎯</div>
              <h4 className="font-bold text-neutral-800">Actionable Advice</h4>
              <p className="text-sm text-neutral-600">Powered by real data</p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Story CTA */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-neutral-800 mb-6">
            Why I Built Prolific Personalities
          </h2>
          <p className="text-xl text-neutral-700 mb-8 leading-relaxed">
            For most of my life, I tried every productivity system out there—but they all fell apart. 
            Then I discovered the truth: <span className="font-semibold text-indigo-700">it's not that I was broken, those systems were never made for me.</span>
          </p>
          <Link href="/founder">
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-indigo-600 text-indigo-700 hover:bg-indigo-50 px-8 py-4 rounded-xl font-semibold text-lg"
              data-testid="button-founder-story"
            >
              Read My Story
            </Button>
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-800 mb-4">
              Trusted by Productive People Like You
            </h2>
            <p className="text-xl text-neutral-600">
              See how discovering their archetype transformed their work
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white shadow-lg hover:shadow-xl transition-all" data-testid="testimonial-sarah">
              <CardContent className="p-8">
                <div className="text-yellow-500 mb-4">⭐⭐⭐⭐⭐</div>
                <p className="text-neutral-700 italic mb-6">
                  "After discovering I'm a Structured Achiever, I doubled my output in three weeks. The personalized framework actually fits how my brain works."
                </p>
                <div className="space-y-2">
                  <div className="font-semibold text-neutral-800">Sarah M.</div>
                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                    The Structured Achiever
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg hover:shadow-xl transition-all" data-testid="testimonial-david">
              <CardContent className="p-8">
                <div className="text-yellow-500 mb-4">⭐⭐⭐⭐⭐</div>
                <p className="text-neutral-700 italic mb-6">
                  "I've tried every productivity system out there. This is the first one that actually understands me instead of forcing me into a generic mold."
                </p>
                <div className="space-y-2">
                  <div className="font-semibold text-neutral-800">David K.</div>
                  <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                    The Chaotic Creative
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg hover:shadow-xl transition-all" data-testid="testimonial-lisa">
              <CardContent className="p-8">
                <div className="text-yellow-500 mb-4">⭐⭐⭐⭐⭐</div>
                <p className="text-neutral-700 italic mb-6">
                  "The 4-axis framework helped me understand why time-blocking never worked for me. Now I use strategies that match my natural flow state."
                </p>
                <div className="space-y-2">
                  <div className="font-semibold text-neutral-800">Lisa R.</div>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                    The Strategic Planner
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Archetype Preview */}
      <section className="py-20 bg-gradient-to-br from-neutral-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-800">
              Six Distinct Productivity Archetypes
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Our assessment maps your responses across four key dimensions to reveal your unique productivity personality.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {archetypes.map((archetype) => (
              <ArchetypeCard key={archetype.id} archetype={archetype} clickable={true} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <img src={logoImage} alt="Prolific Personalities Logo" className="w-10 h-10" />
                <h3 className="text-xl font-bold">Prolific Personalities</h3>
              </div>
              <p className="text-neutral-400">
                Overcome procrastination, distraction, and overwhelm through personalized, research-backed productivity strategies.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Assessment</h4>
              <ul className="space-y-2 text-neutral-400">
                <li><Link href="/quiz" className="hover:text-white transition-colors">Take Quiz</Link></li>
                <li><Link href="/archetypes" className="hover:text-white transition-colors">Archetypes</Link></li>
                <li><Link href="/science" className="hover:text-white transition-colors">Science</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-neutral-400">
                <li><Link href="/blog" className="hover:text-white transition-colors" data-testid="link-footer-blog">Blog</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-neutral-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-neutral-700 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral-400">© 2024 Prolific Personalities. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <i className="fab fa-github"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
