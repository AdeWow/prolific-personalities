import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { trackEvent } from "@/lib/analytics";
import { X, Gift, CheckCircle } from "lucide-react";
import { useLocation } from "wouter";

const PAGES_TO_EXCLUDE = [
  '/playbook',
  '/purchase',
  '/success',
  '/checkout',
  '/dev',
  '/dashboard',
];

const MIN_TIME_ON_PAGE_MS = 45000;
const MIN_SCROLL_DEPTH = 25;

export function ExitIntentPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [email, setEmail] = useState("");
  const [isEligible, setIsEligible] = useState(false);
  const { toast } = useToast();
  const [location] = useLocation();
  
  const timeOnPageRef = useRef(0);
  const maxScrollDepthRef = useRef(0);
  const hasEngagedRef = useRef(false);

  const emailCaptureMutation = useMutation({
    mutationFn: async (emailData: { email: string; sessionId: string }) => {
      const response = await apiRequest('POST', '/api/email-capture', emailData);
      return response.json();
    },
    onSuccess: () => {
      setShowPopup(false);
      setDismissed(true);
      localStorage.setItem('emailCaptured', 'true');
      localStorage.setItem('emailCaptureDate', Date.now().toString());
      trackEvent('email_captured', 'Conversion', 'Exit Intent Popup');
      toast({
        title: "You're all set!",
        description: "Check your inbox for your first productivity insight.",
      });
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "Please try again or contact us if the problem persists.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    const isExcludedPage = PAGES_TO_EXCLUDE.some(page => location.startsWith(page));
    if (isExcludedPage) {
      setIsEligible(false);
      return;
    }

    const hasSeenPopup = sessionStorage.getItem('exitIntentShown');
    const emailAlreadyCaptured = localStorage.getItem('emailCaptured');
    const lastDismissed = localStorage.getItem('exitIntentDismissedAt');
    
    if (lastDismissed) {
      const daysSinceDismissed = (Date.now() - parseInt(lastDismissed)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) {
        setIsEligible(false);
        return;
      }
    }

    if (hasSeenPopup || dismissed || emailAlreadyCaptured) {
      setIsEligible(false);
      return;
    }

    const startTime = Date.now();
    
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const scrollPercent = scrollHeight > 0 ? (currentScroll / scrollHeight) * 100 : 0;
      maxScrollDepthRef.current = Math.max(maxScrollDepthRef.current, scrollPercent);
    };

    const checkEngagement = () => {
      timeOnPageRef.current = Date.now() - startTime;
      
      const hasSpentEnoughTime = timeOnPageRef.current >= MIN_TIME_ON_PAGE_MS;
      const hasScrolledEnough = maxScrollDepthRef.current >= MIN_SCROLL_DEPTH;
      
      if (hasSpentEnoughTime && hasScrolledEnough) {
        hasEngagedRef.current = true;
        setIsEligible(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    const engagementInterval = setInterval(checkEngagement, 5000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(engagementInterval);
    };
  }, [location, dismissed]);

  useEffect(() => {
    if (!isEligible || dismissed || showPopup) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && hasEngagedRef.current) {
        setShowPopup(true);
        sessionStorage.setItem('exitIntentShown', 'true');
        trackEvent('exit_intent_shown', 'Engagement', 'Popup Displayed');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isEligible, dismissed, showPopup]);

  const handleClose = () => {
    setShowPopup(false);
    setDismissed(true);
    localStorage.setItem('exitIntentDismissedAt', Date.now().toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      emailCaptureMutation.mutate({
        email,
        sessionId: `exit-intent-${Date.now()}`,
      });
    } else {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
    }
  };

  if (!showPopup) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300" 
      data-testid="exit-intent-popup"
    >
      <Card className="max-w-md w-full bg-white shadow-2xl border-0 relative animate-in zoom-in-95 duration-300">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-muted-foreground transition-colors z-10"
          aria-label="Close popup"
          data-testid="button-close-popup"
        >
          <X className="w-5 h-5" />
        </button>

        <CardContent className="p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Your Free Productivity Guide
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Join 2,000+ professionals getting weekly strategies matched to their productivity style.
            </p>
          </div>

          <div className="bg-primary/5 rounded-lg p-4 mb-6">
            <p className="text-sm font-medium text-primary mb-2">What you'll get:</p>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-primary/80">
                <CheckCircle className="w-4 h-4 mr-2 text-primary flex-shrink-0" />
                Personalized tips for your archetype
              </li>
              <li className="flex items-center text-sm text-primary/80">
                <CheckCircle className="w-4 h-4 mr-2 text-primary flex-shrink-0" />
                Tool recommendations that actually work
              </li>
              <li className="flex items-center text-sm text-primary/80">
                <CheckCircle className="w-4 h-4 mr-2 text-primary flex-shrink-0" />
                Weekly micro-challenges to build habits
              </li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-base py-5"
              data-testid="input-exit-email"
              required
            />
            <Button
              type="submit"
              className="w-full gradient-primary text-white py-5 text-base font-semibold hover:opacity-90 transition-all"
              disabled={emailCaptureMutation.isPending}
              data-testid="button-exit-submit"
            >
              {emailCaptureMutation.isPending ? "Joining..." : "Get Free Access"}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-4">
            Free forever. Unsubscribe anytime. No spam.
          </p>

          <button
            onClick={handleClose}
            className="w-full mt-3 text-muted-foreground hover:text-muted-foreground text-sm transition-colors"
            data-testid="button-dismiss-popup"
          >
            Maybe later
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
