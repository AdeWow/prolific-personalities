import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/header";
import { SEOHead } from "@/components/seo-head";
import { ExternalLink, Sparkles, Target, Brain, Zap, Compass, Lightbulb } from "lucide-react";

export default function Resources() {
  const archetypeResources = {
    "chaotic-creative": {
      name: "Chaotic Creative",
      icon: Sparkles,
      color: "from-accent to-secondary",
      essentialStack: [
        { name: "Voice Memos", cost: "Free", purpose: "Fastest idea capture" },
        { name: "Evernote or Google Keep", cost: "Free-$10/mo", purpose: "Organize chaos" },
        { name: "Trello", cost: "Free", purpose: "Visual project boards" },
        { name: "Freedom", cost: "$9/mo", purpose: "Block distractions during bursts" },
      ],
      why: "Low friction, visual, capture-first-organize-later, respect bursts"
    },
    "anxious-perfectionist": {
      name: "Anxious Perfectionist",
      icon: Target,
      color: "from-blue-500 to-cyan-500",
      essentialStack: [
        { name: "Todoist", cost: "Free-$4/mo", purpose: "Clean, reliable task lists" },
        { name: "Freedom", cost: "$9/mo", purpose: "Eliminate perfectionism rabbit holes" },
        { name: "Brain.fm", cost: "$10/mo", purpose: "Focus music to reduce anxiety" },
        { name: "Notion", cost: "Free-$10/mo", purpose: "Reference materials organized" },
      ],
      why: "Reduce overwhelm, limit options, clear structure, focus support"
    },
    "structured-achiever": {
      name: "Structured Achiever",
      icon: Brain,
      color: "from-primary to-accent",
      essentialStack: [
        { name: "Things 3 or Todoist", cost: "$50 or Free-$4/mo", purpose: "Reliable task management" },
        { name: "Toggl", cost: "Free-$10/mo", purpose: "Track actual time spent" },
        { name: "Habitify", cost: "Free-$5/mo", purpose: "Build consistent habits" },
        { name: "Fantastical or Google Calendar", cost: "Free-$5/mo", purpose: "Schedule everything" },
      ],
      why: "Structure, consistency, measurement, proven systems"
    },
    "novelty-seeker": {
      name: "Novelty Seeker",
      icon: Zap,
      color: "from-orange-500 to-red-500",
      essentialStack: [
        { name: "Trello", cost: "Free", purpose: "Visual variety" },
        { name: "Forest App", cost: "$2", purpose: "Gamified focus" },
        { name: "Notion", cost: "Free-$10/mo", purpose: "Rotate project views" },
        { name: "Evernote", cost: "Free-$10/mo", purpose: "Capture new ideas" },
      ],
      why: "Visual stimulation, variety, gamification, multiple project juggling"
    },
    "strategic-planner": {
      name: "Strategic Planner",
      icon: Compass,
      color: "from-green-500 to-teal-500",
      essentialStack: [
        { name: "Notion or Asana", cost: "Free-$11/mo", purpose: "Comprehensive planning" },
        { name: "RescueTime", cost: "Free-$12/mo", purpose: "Data on time use" },
        { name: "Sunsama", cost: "$20/mo", purpose: "Thoughtful daily planning" },
        { name: "Obsidian or Roam", cost: "Free-$15/mo", purpose: "Strategic thinking notes" },
      ],
      why: "Big-picture planning, data-driven, comprehensive systems, strategic thinking"
    },
    "flexible-improviser": {
      name: "Flexible Improviser",
      icon: Lightbulb,
      color: "from-yellow-500 to-amber-500",
      essentialStack: [
        { name: "Voice Memos", cost: "Free", purpose: "Zero-friction capture" },
        { name: "Google Keep", cost: "Free", purpose: "Simple, optional organization" },
        { name: "Forest App", cost: "$2", purpose: "Flexible focus durations" },
        { name: "Notion", cost: "Free", purpose: "Momentum maps (optional structure)" },
      ],
      why: "Minimal maintenance, respect energy cycles, optional usage, flexibility"
    },
  };

  const universalTools = [
    { name: "Notion", category: "Project Management", archetypes: "All (customizable)", primaryUse: "Knowledge base, databases, docs", cost: "Free-$10/mo", whyRecommended: "Flexible, powerful, customizable to any archetype style", bestFor: "Building comprehensive systems" },
    { name: "Todoist", category: "Task Management", archetypes: "Structured Achiever, Strategic Planner", primaryUse: "Clean task lists with priorities", cost: "Free-$4/mo", whyRecommended: "Simple, reliable, recurring tasks", bestFor: "People who like clear lists" },
    { name: "Trello", category: "Visual Organization", archetypes: "Chaotic Creative, Novelty Seeker", primaryUse: "Kanban boards for visual workflow", cost: "Free-$12/mo", whyRecommended: "Visual, flexible, drag-and-drop simplicity", bestFor: "Visual thinkers and project managers" },
    { name: "Forest App", category: "Focus & Blocking", archetypes: "Novelty Seeker, Flexible Improviser", primaryUse: "Gamified focus sessions", cost: "$2 one-time", whyRecommended: "Fun, visual, respects different focus durations", bestFor: "People motivated by gamification" },
    { name: "Freedom", category: "Focus & Blocking", archetypes: "Chaotic Creative, Anxious Perfectionist", primaryUse: "Block distracting sites/apps", cost: "$9/mo or $40/year", whyRecommended: "Powerful blocking, scheduled sessions", bestFor: "Chronic procrastinators needing hard blocks" },
    { name: "RescueTime", category: "Time Tracking", archetypes: "Strategic Planner, Structured Achiever", primaryUse: "Automatic time tracking & reports", cost: "Free-$12/mo", whyRecommended: "Data-driven insights into time use", bestFor: "People who want objective productivity data" },
    { name: "Brain.fm", category: "Focus Music", archetypes: "Anxious Perfectionist, Strategic Planner", primaryUse: "AI-generated focus music", cost: "$10/mo", whyRecommended: "Science-backed music for concentration", bestFor: "People distracted by silence or normal music" },
    { name: "Sunsama", category: "Daily Planning", archetypes: "Strategic Planner, Structured Achiever", primaryUse: "Thoughtful daily planning ritual", cost: "$20/mo", whyRecommended: "Intentional planning, integrates calendars & tasks", bestFor: "People who want structured reflection" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <SEOHead
        title="Productivity Tools & Resources"
        description="Find the perfect productivity tools matched to your archetype. Curated recommendations for task management, focus apps, time tracking, and more."
        keywords="productivity tools, best productivity apps, time management tools, focus apps, task management software, productivity resources"
      />
      <Header />

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 mb-12">
            <Badge className="inline-flex items-center px-6 py-3 bg-primary/10 border-primary/20 text-primary font-semibold">
              Curated Productivity Resources
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white">
              Tools & Resources <span className="text-primary">for Every Archetype</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Not all productivity tools work for everyone. Find the perfect stack matched to your unique working style.
            </p>
          </div>

          <div className="flex justify-center mb-12">
            <Link href="/quiz">
              <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200" data-testid="button-discover-archetype">
                Take the Quiz First
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="by-archetype" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="by-archetype" data-testid="tab-by-archetype">By Archetype</TabsTrigger>
              <TabsTrigger value="all-tools" data-testid="tab-all-tools">All Tools</TabsTrigger>
            </TabsList>

            <TabsContent value="by-archetype" className="space-y-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(archetypeResources).map(([key, archetype]) => {
                  const Icon = archetype.icon;
                  return (
                    <Card key={key} className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
                      <CardHeader>
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${archetype.color} flex items-center justify-center mb-4`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">{archetype.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Essential Stack:</h4>
                          <div className="space-y-3">
                            {archetype.essentialStack.map((tool, idx) => (
                              <div key={idx} className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                                <div className="flex justify-between items-start mb-1">
                                  <span className="font-semibold text-gray-900 dark:text-white text-sm">{tool.name}</span>
                                  <Badge variant="outline" className="text-xs">{tool.cost}</Badge>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{tool.purpose}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            <strong className="text-primary">Why These:</strong> {archetype.why}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10 border-primary/20 shadow-lg mt-12">
                <CardContent className="p-8 text-center">
                  <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                    Not sure which archetype you are?
                  </p>
                  <Link href="/quiz">
                    <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-semibold" data-testid="button-take-quiz">
                      Take the Free Assessment
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="all-tools">
              <Card className="bg-white dark:bg-gray-800 shadow-lg">
                <CardContent className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Tool</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Category</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Best For Archetypes</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Cost</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Primary Use</th>
                        </tr>
                      </thead>
                      <tbody>
                        {universalTools.map((tool, idx) => (
                          <tr key={idx} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                            <td className="py-4 px-4">
                              <div className="font-semibold text-gray-900 dark:text-white">{tool.name}</div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">{tool.bestFor}</div>
                            </td>
                            <td className="py-4 px-4">
                              <Badge variant="outline" className="text-xs">{tool.category}</Badge>
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-700 dark:text-gray-300">{tool.archetypes}</td>
                            <td className="py-4 px-4">
                              <span className="text-sm font-semibold text-primary">{tool.cost}</span>
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-700 dark:text-gray-300">{tool.primaryUse}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <strong className="text-gray-900 dark:text-white">Note:</strong> These tools are recommendations based on archetype research. The best tools are the ones you'll actually use consistently. Start with one or two that resonate with your working style.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card className="bg-white dark:bg-gray-800 shadow-lg mt-12">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">How to Choose Your Stack</h3>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                    <span className="text-primary font-bold text-lg">1</span>
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Start Small</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Don't try to implement everything at once. Pick 1-2 tools that solve your biggest pain point.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                    <span className="text-primary font-bold text-lg">2</span>
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Test & Adjust</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Give each tool at least 2 weeks of consistent use before deciding if it works for you.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                    <span className="text-primary font-bold text-lg">3</span>
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Match Your Style</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Choose tools that align with your natural tendencies, not what works for others.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
