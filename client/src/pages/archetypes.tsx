import { useEffect } from "react";
import { useLocation } from "wouter";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { archetypes } from "@/data/archetypes";

export default function Archetypes() {
  const [location] = useLocation();

  useEffect(() => {
    // Handle URL hash navigation
    if (location.includes('#')) {
      const hash = location.split('#')[1];
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  const archetypeDetails = [
    {
      id: "strategist",
      name: "The Architect",
      tagline: "You thrive in clarity.",
      image: "/assets/adeola2020_an_expressive_illustration_of_a_thoughtful_person_ga_a6681bc9-45e9-4c2c-b1fa-961885775c35_1750287981899.png",
      description: "The Architect is a master planner—deliberate, detail-oriented, and structured. You like knowing where things are going and exactly how they'll get there. When the world feels messy, you respond by creating systems. Calendars, spreadsheets, routines—they aren't just tools, they're anchors.",
      fullDescription: [
        "You tend to map out your time with intention, and there's a quiet pride in staying organized. Your focus isn't always flashy, but it's dependable. People often rely on you to \"figure it out,\" because they know you'll bring a plan and execute with precision.",
        "Still, when things don't go according to plan, it can throw you off. You may feel stuck when the path forward isn't obvious—or when other people don't follow through. Spontaneity can feel disruptive rather than energizing. But in the right environment, your structured mindset turns chaos into clarity.",
        "You feel most like yourself when your systems are running smoothly."
      ]
    },
    {
      id: "explorer",
      name: "The Explorer",
      tagline: "You create your own path.",
      image: "/assets/adeola2020_a_cheerful_and_imaginative_person_surrounded_by_scat_bd79f25b-94eb-40cb-8565-beb87e4f0704_1750288019564.png",
      description: "The Explorer is naturally curious and thrives on variety. You prefer flexibility over rigid schedules, and you're energized by new experiences. Traditional productivity advice often feels restrictive because your mind works best when it has room to wander and discover.",
      fullDescription: [
        "You might have a dozen interests at once, and that's not a problem—it's how you learn. You connect ideas across disciplines and find inspiration in unexpected places. Structure feels confining, but complete chaos doesn't work either.",
        "Your challenge is finding systems that bend without breaking. You need frameworks that support your curiosity rather than limit it. When you find the right balance of freedom and focus, you can accomplish remarkable things.",
        "You thrive when you have permission to explore and the tools to capture what you find."
      ]
    },
    {
      id: "accelerator", 
      name: "The Firestarter",
      tagline: "You are driven by spark.",
      image: "/assets/adeola2020_a_cheerful_and_imaginative_person_surrounded_by_scat_bd79f25b-94eb-40cb-8565-beb87e4f0704_1750288019564.png",
      description: "The Firestarter is a creative ignition switch—bursting with energy when inspiration hits. You move fast, think in flashes, and often ride the wave of adrenaline as a project comes alive. When you're \"on,\" there's nothing quite like it.",
      fullDescription: [
        "Deadlines don't scare you—they activate you. In fact, without a sense of urgency, your attention can drift. Structure might feel stifling. You often resist rigid schedules and traditional routines because they dull your instincts.",
        "You have a gift for getting things moving. Starting something new excites you in a way that's hard to describe. But the challenge is keeping that momentum once the initial rush fades. You may bounce between ideas or abandon projects too early—not from lack of talent, but from the need to feel lit up.",
        "You are most alive in the spark between idea and action."
      ]
    },
    {
      id: "harmonizer",
      name: "The Integrator", 
      tagline: "You crave alignment.",
      image: "/assets/adeola2020_an_expressive_illustration_of_a_thoughtful_person_ga_a6681bc9-45e9-4c2c-b1fa-961885775c35_1750287981899.png",
      description: "The Integrator is introspective and values-driven. You don't just want to be productive—you want your actions to feel meaningful. If you're going to spend time on something, it needs to resonate.",
      fullDescription: [
        "You're deeply thoughtful and emotionally intelligent. You think in connections, often linking ideas across fields, people, or systems. You might journal, reflect, or talk things through before you act. You're not easily influenced by trends—you have your own compass.",
        "At your best, you create work that's nuanced and rich with purpose. But when misaligned, you can spiral into overthinking or inertia. You may struggle to get started if you don't feel emotionally connected to what you're doing.",
        "You find power when your actions match your values."
      ]
    },
    {
      id: "analyzer",
      name: "The Executor",
      tagline: "You are a finisher.",
      image: "/assets/adeola2020_a_cheerful_and_imaginative_person_surrounded_by_scat_bd79f25b-94eb-40cb-8565-beb87e4f0704_1750288019564.png",
      description: "The Executor is focused, efficient, and steady. You love getting things done—and you're great at it. While others may lose steam, you keep showing up. Your strength is in follow-through.",
      fullDescription: [
        "You naturally break tasks down and move through them with consistency. You might not need elaborate systems—you just need a clear goal and space to get it done. You like when expectations are defined and progress is measurable.",
        "But too much ambiguity can frustrate you. You might avoid complex or creative projects that lack clear endpoints. Sometimes you forget to pause, reflect, or question whether the task still matters—you just keep going.",
        "You feel strongest when you're in motion, ticking things off and making things real."
      ]
    },
    {
      id: "innovator",
      name: "The Visionary",
      tagline: "You are a pattern-seer.",
      image: "/assets/adeola2020_an_expressive_illustration_of_a_thoughtful_person_ga_a6681bc9-45e9-4c2c-b1fa-961885775c35_1750287981899.png",
      description: "The Visionary operates in possibility. You're constantly scanning for big ideas, future trends, or new ways to see the world. You think abstractly and thrive when you have space to imagine without limits.",
      fullDescription: [
        "Your creativity is expansive. One idea leads to another, and before long, you've mapped out an entirely new system or concept. You don't just dream—you conceptualize. You might find yourself jumping between notebooks, whiteboards, or voice notes just to keep up.",
        "Yet translating vision into execution can be tricky. You may struggle to stay grounded or narrow your focus. Too many options can become overwhelming. Still, your ability to imagine what's next is powerful and rare.",
        "You are at your best when you have freedom to explore and permission to dream."
      ]
    },
    {
      id: "collaborator",
      name: "The Alchemist",
      tagline: "You are a shapeshifter.",
      image: "/assets/adeola2020_a_cheerful_and_imaginative_person_surrounded_by_scat_bd79f25b-94eb-40cb-8565-beb87e4f0704_1750288019564.png",
      description: "The Alchemist works in cycles, not checklists. Your productivity isn't linear—it's rhythmic. You rely on intuition, energy, and emotional resonance to guide your focus. Some days you move mountains. Other days, you need to retreat and recharge.",
      fullDescription: [
        "You may not always know how you get things done—but you do. You adapt, pivot, and find your way through by feeling it out. You don't just respond to structure; you remix it. Conventional systems often feel too rigid or artificial.",
        "Your magic lies in flow and flexibility. When you're in sync with your environment or emotions, your creativity is magnetic. But that same sensitivity can lead to inconsistency. You may abandon tools, lose interest mid-stream, or become disoriented by pressure to conform.",
        "You thrive when you give yourself permission to move your own way."
      ]
    }
  ];

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
              <Link href="/" className="text-neutral-600 hover:text-primary transition-colors">Home</Link>
              <Link href="/about" className="text-neutral-600 hover:text-primary transition-colors">About</Link>
              <Link href="/quiz" className="text-neutral-600 hover:text-primary transition-colors">Take Quiz</Link>
            </nav>
          </div>
        </div>
      </header>

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
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
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
                    <div className="p-8 space-y-6">
                      <div className="flex flex-col lg:flex-row gap-8 items-start">
                        <div className="flex-1">
                          <p className="text-lg text-neutral-700 leading-relaxed">
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
                      <div className="flex flex-wrap gap-2 pt-4">
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

                      {/* Strengths and Growth Areas */}
                      <div className="grid md:grid-cols-2 gap-8 pt-6">
                        <div>
                          <h4 className="font-bold text-neutral-800 mb-4 flex items-center">
                            <i className="fas fa-star text-yellow-500 mr-2"></i>
                            Core Strengths
                          </h4>
                          <ul className="space-y-2">
                            {archetypeData.strengths.map((strength, i) => (
                              <li key={i} className="flex items-start space-x-2">
                                <i className="fas fa-check-circle text-green-500 mt-1"></i>
                                <span className="text-neutral-700">{strength}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-bold text-neutral-800 mb-4 flex items-center">
                            <i className="fas fa-arrow-up text-blue-500 mr-2"></i>
                            Growth Areas
                          </h4>
                          <ul className="space-y-2">
                            {archetypeData.growthAreas.map((area, i) => (
                              <li key={i} className="flex items-start space-x-2">
                                <i className={`fas fa-arrow-up text-${archetypeData.color}-500 mt-1`}></i>
                                <span className="text-neutral-700">{area}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Recommended Tools */}
                      <div className="bg-neutral-50 rounded-xl p-6 mt-8">
                        <h4 className="font-bold text-neutral-800 mb-4 flex items-center">
                          <i className="fas fa-tools text-primary mr-2"></i>
                          Recommended Tools & Strategies
                        </h4>
                        <div className="space-y-3">
                          {archetypeData.tools.map((tool, i) => (
                            <div key={i} className="flex items-center justify-between">
                              <span className="text-neutral-700 font-medium">{tool.name}</span>
                              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                                {tool.match}% Match
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="text-center pt-6">
                        <Link href="/quiz">
                          <Button className={`bg-gradient-to-r ${archetypeData.gradientFrom} ${archetypeData.gradientTo} text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200`}>
                            <i className="fas fa-play mr-2"></i>
                            Discover Your Archetype
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