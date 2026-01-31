import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FourAxisVisual } from "@/components/four-axis-visual";
import { archetypes } from "@/data/archetypes";
import { determineArchetypeEnhanced } from "@/lib/quiz-logic";
import { useToast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/analytics";
import { trackResultsView, trackPaywallView, trackPaywallTierClick, trackCheckoutStart } from "@/lib/posthog";
import { CheckCircle2, Mail, Download, Share2, Copy, Smartphone } from "lucide-react";
import { TestimonialsSection } from "@/components/testimonials-section";
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
import logoImage from "@assets/Logo5Nobackground_1762407438507.png";

import {
  ResultsHero,
  ShowsUpSection,
  FastestWinCard,
  UpsellSection,
  EmailFallbackSection,
  ToolsAccordion,
  RetakeSection,
  MobileStickyCTA,
} from "@/components/results";

export default function Results() {
  const params = useParams();
  const sessionId = params.sessionId;
  const heroRef = useRef<HTMLElement>(null);
  const [shareUrl, setShareUrl] = useState("");
  const [email, setEmail] = useState("");
  const [emailSaved, setEmailSaved] = useState(false);
  const [emailResultsInput, setEmailResultsInput] = useState("");
  const [emailResultsSent, setEmailResultsSent] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [promoCodeValid, setPromoCodeValid] = useState<boolean | null>(null);
  const [promoCodeMessage, setPromoCodeMessage] = useState("");
  const [appWaitlistEmail, setAppWaitlistEmail] = useState("");
  const [appWaitlistJoined, setAppWaitlistJoined] = useState(false);
  const { toast } = useToast();

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
      setEmailSaved(true);
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

  const promoCodeMutation = useMutation({
    mutationFn: async (data: { code: string; archetype: string; sessionId: string; email?: string }) => {
      const response = await apiRequest('POST', '/api/promo-code/redeem', data);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        trackEvent('promo_code_redeemed', 'Conversion', archetype?.name || 'Unknown', data.discountPercent || 100);
        
        if (data.checkoutUrl) {
          toast({
            title: `${data.discountPercent}% discount applied!`,
            description: `Pay only $${data.discountedPrice} (was $${data.originalPrice}). Redirecting to checkout...`,
          });
          setTimeout(() => {
            window.location.href = data.checkoutUrl;
          }, 1500);
        } else if (data.redirectUrl) {
          toast({
            title: "Promo code applied!",
            description: "You now have premium access. Redirecting...",
          });
          setTimeout(() => {
            window.location.href = data.redirectUrl;
          }, 1000);
        }
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to redeem promo code. Please try again.",
        variant: "destructive",
      });
    },
  });

  const appWaitlistMutation = useMutation({
    mutationFn: async (data: { email: string; sessionId: string }) => {
      const response = await apiRequest('POST', '/api/app-waitlist', data);
      return response.json();
    },
    onSuccess: () => {
      setAppWaitlistJoined(true);
      trackEvent('app_waitlist_joined', 'Engagement', archetype?.name || 'Unknown');
      toast({
        title: "You're on the list!",
        description: "We'll email you when the app is ready.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to join waitlist. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAppWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (sessionId && appWaitlistEmail) {
      appWaitlistMutation.mutate({ email: appWaitlistEmail, sessionId });
    }
  };

  const validatePromoCode = async () => {
    if (!promoCode.trim()) {
      setPromoCodeValid(false);
      setPromoCodeMessage("Please enter a promo code");
      return;
    }

    try {
      const response = await apiRequest('POST', '/api/promo-code/validate', { code: promoCode.trim() });
      const data = await response.json();
      setPromoCodeValid(data.valid);
      setPromoCodeMessage(data.message);
    } catch (error) {
      setPromoCodeValid(false);
      setPromoCodeMessage("Invalid promo code");
    }
  };

  const handleApplyPromoCode = (promoEmail?: string) => {
    if (promoCodeValid && sessionId && archetype) {
      promoCodeMutation.mutate({ 
        code: promoCode.trim(), 
        archetype: archetype.id, 
        sessionId,
        email: promoEmail || email || emailResultsInput || undefined
      });
    }
  };

  const handlePromoCodeChange = (value: string) => {
    setPromoCode(value);
    setPromoCodeValid(null);
    setPromoCodeMessage("");
  };

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
    const text = `I just discovered I'm ${archetype?.name}! Take the Prolific Personalities assessment to find your productivity archetype.`;
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
      emailResultsMutation.mutate({ email, sessionId });
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (error || !result || !archetype) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="text-destructive text-4xl">⚠️</div>
            <h1 className="text-2xl font-bold text-foreground">Results Not Found</h1>
            <p className="text-muted-foreground">
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

  const secondaryArchetype = enhancedResult?.secondary && enhancedResult.secondary.length > 0 
    ? enhancedResult.secondary[0] 
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Print-only Header */}
      <div className="hidden print-only bg-white border-b-2 border-foreground pb-4 mb-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">Prolific Personalities</h1>
          <p className="text-lg text-muted-foreground mt-2">Productivity Assessment Report</p>
          <p className="text-sm text-muted-foreground mt-2">
            Generated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
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
            <DialogTitle className="text-center text-2xl">Payment Successful!</DialogTitle>
            <DialogDescription className="text-center text-base">
              Your premium productivity playbook has been purchased successfully.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 bg-background rounded-lg p-6 text-left">
            <h3 className="font-bold text-foreground text-lg">What's Next?</h3>
            <ul className="space-y-3 text-muted-foreground">
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

      <main id="main-content" role="main">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                <img src={logoImage} alt="Prolific Personalities Logo" className="w-10 h-10" />
                <h1 className="text-xl font-bold text-foreground">Prolific Personalities</h1>
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

        {/* A) Results Hero */}
        <section ref={heroRef}>
          <ResultsHero 
            archetype={archetype}
            confidence={enhancedResult?.confidence}
            confidenceLevel={enhancedResult?.confidenceLevel}
            secondaryArchetype={secondaryArchetype}
          />
        </section>

        {/* 4-Axis Visualization (keeping as requested for visual value) */}
        <section className="pb-8 -mt-4">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <FourAxisVisual scores={transformedScores} />
          </div>
        </section>

        {/* Mobile App Waitlist CTA */}
        <section className="pb-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 shadow-lg" data-testid="app-waitlist-card">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center">
                      <Smartphone className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-bold text-foreground mb-2">The app is coming.</h3>
                    <p className="text-muted-foreground">
                      Daily tips. Focus modes. Progress tracking—all personalized to your archetype. Get early access.
                    </p>
                  </div>
                  <div className="flex-shrink-0 w-full md:w-auto">
                    {!appWaitlistJoined ? (
                      <form onSubmit={handleAppWaitlist} className="flex flex-col sm:flex-row gap-2">
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          value={appWaitlistEmail}
                          onChange={(e) => setAppWaitlistEmail(e.target.value)}
                          required
                          disabled={appWaitlistMutation.isPending}
                          className="w-full sm:w-64"
                          data-testid="input-app-waitlist-email"
                        />
                        <Button 
                          type="submit" 
                          className="gradient-primary text-white"
                          disabled={appWaitlistMutation.isPending}
                          data-testid="button-app-waitlist-submit"
                        >
                          {appWaitlistMutation.isPending ? "Joining..." : "Get Early Access"}
                        </Button>
                      </form>
                    ) : (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="font-medium">You're on the list!</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* B) How This Shows Up in Your Work */}
        <ShowsUpSection archetype={archetype} />

        {/* C) Your Fastest Win Today */}
        <FastestWinCard archetype={archetype} />

        {/* D) Paid Upsell Section */}
        <UpsellSection
          archetype={archetype}
          sessionId={sessionId || ''}
          onUpgrade={handleUpgradeToPremium}
          isUpgrading={checkoutMutation.isPending}
          promoCode={promoCode}
          setPromoCode={handlePromoCodeChange}
          promoCodeValid={promoCodeValid}
          promoCodeMessage={promoCodeMessage}
          onValidatePromo={validatePromoCode}
          onApplyPromo={handleApplyPromoCode}
          isApplyingPromo={promoCodeMutation.isPending}
          defaultEmail={email || emailResultsInput}
        />

        {/* E) Testimonials */}
        <TestimonialsSection variant="compact" showTitle={true} maxItems={3} />

        {/* F) Email Capture Fallback */}
        <EmailFallbackSection
          archetype={archetype}
          email={email}
          setEmail={setEmail}
          onSubmit={handleEmailSubmit}
          isSubmitting={emailResultsMutation.isPending}
          emailSaved={emailSaved}
        />

        {/* G) Tool Recommendations (Accordion) */}
        {tools && tools.length > 0 && (
          <ToolsAccordion tools={tools} archetypeName={archetype.name} />
        )}

        {/* H) Retake Assessment */}
        <RetakeSection />

        {/* Print-Only Detailed Analysis Section */}
        <div className="hidden print-only py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground mb-6 border-b-2 border-neutral-300 pb-2">
              Detailed Score Analysis
            </h2>
            
            <div className="space-y-6">
              <div className="border border-neutral-300 p-4">
                <h3 className="text-lg font-bold text-foreground mb-2">Structure Orientation</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Score: {transformedScores.structureOrientation}/100
                </p>
                <p className="text-sm text-muted-foreground">
                  This dimension measures your preference for structured routines versus spontaneous flexibility. 
                  A higher score indicates a strong preference for planning and organization, while a lower score 
                  suggests comfort with improvisation and adaptability.
                </p>
              </div>

              <div className="border border-neutral-300 p-4">
                <h3 className="text-lg font-bold text-foreground mb-2">Motivation Style</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Score: {transformedScores.motivationStyle}/100
                </p>
                <p className="text-sm text-muted-foreground">
                  This dimension assesses your primary sources of motivation. Higher scores indicate responsiveness 
                  to external accountability and deadlines, while lower scores reflect stronger intrinsic motivation 
                  and self-direction.
                </p>
              </div>

              <div className="border border-neutral-300 p-4">
                <h3 className="text-lg font-bold text-foreground mb-2">Cognitive Focus</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Score: {transformedScores.cognitiveFocus}/100
                </p>
                <p className="text-sm text-muted-foreground">
                  This dimension evaluates your attention patterns and working memory preferences. Higher scores 
                  suggest a preference for deep focus on single tasks, while lower scores indicate comfort with 
                  multitasking and task-switching.
                </p>
              </div>

              <div className="border border-neutral-300 p-4">
                <h3 className="text-lg font-bold text-foreground mb-2">Task Relationship</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Score: {transformedScores.taskRelationship}/100
                </p>
                <p className="text-sm text-muted-foreground">
                  This dimension captures how you initiate and engage with tasks. Higher scores reflect ease 
                  in starting tasks and maintaining momentum, while lower scores indicate patterns of procrastination 
                  or delayed initiation that may stem from anxiety or perfectionism.
                </p>
              </div>
            </div>

            <div className="mt-8 border-t-2 border-neutral-300 pt-6">
              <h3 className="text-lg font-bold text-foreground mb-4">About This Assessment</h3>
              <p className="text-sm text-muted-foreground mb-4">
                This assessment is grounded in established psychological research, including Executive Function Theory 
                (Barkley), Cognitive Load Theory (Sweller), Self-Determination Theory (Deci & Ryan), procrastination 
                research (Pychyl, Ferrari), and Flow theory (Csikszentmihalyi).
              </p>
              <p className="text-sm text-muted-foreground">
                Your archetype represents a unique combination of these four dimensions. Understanding your productivity 
                profile can help you choose strategies, tools, and environments that align with your natural working style 
                rather than fighting against it.
              </p>
            </div>
          </div>
        </div>

        {/* Print-Only Footer */}
        <div className="hidden print-only mt-12 pt-8 border-t-2 border-neutral-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">Next Steps</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Start with one Quick Win from this report and implement it this week</li>
                  <li>Share your archetype with your team to improve collaboration</li>
                  <li>Revisit this assessment every 3-6 months to track your productivity evolution</li>
                  <li>Visit prolificpersonalities.com to access additional resources and tools</li>
                </ul>
              </div>
              
              <div className="pt-4 border-t border-neutral-300">
                <p className="text-xs text-muted-foreground text-center">
                  © {new Date().getFullYear()} Prolific Personalities. All rights reserved. | 
                  This report is for personal use only. | 
                  For questions or support, visit our website.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Sticky CTA */}
      <MobileStickyCTA heroRef={heroRef} />
    </div>
  );
}
