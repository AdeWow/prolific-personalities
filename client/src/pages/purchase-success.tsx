import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Mail, BookOpen, Download, ArrowRight } from "lucide-react";

export default function PurchaseSuccess() {
  const [, setLocation] = useLocation();
  const [searchParams] = useState(() => new URLSearchParams(window.location.search));
  const sessionId = searchParams.get('session_id');
  const archetype = searchParams.get('archetype');

  // Set page title
  useEffect(() => {
    document.title = "Purchase Successful - Prolific Personalities";
  }, []);

  // Redirect if missing required parameters
  useEffect(() => {
    if (!sessionId || !archetype) {
      setLocation('/');
    }
  }, [sessionId, archetype, setLocation]);

  // Fetch quiz result to get user info
  const { data: quizResult, isLoading } = useQuery({
    queryKey: [`/api/quiz/results/${sessionId}`],
    enabled: !!sessionId,
  });

  if (!sessionId || !archetype) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  const archetypeName = archetype
    .split('-')
    .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full mb-6">
              <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Payment Successful!
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Welcome to your {archetypeName} Premium Playbook
            </p>
          </div>

          {/* Main Content Cards */}
          <div className="space-y-6">
            {/* Email Confirmation Card */}
            <Card data-testid="card-email-confirmation">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle>Check Your Email</CardTitle>
                    <CardDescription>Your playbook PDF has been sent</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  We've sent a copy of your premium playbook PDF to your email. Check your inbox (and spam folder) 
                  for a message from Prolific Personalities.
                </p>
              </CardContent>
            </Card>

            {/* Interactive Playbook Card */}
            <Card data-testid="card-interactive-playbook" className="border-2 border-indigo-200 dark:border-indigo-800">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                    <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <CardTitle>Access Your Interactive Playbook</CardTitle>
                    <CardDescription>Your personalized web-based playbook with progress tracking</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300">
                  Get started with your interactive playbook featuring:
                </p>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span><strong>Progress Tracking:</strong> Mark chapters as complete and track your journey</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span><strong>30-Day Action Plan:</strong> Interactive daily tasks with streak tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span><strong>Tool Implementation Tracker:</strong> Monitor your productivity tool adoption</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span><strong>Personal Notes:</strong> Add reflections and insights as you learn</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span><strong>PDF Download:</strong> Access your playbook offline anytime</span>
                  </li>
                </ul>
                <Button 
                  size="lg" 
                  className="w-full mt-4"
                  onClick={() => setLocation(`/playbook/${archetype}`)}
                  data-testid="button-access-playbook"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Access Your Playbook Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Download PDF Card */}
            <Card data-testid="card-download-pdf">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <Download className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <CardTitle>Prefer the PDF?</CardTitle>
                    <CardDescription>Download your playbook for offline reading</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  You can also download the PDF version of your playbook from the interactive playbook page.
                </p>
                <Link href={`/playbook/${archetype}`}>
                  <Button variant="outline" className="w-full" data-testid="button-view-download-options">
                    View Download Options
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Footer Actions */}
          <div className="mt-8 text-center space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Need help? Contact us at{' '}
              <a 
                href="mailto:support@prolificpersonalities.com" 
                className="text-indigo-600 dark:text-indigo-400 hover:underline"
                data-testid="link-support-email"
              >
                support@prolificpersonalities.com
              </a>
            </p>
            <div className="flex gap-4 justify-center">
              <Link href={`/results/${sessionId}`}>
                <Button variant="ghost" data-testid="button-back-to-results">
                  Back to Results
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost" data-testid="button-view-dashboard">
                  View Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
  );
}
