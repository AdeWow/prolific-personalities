import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, X } from "lucide-react";

interface MobileStickyCTAProps {
  heroRef: React.RefObject<HTMLElement | null>;
  hasPremiumAccess?: boolean;
}

export function MobileStickyCTA({ heroRef, hasPremiumAccess }: MobileStickyCTAProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const heroRect = heroRef.current.getBoundingClientRect();
        setIsVisible(heroRect.bottom < 0);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [heroRef]);

  const scrollToUpsell = () => {
    document.getElementById("upsell")?.scrollIntoView({ behavior: "smooth" });
  };

  if (!isVisible || dismissed || hasPremiumAccess) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 no-print animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      {/* Mobile: full-width bar */}
      <div className="md:hidden p-3 bg-white/95 backdrop-blur-sm border-t shadow-lg">
        <div className="flex items-center gap-2">
          <Button
            onClick={scrollToUpsell}
            className="flex-1 gradient-primary text-white py-5 text-base font-semibold"
            data-testid="mobile-sticky-cta"
          >
            Get Your Full Playbook — $19
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <button
            onClick={() => setDismissed(true)}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Desktop: right-aligned pill */}
      <div className="hidden md:flex justify-end p-4">
        <div className="flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-full shadow-lg border px-2 py-1.5">
          <Button
            onClick={scrollToUpsell}
            className="gradient-primary text-white rounded-full px-6 py-2 text-sm font-semibold"
            data-testid="desktop-sticky-cta"
          >
            Get Your Full Playbook — $19
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <button
            onClick={() => setDismissed(true)}
            className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
