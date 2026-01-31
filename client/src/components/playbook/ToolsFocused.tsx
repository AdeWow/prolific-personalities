import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown, ChevronUp, Star, ExternalLink, Wrench, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

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

const toolInfo: Record<string, { name: string; tagline: string; why: string }> = {
  "todoist": { 
    name: "Todoist", 
    tagline: "Smart task management for structured minds",
    why: "Perfect for breaking down projects into actionable steps with deadlines"
  },
  "notion": { 
    name: "Notion", 
    tagline: "All-in-one workspace for organized thinking",
    why: "Ideal for creating interconnected systems and knowledge bases"
  },
  "google-calendar": { 
    name: "Google Calendar", 
    tagline: "Time blocking made simple",
    why: "Essential for protecting focus time and creating daily structure"
  },
  "toggl-track": { 
    name: "Toggl Track", 
    tagline: "Understand where your time really goes",
    why: "Reveals patterns in how you spend your productive hours"
  },
  "forest": { 
    name: "Forest", 
    tagline: "Gamified focus sessions",
    why: "Adds fun to focus blocks - grow trees by staying on task"
  },
  "rescuetime": { 
    name: "RescueTime", 
    tagline: "Automatic time tracking",
    why: "Runs in background to show your true productivity patterns"
  },
  "focusmate": { 
    name: "Focusmate", 
    tagline: "Virtual coworking sessions",
    why: "Body doubling accountability that gets you started on hard tasks"
  },
  "freedom": { 
    name: "Freedom", 
    tagline: "Block distracting sites",
    why: "Creates boundaries when willpower alone isn't enough"
  },
  "cold-turkey": { 
    name: "Cold Turkey", 
    tagline: "Unbreakable website blocker",
    why: "The nuclear option when you need serious focus protection"
  },
  "sunsama": { 
    name: "Sunsama", 
    tagline: "Calm daily planning",
    why: "Brings mindfulness to your daily task review"
  }
};

export function ToolsFocused({ recommendedTools, toolsData, onUpdateTool, isPending }: ToolsFocusedProps) {
  const [showAlternatives, setShowAlternatives] = useState(false);
  
  const getToolStatus = (toolId: string) => {
    const status = toolsData.find(t => t.toolId === toolId)?.status || "not_started";
    return status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const getToolNotes = (toolId: string) => {
    return toolsData.find(t => t.toolId === toolId)?.notes || "";
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
                value={getToolStatus(primaryTool)}
                onValueChange={(value) => onUpdateTool(primaryTool, value, getToolNotes(primaryTool))}
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
                  onUpdateTool(primaryTool, getToolStatus(primaryTool), e.target.value);
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
                          value={getToolStatus(toolId)}
                          onValueChange={(value) => onUpdateTool(toolId, value, getToolNotes(toolId))}
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
    </div>
  );
}
