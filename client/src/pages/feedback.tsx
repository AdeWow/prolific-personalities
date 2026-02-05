import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { insertFeedbackSchema } from "@shared/schema";
import { z } from "zod";
import { Loader2, CheckCircle2 } from "lucide-react";

const feedbackFormSchema = insertFeedbackSchema.omit({ sessionId: true }).extend({
  name: z.string().optional().or(z.literal("")),
  email: z.string().email("Please enter a valid email address").optional().or(z.literal("")),
  message: z.string().min(10, "Please provide at least 10 characters of feedback"),
});

type FeedbackFormData = z.infer<typeof feedbackFormSchema>;

export default function Feedback() {
  const { toast } = useToast();

  const feedbackForm = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
      type: "feedback",
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
        description: "We read every submission and truly appreciate your input.",
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

  const handleFeedbackSubmit = (data: FeedbackFormData) => {
    feedbackMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted dark:from-card dark:to-background">
      <SEOHead
        title="Send Feedback | Prolific Personalities"
        description="Share your thoughts, suggestions, or feature requests. We read everything."
        keywords="feedback, contact, suggestions, feature requests"
      />
      <Header />
      <main id="main-content" role="main">
        <section className="py-16" aria-labelledby="feedback-title">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 id="feedback-title" className="text-3xl font-bold text-foreground text-center mb-4">
              Send Feedback
            </h1>
            <p className="text-muted-foreground text-center mb-12 text-lg">
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
        </section>
      </main>
    </div>
  );
}
