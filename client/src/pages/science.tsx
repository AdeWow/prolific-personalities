import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";
import { SEOHead } from "@/components/seo-head";
import { PDFPreview } from "@/components/pdf-preview";
import { Brain, Target, Zap, BookOpen, Download, TrendingUp } from "lucide-react";

export default function Science() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted dark:from-card dark:to-background">
      <SEOHead
        title="The Science | Prolific Personalities"
        description="The peer-reviewed research behind personalized productivity. Built on executive function theory, cognitive load science, and motivation psychology."
        keywords="productivity science, cognitive science, executive function, motivation psychology, productivity research, personalized productivity"
      />
      <Header />
      <main id="main-content" role="main">
        <section className="py-16" aria-labelledby="science-title">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 mb-12">
            <Badge className="inline-flex items-center px-6 py-3 bg-primary/10 border-primary/20 text-primary font-semibold">
              Research-Backed Assessment
            </Badge>
            <h1 id="science-title" className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white">
              The Science Behind <span className="text-primary">Personalized Productivity</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              One-size-fits-all productivity advice doesn't work because we're all wired differently. Here's the research that proves it.
            </p>
            
            <div className="pt-4">
              <a href="/research-paper.pdf" download="Beyond-One-Size-Fits-All-Research-Paper.pdf">
                <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 gap-2" data-testid="button-download-research">
                  <Download className="h-5 w-5" />
                  Download Full Research Paper (PDF)
                </Button>
              </a>
            </div>
            
            {/* Section Navigation */}
            <nav className="pt-8 flex flex-wrap justify-center gap-x-2 gap-y-2 text-sm text-slate-500">
              <a href="#problem" className="hover:text-primary transition-colors">The Problem</a>
              <span className="text-slate-300">·</span>
              <a href="#framework" className="hover:text-primary transition-colors">Our Framework</a>
              <span className="text-slate-300">·</span>
              <a href="#personality" className="hover:text-primary transition-colors">Why Personality Matters</a>
              <span className="text-slate-300">·</span>
              <a href="#research-shows" className="hover:text-primary transition-colors">What Research Shows</a>
              <span className="text-slate-300">·</span>
              <a href="#our-research" className="hover:text-primary transition-colors">Our Research</a>
              <span className="text-slate-300">·</span>
              <a href="#sources" className="hover:text-primary transition-colors">Key Sources</a>
            </nav>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <Card id="problem" className="bg-white dark:bg-gray-800 shadow-lg border-l-4 border-l-red-500">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <Zap className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">The Problem</h2>
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    Despite a <strong>$60-85 billion</strong> productivity software market, most people still struggle. Why? Because generic advice ignores how your brain actually works.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400 mb-1">47 seconds</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Average attention span (down from 2.5 minutes in 2004)</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400 mb-1">10.5 minutes</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">How often we switch tasks on average</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10 border-primary/20 shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">The Solution: Personalization</h2>
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    Research shows personalized approaches dramatically outperform generic advice:
                  </p>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl">
                  <div className="text-3xl font-bold text-primary mb-2">40%</div>
                  <div className="text-gray-700 dark:text-gray-300">better results in education with personalized learning</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl">
                  <div className="text-3xl font-bold text-primary mb-2">30-50%</div>
                  <div className="text-gray-700 dark:text-gray-300">improvement in healthcare with personalized treatment</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl">
                  <div className="text-3xl font-bold text-primary mb-2">27-42%</div>
                  <div className="text-gray-700 dark:text-gray-300">productivity boost with matched strategies</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card id="framework" className="bg-white dark:bg-gray-800 shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-8">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Brain className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Four-Axis Framework</h2>
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    We measure four scientifically-validated dimensions that predict how you work best:
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 dark:bg-blue-500 text-white rounded-lg flex items-center justify-center font-bold text-sm">1</div>
                    Structure Orientation
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Do you need detailed plans, or do you work better with flexibility? This predicts whether rigid schedules help or hurt your productivity.
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-600 dark:bg-green-500 text-white rounded-lg flex items-center justify-center font-bold text-sm">2</div>
                    Motivation Style
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    What drives you—deadlines, curiosity, social accountability? Matching your motivation type to your tasks increases follow-through by <strong>40%</strong>.
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <div className="w-8 h-8 bg-accent text-white rounded-lg flex items-center justify-center font-bold text-sm">3</div>
                    Cognitive Focus
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    How much can your brain juggle at once? Your working memory capacity determines optimal task complexity and multitasking ability.
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <div className="w-8 h-8 bg-orange-600 dark:bg-orange-500 text-white rounded-lg flex items-center justify-center font-bold text-sm">4</div>
                    Task Relationship
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Do you procrastinate, thrive under pressure, or naturally enter flow? Understanding this pattern reveals which strategies will actually work for you.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card id="personality" className="bg-white dark:bg-gray-800 shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-primary/10 dark:bg-primary/20 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Why Personality Matters</h2>
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                    Your personality traits don't just affect your work style—they predict which productivity strategies will work for you.
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="border-l-4 border-primary dark:border-primary/50 pl-6 py-2">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Conscientiousness</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Highly organized people excel with rigid systems, but creatives need flexibility. The research shows forcing the wrong approach can <strong>reduce performance by 20-30%</strong>.
                  </p>
                </div>

                <div className="border-l-4 border-secondary dark:border-secondary/50 pl-6 py-2">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Neuroticism & Stress Response</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    People prone to anxiety benefit <strong>4x more</strong> from structured interventions (effect size: 0.42 vs. 0.11) than naturally calm individuals.
                  </p>
                </div>

                <div className="border-l-4 border-accent dark:border-accent/50 pl-6 py-2">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Executive Function & ADHD</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                    5-10% of adults have ADHD, which fundamentally changes how the brain manages tasks. Standard advice like "just focus" or "use willpower" doesn't work when your brain is wired differently.
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                    Strategy example: People with ADHD show 70-85% better task initiation with "body doubling" (working alongside others), while this strategy shows minimal benefit for neurotypical individuals.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card id="research-shows" className="bg-white dark:bg-gray-800 shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                  <BookOpen className="h-8 w-8 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">What the Research Shows</h2>
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    We reviewed eight popular productivity frameworks to find what actually works—and for whom:
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900 dark:text-white">Implementation Intentions (If-Then Planning)</h3>
                    <Badge className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">Strong Evidence</Badge>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    "If X happens, I'll do Y" plans increase goal achievement by <strong>65%</strong>. Works best for people who struggle with self-regulation.
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900 dark:text-white">Deep Work & Task Batching</h3>
                    <Badge className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">Strong Evidence</Badge>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    Task-switching creates "attention residue" that reduces performance by <strong>20-40%</strong>. Takes 23 minutes to refocus after interruption.
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900 dark:text-white">Pomodoro Technique</h3>
                    <Badge className="bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300">Mixed Results</Badge>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    Works well for some, but can <strong>interrupt flow states</strong> for others (especially ADHD hyperfocus). Effectiveness depends on your cognitive style.
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900 dark:text-white">Energy Management vs. Time Management</h3>
                    <Badge className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">Strong Evidence</Badge>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    Your cognitive performance varies <strong>20-30% throughout the day</strong>. Matching task difficulty to energy levels beats strict time blocking.
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Key Insight:</strong> No single strategy works for everyone. The most effective approach is matching strategies to your individual cognitive profile, personality traits, and neurodevelopmental characteristics.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card id="our-research" className="bg-white dark:bg-gray-800 shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Research</h2>
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    Our framework is built on an extensive literature review of peer-reviewed research in behavioral psychology, cognitive science, and productivity. We synthesized findings from over 40 published studies to develop our four-axis model and archetype classification system.
                  </p>
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    Our research paper is currently under peer review at <em>Personality and Individual Differences</em>.
                  </p>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <a href="/research-paper.pdf" download="Beyond-One-Size-Fits-All-Research-Paper.pdf" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
                  <Download className="h-4 w-4" />
                  <span className="underline">Read the full paper (PDF)</span>
                </a>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Want to Dive Deeper?</h2>
              <p className="text-gray-700 dark:text-gray-300">
                Preview our full research paper below, or download it for offline reading.
              </p>
            </div>

            <PDFPreview
              src="/research-paper.pdf"
              title="Beyond One-Size-Fits-All: An ATI Framework for Personalized Productivity"
              downloadFilename="Beyond-One-Size-Fits-All-Research-Paper.pdf"
              height="700px"
              showDownloadButton={true}
              collapsible={false}
              isPublic={true}
            />

            <Card id="sources" className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Key Sources:</h3>
                <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <p>• Gollwitzer, P. M., & Sheeran, P. (2006). Implementation intentions and goal achievement. <em>Advances in Experimental Social Psychology</em>.</p>
                  <p>• Steel, P. (2007). The nature of procrastination: A meta-analytic review. <em>Psychological Bulletin</em>.</p>
                  <p>• Wilmot, M. P., & Ones, D. S. (2019). A century of research on conscientiousness at work. <em>Proceedings of the National Academy of Sciences</em>.</p>
                  <p>• Plus 35+ additional peer-reviewed sources in the full paper</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10 border-primary/20 dark:border-primary/30 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed italic mb-8">
                "Stop fighting your brain. Start working with it."
              </p>
              
              <Link href="/quiz">
                <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200" data-testid="button-discover-archetype">
                  Take the Quiz
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        </section>
      </main>
    </div>
  );
}
