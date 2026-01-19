import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { questions } from "@/data/questions";
import { calculateScores, determineArchetype, generateSessionId, getProgressPercentage, validateAnswer } from "@/lib/quiz-logic";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/analytics";
import { trackQuizStart, trackQuizPageView, trackQuizQuestionAnswered, trackQuizComplete } from "@/lib/posthog";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Loader2, Zap } from "lucide-react";
import { MilestoneCelebration } from "@/components/milestone-celebration";
import type { QuizAnswers } from "@shared/schema";
import type { Question } from "@/data/questions";

const QUESTIONS_PER_PAGE = 5;

interface QuizContainerProps {
  showHeader?: boolean;
  showFocusIndicator?: boolean;
}

export function QuizContainer({ showHeader = true, showFocusIndicator = true }: QuizContainerProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [sessionId] = useState(() => generateSessionId());
  const [quizStarted, setQuizStarted] = useState(false);
  const [milestonesTracked, setMilestonesTracked] = useState<Set<number>>(new Set());
  const [quickMode, setQuickMode] = useState(false);
  const [showCelebration, setShowCelebration] = useState<1 | 2 | 3 | null>(null);
  const [celebrationsShown, setCelebrationsShown] = useState<Set<number>>(new Set());
  const [pendingPageAdvance, setPendingPageAdvance] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
  const startIndex = currentPage * QUESTIONS_PER_PAGE;
  const endIndex = Math.min(startIndex + QUESTIONS_PER_PAGE, questions.length);
  const currentQuestions = questions.slice(startIndex, endIndex);
  const isLastPage = currentPage === totalPages - 1;

  const answeredCount = Object.keys(answers).length;
  const progressPercentage = getProgressPercentage(answeredCount, questions.length);

  const pageQuestionsAnswered = currentQuestions.every(q => answers[q.id] !== undefined);
  const allQuestionsAnswered = answeredCount === questions.length;

  useEffect(() => {
    if (!quizStarted) {
      trackEvent('quiz_started', 'Quiz', 'Quiz Started', 1);
      trackQuizStart('quiz_page');
      setQuizStarted(true);
    }
  }, [quizStarted]);

  useEffect(() => {
    trackQuizPageView(currentPage + 1, totalPages);
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (progressPercentage >= 25 && !milestonesTracked.has(25)) {
      trackEvent('quiz_progress', 'Quiz', '25% Complete', 25);
      setMilestonesTracked(prev => new Set(prev).add(25));
    }
    if (progressPercentage >= 50 && !milestonesTracked.has(50)) {
      trackEvent('quiz_progress', 'Quiz', '50% Complete', 50);
      setMilestonesTracked(prev => new Set(prev).add(50));
    }
    if (progressPercentage >= 75 && !milestonesTracked.has(75)) {
      trackEvent('quiz_progress', 'Quiz', '75% Complete', 75);
      setMilestonesTracked(prev => new Set(prev).add(75));
    }
  }, [progressPercentage, milestonesTracked]);

  const saveResultsMutation = useMutation({
    mutationFn: async (data: { sessionId: string; answers: QuizAnswers; scores: any; archetype: string }) => {
      const response = await apiRequest("POST", "/api/quiz/results", data);
      return response.json();
    },
    onSuccess: () => {
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

  const checkForMilestoneCelebration = useCallback((questionNumber: number): 1 | 2 | 3 | null => {
    if (quickMode) return null;
    if (questionNumber === 7 && !celebrationsShown.has(1)) return 1;
    if (questionNumber === 14 && !celebrationsShown.has(2)) return 2;
    if (questionNumber === 21 && !celebrationsShown.has(3)) return 3;
    return null;
  }, [quickMode, celebrationsShown]);

  const handleCelebrationComplete = useCallback(() => {
    if (showCelebration) {
      setCelebrationsShown(prev => new Set(prev).add(showCelebration));
    }
    setShowCelebration(null);
    if (pendingPageAdvance) {
      setPendingPageAdvance(false);
      setCurrentPage(prev => prev + 1);
      setActiveQuestionIndex(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [showCelebration, pendingPageAdvance]);

  const handleAnswerChange = (questionId: string, value: string | number, questionIndexInPage: number) => {
    const question = questions.find(q => q.id === questionId);
    if (question && validateAnswer(question, value)) {
      const questionNumber = startIndex + questionIndexInPage + 1;
      trackQuizQuestionAnswered(questionNumber, questions.length, question.axis);
      
      setAnswers(prev => ({
        ...prev,
        [questionId]: value
      }));

      setTimeout(() => {
        const nextQuestionIndex = questionIndexInPage + 1;
        
        const milestone = checkForMilestoneCelebration(questionNumber);
        
        if (nextQuestionIndex < currentQuestions.length) {
          setActiveQuestionIndex(nextQuestionIndex);
          questionRefs.current[nextQuestionIndex]?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
          if (milestone) {
            setShowCelebration(milestone);
          }
        } else if (!isLastPage) {
          if (milestone) {
            setShowCelebration(milestone);
            setPendingPageAdvance(true);
          } else {
            setTimeout(() => {
              handleNextPage();
            }, 300);
          }
        }
      }, 150);
    }
  };

  const handleNextPage = () => {
    if (isLastPage && allQuestionsAnswered) {
      const scores = calculateScores(answers);
      const archetype = determineArchetype(scores);
      trackEvent('quiz_completed', 'Quiz', `Archetype: ${archetype.name}`, questions.length);
      trackQuizComplete(archetype.id, scores);
      saveResultsMutation.mutate({
        sessionId,
        answers,
        scores,
        archetype: archetype.id
      });
    } else if (!isLastPage) {
      setCurrentPage(prev => prev + 1);
      setActiveQuestionIndex(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
      setActiveQuestionIndex(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderQuestionOptions = (question: Question, questionIndexInPage: number) => {
    const currentValue = answers[question.id];

    if (question.type === 'likert' && question.scaleLabels) {
      return (
        <div className="space-y-4">
          <div className="flex justify-between text-xs sm:text-sm text-muted-foreground dark:text-muted-foreground px-1">
            <span>{question.scaleLabels.min}</span>
            <span className="hidden sm:inline">Neutral</span>
            <span>{question.scaleLabels.max}</span>
          </div>
          <RadioGroup
            value={currentValue?.toString() || ''}
            onValueChange={(val) => handleAnswerChange(question.id, parseInt(val), questionIndexInPage)}
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
                      ? "border-primary bg-primary text-white shadow-lg"
                      : "border-muted dark:border-muted bg-white dark:bg-card text-muted-foreground dark:text-muted-foreground hover:border-primary/60 hover:bg-primary/5 dark:hover:bg-primary/10"
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

    if (question.type === 'scenario' && question.options) {
      return (
        <RadioGroup
          value={currentValue !== undefined ? currentValue.toString() : ''}
          onValueChange={(val) => handleAnswerChange(question.id, parseInt(val), questionIndexInPage)}
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
                data-testid={`${question.id}-scenario-option-${index}`}
                className={cn(
                  "block cursor-pointer w-full text-left p-3 sm:p-4 border-2 rounded-xl transition-all text-sm sm:text-base leading-relaxed",
                  "hover:scale-[1.01] active:scale-[0.99]",
                  currentValue !== undefined && currentValue.toString() === index.toString()
                    ? "border-primary bg-primary text-white shadow-lg"
                    : "border-muted dark:border-muted bg-white dark:bg-card text-muted-foreground dark:text-muted-foreground hover:border-primary/60 hover:bg-primary/5 dark:hover:bg-primary/10"
                )}
              >
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      );
    }

    if (question.type === 'binary' && question.options) {
      return (
        <RadioGroup
          value={currentValue !== undefined ? currentValue.toString() : ''}
          onValueChange={(val) => handleAnswerChange(question.id, parseInt(val), questionIndexInPage)}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
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
                data-testid={`${question.id}-binary-option-${index}`}
                className={cn(
                  "block cursor-pointer w-full text-center p-4 sm:p-5 border-2 rounded-xl transition-all text-sm sm:text-base font-medium leading-relaxed",
                  "hover:scale-[1.02] active:scale-[0.98]",
                  currentValue !== undefined && currentValue.toString() === index.toString()
                    ? "border-primary bg-primary text-white shadow-lg"
                    : "border-muted dark:border-muted bg-white dark:bg-card text-muted-foreground dark:text-muted-foreground hover:border-primary/60 hover:bg-primary/5 dark:hover:bg-primary/10"
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
    <div className="w-full max-w-3xl mx-auto">
      {showCelebration && (
        <MilestoneCelebration 
          milestone={showCelebration} 
          onComplete={handleCelebrationComplete} 
        />
      )}

      {showHeader && (
        <div className="text-center space-y-3 mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground dark:text-foreground">
            Discover Your Productivity Archetype
          </h2>
          <p className="text-base text-muted-foreground dark:text-muted-foreground">
            Answer honestly for the most accurate results
          </p>
          
          <div className="flex items-center justify-center gap-2 pt-2">
            <Switch
              id="quick-mode"
              checked={quickMode}
              onCheckedChange={setQuickMode}
              aria-label="Quick mode - skip milestone celebrations"
            />
            <Label 
              htmlFor="quick-mode" 
              className="text-sm text-muted-foreground dark:text-muted-foreground cursor-pointer flex items-center gap-1.5"
            >
              <Zap className="h-4 w-4" />
              Quick Mode
            </Label>
          </div>
        </div>
      )}

      <Card className="bg-white dark:bg-background shadow-xl border-0 overflow-hidden mb-6">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">
              Page {currentPage + 1} of {totalPages}
            </span>
            <span className="text-sm font-medium text-primary">
              {answeredCount} of {questions.length} answered
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </CardContent>
      </Card>

      <div className="space-y-4">
        {currentQuestions.map((question, indexInPage) => {
          const globalIndex = startIndex + indexInPage;
          const isAnswered = answers[question.id] !== undefined;
          const isActive = indexInPage === activeQuestionIndex;

          return (
            <Card
              key={question.id}
              ref={(el) => (questionRefs.current[indexInPage] = el)}
              data-testid={`question-card-${question.id}`}
              className={cn(
                "transition-all duration-300 border-2",
                isActive && !isAnswered
                  ? "border-primary shadow-lg shadow-primary/20 dark:shadow-primary/10"
                  : isAnswered
                  ? "border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10"
                  : "border-transparent hover:border-muted dark:hover:border-neutral-700"
              )}
              onClick={() => setActiveQuestionIndex(indexInPage)}
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className={cn(
                    "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                    isAnswered
                      ? "bg-green-500 text-white"
                      : isActive
                      ? "bg-primary text-white"
                      : "bg-muted dark:bg-muted text-muted-foreground dark:text-muted-foreground"
                  )}>
                    {isAnswered ? "✓" : globalIndex + 1}
                  </div>
                  <h3 className="text-base sm:text-lg font-medium text-foreground dark:text-foreground leading-relaxed flex-1">
                    {question.text}
                  </h3>
                </div>
                
                {renderQuestionOptions(question, indexInPage)}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-between items-center mt-8 gap-4">
        <Button
          variant="outline"
          onClick={handlePreviousPage}
          disabled={currentPage === 0 || saveResultsMutation.isPending}
          className="flex items-center gap-2 px-6 py-5 text-base font-medium"
          data-testid="button-previous-page"
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        <div className="flex gap-1.5">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentPage(idx);
                setActiveQuestionIndex(0);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all",
                idx === currentPage
                  ? "bg-primary w-6"
                  : "bg-muted dark:bg-muted hover:bg-primary"
              )}
              data-testid={`page-indicator-${idx}`}
            />
          ))}
        </div>

        <Button
          onClick={handleNextPage}
          disabled={(!pageQuestionsAnswered && !isLastPage) || (isLastPage && !allQuestionsAnswered) || saveResultsMutation.isPending}
          className={cn(
            "flex items-center gap-2 px-6 py-5 text-base font-medium",
            "bg-primary hover:bg-primary/90",
            "text-white shadow-lg hover:shadow-xl transition-all"
          )}
          data-testid="button-next-page"
        >
          {saveResultsMutation.isPending ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Processing...</span>
            </>
          ) : isLastPage && allQuestionsAnswered ? (
            <>
              <span>See Results</span>
              <ChevronRight className="h-5 w-5" />
            </>
          ) : (
            <>
              <span className="hidden sm:inline">Continue</span>
              <ChevronRight className="h-5 w-5" />
            </>
          )}
        </Button>
      </div>

      {showFocusIndicator && (
        <Card className="mt-8 bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10 border-0">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-xl">💡</span>
              </div>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                <span className="font-medium text-foreground dark:text-muted-foreground">Tip:</span> Select an answer to automatically move to the next question. Take your time and answer honestly.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
