import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function RetakeSection() {
  return (
    <section className="py-12 no-print">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-white shadow-lg">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-foreground mb-2">Want to try again?</h3>
            <p className="text-muted-foreground mb-6">
              Your results are saved, but you can retake the assessment anytime to see if your archetype has evolved.
            </p>
            <Link href="/quiz">
              <Button className="gradient-primary text-white px-8 py-6 text-lg hover:shadow-lg transition-shadow">
                Retake Assessment
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
