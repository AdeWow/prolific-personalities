import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";
import { SEOHead } from "@/components/seo-head";
import { archetypes } from "@/data/archetypes";
import { ArrowRight, ChevronRight } from "lucide-react";


const validSlugs = [
  'structured-achiever',
  'chaotic-creative',
  'anxious-perfectionist',
  'novelty-seeker',
  'strategic-planner',
  'flexible-improviser',
];

import anxiousPerfectionistImage from "@assets/7d8c5462-febe-45f3-b3bd-207fb697cc04_1762297180709.png";
import chaoticCreativeImage from "@assets/763894fc-7172-473f-b45a-30417b2f157a_1762297193215.png";
import strategicPlannerImage from "@assets/ae5e43be-19bd-4df2-b053-48732a922fc6_1762297362107.png";
import structuredAchieverImage from "@assets/e3fac029-7f4f-4a16-a237-d141ea58b5d6_1762297404337.png";
import flexibleImproviserImage from "@assets/84c5e71b-0e9d-4158-b8a2-ea2b5f1f0abd_1762297453206.png";
import noveltySeekerImage from "@assets/56861868-15df-4eb4-a0ae-f1629437f82e_1762297512686.png";
import adaptiveGeneralistImage from "@assets/d9e893a7-c0ec-4b6f-92b2-d9222bdeafbc_1765447835628.png";

const archetypeImages: Record<string, string> = {
  'structured-achiever': structuredAchieverImage,
  'chaotic-creative': chaoticCreativeImage,
  'anxious-perfectionist': anxiousPerfectionistImage,
  'novelty-seeker': noveltySeekerImage,
  'strategic-planner': strategicPlannerImage,
  'flexible-improviser': flexibleImproviserImage,
};

const archetypeCards = [
  {
    slug: 'structured-achiever',
    name: 'The Structured Achiever',
    tagline: 'You turn goals into results.',
  },
  {
    slug: 'chaotic-creative',
    name: 'The Chaotic Creative',
    tagline: 'You thrive in beautiful disorder.',
  },
  {
    slug: 'anxious-perfectionist',
    name: 'The Anxious Perfectionist',
    tagline: 'Your high standards are a superpower.',
  },
  {
    slug: 'novelty-seeker',
    name: 'The Novelty Seeker',
    tagline: "You're energized by what's next.",
  },
  {
    slug: 'strategic-planner',
    name: 'The Strategic Planner',
    tagline: 'You see five moves ahead.',
  },
  {
    slug: 'flexible-improviser',
    name: 'The Flexible Improviser',
    tagline: 'You adapt faster than anyone.',
  },
];

export default function Archetypes() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && validSlugs.includes(hash)) {
      setLocation(`/archetypes/${hash}`);
    }
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <SEOHead
        title="Productivity Archetypes | Prolific Personalities"
        description="Discover the productivity personalities. Learn which archetype matches how you naturally focus, plan, and follow through."
        keywords="productivity archetypes, productivity types, work style types, structured achiever, chaotic creative, strategic planner, anxious perfectionist, novelty seeker, flexible improviser"
        canonicalUrl={typeof window !== 'undefined' ? `${window.location.origin}/archetypes` : undefined}
      />
      <Header />
      
      <main id="main-content" role="main">
        <section className="py-20" aria-labelledby="archetypes-title">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-16">
              <h1 id="archetypes-title" className="text-4xl lg:text-5xl font-bold text-foreground">
                <span className="text-gradient">Which One Are You?</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Everyone approaches productivity differently. Some thrive on structure, others crave spontaneity. 
                Some are a blend of many styles. Discover which one resonates with you.
              </p>
            </div>
          </div>
        </section>

        <section className="pb-16 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {archetypeCards.map((archetype) => (
                <Link 
                  key={archetype.slug}
                  href={`/archetypes/${archetype.slug}`}
                  className="group"
                >
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-slate-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer h-full flex flex-col">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-xl overflow-hidden">
                      <img 
                        src={archetypeImages[archetype.slug]} 
                        alt={archetype.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    
                    <h2 className="text-lg font-bold text-slate-900 text-center mb-2">
                      {archetype.name}
                    </h2>
                    
                    <p className="text-sm text-slate-500 text-center flex-1">
                      {archetype.tagline}
                    </p>
                    
                    <div className="mt-4 flex justify-center">
                      <span className="text-sm text-gray-400 group-hover:text-gray-600 transition-colors">
                        Learn more →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 bg-gradient-to-br from-teal-50 to-cyan-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-teal-100">
              <div className="w-20 h-20 mx-auto mb-4 rounded-xl overflow-hidden">
                <img 
                  src={adaptiveGeneralistImage} 
                  alt="The Adaptive Generalist"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold text-neutral-800 mb-3">
                What if you're a blend?
              </h3>
              <p className="text-neutral-600 mb-6 leading-relaxed">
                Some people score balanced across multiple axes. If that's you, 
                you're an <strong>Adaptive Generalist</strong>—someone who shifts 
                approaches based on context. That's not a flaw. It's a different 
                kind of productivity superpower.
              </p>
              <Link href="/archetypes/adaptive-generalist">
                <Button variant="outline" className="border-teal-300 text-teal-700 hover:bg-teal-50">
                  Learn more about Adaptive Generalists →
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 bg-slate-50 border-y border-slate-200">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Not sure which one you are?
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              Take our free 5-minute assessment to discover your productivity personality and get personalized strategies.
            </p>
            <Link href="/quiz">
              <Button className="inline-flex items-center gap-2 px-8 py-6 bg-primary hover:bg-primary/90 text-white font-semibold rounded-full transition-colors shadow-lg text-lg">
                Discover Your Type
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
