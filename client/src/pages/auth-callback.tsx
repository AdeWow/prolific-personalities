import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import logoImage from "@assets/Logo5Nobackground1_1762920314202.png";

export default function AuthCallback() {
  const [, setLocation] = useLocation();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth callback error:", error);
          setError(error.message);
          return;
        }

        if (data.session) {
          setLocation("/dashboard");
        } else {
          setLocation("/login");
        }
      } catch (err: any) {
        console.error("Auth callback exception:", err);
        setError(err.message || "Authentication failed");
      }
    };

    handleAuthCallback();
  }, [setLocation]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <img src={logoImage} alt="Prolific Personalities" className="w-20 h-20 mx-auto" />
          <h1 className="text-xl font-semibold text-foreground">Authentication Error</h1>
          <p className="text-muted-foreground">{error}</p>
          <a href="/login" className="text-primary hover:underline">
            Try again
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <img src={logoImage} alt="Prolific Personalities" className="w-20 h-20 mx-auto" />
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="text-muted-foreground">Signing you in...</p>
      </div>
    </div>
  );
}
