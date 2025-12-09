import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { X, Sparkles } from "lucide-react";

export function ExitIntentPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const emailCaptureMutation = useMutation({
    mutationFn: async (emailData: { email: string; sessionId: string }) => {
      const response = await apiRequest('POST', '/api/email-capture', emailData);
      return response.json();
    },
    onSuccess: () => {
      setShowPopup(false);
      setDismissed(true);
      localStorage.setItem('emailCaptured', 'true');
      toast({
        title: "Success!",
        description: "You've been added to our mailing list. Check your inbox soon!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save email. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    // Check if user has already seen popup in this session OR already captured email
    const hasSeenPopup = sessionStorage.getItem('exitIntentShown');
    const emailAlreadyCaptured = localStorage.getItem('emailCaptured');
    if (hasSeenPopup || dismissed || emailAlreadyCaptured) return;

    const handleMouseLeave = (e: MouseEvent) => {
      // Detect when mouse leaves through top of viewport (about to close tab/navigate away)
      if (e.clientY <= 0 && !dismissed && !showPopup) {
        setShowPopup(true);
        sessionStorage.setItem('exitIntentShown', 'true');
      }
    };

    // Add event listener after a short delay to avoid triggering on page load
    const timeout = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
    }, 3000);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [dismissed, showPopup]);

  const handleClose = () => {
    setShowPopup(false);
    setDismissed(true);
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300" data-testid="exit-intent-popup">
      <Card className="max-w-lg w-full bg-white shadow-2xl border-0 relative animate-in zoom-in duration-300">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 transition-colors"
          data-testid="button-close-popup"
        >
          <X className="w-6 h-6" />
        </button>

        <CardContent className="p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-neutral-800 mb-3">
              Wait! Before you go...
            </h2>
            <p className="text-lg text-neutral-600">
              Get free productivity insights tailored to your working style delivered to your inbox every week.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-lg py-6"
              data-testid="input-exit-email"
              required
            />
            <Button
              type="submit"
              className="w-full gradient-primary text-white py-6 text-lg font-semibold hover:shadow-lg transition-all"
              disabled={emailCaptureMutation.isPending}
              data-testid="button-exit-submit"
            >
              {emailCaptureMutation.isPending ? "Saving..." : "Get Free Insights"}
            </Button>
          </form>

          <p className="text-sm text-neutral-500 text-center mt-4">
            We respect your privacy. Unsubscribe anytime.
          </p>

          <button
            onClick={handleClose}
            className="w-full mt-4 text-neutral-500 hover:text-neutral-700 text-sm transition-colors"
          >
            No thanks, I'll figure it out myself
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
