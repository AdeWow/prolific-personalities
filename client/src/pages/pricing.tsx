import { useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";
import { SEOHead } from "@/components/seo-head";
import { CheckCircle2, Sparkles, Lock, Zap, Bot, Users, Crown } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export default function Pricing() {
  useEffect(() => {
    trackEvent('pricing_page_view', 'Navigation', 'Pricing Page');
  }, []);

  const tiers = {
    discovery: {
      name: "Discovery",
      price: "Free",
      priceNote: "",
      description: "Perfect for discovering your archetype",
      icon: Sparkles,
      features: [
        "Complete 28-question assessment",
        "Your unique productivity archetype revealed",
        "2-3 page summary of struggles & strengths",
        "3 quick-win tactics (teaser content)",
        "4-axis score visualization",
        "Email results to yourself",
        "Access to newsletter & community updates",
      ],
      cta: "Start Free Assessment",
      ctaLink: "/quiz",
      highlight: false,
    },
    playbook: {
      name: "Complete Playbook",
      price: "$37",
      priceNote: "one-time",
      description: "Your complete productivity transformation",
      icon: Lock,
      features: [
        "Everything in Discovery, plus:",
        "Full 35+ page personalized playbook",
        "Research citations & psychological frameworks",
        "20+ evidence-based strategies for your archetype",
        "Curated tool stack with recommendations",
        "Implementation worksheets & templates",
        "90-day action plan",
        "Lifetime access + future updates",
      ],
      cta: "Start with Free Assessment",
      ctaLink: "/quiz",
      highlight: true,
      badge: "Most Popular",
    },
    partner: {
      name: "Productivity Partner",
      price: "$97",
      priceNote: "one-time or $12/mo",
      description: "Premium coaching with AI support",
      icon: Crown,
      features: [
        "Everything in Complete Playbook, plus:",
        "AI-powered productivity coach (unlimited)",
        "Personalized coaching based on your archetype",
        "Chat history & progress tracking",
        "Weekly check-ins & accountability nudges",
        "Priority email support",
        "Early access to new features",
        "Private community access",
      ],
      cta: "Get Premium Access",
      ctaLink: "/quiz",
      highlight: false,
      badge: "Best Value",
    },
  };

  const comparisonFeatures = [
    { name: "28-Question Assessment", discovery: true, playbook: true, partner: true },
    { name: "Archetype Results", discovery: true, playbook: true, partner: true },
    { name: "Summary Report", discovery: true, playbook: true, partner: true },
    { name: "Quick-Win Tactics", discovery: "3 tactics", playbook: "20+ strategies", partner: "20+ strategies" },
    { name: "Full Personalized Playbook", discovery: false, playbook: true, partner: true },
    { name: "Research Citations", discovery: false, playbook: true, partner: true },
    { name: "Tool Recommendations", discovery: "Top 10", playbook: "20+ with guides", partner: "20+ with guides" },
    { name: "Implementation Guides", discovery: false, playbook: true, partner: true },
    { name: "90-Day Action Plan", discovery: false, playbook: true, partner: true },
    { name: "AI Productivity Coach", discovery: "10/day limit", playbook: "10/day limit", partner: "Unlimited" },
    { name: "Chat History", discovery: false, playbook: false, partner: true },
    { name: "Priority Support", discovery: false, playbook: false, partner: true },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-indigo-50">
      <SEOHead
        title="Pricing - Discovery, Playbook & Premium | Prolific Personalities"
        description="Start free with Discovery tier. Upgrade to Complete Playbook ($37) for full strategies, or Productivity Partner ($97) for unlimited AI coaching and premium support."
        keywords="productivity assessment pricing, premium report, AI productivity coach, personalized strategies, productivity tools"
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
            Get instant insights for free. Unlock your complete productivity blueprint with Premium plans.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Discovery Plan */}
            <Card className="bg-white shadow-lg border-2 border-neutral-200 hover:border-primary/50 transition-all duration-300" data-testid="card-discovery-plan">
              <CardContent className="p-8">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <tiers.discovery.icon className="w-6 h-6 text-primary" />
                    <h3 className="text-2xl font-bold text-neutral-800">{tiers.discovery.name}</h3>
                  </div>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-5xl font-bold text-neutral-800">{tiers.discovery.price}</span>
                  </div>
                  <p className="text-neutral-600">{tiers.discovery.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {tiers.discovery.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-neutral-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href={tiers.discovery.ctaLink}>
                  <Button className="w-full gradient-primary text-white py-6 text-lg font-semibold hover:shadow-lg transition-all" data-testid="button-start-discovery">
                    {tiers.discovery.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Complete Playbook Plan */}
            <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 shadow-xl border-4 border-primary relative overflow-hidden" data-testid="card-playbook-plan">
              <div className="absolute top-0 right-0 bg-gradient-to-r from-primary to-purple-600 text-white px-6 py-2 text-sm font-semibold">
                {tiers.playbook.badge}
              </div>

              <CardContent className="p-8 pt-12">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <tiers.playbook.icon className="w-6 h-6 text-primary" />
                    <h3 className="text-2xl font-bold text-neutral-800">{tiers.playbook.name}</h3>
                  </div>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-5xl font-bold text-neutral-800">{tiers.playbook.price}</span>
                    <span className="text-neutral-600">{tiers.playbook.priceNote}</span>
                  </div>
                  <p className="text-neutral-700 font-medium">{tiers.playbook.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {tiers.playbook.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Zap className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-neutral-700 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href={tiers.playbook.ctaLink}>
                  <Button className="w-full gradient-primary text-white py-6 text-lg font-semibold hover:shadow-lg transition-all" data-testid="button-start-playbook">
                    <Lock className="w-5 h-5 mr-2" />
                    {tiers.playbook.cta}
                  </Button>
                </Link>

                <p className="text-sm text-neutral-600 text-center mt-4">
                  Take the free assessment first, then upgrade
                </p>

                <p className="text-xs text-neutral-500 text-center mt-4">
                  30-day satisfaction guarantee.{" "}
                  <Link href="/refund-policy" className="text-primary hover:underline" data-testid="link-refund-policy">
                    View refund policy
                  </Link>
                </p>
              </CardContent>
            </Card>

            {/* Productivity Partner Plan */}
            <Card className="bg-white shadow-lg border-2 border-purple-300 hover:border-purple-400 transition-all duration-300 relative overflow-hidden" data-testid="card-partner-plan">
              <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 text-sm font-semibold">
                {tiers.partner.badge}
              </div>

              <CardContent className="p-8 pt-12">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <tiers.partner.icon className="w-6 h-6 text-purple-600" />
                    <h3 className="text-2xl font-bold text-neutral-800">{tiers.partner.name}</h3>
                  </div>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-5xl font-bold text-neutral-800">{tiers.partner.price}</span>
                    <span className="text-neutral-600">{tiers.partner.priceNote}</span>
                  </div>
                  <p className="text-neutral-700 font-medium">{tiers.partner.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {tiers.partner.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Bot className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span className="text-neutral-700 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href={tiers.partner.ctaLink}>
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-6 text-lg font-semibold hover:shadow-lg transition-all" data-testid="button-start-partner">
                    <Crown className="w-5 h-5 mr-2" />
                    {tiers.partner.cta}
                  </Button>
                </Link>

                <p className="text-sm text-neutral-600 text-center mt-4">
                  Save $47 with one-time payment vs. monthly
                </p>

                <p className="text-xs text-neutral-500 text-center mt-4">
                  30-day satisfaction guarantee.{" "}
                  <Link href="/refund-policy" className="text-primary hover:underline">
                    View refund policy
                  </Link>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 bg-white/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-800 text-center mb-12">
            Compare Plans
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full" data-testid="table-comparison">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-4 px-4 font-semibold text-neutral-700">Feature</th>
                  <th className="text-center py-4 px-4 font-semibold text-neutral-700">Discovery<br /><span className="text-primary font-normal">Free</span></th>
                  <th className="text-center py-4 px-4 font-semibold text-primary bg-primary/5">Complete Playbook<br /><span className="font-normal">$37</span></th>
                  <th className="text-center py-4 px-4 font-semibold text-purple-600">Partner<br /><span className="font-normal">$97</span></th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, index) => (
                  <tr key={index} className="border-b border-neutral-100">
                    <td className="py-4 px-4 text-neutral-700">{feature.name}</td>
                    <td className="text-center py-4 px-4">
                      {typeof feature.discovery === 'boolean' ? (
                        feature.discovery ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <span className="text-neutral-400">—</span>
                        )
                      ) : (
                        <span className="text-sm text-neutral-600">{feature.discovery}</span>
                      )}
                    </td>
                    <td className="text-center py-4 px-4 bg-primary/5">
                      {typeof feature.playbook === 'boolean' ? (
                        feature.playbook ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <span className="text-neutral-400">—</span>
                        )
                      ) : (
                        <span className="text-sm text-primary font-medium">{feature.playbook}</span>
                      )}
                    </td>
                    <td className="text-center py-4 px-4">
                      {typeof feature.partner === 'boolean' ? (
                        feature.partner ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <span className="text-neutral-400">—</span>
                        )
                      ) : (
                        <span className="text-sm text-purple-600 font-medium">{feature.partner}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-800 text-center mb-12">
            Why Upgrade?
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
                <span className="text-3xl">🤖</span>
              </div>
              <h3 className="text-xl font-bold text-neutral-800 mb-2">AI Coach</h3>
              <p className="text-neutral-600">
                Get personalized advice from an AI coach that understands your specific archetype
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
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-800 text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <Card className="bg-white shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-bold text-neutral-800 mb-2">What's the difference between Complete Playbook and Productivity Partner?</h3>
                <p className="text-neutral-600">
                  Complete Playbook gives you the full personalized guide with all strategies and action plans. 
                  Productivity Partner adds unlimited AI coaching, chat history, and premium support—perfect for ongoing accountability.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-bold text-neutral-800 mb-2">Can I try the AI Coach before upgrading?</h3>
                <p className="text-neutral-600">
                  Yes! Free and Playbook users get 10 AI coach messages per day. Upgrade to Productivity Partner for unlimited coaching.
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
                <h3 className="font-bold text-neutral-800 mb-2">What if it doesn't work for me?</h3>
                <p className="text-neutral-600">
                  We offer a 30-day satisfaction guarantee. If you don't find at least 3 strategies that work, 
                  we'll refund your purchase—no questions asked.
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
              <Link href="/refund-policy" className="hover:text-primary transition-colors">Refund Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
