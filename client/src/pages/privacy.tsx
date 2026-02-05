import { Header } from "@/components/header";
import { SEOHead } from "@/components/seo-head";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Shield, Database, UserCheck, Cookie, Mail } from "lucide-react";

export default function Privacy() {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://prolificpersonalities.com';
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <SEOHead
        title="Privacy Policy | Prolific Personalities"
        description="Learn how Prolific Personalities collects, uses, and protects your personal information."
        canonicalUrl={`${origin}/privacy`}
      />
      <Header />
      <main id="main-content" role="main">
        <section className="py-16" aria-labelledby="privacy-title">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 id="privacy-title" className="text-4xl font-bold text-foreground dark:text-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-muted-foreground dark:text-muted-foreground mb-8">
              Last updated: February 2025
            </p>

            <div className="space-y-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground dark:text-white mb-2">
                        What We Collect
                      </h2>
                      <p className="text-muted-foreground dark:text-muted-foreground mb-4">
                        When you use Prolific Personalities, we collect:
                      </p>
                      <ul className="text-muted-foreground dark:text-muted-foreground space-y-2 text-sm">
                        <li>• Email address (when you create an account or sign up for updates)</li>
                        <li>• Quiz responses (your answers to the productivity assessment)</li>
                        <li>• Basic usage data (pages visited, features used) to improve the platform</li>
                      </ul>
                      <p className="text-muted-foreground dark:text-muted-foreground mt-4 text-sm">
                        We do not collect payment information directly — all payments are securely processed by Stripe.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground dark:text-white mb-2">
                        How We Use Your Information
                      </h2>
                      <p className="text-muted-foreground dark:text-muted-foreground mb-4">
                        We use your information to:
                      </p>
                      <ul className="text-muted-foreground dark:text-muted-foreground space-y-2 text-sm">
                        <li>• Generate your personalized productivity profile and archetype results</li>
                        <li>• Deliver your premium playbook if purchased</li>
                        <li>• Send relevant updates and tips (only with your consent — you can unsubscribe anytime)</li>
                        <li>• Improve the platform based on aggregate, anonymized usage patterns</li>
                      </ul>
                      <p className="text-muted-foreground dark:text-muted-foreground mt-4 text-sm font-medium">
                        We never sell your personal data to third parties.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center flex-shrink-0">
                      <Database className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground dark:text-white mb-2">
                        Data Storage & Security
                      </h2>
                      <p className="text-muted-foreground dark:text-muted-foreground">
                        Your data is stored securely using industry-standard encryption. We use Supabase for authentication and a secure PostgreSQL database for quiz results. Access to your data is restricted to essential platform operations only.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center flex-shrink-0">
                      <UserCheck className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground dark:text-white mb-2">
                        Your Rights
                      </h2>
                      <p className="text-muted-foreground dark:text-muted-foreground mb-4">
                        You can request to:
                      </p>
                      <ul className="text-muted-foreground dark:text-muted-foreground space-y-2 text-sm">
                        <li>• View all data we have associated with your account</li>
                        <li>• Delete your account and all associated data</li>
                        <li>• Opt out of marketing emails at any time</li>
                      </ul>
                      <p className="text-muted-foreground dark:text-muted-foreground mt-4 text-sm">
                        To make any of these requests, email us at{" "}
                        <a href="mailto:support@prolificpersonalities.com" className="text-primary hover:underline">
                          support@prolificpersonalities.com
                        </a>.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center flex-shrink-0">
                      <Cookie className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground dark:text-white mb-2">
                        Cookies
                      </h2>
                      <p className="text-muted-foreground dark:text-muted-foreground">
                        We use essential cookies to keep you logged in and remember your preferences. We also use analytics tools to understand how people use the platform. We do not use advertising cookies or trackers.
                      </p>
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
                      <p className="text-muted-foreground dark:text-muted-foreground">
                        For privacy-related questions, contact us at{" "}
                        <a 
                          href="mailto:support@prolificpersonalities.com"
                          className="text-primary hover:underline font-medium"
                        >
                          support@prolificpersonalities.com
                        </a>.
                      </p>
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
