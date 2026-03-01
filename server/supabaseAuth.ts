import { createClient } from "@supabase/supabase-js";
import { RequestHandler } from "express";

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || "";

const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export const supabaseAdmin = supabase;

const recentlySyncedUsers = new Map<string, number>();
const SYNC_COOLDOWN_MS = 5 * 60 * 1000;

export const supabaseAuth: RequestHandler = async (req, res, next) => {
  // Dev mode: skip Supabase token validation entirely
  if (process.env.NODE_ENV === "development") {
    (req as any).supabaseUser = {
      id: "dev-user-00000000-0000-0000-0000-000000000000",
      email: "dev@localhost",
      user_metadata: { full_name: "Dev User" },
    };
    return next();
  }

  if (!supabase) {
    return res.status(503).json({ success: false, error: "Auth service unavailable" });
  }

  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, error: "Missing token" });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ success: false, error: "Invalid token" });
    }

    (req as any).supabaseUser = user;

    const lastSynced = recentlySyncedUsers.get(user.id);
    const now = Date.now();
    if (!lastSynced || now - lastSynced > SYNC_COOLDOWN_MS) {
      try {
        const { storage } = await import("./storage");
        const metadata = user.user_metadata || {};
        console.log(`🔐 Auth middleware sync: supabaseId=${user.id}, email=${user.email}`);
        const localUser = await storage.upsertUser({
          id: user.id,
          email: user.email || null,
          firstName: metadata.first_name || metadata.given_name || metadata.full_name?.split(' ')[0] || null,
          lastName: metadata.last_name || metadata.family_name || metadata.full_name?.split(' ').slice(1).join(' ') || null,
          profileImageUrl: metadata.avatar_url || metadata.picture || null,
        });
        console.log(`🔐 Auth middleware sync result: localUserId=${localUser.id}, localEmail=${localUser.email}`);
        recentlySyncedUsers.set(user.id, now);
      } catch (syncError) {
        console.warn("Background user auto-sync failed (non-blocking):", syncError);
      }
    }

    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: "Auth failed" });
  }
};
