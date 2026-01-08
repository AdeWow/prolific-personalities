import { Header } from "@/components/header";
import { QuizContainer } from "@/components/quiz-container";
import { SEOHead } from "@/components/seo-head";

export default function Quiz() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <SEOHead
        title="Productivity Assessment Quiz"
        description="Take our free 5-minute assessment to discover your unique productivity archetype. Get personalized strategies based on how your brain naturally works."
        keywords="productivity quiz, productivity assessment, productivity test, work style quiz, focus assessment"
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
