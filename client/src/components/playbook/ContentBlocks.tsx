import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Zap, Brain, AlertTriangle, Clock, Target, HelpCircle } from "lucide-react";

interface BlockProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function InsightBlock({ title, children, className = "" }: BlockProps) {
  return (
    <Card className={`border-l-4 border-l-amber-400 bg-amber-50/50 dark:bg-amber-950/20 ${className}`}>
      <CardContent className="p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <div className="flex-1">
            {title && (
              <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-1">{title}</h4>
            )}
            <div className="text-sm text-amber-800 dark:text-amber-200">{children}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ActionBlock({ title, children, className = "" }: BlockProps) {
  return (
    <Card className={`border-l-4 border-l-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 ${className}`}>
      <CardContent className="p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
              <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div className="flex-1">
            {title && (
              <h4 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-1">{title}</h4>
            )}
            <div className="text-sm text-emerald-800 dark:text-emerald-200">{children}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function WhyItMattersBlock({ title, children, className = "" }: BlockProps) {
  return (
    <Card className={`border-l-4 border-l-purple-500 bg-purple-50/50 dark:bg-purple-950/20 ${className}`}>
      <CardContent className="p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
              <Brain className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="flex-1">
            {title && (
              <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-1">{title}</h4>
            )}
            <div className="text-sm text-purple-800 dark:text-purple-200">{children}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function CommonMistakeBlock({ title, children, className = "" }: BlockProps) {
  return (
    <Card className={`border-l-4 border-l-orange-500 bg-orange-50/50 dark:bg-orange-950/20 ${className}`}>
      <CardContent className="p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div className="flex-1">
            {title && (
              <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-1">{title}</h4>
            )}
            <div className="text-sm text-orange-800 dark:text-orange-200">{children}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface DoThisNowProps {
  action: string;
  timeEstimate?: string;
  onComplete?: () => void;
}

export function DoThisNowBlock({ action, timeEstimate = "2 min", onComplete }: DoThisNowProps) {
  return (
    <Card className="border-2 border-primary bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center animate-pulse">
              <Zap className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="default" className="bg-primary text-white text-xs">
                Do This Now
              </Badge>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {timeEstimate}
              </span>
            </div>
            <p className="text-sm font-medium text-foreground">{action}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface CoreTraitCardProps {
  trait: string;
  level: "HIGH" | "LOW" | "MIXED";
  explanation: string;
  dayMeaning: string;
}

export function CoreTraitCard({ trait, level, explanation, dayMeaning }: CoreTraitCardProps) {
  const levelColors = {
    HIGH: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
    LOW: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
    MIXED: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
  };

  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-foreground">{trait}</h4>
          <Badge className={levelColors[level]}>{level}</Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-3">{explanation}</p>
        <div className="pt-3 border-t border-border">
          <div className="flex items-start gap-2">
            <Target className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">What this means for your day:</span>{" "}
              {dayMeaning}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-bold text-foreground">{title}</h3>
      {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
    </div>
  );
}

interface BulletListProps {
  items: string[];
  variant?: "default" | "highlight";
}

export function BulletList({ items, variant = "default" }: BulletListProps) {
  return (
    <ul className="space-y-2">
      {items.map((item, idx) => (
        <li key={idx} className="flex items-start gap-2 text-sm">
          <span className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${
            variant === "highlight" ? "bg-primary" : "bg-muted-foreground"
          }`} />
          <span className="text-foreground">{item}</span>
        </li>
      ))}
    </ul>
  );
}

interface QuestionPromptProps {
  question: string;
}

export function QuestionPrompt({ question }: QuestionPromptProps) {
  return (
    <Card className="border-dashed border-2 border-muted bg-muted/30">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <HelpCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <p className="text-sm italic text-muted-foreground">{question}</p>
        </div>
      </CardContent>
    </Card>
  );
}
