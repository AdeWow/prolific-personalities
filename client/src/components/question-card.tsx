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
      <CardContent className="p-8">
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200 leading-relaxed" data-testid="question-text">
            {question.text}
          </h3>
          
          {/* Likert Scale (1-5) */}
          {question.type === 'likert' && question.scaleLabels && (
            <div className="space-y-6">
              <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-400">
                <span>{question.scaleLabels.min}</span>
                <span>Neutral</span>
                <span>{question.scaleLabels.max}</span>
              </div>
              
              <RadioGroup
                value={value?.toString() || ''}
                onValueChange={(val) => onChange(parseInt(val))}
                className="flex justify-between space-x-2"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <div key={num} className="flex flex-col items-center flex-1 space-y-2">
                    <RadioGroupItem
                      value={num.toString()}
                      id={`likert-${num}`}
                      className="w-5 h-5"
                      data-testid={`likert-option-${num}`}
                    />
                    <Label
                      htmlFor={`likert-${num}`}
                      className="text-sm font-medium cursor-pointer"
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
              value={value?.toString()}
              onValueChange={handleOptionChange}
              className="space-y-4"
            >
              {question.options.map((option, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <RadioGroupItem
                    value={index.toString()}
                    id={`option-${index}`}
                    className="mt-1"
                    data-testid={`scenario-option-${index}`}
                  />
                  <Label
                    htmlFor={`option-${index}`}
                    className="text-neutral-700 dark:text-neutral-300 leading-relaxed cursor-pointer flex-1 p-4 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl hover:border-primary dark:hover:border-primary transition-colors"
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
              value={value?.toString()}
              onValueChange={handleOptionChange}
              className="space-y-4"
            >
              {question.options.map((option, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <RadioGroupItem
                    value={index.toString()}
                    id={`option-${index}`}
                    className="mt-1"
                    data-testid={`binary-option-${index}`}
                  />
                  <Label
                    htmlFor={`option-${index}`}
                    className="text-neutral-700 dark:text-neutral-300 leading-relaxed cursor-pointer flex-1 p-4 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl hover:border-primary dark:hover:border-primary transition-colors"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
        </div>

        <div className="flex justify-between pt-8">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={!canGoPrevious || isLoading}
            className="px-6 py-3"
            data-testid="button-previous"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Previous
          </Button>
          
          <Button
            onClick={onNext}
            disabled={!canGoNext || value === undefined || isLoading}
            className={cn(
              "px-6 py-3 gradient-primary text-white font-medium",
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
