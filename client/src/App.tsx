import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ExitIntentPopup } from "@/components/exit-intent-popup";
import Home from "@/pages/home";
import Quiz from "@/pages/quiz";
import Results from "@/pages/results";
import About from "@/pages/about";
import Science from "@/pages/science";
import Archetypes from "@/pages/archetypes";
import FAQ from "@/pages/faq";
import Blog from "@/pages/blog";
import BlogPost from "@/pages/blog-post";
import Founder from "@/pages/founder";
import Pricing from "@/pages/pricing";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/quiz" component={Quiz} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/about" component={About} />
      <Route path="/science" component={Science} />
      <Route path="/archetypes" component={Archetypes} />
      <Route path="/faq" component={FAQ} />
      <Route path="/founder" component={Founder} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/blog" component={Blog} />
      <Route path="/results/:sessionId" component={Results} />
      <Route path="/results" component={Results} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <ExitIntentPopup />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
