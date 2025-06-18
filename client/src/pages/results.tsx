import { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArchetypeCard } from "@/components/archetype-card";
import { archetypes } from "@/data/archetypes";
import { useToast } from "@/hooks/use-toast";
import type { QuizResult } from "@shared/schema";

export default function Results() {
  const params = useParams();
  const sessionId = params.sessionId;
  const [shareUrl, setShareUrl] = useState("");
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

  useEffect(() => {
    if (sessionId) {
      setShareUrl(`${window.location.origin}/results/${sessionId}`);
    }
  }, [sessionId]);

  const archetype = result ? archetypes.find(a => a.id === result.archetype) : null;
  const scores = result?.scores as any;

  const handleShare = (platform: string) => {
    if (!archetype || !shareUrl) return;

    const text = `I just discovered I'm ${archetype.name}! Take the ProductiveMind assessment to find your productivity archetype.`;
    
    let url = '';
    switch (platform) {
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(text)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link copied!",
          description: "Share link has been copied to your clipboard.",
        });
        return;
    }
    
    if (url) {
      window.open(url, '_blank');
    }
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
            <i className="fas fa-exclamation-triangle text-red-500 text-4xl"></i>
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
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                <i className="fas fa-brain text-white text-lg"></i>
              </div>
              <h1 className="text-xl font-bold text-neutral-800">Prolific Personalities</h1>
            </div>
            <Link href="/">
              <Button variant="outline">
                <i className="fas fa-home mr-2"></i>
                Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Results Content */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-100 to-blue-100 text-green-700 font-semibold border-0">
              <i className="fas fa-trophy mr-2"></i>
              Assessment Complete!
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-neutral-800">
              You're <span className="text-gradient">{archetype.name}</span>
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Your productivity archetype reveals unique insights about how you work best and achieve your goals.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Results */}
            <div className="lg:col-span-2 space-y-8">
              <ArchetypeCard archetype={archetype} detailed={true} />

              {/* Dimensional Scores */}
              <Card className="bg-white shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-neutral-800 mb-6">Your Productivity Dimensions</h3>
                  
                  <div className="space-y-6">
                    {Object.entries(scores).map(([dimension, score]) => {
                      const percentage = Math.max(0, Math.min(100, ((score as number) + 40) / 80 * 100));
                      
                      return (
                        <div key={dimension}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-neutral-700 capitalize">
                              {dimension.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <span className="text-sm text-neutral-600">
                              {Math.round(percentage)}%
                            </span>
                          </div>
                          <Progress value={percentage} className="h-3" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Recommended Tools */}
              <Card className="bg-white shadow-lg">
                <CardContent className="p-6">
                  <h4 className="font-bold text-neutral-800 mb-4">
                    <i className="fas fa-tools text-primary mr-2"></i>
                    Recommended Tools
                  </h4>
                  <img 
                    src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=200" 
                    alt="Productivity tools and planning materials" 
                    className="w-full h-32 object-cover rounded-lg mb-4" 
                  />
                  <div className="space-y-3">
                    {archetype.tools.map((tool, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-neutral-700">{tool.name}</span>
                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                          Match: {tool.match}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Share Results */}
              <Card className="bg-gradient-to-br from-neutral-50 to-indigo-50 border border-neutral-200 shadow-lg">
                <CardContent className="p-6">
                  <h4 className="font-bold text-neutral-800 mb-4">Share Your Results</h4>
                  <div className="space-y-3">
                    <Button 
                      onClick={() => handleShare('linkedin')}
                      className="w-full bg-blue-600 text-white hover:bg-blue-700"
                    >
                      <i className="fab fa-linkedin mr-2"></i>
                      Share on LinkedIn
                    </Button>
                    <Button 
                      onClick={() => handleShare('copy')}
                      variant="outline" 
                      className="w-full"
                    >
                      <i className="fas fa-link mr-2"></i>
                      Copy Link
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => window.print()}
                    >
                      <i className="fas fa-download mr-2"></i>
                      Download PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Retake Quiz */}
              <Card className="bg-white shadow-lg">
                <CardContent className="p-6 text-center">
                  <h4 className="font-bold text-neutral-800 mb-2">Want to try again?</h4>
                  <p className="text-neutral-600 text-sm mb-4">
                    Your results are saved, but you can retake the assessment anytime.
                  </p>
                  <Link href="/quiz">
                    <Button className="w-full gradient-primary text-white hover:shadow-lg transition-shadow">
                      Retake Assessment
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
