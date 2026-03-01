import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  if (process.env.NODE_ENV === "development") {
    console.warn("⚠️  DATABASE_URL not set — database features will be unavailable in local dev");
  } else {
    throw new Error(
      "DATABASE_URL must be set. Did you forget to provision a database?",
    );
  }
}

export const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : null;

// Prevent unhandled 'error' events on idle pool clients from crashing the process
if (pool) {
  pool.on("error", (err) => {
    console.error("[db] Unexpected pool error:", err.message);
  });
}

export const db = pool ? drizzle({ client: pool, schema }) : null;