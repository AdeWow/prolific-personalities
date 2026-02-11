import { createClient } from "@supabase/supabase-js";
import { RequestHandler } from "express";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export const supabaseAdmin = supabase;

const recentlySyncedUsers = new Map<string, number>();
const SYNC_COOLDOWN_MS = 5 * 60 * 1000;

export const supabaseAuth: RequestHandler = async (req, res, next) => {
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
        await storage.upsertUser({
          id: user.id,
          email: user.email || null,
          firstName: metadata.first_name || metadata.given_name || metadata.full_name?.split(' ')[0] || null,
          lastName: metadata.last_name || metadata.family_name || metadata.full_name?.split(' ').slice(1).join(' ') || null,
          profileImageUrl: metadata.avatar_url || metadata.picture || null,
        });
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
