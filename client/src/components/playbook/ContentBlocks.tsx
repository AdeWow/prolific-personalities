import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Lightbulb, Zap, Brain, AlertTriangle, Clock, Target, HelpCircle, Check, Loader2, PenLine } from "lucide-react";
import { usePlaybookResponses } from "./InteractiveElements";

interface BlockProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function InsightBlock({ title, children, className = "" }: BlockProps) {
  return (
    <Card className={`border-l-4 border-l-amber-400 bg-amber-50/50 dark:bg-amber-950/20 animate-fade-in-up hover:shadow-md transition-shadow duration-200 ${className}`}>
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
    <Card className={`border-l-4 border-l-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 animate-fade-in-up hover:shadow-md transition-shadow duration-200 ${className}`}>
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
    <Card className={`border-l-4 border-l-purple-500 bg-purple-50/50 dark:bg-purple-950/20 animate-fade-in-up hover:shadow-md transition-shadow duration-200 ${className}`}>
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
    <Card className={`border-l-4 border-l-orange-500 bg-orange-50/50 dark:bg-orange-950/20 animate-fade-in-up hover:shadow-md transition-shadow duration-200 ${className}`}>
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

interface Session {
  access_token?: string;
}

interface DoThisNowProps {
  action: string;
  timeEstimate?: string;
  onComplete?: () => void;
  sectionId?: string;
  archetype?: string;
  session?: Session | null;
}

export function DoThisNowBlock({ action, timeEstimate = "2 min", onComplete, sectionId, archetype, session }: DoThisNowProps) {
  const canSave = !!sectionId && !!archetype;

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

        <div className="mt-4 pt-3 border-t border-primary/10">
          {canSave ? (
            <DoThisNowTextarea sectionId={sectionId!} archetype={archetype!} session={session} />
          ) : (
            <>
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mb-2">
                <PenLine className="w-3.5 h-3.5" />
                Your response
              </label>
              <Textarea
                placeholder="Write your answer here..."
                className="min-h-[80px] bg-white/80 dark:bg-slate-900/50 border-primary/20 focus:border-primary/40 resize-y text-sm"
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function DoThisNowTextarea({ sectionId, archetype, session }: { sectionId: string; archetype: string; session?: Session | null }) {
  const { getResponse, updateResponse, saveStatus } = usePlaybookResponses({
    archetype,
    sectionId,
    session,
    enabled: true,
  });

  const responseKey = `doNow_${sectionId}`;
  const savedValue = getResponse(responseKey, '');
  const [localValue, setLocalValue] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocalValue(savedValue);
  }, [savedValue]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleChange = useCallback((value: string) => {
    setLocalValue(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateResponse(responseKey, value);
    }, 800);
  }, [updateResponse, responseKey]);

  const handleBlur = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (localValue !== savedValue) {
      updateResponse(responseKey, localValue);
    }
  }, [localValue, savedValue, updateResponse, responseKey]);

  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
          <PenLine className="w-3.5 h-3.5" />
          Your response
        </label>
        {saveStatus === 'saving' && (
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Loader2 className="w-3 h-3 animate-spin" />
            Saving...
          </span>
        )}
        {saveStatus === 'saved' && (
          <span className="text-xs text-green-600 flex items-center gap-1">
            <Check className="w-3 h-3" />
            Saved
          </span>
        )}
      </div>
      <Textarea
        value={localValue}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={handleBlur}
        placeholder="Write your answer here..."
        className="min-h-[80px] bg-white/80 dark:bg-slate-900/50 border-primary/20 focus:border-primary/40 resize-y text-sm"
      />
    </>
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
    <Card className="h-full hover:shadow-md transition-all duration-200 animate-scale-in border-2 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700">
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
