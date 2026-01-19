import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface MilestoneCelebrationProps {
  milestone: 1 | 2 | 3;
  onComplete: () => void;
}

const milestoneData = {
  1: {
    emoji: "🎯",
    title: "Nice work! You're 1/4 done",
    message: "Fun fact: The fact that you're still here shows solid focus! (Or procrastination from real work? 😉)",
    progress: 25
  },
  2: {
    emoji: "🔥",
    title: "Halfway there!",
    message: "You're doing great! Most people give up by now. Not you though.",
    progress: 50
  },
  3: {
    emoji: "🚀",
    title: "Almost done! Just 7 more",
    message: "You're 75% done! Your future productive self thanks you.",
    progress: 75
  }
};

export function MilestoneCelebration({ milestone, onComplete }: MilestoneCelebrationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const data = milestoneData[milestone];

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });

    const timer = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(onComplete, 300);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(onComplete, 300);
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
        <div className="text-7xl mb-6 animate-bounce">
          {data.emoji}
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-4">
          {data.title}
        </h2>
        
        <p className="text-lg text-white/90 mb-8 leading-relaxed">
          {data.message}
        </p>
        
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map((segment) => (
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
