import { Header } from "@/components/header";
import { SEOHead } from "@/components/seo-head";

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
      <main id="main-content" role="main" className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
          
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-muted-foreground mb-8">
              This page is being updated. Please contact{" "}
              <a href="mailto:hello@prolificpersonalities.com" className="text-primary hover:underline">
                hello@prolificpersonalities.com
              </a>{" "}
              with any questions.
            </p>
            
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Information We Collect</h2>
            <p className="text-muted-foreground mb-4">
              We collect information you provide directly, including email addresses and quiz responses. 
              We also collect usage data to improve our services.
            </p>
            
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">How We Use Your Information</h2>
            <p className="text-muted-foreground mb-4">
              Your information is used to deliver personalized productivity insights, 
              send relevant updates (with your consent), and improve our platform.
            </p>
            
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Contact Us</h2>
            <p className="text-muted-foreground">
              For privacy-related inquiries, please email us at{" "}
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
