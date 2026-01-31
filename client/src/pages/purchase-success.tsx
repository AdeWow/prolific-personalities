import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Mail, BookOpen, ArrowRight, RefreshCw, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuthContext } from "@/contexts/AuthContext";

export default function PurchaseSuccess() {
  const [, setLocation] = useLocation();
  const [searchParams] = useState(() => new URLSearchParams(window.location.search));
  const sessionId = searchParams.get('session_id');
  const archetype = searchParams.get('archetype');
  const { toast } = useToast();
  const { session, isLoading: isAuthLoading } = useAuthContext();

  useEffect(() => {
    document.title = "Purchase Successful - Prolific Personalities";
  }, []);

  useEffect(() => {
    if (!sessionId || !archetype) {
      setLocation('/');
    }
  }, [sessionId, archetype, setLocation]);

  const { data: quizResult, isLoading } = useQuery({
    queryKey: [`/api/quiz/results/${sessionId}`],
    enabled: !!sessionId,
  });

  const resendEmailMutation = useMutation({
    mutationFn: async () => {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }
      const res = await fetch(`/api/playbook/${archetype}/resend-email`, {
        method: "POST",
        headers,
        body: JSON.stringify({ sessionId }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || res.statusText);
      }
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Email Sent",
        description: "Your playbook has been resent to your email address.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to resend email. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (!sessionId || !archetype) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted dark:bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  const archetypeName = archetype
    .split('-')
    .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted dark:bg-background">
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        {/* Success Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            You're In!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Your {archetypeName} Playbook is ready
          </p>
        </div>

        {/* Primary CTA Card */}
        <Card data-testid="card-primary-cta" className="border-2 border-primary shadow-lg mb-8">
          <CardContent className="pt-8 pb-8 px-6 text-center">
            <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Start Your Playbook
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Unlock personalized strategies, your 30-day action plan, and track your progress.
            </p>
            <Button 
              size="lg" 
              className="w-full text-lg py-6"
              onClick={() => setLocation(`/playbook/${archetype}?sessionId=${sessionId}`)}
              data-testid="button-access-playbook"
            >
              Access Your Playbook
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Email Confirmation Card - Secondary */}
        <Card data-testid="card-email-confirmation" className="bg-muted/50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-primary" />
              <CardTitle className="text-base">Check Your Email</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              We've also sent a PDF copy to your email. Check your inbox (and spam folder).
            </p>
            {session?.access_token ? (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => resendEmailMutation.mutate()}
                disabled={resendEmailMutation.isPending}
                className="text-primary hover:text-primary/80 p-0 h-auto font-normal"
                data-testid="button-resend-email"
              >
                {resendEmailMutation.isPending ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Didn't receive it? Resend email"
                )}
              </Button>
            ) : (
              <p className="text-xs text-muted-foreground">
                Log in to resend the email if needed.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Footer Links */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Questions?{' '}
            <a 
              href="mailto:support@prolificpersonalities.com" 
              className="text-primary hover:underline"
              data-testid="link-support-email"
            >
              support@prolificpersonalities.com
            </a>
          </p>
          <div className="flex gap-4 justify-center">
            <Link href={`/results/${sessionId}`}>
              <Button variant="ghost" size="sm" data-testid="button-back-to-results">
                Back to Results
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" data-testid="button-view-dashboard">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
