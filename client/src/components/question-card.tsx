import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { Question } from "../data/questions";

interface QuestionCardProps {
  question: Question;
  value: string | number | undefined;
  onChange: (value: string | number) => void;
  onNext: () => void;
  onPrevious: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isLoading?: boolean;
}

export function QuestionCard({
  question,
  value,
  onChange,
  onNext,
  onPrevious,
  canGoNext,
  canGoPrevious,
  isLoading = false
}: QuestionCardProps) {
  const handleOptionChange = (selectedValue: string) => {
    onChange(parseInt(selectedValue));
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg" data-testid="question-card">
      <CardContent className="p-6 sm:p-8 lg:p-12">
        <div className="space-y-8">
          <h3 className="text-2xl sm:text-3xl font-semibold text-foreground dark:text-muted-foreground leading-relaxed" data-testid="question-text">
            {question.text}
          </h3>
          
          {/* Likert Scale (1-5) */}
          {question.type === 'likert' && question.scaleLabels && (
            <div className="space-y-6">
              <div className="flex justify-between text-sm sm:text-base text-muted-foreground dark:text-muted-foreground">
                <span className="text-left max-w-[120px] sm:max-w-none">{question.scaleLabels.min}</span>
                <span className="hidden sm:inline">Neutral</span>
                <span className="text-right max-w-[120px] sm:max-w-none">{question.scaleLabels.max}</span>
              </div>
              
              <RadioGroup
                value={value?.toString() || ''}
                onValueChange={(val) => onChange(parseInt(val))}
                className="grid grid-cols-5 gap-2 sm:gap-4"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <div key={num} className="relative">
                    <RadioGroupItem
                      value={num.toString()}
                      id={`likert-${num}`}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={`likert-${num}`}
                      data-testid={`likert-option-${num}`}
                      className={cn(
                        "flex items-center justify-center cursor-pointer py-4 sm:py-6 px-2 sm:px-4 rounded-xl border-2 text-lg sm:text-xl font-semibold transition-all touch-manipulation",
                        "peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2",
                        value === num
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-muted bg-white text-muted-foreground hover:border-primary/30 peer-hover:border-primary/30"
                      )}
                    >
                      {num}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Scenario-based (Multiple Choice) */}
          {question.type === 'scenario' && question.options && (
            <RadioGroup
              value={value !== undefined ? value.toString() : ''}
              onValueChange={handleOptionChange}
              className="space-y-3 sm:space-y-4"
            >
              {question.options.map((option, index) => (
                <div key={index} className="relative">
                  <RadioGroupItem
                    value={index.toString()}
                    id={`option-${index}`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`option-${index}`}
                    data-testid={`scenario-option-${index}`}
                    className={cn(
                      "block cursor-pointer w-full text-left p-4 sm:p-6 border-2 rounded-xl transition-all text-base sm:text-lg leading-relaxed touch-manipulation",
                      "peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2",
                      value !== undefined && value.toString() === index.toString()
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-muted bg-white text-muted-foreground hover:border-primary/30"
                    )}
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {/* Binary Choice */}
          {question.type === 'binary' && question.options && (
            <RadioGroup
              value={value !== undefined ? value.toString() : ''}
              onValueChange={handleOptionChange}
              className="space-y-3 sm:space-y-4"
            >
              {question.options.map((option, index) => (
                <div key={index} className="relative">
                  <RadioGroupItem
                    value={index.toString()}
                    id={`option-${index}`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`option-${index}`}
                    data-testid={`binary-option-${index}`}
                    className={cn(
                      "block cursor-pointer w-full text-left p-4 sm:p-6 border-2 rounded-xl transition-all text-base sm:text-lg leading-relaxed touch-manipulation",
                      "peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2",
                      value !== undefined && value.toString() === index.toString()
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-muted bg-white text-muted-foreground hover:border-primary/30"
                    )}
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-3 pt-8">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={!canGoPrevious || isLoading}
            className="px-8 py-5 sm:py-6 text-base sm:text-lg font-semibold touch-manipulation order-2 sm:order-1"
            data-testid="button-previous"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Previous
          </Button>
          
          <Button
            onClick={onNext}
            disabled={!canGoNext || value === undefined || isLoading}
            className={cn(
              "px-8 py-5 sm:py-6 text-base sm:text-lg gradient-primary text-white font-semibold touch-manipulation order-1 sm:order-2",
              "hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            )}
            data-testid="button-next"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                Next
                <i className="fas fa-arrow-right ml-2"></i>
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
