import { createContext, useContext, useEffect, useState, useRef, useCallback, type ReactNode } from "react";
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
  isSynced: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Dev-mode mock (tree-shaken from production builds) ───
const DEV_MOCK_USER: AuthUser = {
  id: "dev-user-00000000-0000-0000-0000-000000000000",
  email: "dev@localhost",
  firstName: "Dev",
  lastName: "User",
  profileImageUrl: null,
};

const DEV_MOCK_SESSION = {
  access_token: "dev-bypass-token",
  refresh_token: "",
  expires_in: 999999,
  token_type: "bearer",
  user: {
    id: DEV_MOCK_USER.id,
    email: DEV_MOCK_USER.email,
    user_metadata: {},
    app_metadata: {},
    aud: "authenticated",
    created_at: "",
  },
} as unknown as Session;

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

async function syncUserToDatabase(session: Session, retries = 3): Promise<boolean> {
  const user = session.user;
  const metadata = user.user_metadata || {};

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch('/api/auth/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          id: user.id,
          email: user.email,
          firstName: metadata.first_name || metadata.given_name || null,
          lastName: metadata.last_name || metadata.family_name || null,
          profileImageUrl: metadata.avatar_url || metadata.picture || null,
        }),
      });

      if (res.ok) {
        return true;
      }
      console.warn(`Auth sync attempt ${attempt}/${retries} failed with status ${res.status}`);
    } catch (error) {
      console.warn(`Auth sync attempt ${attempt}/${retries} failed:`, error);
    }

    if (attempt < retries) {
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }

  console.error("Auth sync failed after all retries");
  return false;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSynced, setIsSynced] = useState(false);
  const syncInProgress = useRef(false);
  const lastSyncedUserId = useRef<string | null>(null);

  const handleSync = useCallback(async (currentSession: Session) => {
    if (syncInProgress.current) return;
    if (lastSyncedUserId.current === currentSession.user.id) return;

    syncInProgress.current = true;
    const success = await syncUserToDatabase(currentSession);
    if (success) {
      lastSyncedUserId.current = currentSession.user.id;
      setIsSynced(true);
    }
    syncInProgress.current = false;
  }, []);

  useEffect(() => {
    // In dev mode without Supabase configured, use mock user/session
    if (!isSupabaseConfigured) {
      if (import.meta.env.DEV) {
        console.log("🔓 Dev mode: using mock auth (no Supabase configured)");
        setUser(DEV_MOCK_USER);
        setSession(DEV_MOCK_SESSION);
        setIsSynced(true);
      }
      setIsLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      // In dev mode, if no real session exists, use mock
      if (!session && import.meta.env.DEV) {
        console.log("🔓 Dev mode: using mock auth (no active session)");
        setUser(DEV_MOCK_USER);
        setSession(DEV_MOCK_SESSION);
        setIsSynced(true);
        setIsLoading(false);
        return;
      }

      setSession(session);
      setUser(mapSupabaseUser(session?.user ?? null));
      setIsLoading(false);

      if (session?.user) {
        handleSync(session);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);

        // In dev mode, if Supabase reports no session, keep mock auth
        if (!session && import.meta.env.DEV) {
          setIsLoading(false);
          return;
        }

        setSession(session);
        setUser(mapSupabaseUser(session?.user ?? null));
        setIsLoading(false);

        if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') && session?.user) {
          handleSync(session);
        }

        if (event === 'SIGNED_OUT') {
          lastSyncedUserId.current = null;
          setIsSynced(false);
          // In dev mode, restore mock after sign out
          if (import.meta.env.DEV) {
            setUser(DEV_MOCK_USER);
            setSession(DEV_MOCK_SESSION);
            setIsSynced(true);
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [handleSync]);

  const signOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setIsSynced(false);
    lastSyncedUserId.current = null;
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, isAuthenticated: !!user, isSynced, signOut }}>
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
