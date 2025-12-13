import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { SEOHead } from "@/components/seo-head";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Loader2, ChevronRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { quickScanQuestions } from "@/data/quick-scan-questions";
import { calculateQuickScanScores, determineArchetypeEnhanced } from "@/lib/quiz-logic";
import { trackEvent } from "@/lib/analytics";
import { Link } from "wouter";

type QuizAnswers = Record<string, string | number>;

function generateSessionId(): string {
  return `qs-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export default function QuickScan() {
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [sessionId] = useState(() => generateSessionId());
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const answeredCount = Object.keys(answers).length;
  const progressPercentage = (answeredCount / quickScanQuestions.length) * 100;
  const allAnswered = answeredCount === quickScanQuestions.length;

  const saveResultsMutation = useMutation({
    mutationFn: async (data: { sessionId: string; answers: QuizAnswers; scores: any; archetype: string; isQuickScan: boolean }) => {
      const response = await apiRequest("POST", "/api/quiz/results", data);
      return response.json();
    },
    onSuccess: () => {
      localStorage.setItem('pendingQuizSessionId', sessionId);
      setLocation(`/results/${sessionId}?quickscan=true`);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save results. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to save results:", error);
    },
  });

  const handleAnswerChange = (questionId: string, value: string | number, questionIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));

    setTimeout(() => {
      const nextIndex = questionIndex + 1;
      if (nextIndex < quickScanQuestions.length) {
        questionRefs.current[nextIndex]?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }, 150);
  };

  const handleSubmit = () => {
    if (!allAnswered) return;

    const scores = calculateQuickScanScores(answers);
    const result = determineArchetypeEnhanced(scores);
    trackEvent('quick_scan_completed', 'Quiz', `Archetype: ${result.primary.name}`, quickScanQuestions.length);
    
    saveResultsMutation.mutate({
      sessionId,
      answers,
      scores,
      archetype: result.primary.id,
      isQuickScan: true
    });
  };

  const renderQuestionOptions = (question: typeof quickScanQuestions[0], questionIndex: number) => {
    const currentValue = answers[question.id];

    if (question.type === 'likert' && question.scaleLabels) {
      return (
        <div className="space-y-4">
          <div className="flex justify-between text-xs sm:text-sm text-neutral-500 px-1">
            <span>{question.scaleLabels.min}</span>
            <span className="hidden sm:inline">Neutral</span>
            <span>{question.scaleLabels.max}</span>
          </div>
          <RadioGroup
            value={currentValue?.toString() || ''}
            onValueChange={(val) => handleAnswerChange(question.id, parseInt(val), questionIndex)}
            className="flex justify-between gap-2"
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <div key={num} className="flex-1">
                <RadioGroupItem
                  value={num.toString()}
                  id={`${question.id}-likert-${num}`}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={`${question.id}-likert-${num}`}
                  data-testid={`${question.id}-likert-option-${num}`}
                  className={cn(
                    "flex items-center justify-center cursor-pointer py-3 sm:py-4 rounded-xl border-2 text-base sm:text-lg font-semibold transition-all",
                    "hover:scale-105 active:scale-95",
                    currentValue === num
                      ? "border-teal-600 bg-teal-600 text-white shadow-lg"
                      : "border-neutral-200 bg-white text-neutral-700 hover:border-teal-400 hover:bg-teal-50"
                  )}
                >
                  {num}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      );
    }

    if (question.type === 'binary' && question.options) {
      return (
        <RadioGroup
          value={currentValue !== undefined ? currentValue.toString() : ''}
          onValueChange={(val) => handleAnswerChange(question.id, parseInt(val), questionIndex)}
          className="space-y-2"
        >
          {question.options.map((option, index) => (
            <div key={index}>
              <RadioGroupItem
                value={index.toString()}
                id={`${question.id}-option-${index}`}
                className="peer sr-only"
              />
              <Label
                htmlFor={`${question.id}-option-${index}`}
                data-testid={`${question.id}-option-${index}`}
                className={cn(
                  "flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all",
                  "hover:border-teal-400 hover:bg-teal-50",
                  currentValue === index
                    ? "border-teal-600 bg-teal-50 text-teal-900"
                    : "border-neutral-200 bg-white text-neutral-700"
                )}
              >
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-indigo-50">
      <SEOHead
        title="Quick Scan - 1 Minute Productivity Preview"
        description="Get a quick preview of your productivity archetype in just 1 minute with 5 key questions. Take the full quiz for detailed results."
        keywords="quick productivity quiz, fast personality test, 1 minute quiz, productivity preview"
      />
      <Header />
      
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Zap className="w-4 h-4" />
              Quick Scan • 1 minute
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-neutral-800 mb-3">
              Get a Quick Preview
            </h1>
            <p className="text-lg text-neutral-600">
              Answer 5 questions for a preview of your productivity style
            </p>
          </div>

          <Card className="bg-white shadow-xl border-0 overflow-hidden mb-6">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-neutral-600">
                  Quick Scan
                </span>
                <span className="text-sm font-medium text-teal-600">
                  {answeredCount} of {quickScanQuestions.length} answered
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </CardContent>
          </Card>

          <div className="space-y-4">
            {quickScanQuestions.map((question, index) => {
              const isAnswered = answers[question.id] !== undefined;

              return (
                <Card
                  key={question.id}
                  ref={(el) => (questionRefs.current[index] = el)}
                  data-testid={`quickscan-question-${question.id}`}
                  className={cn(
                    "transition-all duration-300 border-2",
                    isAnswered
                      ? "border-green-200 bg-green-50/50"
                      : "border-transparent hover:border-neutral-200"
                  )}
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <div className={cn(
                        "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                        isAnswered
                          ? "bg-green-500 text-white"
                          : "bg-teal-600 text-white"
                      )}>
                        {isAnswered ? "✓" : index + 1}
                      </div>
                      <h3 className="text-base sm:text-lg font-medium text-neutral-800 leading-relaxed flex-1">
                        {question.text}
                      </h3>
                    </div>
                    
                    {renderQuestionOptions(question, index)}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-8 space-y-4">
            <Button
              onClick={handleSubmit}
              disabled={!allAnswered || saveResultsMutation.isPending}
              className={cn(
                "w-full flex items-center justify-center gap-2 px-6 py-6 text-lg font-semibold",
                "bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800",
                "text-white shadow-lg hover:shadow-xl transition-all"
              )}
              data-testid="button-submit-quickscan"
            >
              {saveResultsMutation.isPending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>See My Preview</span>
                  <ChevronRight className="h-5 w-5" />
                </>
              )}
            </Button>

            <div className="text-center">
              <p className="text-neutral-500 text-sm mb-2">
                Want more accurate results?
              </p>
              <Link href="/quiz">
                <Button variant="outline" className="text-indigo-600 border-indigo-200 hover:bg-indigo-50" data-testid="link-full-quiz">
                  Take the Full Quiz (5 min)
                </Button>
              </Link>
            </div>
          </div>

          <Card className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 border-0">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">⚡</span>
                </div>
                <p className="text-sm text-neutral-600">
                  <span className="font-medium text-neutral-800">Note:</span> This quick scan gives you a preview. For the most accurate archetype and personalized strategies, take the full 28-question assessment.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
