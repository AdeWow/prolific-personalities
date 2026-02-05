import { Link } from "wouter";
import logoImage from "@assets/Logo5Nobackground1_1762920314202.png";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-slate-800 py-12 px-6" role="contentinfo">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <img src={logoImage} alt="Prolific Personalities" className="w-12 h-12" />
              <span className="text-lg font-semibold text-white">Prolific Personalities</span>
            </Link>
            <p className="text-slate-400 text-sm">
              Science-backed strategies for how you work best.
            </p>
          </div>
          
          {/* Product Column */}
          <div>
            <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/quiz" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Take the Quiz
                </Link>
              </li>
              <li>
                <Link href="/archetypes" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Archetypes
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Learn Column */}
          <div>
            <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Learn</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/blog" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/the-research" className="text-sm text-slate-400 hover:text-white transition-colors">
                  The Research
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-slate-400 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-slate-400 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Legal Column */}
          <div>
            <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Row */}
        <div className="border-t border-slate-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-400">
            © {currentYear} Prolific Personalities. All rights reserved.
          </p>
          <a 
            href="mailto:hello@prolificpersonalities.com" 
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            hello@prolificpersonalities.com
          </a>
        </div>
      </div>
    </footer>
  );
}
