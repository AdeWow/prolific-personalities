import { users, quizResults, tools, emailCaptures, type User, type InsertUser, type QuizResult, type InsertQuizResult, type Tool, type InsertTool, type EmailCapture, type InsertEmailCapture, type ToolWithFitScore } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  saveQuizResult(result: InsertQuizResult): Promise<QuizResult>;
  getQuizResultBySessionId(sessionId: string): Promise<QuizResult | undefined>;
  getTools(): Promise<Tool[]>;
  getToolsByArchetype(archetype: string, limit?: number): Promise<ToolWithFitScore[]>;
  createTool(tool: InsertTool): Promise<Tool>;
  saveEmailCapture(capture: InsertEmailCapture): Promise<EmailCapture>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
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
}

export const storage = new DatabaseStorage();
