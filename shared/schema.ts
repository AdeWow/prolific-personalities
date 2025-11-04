import { pgTable, text, serial, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const quizResults = pgTable("quiz_results", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().unique(),
  answers: jsonb("answers").notNull(),
  scores: jsonb("scores").notNull(),
  archetype: text("archetype").notNull(),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertQuizResultSchema = createInsertSchema(quizResults).omit({
  id: true,
  completedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertQuizResult = z.infer<typeof insertQuizResultSchema>;
export type QuizResult = typeof quizResults.$inferSelect;

export type QuizAnswers = Record<string, string | number>;
export type QuizScores = {
  structure: number;
  motivation: number;
  cognitive: number;
  task: number;
};

export type ToolArchetypeFit = {
  'structured-achiever': number;
  'chaotic-creative': number;
  'anxious-perfectionist': number;
  'novelty-seeker': number;
  'strategic-planner': number;
  'flexible-improviser': number;
};

export type ToolPricing = {
  free: boolean;
  freemium: boolean;
  startingPrice: number | null;
  currency: string;
  billingPeriod: 'monthly' | 'annual' | 'one-time' | null;
};

export const tools = pgTable("tools", {
  id: serial("id").primaryKey(),
  toolId: text("tool_id").notNull().unique(),
  name: text("name").notNull(),
  tagline: text("tagline").notNull(),
  description: text("description").notNull(),
  logo: text("logo").notNull(),
  website: text("website").notNull(),
  category: text("category").notNull(),
  archetypeFit: jsonb("archetype_fit").$type<ToolArchetypeFit>().notNull(),
  pricing: jsonb("pricing").$type<ToolPricing>().notNull(),
  learningCurve: text("learning_curve").notNull(),
  platforms: text("platforms").array().notNull(),
  pros: text("pros").array().notNull(),
  cons: text("cons").array().notNull(),
  affiliateLink: text("affiliate_link").notNull(),
  directLink: text("direct_link").notNull(),
  tags: text("tags").array().notNull(),
  bestFor: text("best_for").array().notNull(),
  notIdealFor: text("not_ideal_for").array().notNull(),
});

export const emailCaptures = pgTable("email_captures", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  sessionId: text("session_id").notNull(),
  capturedAt: timestamp("captured_at").defaultNow().notNull(),
});

export const insertToolSchema = createInsertSchema(tools).omit({
  id: true,
});

export const insertEmailCaptureSchema = createInsertSchema(emailCaptures).omit({
  id: true,
  capturedAt: true,
});

export type InsertTool = z.infer<typeof insertToolSchema>;
export type Tool = typeof tools.$inferSelect;
export type InsertEmailCapture = z.infer<typeof insertEmailCaptureSchema>;
export type EmailCapture = typeof emailCaptures.$inferSelect;

// Type for tools with archetype fit score
export type ToolWithFitScore = Tool & { fitScore: number };
