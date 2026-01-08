import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut, Bot } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import logoImage from "@assets/Logo5Nobackground1_1762920314202.png";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  return (
    <>
      {/* Skip Navigation Link - 508 Compliance */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        data-testid="skip-navigation"
      >
        Skip to main content
      </a>
      
      <header className="bg-white dark:bg-card backdrop-blur-sm shadow-sm sticky top-0 z-50" role="banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg">
              <img src={logoImage} alt="Prolific Personalities Logo" className="w-20 h-20" />
              <span className="text-xl font-bold text-foreground">Prolific Personalities</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8" role="navigation" aria-label="Main navigation">
              <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">
                About
              </Link>
              <Link href="/archetypes" className="text-muted-foreground hover:text-primary transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">
                Archetypes
              </Link>
              <Link href="/science" className="text-muted-foreground hover:text-primary transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded" data-testid="link-research">
                The Research
              </Link>
              <Link href="/resources" className="text-muted-foreground hover:text-primary transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded" data-testid="link-resources">
                Resources
              </Link>
              <Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded" data-testid="link-blog">
                Blog
              </Link>
              <Link href="/pricing" className="text-muted-foreground hover:text-primary transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">
                Pricing
              </Link>
              <Link href="/coach" className="flex items-center gap-1 text-primary font-medium hover:text-primary/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded" data-testid="link-ai-coach">
                <Bot className="w-4 h-4" aria-hidden="true" />
                AI Coach
              </Link>
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="outline" className="gap-2" data-testid="button-dashboard">
                      <User className="h-4 w-4" aria-hidden="true" />
                      Dashboard
                    </Button>
                  </Link>
                  <a href="/api/logout">
                    <Button variant="ghost" className="gap-2" data-testid="button-logout">
                      <LogOut className="h-4 w-4" aria-hidden="true" />
                      Logout
                    </Button>
                  </a>
                </>
              ) : (
                <>
                  <Link href="/quiz">
                    <Button className="gradient-primary text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition-all" data-testid="button-take-quiz">
                      Take the Quiz
                    </Button>
                  </Link>
                  <a href="/api/login">
                    <Button variant="outline" data-testid="button-login">
                      Login
                    </Button>
                  </a>
                </>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav id="mobile-navigation" className="md:hidden py-4 space-y-4 border-t border-border" role="navigation" aria-label="Mobile navigation">
              <Link href="/about" className="block text-muted-foreground hover:text-primary transition-colors py-2 font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded" onClick={() => setMobileMenuOpen(false)}>
                About
              </Link>
              <Link href="/archetypes" className="block text-muted-foreground hover:text-primary transition-colors py-2 font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded" onClick={() => setMobileMenuOpen(false)}>
                Archetypes
              </Link>
              <Link href="/science" className="block text-muted-foreground hover:text-primary transition-colors py-2 font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded" onClick={() => setMobileMenuOpen(false)} data-testid="link-research-mobile">
                The Research
              </Link>
              <Link href="/resources" className="block text-muted-foreground hover:text-primary transition-colors py-2 font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded" onClick={() => setMobileMenuOpen(false)} data-testid="link-resources-mobile">
                Resources
              </Link>
              <Link href="/blog" className="block text-muted-foreground hover:text-primary transition-colors py-2 font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded" onClick={() => setMobileMenuOpen(false)} data-testid="link-blog-mobile">
                Blog
              </Link>
              <Link href="/pricing" className="block text-muted-foreground hover:text-primary transition-colors py-2 font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded" onClick={() => setMobileMenuOpen(false)}>
                Pricing
              </Link>
              <Link href="/coach" className="flex items-center gap-1 text-primary font-medium py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded" onClick={() => setMobileMenuOpen(false)} data-testid="link-ai-coach-mobile">
                <Bot className="w-4 h-4" aria-hidden="true" />
                AI Coach
              </Link>
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full gap-2 justify-center" data-testid="button-dashboard-mobile">
                      <User className="h-4 w-4" aria-hidden="true" />
                      Dashboard
                    </Button>
                  </Link>
                  <a href="/api/logout" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full gap-2 justify-center" data-testid="button-logout-mobile">
                      <LogOut className="h-4 w-4" aria-hidden="true" />
                      Logout
                    </Button>
                  </a>
                </>
              ) : (
                <>
                  <Link href="/quiz" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full gradient-primary text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all" data-testid="button-take-quiz-mobile">
                      Take the Quiz
                    </Button>
                  </Link>
                  <a href="/api/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full" data-testid="button-login-mobile">
                      Login
                    </Button>
                  </a>
                </>
              )}
            </nav>
          )}
        </div>
      </header>
    </>
  );
}
