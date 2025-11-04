import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";
import { SEOHead } from "@/components/seo-head";
import { CheckCircle2, Sparkles, Lock, Zap } from "lucide-react";

export default function Pricing() {
  const features = {
    free: [
      "Complete 28-question productivity assessment",
      "Your unique productivity archetype",
      "4-axis score visualization",
      "Top 10 tool recommendations",
      "Core strategies and insights",
      "Email results to yourself",
    ],
    premium: [
      "Everything in Free, plus:",
      "Deep-dive archetype analysis (10+ pages)",
      "Personalized 90-day action plan",
      "Week-by-week implementation roadmap",
      "20+ tool recommendations with setup guides",
      "Custom productivity framework",
      "Habit-building templates",
      "Email follow-up sequences",
      "Priority support",
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-indigo-50">
      <SEOHead
        title="Pricing - Free Assessment & Premium Report"
        description="Start with a free productivity assessment. Upgrade to Premium ($27 one-time) for your complete transformation guide with personalized strategies, 90-day action plan, and tool recommendations."
        keywords="productivity assessment pricing, premium report, productivity tools, time management, personalized strategies"
        canonicalUrl={`${window.location.origin}/pricing`}
      />
      <Header />

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full text-sm font-medium text-primary mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            Choose Your Plan
          </Badge>
          
          <h1 className="text-4xl lg:text-5xl font-bold text-neutral-800 mb-6">
            Start Free. Upgrade When Ready.
          </h1>
          
          <p className="text-xl text-neutral-600 leading-relaxed max-w-2xl mx-auto">
            Get instant insights for free. Unlock your complete productivity blueprint with Premium.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <Card className="bg-white shadow-lg border-2 border-neutral-200 hover:border-primary transition-all duration-300" data-testid="card-free-plan">
              <CardContent className="p-8">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-neutral-800 mb-2">Free Assessment</h3>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-5xl font-bold text-neutral-800">$0</span>
                  </div>
                  <p className="text-neutral-600">Perfect for discovering your archetype</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {features.free.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-neutral-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/quiz">
                  <Button className="w-full gradient-primary text-white py-6 text-lg font-semibold hover:shadow-lg transition-all" data-testid="button-start-free">
                    Start Free Assessment
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 shadow-xl border-4 border-primary relative overflow-hidden" data-testid="card-premium-plan">
              {/* Popular Badge */}
              <div className="absolute top-0 right-0 bg-gradient-to-r from-primary to-purple-600 text-white px-6 py-2 text-sm font-semibold">
                Most Popular
              </div>

              <CardContent className="p-8 pt-12">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="w-6 h-6 text-primary" />
                    <h3 className="text-2xl font-bold text-neutral-800">Premium Report</h3>
                  </div>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-5xl font-bold text-neutral-800">$27</span>
                    <span className="text-neutral-600">one-time</span>
                  </div>
                  <p className="text-neutral-700 font-medium">Your complete productivity transformation</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {features.premium.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Zap className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-neutral-700 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/quiz">
                  <Button className="w-full gradient-primary text-white py-6 text-lg font-semibold hover:shadow-lg transition-all" data-testid="button-upgrade-premium">
                    <Lock className="w-5 h-5 mr-2" />
                    Start with Free Assessment
                  </Button>
                </Link>

                <p className="text-sm text-neutral-600 text-center mt-4">
                  Take the free assessment first, then upgrade for the full report
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-16 bg-white/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-800 text-center mb-12">
            Why Upgrade to Premium?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-neutral-800 mb-2">Actionable Plans</h3>
              <p className="text-neutral-600">
                Not just theory—get week-by-week implementation guides tailored to your archetype
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-neutral-800 mb-2">Faster Results</h3>
              <p className="text-neutral-600">
                Skip months of trial and error with proven strategies for your specific working style
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔧</span>
              </div>
              <h3 className="text-xl font-bold text-neutral-800 mb-2">Tool Mastery</h3>
              <p className="text-neutral-600">
                Complete setup guides for 20+ productivity tools matched to how you actually work
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-800 text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <Card className="bg-white shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-bold text-neutral-800 mb-2">Do I have to pay upfront?</h3>
                <p className="text-neutral-600">
                  No! Start with the free assessment. You'll get your archetype and core insights immediately. 
                  Upgrade to Premium only if you want the complete implementation plan.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-bold text-neutral-800 mb-2">What's included in the Premium report?</h3>
                <p className="text-neutral-600">
                  A comprehensive 10+ page PDF with your complete archetype analysis, 90-day action plan, 
                  personalized productivity framework, habit templates, and detailed tool recommendations with setup guides.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-bold text-neutral-800 mb-2">Is this based on real science?</h3>
                <p className="text-neutral-600">
                  Yes! Our framework is grounded in peer-reviewed research on executive function, motivation theory, 
                  flow states, and cognitive psychology. Learn more on our <Link href="/science" className="text-primary hover:underline">Science page</Link>.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-bold text-neutral-800 mb-2">Can I take the assessment multiple times?</h3>
                <p className="text-neutral-600">
                  Absolutely! Your productivity style can evolve. We recommend retaking the assessment every 6-12 months 
                  or when your work environment changes significantly.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-purple-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-neutral-800 mb-6">
            Ready to discover your productivity archetype?
          </h2>
          <p className="text-xl text-neutral-600 mb-8">
            Start with the free assessment. Upgrade anytime for the full transformation.
          </p>
          <Link href="/quiz">
            <Button className="gradient-primary text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200" data-testid="button-cta-quiz">
              <Sparkles className="w-5 h-5 mr-2" />
              Take Free Assessment Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-neutral-600">
            <p className="mb-4">© 2025 Prolific Personalities. All rights reserved.</p>
            <div className="flex justify-center gap-6 text-sm">
              <Link href="/about" className="hover:text-primary transition-colors">About</Link>
              <Link href="/science" className="hover:text-primary transition-colors">Science</Link>
              <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
              <Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
