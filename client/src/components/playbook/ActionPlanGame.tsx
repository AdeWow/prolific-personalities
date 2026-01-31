import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ChevronDown, 
  ChevronUp, 
  Target, 
  Clock, 
  Brain,
  Sparkles,
  CheckCircle2,
  Lock
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ActionPlanTask } from "@shared/playbookContent";

interface ActionPlanGameProps {
  tasks: ActionPlanTask[];
  completedTasks: { dayNumber: number; taskId: string }[];
  onToggleTask: (dayNumber: number, taskId: string, completed: boolean) => void;
  isPending?: boolean;
}

export function ActionPlanGame({ tasks, completedTasks, onToggleTask, isPending }: ActionPlanGameProps) {
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set());
  
  const isTaskComplete = (day: number, taskId: string) => {
    return completedTasks.some(t => t.dayNumber === day && t.taskId === taskId);
  };

  const completedCount = tasks.filter(t => isTaskComplete(t.day, t.id)).length;
  const currentDay = completedCount + 1;
  
  const toggleExpand = (day: number) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(day)) {
      newExpanded.delete(day);
    } else {
      newExpanded.add(day);
    }
    setExpandedDays(newExpanded);
  };

  const getTaskWhyText = (day: number): string => {
    if (day <= 7) return "Foundation building - establishing core habits";
    if (day <= 14) return "Momentum phase - reinforcing your system";
    if (day <= 21) return "Optimization - fine-tuning what works";
    return "Mastery - cementing long-term change";
  };

  const getTimeEstimate = (day: number): string => {
    if (day <= 3) return "5-10 min";
    if (day <= 10) return "10-15 min";
    if (day <= 20) return "15-20 min";
    return "10-15 min";
  };

  const todayTask = tasks.find(t => t.day === currentDay);
  const pastTasks = tasks.filter(t => t.day < currentDay);
  const futureTasks = tasks.filter(t => t.day > currentDay);

  return (
    <div className="space-y-6">
      {todayTask && (
        <Card className="border-2 border-primary bg-gradient-to-br from-primary/5 via-background to-primary/10 overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-primary/10 px-4 py-2 border-b border-primary/20">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary">Today's Focus</span>
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-start gap-4">
                <Checkbox
                  checked={isTaskComplete(todayTask.day, todayTask.id)}
                  onCheckedChange={(checked) => {
                    onToggleTask(todayTask.day, todayTask.id, !!checked);
                  }}
                  disabled={isPending}
                  className="mt-1 h-6 w-6"
                  data-testid={`task-today-${todayTask.day}`}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="default" className="bg-primary">Day {todayTask.day}</Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {getTimeEstimate(todayTask.day)}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{todayTask.task}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{todayTask.description}</p>
                  
                  <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                    <Brain className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-xs font-medium text-foreground">Why this matters: </span>
                      <span className="text-xs text-muted-foreground">{getTaskWhyText(todayTask.day)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {isTaskComplete(todayTask.day, todayTask.id) && (
              <div className="bg-emerald-500/10 px-4 py-3 border-t border-emerald-500/20">
                <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-semibold">Momentum unlocked!</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {pastTasks.length > 0 && (
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-between text-muted-foreground hover:text-foreground"
            onClick={() => toggleExpand(-1)}
          >
            <span className="text-sm">Completed ({pastTasks.filter(t => isTaskComplete(t.day, t.id)).length}/{pastTasks.length})</span>
            {expandedDays.has(-1) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
          
          {expandedDays.has(-1) && (
            <div className="space-y-2 pl-2">
              {pastTasks.map(task => {
                const isComplete = isTaskComplete(task.day, task.id);
                return (
                  <div
                    key={task.id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg transition-colors",
                      isComplete ? "bg-muted/30" : "bg-amber-50 dark:bg-amber-950/30"
                    )}
                  >
                    <Checkbox
                      checked={isComplete}
                      onCheckedChange={(checked) => {
                        onToggleTask(task.day, task.id, !!checked);
                      }}
                      disabled={isPending}
                      data-testid={`task-past-${task.day}`}
                    />
                    <Badge variant="outline" className="text-xs">Day {task.day}</Badge>
                    <span className={cn(
                      "text-sm flex-1",
                      isComplete ? "line-through text-muted-foreground" : "text-foreground"
                    )}>
                      {task.task}
                    </span>
                    {isComplete && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {futureTasks.length > 0 && (
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-between text-muted-foreground hover:text-foreground"
            onClick={() => toggleExpand(999)}
          >
            <span className="text-sm flex items-center gap-2">
              <Lock className="w-3 h-3" />
              Coming Up ({futureTasks.length} days)
            </span>
            {expandedDays.has(999) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
          
          {expandedDays.has(999) && (
            <div className="space-y-2 pl-2 opacity-60">
              {futureTasks.map(task => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/20"
                >
                  <div className="w-5 h-5 rounded border border-dashed border-muted-foreground/30" />
                  <Badge variant="outline" className="text-xs text-muted-foreground">Day {task.day}</Badge>
                  <span className="text-sm text-muted-foreground flex-1">{task.task}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
