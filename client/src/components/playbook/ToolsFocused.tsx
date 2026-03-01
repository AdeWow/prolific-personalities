import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown, ChevronUp, Star, ExternalLink, Wrench, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { toolInfo } from "./toolData";

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

export function ToolsFocused({ recommendedTools, toolsData, onUpdateTool, isPending }: ToolsFocusedProps) {
  const [showAlternatives, setShowAlternatives] = useState(false);
  
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

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-primary/5 to-background border-primary/30">
        <CardContent className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Star className="w-6 h-6 text-primary" />
            </div>
            <div>
              <Badge variant="secondary" className="mb-2">Recommended for You</Badge>
              <h3 className="text-xl font-bold text-foreground">{primaryInfo.name}</h3>
              <p className="text-sm text-muted-foreground">{primaryInfo.tagline}</p>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 mb-6">
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

      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <p className="text-sm text-center text-muted-foreground italic">
            "Trying one tool beats configuring five."
          </p>
        </CardContent>
      </Card>

      {alternativeTools.length > 0 && (
        <div>
          <Button
            variant="ghost"
            className="w-full justify-between text-muted-foreground hover:text-foreground"
            onClick={() => setShowAlternatives(!showAlternatives)}
          >
            <span className="text-sm flex items-center gap-2">
              <Wrench className="w-4 h-4" />
              See alternatives ({alternativeTools.length})
            </span>
            {showAlternatives ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
          
          {showAlternatives && (
            <div className="space-y-3 mt-3">
              {alternativeTools.map(toolId => {
                const info = toolInfo[toolId] || { 
                  name: toolId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                  tagline: "Alternative productivity tool",
                  why: ""
                };
                
                return (
                  <Card key={toolId} className="border-muted">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-foreground">{info.name}</h4>
                        <Select
                          value={getDisplayStatus(toolId)}
                          onValueChange={(value) => handleStatusChange(toolId, value)}
                          disabled={isPending}
                        >
                          <SelectTrigger className="w-32 h-8 text-xs" data-testid={`select-tool-${toolId}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Not Started">Not Started</SelectItem>
                            <SelectItem value="Testing">Testing</SelectItem>
                            <SelectItem value="Using Daily">Using Daily</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <p className="text-xs text-muted-foreground">{info.tagline}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      <p className="text-xs text-center text-muted-foreground pt-2">
        These tools are also highlighted inline as you read through your playbook.
      </p>
    </div>
  );
}
