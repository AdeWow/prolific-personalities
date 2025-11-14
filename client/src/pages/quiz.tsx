import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { QuestionCard } from "@/components/question-card";
import { ProgressBar } from "@/components/progress-bar";
import { Header } from "@/components/header";
import { questions } from "@/data/questions";
import { calculateScores, determineArchetype, generateSessionId, getProgressPercentage, validateAnswer } from "@/lib/quiz-logic";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/analytics";
import type { QuizAnswers } from "@shared/schema";

export default function Quiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [sessionId] = useState(() => generateSessionId());
  const [quizStarted, setQuizStarted] = useState(false);
  const [milestonesTracked, setMilestonesTracked] = useState<Set<number>>(new Set());
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Track quiz start on mount
  useEffect(() => {
    if (!quizStarted) {
      trackEvent('quiz_started', 'Quiz', 'Quiz Started', currentQuestionIndex + 1);
      setQuizStarted(true);
    }
  }, [quizStarted, currentQuestionIndex]);

  const saveResultsMutation = useMutation({
    mutationFn: async (data: { sessionId: string; answers: QuizAnswers; scores: any; archetype: string }) => {
      const response = await apiRequest("POST", "/api/quiz/results", data);
      return response.json();
    },
    onSuccess: () => {
      // Store sessionId in localStorage so we can claim it after login
      localStorage.setItem('pendingQuizSessionId', sessionId);
      setLocation(`/results/${sessionId}`);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save quiz results. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to save quiz results:", error);
    },
  });

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const canGoNext = answers[currentQuestion.id] !== undefined;
  const canGoPrevious = currentQuestionIndex > 0;
  const progressPercentage = getProgressPercentage(currentQuestionIndex + 1, questions.length);

  const handleAnswerChange = (value: string | number) => {
    if (validateAnswer(currentQuestion, value)) {
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: value
      }));
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      // Calculate results and save
      const scores = calculateScores(answers);
      const archetype = determineArchetype(scores);
      
      // Track quiz completion
      trackEvent('quiz_completed', 'Quiz', `Archetype: ${archetype.name}`, questions.length);
      
      saveResultsMutation.mutate({
        sessionId,
        answers,
        scores,
        archetype: archetype.id
      });
    } else {
      // Calculate progress BEFORE moving to next question
      // The user has just answered currentQuestionIndex, so questions answered = currentQuestionIndex + 1
      const questionsAnswered = currentQuestionIndex + 1;
      const progress = getProgressPercentage(questionsAnswered, questions.length);
      
      // Fire milestone events when crossing thresholds
      if (progress >= 25 && !milestonesTracked.has(25)) {
        trackEvent('quiz_progress', 'Quiz', '25% Complete', 25);
        setMilestonesTracked(prev => new Set(prev).add(25));
      }
      if (progress >= 50 && !milestonesTracked.has(50)) {
        trackEvent('quiz_progress', 'Quiz', '50% Complete', 50);
        setMilestonesTracked(prev => new Set(prev).add(50));
      }
      if (progress >= 75 && !milestonesTracked.has(75)) {
        trackEvent('quiz_progress', 'Quiz', '75% Complete', 75);
        setMilestonesTracked(prev => new Set(prev).add(75));
      }
      
      // Now move to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (canGoPrevious) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-indigo-50">
      <Header />

      {/* Quiz Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-800">
              Take Your Productivity Assessment
            </h2>
            <p className="text-xl text-neutral-600">
              Answer honestly to discover your unique productivity archetype
            </p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <Card className="bg-white shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-medium text-neutral-600">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </div>
                  <div className="text-sm font-medium text-neutral-600">
                    {progressPercentage}% Complete
                  </div>
                </div>
                <ProgressBar value={progressPercentage} showPercentage={false} />
              </CardContent>
            </Card>
          </div>

          {/* Question */}
          <QuestionCard
            question={currentQuestion}
            value={answers[currentQuestion.id]}
            onChange={handleAnswerChange}
            onNext={handleNext}
            onPrevious={handlePrevious}
            canGoNext={canGoNext}
            canGoPrevious={canGoPrevious}
            isLoading={saveResultsMutation.isPending}
          />

          {/* Focus Mode Indicator */}
          <div className="mt-8">
            <Card className="bg-white shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <img 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100" 
                    alt="Person in focus mode" 
                    className="w-16 h-16 rounded-xl object-cover" 
                  />
                  <div>
                    <h4 className="font-semibold text-neutral-800">Focus Mode Active</h4>
                    <p className="text-neutral-600">Take your time and answer honestly for the most accurate results.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
