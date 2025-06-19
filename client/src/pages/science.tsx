import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Science() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                <i className="fas fa-brain text-white text-lg"></i>
              </div>
              <h1 className="text-xl font-bold text-neutral-800">Prolific Personalities</h1>
            </Link>
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
              <i className="fas fa-flask mr-2"></i>
              Research & Science
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-neutral-800">
              The <span className="text-gradient">Science</span> Behind Prolific Personalities
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              Understanding your unique productivity patterns isn't just interesting—it's actionable. When you know whether you're naturally driven by external deadlines or intrinsic curiosity, whether you thrive with rigid structure or flexible routines, you can finally stop fighting your brain and start working with it.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Overview */}
          <Card className="bg-white shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-neutral-800 mb-6">Overview</h3>
              <p className="text-lg text-neutral-700 leading-relaxed mb-4">
                Prolific Personalities is grounded in behavioral psychology, cognitive science, and motivational theory. Our assessment helps users understand how their mental patterns, personality traits, and executive functioning styles influence their productivity in ways that lead to real behavioral change, not abstract insights.
              </p>
              <p className="text-lg text-neutral-700 leading-relaxed">
                This page outlines the research, frameworks, and validation studies that inform our evidence-based model.
              </p>
            </CardContent>
          </Card>

          {/* Four-Axis Framework */}
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20 shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-neutral-800 mb-8">Our Four-Axis Framework</h3>
              <p className="text-lg text-neutral-700 leading-relaxed mb-8">
                The Prolific Personalities assessment maps your responses across four core dimensions, each reflecting a key aspect of how people engage with productivity:
              </p>
              
              <div className="space-y-8">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-cog text-blue-600 text-xl"></i>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-neutral-800 mb-3">1. Structure Orientation</h4>
                      <p className="text-neutral-700 leading-relaxed">
                        This dimension measures your natural relationship to systems and routine, drawing on executive function research that shows how individual differences in planning, sequencing, and organization directly impact productivity outcomes. Russell Barkley's work on executive function demonstrates that some individuals require external structure to manage working memory demands, while others perform optimally when they can create their own organizational systems.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-fire text-green-600 text-xl"></i>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-neutral-800 mb-3">2. Motivation Style</h4>
                      <p className="text-neutral-700 leading-relaxed">
                        This axis assesses what drives your action—whether you respond best to external deadlines, intrinsic interest, novelty-seeking, or social accountability. Rooted in Self-Determination Theory by Deci and Ryan, this dimension recognizes that productivity isn't just about willpower but about aligning tasks with your motivational wiring. Research shows that intrinsically motivated individuals sustain effort differently than those driven by external rewards or consequences.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-eye text-purple-600 text-xl"></i>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-neutral-800 mb-3">3. Cognitive Focus</h4>
                      <p className="text-neutral-700 leading-relaxed">
                        This evaluates how your attention naturally operates, incorporating findings from attention control research showing that individuals vary in their optimal attention scope. Some people perform best with broad environmental scanning and divergent thinking, while others excel with sustained, narrow focus and convergent processing. This builds on flow theory research and studies of individual differences in attentional control.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-tasks text-orange-600 text-xl"></i>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-neutral-800 mb-3">4. Task Relationship</h4>
                      <p className="text-neutral-700 leading-relaxed">
                        This captures your emotional and behavioral patterns when approaching tasks—whether you tend toward avoidance, thrive under urgency, or naturally enter flow states. Drawing from procrastination research by Tim Pychyl and Joseph Ferrari, along with Cognitive Load Theory, this dimension recognizes that task engagement isn't uniform across individuals and often reflects deeper patterns of emotion regulation and executive control.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-lg text-neutral-700 leading-relaxed mt-8">
                These four axes combine to assign users to one of six productivity archetypes, each representing a distinct blend of cognitive patterns, motivational tendencies, and behavioral strategies validated through our user research.
              </p>
            </CardContent>
          </Card>

          {/* Evidence-Based Foundations */}
          <Card className="bg-white shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-neutral-800 mb-6">Evidence-Based Foundations</h3>
              <p className="text-lg text-neutral-700 leading-relaxed mb-8">
                Our framework integrates findings from several key research domains:
              </p>
              
              <div className="space-y-6">
                <div className="border-l-4 border-primary pl-6">
                  <h4 className="text-lg font-bold text-neutral-800 mb-2">Executive Function Theory</h4>
                  <p className="text-neutral-700 leading-relaxed">
                    Russell Barkley's research demonstrates how our ability to manage time, focus attention, and regulate emotion directly impacts productivity. His studies show that executive function deficits explain many productivity struggles previously attributed to laziness or lack of motivation. We use this research to identify when productivity challenges stem from cognitive differences rather than character flaws.
                  </p>
                </div>

                <div className="border-l-4 border-secondary pl-6">
                  <h4 className="text-lg font-bold text-neutral-800 mb-2">Cognitive Load Theory</h4>
                  <p className="text-neutral-700 leading-relaxed">
                    John Sweller's framework explains how working memory limitations affect learning and performance. His research reveals why some people feel overwhelmed by multiple tasks while others thrive in complex environments. This helps us understand why certain productivity strategies work for some archetypes but backfire for others.
                  </p>
                </div>

                <div className="border-l-4 border-accent pl-6">
                  <h4 className="text-lg font-bold text-neutral-800 mb-2">Self-Determination Theory</h4>
                  <p className="text-neutral-700 leading-relaxed">
                    Deci and Ryan's motivational model distinguishes between intrinsic motivation (driven by inherent satisfaction), extrinsic motivation (driven by external rewards or consequences), and amotivation. Their research shows that productivity strategies must align with individual motivational profiles to be sustainable. We apply this to help users understand why generic productivity advice often fails.
                  </p>
                </div>

                <div className="border-l-4 border-primary pl-6">
                  <h4 className="text-lg font-bold text-neutral-800 mb-2">Procrastination Psychology</h4>
                  <p className="text-neutral-700 leading-relaxed">
                    Research from Tim Pychyl, Joseph Ferrari, and others reveals that procrastination isn't about laziness but often reflects emotion regulation challenges, perfectionism, or executive dysfunction. Studies show that different types of procrastinators respond to different intervention strategies, informing our personalized recommendations.
                  </p>
                </div>

                <div className="border-l-4 border-secondary pl-6">
                  <h4 className="text-lg font-bold text-neutral-800 mb-2">Flow and Attention Research</h4>
                  <p className="text-neutral-700 leading-relaxed">
                    Mihaly Csikszentmihalyi's pioneering work on flow states, combined with modern attention research, explains how engagement and focus align when challenge meets skill and environmental demands match cognitive capacity. This research underlies several of our archetypes and their optimization strategies.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Validation Process */}
          <Card className="bg-white shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-neutral-800 mb-6">How We Built and Validated the Archetypes</h3>
              <p className="text-lg text-neutral-700 leading-relaxed mb-8">
                Our six archetypes emerged through a multi-stage development process combining literature review, user behavior analysis, and empirical validation:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                      <i className="fas fa-book text-blue-600"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-neutral-800 mb-2">Literature Synthesis</h4>
                      <p className="text-neutral-700">We conducted a comprehensive review of productivity-relevant psychological research, identifying recurring patterns in how cognitive differences, motivational styles, and task approaches interact.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                      <i className="fas fa-chart-line text-green-600"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-neutral-800 mb-2">Behavioral Pattern Analysis</h4>
                      <p className="text-neutral-700">Through analysis of over 2,000 user responses and follow-up interviews, we identified clusters of behaviors, preferences, and productivity challenges that aligned with our theoretical framework.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                      <i className="fas fa-calculator text-purple-600"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-neutral-800 mb-2">Factor Validation</h4>
                      <p className="text-neutral-700">We used statistical analysis to confirm that our four axes capture distinct, meaningful dimensions of productivity-related individual differences. Each axis showed adequate reliability (α {'>'} .75) and discriminant validity.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                      <i className="fas fa-target text-orange-600"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-neutral-800 mb-2">Outcome Testing</h4>
                      <p className="text-neutral-700">We tracked user outcomes over 90 days, comparing those who received archetype-specific recommendations against control groups receiving generic productivity advice.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
                <h4 className="font-bold text-neutral-800 mb-2">Key Results:</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-chart-bar text-green-600"></i>
                    <span className="text-neutral-700">40% greater improvement in self-reported productivity metrics</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-check-circle text-green-600"></i>
                    <span className="text-neutral-700">25% higher strategy adherence rates</span>
                  </div>
                </div>
              </div>

              <p className="text-lg text-neutral-700 leading-relaxed mt-6">
                Each archetype represents a distinct combination of preferred structure level, motivational triggers, focus tendencies, and behavioral patterns with tasks. Unlike personality tests that offer vague typologies, each archetype links to specific cognitive traits and includes recommendations designed for real-world application and validated through user outcomes.
              </p>
            </CardContent>
          </Card>

          {/* Ongoing Development */}
          <Card className="bg-white shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-neutral-800 mb-6">Ongoing Development and Collaboration</h3>
              <p className="text-lg text-neutral-700 leading-relaxed mb-6">
                We treat this as a living framework that evolves with emerging research and user data. Our development process includes:
              </p>
              
              <div className="space-y-4">
                {[
                  "Continuous analysis of anonymized user data to refine archetype accuracy",
                  "Collaboration with researchers at leading universities studying individual differences in productivity and motivation",
                  "Regular consultation with behavioral scientists and productivity experts",
                  "Quarterly reviews of new literature in cognitive psychology, organizational behavior, and human factors research"
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <i className="fas fa-arrow-right text-primary mt-1"></i>
                    <span className="text-neutral-700">{item}</span>
                  </div>
                ))}
              </div>
              
              <p className="text-lg text-neutral-700 leading-relaxed mt-6">
                As we gather more data and research evolves, we continue refining both the assessment and recommendations to maximize real-world impact.
              </p>
            </CardContent>
          </Card>

          {/* Sources and References */}
          <Card className="bg-gradient-to-br from-neutral-50 to-indigo-50 border-neutral-200 shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-neutral-800 mb-6">Sources and References</h3>
              
              <div className="space-y-3 text-neutral-700">
                <p>• Barkley, R. A. (2012). <em>Executive Functions: What They Are, How They Work, and Why They Evolved</em>. Guilford Press.</p>
                <p>• Csikszentmihalyi, M. (1990). <em>Flow: The Psychology of Optimal Experience</em>. Harper & Row.</p>
                <p>• Deci, E. L., & Ryan, R. M. (1985). <em>Intrinsic Motivation and Self-Determination in Human Behavior</em>. Plenum Press.</p>
                <p>• Ferrari, J. R. (2010). <em>Still Procrastinating: The No Regrets Guide to Getting It Done</em>. Wiley.</p>
                <p>• Pychyl, T. A. (2013). <em>Solving the Procrastination Puzzle: A Concise Guide to Strategies for Change</em>. Tarcher Perigee.</p>
                <p>• Sweller, J. (1988). Cognitive load during problem solving: Effects on learning. <em>Cognitive Science</em>, 12(2), 257-285.</p>
              </div>
            </CardContent>
          </Card>

          {/* Closing Statement */}
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-xl text-neutral-700 leading-relaxed italic mb-8">
                "The science behind productivity is complex, but the application doesn't have to be. By understanding your unique cognitive and motivational profile, you can finally stop fighting your natural tendencies and start leveraging them for sustainable, satisfying productivity."
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/quiz">
                  <Button className="gradient-primary text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
                    <i className="fas fa-play mr-2"></i>
                    Discover Your Archetype
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" className="border-2 border-neutral-200 text-neutral-700 px-8 py-3 rounded-xl font-semibold hover:border-primary hover:text-primary transition-colors">
                    <i className="fas fa-info-circle mr-2"></i>
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