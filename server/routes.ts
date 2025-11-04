import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertQuizResultSchema, insertEmailCaptureSchema } from "@shared/schema";
import { toolsData } from "./tools-data";
import { z } from "zod";
import rateLimit from "express-rate-limit";

export async function registerRoutes(app: Express): Promise<Server> {
  // Rate limiters for different types of endpoints
  
  // General API rate limiter - 100 requests per 15 minutes
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: { message: "Too many requests, please try again later" },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Strict limiter for write operations - 20 requests per 15 minutes
  const writeLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20,
    message: { message: "Too many submissions, please slow down" },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Email capture limiter - 5 requests per hour to prevent spam
  const emailLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5,
    message: { message: "Too many email submissions, please try again later" },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Apply general rate limiting to all API routes
  app.use("/api/", apiLimiter);

  // Setup Replit Auth
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Link quiz result to logged-in user
  app.post("/api/quiz/claim/:sessionId", writeLimiter, isAuthenticated, async (req: any, res) => {
    try {
      const { sessionId } = req.params;
      const userId = req.user.claims.sub;
      
      // Check if result exists and is already claimed
      const existing = await storage.getQuizResultBySessionId(sessionId);
      if (!existing) {
        res.status(404).json({ message: "Quiz result not found" });
        return;
      }
      
      if (existing.userId !== null && existing.userId !== userId) {
        res.status(403).json({ message: "This quiz result is already claimed by another user" });
        return;
      }
      
      // If already claimed by this user, just return it
      if (existing.userId === userId) {
        res.json(existing);
        return;
      }
      
      // Otherwise, claim it
      const result = await storage.linkQuizResultToUser(sessionId, userId);
      
      if (!result) {
        res.status(500).json({ message: "Failed to claim quiz result" });
        return;
      }
      
      res.json(result);
    } catch (error) {
      console.error("Error linking quiz result:", error);
      res.status(500).json({ message: "Failed to link quiz result" });
    }
  });

  // Get all quiz results for logged-in user
  app.get("/api/dashboard/results", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const results = await storage.getQuizResultsByUserId(userId);
      res.json(results);
    } catch (error) {
      console.error("Error fetching user results:", error);
      res.status(500).json({ message: "Failed to retrieve results" });
    }
  });

  // Save quiz results
  app.post("/api/quiz/results", writeLimiter, async (req, res) => {
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
  app.post("/api/tools/seed", writeLimiter, async (req, res) => {
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
  app.post("/api/email-capture", emailLimiter, async (req, res) => {
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

  // Sitemap route
  app.get("/sitemap.xml", async (req, res) => {
    try {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const currentDate = new Date().toISOString().split('T')[0];
      
      // Static pages with their priorities
      const staticPages = [
        { url: '', changefreq: 'daily', priority: '1.0' }, // Homepage
        { url: '/quiz', changefreq: 'weekly', priority: '0.9' },
        { url: '/archetypes', changefreq: 'monthly', priority: '0.8' },
        { url: '/pricing', changefreq: 'weekly', priority: '0.8' },
        { url: '/blog', changefreq: 'weekly', priority: '0.7' },
        { url: '/about', changefreq: 'monthly', priority: '0.6' },
        { url: '/science', changefreq: 'monthly', priority: '0.6' },
        { url: '/faq', changefreq: 'monthly', priority: '0.5' },
      ];

      // Blog posts (we'll import the data here)
      const blogPosts = [
        { slug: '6-productivity-archetypes-explained' },
      ];

      let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

      // Add static pages
      for (const page of staticPages) {
        sitemap += `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
      }

      // Add blog posts
      for (const post of blogPosts) {
        sitemap += `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
      }

      sitemap += `
</urlset>`;

      res.header('Content-Type', 'application/xml');
      res.send(sitemap);
    } catch (error) {
      console.error("Error generating sitemap:", error);
      res.status(500).send('Error generating sitemap');
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
