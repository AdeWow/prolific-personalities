import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useClaimPendingQuiz } from "@/hooks/useClaimPendingQuiz";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/header";
import { SEOHead } from "@/components/seo-head";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { archetypes } from "@/data/archetypes";
import { Clock, TrendingUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { QuizResult } from "@shared/schema";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const { isClaimingQuiz } = useClaimPendingQuiz();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Please log in",
        description: "You need to log in to view your dashboard",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, authLoading, toast]);

  // Fetch user's quiz results
  const { data: results, isLoading: resultsLoading } = useQuery<QuizResult[]>({
    queryKey: ["/api/dashboard/results"],
    enabled: isAuthenticated,
  });

  if (authLoading || resultsLoading || isClaimingQuiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto" />
          <p className="mt-4 text-neutral-600">
            {isClaimingQuiz ? "Linking your quiz results..." : "Loading your dashboard..."}
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-indigo-50">
      <SEOHead
        title="Dashboard - Your Productivity Journey"
        description="View all your productivity assessment results and track your progress over time."
        canonicalUrl={`${window.location.origin}/dashboard`}
      />
      <Header />

      <section className="py-12 lg:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-2">
              Welcome back{user?.firstName ? `, ${user.firstName}` : ''}! 👋
            </h1>
            <p className="text-lg text-neutral-600">
              Here's your productivity journey so far
            </p>
          </div>

          {/* Stats */}
          {results && results.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-100 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-neutral-900">{results.length}</p>
                      <p className="text-sm text-neutral-600">
                        {results.length === 1 ? 'Assessment Taken' : 'Assessments Taken'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-teal-100 rounded-lg">
                      <Clock className="w-6 h-6 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-600">Latest Assessment</p>
                      <p className="text-lg font-semibold text-neutral-900">
                        {formatDistanceToNow(new Date(results[0].completedAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <span className="text-2xl">🎯</span>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-600">Current Archetype</p>
                      <p className="text-lg font-semibold text-neutral-900">
                        {archetypes.find(a => a.id === results[0].archetype)?.name || 'Unknown'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Results List */}
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">
              Your Assessment History
            </h2>

            {(!results || results.length === 0) ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-neutral-600 mb-6">
                    You haven't taken any assessments yet.
                  </p>
                  <Link href="/quiz">
                    <Button size="lg" data-testid="button-take-quiz">
                      Take Your First Assessment
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {results.map((result) => {
                  const archetype = archetypes.find(a => a.id === result.archetype);
                  
                  return (
                    <Card key={result.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="text-4xl">{archetype?.icon || '🎯'}</div>
                            <div>
                              <h3 className="text-xl font-bold text-neutral-900 mb-1">
                                {archetype?.name || 'Unknown Archetype'}
                              </h3>
                              <p className="text-sm text-neutral-600 mb-2">
                                Completed {formatDistanceToNow(new Date(result.completedAt), { addSuffix: true })}
                              </p>
                              <div className="flex gap-2">
                                <Badge variant="secondary" data-testid={`badge-archetype-${result.id}`}>
                                  {archetype?.id || result.archetype}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div>
                            <Link href={`/results/${result.sessionId}`}>
                              <Button variant="outline" data-testid={`button-view-${result.id}`}>
                                View Results
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* CTA for another assessment */}
          {results && results.length > 0 && (
            <div className="mt-12 text-center">
              <p className="text-neutral-600 mb-4">
                Ready to retake the assessment and see how you've evolved?
              </p>
              <Link href="/quiz">
                <Button size="lg" data-testid="button-retake-quiz">
                  Take Assessment Again
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
