import { pgTable, serial, integer, text, timestamp, varchar, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

export const chatConversations = pgTable("chat_conversations", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id"),
  sessionId: text("session_id"),
  archetype: text("archetype"),
  title: text("title").notNull().default("New Conversation"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
  index("idx_chat_conversations_user").on(table.userId),
  index("idx_chat_conversations_session").on(table.sessionId),
]);

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull().references(() => chatConversations.id, { onDelete: "cascade" }),
  userId: varchar("user_id"),
  role: text("role").notNull(),
  content: text("content").notNull(),
  tokensUsed: integer("tokens_used"),
  feedback: text("feedback"),
  feedbackReason: text("feedback_reason"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
  index("idx_chat_messages_conversation").on(table.conversationId),
  index("idx_chat_messages_user").on(table.userId),
]);

export const chatUsage = pgTable("chat_usage", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id"),
  sessionId: text("session_id"),
  messageCount: integer("message_count").notNull().default(0),
  date: text("date").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
  index("idx_chat_usage_user_date").on(table.userId, table.date),
  index("idx_chat_usage_session_date").on(table.sessionId, table.date),
]);

export const insertChatConversationSchema = createInsertSchema(chatConversations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
});

export const insertChatUsageSchema = createInsertSchema(chatUsage).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type ChatConversation = typeof chatConversations.$inferSelect;
export type InsertChatConversation = z.infer<typeof insertChatConversationSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatUsage = typeof chatUsage.$inferSelect;
export type InsertChatUsage = z.infer<typeof insertChatUsageSchema>;

export const conversations = chatConversations;
export const messages = chatMessages;

export const insertConversationSchema = insertChatConversationSchema;
export const insertMessageSchema = insertChatMessageSchema;
export type Conversation = ChatConversation;
export type InsertConversation = InsertChatConversation;
export type Message = ChatMessage;
export type InsertMessage = InsertChatMessage;
