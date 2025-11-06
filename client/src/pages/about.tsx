import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Header } from "@/components/header";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertWaitlistSchema, insertFeedbackSchema } from "@shared/schema";
import { z } from "zod";
import { Gift, Sparkles } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950">
      <Header />

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary/10 to-secondary/10 border-0 text-primary font-semibold">
              <i className="fas fa-info-circle mr-2"></i>
              About Us
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-neutral-800 dark:text-white">
              About <span className="text-gradient">Prolific Personalities</span>
            </h2>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-neutral-800 dark:text-white mb-6">Why We Exist</h3>
              <p className="text-lg text-neutral-700 dark:text-gray-300 leading-relaxed mb-4">
                Prolific Personalities was created to solve a common but frustrating problem: most productivity advice fails because it's generic. It assumes everyone is wired the same way—when in reality, people vary widely in how they think, focus, and stay motivated.
              </p>
              <p className="text-lg text-neutral-700 dark:text-gray-300 leading-relaxed">
                This platform is built on the belief that productivity becomes sustainable only when it's personalized. By understanding your personality, cognitive patterns, and behavioral tendencies, we help you identify what actually works for you.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10 border-primary/20 shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-neutral-800 dark:text-white mb-6">Our Mission</h3>
              <p className="text-lg text-neutral-700 dark:text-gray-300 leading-relaxed mb-4">
                To help people overcome procrastination, distraction, and overwhelm through personalized, research-backed productivity strategies.
              </p>
              <p className="text-lg text-neutral-700 dark:text-gray-300 leading-relaxed">
                We don't just give you tips. We give you a framework that's designed for how your brain works—then connect you to tools and tactics that align with your unique style.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-neutral-800 dark:text-white mb-8">What Makes Us Different</h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-user text-primary"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-neutral-800 dark:text-white mb-2">Personality-first approach</h4>
                      <p className="text-neutral-700 dark:text-gray-300">We assess your patterns through a short but insightful quiz, then map you to one of six productivity archetypes with tailored insights.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-flask text-primary"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-neutral-800 dark:text-white mb-2">Backed by behavioral science</h4>
                      <p className="text-neutral-700 dark:text-gray-300">We draw from executive function theory, cognitive load theory, and motivation science to build recommendations that reflect how people actually work.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-rocket text-primary"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-neutral-800 dark:text-white mb-2">Actionable over aspirational</h4>
                      <p className="text-neutral-700 dark:text-gray-300">Instead of vague advice or unrealistic habits, we provide clear next steps, customized tools, and systems you can actually follow through on.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-heart text-primary"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-neutral-800 dark:text-white mb-2">Designed for real humans</h4>
                      <p className="text-neutral-700 dark:text-gray-300">This platform is especially valuable for people who are neurodivergent, multi-passionate, or simply tired of trying productivity systems that don't stick.</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-neutral-800 dark:text-white mb-6">Who It's For</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  "Creatives who struggle to stay focused and organized",
                  "Professionals who are highly driven but easily overwhelmed", 
                  "People with ADHD or executive dysfunction",
                  "High-achievers battling burnout",
                  "Anyone who wants to get more done in a way that feels natural and sustainable"
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-neutral-50 dark:bg-gray-900 rounded-xl">
                    <i className="fas fa-check-circle text-green-500 mt-1"></i>
                    <span className="text-neutral-700 dark:text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-lg border-l-4 border-l-primary">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-neutral-800 dark:text-white mb-6">The Research Behind It</h3>
              <p className="text-lg text-neutral-700 dark:text-gray-300 leading-relaxed mb-6">
                Prolific Personalities is grounded in behavioral psychology and cognitive science. Our models and quiz system reference:
              </p>
              <div className="space-y-3 mb-6">
                {[
                  "Executive Function theory (e.g., Barkley, Dawson & Guare)",
                  "Cognitive Load Theory",
                  "Self-Determination Theory (Deci & Ryan)",
                  "Productivity research by authors like Cal Newport, Nir Eyal, and James Clear"
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <i className="fas fa-book text-primary"></i>
                    <span className="text-neutral-700 dark:text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <Link href="/science">
                  <Button className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-semibold" data-testid="button-view-research">
                    <i className="fas fa-microscope mr-2"></i>
                    View Full Research & Evidence
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10 border-primary/20 shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-primary/10 dark:bg-primary/20 rounded-xl">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-neutral-800 dark:text-white mb-2">What's Next</h3>
                  <p className="text-lg text-neutral-700 dark:text-gray-300">We're actively building exciting new features:</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-8">
                {[
                  "A personalization engine that adapts to your usage and behavior over time",
                  "A tool recommendation system that evolves with your needs",
                  "AI-powered focus assistants and thought organization tools",
                  "More resources and frameworks to help you follow through on your goals"
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <i className="fas fa-arrow-right text-primary mt-1"></i>
                    <span className="text-neutral-700 dark:text-gray-300">{item}</span>
                  </div>
                ))}
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-primary/30 dark:border-primary/50">
                <div className="flex items-center gap-2 mb-4">
                  <Gift className="h-5 w-5 text-primary" />
                  <h4 className="text-lg font-bold text-neutral-800 dark:text-white">Join the Waitlist - Get Early Access!</h4>
                </div>
                <p className="text-neutral-700 dark:text-gray-300 mb-4">
                  Be the first to try new features before anyone else. Waitlist members get:
                </p>
                <ul className="space-y-2 mb-6 text-neutral-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Early access to all new productivity tools</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Exclusive beta features before public launch</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Special discounts on premium features</span>
                  </li>
                </ul>
                
                <Form {...waitlistForm}>
                  <form onSubmit={waitlistForm.handleSubmit(handleWaitlistSubmit)} className="flex flex-col sm:flex-row gap-3">
                    <FormField
                      control={waitlistForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Enter your email"
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
                      className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-semibold whitespace-nowrap"
                      disabled={waitlistMutation.isPending}
                      data-testid="button-join-waitlist"
                    >
                      {waitlistMutation.isPending ? "Joining..." : "Join Waitlist"}
                    </Button>
                  </form>
                </Form>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-neutral-800 dark:text-white mb-4">Stay Connected & Help Us Improve</h3>
              <p className="text-lg text-neutral-700 dark:text-gray-300 leading-relaxed mb-6">
                Prolific Personalities is actively being developed and improved based on real user feedback. We'd love to hear your thoughts, recommendations, and ideas for new features!
              </p>
              
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 mb-6 border border-blue-200 dark:border-blue-700">
                <p className="text-neutral-800 dark:text-white font-semibold mb-2">Your input directly shapes our roadmap!</p>
                <p className="text-neutral-700 dark:text-gray-300 text-sm">
                  Every piece of feedback helps us build a better productivity platform. Whether it's a bug report, feature suggestion, or just thoughts on what's working, we read and consider everything.
                </p>
              </div>

              <Form {...feedbackForm}>
                <form onSubmit={feedbackForm.handleSubmit(handleFeedbackSubmit)} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={feedbackForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-neutral-700 dark:text-gray-300">Name (optional)</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Your name"
                              {...field}
                              data-testid="input-feedback-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={feedbackForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-neutral-700 dark:text-gray-300">Email (optional)</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="your@email.com"
                              {...field}
                              data-testid="input-feedback-email"
                            />
                          </FormControl>
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
                        <FormLabel className="text-neutral-700 dark:text-gray-300">Type of Feedback</FormLabel>
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={feedbackForm.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-neutral-700 dark:text-gray-300">Your Message *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Share your thoughts, ideas, or suggestions..."
                            rows={5}
                            {...field}
                            data-testid="textarea-feedback-message"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-4">
                    <Link href="/quiz">
                      <Button variant="outline" className="border-2 border-neutral-200 dark:border-gray-600 text-neutral-700 dark:text-gray-300 px-8 py-3 rounded-xl font-semibold hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary transition-colors w-full sm:w-auto" data-testid="button-take-assessment">
                        <i className="fas fa-play mr-2"></i>
                        Take the Assessment
                      </Button>
                    </Link>
                    <Button 
                      type="submit"
                      className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 w-full sm:w-auto"
                      disabled={feedbackMutation.isPending}
                      data-testid="button-submit-feedback"
                    >
                      {feedbackMutation.isPending ? "Sending..." : "Submit Feedback"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
