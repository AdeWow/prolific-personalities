import { users, quizResults, tools, emailCaptures, waitlist, feedback, orders, type User, type UpsertUser, type QuizResult, type InsertQuizResult, type Tool, type InsertTool, type EmailCapture, type InsertEmailCapture, type Waitlist, type InsertWaitlist, type Feedback, type InsertFeedback, type Order, type InsertOrder, type ToolWithFitScore } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User operations for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  // Quiz results
  saveQuizResult(result: InsertQuizResult): Promise<QuizResult>;
  getQuizResultBySessionId(sessionId: string): Promise<QuizResult | undefined>;
  getQuizResultsByUserId(userId: string): Promise<QuizResult[]>;
  linkQuizResultToUser(sessionId: string, userId: string): Promise<QuizResult | undefined>;
  // Tools
  getTools(): Promise<Tool[]>;
  getToolsByArchetype(archetype: string, limit?: number): Promise<ToolWithFitScore[]>;
  createTool(tool: InsertTool): Promise<Tool>;
  // Email captures
  saveEmailCapture(capture: InsertEmailCapture): Promise<EmailCapture>;
  // Waitlist
  saveWaitlistEntry(entry: InsertWaitlist): Promise<Waitlist>;
  // Feedback
  saveFeedback(entry: InsertFeedback): Promise<Feedback>;
  // Orders
  createOrder(order: InsertOrder): Promise<Order>;
  getOrderById(id: number): Promise<Order | undefined>;
  getOrdersByUserId(userId: string): Promise<Order[]>;
  getOrderBySessionId(sessionId: string): Promise<Order | undefined>;
  updateOrderStatus(id: number, status: string, stripePaymentIntentId?: string): Promise<Order | undefined>;
  claimOrdersBySession(sessionId: string, userId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations for Replit Auth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async saveQuizResult(insertResult: InsertQuizResult): Promise<QuizResult> {
    const [result] = await db
      .insert(quizResults)
      .values(insertResult)
      .returning();
    return result;
  }

  async getQuizResultBySessionId(sessionId: string): Promise<QuizResult | undefined> {
    const [result] = await db.select().from(quizResults).where(eq(quizResults.sessionId, sessionId));
    return result || undefined;
  }

  async getQuizResultsByUserId(userId: string): Promise<QuizResult[]> {
    const results = await db.select().from(quizResults).where(eq(quizResults.userId, userId));
    return results;
  }

  async linkQuizResultToUser(sessionId: string, userId: string): Promise<QuizResult | undefined> {
    // First check if the result exists and if it's already claimed by a different user
    const existing = await this.getQuizResultBySessionId(sessionId);
    
    if (!existing) {
      return undefined; // Result doesn't exist
    }
    
    // Prevent hijacking: Only allow claiming if result is unclaimed (userId is null)
    if (existing.userId !== null) {
      return undefined; // Already claimed by someone (possibly different user)
    }
    
    // Claim the result for this user
    const [result] = await db
      .update(quizResults)
      .set({ userId })
      .where(eq(quizResults.sessionId, sessionId))
      .returning();
    return result || undefined;
  }

  async getTools(): Promise<Tool[]> {
    const allTools = await db.select().from(tools);
    return allTools;
  }

  async getToolsByArchetype(archetype: string, limit: number = 10): Promise<ToolWithFitScore[]> {
    const allTools = await db.select().from(tools);
    
    // Sort tools by archetype fit score and return top N
    const sortedTools = allTools
      .map(tool => {
        const archetypeFit = tool.archetypeFit as any;
        const fitScore = archetypeFit[archetype] || 0;
        return { ...tool, fitScore };
      })
      .sort((a, b) => b.fitScore - a.fitScore)
      .slice(0, limit);
    
    return sortedTools;
  }

  async createTool(insertTool: InsertTool): Promise<Tool> {
    const [tool] = await db
      .insert(tools)
      .values(insertTool)
      .onConflictDoUpdate({
        target: tools.toolId,
        set: {
          name: insertTool.name,
          tagline: insertTool.tagline,
          description: insertTool.description,
          logo: insertTool.logo,
          website: insertTool.website,
          category: insertTool.category,
          archetypeFit: insertTool.archetypeFit,
          pricing: insertTool.pricing,
          learningCurve: insertTool.learningCurve,
          platforms: insertTool.platforms,
          pros: insertTool.pros,
          cons: insertTool.cons,
          affiliateLink: insertTool.affiliateLink,
          directLink: insertTool.directLink,
          tags: insertTool.tags,
          bestFor: insertTool.bestFor,
          notIdealFor: insertTool.notIdealFor,
        }
      })
      .returning();
    return tool;
  }

  async saveEmailCapture(insertCapture: InsertEmailCapture): Promise<EmailCapture> {
    const [capture] = await db
      .insert(emailCaptures)
      .values(insertCapture)
      .returning();
    return capture;
  }

  async saveWaitlistEntry(insertEntry: InsertWaitlist): Promise<Waitlist> {
    const [entry] = await db
      .insert(waitlist)
      .values(insertEntry)
      .returning();
    return entry;
  }

  async saveFeedback(insertFeedback: InsertFeedback): Promise<Feedback> {
    const [feedbackEntry] = await db
      .insert(feedback)
      .values(insertFeedback)
      .returning();
    return feedbackEntry;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db
      .insert(orders)
      .values(insertOrder)
      .returning();
    return order;
  }

  async getOrderById(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    const userOrders = await db.select().from(orders).where(eq(orders.userId, userId));
    return userOrders;
  }

  async getOrderBySessionId(sessionId: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.sessionId, sessionId));
    return order || undefined;
  }

  async updateOrderStatus(id: number, status: string, stripePaymentIntentId?: string): Promise<Order | undefined> {
    const updateData: any = { 
      status,
      completedAt: status === 'completed' ? new Date() : undefined
    };
    
    if (stripePaymentIntentId) {
      updateData.stripePaymentIntentId = stripePaymentIntentId;
    }
    
    const [order] = await db
      .update(orders)
      .set(updateData)
      .where(eq(orders.id, id))
      .returning();
    return order || undefined;
  }

  async claimOrdersBySession(sessionId: string, userId: string): Promise<void> {
    // Update all orders for this session to be owned by the user
    await db
      .update(orders)
      .set({ userId })
      .where(eq(orders.sessionId, sessionId));
  }
}

export const storage = new DatabaseStorage();
