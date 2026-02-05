import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { SEOHead } from "@/components/seo-head";
import { Check } from "lucide-react";
import founderImage from "@assets/adeola_awowale_25-04-08_MSFTAccelerate_0310_1770267717112.jpg";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted dark:from-card dark:to-background">
      <SEOHead
        title="About | Prolific Personalities"
        description="Learn why we built Prolific Personalities — a research-backed platform that matches productivity strategies to how your brain actually works."
        keywords="about prolific personalities, productivity platform, personalized productivity, research-backed assessment"
      />
      <Header />
      <main id="main-content" role="main">
        {/* Section 1: Hero */}
        <section className="py-16 md:py-20" aria-labelledby="about-title">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 id="about-title" className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              About Prolific Personalities
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground italic leading-relaxed">
              "You're not lazy. You're not broken. You just need a different approach."
            </p>
          </div>
        </section>

        <div className="border-t border-slate-200 my-8" />

        {/* Section 2: Why We Exist */}
        <section className="py-12 md:py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-foreground mb-4">Why We Exist</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Most productivity advice fails because it's generic. It assumes everyone is wired the same way — when in reality, people vary widely in how they think, focus, and stay motivated.
              </p>
              <p>
                Productivity becomes sustainable only when it's personalized. By understanding your patterns and tendencies, we help you identify what actually works for you.
              </p>
            </div>
          </div>
        </section>

        <div className="border-t border-slate-200 my-8" />

        {/* Section 3: Meet the Founder */}
        <section className="py-12 md:py-16 bg-white dark:bg-card/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-5 gap-8 md:gap-12 items-start">
              {/* Photo Column (40%) */}
              <div className="md:col-span-2 flex justify-center md:justify-start">
                <img 
                  src={founderImage}
                  alt="Adeola, Founder of Prolific Personalities"
                  className="w-full max-w-[280px] md:max-w-[400px] object-cover object-top rounded-xl shadow-md"
                />
              </div>
              
              {/* Story Column (60%) */}
              <div className="md:col-span-3 border-l-2 border-teal-500 pl-6">
                <h2 className="text-xl font-bold text-foreground mb-6">Meet the Founder</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    I built Prolific Personalities because I needed it myself.
                  </p>
                  <p>
                    I spent years cycling through productivity systems that worked for everyone except me — Pomodoro, time-blocking, bullet journals, you name it. Nothing stuck. And for a long time, I thought the problem was me. Not enough discipline. Not enough willpower. Not trying hard enough.
                  </p>
                  <p>
                    Then I started researching. I dug into executive function theory, cognitive load science, and motivation psychology. What I found changed everything: personality traits moderate how effective any given productivity strategy is by 27–42%. There is no 'best' system. There's only the best system for you.
                  </p>
                  <p>
                    That's what Prolific Personalities is — the tool I wish I'd had years ago. Every recommendation on this platform is grounded in real research, mapped to your specific patterns, and designed to actually work with how your brain operates — not against it.
                  </p>
                </div>
                <p className="text-slate-500 font-medium mt-6">
                  — Adeola, Founder
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="border-t border-slate-200 my-8" />

        {/* Section 4: What Makes Us Different */}
        <section className="py-12 md:py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-foreground mb-6">What Makes Us Different</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <span className="text-primary mt-0.5"><Check className="h-5 w-5" /></span>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Personality-first approach</h3>
                  <p className="text-muted-foreground text-sm">Map to one of six productivity archetypes with tailored insights.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary mt-0.5"><Check className="h-5 w-5" /></span>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Backed by behavioral science</h3>
                  <p className="text-muted-foreground text-sm">Built on executive function theory, cognitive load theory, and motivation science.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary mt-0.5"><Check className="h-5 w-5" /></span>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Actionable over aspirational</h3>
                  <p className="text-muted-foreground text-sm">Clear next steps and systems you can actually follow through on.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary mt-0.5"><Check className="h-5 w-5" /></span>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Designed for real humans</h3>
                  <p className="text-muted-foreground text-sm">Especially valuable for neurodivergent, multi-passionate people.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="border-t border-slate-200 my-8" />

        {/* Section 5: Who It's For */}
        <section className="py-12 md:py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-foreground mb-4">Who It's For</h2>
            <ul className="space-y-3">
              {[
                "Creatives who struggle to stay focused and organized",
                "Professionals who are highly driven but easily overwhelmed", 
                "People with ADHD or executive dysfunction",
                "High-achievers battling burnout",
                "Anyone who wants sustainable productivity"
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-primary mt-0.5"><Check className="h-5 w-5" /></span>
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Section 6: CTA */}
        <section className="py-16 md:py-20 bg-slate-800">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to find what actually works for you?
            </h2>
            <p className="text-slate-300 text-lg mb-8">
              Take our free 5-minute assessment and discover your productivity archetype.
            </p>
            <Link href="/quiz">
              <Button className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 text-lg rounded-xl w-full sm:w-auto">
                Discover Your Type
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
