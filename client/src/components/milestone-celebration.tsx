import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface MilestoneCelebrationProps {
  milestone: 1 | 2;
  onComplete: () => void;
}

const milestoneData = {
  1: {
    title: "Halfway there!",
    message: "You're doing great! Most people give up by now. Not you though.",
    progress: 50
  },
  2: {
    title: "Almost done! Just 3 more",
    message: "You're 89% done! Your future productive self thanks you.",
    progress: 89
  }
};

export function MilestoneCelebration({ milestone, onComplete }: MilestoneCelebrationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const completedRef = useRef(false);
  const data = milestoneData[milestone];

  // Wrap onComplete to guarantee it only fires once
  const safeComplete = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    setIsFadingOut(true);
    setTimeout(onComplete, 300);
  };

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });

    // Normal auto-dismiss after 2 seconds
    const timer = setTimeout(safeComplete, 2000);

    // Hard safety fallback — guarantees dismissal even if re-renders
    // clear the normal timer (e.g. due to onComplete reference changing)
    const safetyTimer = setTimeout(safeComplete, 5000);

    return () => {
      clearTimeout(timer);
      clearTimeout(safetyTimer);
    };
  }, []); // Empty deps — run once on mount, never re-run

  const handleSkip = () => {
    safeComplete();
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300",
        isVisible && !isFadingOut ? "opacity-100" : "opacity-0"
      )}
      onClick={handleSkip}
      role="dialog"
      aria-label="Milestone celebration"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary to-secondary/90" />
      
      <div className={cn(
        "relative z-10 text-center px-8 py-12 max-w-md mx-4 transition-transform duration-300",
        isVisible && !isFadingOut ? "scale-100" : "scale-95"
      )}>
        <h2 className="text-3xl font-bold text-white mb-4 animate-bounce">
          {data.title}
        </h2>
        
        <p className="text-lg text-white/90 mb-8 leading-relaxed">
          {data.message}
        </p>
        
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="flex gap-1.5">
            {[1, 2, 3].map((segment) => (
              <div
                key={segment}
                className={cn(
                  "w-12 h-2 rounded-full transition-colors",
                  segment <= milestone + 1 ? "bg-white" : "bg-white/30"
                )}
              />
            ))}
          </div>
        </div>
        
        <p className="text-sm text-white/70">
          Tap anywhere to continue
        </p>
      </div>
    </div>
  );
}
