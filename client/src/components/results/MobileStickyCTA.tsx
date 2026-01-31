import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface MobileStickyCTAProps {
  heroRef: React.RefObject<HTMLElement | null>;
}

export function MobileStickyCTA({ heroRef }: MobileStickyCTAProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const heroRect = heroRef.current.getBoundingClientRect();
        setIsVisible(heroRect.bottom < 0);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [heroRef]);

  const scrollToUpsell = () => {
    document.getElementById("upsell")?.scrollIntoView({ behavior: "smooth" });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/95 backdrop-blur-sm border-t shadow-lg md:hidden no-print">
      <Button 
        onClick={scrollToUpsell}
        className="w-full gradient-primary text-white py-6 text-lg font-semibold"
        data-testid="mobile-sticky-cta"
      >
        Get Full Playbook — $19
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
    </div>
  );
}
