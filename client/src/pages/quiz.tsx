import { Header } from "@/components/header";
import { QuizContainer } from "@/components/quiz-container";

export default function Quiz() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-indigo-50">
      <Header />
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <QuizContainer showHeader={true} showFocusIndicator={true} />
        </div>
      </section>
    </div>
  );
}
