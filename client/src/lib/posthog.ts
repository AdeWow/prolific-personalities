import posthog from 'posthog-js';

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY;
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com';

let initialized = false;

export const initPostHog = () => {
  if (initialized || !POSTHOG_KEY) {
    if (!POSTHOG_KEY) {
      console.warn('⚠️ PostHog: Missing VITE_POSTHOG_KEY');
    }
    return;
  }

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    capture_pageview: false,
    capture_pageleave: true,
    autocapture: true,
    persistence: 'localStorage',
    loaded: (ph) => {
      if (import.meta.env.DEV) {
        console.log('✅ PostHog: Initialized');
      }
    }
  });

  initialized = true;
};

export const identifyUser = (userId: string, properties?: Record<string, any>) => {
  if (!POSTHOG_KEY) return;
  
  posthog.identify(userId, properties);
};

export const resetUser = () => {
  if (!POSTHOG_KEY) return;
  posthog.reset();
};

export const trackFunnelEvent = (
  event: string,
  properties?: Record<string, any>
) => {
  if (!POSTHOG_KEY) return;
  
  if (import.meta.env.DEV) {
    console.log('📊 PostHog Event:', event, properties);
  }
  
  posthog.capture(event, {
    ...properties,
    timestamp: new Date().toISOString(),
  });
};

export const FunnelEvents = {
  LANDING_PAGE_VIEW: 'funnel_landing_view',
  QUIZ_START: 'funnel_quiz_start',
  QUIZ_PAGE_VIEW: 'funnel_quiz_page_view',
  QUIZ_QUESTION_ANSWERED: 'funnel_quiz_question_answered',
  QUIZ_COMPLETE: 'funnel_quiz_complete',
  RESULTS_VIEW: 'funnel_results_view',
  RESULTS_SCROLL_TO_PRICING: 'funnel_results_scroll_pricing',
  PAYWALL_VIEW: 'funnel_paywall_view',
  PAYWALL_TIER_CLICK: 'funnel_paywall_tier_click',
  CHECKOUT_START: 'funnel_checkout_start',
  CHECKOUT_COMPLETE: 'funnel_checkout_complete',
  PLAYBOOK_ACCESS: 'funnel_playbook_access',
  COACH_ACCESS: 'funnel_coach_access',
} as const;

export const trackLandingView = () => {
  trackFunnelEvent(FunnelEvents.LANDING_PAGE_VIEW, {
    source: document.referrer || 'direct',
    url: window.location.href,
  });
};

export const trackQuizStart = (source?: string) => {
  trackFunnelEvent(FunnelEvents.QUIZ_START, {
    source: source || 'unknown',
  });
};

export const trackQuizPageView = (pageNumber: number, totalPages: number) => {
  trackFunnelEvent(FunnelEvents.QUIZ_PAGE_VIEW, {
    page_number: pageNumber,
    total_pages: totalPages,
    progress_percent: Math.round((pageNumber / totalPages) * 100),
  });
};

export const trackQuizQuestionAnswered = (
  questionNumber: number,
  totalQuestions: number,
  dimension: string
) => {
  trackFunnelEvent(FunnelEvents.QUIZ_QUESTION_ANSWERED, {
    question_number: questionNumber,
    total_questions: totalQuestions,
    dimension,
    progress_percent: Math.round((questionNumber / totalQuestions) * 100),
  });
};

export const trackQuizComplete = (
  archetype: string,
  scores: { structure: number; motivation: number; cognitive: number; task: number },
  timeSpentSeconds?: number
) => {
  trackFunnelEvent(FunnelEvents.QUIZ_COMPLETE, {
    archetype,
    archetype_structure: scores.structure,
    archetype_motivation: scores.motivation,
    archetype_cognitive: scores.cognitive,
    archetype_task: scores.task,
    time_spent_seconds: timeSpentSeconds,
  });
  
  posthog.setPersonProperties({
    archetype,
    quiz_completed_at: new Date().toISOString(),
    structure_score: scores.structure,
    motivation_score: scores.motivation,
    cognitive_score: scores.cognitive,
    task_score: scores.task,
  });
};

export const trackResultsView = (archetype: string, isReturning: boolean = false) => {
  trackFunnelEvent(FunnelEvents.RESULTS_VIEW, {
    archetype,
    is_returning_user: isReturning,
  });
};

export const trackResultsScrollToPricing = (archetype: string) => {
  trackFunnelEvent(FunnelEvents.RESULTS_SCROLL_TO_PRICING, {
    archetype,
  });
};

export const trackPaywallView = (archetype: string, source: string) => {
  trackFunnelEvent(FunnelEvents.PAYWALL_VIEW, {
    archetype,
    source,
  });
};

export const trackPaywallTierClick = (
  tier: 'discovery' | 'playbook' | 'partner',
  archetype: string,
  price?: number,
  billingPeriod?: 'monthly' | 'yearly'
) => {
  trackFunnelEvent(FunnelEvents.PAYWALL_TIER_CLICK, {
    tier,
    archetype,
    price,
    billing_period: billingPeriod,
  });
};

export const trackCheckoutStart = (
  productType: string,
  archetype: string,
  price: number,
  billingPeriod?: 'monthly' | 'yearly'
) => {
  trackFunnelEvent(FunnelEvents.CHECKOUT_START, {
    product_type: productType,
    archetype,
    price,
    billing_period: billingPeriod,
  });
};

export const trackCheckoutComplete = (
  productType: string,
  archetype: string,
  price: number,
  orderId?: string,
  billingPeriod?: 'monthly' | 'yearly'
) => {
  trackFunnelEvent(FunnelEvents.CHECKOUT_COMPLETE, {
    product_type: productType,
    archetype,
    price,
    order_id: orderId,
    billing_period: billingPeriod,
  });
  
  posthog.setPersonProperties({
    customer_type: productType,
    first_purchase_at: new Date().toISOString(),
    total_revenue: price,
  });
};

export const trackPlaybookAccess = (archetype: string, chapter?: string) => {
  trackFunnelEvent(FunnelEvents.PLAYBOOK_ACCESS, {
    archetype,
    chapter,
  });
};

export const trackCoachAccess = (archetype: string, isPremium: boolean) => {
  trackFunnelEvent(FunnelEvents.COACH_ACCESS, {
    archetype,
    is_premium: isPremium,
  });
};

export { posthog };
