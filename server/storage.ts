import { users, quizResults, tools, emailCaptures, checkoutAttempts, unsubscribeFeedback, waitlist, feedback, orders, playbookProgress, actionPlanProgress, toolTracking, playbookNotes, chatConversations, chatMessages, chatUsage, type User, type UpsertUser, type QuizResult, type InsertQuizResult, type Tool, type InsertTool, type EmailCapture, type InsertEmailCapture, type CheckoutAttempt, type InsertCheckoutAttempt, type UnsubscribeFeedback, type InsertUnsubscribeFeedback, type Waitlist, type InsertWaitlist, type Feedback, type InsertFeedback, type Order, type InsertOrder, type ToolWithFitScore, type PlaybookProgress, type InsertPlaybookProgress, type ActionPlanProgress, type InsertActionPlanProgress, type ToolTracking, type InsertToolTracking, type PlaybookNotes, type InsertPlaybookNotes, type ChatConversation, type InsertChatConversation, type ChatMessage, type InsertChatMessage, type ChatUsage, type InsertChatUsage } from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";

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
  getEmailCaptureByEmail(email: string): Promise<EmailCapture | undefined>;
  updateEmailCaptureWelcomeSent(id: number): Promise<void>;
  unsubscribeEmail(email: string): Promise<void>;
  // Checkout attempts (for abandoned cart)
  createCheckoutAttempt(attempt: InsertCheckoutAttempt): Promise<CheckoutAttempt>;
  markCheckoutCompleted(sessionId: string, archetype: string): Promise<void>;
  getAbandonedCheckouts(): Promise<CheckoutAttempt[]>;
  markAbandonedEmailSent(id: number): Promise<void>;
  // Unsubscribe feedback
  saveUnsubscribeFeedback(feedback: InsertUnsubscribeFeedback): Promise<UnsubscribeFeedback>;
  // Waitlist
  saveWaitlistEntry(entry: InsertWaitlist): Promise<Waitlist>;
  // Feedback
  saveFeedback(entry: InsertFeedback): Promise<Feedback>;
  // Orders
  createOrder(order: InsertOrder): Promise<Order>;
  getOrderById(id: number): Promise<Order | undefined>;
  getOrdersByUserId(userId: string): Promise<Order[]>;
  getOrderBySessionId(sessionId: string): Promise<Order | undefined>;
  updateOrderStatus(id: number, status: string, stripePaymentIntentId?: string, customerEmail?: string): Promise<Order | undefined>;
  claimOrdersBySession(sessionId: string, userId: string): Promise<void>;
  hasUserPurchasedPlaybook(userId: string, archetype: string): Promise<boolean>;
  // Playbook Progress
  getPlaybookProgress(userId: string, archetype: string): Promise<PlaybookProgress[]>;
  updateChapterProgress(userId: string, archetype: string, chapterId: string, completed: boolean): Promise<PlaybookProgress>;
  // Action Plan Progress
  getActionPlanProgress(userId: string, archetype: string): Promise<ActionPlanProgress[]>;
  updateActionPlanTask(userId: string, archetype: string, dayNumber: number, taskId: string, completed: boolean): Promise<ActionPlanProgress>;
  // Tool Tracking
  getToolTracking(userId: string, archetype: string): Promise<ToolTracking[]>;
  updateToolTracking(userId: string, archetype: string, toolId: string, status: string, notes?: string): Promise<ToolTracking>;
  // Playbook Notes
  getPlaybookNotes(userId: string, archetype: string, sectionId?: string): Promise<PlaybookNotes[]>;
  savePlaybookNote(userId: string, archetype: string, sectionId: string, content: string): Promise<PlaybookNotes>;
  updatePlaybookNote(id: number, content: string): Promise<PlaybookNotes | undefined>;
  deletePlaybookNote(id: number): Promise<void>;
  // Chat
  createConversation(data: InsertChatConversation): Promise<ChatConversation>;
  getConversation(id: number): Promise<ChatConversation | undefined>;
  getConversationsByUser(userId: string): Promise<ChatConversation[]>;
  getConversationsBySession(sessionId: string): Promise<ChatConversation[]>;
  updateConversationTitle(id: number, title: string): Promise<ChatConversation | undefined>;
  deleteConversation(id: number): Promise<void>;
  // Chat Messages
  createMessage(data: InsertChatMessage): Promise<ChatMessage>;
  getMessagesByConversation(conversationId: number): Promise<ChatMessage[]>;
  updateMessageFeedback(id: number, feedback: string, reason?: string): Promise<ChatMessage | undefined>;
  // Chat Usage (rate limiting)
  getChatUsage(userId: string | null, sessionId: string | null, date: string): Promise<ChatUsage | undefined>;
  incrementChatUsage(userId: string | null, sessionId: string | null, date: string): Promise<ChatUsage>;
  isPremiumUser(userId: string): Promise<boolean>;
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

  async getEmailCaptureByEmail(email: string): Promise<EmailCapture | undefined> {
    const [capture] = await db.select().from(emailCaptures).where(eq(emailCaptures.email, email));
    return capture || undefined;
  }

  async updateEmailCaptureWelcomeSent(id: number): Promise<void> {
    await db
      .update(emailCaptures)
      .set({ welcomeEmailSent: 1 })
      .where(eq(emailCaptures.id, id));
  }

  async unsubscribeEmail(email: string): Promise<void> {
    await db
      .update(emailCaptures)
      .set({ subscribed: 0 })
      .where(eq(emailCaptures.email, email));
  }

  async createCheckoutAttempt(insertAttempt: InsertCheckoutAttempt): Promise<CheckoutAttempt> {
    const [attempt] = await db
      .insert(checkoutAttempts)
      .values(insertAttempt)
      .returning();
    return attempt;
  }

  async markCheckoutCompleted(sessionId: string, archetype: string): Promise<void> {
    await db
      .update(checkoutAttempts)
      .set({ completedAt: new Date() })
      .where(
        and(
          eq(checkoutAttempts.sessionId, sessionId),
          eq(checkoutAttempts.archetype, archetype)
        )
      );
  }

  async getAbandonedCheckouts(): Promise<CheckoutAttempt[]> {
    // Get checkouts that are older than 1 hour, not completed, and email not sent
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const allAttempts = await db.select().from(checkoutAttempts);
    
    return allAttempts.filter(attempt => 
      attempt.completedAt === null && 
      attempt.abandonedEmailSent === 0 &&
      attempt.email !== null &&
      new Date(attempt.startedAt) < oneHourAgo
    );
  }

  async markAbandonedEmailSent(id: number): Promise<void> {
    await db
      .update(checkoutAttempts)
      .set({ abandonedEmailSent: 1 })
      .where(eq(checkoutAttempts.id, id));
  }

  async saveUnsubscribeFeedback(insertFeedback: InsertUnsubscribeFeedback): Promise<UnsubscribeFeedback> {
    const [feedbackEntry] = await db
      .insert(unsubscribeFeedback)
      .values(insertFeedback)
      .returning();
    return feedbackEntry;
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

  async updateOrderStatus(id: number, status: string, stripePaymentIntentId?: string, customerEmail?: string): Promise<Order | undefined> {
    const updateData: any = { 
      status,
      completedAt: status === 'completed' ? new Date() : undefined
    };
    
    if (stripePaymentIntentId) {
      updateData.stripePaymentIntentId = stripePaymentIntentId;
    }
    
    if (customerEmail) {
      updateData.customerEmail = customerEmail;
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

  async hasUserPurchasedPlaybook(userId: string, archetype: string): Promise<boolean> {
    const [order] = await db
      .select()
      .from(orders)
      .where(
        and(
          eq(orders.userId, userId),
          eq(orders.archetype, archetype),
          eq(orders.status, 'completed')
        )
      );
    return !!order;
  }

  // Playbook Progress Methods
  async getPlaybookProgress(userId: string, archetype: string): Promise<PlaybookProgress[]> {
    const progress = await db
      .select()
      .from(playbookProgress)
      .where(
        and(
          eq(playbookProgress.userId, userId),
          eq(playbookProgress.archetype, archetype)
        )
      );
    return progress;
  }

  async updateChapterProgress(userId: string, archetype: string, chapterId: string, completed: boolean): Promise<PlaybookProgress> {
    const [progress] = await db
      .insert(playbookProgress)
      .values({
        userId,
        archetype,
        chapterId,
        completed: completed ? 1 : 0,
        completedAt: completed ? new Date() : null,
      })
      .onConflictDoUpdate({
        target: [playbookProgress.userId, playbookProgress.archetype, playbookProgress.chapterId],
        set: {
          completed: completed ? 1 : 0,
          completedAt: completed ? new Date() : null,
          updatedAt: new Date(),
        },
      })
      .returning();
    return progress;
  }

  // Action Plan Progress Methods
  async getActionPlanProgress(userId: string, archetype: string): Promise<ActionPlanProgress[]> {
    const progress = await db
      .select()
      .from(actionPlanProgress)
      .where(
        and(
          eq(actionPlanProgress.userId, userId),
          eq(actionPlanProgress.archetype, archetype)
        )
      );
    return progress;
  }

  async updateActionPlanTask(userId: string, archetype: string, dayNumber: number, taskId: string, completed: boolean): Promise<ActionPlanProgress> {
    const [progress] = await db
      .insert(actionPlanProgress)
      .values({
        userId,
        archetype,
        dayNumber,
        taskId,
        completed: completed ? 1 : 0,
        completedAt: completed ? new Date() : null,
      })
      .onConflictDoUpdate({
        target: [actionPlanProgress.userId, actionPlanProgress.archetype, actionPlanProgress.dayNumber, actionPlanProgress.taskId],
        set: {
          completed: completed ? 1 : 0,
          completedAt: completed ? new Date() : null,
          updatedAt: new Date(),
        },
      })
      .returning();
    return progress;
  }

  // Tool Tracking Methods
  async getToolTracking(userId: string, archetype: string): Promise<ToolTracking[]> {
    const tracking = await db
      .select()
      .from(toolTracking)
      .where(
        and(
          eq(toolTracking.userId, userId),
          eq(toolTracking.archetype, archetype)
        )
      );
    return tracking;
  }

  async updateToolTracking(userId: string, archetype: string, toolId: string, status: string, notes?: string): Promise<ToolTracking> {
    const [tracking] = await db
      .insert(toolTracking)
      .values({
        userId,
        archetype,
        toolId,
        status,
        notes: notes || null,
        startedAt: status !== 'not_started' ? new Date() : null,
      })
      .onConflictDoUpdate({
        target: [toolTracking.userId, toolTracking.archetype, toolTracking.toolId],
        set: {
          status,
          notes: notes || null,
          startedAt: status !== 'not_started' ? new Date() : null,
          updatedAt: new Date(),
        },
      })
      .returning();
    return tracking;
  }

  // Playbook Notes Methods
  async getPlaybookNotes(userId: string, archetype: string, sectionId?: string): Promise<PlaybookNotes[]> {
    const conditions = [
      eq(playbookNotes.userId, userId),
      eq(playbookNotes.archetype, archetype),
    ];
    
    if (sectionId) {
      conditions.push(eq(playbookNotes.sectionId, sectionId));
    }
    
    const notes = await db
      .select()
      .from(playbookNotes)
      .where(and(...conditions));
    return notes;
  }

  async savePlaybookNote(userId: string, archetype: string, sectionId: string, content: string): Promise<PlaybookNotes> {
    const [note] = await db
      .insert(playbookNotes)
      .values({
        userId,
        archetype,
        sectionId,
        content,
      })
      .returning();
    return note;
  }

  async updatePlaybookNote(id: number, content: string): Promise<PlaybookNotes | undefined> {
    const [note] = await db
      .update(playbookNotes)
      .set({ content, updatedAt: new Date() })
      .where(eq(playbookNotes.id, id))
      .returning();
    return note || undefined;
  }

  async deletePlaybookNote(id: number): Promise<void> {
    await db
      .delete(playbookNotes)
      .where(eq(playbookNotes.id, id));
  }

  // Chat Conversation Methods
  async createConversation(data: InsertChatConversation): Promise<ChatConversation> {
    const [conversation] = await db
      .insert(chatConversations)
      .values(data)
      .returning();
    return conversation;
  }

  async getConversation(id: number): Promise<ChatConversation | undefined> {
    const [conversation] = await db
      .select()
      .from(chatConversations)
      .where(eq(chatConversations.id, id));
    return conversation || undefined;
  }

  async getConversationsByUser(userId: string): Promise<ChatConversation[]> {
    const conversations = await db
      .select()
      .from(chatConversations)
      .where(eq(chatConversations.userId, userId))
      .orderBy(desc(chatConversations.updatedAt));
    return conversations;
  }

  async getConversationsBySession(sessionId: string): Promise<ChatConversation[]> {
    const conversations = await db
      .select()
      .from(chatConversations)
      .where(eq(chatConversations.sessionId, sessionId))
      .orderBy(desc(chatConversations.updatedAt));
    return conversations;
  }

  async updateConversationTitle(id: number, title: string): Promise<ChatConversation | undefined> {
    const [conversation] = await db
      .update(chatConversations)
      .set({ title, updatedAt: new Date() })
      .where(eq(chatConversations.id, id))
      .returning();
    return conversation || undefined;
  }

  async deleteConversation(id: number): Promise<void> {
    await db
      .delete(chatConversations)
      .where(eq(chatConversations.id, id));
  }

  // Chat Message Methods
  async createMessage(data: InsertChatMessage): Promise<ChatMessage> {
    const [message] = await db
      .insert(chatMessages)
      .values(data)
      .returning();
    
    // Update conversation's updatedAt timestamp
    await db
      .update(chatConversations)
      .set({ updatedAt: new Date() })
      .where(eq(chatConversations.id, data.conversationId));
    
    return message;
  }

  async getMessagesByConversation(conversationId: number): Promise<ChatMessage[]> {
    const messages = await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.conversationId, conversationId))
      .orderBy(chatMessages.createdAt);
    return messages;
  }

  async updateMessageFeedback(id: number, feedback: string, reason?: string): Promise<ChatMessage | undefined> {
    const [message] = await db
      .update(chatMessages)
      .set({ feedback, feedbackReason: reason || null })
      .where(eq(chatMessages.id, id))
      .returning();
    return message || undefined;
  }

  // Chat Usage Methods (Rate Limiting)
  async getChatUsage(userId: string | null, sessionId: string | null, date: string): Promise<ChatUsage | undefined> {
    if (userId) {
      const [usage] = await db
        .select()
        .from(chatUsage)
        .where(and(eq(chatUsage.userId, userId), eq(chatUsage.date, date)));
      return usage || undefined;
    } else if (sessionId) {
      const [usage] = await db
        .select()
        .from(chatUsage)
        .where(and(eq(chatUsage.sessionId, sessionId), eq(chatUsage.date, date)));
      return usage || undefined;
    }
    return undefined;
  }

  async incrementChatUsage(userId: string | null, sessionId: string | null, date: string): Promise<ChatUsage> {
    const existing = await this.getChatUsage(userId, sessionId, date);
    
    if (existing) {
      const [usage] = await db
        .update(chatUsage)
        .set({ 
          messageCount: existing.messageCount + 1,
          updatedAt: new Date()
        })
        .where(eq(chatUsage.id, existing.id))
        .returning();
      return usage;
    } else {
      const [usage] = await db
        .insert(chatUsage)
        .values({
          userId,
          sessionId,
          date,
          messageCount: 1,
        })
        .returning();
      return usage;
    }
  }

  async isPremiumUser(userId: string): Promise<boolean> {
    // Check if user has any completed orders for the "Productivity Partner" tier
    // For now, check if they have ANY completed order (will be enhanced with tier tracking later)
    const [order] = await db
      .select()
      .from(orders)
      .where(
        and(
          eq(orders.userId, userId),
          eq(orders.status, 'completed')
        )
      );
    return !!order;
  }
}

export const storage = new DatabaseStorage();
