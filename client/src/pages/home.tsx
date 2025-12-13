import { Button } from "@/components/ui/button";
import { ArchetypeCard } from "@/components/archetype-card";
import { QuizContainer } from "@/components/quiz-container";
import { Header } from "@/components/header";
import { SEOHead } from "@/components/seo-head";
import { TestimonialsSection } from "@/components/testimonials-section";
import { archetypes } from "@/data/archetypes";
import { Link } from "wouter";
import heroImage from "@assets/adeola2020_an_inclusive_group_of_people_engaged_in_focused_work_d26c58c2-1296-4274-ac46-c7a942411aed_1750379682084.png";
import humanImage from "@assets/stock_images/person_smiling_while_2501deb3.jpg";
import logoImage from "@assets/Logo5Nobackground_1762407438507.png";

export default function Home() {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  
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
        canonicalUrl={origin}
        structuredData={structuredData}
      />
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold text-neutral-800 leading-tight">
                  Stop fighting your brain.{" "}
                  <span className="text-gradient">
                    Start working with it.
                  </span>
                </h1>
                <p className="text-xl text-neutral-700 leading-relaxed">
                  Some days you're unstoppable. Other days, even small tasks feel overwhelming. You've blamed yourself for years.
                </p>
                <p className="text-2xl font-semibold text-indigo-700">
                  You're not lazy. You're not broken. You just need a different approach.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/quiz">
                  <Button 
                    className="gradient-primary text-white px-8 py-6 rounded-xl font-semibold text-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                    data-testid="button-start-quiz"
                  >
                    Discover Your Archetype
                  </Button>
                </Link>
                <Link href="/archetypes">
                  <Button 
                    variant="outline" 
                    className="border-2 border-neutral-300 text-neutral-700 px-8 py-6 rounded-xl font-semibold text-xl hover:border-primary hover:text-primary transition-colors"
                    data-testid="button-learn-more"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <img 
                src={humanImage} 
                alt="Person working productively with a smile"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-white border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="text-center space-y-2">
              <div className="text-5xl">🔬</div>
              <h4 className="font-bold text-neutral-800 text-lg">Research-Backed</h4>
              <p className="text-neutral-600">Science, not myths</p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-5xl">🔒</div>
              <h4 className="font-bold text-neutral-800 text-lg">Private & Secure</h4>
              <p className="text-neutral-600">Your data stays yours</p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-5xl">🎯</div>
              <h4 className="font-bold text-neutral-800 text-lg">Actionable Results</h4>
              <p className="text-neutral-600">Real strategies, not fluff</p>
            </div>
          </div>
        </div>
      </section>

      {/* Full Quiz Embedded */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-800 mb-4">
              Ready to discover your archetype?
            </h2>
            <p className="text-xl text-neutral-600">
              Take the full assessment now • 28 questions • 5 minutes
            </p>
          </div>
          <QuizContainer showHeader={false} showFocusIndicator={true} />
        </div>
      </section>

      {/* Intro Video */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-800 mb-4">
              Watch: Why This Works
            </h2>
            <p className="text-xl text-neutral-600">
              Learn how understanding your productivity style changes everything
            </p>
          </div>
          <div className="aspect-video rounded-2xl shadow-2xl overflow-hidden">
            <iframe
              src="https://www.youtube.com/embed/ukFjVt1YjPM?rel=0"
              title="Prolific Personalities Introduction"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
              data-testid="video-intro"
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection variant="full" />

      {/* Archetype Preview */}
      <section className="py-20 bg-gradient-to-br from-neutral-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-800">
              Six Productivity Archetypes
            </h2>
            <p className="text-xl text-neutral-600">
              Which one are you?
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {archetypes
              .filter((archetype) => archetype.id !== 'adaptive-generalist')
              .map((archetype) => (
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
                Science-backed strategies for how you work best.
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
                <li><Link href="/refund-policy" className="hover:text-white transition-colors" data-testid="link-footer-refund">Refund Policy</Link></li>
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
