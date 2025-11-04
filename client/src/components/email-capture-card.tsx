import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Mail, Sparkles } from "lucide-react";

interface EmailCaptureCardProps {
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
  context?: string; // For tracking where the email was captured
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
  const { toast } = useToast();

  const emailCaptureMutation = useMutation({
    mutationFn: async (emailData: { email: string; sessionId: string }) => {
      const response = await apiRequest('POST', '/api/email-capture', emailData);
      return response.json();
    },
    onSuccess: () => {
      setSubmitted(true);
      setEmail("");
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      emailCaptureMutation.mutate({
        email,
        sessionId: `${context}-${Date.now()}`, // Generate a context-based session ID
      });
    } else {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
    }
  };

  if (submitted) {
    return (
      <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 shadow-lg" data-testid="email-capture-success">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-neutral-800 mb-2">You're in!</h3>
          <p className="text-neutral-600">
            Check your inbox for personalized productivity tips and insights.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-primary/20 shadow-lg hover:shadow-xl transition-all" data-testid="email-capture-card">
      <CardContent className="p-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-neutral-800 mb-2">{title}</h3>
            <p className="text-neutral-600">{description}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <Input
            type="email"
            placeholder={placeholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
            data-testid="input-email-capture"
            required
          />
          <Button
            type="submit"
            className="gradient-primary text-white font-semibold hover:shadow-lg transition-all"
            disabled={emailCaptureMutation.isPending}
            data-testid="button-email-submit"
          >
            {emailCaptureMutation.isPending ? "Saving..." : buttonText}
          </Button>
        </form>

        <p className="text-sm text-neutral-500 mt-4 text-center">
          We respect your privacy. Unsubscribe anytime.
        </p>
      </CardContent>
    </Card>
  );
}
