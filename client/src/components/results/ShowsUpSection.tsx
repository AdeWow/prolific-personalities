import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";
import type { Archetype } from "@/data/archetypes";

interface ShowsUpSectionProps {
  archetype: Archetype;
}

export function ShowsUpSection({ archetype }: ShowsUpSectionProps) {
  const strengths = archetype.superpowers.slice(0, 3);
  const frictionPoints = archetype.blockers.slice(0, 3);

  return (
    <section className="py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-8 text-center">
          How This Shows Up in Your Work
        </h2>
        
        <Card className="bg-white shadow-lg" data-testid="shows-up-section">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-4 flex items-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600 mr-2" />
                  Strengths
                </h3>
                <ul className="space-y-3">
                  {strengths.map((power, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-green-600 font-bold">•</span>
                      <span className="text-muted-foreground">
                        <strong className="text-foreground">{power.title}:</strong> {power.description}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-foreground mb-4 flex items-center">
                  <XCircle className="w-6 h-6 text-red-500 mr-2" />
                  Friction Points
                </h3>
                <ul className="space-y-3">
                  {frictionPoints.map((blocker, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-red-500 font-bold">•</span>
                      <span className="text-muted-foreground">
                        <strong className="text-foreground">{blocker.title}:</strong> {blocker.description}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
