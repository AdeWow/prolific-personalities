import { Header } from "@/components/header";
import { SEOHead } from "@/components/seo-head";

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
      <main id="main-content" role="main" className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-foreground mb-8">Terms of Service</h1>
          
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-muted-foreground mb-8">
              This page is being updated. Please contact{" "}
              <a href="mailto:hello@prolificpersonalities.com" className="text-primary hover:underline">
                hello@prolificpersonalities.com
              </a>{" "}
              with any questions.
            </p>
            
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Acceptance of Terms</h2>
            <p className="text-muted-foreground mb-4">
              By accessing or using Prolific Personalities, you agree to be bound by these terms of service.
            </p>
            
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Use of Service</h2>
            <p className="text-muted-foreground mb-4">
              Our platform provides productivity assessments and personalized recommendations. 
              You agree to use the service for lawful purposes only.
            </p>
            
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Purchases and Refunds</h2>
            <p className="text-muted-foreground mb-4">
              All purchases are subject to our{" "}
              <a href="/refund-policy" className="text-primary hover:underline">refund policy</a>.
              We offer a 30-day satisfaction guarantee on all playbook purchases.
            </p>
            
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Contact Us</h2>
            <p className="text-muted-foreground">
              For questions about these terms, please email us at{" "}
              <a href="mailto:hello@prolificpersonalities.com" className="text-primary hover:underline">
                hello@prolificpersonalities.com
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
