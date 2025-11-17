import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { questions } from "@/data/questions";
import { ChevronRight } from "lucide-react";

export function InlineQuiz() {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  
  const firstQuestion = questions[0];

  const handleStart = () => {
    if (selectedAnswer !== null) {
      setLocation('/quiz');
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-neutral-800 mb-4">
            Ready to discover your archetype?
          </h2>
          <p className="text-xl text-neutral-600">
            Start with question 1 of 28
          </p>
        </div>

        <Card className="bg-white shadow-2xl border-2 border-indigo-100">
          <CardContent className="p-8 lg:p-12">
            <div className="space-y-8">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">
                    Question 1
                  </span>
                  <span className="text-sm text-neutral-500">
                    28 questions • 5 min
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-neutral-800 mb-8">
                  {firstQuestion.text}
                </h3>
              </div>

              <div className="space-y-4">
                {firstQuestion.type === 'likert' && (
                  <>
                    <div className="flex justify-between text-sm text-neutral-600 mb-2">
                      <span>{firstQuestion.scaleLabels?.min}</span>
                      <span>{firstQuestion.scaleLabels?.max}</span>
                    </div>
                    <div className="grid grid-cols-5 gap-3">
                      {['1', '2', '3', '4', '5'].map((value) => (
                        <button
                          key={value}
                          onClick={() => setSelectedAnswer(value)}
                          className={`
                            py-6 px-4 rounded-xl border-2 text-lg font-semibold transition-all
                            ${selectedAnswer === value
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-700 scale-105'
                              : 'border-neutral-200 bg-white text-neutral-700 hover:border-indigo-300'
                            }
                          `}
                          data-testid={`inline-quiz-option-${value}`}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="pt-6">
                <Button
                  onClick={handleStart}
                  disabled={selectedAnswer === null}
                  className="w-full gradient-primary text-white py-6 rounded-xl font-semibold text-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="button-start-inline-quiz"
                >
                  Start Full Assessment
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
                <p className="text-center text-sm text-neutral-500 mt-4">
                  Free • No email required • Results in 5 minutes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
