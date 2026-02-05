import { Link } from "wouter";
import logoImage from "@assets/Logo5Nobackground1_1762920314202.png";

export function GlobalFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-12 md:py-16" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center space-y-6">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <img src={logoImage} alt="Prolific Personalities Logo" className="w-10 h-10" />
            <span className="text-lg font-bold text-foreground">Prolific Personalities</span>
          </Link>

          <nav className="flex flex-wrap justify-center gap-x-2 gap-y-2" aria-label="Footer navigation">
            <Link href="/quiz" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Take the Quiz
            </Link>
            <span className="text-gray-400">·</span>
            <Link href="/about" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              About
            </Link>
            <span className="text-gray-400">·</span>
            <Link href="/blog" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Blog
            </Link>
            <span className="text-gray-400">·</span>
            <Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Pricing
            </Link>
            <span className="text-gray-400">·</span>
            <a 
              href="mailto:support@prolificpersonalities.com" 
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Contact
            </a>
          </nav>

          <a 
            href="mailto:support@prolificpersonalities.com" 
            className="text-primary hover:underline font-medium"
          >
            support@prolificpersonalities.com
          </a>

          <div className="space-y-3 pt-4">
            <p className="text-xs text-gray-400">
              © {currentYear} Prolific Personalities. All rights reserved.
            </p>
            <nav className="flex flex-wrap justify-center gap-x-2 gap-y-1" aria-label="Legal navigation">
              <Link href="/privacy" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                Privacy Policy
              </Link>
              <span className="text-gray-300">·</span>
              <Link href="/terms" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                Terms of Service
              </Link>
              <span className="text-gray-300">·</span>
              <Link href="/refund-policy" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                Refund Policy
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
