import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Check, X } from "lucide-react";
import type { Tool } from "@shared/schema";

interface ToolCardProps {
  tool: Tool & { fitScore?: number };
}

export function ToolCard({ tool }: ToolCardProps) {
  const pricing = tool.pricing as any;
  const platforms = tool.platforms as string[];
  const pros = tool.pros as string[];
  const cons = tool.cons as string[];
  const tags = tool.tags as string[];

  const getPriceDisplay = () => {
    if (pricing.free && !pricing.freemium) {
      return "Free";
    }
    if (pricing.freemium) {
      return pricing.startingPrice
        ? `Free / $${pricing.startingPrice}/${pricing.billingPeriod}`
        : "Freemium";
    }
    return pricing.startingPrice
      ? `$${pricing.startingPrice}/${pricing.billingPeriod}`
      : "Paid";
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow" data-testid={`tool-card-${tool.toolId}`}>
      <CardContent className="p-6 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-neutral-800 mb-1" data-testid="tool-name">
              {tool.name}
            </h3>
            <p className="text-sm text-neutral-600 mb-2" data-testid="tool-tagline">
              {tool.tagline}
            </p>
            <div className="flex gap-2 flex-wrap mb-3">
              <Badge variant="secondary" className="text-xs">
                {getPriceDisplay()}
              </Badge>
              <Badge variant="outline" className="text-xs capitalize">
                {tool.learningCurve}
              </Badge>
              {tool.fitScore && (
                <Badge className="text-xs bg-green-100 text-green-700 border-green-200">
                  {tool.fitScore}% Match
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-neutral-700 mb-4 line-clamp-3">
          {tool.description}
        </p>

        {/* Tags */}
        <div className="flex gap-2 flex-wrap mb-4">
          {tags.slice(0, 4).map((tag, index) => (
            <span
              key={index}
              className="text-xs px-2 py-1 bg-neutral-100 text-neutral-600 rounded-md"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Pros & Cons - Condensed */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
          <div>
            <div className="font-semibold text-green-700 mb-1 flex items-center gap-1">
              <Check className="w-3 h-3" /> Pros
            </div>
            <ul className="space-y-1 text-neutral-600">
              {pros.slice(0, 2).map((pro, index) => (
                <li key={index} className="line-clamp-1">• {pro}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-semibold text-red-700 mb-1 flex items-center gap-1">
              <X className="w-3 h-3" /> Cons
            </div>
            <ul className="space-y-1 text-neutral-600">
              {cons.slice(0, 2).map((con, index) => (
                <li key={index} className="line-clamp-1">• {con}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Platforms */}
        <div className="text-xs text-neutral-500 mb-4">
          <strong>Platforms:</strong> {platforms.join(", ")}
        </div>

        {/* CTA */}
        <div className="mt-auto pt-4 border-t">
          <a
            href={tool.affiliateLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" data-testid="button-try-tool">
              Try {tool.name}
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
