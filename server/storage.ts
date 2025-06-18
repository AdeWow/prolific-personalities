import { users, quizResults, type User, type InsertUser, type QuizResult, type InsertQuizResult } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  saveQuizResult(result: InsertQuizResult): Promise<QuizResult>;
  getQuizResultBySessionId(sessionId: string): Promise<QuizResult | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private quizResults: Map<string, QuizResult>;
  private currentUserId: number;
  private currentQuizId: number;

  constructor() {
    this.users = new Map();
    this.quizResults = new Map();
    this.currentUserId = 1;
    this.currentQuizId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async saveQuizResult(insertResult: InsertQuizResult): Promise<QuizResult> {
    const id = this.currentQuizId++;
    const result: QuizResult = {
      ...insertResult,
      id,
      completedAt: new Date(),
    };
    this.quizResults.set(insertResult.sessionId, result);
    return result;
  }

  async getQuizResultBySessionId(sessionId: string): Promise<QuizResult | undefined> {
    return this.quizResults.get(sessionId);
  }
}

export const storage = new MemStorage();
