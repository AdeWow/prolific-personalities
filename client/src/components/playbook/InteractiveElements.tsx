import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Check, Loader2 } from 'lucide-react';

interface PlaybookResponse {
  id: number;
  userId: string;
  archetype: string;
  sectionId: string;
  responses: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

interface UsePlaybookResponsesProps {
  archetype: string;
  sectionId: string;
  enabled?: boolean;
}

export function usePlaybookResponses({ archetype, sectionId, enabled = true }: UsePlaybookResponsesProps) {
  const queryClient = useQueryClient();
  const [localResponses, setLocalResponses] = useState<Record<string, any>>({});
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const { data: responses, isLoading } = useQuery<PlaybookResponse[]>({
    queryKey: ['/api/playbook', archetype, 'responses', sectionId],
    queryFn: async () => {
      const res = await fetch(`/api/playbook/${archetype}/responses?sectionId=${sectionId}`);
      if (!res.ok) throw new Error('Failed to fetch responses');
      return res.json();
    },
    enabled: enabled && !!archetype && !!sectionId,
  });

  useEffect(() => {
    if (responses && responses.length > 0) {
      setLocalResponses(responses[0].responses || {});
    }
  }, [responses]);

  const saveMutation = useMutation({
    mutationFn: async (newResponses: Record<string, any>) => {
      const res = await fetch(`/api/playbook/${archetype}/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionId, responses: newResponses }),
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to save responses');
      return res.json();
    },
    onMutate: () => {
      setSaveStatus('saving');
    },
    onSuccess: () => {
      setSaveStatus('saved');
      queryClient.invalidateQueries({ queryKey: ['/api/playbook', archetype, 'responses'] });
      setTimeout(() => setSaveStatus('idle'), 2000);
    },
    onError: () => {
      setSaveStatus('idle');
    },
  });

  const updateResponse = useCallback((key: string, value: any) => {
    setLocalResponses(prev => {
      const newResponses = { ...prev, [key]: value };
      saveMutation.mutate(newResponses);
      return newResponses;
    });
  }, [saveMutation]);

  const getResponse = useCallback((key: string, defaultValue: any = null) => {
    return localResponses[key] ?? defaultValue;
  }, [localResponses]);

  return {
    responses: localResponses,
    updateResponse,
    getResponse,
    isLoading,
    saveStatus,
    isSaving: saveMutation.isPending,
  };
}

interface InteractiveCheckboxProps {
  id: string;
  label: string;
  archetype: string;
  sectionId: string;
  className?: string;
}

export function InteractiveCheckbox({ id, label, archetype, sectionId, className }: InteractiveCheckboxProps) {
  const { getResponse, updateResponse, isSaving } = usePlaybookResponses({
    archetype,
    sectionId,
  });

  const checked = getResponse(`checkbox_${id}`, false);

  return (
    <div className={cn("flex items-start gap-3 py-2 group", className)}>
      <div className="relative mt-0.5">
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={(value) => updateResponse(`checkbox_${id}`, value)}
          className="h-5 w-5 rounded border-2 border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all"
        />
        {isSaving && (
          <Loader2 className="absolute -right-5 top-0.5 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>
      <Label
        htmlFor={id}
        className={cn(
          "text-sm leading-relaxed cursor-pointer transition-all",
          checked && "line-through text-muted-foreground"
        )}
      >
        {label}
      </Label>
    </div>
  );
}

interface InteractiveRadioGroupProps {
  groupId: string;
  options: Array<{ value: string; label: string }>;
  archetype: string;
  sectionId: string;
  className?: string;
}

export function InteractiveRadioGroup({ groupId, options, archetype, sectionId, className }: InteractiveRadioGroupProps) {
  const { getResponse, updateResponse, isSaving } = usePlaybookResponses({
    archetype,
    sectionId,
  });

  const value = getResponse(`radio_${groupId}`, '');

  return (
    <div className={cn("relative", className)}>
      {isSaving && (
        <Loader2 className="absolute -right-6 top-1 h-4 w-4 animate-spin text-muted-foreground" />
      )}
      <RadioGroup
        value={value}
        onValueChange={(newValue) => updateResponse(`radio_${groupId}`, newValue)}
        className="space-y-2"
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-center gap-3">
            <RadioGroupItem
              value={option.value}
              id={`${groupId}_${option.value}`}
              className="h-5 w-5 border-2 border-slate-300"
            />
            <Label
              htmlFor={`${groupId}_${option.value}`}
              className="text-sm cursor-pointer"
            >
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}

interface InteractiveInputProps {
  inputId: string;
  placeholder?: string;
  archetype: string;
  sectionId: string;
  className?: string;
}

export function InteractiveInput({ inputId, placeholder, archetype, sectionId, className }: InteractiveInputProps) {
  const { getResponse, updateResponse, saveStatus } = usePlaybookResponses({
    archetype,
    sectionId,
  });
  
  const [localValue, setLocalValue] = useState('');
  const savedValue = getResponse(`input_${inputId}`, '');

  useEffect(() => {
    setLocalValue(savedValue);
  }, [savedValue]);

  const handleBlur = () => {
    if (localValue !== savedValue) {
      updateResponse(`input_${inputId}`, localValue);
    }
  };

  return (
    <div className={cn("relative", className)}>
      <Input
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        placeholder={placeholder}
        className="pr-8"
      />
      {saveStatus === 'saving' && (
        <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
      )}
      {saveStatus === 'saved' && (
        <Check className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
      )}
    </div>
  );
}

export function SaveIndicator({ status }: { status: 'idle' | 'saving' | 'saved' }) {
  if (status === 'idle') return null;

  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      {status === 'saving' ? (
        <>
          <Loader2 className="h-3 w-3 animate-spin" />
          <span>Saving...</span>
        </>
      ) : (
        <>
          <Check className="h-3 w-3 text-green-500" />
          <span>Saved</span>
        </>
      )}
    </div>
  );
}
