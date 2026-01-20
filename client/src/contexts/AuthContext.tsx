import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";

interface AuthUser {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapSupabaseUser(supabaseUser: SupabaseUser | null): AuthUser | null {
  if (!supabaseUser) return null;
  
  const metadata = supabaseUser.user_metadata || {};
  
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || null,
    firstName: metadata.first_name || metadata.given_name || metadata.name?.split(' ')[0] || null,
    lastName: metadata.last_name || metadata.family_name || metadata.name?.split(' ').slice(1).join(' ') || null,
    profileImageUrl: metadata.avatar_url || metadata.picture || null,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(mapSupabaseUser(session?.user ?? null));
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        setSession(session);
        setUser(mapSupabaseUser(session?.user ?? null));
        setIsLoading(false);

        if (event === 'SIGNED_IN' && session?.user) {
          try {
            await fetch('/api/auth/sync', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`,
              },
              body: JSON.stringify({
                id: session.user.id,
                email: session.user.email,
                firstName: session.user.user_metadata?.first_name || session.user.user_metadata?.given_name || null,
                lastName: session.user.user_metadata?.last_name || session.user.user_metadata?.family_name || null,
                profileImageUrl: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || null,
              }),
            });
          } catch (error) {
            console.error("Failed to sync user to database:", error);
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, isAuthenticated: !!user, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
