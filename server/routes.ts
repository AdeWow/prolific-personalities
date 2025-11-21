import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertQuizResultSchema, insertEmailCaptureSchema, insertWaitlistSchema, insertFeedbackSchema } from "@shared/schema";
import { toolsData } from "./tools-data";
import { z } from "zod";
import rateLimit from "express-rate-limit";
import Stripe from "stripe";
import express from "express";
import path from "path";
import fs from "fs";
import { getPremiumAssetForArchetype } from "./premiumAssets";
import { Resend } from "resend";
import { generateResultsEmail, generatePremiumPlaybookEmail } from "./emailTemplates";
import { getArchetypeInfo } from "./archetypeData";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-10-29.clover",
});

// Initialize Resend client for email sending
if (!process.env.RESEND_API_KEY) {
  console.warn('⚠️ RESEND_API_KEY not set - email sending will be disabled');
}

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Register Stripe webhook handler with raw body parser (must be called before express.json())
export function registerWebhookRoute(app: Express) {
  app.post(
    "/api/webhook/stripe",
    express.raw({ type: 'application/json' }),
    async (req, res) => {
      const sig = req.headers['stripe-signature'];

      if (!sig) {
        res.status(400).send('Missing stripe-signature header');
        return;
      }

      try {
        // Verify webhook signature if STRIPE_WEBHOOK_SECRET is set
        let event;
        if (process.env.STRIPE_WEBHOOK_SECRET) {
          event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
          );
        } else {
          // Development mode - parse the event without verification
          console.warn('⚠️ STRIPE_WEBHOOK_SECRET not set - webhook signature verification disabled (development only)');
          event = JSON.parse(req.body.toString());
        }

        if (event.type === 'checkout.session.completed') {
          const session = event.data.object as Stripe.Checkout.Session;
          const orderId = session.metadata?.orderId;
          const archetype = session.metadata?.archetype;
          const sessionId = session.metadata?.sessionId;
          const customerEmail = session.customer_details?.email;

          if (orderId) {
            // Update order status
            await storage.updateOrderStatus(
              parseInt(orderId),
              'completed',
              session.payment_intent as string
            );
            console.log(`✅ Order ${orderId} marked as completed via webhook`);

            // Send premium PDF email if we have customer email
            if (resend && customerEmail && archetype && sessionId) {
              try {
                // Get archetype info
                const archetypeInfo = getArchetypeInfo(archetype);
                if (!archetypeInfo) {
                  console.error('❌ Archetype info not found:', archetype);
                  return;
                }

                // Get PDF for archetype
                const pdfAsset = getPremiumAssetForArchetype(archetype);
                if (!pdfAsset) {
                  console.error('❌ PDF not found for archetype:', archetype);
                  return;
                }

                const pdfPath = path.join(process.cwd(), 'attached_assets', pdfAsset.pdfFilename);
                
                // Check if PDF exists
                if (!fs.existsSync(pdfPath)) {
                  console.error('❌ PDF file does not exist:', pdfPath);
                  return;
                }

                // Read PDF file
                const pdfBuffer = fs.readFileSync(pdfPath);
                const pdfBase64 = pdfBuffer.toString('base64');

                // Generate results URL - use environment variable or default
                const baseUrl = process.env.APP_URL || 
                  (process.env.NODE_ENV === 'production'
                    ? 'https://prolificpersonalities.com'
                    : 'http://localhost:5000');
                const resultsUrl = `${baseUrl}/results/${sessionId}`;

                // Generate email content
                const { subject, html } = generatePremiumPlaybookEmail({
                  recipientEmail: customerEmail,
                  archetype: archetypeInfo,
                  resultsUrl,
                });

                // Send email with PDF attachment
                const emailResponse = await resend.emails.send({
                  from: 'Prolific Personalities <support@prolificpersonalities.com>',
                  to: customerEmail,
                  subject,
                  html,
                  attachments: [
                    {
                      filename: pdfAsset.pdfFilename,
                      content: pdfBase64,
                    },
                  ],
                });

                if (emailResponse.error) {
                  console.error('❌ Error sending premium PDF email:', emailResponse.error);
                } else {
                  console.log(`✅ Premium PDF emailed to ${customerEmail}`);
                }
              } catch (emailError) {
                console.error('❌ Error in premium PDF email flow:', emailError);
              }
            } else {
              if (!resend) console.warn('⚠️ Resend not configured - skipping email');
              if (!customerEmail) console.warn('⚠️ No customer email - skipping email');
              if (!archetype) console.warn('⚠️ No archetype metadata - skipping email');
              if (!sessionId) console.warn('⚠️ No sessionId metadata - skipping email');
            }
          }
        }

        res.json({ received: true });
      } catch (err: any) {
        console.error('❌ Webhook error:', err.message);
        res.status(400).send(`Webhook Error: ${err.message}`);
      }
    }
  );
}

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

      // Also claim any orders associated with this session
      await storage.claimOrdersBySession(sessionId, userId);
      console.log(`✅ Claimed quiz session ${sessionId} and associated orders for user ${userId}`);
      
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

  // Save waitlist entry
  app.post("/api/waitlist", emailLimiter, async (req, res) => {
    try {
      const validatedData = insertWaitlistSchema.parse(req.body);
      const entry = await storage.saveWaitlistEntry(validatedData);
      res.json(entry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid waitlist data", errors: error.errors });
      } else {
        console.error("Error saving waitlist entry:", error);
        res.status(500).json({ message: "Failed to join waitlist" });
      }
    }
  });

  // Save feedback
  app.post("/api/feedback", writeLimiter, async (req, res) => {
    try {
      const validatedData = insertFeedbackSchema.parse(req.body);
      const feedbackEntry = await storage.saveFeedback(validatedData);
      res.json(feedbackEntry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid feedback data", errors: error.errors });
      } else {
        console.error("Error saving feedback:", error);
        res.status(500).json({ message: "Failed to submit feedback" });
      }
    }
  });

  // Email quiz results
  app.post("/api/email-results", emailLimiter, async (req, res) => {
    try {
      if (!resend) {
        res.status(503).json({ message: "Email service not configured" });
        return;
      }

      const { email, sessionId } = z.object({
        email: z.string().email(),
        sessionId: z.string(),
      }).parse(req.body);

      // Fetch quiz results
      const result = await storage.getQuizResultBySessionId(sessionId);
      
      if (!result) {
        res.status(404).json({ message: "Quiz results not found" });
        return;
      }

      // Find archetype data
      const archetypeInfo = getArchetypeInfo(result.archetype);
      
      if (!archetypeInfo) {
        res.status(404).json({ message: "Archetype data not found" });
        return;
      }

      // Generate results URL
      const baseUrl = process.env.NODE_ENV === 'production'
        ? 'https://prolificpersonalities.com'
        : `${req.protocol}://${req.get('host')}`;
      const resultsUrl = `${baseUrl}/results/${sessionId}`;

      // Generate email content
      const { subject, html } = generateResultsEmail({
        recipientEmail: email,
        archetype: archetypeInfo,
        scores: result.scores as any,
        resultsUrl,
      });

      // Send email using Resend
      const emailResponse = await resend.emails.send({
        from: 'Prolific Personalities <support@prolificpersonalities.com>',
        to: email,
        subject,
        html,
      });

      if (emailResponse.error) {
        console.error('Error sending email:', emailResponse.error);
        res.status(500).json({ message: "Failed to send email" });
        return;
      }

      console.log(`✅ Quiz results emailed to ${email}`);
      res.json({ success: true });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid request data", errors: error.errors });
      } else {
        console.error("Error sending email:", error);
        res.status(500).json({ message: "Failed to send email" });
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

  // Stripe Checkout Session - Create payment for premium report
  app.post("/api/create-checkout-session", writeLimiter, async (req, res) => {
    try {
      // Block checkout if email delivery is not configured
      if (!resend) {
        res.status(503).json({ 
          message: "Premium purchases are temporarily unavailable. Email delivery service is not configured." 
        });
        return;
      }

      const { archetype, sessionId } = req.body;
      
      if (!archetype || !sessionId) {
        res.status(400).json({ message: "Missing archetype or sessionId" });
        return;
      }

      // Verify quiz result exists
      const quizResult = await storage.getQuizResultBySessionId(sessionId);
      if (!quizResult) {
        res.status(404).json({ message: "Quiz result not found" });
        return;
      }

      const baseUrl = process.env.NODE_ENV === 'production'
        ? 'https://prolificpersonalities.com'
        : `${req.protocol}://${req.get('host')}`;

      // Create order record
      const order = await storage.createOrder({
        userId: quizResult.userId || null,
        sessionId,
        archetype,
        amount: 2700,
        status: 'pending',
      });

      // Create Stripe Checkout Session
      const checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `Premium ${archetype.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} Playbook`,
                description: '100+ page personalized productivity playbook with 30-day action plan, tool setup guides, and templates',
              },
              unit_amount: 2700,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${baseUrl}/results/${sessionId}?payment=success`,
        cancel_url: `${baseUrl}/results/${sessionId}?payment=cancelled`,
        metadata: {
          orderId: order.id.toString(),
          archetype,
          sessionId,
        },
      });

      res.json({ sessionId: checkoutSession.id, url: checkoutSession.url });
    } catch (error: any) {
      console.error("Error creating checkout session:", error);
      res.status(500).json({ message: "Error creating checkout session: " + error.message });
    }
  });

  // Stripe webhook is registered separately in registerWebhookRoute() before JSON middleware

  // Get user's orders
  app.get("/api/orders", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const orders = await storage.getOrdersByUserId(userId);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // Removed unauthenticated order check endpoint - security risk

  // Download premium PDF
  app.get("/api/download/:orderId", isAuthenticated, async (req: any, res) => {
    try {
      const { orderId } = req.params;
      const userId = req.user.claims.sub;

      const order = await storage.getOrderById(parseInt(orderId));

      if (!order) {
        res.status(404).json({ message: "Order not found" });
        return;
      }

      if (order.userId !== userId) {
        res.status(403).json({ message: "Unauthorized" });
        return;
      }

      if (order.status !== 'completed') {
        res.status(402).json({ message: "Payment not completed" });
        return;
      }

      // Get PDF asset for archetype
      const asset = getPremiumAssetForArchetype(order.archetype);
      
      if (!asset) {
        res.status(404).json({ message: "PDF not found for this archetype" });
        return;
      }

      // Safely resolve PDF path
      const pdfPath = path.join(process.cwd(), 'attached_assets', asset.pdfFilename);

      // Check if file exists
      if (!fs.existsSync(pdfPath)) {
        console.error(`PDF file not found: ${pdfPath}`);
        res.status(404).json({ message: "PDF file not available" });
        return;
      }

      // Serve the PDF file with download headers
      res.download(pdfPath, asset.pdfFilename, (err) => {
        if (err) {
          console.error("Error sending PDF file:", err);
          if (!res.headersSent) {
            res.status(500).json({ message: "Error downloading file" });
          }
        }
      });
    } catch (error) {
      console.error("Error downloading PDF:", error);
      res.status(500).json({ message: "Failed to download PDF" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
