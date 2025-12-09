import { Header } from "@/components/header";
import { SEOHead } from "@/components/seo-head";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Mail, Clock, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-indigo-50 dark:from-neutral-900 dark:to-indigo-950">
      <SEOHead
        title="Refund Policy - Prolific Personalities"
        description="Our refund policy for premium playbook purchases. We offer a 30-day satisfaction guarantee on all digital products."
      />
      <Header />

      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/">
            <Button variant="ghost" className="mb-6" data-testid="button-back-home">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-4">
            Refund Policy
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8">
            Last updated: December 2024
          </p>

          <div className="space-y-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                      30-Day Satisfaction Guarantee
                    </h2>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      We stand behind our premium playbooks. If you're not completely satisfied with your purchase, 
                      you can request a full refund within 30 days of your purchase date—no questions asked.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-6">
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                  What's Covered
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-neutral-800 dark:text-neutral-200">Premium Archetype Playbooks ($27)</h3>
                      <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                        Full refund available within 30 days of purchase. This includes both the PDF download and 
                        web-based interactive playbook access.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-6">
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                  How to Request a Refund
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center flex-shrink-0 text-sm font-bold text-indigo-600 dark:text-indigo-400">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-800 dark:text-neutral-200">Send an Email</h3>
                      <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                        Contact us at{" "}
                        <a 
                          href="mailto:support@prolificpersonalities.com?subject=Refund Request" 
                          className="text-indigo-600 hover:underline"
                          data-testid="link-refund-email"
                        >
                          support@prolificpersonalities.com
                        </a>
                        {" "}with the subject line "Refund Request".
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center flex-shrink-0 text-sm font-bold text-indigo-600 dark:text-indigo-400">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-800 dark:text-neutral-200">Include Your Details</h3>
                      <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                        Please include the email address used for purchase and, if available, your order confirmation number or Stripe receipt.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center flex-shrink-0 text-sm font-bold text-indigo-600 dark:text-indigo-400">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-800 dark:text-neutral-200">Receive Your Refund</h3>
                      <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                        We'll process your refund within 3-5 business days. Funds will be returned to your original payment method.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                      Processing Time
                    </h2>
                    <ul className="text-neutral-600 dark:text-neutral-400 space-y-2 text-sm">
                      <li>• Refund requests are reviewed within 1-2 business days</li>
                      <li>• Once approved, refunds are processed within 3-5 business days</li>
                      <li>• Depending on your bank, it may take 5-10 additional business days to appear in your account</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                      Important Notes
                    </h2>
                    <ul className="text-neutral-600 dark:text-neutral-400 space-y-2 text-sm">
                      <li>• Refunds requested after 30 days will be reviewed on a case-by-case basis</li>
                      <li>• Upon refund, access to the interactive web playbook will be revoked</li>
                      <li>• Downloaded PDF files are yours to keep, but continued use is not authorized after refund</li>
                      <li>• Repeated refund requests may result in future purchase restrictions</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-indigo-50 to-teal-50 dark:from-indigo-950 dark:to-teal-950 border-0">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-white dark:bg-neutral-800 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                      Questions?
                    </h2>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                      If you have any questions about our refund policy or need assistance with a purchase, 
                      we're here to help.
                    </p>
                    <a 
                      href="mailto:support@prolificpersonalities.com"
                      className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                      data-testid="link-contact-support"
                    >
                      <Mail className="w-4 h-4" />
                      support@prolificpersonalities.com
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
