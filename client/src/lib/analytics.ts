// Google Analytics integration for tracking user behavior.
// gtag.js is loaded once in index.html; this module provides
// helper functions for SPA page-view and event tracking.

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

const GA_ID = 'G-LB3WGLMTST';

// Initialize — gtag.js is already loaded by index.html, so we just
// verify it's available. No duplicate script injection needed.
export const initGA = () => {
  if (typeof window === 'undefined') return;

  if (window.gtag) {
    console.log('✅ Google Analytics: gtag ready (loaded via index.html)');
  } else {
    console.warn('⚠️ Google Analytics: gtag not found — check index.html');
  }
};

// Track page views — useful for single-page applications
export const trackPageView = (url: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('config', GA_ID, {
    page_path: url,
  });
};

// Track events
export const trackEvent = (
  action: string,
  category?: string,
  label?: string,
  value?: number,
) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};
