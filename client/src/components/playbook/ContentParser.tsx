import {
  InsightBlock,
  ActionBlock,
  WhyItMattersBlock,
  CommonMistakeBlock,
  DoThisNowBlock,
  CoreTraitCard,
  SectionHeader,
  BulletList,
  QuestionPrompt
} from "./ContentBlocks";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { InteractiveCheckbox } from "./InteractiveElements";
import { Star, TrendingUp } from "lucide-react";

interface ParsedContent {
  type: 'paragraph' | 'header' | 'insight' | 'action' | 'why' | 'warning' | 'doNow' | 'traits' | 'bullets' | 'question' | 'citation' | 'table' | 'checklist' | 'pattern' | 'superpowers-growth';
  content: string;
  metadata?: Record<string, any>;
}

function parseMarkdownContent(rawContent: string): ParsedContent[] {
  const blocks: ParsedContent[] = [];
  const lines = rawContent.split('\n');
  let currentBlock: string[] = [];
  let inBulletList = false;
  let bulletItems: string[] = [];

  const flushCurrentBlock = () => {
    if (currentBlock.length > 0) {
      const text = currentBlock.join('\n').trim();
      if (text) {
        blocks.push({ type: 'paragraph', content: text });
      }
      currentBlock = [];
    }
  };

  const flushBulletList = () => {
    if (bulletItems.length > 0) {
      blocks.push({ type: 'bullets', content: '', metadata: { items: bulletItems } });
      bulletItems = [];
    }
    inBulletList = false;
  };

  // Helper to detect if a line is part of a markdown table
  const isTableLine = (line: string) => {
    const trimmed = line.trim();
    return trimmed.startsWith('|') && trimmed.endsWith('|');
  };

  const isTableSeparator = (line: string) => {
    const trimmed = line.trim();
    return trimmed.startsWith('|') && /^[\|\s\-:]+$/.test(trimmed);
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith('**Your 4 Axes Profile:**')) {
      flushCurrentBlock();
      flushBulletList();
      const traits: Array<{ trait: string; level: string; raw: string }> = [];
      let j = i + 1;
      while (j < lines.length) {
        const traitLine = lines[j].trim();
        if (traitLine.startsWith('- ')) {
          const match = traitLine.match(/^- (\w+): (\w+)/);
          if (match) {
            traits.push({ trait: match[1], level: match[2], raw: traitLine.slice(2) });
          }
        } else if (traitLine && !traitLine.startsWith('-')) {
          break;
        }
        j++;
      }
      if (traits.length > 0) {
        blocks.push({ type: 'traits', content: '', metadata: { traits } });
        i = j - 1;
        continue;
      }
    }

    if (trimmed.startsWith('**Your Core Problem:**')) {
      flushCurrentBlock();
      flushBulletList();
      const content = trimmed.replace('**Your Core Problem:**', '').trim();
      let fullContent = content;
      let j = i + 1;
      while (j < lines.length && lines[j].trim() && !lines[j].trim().startsWith('**')) {
        fullContent += ' ' + lines[j].trim();
        j++;
      }
      blocks.push({ type: 'warning', content: fullContent, metadata: { title: 'Your Core Challenge' } });
      i = j - 1;
      continue;
    }

    // Detect pattern/cycle blocks: "**The Pattern:**" or "**What Happens Neurologically:**" or "**Your Pattern Without...**"
    if (trimmed.match(/^\*\*(The Pattern|What Happens Neurologically|Your Pattern Without[^*]*|Your Typical Time Allocation):\*\*$/)) {
      flushCurrentBlock();
      flushBulletList();
      const patternTitle = trimmed.replace(/\*\*/g, '').replace(/:$/, '');
      const steps: string[] = [];
      let j = i + 1;
      while (j < lines.length) {
        const stepLine = lines[j].trim();
        if (!stepLine) { j++; break; }
        if (stepLine.startsWith('**') && !stepLine.match(/^\*\*Result:\*\*/)) break;
        // Detect numbered steps (1. ..., 2. ...) or bullet steps (- ...)
        const numberedMatch = stepLine.match(/^\d+\.\s+(.+)/);
        const bulletMatch = stepLine.match(/^[-•]\s+(.+)/);
        if (numberedMatch) {
          steps.push(numberedMatch[1]);
        } else if (bulletMatch) {
          steps.push(bulletMatch[1]);
        } else if (steps.length === 0) {
          // Plain lines that contain → are also pattern steps
          if (stepLine.includes('→')) {
            steps.push(stepLine);
          } else {
            break;
          }
        } else {
          break;
        }
        j++;
      }
      if (steps.length >= 2) {
        blocks.push({ type: 'pattern', content: '', metadata: { title: patternTitle, steps } });
        i = j - 1;
        continue;
      }
    }

    // Detect Superpowers + Growth Areas pair → combine into one block for two-column layout
    if (trimmed.startsWith('**Your Superpowers:**')) {
      flushCurrentBlock();
      flushBulletList();
      const superpowerItems: string[] = [];
      let j = i + 1;
      while (j < lines.length && lines[j].trim().startsWith('- ')) {
        superpowerItems.push(lines[j].trim().slice(2));
        j++;
      }
      // Skip blank lines between Superpowers and Growth Areas
      while (j < lines.length && !lines[j].trim()) j++;
      // Check if Growth Areas immediately follows
      if (j < lines.length && lines[j].trim().startsWith('**Your Growth Areas:**')) {
        j++; // skip the header
        const growthItems: string[] = [];
        while (j < lines.length && lines[j].trim().startsWith('- ')) {
          growthItems.push(lines[j].trim().slice(2));
          j++;
        }
        if (superpowerItems.length > 0 && growthItems.length > 0) {
          blocks.push({ type: 'superpowers-growth', content: '', metadata: { superpowers: superpowerItems, growth: growthItems } });
          i = j - 1;
          continue;
        }
      }
      // Fallback: just Superpowers alone
      if (superpowerItems.length > 0) {
        blocks.push({ type: 'insight', content: superpowerItems.join('\n'), metadata: { title: 'Your Superpowers', items: superpowerItems } });
        i = j - 1;
        continue;
      }
    }

    if (trimmed.startsWith('**Your Growth Areas:**')) {
      flushCurrentBlock();
      flushBulletList();
      const items: string[] = [];
      let j = i + 1;
      while (j < lines.length && lines[j].trim().startsWith('- ')) {
        items.push(lines[j].trim().slice(2));
        j++;
      }
      if (items.length > 0) {
        blocks.push({ type: 'action', content: items.join('\n'), metadata: { title: 'Growth Opportunities', items } });
        i = j - 1;
        continue;
      }
    }

    if (trimmed.startsWith('**Citation:**')) {
      flushCurrentBlock();
      flushBulletList();
      const citation = trimmed.replace('**Citation:**', '').trim();
      blocks.push({ type: 'citation', content: citation });
      continue;
    }

    // Detect markdown tables (lines starting and ending with |)
    if (isTableLine(trimmed)) {
      flushCurrentBlock();
      flushBulletList();
      const tableLines: string[] = [line];
      let j = i + 1;
      while (j < lines.length && (isTableLine(lines[j].trim()) || isTableSeparator(lines[j].trim()))) {
        tableLines.push(lines[j]);
        j++;
      }
      if (tableLines.length >= 2) { // At least header + separator or header + row
        blocks.push({ type: 'table', content: tableLines.join('\n') });
        i = j - 1;
        continue;
      }
    }

    if (trimmed.match(/^\*\*[^*]+:\*\*$/)) {
      flushCurrentBlock();
      flushBulletList();
      const headerText = trimmed.replace(/\*\*/g, '').replace(/:$/, '');
      blocks.push({ type: 'header', content: headerText });
      continue;
    }

    // Detect checklist items with □ (empty box) or ☐ character
    const checklistMatch = trimmed.match(/^[-•]?\s*[□☐]\s+(.+)$/);
    if (checklistMatch) {
      flushCurrentBlock();
      flushBulletList();
      const checklistItems: string[] = [checklistMatch[1]];
      let j = i + 1;
      while (j < lines.length) {
        const nextLine = lines[j].trim();
        const nextMatch = nextLine.match(/^[-•]?\s*[□☐]\s+(.+)$/);
        if (nextMatch) {
          checklistItems.push(nextMatch[1]);
          j++;
        } else if (!nextLine) {
          break;
        } else {
          break;
        }
      }
      blocks.push({ type: 'checklist', content: '', metadata: { items: checklistItems } });
      i = j - 1;
      continue;
    }

    if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
      flushCurrentBlock();
      inBulletList = true;
      bulletItems.push(trimmed.slice(2));
      continue;
    } else if (inBulletList && !trimmed) {
      flushBulletList();
      continue;
    } else if (inBulletList) {
      flushBulletList();
    }

    if (trimmed.match(/^⚠️|^WARNING:|^CHAOTIC CREATIVE WARNING:/i)) {
      flushCurrentBlock();
      blocks.push({ type: 'warning', content: trimmed });
      continue;
    }

    if (trimmed) {
      currentBlock.push(line);
    } else {
      flushCurrentBlock();
    }
  }

  flushCurrentBlock();
  flushBulletList();

  return blocks;
}

interface Session {
  access_token?: string;
}

interface ContentRendererProps {
  content: string;
  sectionId?: string;
  archetype?: string;
  session?: Session | null;
}

const traitDescriptions: Record<string, { explanation: string; dayMeaning: string }> = {
  "Structure": {
    explanation: "How much you need external systems and routines",
    dayMeaning: "Your calendar and task lists are your allies"
  },
  "Motivation": {
    explanation: "What drives you to take action",
    dayMeaning: "Set up external accountability to stay on track"
  },
  "Focus": {
    explanation: "How you process and approach work",
    dayMeaning: "Break big projects into specific action items"
  },
  "Task": {
    explanation: "How you move from planning to action",
    dayMeaning: "Clear direction helps you execute confidently"
  }
};

export function ContentRenderer({ content, sectionId, archetype = '', session }: ContentRendererProps) {
  const blocks = parseMarkdownContent(content);
  
  const doThisNowAction = getDoThisNowAction(sectionId);

  return (
    <div className="space-y-6">
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'header':
            return (
              <h4 key={idx} className="text-xl font-semibold text-foreground mt-10 mb-3 first:mt-0">
                {block.content}
              </h4>
            );

          case 'traits':
            const traits = block.metadata?.traits || [];
            return (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                {traits.map((t: any, i: number) => {
                  const desc = traitDescriptions[t.trait] || {
                    explanation: t.raw.split(' - ')[1] || "Key aspect of your productivity style",
                    dayMeaning: "This shapes how you work best"
                  };
                  return (
                    <CoreTraitCard
                      key={i}
                      trait={t.trait}
                      level={t.level as "HIGH" | "LOW" | "MIXED"}
                      explanation={desc.explanation}
                      dayMeaning={desc.dayMeaning}
                    />
                  );
                })}
              </div>
            );

          case 'pattern':
            const steps = block.metadata?.steps || [];
            return (
              <Card key={idx} className="border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 my-6 overflow-hidden">
                <CardContent className="p-5 sm:p-6">
                  <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-5">
                    {block.metadata?.title || 'The Pattern'}
                  </h4>
                  <div className="relative pl-8">
                    {/* Vertical connecting line */}
                    <div className="absolute left-[11px] top-3 bottom-3 w-px bg-gradient-to-b from-primary/60 via-primary/30 to-primary/10" />
                    <div className="space-y-0">
                      {steps.map((step: string, i: number) => (
                        <div key={i} className="relative flex items-start group">
                          {/* Step number circle */}
                          <div className="absolute -left-8 top-1 flex items-center justify-center">
                            <div className="w-[22px] h-[22px] rounded-full bg-white dark:bg-slate-800 border-2 border-primary/50 group-hover:border-primary flex items-center justify-center transition-colors z-10">
                              <span className="text-[10px] font-bold text-primary">{i + 1}</span>
                            </div>
                          </div>
                          {/* Step content */}
                          <div className="py-3 pl-2 flex-1">
                            <p className="text-sm text-foreground leading-relaxed">{step}</p>
                          </div>
                          {/* Arrow connector (except last) */}
                          {i < steps.length - 1 && (
                            <div className="absolute -left-[21px] bottom-[-2px] text-primary/30 text-xs z-10">
                              ↓
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );

          case 'superpowers-growth':
            const superpowers = block.metadata?.superpowers || [];
            const growth = block.metadata?.growth || [];
            return (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                {/* Superpowers Card */}
                <Card className="border-l-4 border-l-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/10 hover:shadow-md transition-shadow duration-200">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                        <Star className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <h4 className="font-semibold text-emerald-900 dark:text-emerald-100">Your Superpowers</h4>
                    </div>
                    <ul className="space-y-2.5">
                      {superpowers.map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm">
                          <span className="text-emerald-500 mt-0.5 flex-shrink-0">✦</span>
                          <span className="text-emerald-800 dark:text-emerald-200">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                {/* Growth Opportunities Card */}
                <Card className="border-l-4 border-l-amber-400 bg-amber-50/30 dark:bg-amber-950/10 hover:shadow-md transition-shadow duration-200">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                        <TrendingUp className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <h4 className="font-semibold text-amber-900 dark:text-amber-100">Growth Opportunities</h4>
                    </div>
                    <ul className="space-y-2.5">
                      {growth.map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm">
                          <span className="text-amber-500 mt-0.5 flex-shrink-0">→</span>
                          <span className="text-amber-800 dark:text-amber-200">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            );

          case 'insight':
            if (block.metadata?.items) {
              return (
                <InsightBlock key={idx} title={block.metadata.title}>
                  <ul className="space-y-2">
                    {block.metadata.items.map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-500 mt-0.5">✦</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </InsightBlock>
              );
            }
            return (
              <InsightBlock key={idx} title={block.metadata?.title}>
                {block.content}
              </InsightBlock>
            );

          case 'action':
            if (block.metadata?.items) {
              return (
                <ActionBlock key={idx} title={block.metadata.title}>
                  <ul className="space-y-2">
                    {block.metadata.items.map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-500 mt-0.5">→</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </ActionBlock>
              );
            }
            return (
              <ActionBlock key={idx} title={block.metadata?.title}>
                {block.content}
              </ActionBlock>
            );

          case 'warning':
            return (
              <CommonMistakeBlock key={idx} title={block.metadata?.title}>
                {block.content}
              </CommonMistakeBlock>
            );

          case 'why':
            return (
              <WhyItMattersBlock key={idx}>
                {block.content}
              </WhyItMattersBlock>
            );

          case 'bullets':
            return (
              <BulletList key={idx} items={block.metadata?.items || []} />
            );

          case 'citation':
            return (
              <Card key={idx} className="bg-muted/30 border-l-2 border-muted">
                <CardContent className="p-3">
                  <p className="text-xs text-muted-foreground italic">{block.content}</p>
                </CardContent>
              </Card>
            );

          case 'table':
            return (
              <div key={idx} className="overflow-x-auto my-6 rounded-xl border border-slate-200 dark:border-slate-700">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    table: ({children}) => (
                      <table className="w-full text-sm">{children}</table>
                    ),
                    thead: ({children}) => (
                      <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">{children}</thead>
                    ),
                    th: ({children}) => (
                      <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">{children}</th>
                    ),
                    td: ({children}) => (
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800">{children}</td>
                    ),
                    tr: ({children}) => (
                      <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">{children}</tr>
                    ),
                  }}
                >
                  {block.content}
                </ReactMarkdown>
              </div>
            );

          case 'checklist':
            const checklistItems = block.metadata?.items || [];
            return (
              <Card key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm animate-fade-in-up">
                <CardContent className="p-4">
                  <div className="space-y-1">
                    {checklistItems.map((item: string, i: number) => (
                      <InteractiveCheckbox
                        key={i}
                        id={`${sectionId || 'section'}_${idx}_${i}`}
                        label={item}
                        archetype={archetype}
                        sectionId={sectionId || 'default'}
                        session={session}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            );

          case 'paragraph':
          default:
            const cleanContent = block.content
              .replace(/\*\*([^*]+)\*\*/g, '$1')
              .replace(/^\d+\.\s+/gm, '');

            if (cleanContent.length < 20) return null;

            return (
              <p key={idx} className="text-[15px] text-muted-foreground leading-[1.75]">
                {cleanContent}
              </p>
            );
        }
      })}

      {doThisNowAction && (
        <div className="mt-8">
          <DoThisNowBlock
            action={doThisNowAction.action}
            timeEstimate={doThisNowAction.time}
            sectionId={sectionId}
            archetype={archetype}
            session={session}
          />
        </div>
      )}
    </div>
  );
}

export function getDoThisNowAction(sectionId?: string): { action: string; time: string } | null {
  const actions: Record<string, { action: string; time: string }> = {
    "core-traits": {
      action: "Choose the one trait above that feels most accurate for you right now.",
      time: "1 min"
    },
    "science-behind": {
      action: "Write down one time when this science matched your experience.",
      time: "2 min"
    },
    "planning-framework": {
      action: "Open your calendar and block one 90-minute 'deep work' session this week.",
      time: "2 min"
    },
    "tools-systems": {
      action: "Pick ONE tool from this list and install or sign up for it right now.",
      time: "3 min"
    },
    "flexibility": {
      action: "Think of one thing that went wrong last week. What's one tiny adaptation you could make?",
      time: "2 min"
    },
    "stress-management": {
      action: "List your top 3 tasks for tomorrow. Cross out 2. The one remaining is your priority.",
      time: "1 min"
    },
    "energy-management": {
      action: "Notice your energy right now (1-10). Set a reminder to check again in 2 hours.",
      time: "1 min"
    },
    "long-term": {
      action: "Write one sentence: 'In 30 days, I want to consistently...'",
      time: "2 min"
    },
    "pomodoro-setup": {
      action: "Set a 25-minute timer right now and work on ONE thing until it rings.",
      time: "25 min"
    },
    "body-doubling": {
      action: "Book a Focusmate session for tomorrow (or today if you're feeling brave).",
      time: "2 min"
    },
    "common-issues": {
      action: "Pick the problem you relate to most and try the solution for just today.",
      time: "1 min"
    },
    "capture-system": {
      action: "Grab 5 Post-Its. Put them next to your computer. That's your capture system.",
      time: "1 min"
    },
    "shipping": {
      action: "Name one project you've been avoiding finishing. Write 3 'done' criteria for it.",
      time: "3 min"
    }
  };

  return sectionId ? actions[sectionId] || null : null;
}
