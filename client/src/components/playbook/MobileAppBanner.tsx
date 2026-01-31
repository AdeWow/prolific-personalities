import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Smartphone, Bell, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface MobileAppBannerProps {
  onDismiss?: () => void;
  className?: string;
}

export function MobileAppBanner({ onDismiss, className = "" }: MobileAppBannerProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/app-waitlist", { 
        email,
        source: "playbook_banner"
      });
      setIsSubscribed(true);
      toast({
        title: "You're on the list!",
        description: "We'll notify you when the mobile app launches."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Please try again later."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubscribed) {
    return (
      <Card className={`bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-center gap-2 text-primary">
            <Bell className="w-4 h-4" />
            <span className="text-sm font-medium">You'll be the first to know!</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-gradient-to-r from-primary/5 via-background to-accent/5 border-primary/20 relative overflow-hidden ${className}`}>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      )}
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Smartphone className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground mb-1">
              Coming soon: Prolific Personalities mobile app
            </p>
            <p className="text-xs text-muted-foreground mb-3">
              Daily check-ins, streaks, and reminders to build your productivity habits
            </p>
            
            {showForm ? (
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-8 text-sm"
                  required
                />
                <Button 
                  type="submit" 
                  size="sm"
                  disabled={isSubmitting}
                  className="h-8 text-xs whitespace-nowrap"
                >
                  {isSubmitting ? "..." : "Notify me"}
                </Button>
              </form>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowForm(true)}
                className="h-7 text-xs"
              >
                <Bell className="w-3 h-3 mr-1.5" />
                Get notified when it launches
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
