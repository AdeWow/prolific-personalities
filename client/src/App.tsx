import { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ExitIntentPopup } from "@/components/exit-intent-popup";
import { InstallPrompt } from "@/components/install-prompt";
import { initGA } from "./lib/analytics";
import { initPostHog } from "./lib/posthog";
import { useAnalytics } from "./hooks/use-analytics";
import Home from "@/pages/home";
import Quiz from "@/pages/quiz";
import Results from "@/pages/results";
import About from "@/pages/about";
import Science from "@/pages/science";
import Archetypes from "@/pages/archetypes";
import Resources from "@/pages/resources";
import FAQ from "@/pages/faq";
import Blog from "@/pages/blog";
import BlogPost from "@/pages/blog-post";
import Founder from "@/pages/founder";
import Pricing from "@/pages/pricing";
import Dashboard from "@/pages/dashboard";
import PaymentSuccess from "@/pages/payment-success";
import PaymentCancelled from "@/pages/payment-cancelled";
import PurchaseSuccess from "@/pages/purchase-success";
import Playbook from "@/pages/playbook";
import RefundPolicy from "@/pages/refund-policy";
import Unsubscribe from "@/pages/unsubscribe";
import DevTools from "@/pages/dev-tools";
import Coach from "@/pages/coach";

function Router() {
  const [location] = useLocation();
  
  // Track page views when routes change
  useAnalytics();
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dev" component={DevTools} />
      <Route path="/quiz" component={Quiz} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/purchase-success" component={PurchaseSuccess} />
      <Route path="/playbook/:archetype" component={Playbook} />
      <Route path="/payment-success" component={PaymentSuccess} />
      <Route path="/payment-cancelled" component={PaymentCancelled} />
      <Route path="/about" component={About} />
      <Route path="/science" component={Science} />
      <Route path="/archetypes" component={Archetypes} />
      <Route path="/resources" component={Resources} />
      <Route path="/faq" component={FAQ} />
      <Route path="/founder" component={Founder} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/blog" component={Blog} />
      <Route path="/refund-policy" component={RefundPolicy} />
      <Route path="/unsubscribe" component={Unsubscribe} />
      <Route path="/coach" component={Coach} />
      <Route path="/results/:sessionId" component={Results} />
      <Route path="/results" component={Results} />
    </Switch>
  );
}

function App() {
  // Initialize analytics when app loads
  useEffect(() => {
    // Google Analytics
    if (!import.meta.env.VITE_GA_MEASUREMENT_ID) {
      console.warn('Missing required Google Analytics key: VITE_GA_MEASUREMENT_ID');
    } else {
      initGA();
    }
    
    // PostHog for funnel analytics
    if (import.meta.env.VITE_POSTHOG_KEY) {
      initPostHog();
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <ExitIntentPopup />
        <InstallPrompt />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
