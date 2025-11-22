import { useEffect, useState } from "react";
import { useLocation, useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Lock, LogIn, AlertCircle } from "lucide-react";

export default function Playbook() {
  const [, params] = useRoute("/playbook/:archetype");
  const [, setLocation] = useLocation();
  const { user, isLoading: isAuthLoading } = useAuth();
  const archetype = params?.archetype;

  // Set page title
  useEffect(() => {
    if (archetype) {
      const archetypeName = archetype
        .split('-')
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      document.title = `${archetypeName} Playbook - Prolific Personalities`;
    }
  }, [archetype]);

  // Redirect if no archetype
  useEffect(() => {
    if (!archetype) {
      setLocation('/');
    }
  }, [archetype, setLocation]);

  // Check if user has premium access
  const { data: accessData, isLoading: isAccessLoading, isError: isAccessError } = useQuery<{ hasAccess: boolean }>({
    queryKey: [`/api/playbook/${archetype}/access`],
    enabled: !!user && !!archetype,
    retry: 1,
  });

  // Loading state
  if (isAuthLoading || (user && isAccessLoading)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading playbook...</p>
        </div>
      </div>
    );
  }

  // Error checking access
  if (user && isAccessError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full">
                <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Error Loading Playbook
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  We couldn't verify your access to this playbook. Please try again later or contact support if the problem persists.
                </p>
              </div>
              <div className="space-y-3">
                <Button 
                  onClick={() => window.location.reload()}
                  className="w-full"
                  data-testid="button-retry"
                >
                  Try Again
                </Button>
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full" data-testid="button-dashboard">
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full">
                <LogIn className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Login Required
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Please log in to access your premium playbook.
                </p>
              </div>
              <div className="space-y-3">
                <Button 
                  onClick={() => window.location.href = '/api/auth/login'}
                  className="w-full"
                  data-testid="button-login"
                >
                  Log In
                </Button>
                <Link href="/">
                  <Button variant="ghost" className="w-full" data-testid="button-back-home">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No premium access
  if (!accessData?.hasAccess) {
    const archetypeName = archetype!
      .split('-')
      .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full">
                <Lock className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Premium Access Required
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  You don't have access to the {archetypeName} Playbook yet.
                </p>
                <Alert variant="default" className="text-left">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>How to get access</AlertTitle>
                  <AlertDescription>
                    Take the quiz to discover your productivity archetype, then purchase the premium playbook from your results page.
                  </AlertDescription>
                </Alert>
              </div>
              <div className="space-y-3">
                <Link href="/quiz">
                  <Button className="w-full" data-testid="button-take-quiz">
                    Take the Quiz
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full" data-testid="button-dashboard">
                    View Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // User has access - render the actual playbook
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Interactive Playbook
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Coming soon - Under construction
        </p>
        <div className="mt-8">
          <Link href="/dashboard">
            <Button data-testid="button-back-dashboard">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
