import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SEOHead } from "@/components/seo-head";
import { CheckCircle2, Sparkles, Lock, Zap, Target, RefreshCw, Loader2, ChevronDown, ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { trackPaywallView } from "@/lib/posthog";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const EARLY_BIRD_LIMIT = 100;

interface FAQItem {
  question: string;
  answer: string;
  linkText?: string;
  linkHref?: string;
}

const faqItems: FAQItem[] = [
  {
    question: "What do I get with the Complete Playbook?",
    answer: "You get a 35+ page personalized guide with evidence-based strategies tailored to your archetype, implementation worksheets, a 90-day action plan, curated tool recommendations, and priority access to new features.",
  },
  {
    question: "Is there a mobile app coming?",
    answer: "We're exploring a mobile app with AI coaching features. Complete Playbook customers will always be first to access new features as we build them.",
  },
  {
    question: "Is this based on real science?",
    answer: "Yes! Our framework is grounded in peer-reviewed research on executive function, motivation theory, flow states, and cognitive psychology.",
    linkText: "Learn more on our Research page",
    linkHref: "/the-research",
  },
  {
    question: "What if it doesn't work for me?",
    answer: "We offer a 30-day satisfaction guarantee. If you don't find at least 3 strategies that work, we'll refund your purchase—no questions asked.",
  },
];

function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const isOpen = openItems.has(index);
        return (
          <Card key={index} className="bg-white shadow-lg overflow-hidden">
            <button
              onClick={() => toggleItem(index)}
              className={`w-full p-6 text-left flex justify-between items-center cursor-pointer transition-colors ${
                isOpen ? 'bg-white' : 'hover:bg-slate-50'
              }`}
              aria-expanded={isOpen}
            >
              <h3 className="font-semibold text-slate-800 pr-4">{item.question}</h3>
              <ChevronDown 
                className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                }`} 
              />
            </button>
            <div 
              className={`transition-all duration-200 ease-in-out overflow-hidden ${
                isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-6 pb-6 pt-0">
                <p className="text-slate-600">
                  {item.answer}
                  {item.linkText && item.linkHref && (
                    <>
                      {" "}
                      <Link href={item.linkHref} className="text-primary hover:underline">
                        {item.linkText}
                      </Link>
                      .
                    </>
                  )}
                </p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function SocialProofSection() {
  return (
    <div className="py-12 text-center">
      <div className="flex flex-wrap justify-center gap-8 items-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-slate-800">40+</p>
          <p className="text-sm text-slate-500">Peer-reviewed studies</p>
        </div>
        
        <div className="w-px h-10 bg-slate-200 hidden sm:block" />
        
        <div className="text-center">
          <p className="text-2xl font-bold text-slate-800">4-Axis</p>
          <p className="text-sm text-slate-500">Psychological framework</p>
        </div>
        
        <div className="w-px h-10 bg-slate-200 hidden sm:block" />
        
        <div className="text-center">
          <p className="text-2xl font-bold text-slate-800">28</p>
          <p className="text-sm text-slate-500">Research-backed questions</p>
        </div>
        
        <div className="w-px h-10 bg-slate-200 hidden sm:block" />
        
        <div className="text-center">
          <p className="text-2xl font-bold text-slate-800">6</p>
          <p className="text-sm text-slate-500">Distinct archetypes</p>
        </div>
      </div>
      
      <Link href="/the-research" className="inline-flex items-center mt-6 text-sm text-teal-600 hover:text-teal-700 gap-1">
        See the research behind our framework
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

export default function Pricing() {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  
  const { data: purchaseCount } = useQuery<{ count: number }>({
    queryKey: ['/api/playbook-purchase-count'],
  });

  const { data: userPurchaseStatus } = useQuery<{ hasPurchased: boolean }>({
    queryKey: ['/api/user-purchase-status'],
    enabled: isAuthenticated,
  });

  const isEarlyBird = !purchaseCount || purchaseCount.count < EARLY_BIRD_LIMIT;
  const spotsRemaining = purchaseCount ? EARLY_BIRD_LIMIT - purchaseCount.count : EARLY_BIRD_LIMIT;
  const currentPrice = isEarlyBird ? "$19" : "$29";
  const originalPrice = isEarlyBird ? "$29" : null;
  const hasPurchased = userPurchaseStatus?.hasPurchased || false;

  useEffect(() => {
    trackEvent('pricing_page_view', 'Navigation', 'Pricing Page');
    trackPaywallView('no_archetype', 'pricing_page');
  }, []);

  const handlePlaybookPurchase = async () => {
    setIsCheckingOut(true);
    try {
      trackEvent('pricing_playbook_click', 'Purchase', 'Playbook Pre-Purchase');
      const response = await apiRequest('POST', '/api/create-prepurchase-session', {});
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to start checkout. Please try again.",
        variant: "destructive",
      });
      setIsCheckingOut(false);
    }
  };

  const comparisonFeatures = [
    { name: "28-Question Assessment", discovery: true, playbook: true },
    { name: "Archetype Results", discovery: true, playbook: true },
    { name: "Summary Report", discovery: true, playbook: true },
    { name: "Quick-Win Tactics", discovery: "3 tactics", playbook: "20+ strategies" },
    { name: "Full Personalized Playbook", discovery: false, playbook: true },
    { name: "Research Citations", discovery: false, playbook: true },
    { name: "Tool Recommendations", discovery: "Top 10", playbook: "20+ with guides" },
    { name: "Implementation Guides", discovery: false, playbook: true },
    { name: "90-Day Action Plan", discovery: false, playbook: true },
    { name: "Priority Feature Access", discovery: false, playbook: true },
  ];

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://prolificpersonalities.com';
  
  const productStructuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Prolific Personalities Productivity Assessment",
    "description": "Science-backed productivity assessment with personalized strategies based on your unique archetype",
    "brand": {
      "@type": "Brand",
      "name": "Prolific Personalities"
    },
    "offers": [
      {
        "@type": "Offer",
        "name": "Discovery - Free Assessment",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "description": "Complete 28-question assessment with archetype reveal and quick-win tactics"
      },
      {
        "@type": "Offer",
        "name": "Complete Playbook",
        "price": isEarlyBird ? "19" : "29",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "description": "35+ page personalized playbook with evidence-based strategies and implementation guides"
      }
    ]
  };

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  const combinedStructuredData = [productStructuredData, faqStructuredData];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <SEOHead
        title="Pricing - Free Productivity Test + Premium Playbook | Prolific Personalities"
        description={`Take our free productivity test and quiz. Upgrade to Complete Playbook (${currentPrice}) for 35+ pages of personalized strategies, implementation guides, and lifetime access.`}
        keywords="free productivity test, productivity quiz pricing, productivity assessment cost, personalized productivity strategies, productivity playbook"
        canonicalUrl={`${origin}/pricing`}
        structuredData={combinedStructuredData}
      />
      <Header />
      <main id="main-content" role="main">
        {/* Hero Section */}
        <section className="py-20" aria-labelledby="pricing-title">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full text-sm font-medium text-primary mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              Choose Your Plan
            </Badge>
            
            <h1 id="pricing-title" className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Start Free. Upgrade When Ready.
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Get instant insights for free. Unlock your complete productivity blueprint with Premium plans.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="pb-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Discovery Plan */}
              <Card className="bg-white shadow-lg border-2 border-muted hover:border-primary/50 transition-all duration-300 flex flex-col" data-testid="card-discovery-plan">
                <CardContent className="p-8 flex flex-col flex-1">
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-6 h-6 text-primary" />
                      <h3 className="text-2xl font-bold text-foreground">Discovery</h3>
                    </div>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-5xl font-bold text-foreground">Free</span>
                    </div>
                    <p className="text-muted-foreground">Perfect for discovering your archetype</p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {[
                      "Complete 28-question assessment",
                      "Your unique productivity archetype revealed",
                      "2-3 page summary of struggles & strengths",
                      "3 quick-win tactics (teaser content)",
                      "4-axis score visualization",
                      "Email results to yourself",
                      "Access to newsletter & community updates",
                    ].map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Upsell nudge in Discovery card */}
                  <div className="mt-auto pt-6 border-t border-slate-100 text-center mb-6">
                    <p className="text-sm text-slate-400 mb-2">
                      Want the complete picture?
                    </p>
                    <a 
                      href="#complete-playbook" 
                      className="text-sm text-teal-600 hover:text-teal-700 font-medium inline-flex items-center gap-1"
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById('complete-playbook')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      See Complete Playbook
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>

                  <Link href={hasPurchased ? "/dashboard" : "/quiz"}>
                    <Button className="w-full gradient-primary text-white py-6 text-lg font-semibold hover:shadow-lg transition-all" data-testid="button-start-discovery">
                      {hasPurchased ? "View Your Results" : "Start Free Assessment"}
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Complete Playbook Plan */}
              <Card 
                id="complete-playbook"
                className="bg-gradient-to-br from-primary/5 to-accent/5 shadow-xl border-4 border-primary relative overflow-hidden flex flex-col" 
                data-testid="card-playbook-plan"
              >
                <div className="absolute top-0 right-0 bg-primary text-white px-6 py-2 text-sm font-semibold">
                  Most Popular
                </div>

                <CardContent className="p-8 pt-12 flex flex-col flex-1">
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="w-6 h-6 text-primary" />
                      <h3 className="text-2xl font-bold text-foreground">Complete Playbook</h3>
                    </div>
                    
                    {hasPurchased ? (
                      <div className="mb-4">
                        <Badge className="bg-green-50 text-green-700 border border-green-200 px-4 py-2 text-base">
                          You own this
                        </Badge>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-baseline gap-2 mb-2">
                          {originalPrice && (
                            <span className="text-2xl text-muted-foreground line-through">{originalPrice}</span>
                          )}
                          <span className="text-5xl font-bold text-foreground">{currentPrice}</span>
                          <span className="text-muted-foreground">one-time</span>
                        </div>
                        {isEarlyBird && (
                          <div className="mb-4">
                            <Badge className="bg-green-100 text-green-700 border-green-300">Launch Price</Badge>
                            <p className="text-sm text-green-600 mt-1">Early-bird pricing for first 100 customers</p>
                            {spotsRemaining > 0 && (
                              <p className="text-sm font-medium text-teal-700 mt-1">
                                {spotsRemaining} of 100 launch spots remaining
                              </p>
                            )}
                          </div>
                        )}
                      </>
                    )}
                    <p className="text-muted-foreground font-medium">Your complete productivity transformation</p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {[
                      "Everything in Discovery, plus:",
                      "Full 35+ page personalized playbook",
                      "Research citations & psychological frameworks",
                      "20+ evidence-based strategies for your archetype",
                      "Curated tool stack with recommendations",
                      "Implementation worksheets & templates",
                      "90-day action plan",
                      "Lifetime access + future updates",
                      "Priority access to new features and updates",
                    ].map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Zap className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto">
                    {hasPurchased ? (
                      <Link href="/dashboard">
                        <Button className="w-full gradient-primary text-white py-6 text-lg font-semibold hover:shadow-lg transition-all">
                          Access your playbook →
                        </Button>
                      </Link>
                    ) : (
                      <Button 
                        onClick={handlePlaybookPurchase}
                        disabled={isCheckingOut}
                        className="w-full gradient-primary text-white py-6 text-lg font-semibold hover:shadow-lg transition-all" 
                        data-testid="button-start-playbook"
                      >
                        {isCheckingOut ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          `Get Your Playbook — ${currentPrice}`
                        )}
                      </Button>
                    )}

                    {!hasPurchased && (
                      <p className="text-xs text-muted-foreground text-center mt-4">
                        30-day satisfaction guarantee.{" "}
                        <Link href="/refund-policy" className="text-primary hover:underline" data-testid="link-refund-policy">
                          View refund policy
                        </Link>
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <SocialProofSection />
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-16 bg-white/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">
              Compare Plans
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full" data-testid="table-comparison">
                <thead>
                  <tr className="border-b border-muted">
                    <th className="text-left py-4 px-4 font-semibold text-muted-foreground">Feature</th>
                    <th className="text-center py-4 px-4 font-semibold text-muted-foreground">Discovery<br /><span className="text-primary font-normal">Free</span></th>
                    <th className="text-center py-4 px-4 font-semibold text-primary bg-primary/5">Complete Playbook<br /><span className="font-normal">{currentPrice}</span></th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((feature, index) => (
                    <tr key={index} className="border-b border-muted">
                      <td className="py-4 px-4 text-muted-foreground">{feature.name}</td>
                      <td className="text-center py-4 px-4">
                        {typeof feature.discovery === 'boolean' ? (
                          feature.discovery ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )
                        ) : (
                          <span className="text-sm text-muted-foreground">{feature.discovery}</span>
                        )}
                      </td>
                      <td className="text-center py-4 px-4 bg-primary/5">
                        {typeof feature.playbook === 'boolean' ? (
                          feature.playbook ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )
                        ) : (
                          <span className="text-sm text-primary font-medium">{feature.playbook}</span>
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
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">
              Why Upgrade?
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Actionable Plans</h3>
                <p className="text-muted-foreground">
                  Not just theory—get week-by-week implementation guides tailored to your archetype
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <RefreshCw className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Always Improving</h3>
                <p className="text-muted-foreground">
                  Your playbook evolves with the platform. Get priority access to new features, tools, and updates as we build them.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Faster Results</h3>
                <p className="text-muted-foreground">
                  Skip months of trial and error with proven strategies for your specific working style
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white/50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">
              Frequently Asked Questions
            </h2>

            <FAQAccordion items={faqItems} />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Ready to discover your productivity archetype?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
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
      </main>
      <Footer />
    </div>
  );
}
