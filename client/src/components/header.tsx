import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import logoImage from "@assets/logo2_1762241472426.png";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <img src={logoImage} alt="Prolific Personalities Logo" className="w-10 h-10" />
            <h1 className="text-xl font-bold text-neutral-800">Prolific Personalities</h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/about" className="text-neutral-600 hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/archetypes" className="text-neutral-600 hover:text-primary transition-colors">
              Archetypes
            </Link>
            <Link href="/blog" className="text-neutral-600 hover:text-primary transition-colors" data-testid="link-blog">
              Blog
            </Link>
            <Link href="/pricing" className="text-neutral-600 hover:text-primary transition-colors">
              Pricing
            </Link>
            <Link href="/quiz">
              <Button className="gradient-primary text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition-all" data-testid="button-take-quiz">
                Take Assessment
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-600 hover:text-primary transition-colors"
            aria-label="Toggle mobile menu"
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 space-y-4 border-t border-neutral-200">
            <Link href="/about" className="block text-neutral-600 hover:text-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
              About
            </Link>
            <Link href="/archetypes" className="block text-neutral-600 hover:text-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
              Archetypes
            </Link>
            <Link href="/blog" className="block text-neutral-600 hover:text-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)} data-testid="link-blog-mobile">
              Blog
            </Link>
            <Link href="/pricing" className="block text-neutral-600 hover:text-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
              Pricing
            </Link>
            <Link href="/quiz" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full gradient-primary text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all" data-testid="button-take-quiz-mobile">
                Take Assessment
              </Button>
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
