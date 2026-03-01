import { ExternalLink, Wrench, Sparkles } from "lucide-react";
import { toolInfo } from "./toolData";

// ─── Single inline tool card (compact, informational only) ───

interface InlineToolCardProps {
  toolId: string;
}

export function InlineToolCard({ toolId }: InlineToolCardProps) {
  const info = toolInfo[toolId];
  if (!info) return null;

  return (
    <div className="flex items-start gap-3 px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 border-l-[3px] border-l-slate-400 dark:border-l-slate-500 animate-fade-in-up">
      <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Wrench className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-foreground">
            {info.name}
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">
            Tool
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
          {info.tagline}
        </p>
      </div>
      {info.url && (
        <a
          href={info.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium flex-shrink-0 mt-1 transition-colors"
        >
          Try this
          <ExternalLink className="w-3 h-3" />
        </a>
      )}
    </div>
  );
}

// ─── Group of inline tool cards (stacked after a single block) ───

interface InlineToolCardGroupProps {
  toolIds: string[];
}

export function InlineToolCardGroup({ toolIds }: InlineToolCardGroupProps) {
  if (toolIds.length === 0) return null;
  return (
    <div className="space-y-2">
      {toolIds.map((id) => (
        <InlineToolCard key={id} toolId={id} />
      ))}
    </div>
  );
}

// ─── Recommended Tools fallback (end of Framework chapters without inline mentions) ───

interface RecommendedToolsBlockProps {
  toolIds: string[];
}

export function RecommendedToolsBlock({ toolIds }: RecommendedToolsBlockProps) {
  const validTools = toolIds.filter((id) => toolInfo[id]);
  if (validTools.length === 0) return null;

  return (
    <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-primary" />
        <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          Recommended Tools
        </h4>
      </div>
      <div className="space-y-2">
        {validTools.slice(0, 3).map((id) => (
          <InlineToolCard key={id} toolId={id} />
        ))}
      </div>
    </div>
  );
}
