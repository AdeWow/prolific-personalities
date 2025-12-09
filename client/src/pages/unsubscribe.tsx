import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Mail, CheckCircle2 } from "lucide-react";
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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !reason) {
      toast({
        title: "Missing information",
        description: "Please provide your email and reason for unsubscribing.",
        variant: "destructive",
      });
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

  if (isComplete) {
    return (
      <>
        <SEOHead
          title="Unsubscribed | Prolific Personalities"
          description="You have been successfully unsubscribed from Prolific Personalities emails."
        />
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-16">
          <div className="max-w-lg mx-auto px-4">
            <Card className="bg-white shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-neutral-800 mb-4">
                  Successfully Unsubscribed
                </h1>
                <p className="text-neutral-600 mb-6">
                  You will no longer receive emails from Prolific Personalities.
                </p>
                <p className="text-neutral-500 text-sm mb-8">
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
                    }}
                    className="w-full"
                    data-testid="button-resubscribe"
                  >
                    Changed your mind? Resubscribe
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
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
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-16">
        <div className="max-w-lg mx-auto px-4">
          <Card className="bg-white shadow-lg">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-100 mb-4">
                  <Mail className="w-8 h-8 text-neutral-600" />
                </div>
                <h1 className="text-2xl font-bold text-neutral-800 mb-2">
                  Unsubscribe
                </h1>
                <p className="text-neutral-600">
                  We're sorry to see you go. Before you leave, would you mind telling us why?
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {!email && (
                  <div>
                    <Label htmlFor="email" className="text-neutral-700 font-medium">
                      Email Address
                    </Label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full mt-2 px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="your@email.com"
                      required
                      data-testid="input-email"
                    />
                  </div>
                )}

                {email && (
                  <div className="bg-neutral-50 rounded-lg p-4">
                    <p className="text-sm text-neutral-600">
                      Unsubscribing: <strong>{email}</strong>
                    </p>
                  </div>
                )}

                <div>
                  <Label className="text-neutral-700 font-medium mb-3 block">
                    Why are you unsubscribing?
                  </Label>
                  <RadioGroup value={reason} onValueChange={setReason}>
                    <div className="space-y-3">
                      {unsubscribeReasons.map((option) => (
                        <div key={option.value} className="flex items-center space-x-3">
                          <RadioGroupItem
                            value={option.value}
                            id={option.value}
                            data-testid={`radio-reason-${option.value}`}
                          />
                          <Label
                            htmlFor={option.value}
                            className="text-neutral-700 cursor-pointer"
                          >
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>

                  {reason === "other" && (
                    <Textarea
                      value={reasonOther}
                      onChange={(e) => setReasonOther(e.target.value)}
                      placeholder="Please tell us more..."
                      className="mt-3"
                      data-testid="input-reason-other"
                    />
                  )}
                </div>

                <div>
                  <Label className="text-neutral-700 font-medium mb-3 block">
                    How would you rate the emails you received? (Optional)
                  </Label>
                  <RadioGroup value={rating} onValueChange={setRating}>
                    <div className="space-y-3">
                      {ratingOptions.map((option) => (
                        <div key={option.value} className="flex items-center space-x-3">
                          <RadioGroupItem
                            value={option.value}
                            id={option.value}
                            data-testid={`radio-rating-${option.value}`}
                          />
                          <Label
                            htmlFor={option.value}
                            className="text-neutral-700 cursor-pointer"
                          >
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="feedback" className="text-neutral-700 font-medium">
                    Is there anything we could have done differently? (Optional)
                  </Label>
                  <Textarea
                    id="feedback"
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Your feedback helps us improve..."
                    className="mt-2"
                    rows={4}
                    data-testid="input-feedback"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-neutral-800 text-white hover:bg-neutral-700"
                  disabled={isSubmitting || !reason}
                  data-testid="button-unsubscribe"
                >
                  {isSubmitting ? "Processing..." : "Unsubscribe"}
                </Button>

                <p className="text-center text-neutral-500 text-sm">
                  Changed your mind?{" "}
                  <button
                    type="button"
                    onClick={() => setLocation("/")}
                    className="text-indigo-600 hover:underline"
                  >
                    Go back to homepage
                  </button>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
