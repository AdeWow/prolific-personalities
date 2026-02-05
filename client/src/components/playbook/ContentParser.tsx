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

interface ParsedContent {
  type: 'paragraph' | 'header' | 'insight' | 'action' | 'why' | 'warning' | 'doNow' | 'traits' | 'bullets' | 'question' | 'citation' | 'table' | 'checklist';
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

    if (trimmed.startsWith('**Your Superpowers:**')) {
      flushCurrentBlock();
      flushBulletList();
      const items: string[] = [];
      let j = i + 1;
      while (j < lines.length && lines[j].trim().startsWith('- ')) {
        items.push(lines[j].trim().slice(2));
        j++;
      }
      if (items.length > 0) {
        blocks.push({ type: 'insight', content: items.join('\n'), metadata: { title: 'Your Superpowers', items } });
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
    <div className="space-y-4">
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'header':
            return (
              <h4 key={idx} className="text-lg font-semibold text-foreground mt-6 mb-2">
                {block.content}
              </h4>
            );
          
          case 'traits':
            const traits = block.metadata?.traits || [];
            return (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
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
          
          case 'insight':
            if (block.metadata?.items) {
              return (
                <InsightBlock key={idx} title={block.metadata.title}>
                  <ul className="space-y-1">
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
                  <ul className="space-y-1">
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
              <p key={idx} className="text-sm text-muted-foreground leading-relaxed">
                {cleanContent}
              </p>
            );
        }
      })}
      
      {doThisNowAction && (
        <div className="mt-6">
          <DoThisNowBlock 
            action={doThisNowAction.action} 
            timeEstimate={doThisNowAction.time}
          />
        </div>
      )}
    </div>
  );
}

function getDoThisNowAction(sectionId?: string): { action: string; time: string } | null {
  const actions: Record<string, { action: string; time: string }> = {
    "core-traits": {
      action: "Circle the one trait above that feels most accurate for you right now.",
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
