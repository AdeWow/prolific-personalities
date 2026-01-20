import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Express, RequestHandler, Response } from "express";
import { storage } from "./storage";
import { db } from "./db";
import { users, quizResults, orders, playbookProgress, actionPlanProgress, toolTracking, playbookNotes } from "@shared/schema";
import { eq, sql } from "drizzle-orm";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabaseAdmin: SupabaseClient | null = null;

if (supabaseUrl && supabaseServiceKey) {
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
} else {
  console.warn("Missing Supabase environment variables. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
}

export interface AuthenticatedRequest extends Express.Request {
  user?: {
    id: string;
    email: string | null;
  };
}

export const isAuthenticated: RequestHandler = async (req: any, res, next) => {
  if (!supabaseAdmin) {
    return res.status(503).json({ message: "Authentication service unavailable" });
  }

  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Missing authorization header" });
    }

    const token = authHeader.substring(7);
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      console.error("Supabase auth error:", error?.message);
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    req.user = {
      id: user.id,
      email: user.email || null,
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({ message: "Authentication failed" });
  }
};

async function migrateUserToSupabaseId(oldUserId: string, newSupabaseId: string): Promise<void> {
  await db.transaction(async (tx) => {
    await tx.update(quizResults).set({ userId: newSupabaseId }).where(eq(quizResults.userId, oldUserId));
    await tx.update(orders).set({ userId: newSupabaseId }).where(eq(orders.userId, oldUserId));
    await tx.update(playbookProgress).set({ userId: newSupabaseId }).where(eq(playbookProgress.userId, oldUserId));
    await tx.update(actionPlanProgress).set({ userId: newSupabaseId }).where(eq(actionPlanProgress.userId, oldUserId));
    await tx.update(toolTracking).set({ userId: newSupabaseId }).where(eq(toolTracking.userId, oldUserId));
    await tx.update(playbookNotes).set({ userId: newSupabaseId }).where(eq(playbookNotes.userId, oldUserId));
    await tx.delete(users).where(eq(users.id, oldUserId));
  });
}

export async function setupAuth(app: Express) {
  app.post("/api/auth/sync", async (req: any, res: Response) => {
    if (!supabaseAdmin) {
      return res.status(503).json({ message: "Authentication service unavailable" });
    }

    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Missing authorization header" });
      }

      const token = authHeader.substring(7);
      const { data: { user: supabaseUser }, error } = await supabaseAdmin.auth.getUser(token);

      if (error || !supabaseUser) {
        return res.status(401).json({ message: "Invalid token" });
      }

      const { id, email, firstName, lastName, profileImageUrl } = req.body;

      if (id !== supabaseUser.id) {
        return res.status(403).json({ message: "User ID mismatch" });
      }

      const userEmail = email || supabaseUser.email;
      
      const existingUserById = await storage.getUser(id);
      
      if (existingUserById) {
        await storage.upsertUser({
          id,
          email: userEmail,
          firstName,
          lastName,
          profileImageUrl,
        });
        return res.json({ success: true, migrated: false });
      }

      if (userEmail) {
        const existingUserByEmail = await storage.getUserByEmail(userEmail);
        
        if (existingUserByEmail && existingUserByEmail.id !== id) {
          console.log(`Migrating user from ${existingUserByEmail.id} to ${id}`);
          await migrateUserToSupabaseId(existingUserByEmail.id, id);
        }
      }

      await storage.upsertUser({
        id,
        email: userEmail,
        firstName,
        lastName,
        profileImageUrl,
      });

      res.json({ success: true, migrated: true });
    } catch (error) {
      console.error("User sync error:", error);
      res.status(500).json({ message: "Failed to sync user" });
    }
  });

  app.get("/api/auth/user", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Failed to get user" });
    }
  });
}
