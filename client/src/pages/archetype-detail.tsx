import { useParams, Link, Redirect } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";
import { SEOHead } from "@/components/seo-head";
import { archetypes } from "@/data/archetypes";
import { ArrowRight, ChevronRight, Star, XCircle } from "lucide-react";

import anxiousPerfectionistImage from "@assets/7d8c5462-febe-45f3-b3bd-207fb697cc04_1762297180709.png";
import chaoticCreativeImage from "@assets/763894fc-7172-473f-b45a-30417b2f157a_1762297193215.png";
import strategicPlannerImage from "@assets/ae5e43be-19bd-4df2-b053-48732a922fc6_1762297362107.png";
import structuredAchieverImage from "@assets/e3fac029-7f4f-4a16-a237-d141ea58b5d6_1762297404337.png";
import flexibleImproviserImage from "@assets/84c5e71b-0e9d-4158-b8a2-ea2b5f1f0abd_1762297453206.png";
import noveltySeekerImage from "@assets/56861868-15df-4eb4-a0ae-f1629437f82e_1762297512686.png";

const archetypeImages: Record<string, string> = {
  'structured-achiever': structuredAchieverImage,
  'chaotic-creative': chaoticCreativeImage,
  'anxious-perfectionist': anxiousPerfectionistImage,
  'novelty-seeker': noveltySeekerImage,
  'strategic-planner': strategicPlannerImage,
  'flexible-improviser': flexibleImproviserImage,
};

const archetypeDetails: Record<string, {
  description: string;
  fullDescription: string[];
  tagline: string;
}> = {
  'structured-achiever': {
    tagline: 'You thrive on goals and accountability.',
    description: 'The Structured Achiever is highly organized and externally motivated. You excel when you have clear goals, deadlines, and accountability systems. External validation and recognition fuel your productivity.',
    fullDescription: [
      "You naturally gravitate toward structured environments where expectations are clear and progress is measurable. Deadlines don't stress you out—they motivate you. You thrive when others are counting on you, and you love the feeling of checking tasks off your list.",
      "Your attention to detail and systematic approach make you reliable and efficient. You excel at following through on commitments and delivering high-quality work on time. You respond well to external rewards, whether that's recognition from colleagues or tangible achievements.",
      "However, you may struggle when structure is absent or when you need to self-motivate without external accountability. Finding your own intrinsic drive can be challenging, and you might feel lost when working independently without clear guidelines."
    ]
  },
  'chaotic-creative': {
    tagline: 'You create your own path.',
    description: 'The Chaotic Creative is naturally curious and thrives on variety. You prefer flexibility over rigid schedules, and you\'re energized by new experiences and big-picture thinking, though starting tasks can be challenging.',
    fullDescription: [
      "You might have a dozen interests at once, and that's not a problem—it's how you learn. You connect ideas across disciplines and find inspiration in unexpected places. Structure feels confining, but complete chaos doesn't work either.",
      "Your challenge is finding systems that bend without breaking. You need frameworks that support your curiosity rather than limit it. Procrastination is often your nemesis—not from lack of interest, but from overthinking or waiting for the perfect moment.",
      "You thrive when you have permission to explore and the tools to capture what you find, along with gentle accountability to help you overcome initial resistance to starting tasks."
    ]
  },
  'anxious-perfectionist': {
    tagline: 'You pursue excellence, sometimes at a cost.',
    description: 'The Anxious Perfectionist is detail-oriented and structured, with exceptionally high standards. You produce outstanding work but often struggle with task avoidance due to anxiety about starting or fear of imperfection.',
    fullDescription: [
      "You have a gift for seeing details others miss and producing work of exceptional quality. Your systematic approach and thorough analysis ensure nothing falls through the cracks. When you do complete a task, it's done right.",
      "However, your perfectionism can be paralyzing. You may delay starting tasks because you feel anxious or overwhelmed, or because conditions don't feel 'perfect' yet. The gap between your vision and reality can feel unbearable, leading to procrastination despite your desire for structure.",
      "Your challenge is learning to start before you're ready and accepting 'good enough' rather than perfect. When you can manage your anxiety and lower the bar for initial action, your attention to detail becomes a true superpower."
    ]
  },
  'novelty-seeker': {
    tagline: 'You are driven by what\'s new and exciting.',
    description: 'The Novelty Seeker is a creative ignition switch—bursting with energy when inspiration hits. You crave variety and external stimulation, thinking in big-picture terms while needing accountability to maintain focus.',
    fullDescription: [
      "You move fast, think in flashes, and often ride the wave of enthusiasm as a new idea comes alive. When you're 'on,' there's nothing quite like it. You thrive in dynamic environments with plenty of variety and external stimulation.",
      "Deadlines and gamification don't scare you—they activate you. In fact, without a sense of urgency or novelty, your attention can drift. You need external accountability and variety to stay engaged, as routine tasks quickly become boring.",
      "Your gift is getting things moving and spotting new opportunities. But the challenge is keeping that momentum once the initial rush fades. You may bounce between ideas or need constant external reinforcement to stay on track."
    ]
  },
  'strategic-planner': {
    tagline: 'You are a visionary architect.',
    description: 'The Strategic Planner combines big-picture thinking with structured execution. You\'re intrinsically motivated and self-directed, excelling at long-term vision while maintaining the discipline to execute systematically.',
    fullDescription: [
      "You operate best when you can see the full landscape and chart a course toward a meaningful goal. Unlike others who need external accountability, you're driven by your own vision and values. Your strategic mindset allows you to plan years ahead while staying grounded in actionable steps.",
      "You tend to map out your time with intention, and there's a quiet pride in staying organized. Your focus isn't always flashy, but it's dependable. You combine the best of visionary thinking with practical execution.",
      "However, when things don't go according to plan, it can throw you off. You may struggle with flexibility when your carefully laid plans need adjustment. Learning to adapt while maintaining your strategic vision is your growth edge."
    ]
  },
  'flexible-improviser': {
    tagline: 'You thrive in motion and ambiguity.',
    description: 'The Flexible Improviser is action-oriented and adaptable. You excel at starting tasks and adjusting on the fly, comfortable with ambiguity and preferring momentum over extensive planning.',
    fullDescription: [
      "You have a natural bias toward action. While others are still planning, you've already started and learned from real experience. You don't need perfect conditions or complete information—you figure things out as you go.",
      "Your adaptability is your superpower. When circumstances change, you pivot easily without the stress others experience. You're comfortable with uncertainty and actually enjoy the challenge of improvising solutions in real-time.",
      "Your challenge is strategic thinking and long-term planning. You may miss important details or find yourself needing to backtrack because you acted too quickly. Balancing your action orientation with occasional strategic reflection will help you achieve even more."
    ]
  }
};

const validSlugs = [
  'structured-achiever',
  'chaotic-creative',
  'anxious-perfectionist',
  'novelty-seeker',
  'strategic-planner',
  'flexible-improviser',
];

export default function ArchetypeDetail() {
  const { slug } = useParams<{ slug: string }>();

  if (!slug || !validSlugs.includes(slug)) {
    return <Redirect to="/archetypes" />;
  }

  const archetype = archetypes.find(a => a.id === slug);
  if (!archetype) {
    return <Redirect to="/archetypes" />;
  }

  const details = archetypeDetails[slug];
  const image = archetypeImages[slug];
  const otherArchetypes = archetypes.filter(a => a.id !== slug && validSlugs.includes(a.id));

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <SEOHead
        title={`${archetype.name} | Prolific Personalities`}
        description={details.description}
        keywords={`${archetype.name.toLowerCase()}, productivity archetype, productivity type, ${archetype.tags.join(', ').toLowerCase()}`}
        canonicalUrl={typeof window !== 'undefined' ? `${window.location.origin}/archetypes/${slug}` : undefined}
      />
      <Header />
      
      <main id="main-content" role="main">
        <section className={`bg-gradient-to-r ${archetype.gradientFrom} ${archetype.gradientTo} py-16 px-4`}>
          <div className="max-w-4xl mx-auto">
            <Link href="/archetypes" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
              <ChevronRight className="w-4 h-4 rotate-180 mr-1" />
              All Archetypes
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {archetype.name}
            </h1>
            <p className="text-xl text-white/90 italic">
              {details.tagline}
            </p>
          </div>
        </section>

        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-5 gap-8 mb-10">
              <div className="md:col-span-3 space-y-4 text-slate-700 text-lg leading-relaxed">
                <p className="font-medium">{details.description}</p>
                {details.fullDescription.map((para: string, i: number) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
              <div className="md:col-span-2 flex items-center justify-center">
                <img 
                  src={image} 
                  alt={archetype.name}
                  className="max-w-full h-auto rounded-xl shadow-lg"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-10">
              {archetype.tags.map((trait) => (
                <Badge
                  key={trait}
                  variant="secondary"
                  className="px-4 py-1.5 bg-slate-100 text-slate-700 rounded-full text-sm font-medium"
                >
                  {trait}
                </Badge>
              ))}
            </div>

            <div className="mb-8 p-6 bg-emerald-50 border-l-4 border-emerald-400 rounded-r-xl">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Star className="h-6 w-6 text-emerald-500" />
                Your Superpowers
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {archetype.superpowers.map((power) => (
                  <div key={power.title} className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-1">{power.title}</h3>
                    <p className="text-slate-600 text-sm">{power.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-12 p-6 bg-rose-50 border-l-4 border-rose-400 rounded-r-xl">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <XCircle className="h-6 w-6 text-rose-500" />
                Common Blockers
              </h2>
              <ul className="space-y-3">
                {archetype.blockers.map((blocker) => (
                  <li key={blocker.title} className="flex items-start gap-3">
                    <span className="w-2 h-2 mt-2 bg-rose-400 rounded-full flex-shrink-0"></span>
                    <div>
                      <span className="font-semibold text-slate-900">{blocker.title}:</span>
                      <span className="text-slate-600 ml-1">{blocker.description}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="py-12 px-4 bg-slate-50 border-y border-slate-200">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-lg text-slate-600 mb-6">
              Want to discover your personalized strengths, growth areas, and tool recommendations?
            </p>
            <Link href="/quiz">
              <Button className="inline-flex items-center gap-2 px-8 py-6 bg-primary hover:bg-primary/90 text-white font-semibold rounded-full transition-colors shadow-lg text-lg">
                Take the Assessment
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>

        <section className="py-12 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">
              Explore Other Types
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {otherArchetypes.map((other) => (
                <Link
                  key={other.id}
                  href={`/archetypes/${other.id}`}
                  className="group bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-300 hover:shadow-md transition-all text-center"
                >
                  <img 
                    src={archetypeImages[other.id]} 
                    alt={other.name}
                    className="w-12 h-12 mx-auto mb-2 rounded-lg object-cover group-hover:scale-110 transition-transform"
                  />
                  <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                    {other.name.replace('The ', '')}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
