import { createClient } from "@supabase/supabase-js";
import { RequestHandler } from "express";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export const supabaseAdmin = supabase;

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
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: "Auth failed" });
  }
};
