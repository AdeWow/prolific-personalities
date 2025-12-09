import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/header";
import { SEOHead } from "@/components/seo-head";
import { XCircle, ArrowLeft, HelpCircle } from "lucide-react";

export default function PaymentCancelled() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-indigo-50">
      <SEOHead
        title="Payment Cancelled - Prolific Personalities"
        description="Your payment was cancelled"
      />
      <Header />

      <section className="py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-xl">
            <CardContent className="pt-12 pb-8 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-neutral-400 to-neutral-500 mb-6">
                <XCircle className="w-12 h-12 text-white" />
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
                Payment Cancelled
              </h1>

              <p className="text-lg text-neutral-600 mb-8">
                Your payment was not completed. Don't worry – you haven't been charged.
              </p>

              <div className="space-y-4 bg-neutral-50 rounded-lg p-6 mb-8 text-left">
                <h2 className="font-bold text-neutral-800 text-lg flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" />
                  What happened?
                </h2>
                <p className="text-neutral-700">
                  The payment process was cancelled before completion. This could be because:
                </p>
                <ul className="space-y-2 text-neutral-700 text-sm ml-4">
                  <li>• You clicked the back button</li>
                  <li>• You closed the payment window</li>
                  <li>• You chose not to complete the purchase</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/quiz">
                  <Button size="lg" className="gradient-primary text-white w-full sm:w-auto" data-testid="button-retake-quiz">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Results
                  </Button>
                </Link>
                <Link href="/faq">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto" data-testid="button-help">
                    <HelpCircle className="w-5 h-5 mr-2" />
                    Get Help
                  </Button>
                </Link>
              </div>

              <p className="text-sm text-neutral-500 mt-8">
                Your quiz results are still saved and you can upgrade to premium anytime from your results page.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
