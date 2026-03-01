import { useState, useRef, useEffect, useCallback } from "react";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, ChevronDown, ChevronUp, Loader2, Check } from "lucide-react";

interface InlineSectionNoteProps {
  sectionId: string;
  noteContent: string;
  saveStatus: "idle" | "saving" | "saved" | "error";
  onNoteChange: (sectionId: string, content: string) => void;
  onBlur: (sectionId: string) => void;
}

export function InlineSectionNote({
  sectionId,
  noteContent,
  saveStatus,
  onNoteChange,
  onBlur,
}: InlineSectionNoteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localValue, setLocalValue] = useState(noteContent);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const prevSectionRef = useRef(sectionId);

  // Sync local value when noteContent changes (navigation between sections, initial load)
  useEffect(() => {
    setLocalValue(noteContent);
  }, [noteContent]);

  // Collapse when navigating to a different section
  useEffect(() => {
    if (sectionId !== prevSectionRef.current) {
      prevSectionRef.current = sectionId;
      setIsOpen(false);
    }
  }, [sectionId]);

  // Auto-focus textarea when expanding
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      const el = textareaRef.current;
      // Small delay to let Collapsible animation start
      requestAnimationFrame(() => {
        el.focus();
        el.setSelectionRange(el.value.length, el.value.length);
      });
    }
  }, [isOpen]);

  const handleChange = useCallback(
    (value: string) => {
      setLocalValue(value);
      onNoteChange(sectionId, value);
    },
    [sectionId, onNoteChange]
  );

  const handleBlur = useCallback(() => {
    onBlur(sectionId);
  }, [sectionId, onBlur]);

  const hasContent = noteContent.trim().length > 0;
  const firstLine = hasContent
    ? noteContent.split("\n")[0].slice(0, 60) + (noteContent.split("\n")[0].length > 60 ? "..." : "")
    : "";

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mt-6 mb-2">
      <CollapsibleTrigger asChild>
        <button
          type="button"
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 hover:bg-slate-100/80 dark:hover:bg-slate-800/50 transition-colors text-left group"
        >
          <BookOpen className="w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
          <span className="flex-1 text-sm min-w-0">
            {hasContent ? (
              <span className="text-slate-600 dark:text-slate-300 truncate block">
                {firstLine}
              </span>
            ) : (
              <span className="text-slate-400 dark:text-slate-500 italic">
                Add a note...
              </span>
            )}
          </span>

          {/* Save status indicator (only when expanded) */}
          {isOpen && saveStatus === "saving" && (
            <span className="flex items-center gap-1 text-xs text-slate-400 flex-shrink-0">
              <Loader2 className="w-3 h-3 animate-spin" />
              Saving
            </span>
          )}
          {isOpen && saveStatus === "saved" && (
            <span className="flex items-center gap-1 text-xs text-green-500 flex-shrink-0">
              <Check className="w-3 h-3" />
              Saved
            </span>
          )}

          {/* Note indicator dot when collapsed with content */}
          {!isOpen && hasContent && (
            <span className="w-2 h-2 rounded-full bg-primary/60 flex-shrink-0" />
          )}

          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </button>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="px-4 pb-4 pt-2 border border-t-0 border-slate-200 dark:border-slate-700 rounded-b-lg bg-slate-50/50 dark:bg-slate-900/30 -mt-[1px]">
          <Textarea
            ref={textareaRef}
            value={localValue}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
            placeholder="Write your thoughts about this section..."
            className="min-h-[100px] bg-white/80 dark:bg-slate-800/50 border-slate-200 dark:border-slate-600 focus:border-slate-300 dark:focus:border-slate-500 resize-y text-sm leading-relaxed placeholder:italic"
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
