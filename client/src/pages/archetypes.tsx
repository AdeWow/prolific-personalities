import { useEffect } from "react";
import { useLocation } from "wouter";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";
import { archetypes } from "@/data/archetypes";
import thoughtfulPersonImage from "@assets/adeola2020_an_expressive_illustration_of_a_thoughtful_person_ga_a6681bc9-45e9-4c2c-b1fa-961885775c35_1750287981899.png";
import cheerfulPersonImage from "@assets/adeola2020_a_cheerful_and_imaginative_person_surrounded_by_scat_bd79f25b-94eb-40cb-8565-beb87e4f0704_1750288019564.png";

export default function Archetypes() {
  const [location] = useLocation();

  useEffect(() => {
    // Handle URL hash navigation with a slight delay to ensure DOM is ready
    const handleHashNavigation = () => {
      const hash = window.location.hash.slice(1);
      if (hash) {
        // Small delay to ensure the page has rendered
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    };

    handleHashNavigation();
    
    // Also listen for hash changes
    window.addEventListener('hashchange', handleHashNavigation);
    return () => window.removeEventListener('hashchange', handleHashNavigation);
  }, [location]);

  const archetypeDetails = [
    {
      id: "structured-achiever",
      name: "The Structured Achiever",
      tagline: "You thrive on goals and accountability.",
      image: cheerfulPersonImage,
      description: "The Structured Achiever is highly organized and externally motivated. You excel when you have clear goals, deadlines, and accountability systems. External validation and recognition fuel your productivity.",
      fullDescription: [
        "You naturally gravitate toward structured environments where expectations are clear and progress is measurable. Deadlines don't stress you out—they motivate you. You thrive when others are counting on you, and you love the feeling of checking tasks off your list.",
        "Your attention to detail and systematic approach make you reliable and efficient. You excel at following through on commitments and delivering high-quality work on time. You respond well to external rewards, whether that's recognition from colleagues or tangible achievements.",
        "However, you may struggle when structure is absent or when you need to self-motivate without external accountability. Finding your own intrinsic drive can be challenging, and you might feel lost when working independently without clear guidelines."
      ]
    },
    {
      id: "chaotic-creative",
      name: "The Chaotic Creative",
      tagline: "You create your own path.",
      image: cheerfulPersonImage,
      description: "The Chaotic Creative is naturally curious and thrives on variety. You prefer flexibility over rigid schedules, and you're energized by new experiences and big-picture thinking, though starting tasks can be challenging.",
      fullDescription: [
        "You might have a dozen interests at once, and that's not a problem—it's how you learn. You connect ideas across disciplines and find inspiration in unexpected places. Structure feels confining, but complete chaos doesn't work either.",
        "Your challenge is finding systems that bend without breaking. You need frameworks that support your curiosity rather than limit it. Procrastination is often your nemesis—not from lack of interest, but from overthinking or waiting for the perfect moment.",
        "You thrive when you have permission to explore and the tools to capture what you find, along with gentle accountability to help you overcome initial resistance to starting tasks."
      ]
    },
    {
      id: "anxious-perfectionist",
      name: "The Anxious Perfectionist",
      tagline: "You pursue excellence, sometimes at a cost.",
      image: thoughtfulPersonImage,
      description: "The Anxious Perfectionist is detail-oriented and structured, with exceptionally high standards. You produce outstanding work but often struggle with task avoidance due to anxiety about starting or fear of imperfection.",
      fullDescription: [
        "You have a gift for seeing details others miss and producing work of exceptional quality. Your systematic approach and thorough analysis ensure nothing falls through the cracks. When you do complete a task, it's done right.",
        "However, your perfectionism can be paralyzing. You may delay starting tasks because you feel anxious or overwhelmed, or because conditions don't feel 'perfect' yet. The gap between your vision and reality can feel unbearable, leading to procrastination despite your desire for structure.",
        "Your challenge is learning to start before you're ready and accepting 'good enough' rather than perfect. When you can manage your anxiety and lower the bar for initial action, your attention to detail becomes a true superpower."
      ]
    },
    {
      id: "novelty-seeker",
      name: "The Novelty Seeker",
      tagline: "You are driven by what's new and exciting.",
      image: cheerfulPersonImage,
      description: "The Novelty Seeker is a creative ignition switch—bursting with energy when inspiration hits. You crave variety and external stimulation, thinking in big-picture terms while needing accountability to maintain focus.",
      fullDescription: [
        "You move fast, think in flashes, and often ride the wave of enthusiasm as a new idea comes alive. When you're 'on,' there's nothing quite like it. You thrive in dynamic environments with plenty of variety and external stimulation.",
        "Deadlines and gamification don't scare you—they activate you. In fact, without a sense of urgency or novelty, your attention can drift. You need external accountability and variety to stay engaged, as routine tasks quickly become boring.",
        "Your gift is getting things moving and spotting new opportunities. But the challenge is keeping that momentum once the initial rush fades. You may bounce between ideas or need constant external reinforcement to stay on track."
      ]
    },
    {
      id: "strategic-planner",
      name: "The Strategic Planner",
      tagline: "You are a visionary architect.",
      image: thoughtfulPersonImage,
      description: "The Strategic Planner combines big-picture thinking with structured execution. You're intrinsically motivated and self-directed, excelling at long-term vision while maintaining the discipline to execute systematically.",
      fullDescription: [
        "You operate best when you can see the full landscape and chart a course toward a meaningful goal. Unlike others who need external accountability, you're driven by your own vision and values. Your strategic mindset allows you to plan years ahead while staying grounded in actionable steps.",
        "You tend to map out your time with intention, and there's a quiet pride in staying organized. Your focus isn't always flashy, but it's dependable. You combine the best of visionary thinking with practical execution.",
        "However, when things don't go according to plan, it can throw you off. You may struggle with flexibility when your carefully laid plans need adjustment. Learning to adapt while maintaining your strategic vision is your growth edge."
      ]
    },
    {
      id: "flexible-improviser",
      name: "The Flexible Improviser",
      tagline: "You thrive in motion and ambiguity.",
      image: cheerfulPersonImage,
      description: "The Flexible Improviser is action-oriented and adaptable. You excel at starting tasks and adjusting on the fly, comfortable with ambiguity and preferring momentum over extensive planning.",
      fullDescription: [
        "You have a natural bias toward action. While others are still planning, you've already started and learned from real experience. You don't need perfect conditions or complete information—you figure things out as you go.",
        "Your adaptability is your superpower. When circumstances change, you pivot easily without the stress others experience. You're comfortable with uncertainty and actually enjoy the challenge of improvising solutions in real-time.",
        "Your challenge is strategic thinking and long-term planning. You may miss important details or find yourself needing to backtrack because you acted too quickly. Balancing your action orientation with occasional strategic reflection will help you achieve even more."
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-indigo-50">
      <Header />

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary/10 to-secondary/10 border-0 text-primary font-semibold">
              <i className="fas fa-users mr-2"></i>
              Productivity Archetypes
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-neutral-800">
              Six Distinct <span className="text-gradient">Productivity Personalities</span>
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed mb-6">
              Everyone approaches productivity differently. Some thrive on structure, others crave spontaneity. 
              This framework is built on real psychological principles and helps you understand how you focus, plan, and follow through.
            </p>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              Each archetype represents a unique blend of cognitive patterns, motivational tendencies, and behavioral strategies. Discover which one resonates with you.
            </p>
          </div>
        </div>
      </section>

      {/* Archetype Sections */}
      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {archetypeDetails.map((archetype, index) => {
            const archetypeData = archetypes.find(a => a.id === archetype.id);
            if (!archetypeData) return null;

            return (
              <div key={archetype.id} id={archetype.id} className="scroll-mt-24">
                <Card className="bg-white shadow-xl overflow-hidden">
                  <CardContent className="p-0">
                    {/* Header */}
                    <div className={`bg-gradient-to-br ${archetypeData.gradientFrom} ${archetypeData.gradientTo} p-8 text-white`}>
                      <div className="flex items-center space-x-6">
                        <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                          <i className={`${archetypeData.icon} text-white text-3xl`}></i>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-3xl font-bold mb-2">{archetype.name}</h3>
                          <p className="text-xl opacity-90 italic">{archetype.tagline}</p>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 space-y-8">
                      <div className="flex flex-col lg:flex-row gap-8 items-start">
                        <div className="flex-1">
                          <p className="text-lg text-neutral-700 leading-relaxed font-medium">
                            {archetype.description}
                          </p>
                        </div>
                        <div className="lg:w-80 flex-shrink-0">
                          <img 
                            src={archetype.image} 
                            alt={`${archetype.name} illustration`}
                            className="w-full h-auto rounded-lg shadow-lg"
                          />
                        </div>
                      </div>
                      
                      {archetype.fullDescription.map((paragraph, i) => (
                        <p key={i} className="text-lg text-neutral-700 leading-relaxed">
                          {paragraph}
                        </p>
                      ))}

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        {archetypeData.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className={`px-3 py-1 bg-${archetypeData.color}-100 text-${archetypeData.color}-700`}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Superpowers Section */}
                      <div className="bg-emerald-50 border-l-4 border-emerald-500 rounded-lg p-6">
                        <h4 className="text-2xl font-bold text-neutral-800 mb-4 flex items-center">
                          <i className="fas fa-star text-emerald-500 mr-3"></i>
                          Your Superpowers
                        </h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          {archetypeData.superpowers.map((power, i) => (
                            <div key={i} className="bg-white rounded-lg p-4 shadow-sm">
                              <h5 className="font-bold text-neutral-800 mb-2">{power.title}</h5>
                              <p className="text-neutral-600 text-sm">{power.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Blockers Section */}
                      <div className="bg-red-50 border-l-4 border-red-400 rounded-lg p-6">
                        <h4 className="text-2xl font-bold text-neutral-800 mb-4 flex items-center">
                          <i className="fas fa-ban text-red-500 mr-3"></i>
                          Common Blockers
                        </h4>
                        <div className="space-y-3">
                          {archetypeData.blockers.map((blocker, i) => (
                            <div key={i} className="flex items-start space-x-3">
                              <div className="w-6 h-6 bg-red-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                <i className="fas fa-times text-red-600 text-xs"></i>
                              </div>
                              <div>
                                <span className="font-semibold text-neutral-800">{blocker.title}:</span>
                                <span className="text-neutral-700"> {blocker.description}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Call to Action */}
                      <div className="text-center pt-8 border-t-2 border-neutral-200 mt-8">
                        <p className="text-neutral-600 mb-4 text-lg">
                          Want to discover your personalized strengths, growth areas, and tool recommendations?
                        </p>
                        <Link href="/quiz">
                          <Button className={`bg-gradient-to-r ${archetypeData.gradientFrom} ${archetypeData.gradientTo} text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200`}>
                            <i className="fas fa-play mr-2"></i>
                            Take the Assessment
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </section>

      {/* Navigation */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold text-neutral-800 mb-8">Quick Navigation</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {archetypeDetails.map((archetype) => {
              const archetypeData = archetypes.find(a => a.id === archetype.id);
              if (!archetypeData) return null;
              
              return (
                <a
                  key={archetype.id}
                  href={`#${archetype.id}`}
                  className={`p-4 rounded-xl border-2 border-${archetypeData.color}-200 bg-${archetypeData.color}-50 hover:border-${archetypeData.color}-400 transition-colors text-center`}
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${archetypeData.gradientFrom} ${archetypeData.gradientTo} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                    <i className={`${archetypeData.icon} text-white text-lg`}></i>
                  </div>
                  <div className="font-semibold text-neutral-800 text-sm">{archetype.name}</div>
                </a>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}