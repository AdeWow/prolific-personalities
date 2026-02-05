import { Link } from "wouter";
import { Header } from "@/components/header";
import { SEOHead } from "@/components/seo-head";
import { Card, CardContent } from "@/components/ui/card";
import { FileCheck, Package, User, CreditCard, ShieldCheck, BookOpen, AlertTriangle, Mail } from "lucide-react";

export default function Terms() {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://prolificpersonalities.com';
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <SEOHead
        title="Terms of Service | Prolific Personalities"
        description="Terms and conditions for using Prolific Personalities productivity assessment platform."
        canonicalUrl={`${origin}/terms`}
      />
      <Header />
      <main id="main-content" role="main">
        <section className="py-16" aria-labelledby="terms-title">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 id="terms-title" className="text-4xl font-bold text-foreground dark:text-white mb-4">
              Terms of Service
            </h1>
            <p className="text-lg text-muted-foreground dark:text-muted-foreground mb-8">
              Last updated: February 2025
            </p>

            <div className="space-y-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                      <FileCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground dark:text-white mb-2">
                        Acceptance of Terms
                      </h2>
                      <p className="text-muted-foreground dark:text-muted-foreground">
                        By accessing or using Prolific Personalities, you agree to these terms. If you don't agree, please don't use the platform. We may update these terms from time to time — continued use of the platform means you accept any changes.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground dark:text-white mb-2">
                        What We Provide
                      </h2>
                      <p className="text-muted-foreground dark:text-muted-foreground">
                        Prolific Personalities offers a research-backed productivity assessment that classifies users into productivity archetypes and provides personalized strategies and tool recommendations. Our free tier includes the assessment and basic results. Premium playbooks are available as one-time purchases.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground dark:text-white mb-2">
                        Your Account
                      </h2>
                      <p className="text-muted-foreground dark:text-muted-foreground">
                        You're responsible for maintaining the security of your account credentials. Please use a strong, unique password. If you suspect unauthorized access, contact us immediately at{" "}
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
                    <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center flex-shrink-0">
                      <CreditCard className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground dark:text-white mb-2">
                        Purchases & Refunds
                      </h2>
                      <p className="text-muted-foreground dark:text-muted-foreground">
                        All purchases are processed securely through Stripe. We offer a 30-day satisfaction guarantee on all playbook purchases. For full details, see our{" "}
                        <Link href="/refund-policy" className="text-primary hover:underline">
                          refund policy
                        </Link>.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center flex-shrink-0">
                      <ShieldCheck className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground dark:text-white mb-2">
                        Acceptable Use
                      </h2>
                      <p className="text-muted-foreground dark:text-muted-foreground mb-4">
                        Please use Prolific Personalities for its intended purpose — personal productivity improvement. You agree not to:
                      </p>
                      <ul className="text-muted-foreground dark:text-muted-foreground space-y-2 text-sm">
                        <li>• Scrape, copy, or redistribute our assessment content or research</li>
                        <li>• Use the platform for any unlawful purpose</li>
                        <li>• Attempt to access other users' data or accounts</li>
                        <li>• Resell or redistribute premium playbook content</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground dark:text-white mb-2">
                        Intellectual Property
                      </h2>
                      <p className="text-muted-foreground dark:text-muted-foreground">
                        All content on Prolific Personalities — including the assessment framework, archetype descriptions, research summaries, and playbook content — is our original work and is protected by copyright. You may not reproduce or distribute it without written permission.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900 flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground dark:text-white mb-2">
                        Limitation of Liability
                      </h2>
                      <p className="text-muted-foreground dark:text-muted-foreground">
                        Prolific Personalities provides productivity insights and recommendations for informational purposes. We are not a substitute for professional medical, psychological, or career advice. We are not liable for decisions you make based on your results.
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
                        For questions about these terms, email us at{" "}
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
