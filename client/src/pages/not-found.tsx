import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { SEOHead } from "@/components/seo-head";
import { ChevronRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Page Not Found"
        description="This page doesn't exist. Take the free productivity assessment to discover your archetype."
      />
      <Header />

      <main id="main-content" role="main">
        <section className="py-32 lg:py-40">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <p className="text-6xl font-bold text-primary mb-6">404</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Page not found
            </h1>
            <p className="text-lg text-muted-foreground mb-10">
              This page doesn't exist, but your productivity archetype does.
            </p>

            <Link href="/">
              <Button className="gradient-primary text-white px-8 py-6 rounded-xl font-semibold text-lg">
                Take the Free Assessment
                <ChevronRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
