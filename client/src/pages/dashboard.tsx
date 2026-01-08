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
import { Clock, TrendingUp, BarChart3, ArrowUpRight, ArrowDownRight, Minus, Download, Lock, BookOpen } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import type { QuizResult, Order } from "@shared/schema";

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

  // Fetch user's orders
  const { data: orders } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
    enabled: isAuthenticated,
  });

  if (authLoading || resultsLoading || isClaimingQuiz) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">
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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <SEOHead
        title="Dashboard - Your Productivity Journey"
        description="View all your productivity assessment results and track your progress over time."
      />
      <Header />
      <main id="main-content" role="main">
        <section className="py-12 lg:py-20" aria-labelledby="dashboard-title">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 id="dashboard-title" className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
              Welcome back{user?.firstName ? `, ${user.firstName}` : ''}! 👋
            </h1>
            <p className="text-lg text-muted-foreground">
              Here's your productivity journey so far
            </p>
          </div>

          {/* Stats */}
          {results && results.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{results.length}</p>
                      <p className="text-sm text-muted-foreground">
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
                      <p className="text-sm text-muted-foreground">Latest Assessment</p>
                      <p className="text-lg font-semibold text-foreground">
                        {formatDistanceToNow(new Date(results[0].completedAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-accent/10 rounded-lg">
                      <span className="text-2xl">🎯</span>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Current Archetype</p>
                      <p className="text-lg font-semibold text-foreground">
                        {archetypes.find(a => a.id === results[0].archetype)?.name || 'Unknown'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Progress Tracking */}
          {results && results.length > 1 && (
            <Card className="mb-8">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-6">
                  <BarChart3 className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold text-foreground">
                    Your Progress Over Time
                  </h2>
                </div>

                <div className="space-y-6">
                  {/* Score Comparison */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      Score Changes (Latest vs First Assessment)
                    </h3>
                    {(() => {
                      const latest = results[0];
                      const first = results[results.length - 1];
                      const latestScores = latest.scores as any;
                      const firstScores = first.scores as any;

                      const dimensions = [
                        { key: 'structureOrientation', label: 'Structure Orientation' },
                        { key: 'motivationStyle', label: 'Motivation Style' },
                        { key: 'cognitiveFocus', label: 'Cognitive Focus' },
                        { key: 'taskRelationship', label: 'Task Relationship' }
                      ];

                      return (
                        <div className="grid md:grid-cols-2 gap-4">
                          {dimensions.map((dim) => {
                            const latestScore = latestScores[dim.key] || 0;
                            const firstScore = firstScores[dim.key] || 0;
                            const change = latestScore - firstScore;
                            const changePercent = firstScore > 0 ? ((change / firstScore) * 100).toFixed(1) : null;

                            return (
                              <div key={dim.key} className="bg-background rounded-lg p-4 border border-muted">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium text-muted-foreground text-sm">{dim.label}</span>
                                  <div className="flex items-center gap-2">
                                    {change > 0 && (
                                      <div className="flex items-center text-green-600 text-sm font-semibold">
                                        <ArrowUpRight className="w-4 h-4" />
                                        +{change}
                                      </div>
                                    )}
                                    {change < 0 && (
                                      <div className="flex items-center text-red-600 text-sm font-semibold">
                                        <ArrowDownRight className="w-4 h-4" />
                                        {change}
                                      </div>
                                    )}
                                    {change === 0 && (
                                      <div className="flex items-center text-muted-foreground text-sm font-semibold">
                                        <Minus className="w-4 h-4" />
                                        No change
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span>First: <strong>{firstScore}</strong></span>
                                  <span>•</span>
                                  <span>Latest: <strong>{latestScore}</strong></span>
                                  {change !== 0 && changePercent !== null && (
                                    <>
                                      <span>•</span>
                                      <span className={change > 0 ? 'text-green-600' : 'text-red-600'}>
                                        {changePercent}%
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Archetype Evolution */}
                  {(() => {
                    const archetypeChanges = results.map((result, index) => ({
                      archetype: archetypes.find(a => a.id === result.archetype)?.name || result.archetype,
                      date: new Date(result.completedAt),
                      isLatest: index === 0
                    }));

                    const uniqueArchetypes = new Set(archetypeChanges.map(c => c.archetype));
                    
                    if (uniqueArchetypes.size > 1) {
                      return (
                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-4">
                            Archetype Evolution
                          </h3>
                          <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-6 border border-primary/20">
                            <p className="text-muted-foreground mb-4">
                              Your productivity archetype has evolved over {results.length} assessments:
                            </p>
                            <div className="flex flex-wrap gap-3">
                              {archetypeChanges.reverse().map((change, index) => (
                                <div key={index} className="flex items-center gap-2">
                                  <Badge variant={change.isLatest ? "default" : "secondary"} className="text-sm">
                                    {change.archetype}
                                  </Badge>
                                  {index < archetypeChanges.length - 1 && (
                                    <span className="text-muted-foreground">→</span>
                                  )}
                                </div>
                              ))}
                            </div>
                            <p className="text-sm text-muted-foreground mt-4">
                              This shows how your working style adapts over time. Explore your latest archetype to understand your current strengths.
                            </p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Premium Downloads */}
          {orders && orders.filter(o => o.status === 'completed').length > 0 && (
            <Card className="mb-8 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-primary rounded-lg">
                    <Download className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Your Premium Reports
                  </h2>
                </div>

                <div className="space-y-3">
                  {orders.filter(o => o.status === 'completed').map((order) => {
                    const archetype = archetypes.find(a => a.id === order.archetype);
                    return (
                      <div key={order.id} className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="text-3xl">{archetype?.icon || '🎯'}</div>
                            <div>
                              <h3 className="font-bold text-foreground">
                                {archetype?.name || order.archetype} Premium Playbook
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                Purchased {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <Link href={`/playbook/${order.archetype}`}>
                              <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white" data-testid={`button-playbook-${order.id}`}>
                                <BookOpen className="w-4 h-4 mr-2" />
                                Open Playbook
                              </Button>
                            </Link>
                            <a href={`/api/download/${order.id}`} download>
                              <Button variant="outline" className="w-full sm:w-auto" data-testid={`button-download-${order.id}`}>
                                <Download className="w-4 h-4 mr-2" />
                                Download PDF
                              </Button>
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results List */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Your Assessment History
            </h2>

            {(!results || results.length === 0) ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground mb-6">
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
                              <h3 className="text-xl font-bold text-foreground mb-1">
                                {archetype?.name || 'Unknown Archetype'}
                              </h3>
                              <p className="text-sm text-muted-foreground mb-2">
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
              <p className="text-muted-foreground mb-4">
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
      </main>
    </div>
  );
}
