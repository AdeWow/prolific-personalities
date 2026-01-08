import { Header } from "@/components/header";
import { SEOHead } from "@/components/seo-head";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Mail, Clock, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <SEOHead
        title="Refund Policy - Prolific Personalities"
        description="Our refund policy for premium playbook purchases. We offer a 30-day satisfaction guarantee on all digital products."
      />
      <Header />
      <main id="main-content" role="main">
        <section className="py-16" aria-labelledby="refund-title">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/">
            <Button variant="ghost" className="mb-6" data-testid="button-back-home">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          <h1 id="refund-title" className="text-4xl font-bold text-foreground dark:text-white mb-4">
            Refund Policy
          </h1>
          <p className="text-lg text-muted-foreground dark:text-muted-foreground mb-8">
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
                    <h2 className="text-xl font-bold text-foreground dark:text-white mb-2">
                      30-Day Satisfaction Guarantee
                    </h2>
                    <p className="text-muted-foreground dark:text-muted-foreground">
                      We stand behind our premium playbooks. If you're not completely satisfied with your purchase, 
                      you can request a full refund within 30 days of your purchase date—no questions asked.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-6">
                <h2 className="text-xl font-bold text-foreground dark:text-white">
                  What's Covered
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground dark:text-muted-foreground">Premium Archetype Playbooks ($27)</h3>
                      <p className="text-muted-foreground dark:text-muted-foreground text-sm">
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
                <h2 className="text-xl font-bold text-foreground dark:text-white">
                  How to Request a Refund
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0 text-sm font-bold text-primary">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground dark:text-muted-foreground">Send an Email</h3>
                      <p className="text-muted-foreground dark:text-muted-foreground text-sm">
                        Contact us at{" "}
                        <a 
                          href="mailto:support@prolificpersonalities.com?subject=Refund Request" 
                          className="text-primary hover:underline"
                          data-testid="link-refund-email"
                        >
                          support@prolificpersonalities.com
                        </a>
                        {" "}with the subject line "Refund Request".
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0 text-sm font-bold text-primary">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground dark:text-muted-foreground">Include Your Details</h3>
                      <p className="text-muted-foreground dark:text-muted-foreground text-sm">
                        Please include the email address used for purchase and, if available, your order confirmation number or Stripe receipt.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0 text-sm font-bold text-primary">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground dark:text-muted-foreground">Receive Your Refund</h3>
                      <p className="text-muted-foreground dark:text-muted-foreground text-sm">
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
                    <h2 className="text-xl font-bold text-foreground dark:text-white mb-2">
                      Processing Time
                    </h2>
                    <ul className="text-muted-foreground dark:text-muted-foreground space-y-2 text-sm">
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
                    <h2 className="text-xl font-bold text-foreground dark:text-white mb-2">
                      Important Notes
                    </h2>
                    <ul className="text-muted-foreground dark:text-muted-foreground space-y-2 text-sm">
                      <li>• Refunds requested after 30 days will be reviewed on a case-by-case basis</li>
                      <li>• Upon refund, access to the interactive web playbook will be revoked</li>
                      <li>• Downloaded PDF files are yours to keep, but continued use is not authorized after refund</li>
                      <li>• Repeated refund requests may result in future purchase restrictions</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10 border-0">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-white dark:bg-card flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground dark:text-white mb-2">
                      Questions?
                    </h2>
                    <p className="text-muted-foreground dark:text-muted-foreground mb-4">
                      If you have any questions about our refund policy or need assistance with a purchase, 
                      we're here to help.
                    </p>
                    <a 
                      href="mailto:support@prolificpersonalities.com"
                      className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
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
      </main>
    </div>
  );
}
