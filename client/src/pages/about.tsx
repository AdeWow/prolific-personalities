import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import logoImage from "@assets/Logo_1762241139576.png";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <img src={logoImage} alt="Prolific Personalities Logo" className="w-10 h-10" />
              <h1 className="text-xl font-bold text-neutral-800">Prolific Personalities</h1>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-neutral-600 hover:text-primary transition-colors">Home</Link>
              <Link href="/quiz" className="text-neutral-600 hover:text-primary transition-colors">Take Quiz</Link>
              <a href="#contact" className="text-neutral-600 hover:text-primary transition-colors">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary/10 to-secondary/10 border-0 text-primary font-semibold">
              <i className="fas fa-info-circle mr-2"></i>
              About Us
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-neutral-800">
              About <span className="text-gradient">Prolific Personalities</span>
            </h2>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Why We Exist */}
          <Card className="bg-white shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-neutral-800 mb-6">Why We Exist</h3>
              <p className="text-lg text-neutral-700 leading-relaxed mb-4">
                Prolific Personalities was created to solve a common but frustrating problem: most productivity advice fails because it's generic. It assumes everyone is wired the same way—when in reality, people vary widely in how they think, focus, and stay motivated.
              </p>
              <p className="text-lg text-neutral-700 leading-relaxed">
                This platform is built on the belief that productivity becomes sustainable only when it's personalized. By understanding your personality, cognitive patterns, and behavioral tendencies, we help you identify what actually works for you.
              </p>
            </CardContent>
          </Card>

          {/* Our Mission */}
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20 shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-neutral-800 mb-6">Our Mission</h3>
              <p className="text-lg text-neutral-700 leading-relaxed mb-4">
                To help people overcome procrastination, distraction, and overwhelm through personalized, research-backed productivity strategies.
              </p>
              <p className="text-lg text-neutral-700 leading-relaxed">
                We don't just give you tips. We give you a framework that's designed for how your brain works—then connect you to tools and tactics that align with your unique style.
              </p>
            </CardContent>
          </Card>

          {/* What Makes Us Different */}
          <Card className="bg-white shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-neutral-800 mb-8">What Makes Us Different</h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-user text-primary"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-neutral-800 mb-2">Personality-first approach</h4>
                      <p className="text-neutral-700">We assess your patterns through a short but insightful quiz, then map you to one of six productivity archetypes with tailored insights.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-flask text-primary"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-neutral-800 mb-2">Backed by behavioral science</h4>
                      <p className="text-neutral-700">We draw from executive function theory, cognitive load theory, and motivation science to build recommendations that reflect how people actually work.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-rocket text-primary"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-neutral-800 mb-2">Actionable over aspirational</h4>
                      <p className="text-neutral-700">Instead of vague advice or unrealistic habits, we provide clear next steps, customized tools, and systems you can actually follow through on.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-heart text-primary"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-neutral-800 mb-2">Designed for real humans</h4>
                      <p className="text-neutral-700">This platform is especially valuable for people who are neurodivergent, multi-passionate, or simply tired of trying productivity systems that don't stick.</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Who It's For */}
          <Card className="bg-white shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-neutral-800 mb-6">Who It's For</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  "Creatives who struggle to stay focused and organized",
                  "Professionals who are highly driven but easily overwhelmed", 
                  "People with ADHD or executive dysfunction",
                  "High-achievers battling burnout",
                  "Anyone who wants to get more done in a way that feels natural and sustainable"
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-neutral-50 rounded-xl">
                    <i className="fas fa-check-circle text-green-500 mt-1"></i>
                    <span className="text-neutral-700">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* The Research Behind It */}
          <Card className="bg-white shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-neutral-800 mb-6">The Research Behind It</h3>
              <p className="text-lg text-neutral-700 leading-relaxed mb-6">
                Prolific Personalities is grounded in behavioral psychology and cognitive science. Our models and quiz system reference:
              </p>
              <div className="space-y-3">
                {[
                  "Executive Function theory (e.g., Barkley, Dawson & Guare)",
                  "Cognitive Load Theory",
                  "Self-Determination Theory (Deci & Ryan)",
                  "Productivity research by authors like Cal Newport, Nir Eyal, and James Clear"
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <i className="fas fa-book text-primary"></i>
                    <span className="text-neutral-700">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* What's Next */}
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20 shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-neutral-800 mb-6">What's Next</h3>
              <p className="text-lg text-neutral-700 leading-relaxed mb-6">We're actively building:</p>
              <div className="space-y-3 mb-8">
                {[
                  "A personalization engine that adapts to your usage and behavior over time",
                  "A tool recommendation system that evolves with your needs",
                  "AI-powered focus assistants and thought organization tools",
                  "More resources and frameworks to help you follow through on your goals"
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <i className="fas fa-arrow-right text-primary mt-1"></i>
                    <span className="text-neutral-700">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Stay Connected */}
          <Card className="bg-white shadow-lg">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-neutral-800 mb-4">Stay Connected</h3>
              <p className="text-lg text-neutral-700 leading-relaxed mb-8">
                If you're interested in testing new features, joining our newsletter, or offering feedback, we'd love to hear from you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/quiz">
                  <Button className="gradient-primary text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
                    <i className="fas fa-play mr-2"></i>
                    Take the Assessment
                  </Button>
                </Link>
                <Button variant="outline" className="border-2 border-neutral-200 text-neutral-700 px-8 py-3 rounded-xl font-semibold hover:border-primary hover:text-primary transition-colors">
                  <i className="fas fa-envelope mr-2"></i>
                  Contact Us
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}