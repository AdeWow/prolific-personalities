import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { trackEvent } from "@/lib/analytics";
import { Mail, Sparkles, Loader2, CheckCircle } from "lucide-react";

interface EmailCaptureCardProps {
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
  context?: string;
}

export function EmailCaptureCard({
  title = "Want personalized productivity tips?",
  description = "Get free insights and strategies tailored to your working style delivered to your inbox.",
  placeholder = "Enter your email address",
  buttonText = "Get Free Tips",
  context = "general",
}: EmailCaptureCardProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const { toast } = useToast();

  const emailCaptureMutation = useMutation({
    mutationFn: async (emailData: { email: string; sessionId: string }) => {
      const response = await apiRequest('POST', '/api/email-capture', emailData);
      return response.json();
    },
    onSuccess: (data) => {
      setSubmitted(true);
      setEmail("");
      setError(null);
      
      if (data.alreadySubscribed) {
        toast({
          title: "Already subscribed!",
          description: "You're already on our mailing list.",
        });
      } else {
        trackEvent('email_captured', 'Conversion', `Context: ${context}`);
        toast({
          title: "Success!",
          description: "You've been added to our mailing list. Check your inbox soon!",
        });
      }
    },
    onError: () => {
      setError("Something went wrong. Please try again.");
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const validateEmail = (value: string): string | null => {
    if (!value.trim()) {
      return "Email is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return "Please enter a valid email address";
    }
    return null;
  };

  const handleBlur = () => {
    setTouched(true);
    const validationError = validateEmail(email);
    setError(validationError);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (touched) {
      setError(validateEmail(e.target.value));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    const validationError = validateEmail(email);
    
    if (validationError) {
      setError(validationError);
      return;
    }
    
    emailCaptureMutation.mutate({
      email,
      sessionId: `${context}-${Date.now()}`,
    });
  };

  const isValid = !error && email.trim().length > 0;
  const showError = touched && error;

  if (submitted) {
    return (
      <Card className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-2 border-green-200 dark:border-green-700 shadow-lg" data-testid="email-capture-success">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-2">You're in!</h3>
          <p className="text-muted-foreground">
            Check your inbox for personalized productivity tips and insights.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-primary/20 shadow-lg hover:shadow-xl transition-all" data-testid="email-capture-card">
      <CardContent className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
          <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center flex-shrink-0" aria-hidden="true">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">{title}</h3>
            <p className="text-muted-foreground text-sm sm:text-base">{description}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="email-capture-input" className="sr-only">
              Email address
            </Label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 space-y-1">
                <Input
                  id="email-capture-input"
                  type="email"
                  placeholder={placeholder}
                  value={email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={showError ? "true" : "false"}
                  aria-describedby={showError ? "email-capture-error" : "email-capture-hint"}
                  className={showError ? "border-destructive focus-visible:ring-destructive" : ""}
                  data-testid="input-email-capture"
                  disabled={emailCaptureMutation.isPending}
                />
              </div>
              <Button
                type="submit"
                className="gradient-primary text-white font-semibold hover:shadow-lg transition-all w-full sm:w-auto disabled:opacity-50"
                disabled={emailCaptureMutation.isPending}
                data-testid="button-email-submit"
              >
                {emailCaptureMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" aria-hidden="true" />
                    <span>{buttonText}</span>
                  </>
                )}
              </Button>
            </div>
            
            {showError && (
              <p 
                id="email-capture-error" 
                className="text-sm text-destructive" 
                role="alert" 
                aria-live="polite"
              >
                {error}
              </p>
            )}
            
            {!showError && (
              <p id="email-capture-hint" className="text-xs text-muted-foreground">
                We respect your privacy. Unsubscribe anytime.
              </p>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
