import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, ExternalLink, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { toolInfo, type PricingTier } from "./toolData";

interface ToolData {
  toolId: string;
  status: string;
  notes: string;
}

interface ToolsFocusedProps {
  recommendedTools: string[];
  toolsData: ToolData[];
  onUpdateTool: (toolId: string, status: string, notes?: string) => void;
  isPending?: boolean;
}

const STATUS_MAP: Record<string, string> = {
  "not_started": "Not Started",
  "Not Started": "Not Started",
  "testing": "Testing",
  "Testing": "Testing",
  "using_daily": "Using Daily",
  "Using Daily": "Using Daily"
};

const REVERSE_STATUS_MAP: Record<string, string> = {
  "Not Started": "Not Started",
  "Testing": "Testing",
  "Using Daily": "Using Daily"
};

const PRICING_STYLES: Record<PricingTier, string> = {
  Free: "bg-green-100 text-green-700 border-green-200",
  Freemium: "bg-blue-100 text-blue-700 border-blue-200",
  Paid: "bg-amber-100 text-amber-700 border-amber-200",
};

export function ToolsFocused({ recommendedTools, toolsData, onUpdateTool, isPending }: ToolsFocusedProps) {
  const getRawToolStatus = (toolId: string): string => {
    return toolsData.find(t => t.toolId === toolId)?.status || "Not Started";
  };

  const getDisplayStatus = (toolId: string): string => {
    const raw = getRawToolStatus(toolId);
    return STATUS_MAP[raw] || "Not Started";
  };

  const getToolNotes = (toolId: string) => {
    return toolsData.find(t => t.toolId === toolId)?.notes || "";
  };

  const handleStatusChange = (toolId: string, displayValue: string) => {
    const canonicalValue = REVERSE_STATUS_MAP[displayValue] || displayValue;
    onUpdateTool(toolId, canonicalValue, getToolNotes(toolId));
  };

  const primaryTool = recommendedTools[0];
  const alternativeTools = recommendedTools.slice(1);
  const primaryInfo = toolInfo[primaryTool] || {
    name: primaryTool.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    tagline: "Recommended productivity tool",
    why: "Matches your productivity archetype"
  };

  const renderPricingBadge = (pricing?: PricingTier) => {
    if (!pricing) return null;
    return (
      <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0 h-5 font-medium", PRICING_STYLES[pricing])}>
        {pricing}
      </Badge>
    );
  };

  const renderToolLink = (url?: string, name?: string) => {
    if (!url) return null;
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        Visit site
        <ExternalLink className="w-3 h-3" />
      </a>
    );
  };

  return (
    <div className="space-y-4">
      {/* Primary tool — featured card */}
      <Card className="bg-gradient-to-br from-primary/5 to-background border-primary/30">
        <CardContent className="p-6">
          <div className="flex items-start gap-4 mb-5">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Star className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <Badge variant="secondary" className="text-[10px]">Top Pick</Badge>
                {renderPricingBadge(primaryInfo.pricing)}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl font-bold text-foreground">{primaryInfo.name}</h3>
                {renderToolLink(primaryInfo.url, primaryInfo.name)}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">{primaryInfo.tagline}</p>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 mb-5">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-sm font-medium text-foreground">Why this tool: </span>
                <span className="text-sm text-muted-foreground">{primaryInfo.why}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Your status</span>
              <Select
                value={getDisplayStatus(primaryTool)}
                onValueChange={(value) => handleStatusChange(primaryTool, value)}
                disabled={isPending}
              >
                <SelectTrigger className="w-40" data-testid={`select-tool-${primaryTool}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Not Started">Not Started</SelectItem>
                  <SelectItem value="Testing">Testing</SelectItem>
                  <SelectItem value="Using Daily">Using Daily</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Textarea
              placeholder="Notes about your experience with this tool..."
              defaultValue={getToolNotes(primaryTool)}
              onBlur={(e) => {
                if (e.target.value !== getToolNotes(primaryTool)) {
                  onUpdateTool(primaryTool, getRawToolStatus(primaryTool), e.target.value);
                }
              }}
              disabled={isPending}
              className="resize-none"
              rows={3}
              data-testid={`textarea-tool-notes-${primaryTool}`}
            />
          </div>
        </CardContent>
      </Card>

      {/* Alternative tools — always visible */}
      {alternativeTools.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground px-1">Alternatives</p>
          {alternativeTools.map(toolId => {
            const info = toolInfo[toolId] || {
              name: toolId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
              tagline: "Alternative productivity tool",
              why: ""
            };

            return (
              <Card key={toolId} className="border-muted">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-foreground">{info.name}</h4>
                        {renderPricingBadge(info.pricing)}
                        {renderToolLink(info.url, info.name)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{info.tagline}</p>
                    </div>
                    <Select
                      value={getDisplayStatus(toolId)}
                      onValueChange={(value) => handleStatusChange(toolId, value)}
                      disabled={isPending}
                    >
                      <SelectTrigger className="w-32 h-8 text-xs flex-shrink-0" data-testid={`select-tool-${toolId}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Not Started">Not Started</SelectItem>
                        <SelectItem value="Testing">Testing</SelectItem>
                        <SelectItem value="Using Daily">Using Daily</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {info.why && (
                    <p className="text-xs text-muted-foreground/80 mt-1">{info.why}</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <p className="text-sm text-center text-muted-foreground italic">
            "Trying one tool beats configuring five."
          </p>
        </CardContent>
      </Card>

      <p className="text-xs text-center text-muted-foreground pt-1">
        These tools are also highlighted inline as you read through your playbook.
      </p>
    </div>
  );
}
