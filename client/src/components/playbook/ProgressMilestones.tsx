import { CheckCircle2, Target, Zap, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressMilestonesProps {
  completedSections: number;
  totalSections: number;
  className?: string;
}

export function ProgressMilestones({ completedSections, totalSections, className }: ProgressMilestonesProps) {
  const progressPercentage = totalSections > 0 ? Math.round((completedSections / totalSections) * 100) : 0;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">
          {progressPercentage === 100
            ? "Playbook complete!"
            : `${completedSections} of ${totalSections} sections complete`}
        </span>
        <span className="text-sm tabular-nums font-medium text-muted-foreground">
          {progressPercentage}%
        </span>
      </div>

      <div className="relative">
        {/* Track */}
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Milestone dots overlaid on the bar */}
        {[25, 50, 100].map((threshold) => {
          const isPast = progressPercentage >= threshold;
          return (
            <div
              key={threshold}
              className="absolute top-1/2 -translate-y-1/2"
              style={{ left: `${threshold}%`, transform: `translate(-50%, -50%)` }}
            >
              <div className={cn(
                "w-3 h-3 rounded-full border-2 transition-all duration-300",
                isPast
                  ? "bg-primary border-primary"
                  : "bg-background border-muted-foreground/30"
              )} />
            </div>
          );
        })}
      </div>

      {/* Stage labels */}
      <div className="flex justify-between text-[10px] text-muted-foreground pt-0.5">
        <span className={cn(progressPercentage >= 25 && "text-primary/70")}>Clarity</span>
        <span className={cn(progressPercentage >= 50 && "text-primary/70")}>Momentum</span>
        <span className={cn(progressPercentage >= 100 && "text-primary/70")}>System Installed</span>
      </div>
    </div>
  );
}
