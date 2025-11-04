import { Button } from "@/components/ui/button";
import { ArchetypeCard } from "@/components/archetype-card";
import { archetypes } from "@/data/archetypes";
import { Link } from "wouter";
import heroImage from "@assets/adeola2020_an_inclusive_group_of_people_engaged_in_focused_work_d26c58c2-1296-4274-ac46-c7a942411aed_1750379682084.png";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                <i className="fas fa-brain text-white text-lg"></i>
              </div>
              <h1 className="text-xl font-bold text-neutral-800">Prolific Personalities</h1>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/about" className="text-neutral-600 hover:text-primary transition-colors">About</Link>
              <Link href="/blog" className="text-neutral-600 hover:text-primary transition-colors" data-testid="link-blog">Blog</Link>
              <Link href="/quiz" className="text-neutral-600 hover:text-primary transition-colors">Take Quiz</Link>
              <a href="#contact" className="text-neutral-600 hover:text-primary transition-colors">Contact</a>
            </nav>
          </div>
        </div>
      </header>

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

      {/* Founder Story & Social Proof */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-800 mb-4">
              Why I Built Prolific Personalities
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Founder Story */}
            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
                <div className="space-y-4 text-neutral-700 leading-relaxed">
                  <p>
                    For most of my life, I've carried big dreams—huge ones. But too often, I found myself stuck in the same painful loop: overthinking, procrastinating, planning instead of doing.
                  </p>
                  <p>
                    So I did what most people do—I tried to fix it with systems. I bought every planner, tried every app, every method that promised to help me "finally get organized." Some worked for a while, but eventually, they all fell apart.
                  </p>
                  <p className="font-semibold text-neutral-800">
                    Then one day, it hit me: it's not that I was broken or lazy—it's that those systems were never made for me.
                  </p>
                  <p>
                    I started digging into behavioral psychology, cognitive science, and executive function—and what I found changed everything. Real productivity begins with self-understanding.
                  </p>
                  <p className="italic text-neutral-600 border-l-4 border-indigo-500 pl-4">
                    "I thought I was just lazy. Turns out, I just needed to stop forcing myself to work like everyone else."
                  </p>
                  <p className="font-semibold text-neutral-800">
                    That's exactly what this project does—to free people from the shame of "not being productive enough" and help them find flow on their own terms.
                  </p>
                </div>
              </div>
            </div>

            {/* Social Proof / Testimonials */}
            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-neutral-800 mb-6">What Users Say</h3>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className="text-yellow-500">⭐⭐⭐⭐⭐</div>
                      <span className="font-semibold text-neutral-800">Sarah M.</span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-semibold">
                        The Integrator
                      </span>
                    </div>
                    <p className="text-neutral-700 italic">
                      "After discovering I'm an Integrator, I doubled my output in three weeks. The personalized framework actually fits how my brain works."
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className="text-yellow-500">⭐⭐⭐⭐⭐</div>
                      <span className="font-semibold text-neutral-800">David K.</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold">
                        The Executor
                      </span>
                    </div>
                    <p className="text-neutral-700 italic">
                      "I've tried every productivity system out there. This is the first one that actually understands me instead of forcing me into a generic mold."
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className="text-yellow-500">⭐⭐⭐⭐⭐</div>
                      <span className="font-semibold text-neutral-800">Lisa R.</span>
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-semibold">
                        The Visionary
                      </span>
                    </div>
                    <p className="text-neutral-700 italic">
                      "The 4-axis framework helped me understand why time-blocking never worked for me. Now I use strategies that match my natural flow state."
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 shadow-lg text-white">
                <h3 className="text-2xl font-bold mb-6">Validated Results</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-4xl font-bold">500+</div>
                    <div className="text-indigo-100">Quiz Completions</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold">40%</div>
                    <div className="text-indigo-100">Productivity Increase</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold">4.9/5</div>
                    <div className="text-indigo-100">User Rating</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold">2 weeks</div>
                    <div className="text-indigo-100">To See Results</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Archetype Preview */}
      <section className="py-20 bg-white">
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
                <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                  <i className="fas fa-brain text-white text-lg"></i>
                </div>
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
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
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
