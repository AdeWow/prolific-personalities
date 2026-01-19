import { Header } from "@/components/header";
import { QuizContainer } from "@/components/quiz-container";
import { SEOHead } from "@/components/seo-head";

export default function Quiz() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <SEOHead
        title="Free Productivity Test & Quiz - 28 Research-Backed Questions"
        description="Take our free 5-minute productivity test with 28 research-backed questions. Discover your unique productivity archetype and get personalized strategies that work for your brain. No signup required."
        keywords="productivity test, productivity quiz, free productivity test, work style quiz, productivity assessment, focus test, time management quiz, procrastination test, ADHD productivity quiz, executive function assessment"
        canonicalUrl={typeof window !== 'undefined' ? `${window.location.origin}/quiz` : undefined}
      />
      <Header />
      <main id="main-content" role="main">
        <section className="py-12" aria-labelledby="quiz-title">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <QuizContainer showHeader={true} showFocusIndicator={true} />
        </div>
        </section>
      </main>
    </div>
  );
}
