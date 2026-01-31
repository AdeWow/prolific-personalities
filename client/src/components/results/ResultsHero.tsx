import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import type { Archetype } from "@/data/archetypes";

interface ResultsHeroProps {
  archetype: Archetype;
  confidence?: number;
  confidenceLevel?: 'exact' | 'strong' | 'moderate' | 'weak';
  secondaryArchetype?: { id: string; name: string } | null;
}

export function ResultsHero({ archetype, confidence, confidenceLevel, secondaryArchetype }: ResultsHeroProps) {
  return (
    <section className="py-12 bg-gradient-to-b from-white to-transparent">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-8">
          <Badge className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 text-green-700 font-semibold border-0">
            <Sparkles className="w-4 h-4 mr-2" />
            Assessment Complete!
          </Badge>
        </div>

        <Card className="bg-white shadow-xl border-0" data-testid="results-hero">
          <CardContent className="p-8 lg:p-12">
            <div className="text-center space-y-6">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-2" data-testid="archetype-name">
                  You're a {archetype.name}
                </h1>
                <p className="text-xl lg:text-2xl text-muted-foreground font-medium" data-testid="archetype-tagline">
                  {archetype.tagline}
                </p>
                
                {confidence !== undefined && confidenceLevel && (
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <Badge 
                      className={`px-4 py-2 text-sm font-semibold ${
                        confidenceLevel === 'exact' 
                          ? 'bg-green-100 text-green-700 border-green-300' 
                          : confidenceLevel === 'strong'
                          ? 'bg-blue-100 text-blue-700 border-blue-300'
                          : confidenceLevel === 'moderate'
                          ? 'bg-yellow-100 text-yellow-700 border-yellow-300'
                          : confidenceLevel === 'weak'
                          ? 'bg-accent/10 text-accent border-accent/30'
                          : 'bg-accent/10 text-accent border-accent/30'
                      }`}
                      data-testid="confidence-badge"
                    >
                      {confidence}% Match Confidence
                    </Badge>
                  </div>
                )}

                {secondaryArchetype && (
                  <p className="text-muted-foreground mt-4">
                    You also show traits of: <span className="font-semibold text-accent">{secondaryArchetype.name}</span>
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
