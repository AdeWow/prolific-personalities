import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { usePlaybookResponses } from './InteractiveElements';
import { cn } from '@/lib/utils';
import { Lightbulb, Battery, Clock, Target, Check, Loader2 } from 'lucide-react';

interface Session {
  access_token?: string;
}

interface ContextAssessmentProps {
  archetype: string;
  sectionId: string;
  session?: Session | null;
  className?: string;
}

const pressureLevels = [
  { value: 'low', label: 'Low', description: 'Plenty of time, no urgency' },
  { value: 'medium', label: 'Medium', description: 'Reasonable deadline ahead' },
  { value: 'high', label: 'High', description: 'Urgent, time-sensitive' },
];

const clarityLevels = [
  { value: 'low', label: 'Low', description: "I'm unsure what to do next" },
  { value: 'medium', label: 'Medium', description: 'I have a rough idea' },
  { value: 'high', label: 'High', description: 'I know exactly what to do' },
];

const getRecommendedApproach = (energy: number, pressure: string, clarity: string): string => {
  if (energy >= 7 && pressure === 'low' && clarity === 'low') {
    return 'Creative exploration - brainstorm freely, capture ideas';
  }
  if (energy >= 7 && pressure === 'high' && clarity === 'high') {
    return 'Deep work sprint - eliminate distractions and execute';
  }
  if (energy >= 7 && pressure === 'low' && clarity === 'high') {
    return 'Strategic planning - invest time in thinking ahead';
  }
  if (energy >= 5 && energy < 7 && pressure === 'medium') {
    return 'Focused blocks - work in 25-50 min intervals with breaks';
  }
  if (energy < 5 && pressure === 'high') {
    return 'Triage mode - do only essential tasks, defer the rest';
  }
  if (energy < 5 && pressure === 'low') {
    return 'Recovery mode - handle admin tasks, rest and recharge';
  }
  if (clarity === 'low') {
    return 'Clarify first - define your next concrete step before starting';
  }
  return 'Balanced approach - mix focused work with regular breaks';
};

export function ContextAssessment({ archetype, sectionId, session, className }: ContextAssessmentProps) {
  const { getResponse, updateResponse, saveStatus, isLoading } = usePlaybookResponses({
    archetype,
    sectionId,
    session,
  });

  const energy = getResponse('context_energy', 5);
  const pressure = getResponse('context_pressure', 'medium');
  const clarity = getResponse('context_clarity', 'medium');
  const recommendation = getRecommendedApproach(energy, pressure, clarity);

  if (isLoading) {
    return (
      <Card className={cn("border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 animate-pulse", className)}>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 bg-slate-200 rounded" />
            <div className="h-6 w-48 bg-slate-200 rounded" />
          </div>
          <div className="h-4 w-64 bg-slate-100 rounded mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="h-8 bg-slate-100 rounded" />
          <div className="h-24 bg-slate-100 rounded" />
          <div className="h-24 bg-slate-100 rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Target className="h-5 w-5 text-primary" />
          Context Assessment Protocol
          {saveStatus === 'saving' && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground ml-auto" />
          )}
          {saveStatus === 'saved' && (
            <span className="flex items-center gap-1 text-sm font-normal text-green-600 ml-auto">
              <Check className="h-4 w-4" />
              Saved
            </span>
          )}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Check in with yourself to determine the best approach for right now.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Battery className="h-4 w-4 text-amber-500" />
            <Label className="font-medium">Energy Level</Label>
            <span className="ml-auto text-sm font-medium text-primary">{energy}/10</span>
          </div>
          <Slider
            value={[energy]}
            onValueChange={(value) => updateResponse('context_energy', value[0])}
            min={1}
            max={10}
            step={1}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Exhausted</span>
            <span>Peak Energy</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-red-500" />
            <Label className="font-medium">Time Pressure</Label>
          </div>
          <RadioGroup
            value={pressure}
            onValueChange={(value) => updateResponse('context_pressure', value)}
            className="grid grid-cols-3 gap-3"
          >
            {pressureLevels.map((level) => (
              <div key={level.value}>
                <RadioGroupItem
                  value={level.value}
                  id={`pressure-${level.value}`}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={`pressure-${level.value}`}
                  className={cn(
                    "flex flex-col items-center justify-center rounded-lg border-2 p-3 cursor-pointer transition-all",
                    "hover:border-slate-300 dark:hover:border-slate-600",
                    pressure === level.value
                      ? "border-primary bg-primary/5"
                      : "border-slate-200 dark:border-slate-700"
                  )}
                >
                  <span className="font-medium text-sm">{level.label}</span>
                  <span className="text-xs text-muted-foreground text-center mt-1">{level.description}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-blue-500" />
            <Label className="font-medium">Task Clarity</Label>
          </div>
          <RadioGroup
            value={clarity}
            onValueChange={(value) => updateResponse('context_clarity', value)}
            className="grid grid-cols-3 gap-3"
          >
            {clarityLevels.map((level) => (
              <div key={level.value}>
                <RadioGroupItem
                  value={level.value}
                  id={`clarity-${level.value}`}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={`clarity-${level.value}`}
                  className={cn(
                    "flex flex-col items-center justify-center rounded-lg border-2 p-3 cursor-pointer transition-all",
                    "hover:border-slate-300 dark:hover:border-slate-600",
                    clarity === level.value
                      ? "border-primary bg-primary/5"
                      : "border-slate-200 dark:border-slate-700"
                  )}
                >
                  <span className="font-medium text-sm">{level.label}</span>
                  <span className="text-xs text-muted-foreground text-center mt-1">{level.description}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold text-primary uppercase tracking-wide">
              Your Recommended Approach
            </span>
          </div>
          <p className="text-lg font-semibold text-foreground">
            {recommendation}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
