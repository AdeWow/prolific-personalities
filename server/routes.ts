import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertQuizResultSchema, insertEmailCaptureSchema } from "@shared/schema";
import { toolsData } from "./tools-data";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Save quiz results
  app.post("/api/quiz/results", async (req, res) => {
    try {
      const validatedData = insertQuizResultSchema.parse(req.body);
      const result = await storage.saveQuizResult(validatedData);
      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid quiz data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to save quiz results" });
      }
    }
  });

  // Get quiz results by session ID
  app.get("/api/quiz/results/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const result = await storage.getQuizResultBySessionId(sessionId);
      
      if (!result) {
        res.status(404).json({ message: "Quiz results not found" });
        return;
      }
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve quiz results" });
    }
  });

  // Get all tools
  app.get("/api/tools", async (req, res) => {
    try {
      const tools = await storage.getTools();
      res.json(tools);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve tools" });
    }
  });

  // Get tools by archetype
  app.get("/api/tools/archetype/:archetype", async (req, res) => {
    try {
      const { archetype } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const tools = await storage.getToolsByArchetype(archetype, limit);
      res.json(tools);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve tools" });
    }
  });

  // Seed tools database (one-time operation)
  app.post("/api/tools/seed", async (req, res) => {
    try {
      // Check if tools already exist
      const existingTools = await storage.getTools();
      if (existingTools.length > 0) {
        res.json({ message: "Tools already seeded", count: existingTools.length });
        return;
      }

      // Seed tools
      const seededTools = [];
      for (const toolData of toolsData) {
        const tool = await storage.createTool(toolData);
        seededTools.push(tool);
      }

      res.json({ message: "Tools seeded successfully", count: seededTools.length });
    } catch (error) {
      console.error("Error seeding tools:", error);
      res.status(500).json({ message: "Failed to seed tools" });
    }
  });

  // Save email capture
  app.post("/api/email-capture", async (req, res) => {
    try {
      const validatedData = insertEmailCaptureSchema.parse(req.body);
      const capture = await storage.saveEmailCapture(validatedData);
      res.json(capture);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid email data", errors: error.errors });
      } else {
        console.error("Error saving email capture:", error);
        res.status(500).json({ message: "Failed to save email" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
