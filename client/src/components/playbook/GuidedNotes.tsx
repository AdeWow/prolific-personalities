import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { PenLine, Sparkles } from "lucide-react";

interface GuidedNotesProps {
  sectionId: string;
  sectionTitle: string;
  existingNote?: string;
  onSave: (sectionId: string, content: string) => void;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  disabled?: boolean;
}

const sectionPrompts: Record<string, string[]> = {
  "core-traits": [
    "The trait that resonates most with me is...",
    "I notice my energy is highest when...",
    "The biggest surprise here was..."
  ],
  "science-behind": [
    "This explains why I always...",
    "I never realized that..."
  ],
  "planning-framework": [
    "My ideal morning block would be...",
    "The hardest part of time blocking for me is..."
  ],
  "tools-systems": [
    "The tool I'm most curious about is...",
    "I've tried before and it didn't work because..."
  ],
  "flexibility": [
    "When my plans break down, I usually...",
    "One small experiment I could try is..."
  ],
  "stress-management": [
    "My warning signs of overwhelm are...",
    "The simplest next step for me right now is..."
  ],
  "energy-management": [
    "My peak energy time is around...",
    "I waste the most energy on..."
  ],
  "long-term": [
    "In 3 months, I want my productivity system to...",
    "The habit I most want to cement is..."
  ],
  "pomodoro-setup": [
    "My start trigger will be...",
    "My end reward will be..."
  ],
  "body-doubling": [
    "I think body doubling could help me with...",
    "My first Focusmate session goal will be..."
  ],
  "common-issues": [
    "The problem I relate to most is...",
    "I'll try solving it by..."
  ],
  "capture-system": [
    "Currently I lose ideas by...",
    "My capture system will be..."
  ],
  "shipping": [
    "The project I keep not finishing is...",
    "'Done' for that project means..."
  ]
};

const defaultPrompts = [
  "What stood out to me most here was...",
  "I want to remember that...",
  "One thing I'll try differently is..."
];

export function GuidedNotes({ sectionId, sectionTitle, existingNote, onSave, saveStatus, disabled }: GuidedNotesProps) {
  const [noteContent, setNoteContent] = useState(existingNote || "");
  const [showPrompts, setShowPrompts] = useState(!existingNote);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const prompts = sectionPrompts[sectionId] || defaultPrompts;

  useEffect(() => {
    setNoteContent(existingNote || "");
    setShowPrompts(!existingNote);
  }, [existingNote, sectionId]);

  const handlePromptClick = (prompt: string) => {
    const newContent = noteContent ? `${noteContent}\n\n${prompt}` : prompt;
    setNoteContent(newContent);
    setShowPrompts(false);
    if (textareaRef.current) {
      textareaRef.current.focus();
      const len = newContent.length;
      textareaRef.current.setSelectionRange(len, len);
    }
  };

  const handleChange = (value: string) => {
    setNoteContent(value);
    onSave(sectionId, value);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PenLine className="w-4 h-4 text-primary" />
          <h3 className="font-medium text-foreground">Your Notes</h3>
        </div>
        <Badge variant="outline" className="text-xs">
          {sectionTitle}
        </Badge>
      </div>

      {showPrompts && !noteContent && (
        <Card className="border-dashed border-2 border-primary/30 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-primary mt-0.5" />
              <p className="text-sm text-muted-foreground">
                Start with a prompt, or write freely:
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {prompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePromptClick(prompt)}
                  className="text-xs px-3 py-1.5 rounded-full bg-background border border-border hover:border-primary hover:bg-primary/5 transition-colors text-left"
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Textarea
        ref={textareaRef}
        value={noteContent}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Write your thoughts, insights, and action items..."
        disabled={disabled}
        className="min-h-[180px] resize-none"
        data-testid="textarea-section-notes"
      />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-xs text-muted-foreground">
            {saveStatus === 'saving' && 'Saving...'}
            {saveStatus === 'saved' && '✓ Saved'}
            {saveStatus === 'error' && '✗ Error saving'}
            {saveStatus === 'idle' && 'Auto-saves as you type'}
          </p>
        </div>
        {noteContent && (
          <button
            onClick={() => setShowPrompts(!showPrompts)}
            className="text-xs text-primary hover:underline"
          >
            {showPrompts ? 'Hide prompts' : 'Show prompts'}
          </button>
        )}
      </div>
    </div>
  );
}
