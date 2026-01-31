import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Lock, CheckCircle2, ArrowRight, CreditCard, Zap } from "lucide-react";
import type { Archetype } from "@/data/archetypes";

interface UpsellSectionProps {
  archetype: Archetype;
  sessionId: string;
  onUpgrade: () => void;
  isUpgrading: boolean;
  promoCode: string;
  setPromoCode: (code: string) => void;
  promoCodeValid: boolean | null;
  promoCodeMessage: string;
  onValidatePromo: () => void;
  onApplyPromo: () => void;
  isApplyingPromo: boolean;
}

export function UpsellSection({
  archetype,
  onUpgrade,
  isUpgrading,
  promoCode,
  setPromoCode,
  promoCodeValid,
  promoCodeMessage,
  onValidatePromo,
  onApplyPromo,
  isApplyingPromo,
}: UpsellSectionProps) {
  const [showPromoInput, setShowPromoInput] = useState(false);

  return (
    <section id="upsell" className="py-16 gradient-primary scroll-mt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-white shadow-2xl" data-testid="premium-preview">
          <CardContent className="p-8 lg:p-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-3">
                Unlock Your Complete {archetype.title} Playbook
              </h2>
              <p className="text-lg text-muted-foreground">
                Transform insight into action with your personalized productivity system
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h4 className="font-bold text-foreground mb-3 flex items-center">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-green-600" />
                  3 Full Framework Guides
                </h4>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  {archetype.premiumIncludes.frameworks.map((item, index) => (
                    <li key={index} className="pl-7">• {item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-foreground mb-3 flex items-center">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-green-600" />
                  Tool Recommendations
                </h4>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  {archetype.premiumIncludes.tools.map((item, index) => (
                    <li key={index} className="pl-7">• {item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-foreground mb-3 flex items-center">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-green-600" />
                  30-Day Implementation Plan
                </h4>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  {archetype.premiumIncludes.plan.map((item, index) => (
                    <li key={index} className="pl-7">• {item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-foreground mb-3 flex items-center">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-green-600" />
                  Common Failure Modes
                </h4>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  {archetype.premiumIncludes.special.map((item, index) => (
                    <li key={index} className="pl-7">• {item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t pt-8">
              <div className="flex items-center justify-center gap-2 mb-4 text-sm text-muted-foreground">
                <span className="inline-flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                <span>12 people purchased in the last 24 hours</span>
              </div>

              <div className="mb-6">
                {!showPromoInput ? (
                  <button
                    type="button"
                    onClick={() => setShowPromoInput(true)}
                    className="text-sm text-primary hover:underline"
                    data-testid="button-show-promo"
                  >
                    Have a promo code?
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Enter promo code"
                        className="flex-1"
                        data-testid="input-promo-code"
                      />
                      <Button
                        variant="outline"
                        onClick={onValidatePromo}
                        disabled={!promoCode.trim()}
                        data-testid="button-validate-promo"
                      >
                        Check
                      </Button>
                    </div>
                    {promoCodeMessage && (
                      <p className={`text-sm ${promoCodeValid ? 'text-green-600' : 'text-red-500'}`}>
                        {promoCodeMessage}
                      </p>
                    )}
                    {promoCodeValid && (
                      <Button
                        className="w-full gradient-primary text-white"
                        onClick={onApplyPromo}
                        disabled={isApplyingPromo}
                        data-testid="button-apply-promo"
                      >
                        {isApplyingPromo ? 'Applying...' : 'Apply Promo Code & Get Access'}
                      </Button>
                    )}
                  </div>
                )}
              </div>

              <Button 
                size="lg" 
                className="w-full gradient-primary text-white text-lg py-6 hover:shadow-xl transition-all"
                data-testid="button-get-premium"
                onClick={onUpgrade}
                disabled={isUpgrading}
              >
                {isUpgrading ? 'Processing...' : 'Get My Full Report — $19'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <p className="text-center text-muted-foreground text-sm mt-4">
                One-time payment • Instant download • 100+ page personalized playbook
              </p>
              <p className="text-center text-muted-foreground text-xs mt-2">
                30-day satisfaction guarantee.{" "}
                <Link href="/refund-policy" className="text-primary hover:underline" data-testid="link-refund-policy">
                  View refund policy
                </Link>
              </p>

              <div className="mt-6 pt-4 border-t border-neutral-100">
                <div className="flex flex-wrap justify-center items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Lock className="h-4 w-4" />
                    <span>Secure Checkout</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CreditCard className="h-4 w-4" />
                    <span>Powered by Stripe</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="h-4 w-4" />
                    <span>Instant Access</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
