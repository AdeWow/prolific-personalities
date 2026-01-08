import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { SEOHead } from "@/components/seo-head";

export default function FAQ() {
  const faqs = [
    {
      question: "What is Prolific Personalities?",
      answer: "Prolific Personalities is a research-backed assessment that identifies your unique productivity archetype and provides personalized strategies to help you overcome procrastination, distraction, and overwhelm."
    },
    {
      question: "How long does the quiz take?",
      answer: "Most people finish in under 5 minutes. The questions are quick, intuitive, and designed to surface patterns in how you focus, plan, and execute."
    },
    {
      question: "What makes this different from other personality tests?",
      answer: "Unlike generic personality quizzes, this assessment is grounded in behavioral psychology, cognitive science, and executive function theory. It's not about labeling you—it's about helping you work with your natural tendencies, not against them."
    },
    {
      question: "What do I get after the quiz?",
      answer: "You'll receive a detailed summary of your productivity archetype, including your working style, strengths, blind spots, and a personalized toolkit of strategies and tools that actually match how your brain works."
    },
    {
      question: "Can I belong to more than one archetype?",
      answer: "Many people resonate with more than one, but the quiz identifies your dominant pattern. That said, your results will evolve with self-awareness and practice—and we encourage revisiting them over time."
    },
    {
      question: "What if I don't fit neatly into any archetype?",
      answer: "If you score in the balanced range across all dimensions with no clear winner, you may be an Adaptive Generalist—someone whose productivity style naturally shifts based on context. This isn't a problem to fix; it's actually a sophisticated way of working. You're a 'productivity chameleon' who can borrow strategies from multiple archetypes depending on the situation. Your premium playbook includes a 4-week experimentation protocol to help you identify which approaches work best for different types of tasks."
    },
    {
      question: "Is this based on real science?",
      answer: "Yes. The assessment draws from cognitive load theory, self-determination theory, executive function research, and motivational psychology. We're not offering gimmicks—we're translating real science into practical insight."
    },
    {
      question: "Is it free?",
      answer: "Yes, taking the core quiz and receiving your archetype summary is free. Some additional resources and deeper custom reports may be available in future versions."
    },
    {
      question: "Will this actually help me be more productive?",
      answer: "If you've ever felt like traditional productivity systems weren't built for you—this is why. We believe that real productivity starts with understanding yourself. This quiz helps you stop forcing what doesn't fit and start applying strategies that do."
    },
    {
      question: "Do I need to create an account?",
      answer: "No account is required to take the quiz or view your results. If we later offer personalized dashboards or deeper insights, you'll have the option to sign up—but it's never mandatory."
    },
    {
      question: "Can I share my results?",
      answer: "Yes. You'll have the option to copy a summary or share a link to your archetype page once you complete the quiz."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <SEOHead
        title="Frequently Asked Questions"
        description="Find answers to common questions about Prolific Personalities productivity assessment. Learn how it works, what makes it different, and how it can help you."
        keywords="productivity FAQ, personality assessment questions, productivity quiz help, prolific personalities FAQ"
      />
      <Header />

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary/10 to-secondary/10 border-0 text-primary font-semibold">
              <i className="fas fa-question-circle mr-2"></i>
              Frequently Asked Questions
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
              Got <span className="text-gradient">Questions?</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Find answers to common questions about Prolific Personalities, how the assessment works, and what makes it different.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow duration-200">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-foreground mb-4 flex items-start">
                    <span className="text-primary mr-3 mt-1">{index + 1}.</span>
                    {faq.question}
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed ml-8">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16 p-8 bg-white rounded-2xl shadow-lg">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Ready to Discover Your Productivity Archetype?
            </h3>
            <p className="text-muted-foreground mb-6 text-lg">
              Take our 5-minute assessment and unlock personalized strategies that work with your brain, not against it.
            </p>
            <Link href="/quiz">
              <Button className="gradient-primary text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
                <i className="fas fa-play mr-2"></i>
                Take the Quiz
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}