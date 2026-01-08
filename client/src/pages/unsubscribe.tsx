import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Mail, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { SEOHead } from "@/components/seo-head";

const unsubscribeReasons = [
  { value: "too_many", label: "I receive too many emails" },
  { value: "not_relevant", label: "The content isn't relevant to me" },
  { value: "already_purchased", label: "I already purchased the playbook" },
  { value: "not_interested", label: "I'm no longer interested in productivity content" },
  { value: "never_signed_up", label: "I never signed up for this" },
  { value: "other", label: "Other" },
];

const ratingOptions = [
  { value: "very_helpful", label: "Very helpful" },
  { value: "somewhat_helpful", label: "Somewhat helpful" },
  { value: "neutral", label: "Neutral" },
  { value: "not_very_helpful", label: "Not very helpful" },
  { value: "not_helpful", label: "Not helpful at all" },
];

export default function Unsubscribe() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [reasonOther, setReasonOther] = useState("");
  const [rating, setRating] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, []);

  const validateEmail = (value: string): string | null => {
    if (!value.trim()) {
      return "Email address is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return "Please enter a valid email address";
    }
    return null;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    const emailError = validateEmail(email);
    if (emailError) {
      newErrors.email = emailError;
    }
    
    if (!reason) {
      newErrors.reason = "Please select a reason for unsubscribing";
    }
    
    if (reason === "other" && !reasonOther.trim()) {
      newErrors.reasonOther = "Please provide more details";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    if (field === "email") {
      const error = validateEmail(email);
      setErrors(prev => error ? { ...prev, email: error } : { ...prev, email: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, reason: true, reasonOther: true });
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/unsubscribe", {
        email,
        reason,
        reasonOther: reason === "other" ? reasonOther : undefined,
        rating: rating || undefined,
        feedbackText: feedbackText || undefined,
      });

      setIsComplete(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to unsubscribe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasErrors = Object.values(errors).some(e => e);

  if (isComplete) {
    return (
      <>
        <SEOHead
          title="Unsubscribed | Prolific Personalities"
          description="You have been successfully unsubscribed from Prolific Personalities emails."
        />
        <div className="min-h-screen bg-gradient-to-b from-background to-muted py-8 sm:py-16">
          <main id="main-content" role="main" className="max-w-lg mx-auto px-4">
            <Card className="bg-white dark:bg-card shadow-lg">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-6" aria-hidden="true">
                  <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
                  Successfully Unsubscribed
                </h1>
                <p className="text-muted-foreground mb-6">
                  You will no longer receive emails from Prolific Personalities.
                </p>
                <p className="text-muted-foreground text-sm mb-8">
                  We appreciate the time you spent with us. Best of luck on your productivity journey.
                </p>
                <div className="space-y-3">
                  <Button
                    onClick={() => setLocation("/")}
                    className="w-full gradient-primary text-white"
                    data-testid="button-go-home"
                  >
                    Return to Homepage
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsComplete(false);
                      setReason("");
                      setRating("");
                      setFeedbackText("");
                      setErrors({});
                      setTouched({});
                    }}
                    className="w-full"
                    data-testid="button-resubscribe"
                  >
                    Changed your mind? Resubscribe
                  </Button>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead
        title="Unsubscribe | Prolific Personalities"
        description="Unsubscribe from Prolific Personalities emails."
      />
      <div className="min-h-screen bg-gradient-to-b from-background to-muted py-8 sm:py-16">
        <main id="main-content" role="main" className="max-w-lg mx-auto px-4">
          <Card className="bg-white dark:bg-card shadow-lg">
            <CardContent className="p-6 sm:p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4" aria-hidden="true">
                  <Mail className="w-8 h-8 text-muted-foreground" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                  Unsubscribe
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                  We're sorry to see you go. Before you leave, would you mind telling us why?
                </p>
              </div>

              {hasErrors && touched.reason && (
                <div 
                  className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 mb-6"
                  role="alert"
                  aria-live="assertive"
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-semibold text-destructive mb-1">
                        Please fix the following:
                      </p>
                      <ul className="list-disc list-inside text-sm text-destructive space-y-1">
                        {Object.entries(errors).filter(([, v]) => v).map(([key, error]) => (
                          <li key={key}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                {!email && (
                  <div className="space-y-2">
                    <Label htmlFor="unsubscribe-email" className="text-foreground font-medium">
                      Email Address <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      type="email"
                      id="unsubscribe-email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (touched.email) {
                          const error = validateEmail(e.target.value);
                          setErrors(prev => error ? { ...prev, email: error } : { ...prev, email: "" });
                        }
                      }}
                      onBlur={() => handleBlur("email")}
                      aria-invalid={touched.email && errors.email ? "true" : "false"}
                      aria-describedby={touched.email && errors.email ? "email-error" : "email-hint"}
                      className={touched.email && errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                      placeholder="your@email.com"
                      data-testid="input-email"
                    />
                    {touched.email && errors.email ? (
                      <p id="email-error" className="text-sm text-destructive" role="alert" aria-live="polite">
                        {errors.email}
                      </p>
                    ) : (
                      <p id="email-hint" className="text-xs text-muted-foreground">
                        Enter the email address you want to unsubscribe
                      </p>
                    )}
                  </div>
                )}

                {email && (
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">
                      Unsubscribing: <strong className="text-foreground">{email}</strong>
                    </p>
                  </div>
                )}

                <fieldset className="space-y-3">
                  <legend className="text-foreground font-medium mb-3 block">
                    Why are you unsubscribing? <span className="text-destructive">*</span>
                  </legend>
                  <RadioGroup 
                    value={reason} 
                    onValueChange={(value) => {
                      setReason(value);
                      setErrors(prev => ({ ...prev, reason: "" }));
                    }}
                    aria-describedby={touched.reason && errors.reason ? "reason-error" : undefined}
                  >
                    <div className="space-y-3">
                      {unsubscribeReasons.map((option) => (
                        <div key={option.value} className="flex items-center space-x-3">
                          <RadioGroupItem
                            value={option.value}
                            id={`reason-${option.value}`}
                            data-testid={`radio-reason-${option.value}`}
                          />
                          <Label
                            htmlFor={`reason-${option.value}`}
                            className="text-muted-foreground cursor-pointer text-sm sm:text-base"
                          >
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>

                  {touched.reason && errors.reason && (
                    <p id="reason-error" className="text-sm text-destructive" role="alert" aria-live="polite">
                      {errors.reason}
                    </p>
                  )}

                  {reason === "other" && (
                    <div className="space-y-2 mt-3">
                      <Label htmlFor="reason-other" className="sr-only">
                        Please tell us more
                      </Label>
                      <Textarea
                        id="reason-other"
                        value={reasonOther}
                        onChange={(e) => {
                          setReasonOther(e.target.value);
                          if (touched.reasonOther) {
                            setErrors(prev => e.target.value.trim() ? { ...prev, reasonOther: "" } : { ...prev, reasonOther: "Please provide more details" });
                          }
                        }}
                        onBlur={() => setTouched(prev => ({ ...prev, reasonOther: true }))}
                        aria-invalid={touched.reasonOther && errors.reasonOther ? "true" : "false"}
                        aria-describedby={touched.reasonOther && errors.reasonOther ? "reason-other-error" : undefined}
                        placeholder="Please tell us more..."
                        className={touched.reasonOther && errors.reasonOther ? "border-destructive focus-visible:ring-destructive" : ""}
                        data-testid="input-reason-other"
                      />
                      {touched.reasonOther && errors.reasonOther && (
                        <p id="reason-other-error" className="text-sm text-destructive" role="alert" aria-live="polite">
                          {errors.reasonOther}
                        </p>
                      )}
                    </div>
                  )}
                </fieldset>

                <fieldset className="space-y-3">
                  <legend className="text-foreground font-medium mb-3 block">
                    How would you rate the emails you received?
                    <span className="text-muted-foreground font-normal ml-1">(Optional)</span>
                  </legend>
                  <RadioGroup value={rating} onValueChange={setRating}>
                    <div className="space-y-3">
                      {ratingOptions.map((option) => (
                        <div key={option.value} className="flex items-center space-x-3">
                          <RadioGroupItem
                            value={option.value}
                            id={`rating-${option.value}`}
                            data-testid={`radio-rating-${option.value}`}
                          />
                          <Label
                            htmlFor={`rating-${option.value}`}
                            className="text-muted-foreground cursor-pointer text-sm sm:text-base"
                          >
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </fieldset>

                <div className="space-y-2">
                  <Label htmlFor="feedback" className="text-foreground font-medium">
                    Is there anything we could have done differently?
                    <span className="text-muted-foreground font-normal ml-1">(Optional)</span>
                  </Label>
                  <Textarea
                    id="feedback"
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Your feedback helps us improve..."
                    rows={4}
                    data-testid="input-feedback"
                  />
                  <p className="text-xs text-muted-foreground">
                    We read all feedback and use it to improve our communications.
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-foreground text-background hover:bg-muted-foreground disabled:opacity-50"
                  disabled={isSubmitting}
                  data-testid="button-unsubscribe"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
                      Processing...
                    </>
                  ) : (
                    "Unsubscribe"
                  )}
                </Button>

                <p className="text-center text-muted-foreground text-sm">
                  Changed your mind?{" "}
                  <button
                    type="button"
                    onClick={() => setLocation("/")}
                    className="text-primary hover:underline focus:outline-none focus:underline"
                  >
                    Go back to homepage
                  </button>
                </p>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
}
