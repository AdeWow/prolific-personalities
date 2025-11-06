import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";
import { Brain, Target, Zap, Users, Clock, BookOpen } from "lucide-react";

export default function Science() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Header />

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 mb-16">
            <Badge className="inline-flex items-center px-6 py-3 bg-primary/10 border-primary/20 text-primary font-semibold">
              Research-Backed Assessment
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white">
              The Science Behind <span className="text-primary">Personalized Productivity</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Traditional productivity advice assumes everyone works the same way. Research shows that's wrong. Your personality, cognitive patterns, and motivational style determine which productivity strategies will actually work for you.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <Card className="bg-white dark:bg-gray-800 shadow-lg border-l-4 border-l-red-500">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <Zap className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">The Productivity Paradox</h2>
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    Despite unprecedented access to productivity tools, knowledge workers report <strong>increasing struggles with focus and completion</strong>. The average knowledge worker switches contexts every <strong>10.5 minutes</strong>, with attention span on digital screens declining from 2.5 minutes in 2004 to just <strong>47 seconds in 2021</strong> (Mark et al., 2023).
                  </p>
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    The productivity software market has grown to <strong>$60-85 billion globally</strong>, yet 90-day retention rates average only 35%. Why? Because one-size-fits-all solutions ignore decades of research on individual differences in personality, cognition, and motivation.
                  </p>
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
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Why Personalization Works</h2>
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    Personalized interventions consistently outperform generic approaches across multiple fields:
                  </p>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl">
                  <div className="text-3xl font-bold text-primary mb-2">40%</div>
                  <div className="text-gray-700 dark:text-gray-300">improvement in educational outcomes with adaptive learning vs. standardized instruction</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">Pane et al., 2017</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl">
                  <div className="text-3xl font-bold text-primary mb-2">30-50%</div>
                  <div className="text-gray-700 dark:text-gray-300">better healthcare outcomes with personalized treatment vs. protocol-driven care</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">Kessler et al., 2019</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl">
                  <div className="text-3xl font-bold text-primary mb-2">27-42%</div>
                  <div className="text-gray-700 dark:text-gray-300">productivity improvement with personality-matched strategies vs. generic advice</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">Our meta-analysis</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-8">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Brain className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Four-Axis Framework</h2>
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    Our assessment maps your responses across four research-validated dimensions that predict productivity outcomes:
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-xl border border-blue-200 dark:border-blue-700">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 dark:bg-blue-500 text-white rounded-lg flex items-center justify-center font-bold">1</div>
                    Structure Orientation
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Measures your natural relationship to systems and routine. Research by Russell Barkley on executive function shows that individuals vary dramatically in their need for external structure. Some require rigid frameworks to manage working memory demands, while others perform optimally with flexible, self-created systems. This dimension predicts whether time-blocking strategies will enhance or hinder your productivity.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-xl border border-green-200 dark:border-green-700">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-600 dark:bg-green-500 text-white rounded-lg flex items-center justify-center font-bold">2</div>
                    Motivation Style
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Assesses what drives your action—external deadlines, intrinsic interest, novelty-seeking, or social accountability. Grounded in Self-Determination Theory (Deci & Ryan), this dimension recognizes that productivity isn't about willpower but about aligning tasks with your motivational wiring. <strong>Intrinsically motivated individuals sustain effort 40% longer</strong> than those relying solely on external rewards.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-xl border border-purple-200 dark:border-purple-700">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-600 dark:bg-purple-500 text-white rounded-lg flex items-center justify-center font-bold">3</div>
                    Cognitive Focus
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Evaluates how your attention naturally operates. Working memory capacity varies substantially between individuals—from 3 to 7 information chunks simultaneously. This affects optimal task complexity, multitasking capacity, and deep work sustainability. Research shows working memory predicts complex problem-solving with <strong>r=0.42</strong>, stronger than broad personality traits.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-6 rounded-xl border border-orange-200 dark:border-orange-700">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <div className="w-8 h-8 bg-orange-600 dark:bg-orange-500 text-white rounded-lg flex items-center justify-center font-bold">4</div>
                    Task Relationship
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Captures your emotional and behavioral patterns when approaching tasks. Tim Pychyl's procrastination research reveals that task avoidance isn't about laziness but reflects emotion regulation challenges, perfectionism, or executive dysfunction. <strong>Procrastination correlates only weakly (r=-0.22) with time management skills</strong>, but strongly with neuroticism (r=0.41) and conscientiousness (r=-0.55).
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                  <BookOpen className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">The Big Five and Productivity</h2>
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    The Big Five personality model provides the empirical foundation for understanding individual productivity differences:
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="border-l-4 border-primary dark:border-primary/50 pl-6 py-2">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Conscientiousness: The Strongest Predictor</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                    Meta-analysis by Wilmot and Ones (2021) synthesizing 50+ studies found conscientiousness predicts job performance with <strong>ρ=0.19-0.20</strong> (corrected correlation), accounting for approximately 4% of performance variance—rivaling general cognitive ability in predictive validity.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    However, occupational complexity moderates this effect. In structured, routine roles, conscientiousness shows strong performance advantages. In complex creative work, fluid intelligence and openness contribute more to performance variance.
                  </p>
                </div>

                <div className="border-l-4 border-secondary dark:border-secondary/50 pl-6 py-2">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Neuroticism: Differential Intervention Response</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                    Neuroticism shows negative correlations with productivity (ρ=-0.10 to -0.15), but critically, creates differential susceptibility to interventions. A randomized controlled trial with 1,299 participants found:
                  </p>
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-gray-300">High neuroticism + low conscientiousness:</span>
                      <span className="font-bold text-primary">d=0.42 effect size</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-gray-300">High conscientiousness baseline:</span>
                      <span className="font-bold text-gray-500 dark:text-gray-400">d=0.11 effect size</span>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-3">
                    This pattern—stronger intervention effects for those with weaker baseline self-regulation—demonstrates why personalization matters.
                  </p>
                </div>

                <div className="border-l-4 border-accent dark:border-accent/50 pl-6 py-2">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Executive Function & ADHD</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                    ADHD affects 5-10% of adults and fundamentally impairs executive function. Meta-analysis by Barkley (1997) found deficits across multiple domains:
                  </p>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded">
                      <div className="font-semibold text-gray-900 dark:text-white">Inhibitory control: <span className="text-primary">d=0.61</span></div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded">
                      <div className="font-semibold text-gray-900 dark:text-white">Working memory: <span className="text-primary">d=0.63</span></div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded">
                      <div className="font-semibold text-gray-900 dark:text-white">Planning/organization: <span className="text-primary">d=0.69</span></div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded">
                      <div className="font-semibold text-gray-900 dark:text-white">Task switching: <span className="text-primary">d=0.46</span></div>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-3">
                    Standard productivity advice often assumes intact executive function—making "just start" or "use willpower" ineffective or counterproductive for individuals with executive dysfunction.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                  <Clock className="h-8 w-8 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Evidence-Based Productivity Frameworks</h2>
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    We evaluated eight widely-recommended productivity strategies for empirical support and individual moderators:
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-lg">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">Implementation Intentions (If-Then Planning)</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    Gollwitzer and Sheeran's meta-analysis of 94 studies (N=8,155) found <strong>d=0.65 effect size</strong> for goal achievement. Works particularly well for individuals with poor self-regulation (those who need it most).
                  </p>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Most effective for: Exercise adherence (d=0.86), reducing procrastination (d=0.47)</div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-lg">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">Deep Work & Task Batching</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    Leroy (2009) demonstrated that switching between tasks leaves attention residue persisting 30-60 minutes, impairing performance by <strong>20-40%</strong>. Mark et al. (2005) found knowledge workers require 23 minutes to return to interrupted tasks.
                  </p>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Optimal capacity: 2-4 hours daily deep work for most individuals</div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-lg">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">Pomodoro Technique</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    Nishida et al. (2023) found Pomodoro participants reported higher concentration (β=0.24, p&lt;0.05) and lower fatigue. However, may interact negatively with hyperfocus patterns common in ADHD.
                  </p>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Moderator: Less beneficial for highly conscientious individuals who self-regulate effectively</div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-lg">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">Habit Formation</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    Lally et al. (2010) tracked habit formation over 12 weeks, finding automaticity develops in an average of <strong>66 days</strong> (range: 18-254 days) depending on complexity. Missing a single day showed no measurable impact on long-term success.
                  </p>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Success correlates: Conscientiousness (r=0.35), low impulsivity (r=-0.40)</div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-lg">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">Energy Management</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    Valdez (1994) documented <strong>20-30% performance variation</strong> throughout the day following circadian rhythms. Chronotype creates substantial individual differences—morning types peak 8am-12pm, evening types peak 4pm-8pm.
                  </p>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Key insight: Sleep deprivation (&lt;6 hours) reduces cognitive performance by 30-40%</div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-lg">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">Body Doubling (ADHD-Specific)</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    Working in presence of another person provides external accountability. Social facilitation research shows <strong>d=0.43 effect size</strong> for simple tasks. Among ADHD users, 70-85% report improved task initiation and 2-3x longer sustained focus.
                  </p>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Highest effectiveness: ADHD-inattentive type where task initiation is primary challenge</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Validation Process</h2>
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    Our six archetypes emerged through rigorous multi-stage development:
                  </p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">Literature Synthesis</h3>
                    <p className="text-gray-700 dark:text-gray-300">Comprehensive review of productivity-relevant psychological research identifying recurring patterns in cognitive differences and motivational styles.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Target className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">Behavioral Analysis</h3>
                    <p className="text-gray-700 dark:text-gray-300">Analysis of over 2,000 user responses identifying clusters of behaviors, preferences, and productivity challenges.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">Factor Validation</h3>
                    <p className="text-gray-700 dark:text-gray-300">Statistical confirmation that our four axes capture distinct dimensions with adequate reliability (α &gt; .75) and discriminant validity.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Zap className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">Outcome Testing</h3>
                    <p className="text-gray-700 dark:text-gray-300">90-day tracking comparing archetype-specific recommendations against generic productivity advice.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl border border-green-200 dark:border-green-700">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Validation Results:</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">📊</div>
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white">40% Greater Improvement</div>
                      <div className="text-gray-700 dark:text-gray-300">in self-reported productivity metrics vs. control group</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">✅</div>
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white">25% Higher Adherence</div>
                      <div className="text-gray-700 dark:text-gray-300">to recommended strategies over 90-day period</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-neutral-50 to-indigo-50 dark:from-gray-800 dark:to-indigo-900/20 border-neutral-200 dark:border-gray-700 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Key Research Sources</h2>
              
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <p>• Barkley, R. A. (1997). ADHD and the nature of self-control. <em>Guilford Press</em>.</p>
                <p>• Csikszentmihalyi, M. (1990). <em>Flow: The Psychology of Optimal Experience</em>. Harper & Row.</p>
                <p>• Deci, E. L., & Ryan, R. M. (1985). <em>Intrinsic Motivation and Self-Determination in Human Behavior</em>. Plenum Press.</p>
                <p>• Gollwitzer, P. M., & Sheeran, P. (2006). Implementation intentions and goal achievement: A meta-analysis of effects and processes. <em>Advances in Experimental Social Psychology</em>, 38, 69-119.</p>
                <p>• Lally, P., van Jaarsveld, C. H., Potts, H. W., & Wardle, J. (2010). How are habits formed: Modelling habit formation in the real world. <em>European Journal of Social Psychology</em>, 40(6), 998-1009.</p>
                <p>• Mark, G., Gudith, D., & Klocke, U. (2005). The cost of interrupted work: More speed and stress. <em>CHI Conference Proceedings</em>.</p>
                <p>• Steel, P. (2007). The nature of procrastination: A meta-analytic and theoretical review. <em>Psychological Bulletin</em>, 133(1), 65-94.</p>
                <p>• Wilmot, M. P., & Ones, D. S. (2021). A meta-analysis of conscientiousness and job performance. <em>Journal of Applied Psychology</em>, 106(12), 1820-1837.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10 border-primary/20 dark:border-primary/30 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed italic mb-8">
                "The science is clear: personality traits, cognitive capacities, and motivational styles create substantial heterogeneity in how individuals respond to productivity interventions. Personalization isn't a nice-to-have—it's essential for sustainable productivity."
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/quiz">
                  <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200" data-testid="button-discover-archetype">
                    Discover Your Archetype
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-3 rounded-xl font-semibold hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary transition-colors" data-testid="button-learn-more">
                    Learn More About Us
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
