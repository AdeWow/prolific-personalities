import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/header";
import { SEOHead } from "@/components/seo-head";
import { CheckCircle2, Download, ArrowRight } from "lucide-react";

export default function PaymentSuccess() {
  const [, setLocation] = useLocation();
  const [sessionId, setSessionId] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sid = params.get("session_id");
    if (sid) {
      setSessionId(sid);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-indigo-50">
      <SEOHead
        title="Payment Successful - Prolific Personalities"
        description="Your premium report purchase was successful"
        canonicalUrl={`${window.location.origin}/payment-success`}
      />
      <Header />

      <section className="py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-xl">
            <CardContent className="pt-12 pb-8 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 mb-6">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
                Payment Successful! 🎉
              </h1>

              <p className="text-lg text-neutral-600 mb-8">
                Your premium productivity playbook is ready for download.
              </p>

              <div className="space-y-4 bg-neutral-50 rounded-lg p-6 mb-8 text-left">
                <h2 className="font-bold text-neutral-800 text-lg">What's Next?</h2>
                <ul className="space-y-3 text-neutral-700">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Your premium PDF is processing and will be available in your dashboard within minutes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>You'll receive a confirmation email with download instructions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Access your report anytime from your dashboard</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard">
                  <Button size="lg" className="gradient-primary text-white w-full sm:w-auto" data-testid="button-view-dashboard">
                    <Download className="w-5 h-5 mr-2" />
                    View Dashboard
                  </Button>
                </Link>
                <Link href="/quiz">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto" data-testid="button-take-quiz">
                    Take Another Assessment
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>

              {sessionId && (
                <p className="text-xs text-neutral-400 mt-8">
                  Session ID: {sessionId}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
