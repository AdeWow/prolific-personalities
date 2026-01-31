import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Sparkles, Target, Calendar, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface FirstTimeOverlayProps {
  archetype: string;
  onDismiss: () => void;
}

export function FirstTimeOverlay({ archetype, onDismiss }: FirstTimeOverlayProps) {
  const [step, setStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const steps = [
    {
      icon: Target,
      title: "Your Core Traits",
      description: "Start here to understand your unique productivity profile.",
      highlight: "core-traits"
    },
    {
      icon: Calendar,
      title: "Today's Task",
      description: "One small action each day builds lasting change.",
      highlight: "action-plan"
    },
    {
      icon: TrendingUp,
      title: "Track Your Journey",
      description: "Mark chapters complete as you progress.",
      highlight: "progress"
    }
  ];

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(`playbook-onboarded-${archetype}`, 'true');
    setTimeout(onDismiss, 300);
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      handleDismiss();
    }
  };

  if (!isVisible) return null;

  const currentStep = steps[step];
  const StepIcon = currentStep.icon;

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center p-4",
      "bg-background/80 backdrop-blur-sm",
      "animate-in fade-in duration-300"
    )}>
      <Card className="max-w-md w-full shadow-2xl border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary">Quick Start Guide</span>
            </div>
            <button
              onClick={handleDismiss}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Skip guide"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <StepIcon className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              {currentStep.title}
            </h3>
            <p className="text-muted-foreground">
              {currentStep.description}
            </p>
          </div>

          <div className="flex items-center justify-center gap-1.5 mb-6">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  idx === step ? "bg-primary" : "bg-muted"
                )}
              />
            ))}
          </div>

          <div className="bg-muted/50 rounded-lg p-4 mb-6">
            <p className="text-sm text-center text-muted-foreground italic">
              "You're not meant to read everything today. Focus on one insight, one action."
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleDismiss}
            >
              Skip
            </Button>
            <Button
              className="flex-1"
              onClick={handleNext}
            >
              {step < steps.length - 1 ? "Next" : "Let's Go!"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function useFirstTimeOverlay(archetype: string) {
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    const hasOnboarded = localStorage.getItem(`playbook-onboarded-${archetype}`);
    if (!hasOnboarded) {
      const timer = setTimeout(() => setShowOverlay(true), 500);
      return () => clearTimeout(timer);
    }
  }, [archetype]);

  return {
    showOverlay,
    dismissOverlay: () => setShowOverlay(false)
  };
}
