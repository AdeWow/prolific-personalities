import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle2, ArrowRight } from "lucide-react";
import type { Archetype } from "@/data/archetypes";

interface EmailFallbackSectionProps {
  archetype: Archetype;
  email: string;
  setEmail: (email: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  emailSaved: boolean;
}

export function EmailFallbackSection({
  archetype,
  email,
  setEmail,
  onSubmit,
  isSubmitting,
  emailSaved,
}: EmailFallbackSectionProps) {
  return (
    <section className="py-12 bg-muted/50">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-white shadow-md border border-neutral-200" data-testid="email-fallback-section">
          <CardContent className="p-6">
            <div className="text-center mb-4">
              <Mail className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-xl font-bold text-foreground mb-1">
                Not ready yet?
              </h3>
              <p className="text-muted-foreground text-sm">
                Get a free quick-start guide for your archetype.
              </p>
            </div>

            {!emailSaved ? (
              <form onSubmit={onSubmit} className="space-y-3">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                  data-testid="input-email-fallback"
                />
                <Button
                  type="submit"
                  variant="outline"
                  className="w-full"
                  disabled={isSubmitting || emailSaved}
                  data-testid="button-submit-email-fallback"
                >
                  {isSubmitting ? "Sending..." : "Get My Free Guide"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Free forever. Unsubscribe anytime.
                </p>
              </form>
            ) : (
              <div className="text-center py-2" data-testid="email-fallback-success">
                <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-green-600" />
                <p className="text-sm font-medium text-green-700">Your guide is on the way!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
