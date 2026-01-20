import { createClient } from "@supabase/supabase-js";
import type { Express, RequestHandler, Response } from "express";
import { storage } from "./storage";

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase environment variables for server auth");
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export interface AuthenticatedRequest extends Express.Request {
  user?: {
    id: string;
    email: string | null;
  };
}

export const isAuthenticated: RequestHandler = async (req: any, res, next) => {
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
      claims: {
        sub: user.id,
        email: user.email,
      },
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({ message: "Authentication failed" });
  }
};

export async function setupAuth(app: Express) {
  app.post("/api/auth/sync", async (req: any, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Missing authorization header" });
      }

      const token = authHeader.substring(7);
      const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

      if (error || !user) {
        return res.status(401).json({ message: "Invalid token" });
      }

      const { id, email, firstName, lastName, profileImageUrl } = req.body;

      if (id !== user.id) {
        return res.status(403).json({ message: "User ID mismatch" });
      }

      await storage.upsertUser({
        id,
        email: email || user.email,
        firstName,
        lastName,
        profileImageUrl,
      });

      res.json({ success: true });
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
