import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut, ChevronDown, ChevronRight, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import logoImage from "@assets/Logo5Nobackground1_1762920314202.png";

const archetypeNavItems = [
  { slug: 'structured-achiever', name: 'The Structured Achiever', color: 'bg-blue-500' },
  { slug: 'chaotic-creative', name: 'The Chaotic Creative', color: 'bg-purple-500' },
  { slug: 'anxious-perfectionist', name: 'The Anxious Perfectionist', color: 'bg-rose-500' },
  { slug: 'novelty-seeker', name: 'The Novelty Seeker', color: 'bg-amber-500' },
  { slug: 'strategic-planner', name: 'The Strategic Planner', color: 'bg-teal-500' },
  { slug: 'flexible-improviser', name: 'The Flexible Improviser', color: 'bg-cyan-500' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [archetypesDropdownOpen, setArchetypesDropdownOpen] = useState(false);
  const [mobileArchetypesExpanded, setMobileArchetypesExpanded] = useState(false);
  const [, setLocation] = useLocation();
  const { isAuthenticated, user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    setLocation("/");
  };

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
              {/* Archetypes Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setArchetypesDropdownOpen(true)}
                onMouseLeave={() => setArchetypesDropdownOpen(false)}
              >
                <Link 
                  href="/archetypes" 
                  className="text-muted-foreground hover:text-primary transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded inline-flex items-center gap-1"
                >
                  Archetypes
                  <ChevronDown className={`h-4 w-4 transition-transform duration-150 ${archetypesDropdownOpen ? 'rotate-180' : ''}`} />
                </Link>
                
                {/* Dropdown Menu */}
                <div 
                  className={`absolute top-full left-0 mt-2 w-72 bg-white dark:bg-card border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-50 overflow-hidden transition-all duration-150 ease-out ${
                    archetypesDropdownOpen 
                      ? 'opacity-100 translate-y-0 pointer-events-auto' 
                      : 'opacity-0 -translate-y-2 pointer-events-none'
                  }`}
                >
                  <div className="py-2">
                    {archetypeNavItems.map((archetype) => (
                      <Link
                        key={archetype.slug}
                        href={`/archetypes/${archetype.slug}`}
                        className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <span className={`w-2.5 h-2.5 rounded-full ${archetype.color} flex-shrink-0`} />
                        <span className="font-medium">{archetype.name}</span>
                      </Link>
                    ))}
                  </div>
                  
                  <div className="border-t border-slate-100 dark:border-slate-700 py-2">
                    <Link
                      href="/archetypes"
                      className="flex items-center justify-between px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <span className="font-medium">View All Archetypes</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                  
                  <div className="border-t border-slate-100 dark:border-slate-700 py-2">
                    <Link
                      href="/quiz"
                      className="flex items-center justify-between px-4 py-3 text-primary hover:bg-primary/5 transition-colors"
                    >
                      <span className="font-medium">Not sure? Take the Assessment</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
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
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="outline" className="gap-2" data-testid="button-dashboard">
                      <User className="h-4 w-4" aria-hidden="true" />
                      Dashboard
                    </Button>
                  </Link>
                  <Button variant="ghost" className="gap-2" onClick={handleLogout} data-testid="button-logout">
                      <LogOut className="h-4 w-4" aria-hidden="true" />
                      Logout
                    </Button>
                </>
              ) : (
                <>
                  <Link href="/quiz">
                    <Button className="gradient-primary text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition-all" data-testid="button-take-quiz">
                      Take the Quiz
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="outline" data-testid="button-login">
                      Login
                    </Button>
                  </Link>
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
              {/* Mobile Archetypes Accordion */}
              <div>
                <button
                  onClick={() => setMobileArchetypesExpanded(!mobileArchetypesExpanded)}
                  className="w-full flex items-center justify-between text-muted-foreground hover:text-primary transition-colors py-2 font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                  aria-expanded={mobileArchetypesExpanded}
                >
                  <span>Archetypes</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${mobileArchetypesExpanded ? 'rotate-180' : ''}`} />
                </button>
                
                <div className={`overflow-hidden transition-all duration-200 ${mobileArchetypesExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="pl-4 py-2 space-y-1">
                    {archetypeNavItems.map((archetype) => (
                      <Link
                        key={archetype.slug}
                        href={`/archetypes/${archetype.slug}`}
                        className="flex items-center gap-3 py-2 text-muted-foreground hover:text-primary transition-colors"
                        onClick={() => { setMobileMenuOpen(false); setMobileArchetypesExpanded(false); }}
                      >
                        <span className={`w-2 h-2 rounded-full ${archetype.color} flex-shrink-0`} />
                        <span className="text-sm">{archetype.name}</span>
                      </Link>
                    ))}
                    
                    <div className="border-t border-slate-100 dark:border-slate-700 mt-2 pt-2">
                      <Link
                        href="/archetypes"
                        className="flex items-center gap-2 py-2 text-muted-foreground hover:text-primary transition-colors"
                        onClick={() => { setMobileMenuOpen(false); setMobileArchetypesExpanded(false); }}
                      >
                        <span className="text-sm font-medium">View All Archetypes</span>
                        <ChevronRight className="h-3 w-3" />
                      </Link>
                    </div>
                    
                    <div className="border-t border-slate-100 dark:border-slate-700 pt-2">
                      <Link
                        href="/quiz"
                        className="flex items-center gap-2 py-2 text-primary transition-colors"
                        onClick={() => { setMobileMenuOpen(false); setMobileArchetypesExpanded(false); }}
                      >
                        <span className="text-sm font-medium">Take the Assessment</span>
                        <ChevronRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
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
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full gap-2 justify-center" data-testid="button-dashboard-mobile">
                      <User className="h-4 w-4" aria-hidden="true" />
                      Dashboard
                    </Button>
                  </Link>
                  <Button variant="ghost" className="w-full gap-2 justify-center" onClick={() => { handleLogout(); setMobileMenuOpen(false); }} data-testid="button-logout-mobile">
                      <LogOut className="h-4 w-4" aria-hidden="true" />
                      Logout
                    </Button>
                </>
              ) : (
                <>
                  <Link href="/quiz" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full gradient-primary text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all" data-testid="button-take-quiz-mobile">
                      Take the Quiz
                    </Button>
                  </Link>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full" data-testid="button-login-mobile">
                      Login
                    </Button>
                  </Link>
                </>
              )}
            </nav>
          )}
        </div>
      </header>
    </>
  );
}
