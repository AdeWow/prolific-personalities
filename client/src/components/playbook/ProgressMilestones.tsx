import { CheckCircle2, Circle, Zap, Target, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressMilestonesProps {
  completedChapters: number;
  totalChapters: number;
  className?: string;
}

export function ProgressMilestones({ completedChapters, totalChapters, className }: ProgressMilestonesProps) {
  const progressPercentage = Math.round((completedChapters / totalChapters) * 100);
  
  const milestones = [
    { 
      id: "clarity", 
      name: "Clarity", 
      threshold: 25, 
      icon: Target,
      description: "Understanding your archetype"
    },
    { 
      id: "momentum", 
      name: "Momentum", 
      threshold: 50, 
      icon: Zap,
      description: "Building daily habits"
    },
    { 
      id: "system", 
      name: "System Installed", 
      threshold: 100, 
      icon: Award,
      description: "Full productivity system"
    }
  ];

  const currentMilestoneIndex = milestones.findIndex(m => progressPercentage < m.threshold);
  const activeMilestone = currentMilestoneIndex === -1 ? milestones.length - 1 : currentMilestoneIndex;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">Your Journey</span>
        <span className="text-sm text-muted-foreground">
          {completedChapters}/{totalChapters} chapters
        </span>
      </div>
      
      <div className="relative">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        <div className="absolute top-0 left-0 right-0 flex justify-between" style={{ transform: 'translateY(-50%)' }}>
          {milestones.map((milestone, index) => {
            const isPast = progressPercentage >= milestone.threshold;
            const isCurrent = index === activeMilestone;
            const Icon = milestone.icon;
            
            return (
              <div 
                key={milestone.id}
                className="flex flex-col items-center"
                style={{ 
                  position: 'absolute',
                  left: `${milestone.threshold}%`,
                  transform: 'translateX(-50%)'
                }}
              >
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300",
                  isPast 
                    ? "bg-primary text-white" 
                    : isCurrent 
                      ? "bg-primary/20 text-primary ring-2 ring-primary ring-offset-2 ring-offset-background" 
                      : "bg-muted text-muted-foreground"
                )}>
                  {isPast ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Icon className="w-3 h-3" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="flex justify-between pt-4">
        {milestones.map((milestone, index) => {
          const isPast = progressPercentage >= milestone.threshold;
          const isCurrent = index === activeMilestone;
          
          return (
            <div 
              key={milestone.id}
              className={cn(
                "text-center transition-opacity",
                milestone.threshold === 50 ? "flex-1" : "w-24",
                isPast ? "opacity-50" : isCurrent ? "opacity-100" : "opacity-40"
              )}
            >
              <p className={cn(
                "text-xs font-medium",
                isCurrent ? "text-primary" : "text-muted-foreground"
              )}>
                {milestone.name}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5 hidden sm:block">
                {milestone.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
