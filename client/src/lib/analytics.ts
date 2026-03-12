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

// Detect debug/developer users so their traffic can be filtered in GA4.
// Set via ?debug=true in URL (also persists to localStorage) or
// by manually setting localStorage.debug_user = "true".
const getDebugUser = (): boolean => {
  if (typeof window === 'undefined') return false;
  // URL param both signals and persists the flag
  if (window.location.search.includes('debug=true')) {
    try { localStorage.setItem('debug_user', 'true'); } catch {}
    return true;
  }
  return localStorage.getItem('debug_user') === 'true';
};

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
    debug_user: getDebugUser(),
  });
};

// Track events — supports GA4 custom parameters via optional params object.
// Legacy category/label/value args still work for backward compatibility.
// debug_user is injected automatically into every event payload.
export const trackEvent = (
  action: string,
  category?: string,
  label?: string,
  value?: number,
  params?: Record<string, string | number | boolean>,
) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
    debug_user: getDebugUser(),
    ...params,
  });
};
