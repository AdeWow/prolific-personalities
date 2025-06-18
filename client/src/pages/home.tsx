import { Button } from "@/components/ui/button";
import { ArchetypeCard } from "@/components/archetype-card";
import { archetypes } from "@/data/archetypes";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                <i className="fas fa-brain text-white text-lg"></i>
              </div>
              <h1 className="text-xl font-bold text-neutral-800">Prolific Personalities</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#about" className="text-neutral-600 hover:text-primary transition-colors">About</a>
              <Link href="/quiz" className="text-neutral-600 hover:text-primary transition-colors">Take Quiz</Link>
              <a href="#results" className="text-neutral-600 hover:text-primary transition-colors">Results</a>
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
                  Unlock Your{" "}
                  <span className="text-gradient">
                    Productivity
                  </span>{" "}
                  Potential
                </h1>
                <p className="text-xl text-neutral-600 leading-relaxed">
                  Take our scientifically-backed assessment to discover your unique productivity archetype and get personalized strategies for peak performance.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/quiz">
                  <Button className="gradient-primary text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
                    <i className="fas fa-play mr-2"></i>
                    Start Assessment
                  </Button>
                </Link>
                <Button variant="outline" className="border-2 border-neutral-200 text-neutral-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-primary hover:text-primary transition-colors">
                  <i className="fas fa-info-circle mr-2"></i>
                  Learn More
                </Button>
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

            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="Modern productive workspace" 
                className="rounded-2xl shadow-2xl w-full" 
              />
              
              <div className="absolute -top-4 -left-4 bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <i className="fas fa-check text-white text-sm"></i>
                  </div>
                  <div>
                    <div className="font-semibold text-neutral-800">Progress Tracker</div>
                    <div className="text-sm text-neutral-600">Stay on track</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <i className="fas fa-chart-line text-white text-sm"></i>
                  </div>
                  <div>
                    <div className="font-semibold text-neutral-800">Insights</div>
                    <div className="text-sm text-neutral-600">Personalized tips</div>
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
              <ArchetypeCard key={archetype.id} archetype={archetype} />
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
                Discover your productivity potential with scientifically-backed assessments and personalized insights.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Assessment</h4>
              <ul className="space-y-2 text-neutral-400">
                <li><Link href="/quiz" className="hover:text-white transition-colors">Take Quiz</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Archetypes</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Science</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-neutral-400">
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Research</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-neutral-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
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
