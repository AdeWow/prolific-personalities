import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ToolCard } from "@/components/tool-card";
import { Wrench } from "lucide-react";
import type { ToolWithFitScore } from "@shared/schema";

interface ToolsAccordionProps {
  tools: ToolWithFitScore[];
  archetypeName: string;
}

export function ToolsAccordion({ tools, archetypeName }: ToolsAccordionProps) {
  if (!tools || tools.length === 0) {
    return null;
  }

  return (
    <section className="py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="tools" className="border rounded-lg bg-white shadow-sm">
            <AccordionTrigger className="px-6 py-4 hover:no-underline" data-testid="tools-accordion-trigger">
              <div className="flex items-center gap-3">
                <Wrench className="w-5 h-5 text-primary" />
                <span className="font-semibold text-foreground">Explore recommended tools (optional)</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4" data-testid="tools-grid">
                {tools.slice(0, 9).map((tool) => (
                  <ToolCard key={tool.id} tool={tool} archetypeName={archetypeName} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
