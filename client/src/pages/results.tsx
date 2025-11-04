import { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FourAxisVisual } from "@/components/four-axis-visual";
import { ToolCard } from "@/components/tool-card";
import { archetypes } from "@/data/archetypes";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Lock, CheckCircle2, ArrowRight, Mail, Download } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { QuizResult, ToolWithFitScore } from "@shared/schema";

export default function Results() {
  const params = useParams();
  const sessionId = params.sessionId;
  const [shareUrl, setShareUrl] = useState("");
  const [email, setEmail] = useState("");
  const [emailSaved, setEmailSaved] = useState(false);
  const { toast } = useToast();

  const { data: result, isLoading, error } = useQuery<QuizResult>({
    queryKey: ['/api/quiz/results', sessionId],
    queryFn: async () => {
      const response = await fetch(`/api/quiz/results/${sessionId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch quiz results');
      }
      return response.json();
    },
    enabled: !!sessionId,
  });

  const archetype = result ? archetypes.find(a => a.id === result.archetype) : null;
  
  const { data: tools } = useQuery<ToolWithFitScore[]>({
    queryKey: ['/api/tools/archetype', archetype?.id],
    queryFn: async () => {
      const response = await fetch(`/api/tools/archetype/${archetype?.id}?limit=10`);
      if (!response.ok) {
        throw new Error('Failed to fetch tools');
      }
      return response.json();
    },
    enabled: !!archetype,
  });

  const emailCaptureMutation = useMutation({
    mutationFn: async (emailData: { email: string; sessionId: string }) => {
      const response = await apiRequest('POST', '/api/email-capture', emailData);
      return response.json();
    },
    onSuccess: () => {
      setEmailSaved(true);
      toast({
        title: "Email saved!",
        description: "We'll send your results to your inbox shortly.",
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
    if (sessionId) {
      setShareUrl(`${window.location.origin}/results/${sessionId}`);
    }
  }, [sessionId]);

  const scores = result?.scores as any;

  const handleShare = () => {
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link copied!",
      description: "Share link has been copied to your clipboard.",
    });
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && sessionId) {
      emailCaptureMutation.mutate({ email, sessionId });
    }
  };

  const handlePDFExport = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <p className="text-neutral-600">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (error || !result || !archetype) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-indigo-50 flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="text-red-500 text-4xl">⚠️</div>
            <h1 className="text-2xl font-bold text-neutral-800">Results Not Found</h1>
            <p className="text-neutral-600">
              We couldn't find your quiz results. Please take the assessment again.
            </p>
            <Link href="/quiz">
              <Button className="gradient-primary text-white">
                Take Assessment
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">🧠</span>
              </div>
              <h1 className="text-xl font-bold text-neutral-800">Prolific Personalities</h1>
            </Link>
            <div className="flex gap-3">
              <Button onClick={handlePDFExport} variant="outline" size="sm" data-testid="button-export-pdf">
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
              <Button onClick={handleShare} variant="outline" size="sm">
                Share Results
              </Button>
              <Link href="/">
                <Button variant="outline" size="sm">
                  Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-b from-white to-transparent">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-8">
            <Badge className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 text-green-700 font-semibold border-0">
              <Sparkles className="w-4 h-4 mr-2" />
              Assessment Complete!
            </Badge>
          </div>

          <Card className="bg-white shadow-xl border-0" data-testid="results-hero">
            <CardContent className="p-8 lg:p-12">
              <div className="text-center space-y-6">
                {/* Archetype Icon & Name */}
                <div>
                  <div className="text-7xl mb-4">{archetype.icon}</div>
                  <h1 className="text-4xl lg:text-5xl font-bold text-neutral-800 mb-2" data-testid="archetype-name">
                    {archetype.name}
                  </h1>
                  <p className="text-xl lg:text-2xl text-neutral-600 font-medium" data-testid="archetype-tagline">
                    {archetype.tagline}
                  </p>
                </div>

                {/* 4-Axis Visualization */}
                <div className="max-w-3xl mx-auto pt-8">
                  <FourAxisVisual scores={scores} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Your Productivity Profile */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-800 mb-4">
              Your Productivity Profile
            </h2>
          </div>

          {/* Why You Struggle */}
          <Card className="bg-white shadow-lg" data-testid="struggle-section">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-neutral-800 mb-6 flex items-center">
                <span className="text-3xl mr-3">💡</span>
                Why You Struggle
              </h3>
              <div className="space-y-4 text-neutral-700 leading-relaxed">
                {archetype.struggle.map((paragraph, index) => (
                  <p key={index} className="text-lg">{paragraph}</p>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Your Superpowers */}
          <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 shadow-lg" data-testid="superpowers-section">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-neutral-800 mb-6 flex items-center">
                <span className="text-3xl mr-3">✨</span>
                Your Superpowers
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {archetype.superpowers.map((power, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-neutral-800 mb-1">{power.title}</h4>
                      <p className="text-neutral-700">{power.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top 3 Productivity Blockers */}
          <Card className="bg-white shadow-lg" data-testid="blockers-section">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-neutral-800 mb-6 flex items-center">
                <span className="text-3xl mr-3">🚫</span>
                Top 3 Productivity Blockers
              </h3>
              <div className="space-y-4">
                {archetype.blockers.map((blocker, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-neutral-800">{blocker.title}</h4>
                      <p className="text-neutral-600 text-sm">→ {blocker.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Quick Wins Section - FREE TIER */}
      <section className="py-12 bg-white/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-800 mb-2">
              Your Quick Wins
            </h2>
            <p className="text-lg text-neutral-600">Immediate actions you can take today</p>
          </div>

          {/* Quick Win Cards */}
          <div className="grid md:grid-cols-3 gap-6" data-testid="quick-wins">
            {archetype.quickWins.map((win, index) => (
              <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 text-xl font-bold mb-4">
                    {index + 1}
                  </div>
                  <h4 className="font-bold text-neutral-800 text-lg mb-3">{win.title}</h4>
                  <p className="text-neutral-600 text-sm leading-relaxed">{win.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Framework Preview */}
          <Card className="bg-gradient-to-br from-teal-50 to-blue-50 shadow-lg border-2 border-teal-200" data-testid="framework-preview">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-neutral-800 mb-3">
                Your Top Matched Framework (Preview)
              </h3>
              <div className="bg-white rounded-lg p-6">
                <h4 className="text-2xl font-bold text-neutral-800 mb-2">{archetype.framework.name}</h4>
                <p className="text-neutral-700 mb-4">
                  <strong>Why it works for you:</strong> {archetype.framework.why}
                </p>
                <div className="flex items-center text-indigo-600 font-semibold">
                  <Lock className="w-5 h-5 mr-2" />
                  Unlock full implementation guide, common pitfalls, and tools →
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Email Capture Section */}
      <section className="py-12 bg-gradient-to-br from-neutral-50 to-indigo-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-white shadow-xl" data-testid="email-capture-card">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <Mail className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
                <h3 className="text-2xl font-bold text-neutral-800 mb-2">
                  Get Your Results via Email
                </h3>
                <p className="text-neutral-600">
                  Save your results and receive personalized productivity tips straight to your inbox
                </p>
              </div>

              {!emailSaved ? (
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div>
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full"
                      data-testid="input-email"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg py-6"
                    disabled={emailCaptureMutation.isPending || emailSaved}
                    data-testid="button-submit-email"
                  >
                    {emailCaptureMutation.isPending ? "Sending..." : "Send My Results"}
                    <Mail className="w-5 h-5 ml-2" />
                  </Button>
                </form>
              ) : (
                <div className="text-center py-4" data-testid="email-success-message">
                  <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-600" />
                  <p className="text-lg font-semibold text-green-700">Email sent successfully!</p>
                  <p className="text-neutral-600 mt-2">Check your inbox for your complete results.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Top Productivity Tools Section */}
      {tools && tools.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-neutral-800 mb-4">
                Top Tools for {archetype.name}
              </h2>
              <p className="text-lg text-neutral-600">
                Based on your archetype, these are the productivity tools that match your working style
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="tools-grid">
              {tools.slice(0, 9).map((tool) => (
                <ToolCard key={tool.id} tool={tool} archetypeName={archetype.name} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Premium Preview Section */}
      <section className="py-16 bg-gradient-to-br from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-white shadow-2xl" data-testid="premium-preview">
            <CardContent className="p-8 lg:p-12">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 mb-4">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-neutral-800 mb-3">
                  Unlock Your Complete {archetype.title} Playbook
                </h2>
                <p className="text-lg text-neutral-600">
                  Transform insight into action with your personalized productivity system
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Frameworks */}
                <div>
                  <h4 className="font-bold text-neutral-800 mb-3 flex items-center">
                    <CheckCircle2 className="w-5 h-5 mr-2 text-green-600" />
                    3 Full Framework Guides
                  </h4>
                  <ul className="space-y-2 text-neutral-600 text-sm">
                    {archetype.premiumIncludes.frameworks.map((item, index) => (
                      <li key={index} className="pl-7">• {item}</li>
                    ))}
                  </ul>
                </div>

                {/* Tools */}
                <div>
                  <h4 className="font-bold text-neutral-800 mb-3 flex items-center">
                    <CheckCircle2 className="w-5 h-5 mr-2 text-green-600" />
                    Tool Recommendations
                  </h4>
                  <ul className="space-y-2 text-neutral-600 text-sm">
                    {archetype.premiumIncludes.tools.map((item, index) => (
                      <li key={index} className="pl-7">• {item}</li>
                    ))}
                  </ul>
                </div>

                {/* Implementation Plan */}
                <div>
                  <h4 className="font-bold text-neutral-800 mb-3 flex items-center">
                    <CheckCircle2 className="w-5 h-5 mr-2 text-green-600" />
                    30-Day Implementation Plan
                  </h4>
                  <ul className="space-y-2 text-neutral-600 text-sm">
                    {archetype.premiumIncludes.plan.map((item, index) => (
                      <li key={index} className="pl-7">• {item}</li>
                    ))}
                  </ul>
                </div>

                {/* Special Content */}
                <div>
                  <h4 className="font-bold text-neutral-800 mb-3 flex items-center">
                    <CheckCircle2 className="w-5 h-5 mr-2 text-green-600" />
                    Common Failure Modes
                  </h4>
                  <ul className="space-y-2 text-neutral-600 text-sm">
                    {archetype.premiumIncludes.special.map((item, index) => (
                      <li key={index} className="pl-7">• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-t pt-8">
                <Button 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg py-6 hover:shadow-xl transition-all"
                  data-testid="button-get-premium"
                >
                  Get My Full Report - $27
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <p className="text-center text-neutral-500 text-sm mt-4">
                  One-time payment • Lifetime access • Updated as platform evolves
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Retake Section */}
      <section className="py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-white shadow-lg">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-neutral-800 mb-2">Want to try again?</h3>
              <p className="text-neutral-600 mb-6">
                Your results are saved, but you can retake the assessment anytime to see if your archetype has evolved.
              </p>
              <Link href="/quiz">
                <Button className="gradient-primary text-white px-8 py-6 text-lg hover:shadow-lg transition-shadow">
                  Retake Assessment
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
