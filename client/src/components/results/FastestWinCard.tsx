import { Card, CardContent } from "@/components/ui/card";
import { Zap, ArrowDown } from "lucide-react";
import type { Archetype } from "@/data/archetypes";

interface FastestWinCardProps {
  archetype: Archetype;
}

export function FastestWinCard({ archetype }: FastestWinCardProps) {
  const fastestWin = archetype.quickWins[0];

  const scrollToUpsell = () => {
    document.getElementById("upsell")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-12 bg-white/50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 shadow-xl" data-testid="fastest-win-card">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Your Fastest Win Today</h2>
            </div>
            
            <h3 className="text-xl font-bold text-foreground mb-3">{fastestWin.title}</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">{fastestWin.description}</p>
            
            <button 
              onClick={scrollToUpsell}
              className="flex items-center text-primary font-semibold hover:text-primary/80 transition-colors cursor-pointer group"
              data-testid="link-see-more-strategies"
            >
              See more strategies in the full playbook
              <ArrowDown className="w-4 h-4 ml-2 group-hover:translate-y-1 transition-transform" />
            </button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
