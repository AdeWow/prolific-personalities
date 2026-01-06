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
import { determineArchetypeEnhanced } from "@/lib/quiz-logic";
import { useToast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/analytics";
import { trackResultsView, trackPaywallView, trackPaywallTierClick, trackCheckoutStart } from "@/lib/posthog";
import { Sparkles, Lock, CheckCircle2, ArrowRight, Mail, Download, Share2, Copy, MessageCircle, Info } from "lucide-react";
import { TestimonialsSection } from "@/components/testimonials-section";
import { AICoachChat } from "@/components/ai-coach-chat";
import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";
import type { QuizResult, ToolWithFitScore, QuizScores } from "@shared/schema";

export default function Results() {
  const params = useParams();
  const sessionId = params.sessionId;
  const [shareUrl, setShareUrl] = useState("");
  const [email, setEmail] = useState("");
  const [emailSaved, setEmailSaved] = useState(false);
  const [emailResultsInput, setEmailResultsInput] = useState("");
  const [emailResultsSent, setEmailResultsSent] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const { toast } = useToast();

  // Check for payment status in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const payment = urlParams.get('payment');
    if (payment) {
      setPaymentStatus(payment);
      if (payment === 'success') {
        setShowSuccessModal(true);
        trackEvent('premium_purchase_completed', 'Conversion', 'Payment Success', 27);
      } else if (payment === 'cancelled') {
        toast({
          title: "Payment Cancelled",
          description: "Your payment was not completed. You can try again anytime.",
          variant: "destructive",
        });
      }
      // Clean URL
      window.history.replaceState({}, '', `/results/${sessionId}`);
    }
  }, [sessionId, toast]);

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
  
  const enhancedResult = result?.scores && 
    typeof result.scores === 'object' && 
    'structure' in result.scores &&
    'motivation' in result.scores &&
    'cognitive' in result.scores &&
    'task' in result.scores
      ? determineArchetypeEnhanced(result.scores as QuizScores) 
      : null;
  
  // Track result page view
  useEffect(() => {
    if (archetype) {
      trackEvent('result_viewed', 'Results', archetype.name);
      trackResultsView(archetype.id, false);
    }
  }, [archetype]);
  
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

  // Note: We don't need to poll for order status since the webhook handles everything
  // The success modal shows immediately after payment redirect

  const emailCaptureMutation = useMutation({
    mutationFn: async (emailData: { email: string; sessionId: string; archetype?: string }) => {
      const response = await apiRequest('POST', '/api/email-capture', emailData);
      return response.json();
    },
    onSuccess: () => {
      setEmailSaved(true);
      localStorage.setItem('emailCaptured', 'true');
      trackEvent('email_captured', 'Conversion', archetype?.name || 'Unknown');
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

  const emailResultsMutation = useMutation({
    mutationFn: async (emailData: { email: string; sessionId: string }) => {
      const response = await apiRequest('POST', '/api/email-results', emailData);
      return response.json();
    },
    onSuccess: () => {
      setEmailResultsSent(true);
      setEmailSaved(true); // Also mark as saved since email was sent
      localStorage.setItem('emailCaptured', 'true');
      trackEvent('email_results_sent', 'Engagement', archetype?.name || 'Unknown');
      toast({
        title: "Results sent!",
        description: "Check your inbox for your complete assessment results.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send email. Please try again.",
        variant: "destructive",
      });
    },
  });

  const checkoutMutation = useMutation({
    mutationFn: async (data: { archetype: string; sessionId: string }) => {
      const response = await apiRequest('POST', '/api/create-checkout-session', data);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.url) {
        trackEvent('premium_purchase_initiated', 'Conversion', archetype?.name || 'Unknown', 27);
        window.location.href = data.url;
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to start checkout. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleUpgradeToPremium = () => {
    if (sessionId && archetype) {
      trackPaywallTierClick('playbook', archetype.id, 19);
      trackCheckoutStart('complete_playbook', archetype.id, 19);
      checkoutMutation.mutate({ archetype: archetype.id, sessionId });
    }
  };

  useEffect(() => {
    if (sessionId) {
      setShareUrl(`${window.location.origin}/results/${sessionId}`);
    }
  }, [sessionId]);

  // Transform database scores to match FourAxisVisual component expectations
  const scores = result?.scores as any;
  const transformedScores = scores ? {
    structureOrientation: scores.structure ?? 50,
    motivationStyle: scores.motivation ?? 50,
    cognitiveFocus: scores.cognitive ?? 50,
    taskRelationship: scores.task ?? 50,
  } : {
    structureOrientation: 50,
    motivationStyle: 50,
    cognitiveFocus: 50,
    taskRelationship: 50,
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    trackEvent('share_link_copied', 'Social', archetype?.name || 'Unknown');
    toast({
      title: "Link copied!",
      description: "Share link has been copied to your clipboard.",
    });
  };

  const handleShareTwitter = () => {
    const text = `I just discovered I'm ${archetype?.name}! 🎯 Take the Prolific Personalities assessment to find your productivity archetype.`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
    trackEvent('share_twitter', 'Social', archetype?.name || 'Unknown');
    window.open(url, '_blank', 'width=550,height=420');
  };

  const handleShareFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    trackEvent('share_facebook', 'Social', archetype?.name || 'Unknown');
    window.open(url, '_blank', 'width=550,height=420');
  };

  const handleShareLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    trackEvent('share_linkedin', 'Social', archetype?.name || 'Unknown');
    window.open(url, '_blank', 'width=550,height=420');
  };

  const handleShareWhatsApp = () => {
    const text = `I just discovered I'm ${archetype?.name}! Take the Prolific Personalities assessment: ${shareUrl}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    trackEvent('share_whatsapp', 'Social', archetype?.name || 'Unknown');
    window.open(url, '_blank');
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && sessionId) {
      // Use emailResultsMutation to actually send the email (not just capture)
      emailResultsMutation.mutate({ email, sessionId });
      // Also store to localStorage so exit-intent popup knows email was captured
      localStorage.setItem('emailCaptured', 'true');
    }
  };

  const handleEmailResults = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailResultsInput && sessionId) {
      emailResultsMutation.mutate({ email: emailResultsInput, sessionId });
    }
  };

  const handlePDFExport = () => {
    trackEvent('pdf_exported', 'Engagement', archetype?.name || 'Unknown');
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
        <AICoachChat />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-indigo-50">
      {/* Print-only Header */}
      <div className="hidden print-only bg-white border-b-2 border-neutral-800 pb-4 mb-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-neutral-800">Prolific Personalities</h1>
          <p className="text-lg text-neutral-600 mt-2">Productivity Assessment Report</p>
          <p className="text-sm text-neutral-500 mt-2">
            Generated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <p className="text-xs text-neutral-400 mt-1">
            Report ID: {sessionId}
          </p>
        </div>
      </div>

      {/* Payment Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl">Payment Successful! 🎉</DialogTitle>
            <DialogDescription className="text-center text-base">
              Your premium productivity playbook has been purchased successfully.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 bg-neutral-50 rounded-lg p-6 text-left">
            <h3 className="font-bold text-neutral-800 text-lg">What's Next?</h3>
            <ul className="space-y-3 text-neutral-700">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Your payment has been processed successfully</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>You'll receive your 100+ page premium playbook via email within 10 minutes</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Check your inbox (and spam/promotions folder) for an email from support@prolificpersonalities.com</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>The email includes your playbook PDF with implementation guides, tool setup, and a 30-day action plan</span>
              </li>
            </ul>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={() => setShowSuccessModal(false)}
              className="flex-1 gradient-primary text-white"
              data-testid="button-close-success"
            >
              Got it!
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
            <div className="flex gap-3 no-print">
              <Button onClick={handlePDFExport} variant="outline" size="sm" data-testid="button-export-pdf">
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" data-testid="button-email-results">
                    <Mail className="w-4 h-4 mr-2" />
                    Email Results
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Email Your Results</DialogTitle>
                    <DialogDescription>
                      Get your complete assessment results sent to your inbox, including your archetype breakdown and personalized insights.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleEmailResults} className="space-y-4">
                    <div className="space-y-2">
                      <Input
                        type="email"
                        placeholder="your.email@example.com"
                        value={emailResultsInput}
                        onChange={(e) => setEmailResultsInput(e.target.value)}
                        required
                        disabled={emailResultsSent || emailResultsMutation.isPending}
                        data-testid="input-email-results"
                        className="w-full"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full gradient-primary text-white"
                      disabled={emailResultsSent || emailResultsMutation.isPending}
                      data-testid="button-send-email"
                    >
                      {emailResultsMutation.isPending ? (
                        <>
                          <Mail className="w-4 h-4 mr-2 animate-pulse" />
                          Sending...
                        </>
                      ) : emailResultsSent ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Sent!
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4 mr-2" />
                          Send Results
                        </>
                      )}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" data-testid="button-share">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Results
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={handleCopyLink} data-testid="share-copy-link">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Link
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleShareTwitter} data-testid="share-twitter">
                    <FaTwitter className="w-4 h-4 mr-2" />
                    Share on Twitter
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleShareFacebook} data-testid="share-facebook">
                    <FaFacebook className="w-4 h-4 mr-2" />
                    Share on Facebook
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleShareLinkedIn} data-testid="share-linkedin">
                    <FaLinkedin className="w-4 h-4 mr-2" />
                    Share on LinkedIn
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleShareWhatsApp} data-testid="share-whatsapp">
                    <FaWhatsapp className="w-4 h-4 mr-2" />
                    Share on WhatsApp
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
                  
                  {/* Confidence Badge */}
                  {enhancedResult && (
                    <div className="flex items-center justify-center gap-2 mt-4">
                      <Badge 
                        className={`px-4 py-2 text-sm font-semibold ${
                          enhancedResult.confidenceLevel === 'exact' 
                            ? 'bg-green-100 text-green-700 border-green-300' 
                            : enhancedResult.confidenceLevel === 'strong'
                            ? 'bg-blue-100 text-blue-700 border-blue-300'
                            : enhancedResult.confidenceLevel === 'moderate'
                            ? 'bg-yellow-100 text-yellow-700 border-yellow-300'
                            : 'bg-purple-100 text-purple-700 border-purple-300'
                        }`}
                        data-testid="confidence-badge"
                      >
                        {enhancedResult.confidence}% Match Confidence
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Profile Notes */}
                {enhancedResult && enhancedResult.notes.length > 0 && (
                  <Card className="bg-indigo-50 border-indigo-200 text-left max-w-2xl mx-auto" data-testid="profile-notes">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <div className="space-y-2">
                          <h4 className="font-semibold text-neutral-800">Your Unique Profile</h4>
                          {enhancedResult.notes.map((note, idx) => (
                            <p key={idx} className="text-sm text-neutral-700">{note}</p>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Secondary Archetypes */}
                {enhancedResult && enhancedResult.secondary && enhancedResult.secondary.length > 0 && (
                  <Card className="bg-purple-50 border-purple-200 text-left max-w-2xl mx-auto" data-testid="secondary-archetypes">
                    <CardContent className="p-6">
                      <h4 className="font-semibold text-neutral-800 mb-3">You also share traits with:</h4>
                      <div className="flex flex-wrap gap-3">
                        {enhancedResult.secondary.map((secondaryArchetype) => (
                          <Link key={secondaryArchetype.id} href={`/archetypes#${secondaryArchetype.id}`}>
                            <Badge 
                              className="px-3 py-2 bg-white border-purple-300 text-purple-700 hover:bg-purple-100 cursor-pointer transition-colors"
                              data-testid={`secondary-archetype-${secondaryArchetype.id}`}
                            >
                              {secondaryArchetype.icon} {secondaryArchetype.name}
                            </Badge>
                          </Link>
                        ))}
                      </div>
                      <p className="text-sm text-neutral-600 mt-3">
                        Your balanced profile means you can adapt your working style based on the situation.
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Archetype Breakdown */}
                {enhancedResult && enhancedResult.allFitScores && enhancedResult.allFitScores.length > 0 && (
                  <Card className="bg-neutral-50 border-neutral-200 text-left max-w-3xl mx-auto" data-testid="archetype-breakdown">
                    <CardContent className="p-6">
                      <h4 className="font-semibold text-neutral-800 mb-4">Archetype Fit Breakdown</h4>
                      <div className="space-y-3">
                        {enhancedResult.allFitScores.map((fitScore, index) => (
                          <div key={fitScore.archetype.id} className="space-y-1">
                            <div className="flex justify-between items-center text-sm">
                              <span className={`font-medium ${index === 0 ? 'text-neutral-900' : 'text-neutral-700'}`}>
                                {index + 1}. {fitScore.archetype.name}
                              </span>
                              <span className={`font-bold ${index === 0 ? 'text-indigo-600' : 'text-neutral-600'}`}>
                                {fitScore.fitPercentage}%
                              </span>
                            </div>
                            <div className="relative h-2 bg-neutral-200 rounded-full overflow-hidden">
                              <div 
                                className={`absolute top-0 left-0 h-full ${index === 0 ? 'bg-indigo-600' : 'bg-neutral-400'} transition-all`}
                                style={{ width: `${fitScore.fitPercentage}%` }}
                                data-testid={`fit-bar-${fitScore.archetype.id}`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-neutral-500 mt-4">
                        Fit percentage shows how closely your scores match each archetype's ideal profile.
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* 4-Axis Visualization */}
                <div className="max-w-3xl mx-auto pt-8">
                  <FourAxisVisual scores={transformedScores} />
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
                <button 
                  onClick={handleUpgradeToPremium}
                  disabled={checkoutMutation.isPending}
                  className="flex items-center text-indigo-600 font-semibold hover:text-indigo-700 transition-colors cursor-pointer disabled:opacity-50"
                  data-testid="link-unlock-framework"
                >
                  <Lock className="w-5 h-5 mr-2" />
                  {checkoutMutation.isPending ? 'Processing...' : 'Unlock full implementation guide, common pitfalls, and tools →'}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Email Capture Section - Enhanced with Lead Magnet */}
      <section className="py-12 bg-gradient-to-br from-neutral-50 to-indigo-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-white shadow-xl border-2 border-indigo-100" data-testid="email-capture-card">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 mb-4">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-800 mb-2">
                  Get Your Free {archetype?.name || 'Productivity'} Quick-Start Guide
                </h3>
                <p className="text-neutral-600 mb-4">
                  Receive your complete results plus a personalized mini-guide with your top 3 strategies
                </p>
                
                {/* Value Props */}
                <div className="bg-indigo-50 rounded-lg p-4 text-left mb-6">
                  <p className="text-sm font-semibold text-indigo-800 mb-2">You'll receive:</p>
                  <ul className="space-y-2 text-sm text-indigo-700">
                    <li className="flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-2 text-indigo-600 flex-shrink-0" />
                      Your complete assessment results (PDF)
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-2 text-indigo-600 flex-shrink-0" />
                      3 quick wins tailored to {archetype?.name || 'your archetype'}s
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-2 text-indigo-600 flex-shrink-0" />
                      Weekly productivity tips for your archetype
                    </li>
                  </ul>
                </div>
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
                      className="w-full text-base py-5"
                      data-testid="input-email"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg py-6 hover:shadow-lg transition-all"
                    disabled={emailResultsMutation.isPending || emailSaved}
                    data-testid="button-submit-email"
                  >
                    {emailResultsMutation.isPending ? "Sending..." : "Get My Free Guide"}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <p className="text-xs text-neutral-500 text-center">
                    Free forever. Unsubscribe anytime. We respect your privacy.
                  </p>
                </form>
              ) : (
                <div className="text-center py-4" data-testid="email-success-message">
                  <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-600" />
                  <p className="text-lg font-semibold text-green-700">Your guide is on the way!</p>
                  <p className="text-neutral-600 mt-2">Check your inbox for your complete results and quick-start guide.</p>
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

      {/* Print-Only Detailed Analysis Section */}
      <div className="hidden print-only py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-neutral-800 mb-6 border-b-2 border-neutral-300 pb-2">
            Detailed Score Analysis
          </h2>
          
          <div className="space-y-6">
            {/* Structure Orientation */}
            <div className="border border-neutral-300 p-4">
              <h3 className="text-lg font-bold text-neutral-800 mb-2">Structure Orientation</h3>
              <p className="text-sm text-neutral-600 mb-2">
                Score: {scores?.structureOrientation}/100
              </p>
              <p className="text-sm text-neutral-700">
                This dimension measures your preference for structured routines versus spontaneous flexibility. 
                A higher score indicates a strong preference for planning and organization, while a lower score 
                suggests comfort with improvisation and adaptability.
              </p>
            </div>

            {/* Motivation Style */}
            <div className="border border-neutral-300 p-4">
              <h3 className="text-lg font-bold text-neutral-800 mb-2">Motivation Style</h3>
              <p className="text-sm text-neutral-600 mb-2">
                Score: {scores?.motivationStyle}/100
              </p>
              <p className="text-sm text-neutral-700">
                This dimension assesses your primary sources of motivation. Higher scores indicate responsiveness 
                to external accountability and deadlines, while lower scores reflect stronger intrinsic motivation 
                and self-direction.
              </p>
            </div>

            {/* Cognitive Focus */}
            <div className="border border-neutral-300 p-4">
              <h3 className="text-lg font-bold text-neutral-800 mb-2">Cognitive Focus</h3>
              <p className="text-sm text-neutral-600 mb-2">
                Score: {scores?.cognitiveFocus}/100
              </p>
              <p className="text-sm text-neutral-700">
                This dimension evaluates your attention patterns and working memory preferences. Higher scores 
                suggest a preference for deep focus on single tasks, while lower scores indicate comfort with 
                multitasking and task-switching.
              </p>
            </div>

            {/* Task Relationship */}
            <div className="border border-neutral-300 p-4">
              <h3 className="text-lg font-bold text-neutral-800 mb-2">Task Relationship</h3>
              <p className="text-sm text-neutral-600 mb-2">
                Score: {scores?.taskRelationship}/100
              </p>
              <p className="text-sm text-neutral-700">
                This dimension captures how you initiate and engage with tasks. Higher scores reflect ease 
                in starting tasks and maintaining momentum, while lower scores indicate patterns of procrastination 
                or delayed initiation that may stem from anxiety or perfectionism.
              </p>
            </div>
          </div>

          <div className="mt-8 border-t-2 border-neutral-300 pt-6">
            <h3 className="text-lg font-bold text-neutral-800 mb-4">About This Assessment</h3>
            <p className="text-sm text-neutral-700 mb-4">
              This assessment is grounded in established psychological research, including Executive Function Theory 
              (Barkley), Cognitive Load Theory (Sweller), Self-Determination Theory (Deci & Ryan), procrastination 
              research (Pychyl, Ferrari), and Flow theory (Csikszentmihalyi).
            </p>
            <p className="text-sm text-neutral-700">
              Your archetype represents a unique combination of these four dimensions. Understanding your productivity 
              profile can help you choose strategies, tools, and environments that align with your natural working style 
              rather than fighting against it.
            </p>
          </div>
        </div>
      </div>

      {/* Social Proof - Compact Testimonials */}
      <TestimonialsSection variant="compact" showTitle={true} maxItems={3} />

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
                {/* Recent Activity Badge */}
                <div className="flex items-center justify-center gap-2 mb-4 text-sm text-neutral-600">
                  <span className="inline-flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span>12 people purchased in the last 24 hours</span>
                </div>

                <Button 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg py-6 hover:shadow-xl transition-all"
                  data-testid="button-get-premium"
                  onClick={handleUpgradeToPremium}
                  disabled={checkoutMutation.isPending}
                >
                  {checkoutMutation.isPending ? 'Processing...' : 'Get My Full Report - $27'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <p className="text-center text-neutral-500 text-sm mt-4">
                  One-time payment • Instant download • 100+ page personalized playbook
                </p>
                <p className="text-center text-neutral-400 text-xs mt-2">
                  30-day satisfaction guarantee.{" "}
                  <Link href="/refund-policy" className="text-indigo-600 hover:underline" data-testid="link-refund-policy">
                    View refund policy
                  </Link>
                </p>

                {/* Trust Badges */}
                <div className="mt-6 pt-4 border-t border-neutral-100">
                  <div className="flex flex-wrap justify-center items-center gap-4 text-xs text-neutral-500">
                    <div className="flex items-center gap-1">
                      <span className="text-lg">🔒</span>
                      <span>Secure Checkout</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-lg">💳</span>
                      <span>Powered by Stripe</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-lg">✨</span>
                      <span>Instant Access</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Retake Section */}
      <section className="py-12 no-print">
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

      {/* Print-Only Footer */}
      <div className="hidden print-only mt-12 pt-8 border-t-2 border-neutral-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-neutral-800 mb-2">Next Steps</h3>
              <ul className="list-disc list-inside text-sm text-neutral-700 space-y-1">
                <li>Start with one Quick Win from this report and implement it this week</li>
                <li>Share your archetype with your team to improve collaboration</li>
                <li>Revisit this assessment every 3-6 months to track your productivity evolution</li>
                <li>Visit prolificpersonalities.com to access additional resources and tools</li>
              </ul>
            </div>
            
            <div className="pt-4 border-t border-neutral-300">
              <p className="text-xs text-neutral-500 text-center">
                © {new Date().getFullYear()} Prolific Personalities. All rights reserved. | 
                This report is for personal use only. | 
                For questions or support, visit our website.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Coach Chat Widget */}
      <AICoachChat 
        archetype={archetype?.id}
        archetypeName={archetype?.name}
        scores={result?.scores as QuizScores | undefined}
      />
    </div>
  );
}
