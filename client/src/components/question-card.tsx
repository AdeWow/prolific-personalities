import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
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
  const handleMultipleChoiceChange = (selectedValue: string) => {
    onChange(parseInt(selectedValue));
  };

  const handleScaleChange = (scaleValue: number[]) => {
    onChange(scaleValue[0]);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
      <CardContent className="p-8">
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-neutral-800 leading-relaxed">
            {question.text}
          </h3>
          
          {question.type === 'multiple-choice' && question.options && (
            <RadioGroup
              value={value?.toString()}
              onValueChange={handleMultipleChoiceChange}
              className="space-y-4"
            >
              {question.options.map((option, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <RadioGroupItem
                    value={index.toString()}
                    id={`option-${index}`}
                    className="mt-1"
                  />
                  <Label
                    htmlFor={`option-${index}`}
                    className="text-neutral-700 leading-relaxed cursor-pointer flex-1 p-4 border-2 border-neutral-200 rounded-xl hover:border-primary transition-colors"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {question.type === 'scale' && question.scaleRange && question.scaleLabels && (
            <div className="space-y-6">
              <div className="flex justify-between text-sm text-neutral-600">
                <span>{question.scaleLabels.min}</span>
                <span>Neutral</span>
                <span>{question.scaleLabels.max}</span>
              </div>
              
              <div className="px-4">
                <Slider
                  value={[typeof value === 'number' ? value : question.scaleRange.min + Math.floor((question.scaleRange.max - question.scaleRange.min) / 2)]}
                  onValueChange={handleScaleChange}
                  min={question.scaleRange.min}
                  max={question.scaleRange.max}
                  step={1}
                  className="w-full"
                />
              </div>
              
              <div className="flex justify-between text-xs text-neutral-500">
                {Array.from({ length: question.scaleRange.max - question.scaleRange.min + 1 }, (_, i) => (
                  <span key={i}>{question.scaleRange!.min + i}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between pt-8">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={!canGoPrevious || isLoading}
            className="px-6 py-3"
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
