import { useState } from "react";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { trackEvent } from "@/lib/analytics";
import { Loader2, CheckCircle, Mail } from "lucide-react";

interface FooterNewsletterProps {
  variant: "dark" | "light";
}

export function FooterNewsletter({ variant }: FooterNewsletterProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "already" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const isDark = variant === "dark";

  const mutation = useMutation({
    mutationFn: async (emailAddr: string) => {
      const response = await apiRequest("POST", "/api/newsletter/subscribe", { email: emailAddr });
      return response.json();
    },
    onSuccess: (data: { status: string; message: string }) => {
      if (data.status === "already_subscribed") {
        setStatus("already");
      } else {
        setStatus("success");
        trackEvent("newsletter_signup", "Conversion", "Footer Newsletter", undefined, {
          source: "footer",
        });
      }
      setEmail("");
      setErrorMsg("");
    },
    onError: () => {
      setErrorMsg("Something went wrong. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    mutation.mutate(trimmed);
  };

  if (status === "success" || status === "already") {
    return (
      <div className={`${isDark ? "border-b border-white/20 pb-8 mb-8" : "border-b border-gray-200 pb-8 mb-8"}`}>
        <div className="flex items-center justify-center gap-2">
          <CheckCircle className={`w-5 h-5 ${isDark ? "text-emerald-400" : "text-emerald-500"}`} />
          <p className={`text-base font-medium ${isDark ? "text-white" : "text-foreground"}`}>
            {status === "already" ? "You're already subscribed!" : "You're in. Check your inbox."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isDark ? "border-b border-white/20 pb-8 mb-8" : "border-b border-gray-200 pb-8 mb-8"}`}>
      <div className="max-w-lg mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Mail className={`w-5 h-5 ${isDark ? "text-gray-400" : "text-muted-foreground"}`} aria-hidden="true" />
          <h3 className={`text-lg font-semibold ${isDark ? "text-white" : "text-foreground"}`}>
            Weekly insights for your productivity type
          </h3>
        </div>
        <p className={`text-sm mb-5 ${isDark ? "text-gray-400" : "text-muted-foreground"}`}>
          Research-backed strategies. No spam. No hustle culture.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3" noValidate>
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setErrorMsg(""); }}
            disabled={mutation.isPending}
            className={
              isDark
                ? "flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus-visible:ring-white/30"
                : "flex-1"
            }
            aria-label="Email address for newsletter"
          />
          <Button
            type="submit"
            disabled={mutation.isPending}
            className="gradient-primary text-white font-semibold px-6 whitespace-nowrap"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
                Subscribing...
              </>
            ) : (
              "Subscribe"
            )}
          </Button>
        </form>

        {errorMsg && (
          <p className="text-sm text-red-400 mt-2" role="alert">{errorMsg}</p>
        )}

        <p className={`text-xs mt-3 ${isDark ? "text-gray-500" : "text-muted-foreground"}`}>
          Haven't taken the quiz yet?{" "}
          <Link
            href="/quiz"
            className={`underline hover:no-underline ${isDark ? "text-gray-400 hover:text-white" : "text-primary hover:text-primary/80"}`}
          >
            Discover your type first&nbsp;→
          </Link>
        </p>
      </div>
    </div>
  );
}
