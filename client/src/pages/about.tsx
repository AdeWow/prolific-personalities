import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormErrorSummary, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Header } from "@/components/header";
import { SEOHead } from "@/components/seo-head";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertWaitlistSchema, insertFeedbackSchema } from "@shared/schema";
import { z } from "zod";
import { Loader2, CheckCircle2 } from "lucide-react";

// Validation schemas
const waitlistFormSchema = insertWaitlistSchema.omit({ sessionId: true }).extend({
  email: z.string().email("Please enter a valid email address"),
});

const feedbackFormSchema = insertFeedbackSchema.omit({ sessionId: true }).extend({
  name: z.string().optional().or(z.literal("")),
  email: z.string().email("Please enter a valid email address").optional().or(z.literal("")),
  message: z.string().min(10, "Please provide at least 10 characters of feedback"),
});

type WaitlistFormData = z.infer<typeof waitlistFormSchema>;
type FeedbackFormData = z.infer<typeof feedbackFormSchema>;

export default function About() {
  const { toast } = useToast();

  // Waitlist form
  const waitlistForm = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistFormSchema),
    defaultValues: {
      email: "",
    },
  });

  // Feedback form
  const feedbackForm = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
      type: "feedback",
    },
  });

  const waitlistMutation = useMutation({
    mutationFn: async (data: WaitlistFormData) => {
      const response = await apiRequest("POST", "/api/waitlist", {
        ...data,
        sessionId: Math.random().toString(36).substring(7),
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "You're on the list!",
        description: "We'll notify you first when new features launch, plus you'll get exclusive early access. 🎉",
      });
      waitlistForm.reset();
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "Please try again later",
        variant: "destructive",
      });
    },
  });

  const feedbackMutation = useMutation({
    mutationFn: async (data: FeedbackFormData) => {
      const response = await apiRequest("POST", "/api/feedback", {
        ...data,
        sessionId: Math.random().toString(36).substring(7),
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Thank you for your feedback!",
        description: "We read every submission and truly appreciate your input. 🙏",
      });
      feedbackForm.reset();
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "Please try again later",
        variant: "destructive",
      });
    },
  });

  const handleWaitlistSubmit = (data: WaitlistFormData) => {
    waitlistMutation.mutate(data);
  };

  const handleFeedbackSubmit = (data: FeedbackFormData) => {
    feedbackMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted dark:from-card dark:to-background">
      <SEOHead
        title="About Us"
        description="Learn about Prolific Personalities - a platform helping people overcome procrastination and overwhelm through personalized, research-backed productivity strategies."
        keywords="about prolific personalities, productivity platform, personalized productivity, research-backed assessment"
      />
      <Header />
      <main id="main-content" role="main">
        <section className="py-16" aria-labelledby="about-title">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 id="about-title" className="text-3xl font-bold text-foreground text-center mb-12">
            About Prolific Personalities
          </h1>
          
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4">Why We Exist</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Most productivity advice fails because it's generic. It assumes everyone is wired the same way—when in reality, people vary widely in how they think, focus, and stay motivated.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Productivity becomes sustainable only when it's personalized. By understanding your patterns and tendencies, we help you identify what actually works for you.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                To help people overcome procrastination, distraction, and overwhelm through personalized, research-backed productivity strategies designed for how your brain works.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16 bg-muted/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

          <div>
            <h2 className="text-xl font-bold text-foreground mb-6">What Makes Us Different</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <span className="text-primary">✓</span>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Personality-first approach</h3>
                  <p className="text-muted-foreground text-sm">Map to one of six productivity archetypes with tailored insights.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary">✓</span>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Backed by behavioral science</h3>
                  <p className="text-muted-foreground text-sm">Built on executive function theory, cognitive load theory, and motivation science.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary">✓</span>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Actionable over aspirational</h3>
                  <p className="text-muted-foreground text-sm">Clear next steps and systems you can actually follow through on.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary">✓</span>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Designed for real humans</h3>
                  <p className="text-muted-foreground text-sm">Especially valuable for neurodivergent, multi-passionate people.</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">Who It's For</h2>
            <ul className="space-y-2">
              {[
                "Creatives who struggle to stay focused and organized",
                "Professionals who are highly driven but easily overwhelmed", 
                "People with ADHD or executive dysfunction",
                "High-achievers battling burnout",
                "Anyone who wants sustainable productivity"
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-primary">✓</span>
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">The Research Behind It</h2>
            <p className="text-muted-foreground mb-4">
              Grounded in behavioral psychology and cognitive science:
            </p>
            <ul className="space-y-2 mb-6">
              {[
                "Executive Function theory (Barkley, Dawson & Guare)",
                "Cognitive Load Theory",
                "Self-Determination Theory (Deci & Ryan)",
                "Productivity research (Newport, Eyal, Clear)"
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-primary">•</span>
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
            <Link href="/science">
              <Button variant="outline" className="text-primary border-primary" data-testid="button-view-research">
                View Research Details
              </Button>
            </Link>
          </div>

          <div className="border-t pt-8">
            <h2 className="text-xl font-bold text-foreground mb-4">Get Early Access</h2>
            <p className="text-muted-foreground mb-6">
              Join the waitlist for new features, beta access, and special discounts.
            </p>
            
            <Form {...waitlistForm}>
              <form 
                onSubmit={waitlistForm.handleSubmit(handleWaitlistSubmit)} 
                className="space-y-4"
                noValidate
              >
                {waitlistMutation.isSuccess ? (
                  <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                    <CheckCircle2 className="h-5 w-5" />
                    <p className="font-medium">You've been added to the waitlist!</p>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <FormField
                      control={waitlistForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="flex-1 w-full">
                          <FormLabel className="sr-only">Email address</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="your@email.com"
                              {...field}
                              data-testid="input-waitlist-email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="gradient-primary text-white w-full sm:w-auto"
                      disabled={waitlistMutation.isPending}
                      data-testid="button-join-waitlist"
                    >
                      {waitlistMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Joining...
                        </>
                      ) : (
                        "Join Waitlist"
                      )}
                    </Button>
                  </div>
                )}
              </form>
            </Form>
          </div>

          <div className="border-t pt-8">
            <h2 className="text-xl font-bold text-foreground mb-4">Send Feedback</h2>
            <p className="text-muted-foreground mb-6">
              Share your thoughts, suggestions, or feature requests. We read everything.
            </p>

              <Form {...feedbackForm}>
                <form 
                  onSubmit={feedbackForm.handleSubmit(handleFeedbackSubmit)} 
                  className="space-y-6"
                  noValidate
                >
                  {feedbackMutation.isSuccess ? (
                    <Card className="bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-800 animate-in fade-in zoom-in duration-300">
                      <CardContent className="p-8 text-center flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-800/30 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>
                        <h4 className="text-xl font-bold text-green-800 dark:text-green-200">Feedback Received!</h4>
                        <p className="text-green-700 dark:text-green-300 max-w-md">
                          Thank you for sharing your thoughts. We read every submission and truly appreciate your input in making Prolific Personalities better.
                        </p>
                        <Button 
                          onClick={() => feedbackMutation.reset()} 
                          variant="outline" 
                          className="mt-2 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30"
                        >
                          Send more feedback
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <>
                      <FormErrorSummary errors={feedbackForm.formState.errors} />
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <FormField
                          control={feedbackForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-muted-foreground dark:text-gray-300">Name (optional)</FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  placeholder="Your name"
                                  {...field}
                                  data-testid="input-feedback-name"
                                />
                              </FormControl>
                              <FormDescription>How should we address you?</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={feedbackForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-muted-foreground dark:text-gray-300">Email (optional)</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="your@email.com"
                                  {...field}
                                  data-testid="input-feedback-email"
                                />
                              </FormControl>
                              <FormDescription>Only if you'd like a response</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={feedbackForm.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-muted-foreground dark:text-gray-300">Type of Feedback</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-feedback-type">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="feedback">General Feedback</SelectItem>
                                <SelectItem value="recommendation">Recommendation</SelectItem>
                                <SelectItem value="feature_request">Feature Request</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>What is this regarding?</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={feedbackForm.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-muted-foreground dark:text-gray-300">Your Message *</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Share your thoughts, ideas, or suggestions..."
                                rows={5}
                                {...field}
                                data-testid="textarea-feedback-message"
                              />
                            </FormControl>
                            <FormDescription>Please provide at least 10 characters</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit"
                        className="gradient-primary text-white w-full sm:w-auto"
                        disabled={feedbackMutation.isPending}
                        data-testid="button-submit-feedback"
                      >
                        {feedbackMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          "Send Feedback"
                        )}
                      </Button>
                    </>
                  )}
                </form>
              </Form>
          </div>
        </div>
        </section>
      </main>
    </div>
  );
}
