import { pgTable, text, serial, integer, jsonb, timestamp, varchar, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table - required for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table - updated for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const quizResults = pgTable("quiz_results", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().unique(),
  userId: varchar("user_id").references(() => users.id),
  answers: jsonb("answers").notNull(),
  scores: jsonb("scores").notNull(),
  archetype: text("archetype").notNull(),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
});

export const insertQuizResultSchema = createInsertSchema(quizResults).omit({
  id: true,
  completedAt: true,
});

export type UpsertUser = typeof users.$inferInsert;
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
  archetype: text("archetype"),
  subscribed: integer("subscribed").notNull().default(1), // 1 = subscribed, 0 = unsubscribed
  welcomeEmailSent: integer("welcome_email_sent").notNull().default(0), // 0 = not sent, 1 = sent
  capturedAt: timestamp("captured_at").defaultNow().notNull(),
});

export const checkoutAttempts = pgTable("checkout_attempts", {
  id: serial("id").primaryKey(),
  email: text("email"),
  sessionId: text("session_id").notNull(),
  archetype: text("archetype").notNull(),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  abandonedEmailSent: integer("abandoned_email_sent").notNull().default(0), // 0 = not sent, 1 = sent
});

export const unsubscribeFeedback = pgTable("unsubscribe_feedback", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  reason: text("reason").notNull(), // too_many, not_relevant, already_purchased, not_interested, never_signed_up, other
  reasonOther: text("reason_other"),
  rating: text("rating"), // very_helpful, somewhat_helpful, neutral, not_very_helpful, not_helpful
  feedbackText: text("feedback_text"),
  unsubscribedAt: timestamp("unsubscribed_at").defaultNow().notNull(),
});

export const waitlist = pgTable("waitlist", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  sessionId: text("session_id").notNull(),
  capturedAt: timestamp("captured_at").defaultNow().notNull(),
});

export const feedback = pgTable("feedback", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email"),
  message: text("message").notNull(),
  type: text("type").notNull(), // 'feedback', 'recommendation', 'feature_request'
  sessionId: text("session_id").notNull(),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  sessionId: text("session_id").notNull(),
  archetype: text("archetype").notNull(),
  amount: integer("amount").notNull(), // amount in cents
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  stripeSessionId: text("stripe_session_id"),
  customerEmail: text("customer_email"),
  status: text("status").notNull().default("pending"), // pending, completed, failed
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export const playbookProgress = pgTable("playbook_progress", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  archetype: text("archetype").notNull(),
  chapterId: text("chapter_id").notNull(),
  completed: integer("completed").notNull().default(0), // 0 = not started, 1 = completed
  completedAt: timestamp("completed_at"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const actionPlanProgress = pgTable("action_plan_progress", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  archetype: text("archetype").notNull(),
  dayNumber: integer("day_number").notNull(), // 1-30
  taskId: text("task_id").notNull(),
  completed: integer("completed").notNull().default(0), // 0 = not done, 1 = done
  completedAt: timestamp("completed_at"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const toolTracking = pgTable("tool_tracking", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  archetype: text("archetype").notNull(),
  toolId: text("tool_id").notNull(),
  status: text("status").notNull().default("not_started"), // not_started, testing, using_daily
  notes: text("notes"),
  startedAt: timestamp("started_at"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const playbookNotes = pgTable("playbook_notes", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  archetype: text("archetype").notNull(),
  sectionId: text("section_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertToolSchema = createInsertSchema(tools).omit({
  id: true,
});

export const insertEmailCaptureSchema = createInsertSchema(emailCaptures).omit({
  id: true,
  capturedAt: true,
  welcomeEmailSent: true,
});

export const insertCheckoutAttemptSchema = createInsertSchema(checkoutAttempts).omit({
  id: true,
  startedAt: true,
  completedAt: true,
  abandonedEmailSent: true,
});

export const insertUnsubscribeFeedbackSchema = createInsertSchema(unsubscribeFeedback).omit({
  id: true,
  unsubscribedAt: true,
});

export const insertWaitlistSchema = createInsertSchema(waitlist).omit({
  id: true,
  capturedAt: true,
});

export const insertFeedbackSchema = createInsertSchema(feedback).omit({
  id: true,
  submittedAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const insertPlaybookProgressSchema = createInsertSchema(playbookProgress).omit({
  id: true,
  completedAt: true,
  updatedAt: true,
});

export const insertActionPlanProgressSchema = createInsertSchema(actionPlanProgress).omit({
  id: true,
  completedAt: true,
  updatedAt: true,
});

export const insertToolTrackingSchema = createInsertSchema(toolTracking).omit({
  id: true,
  startedAt: true,
  updatedAt: true,
});

export const insertPlaybookNotesSchema = createInsertSchema(playbookNotes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertTool = z.infer<typeof insertToolSchema>;
export type Tool = typeof tools.$inferSelect;
export type InsertEmailCapture = z.infer<typeof insertEmailCaptureSchema>;
export type EmailCapture = typeof emailCaptures.$inferSelect;
export type InsertCheckoutAttempt = z.infer<typeof insertCheckoutAttemptSchema>;
export type CheckoutAttempt = typeof checkoutAttempts.$inferSelect;
export type InsertUnsubscribeFeedback = z.infer<typeof insertUnsubscribeFeedbackSchema>;
export type UnsubscribeFeedback = typeof unsubscribeFeedback.$inferSelect;
export type InsertWaitlist = z.infer<typeof insertWaitlistSchema>;
export type Waitlist = typeof waitlist.$inferSelect;
export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;
export type Feedback = typeof feedback.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertPlaybookProgress = z.infer<typeof insertPlaybookProgressSchema>;
export type PlaybookProgress = typeof playbookProgress.$inferSelect;
export type InsertActionPlanProgress = z.infer<typeof insertActionPlanProgressSchema>;
export type ActionPlanProgress = typeof actionPlanProgress.$inferSelect;
export type InsertToolTracking = z.infer<typeof insertToolTrackingSchema>;
export type ToolTracking = typeof toolTracking.$inferSelect;
export type InsertPlaybookNotes = z.infer<typeof insertPlaybookNotesSchema>;
export type PlaybookNotes = typeof playbookNotes.$inferSelect;

// Type for tools with archetype fit score
export type ToolWithFitScore = Tool & { fitScore: number };

// Export chat models
export * from "./models/chat";
