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
import { generateResultsEmail, generatePremiumPlaybookEmail, generateWelcomeEmail, generateAbandonedCartEmail } from "./emailTemplates";
import { getArchetypeInfo } from "./archetypeData";
import { insertCheckoutAttemptSchema, insertUnsubscribeFeedbackSchema } from "@shared/schema";
import { registerChatRoutes } from "./replit_integrations/chat";
import OpenAI from "openai";
import { buildSystemPrompt } from "./archetypePrompts";

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
            // Update order status and customer email
            await storage.updateOrderStatus(
              parseInt(orderId),
              'completed',
              session.payment_intent as string,
              customerEmail || undefined
            );
            console.log(`✅ Order ${orderId} marked as completed via webhook`);
            
            // Mark checkout attempt as completed (for abandoned cart tracking)
            if (sessionId && archetype) {
              try {
                await storage.markCheckoutCompleted(sessionId, archetype);
                console.log(`✅ Checkout attempt marked as completed for session ${sessionId}`);
              } catch (err) {
                console.error('Failed to mark checkout completed:', err);
              }
            }

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

  // Save email capture and send welcome email
  app.post("/api/email-capture", emailLimiter, async (req, res) => {
    try {
      const validatedData = insertEmailCaptureSchema.parse(req.body);
      const capture = await storage.saveEmailCapture(validatedData);
      
      // Send welcome email if Resend is configured and archetype is provided
      if (resend && validatedData.archetype) {
        try {
          const archetypeInfo = getArchetypeInfo(validatedData.archetype);
          if (archetypeInfo) {
            const baseUrl = process.env.REPLIT_DEV_DOMAIN 
              ? `https://${process.env.REPLIT_DEV_DOMAIN}`
              : 'https://prolificpersonalities.com';
            
            const { subject, html } = generateWelcomeEmail({
              recipientEmail: validatedData.email,
              archetype: {
                id: validatedData.archetype,
                title: archetypeInfo.title,
              },
              resultsUrl: `${baseUrl}/results?session=${validatedData.sessionId}`,
              unsubscribeUrl: `${baseUrl}/unsubscribe?email=${encodeURIComponent(validatedData.email)}`,
            });
            
            await resend.emails.send({
              from: 'Prolific Personalities <support@prolificpersonalities.com>',
              to: validatedData.email,
              subject,
              html,
            });
            
            // Mark welcome email as sent
            await storage.updateEmailCaptureWelcomeSent(capture.id);
            console.log(`Welcome email sent to ${validatedData.email}`);
          }
        } catch (emailError) {
          console.error('Failed to send welcome email:', emailError);
          // Don't fail the request if email fails
        }
      }
      
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
      
      // Also save to email_captures and send welcome email (only if not already captured)
      try {
        const existingCapture = await storage.getEmailCaptureByEmail(email);
        if (!existingCapture) {
          const capture = await storage.saveEmailCapture({
            email,
            sessionId,
            archetype: result.archetype,
            subscribed: 1,
          });
          
          // Send welcome email
          const welcomeBaseUrl = process.env.REPLIT_DEV_DOMAIN 
            ? `https://${process.env.REPLIT_DEV_DOMAIN}`
            : 'https://prolificpersonalities.com';
          
          const welcomeEmail = generateWelcomeEmail({
            recipientEmail: email,
            archetype: {
              id: result.archetype,
              title: archetypeInfo.title,
            },
            resultsUrl: `${welcomeBaseUrl}/results?session=${sessionId}`,
            unsubscribeUrl: `${welcomeBaseUrl}/unsubscribe?email=${encodeURIComponent(email)}`,
          });
          
          await resend.emails.send({
            from: 'Prolific Personalities <support@prolificpersonalities.com>',
            to: email,
            subject: welcomeEmail.subject,
            html: welcomeEmail.html,
          });
          
          await storage.updateEmailCaptureWelcomeSent(capture.id);
          console.log(`✅ Welcome email sent to ${email}`);
        }
      } catch (captureError) {
        console.error('Failed to save email capture or send welcome email:', captureError);
        // Don't fail the main request
      }
      
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
      
      // Track checkout attempt for abandoned cart emails (will be updated with email after Stripe)
      try {
        await storage.createCheckoutAttempt({
          sessionId,
          archetype,
          email: null, // Will be filled in by webhook if they complete
        });
      } catch (err) {
        console.error('Failed to track checkout attempt:', err);
        // Don't block checkout if tracking fails
      }

      // Create Stripe Checkout Session
      const checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `Premium ${archetype.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} Playbook`,
                description: 'Interactive web playbook with progress tracking, 30-day action plan, tool guides, and downloadable PDF',
              },
              unit_amount: 2700,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${baseUrl}/purchase-success?session_id=${sessionId}&archetype=${archetype}`,
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

  // Middleware to check premium access for a specific archetype
  const hasPremiumAccess = async (req: any, res: any, next: any) => {
    try {
      const userId = req.user.claims.sub;
      const archetype = req.params.archetype || req.body.archetype;

      if (!archetype) {
        res.status(400).json({ message: "Archetype is required" });
        return;
      }

      // Check direct access to the requested archetype
      let hasAccess = await storage.hasUserPurchasedPlaybook(userId, archetype);
      
      // Special case: Adaptive Generalist purchasers also get access to Flexible Improviser playbook
      // (since Flexible Improviser is included as a baseline in the Adaptive Generalist package)
      if (!hasAccess && archetype === 'flexible-improviser') {
        hasAccess = await storage.hasUserPurchasedPlaybook(userId, 'adaptive-generalist');
      }
      
      if (!hasAccess) {
        res.status(403).json({ message: "Premium access required. Please purchase the playbook for this archetype." });
        return;
      }

      next();
    } catch (error) {
      console.error("Error checking premium access:", error);
      res.status(500).json({ message: "Failed to verify access" });
    }
  };

  // ====================
  // PROGRESS TRACKING API ROUTES
  // ====================

  // Get playbook progress for user and archetype
  app.get("/api/playbook/:archetype/progress", isAuthenticated, hasPremiumAccess, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { archetype } = req.params;
      const progress = await storage.getPlaybookProgress(userId, archetype);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching playbook progress:", error);
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  // Update chapter completion
  app.post("/api/playbook/:archetype/progress/chapter", writeLimiter, isAuthenticated, hasPremiumAccess, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { archetype } = req.params;
      const { chapterId, completed } = req.body;

      if (typeof completed !== 'boolean') {
        res.status(400).json({ message: "completed must be a boolean" });
        return;
      }

      const progress = await storage.updateChapterProgress(userId, archetype, chapterId, completed);
      res.json(progress);
    } catch (error) {
      console.error("Error updating chapter progress:", error);
      res.status(500).json({ message: "Failed to update progress" });
    }
  });

  // Get action plan progress
  app.get("/api/playbook/:archetype/action-plan", isAuthenticated, hasPremiumAccess, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { archetype } = req.params;
      const progress = await storage.getActionPlanProgress(userId, archetype);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching action plan progress:", error);
      res.status(500).json({ message: "Failed to fetch action plan" });
    }
  });

  // Update action plan task
  app.post("/api/playbook/:archetype/action-plan/task", writeLimiter, isAuthenticated, hasPremiumAccess, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { archetype } = req.params;
      const { dayNumber, taskId, completed } = req.body;

      if (typeof completed !== 'boolean' || typeof dayNumber !== 'number') {
        res.status(400).json({ message: "Invalid request data" });
        return;
      }

      const progress = await storage.updateActionPlanTask(userId, archetype, dayNumber, taskId, completed);
      res.json(progress);
    } catch (error) {
      console.error("Error updating action plan task:", error);
      res.status(500).json({ message: "Failed to update task" });
    }
  });

  // Get tool tracking
  app.get("/api/playbook/:archetype/tools", isAuthenticated, hasPremiumAccess, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { archetype } = req.params;
      const tracking = await storage.getToolTracking(userId, archetype);
      res.json(tracking);
    } catch (error) {
      console.error("Error fetching tool tracking:", error);
      res.status(500).json({ message: "Failed to fetch tool tracking" });
    }
  });

  // Update tool tracking status
  app.post("/api/playbook/:archetype/tools/update", writeLimiter, isAuthenticated, hasPremiumAccess, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { archetype } = req.params;
      const { toolId, status, notes } = req.body;

      if (!['not_started', 'testing', 'using_daily'].includes(status)) {
        res.status(400).json({ message: "Invalid tool status" });
        return;
      }

      const tracking = await storage.updateToolTracking(userId, archetype, toolId, status, notes);
      res.json(tracking);
    } catch (error) {
      console.error("Error updating tool tracking:", error);
      res.status(500).json({ message: "Failed to update tool tracking" });
    }
  });

  // Get playbook notes
  app.get("/api/playbook/:archetype/notes", isAuthenticated, hasPremiumAccess, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { archetype } = req.params;
      const { sectionId } = req.query;
      const notes = await storage.getPlaybookNotes(userId, archetype, sectionId as string | undefined);
      res.json(notes);
    } catch (error) {
      console.error("Error fetching notes:", error);
      res.status(500).json({ message: "Failed to fetch notes" });
    }
  });

  // Create playbook note
  app.post("/api/playbook/:archetype/notes", writeLimiter, isAuthenticated, hasPremiumAccess, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { archetype } = req.params;
      const { sectionId, content } = req.body;

      if (!sectionId || !content) {
        res.status(400).json({ message: "sectionId and content are required" });
        return;
      }

      const note = await storage.savePlaybookNote(userId, archetype, sectionId, content);
      res.json(note);
    } catch (error) {
      console.error("Error creating note:", error);
      res.status(500).json({ message: "Failed to create note" });
    }
  });

  // Update playbook note
  app.put("/api/playbook/notes/:noteId", writeLimiter, isAuthenticated, async (req: any, res) => {
    try {
      const { noteId } = req.params;
      const { content } = req.body;

      if (!content) {
        res.status(400).json({ message: "content is required" });
        return;
      }

      const note = await storage.updatePlaybookNote(parseInt(noteId), content);
      if (!note) {
        res.status(404).json({ message: "Note not found" });
        return;
      }

      res.json(note);
    } catch (error) {
      console.error("Error updating note:", error);
      res.status(500).json({ message: "Failed to update note" });
    }
  });

  // Delete playbook note
  app.delete("/api/playbook/notes/:noteId", writeLimiter, isAuthenticated, async (req: any, res) => {
    try {
      const { noteId } = req.params;
      await storage.deletePlaybookNote(parseInt(noteId));
      res.json({ message: "Note deleted successfully" });
    } catch (error) {
      console.error("Error deleting note:", error);
      res.status(500).json({ message: "Failed to delete note" });
    }
  });

  // Check if user has premium access to an archetype
  app.get("/api/playbook/:archetype/access", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { archetype } = req.params;
      const hasAccess = await storage.hasUserPurchasedPlaybook(userId, archetype);
      res.json({ hasAccess });
    } catch (error) {
      console.error("Error checking access:", error);
      res.status(500).json({ message: "Failed to check access" });
    }
  });

  // Process abandoned cart emails (call this from a cron job or manually)
  app.post("/api/process-abandoned-carts", async (req, res) => {
    try {
      if (!resend) {
        res.status(503).json({ message: "Email service not configured" });
        return;
      }

      const abandonedCheckouts = await storage.getAbandonedCheckouts();
      console.log(`Found ${abandonedCheckouts.length} abandoned checkouts to process`);
      
      let sentCount = 0;
      const baseUrl = process.env.REPLIT_DEV_DOMAIN 
        ? `https://${process.env.REPLIT_DEV_DOMAIN}`
        : 'https://prolificpersonalities.com';

      for (const checkout of abandonedCheckouts) {
        if (!checkout.email) continue;
        
        const archetypeInfo = getArchetypeInfo(checkout.archetype);
        if (!archetypeInfo) continue;

        try {
          const { subject, html } = generateAbandonedCartEmail({
            recipientEmail: checkout.email,
            archetype: {
              id: checkout.archetype,
              title: archetypeInfo.title,
            },
            checkoutUrl: `${baseUrl}/results?session=${checkout.sessionId}`,
            unsubscribeUrl: `${baseUrl}/unsubscribe?email=${encodeURIComponent(checkout.email)}`,
          });

          await resend.emails.send({
            from: 'Prolific Personalities <support@prolificpersonalities.com>',
            to: checkout.email,
            subject,
            html,
          });

          await storage.markAbandonedEmailSent(checkout.id);
          sentCount++;
          console.log(`Abandoned cart email sent to ${checkout.email}`);
        } catch (emailError) {
          console.error(`Failed to send abandoned cart email to ${checkout.email}:`, emailError);
        }
      }

      res.json({ message: `Processed ${abandonedCheckouts.length} abandoned carts, sent ${sentCount} emails` });
    } catch (error) {
      console.error("Error processing abandoned carts:", error);
      res.status(500).json({ message: "Failed to process abandoned carts" });
    }
  });

  // Unsubscribe endpoint
  app.post("/api/unsubscribe", async (req, res) => {
    try {
      const { email, reason, reasonOther, rating, feedbackText } = z.object({
        email: z.string().email(),
        reason: z.string(),
        reasonOther: z.string().optional(),
        rating: z.string().optional(),
        feedbackText: z.string().optional(),
      }).parse(req.body);

      // Unsubscribe the email
      await storage.unsubscribeEmail(email);

      // Save feedback
      await storage.saveUnsubscribeFeedback({
        email,
        reason,
        reasonOther: reasonOther || null,
        rating: rating || null,
        feedbackText: feedbackText || null,
      });

      res.json({ message: "Successfully unsubscribed" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        console.error("Error unsubscribing:", error);
        res.status(500).json({ message: "Failed to unsubscribe" });
      }
    }
  });

  // Test email endpoint - sends all email types to specified address for testing
  app.post("/api/test-emails", async (req, res) => {
    try {
      if (!resend) {
        res.status(503).json({ message: "Email service not configured" });
        return;
      }

      const { email } = z.object({
        email: z.string().email(),
      }).parse(req.body);

      const baseUrl = process.env.REPLIT_DEV_DOMAIN 
        ? `https://${process.env.REPLIT_DEV_DOMAIN}`
        : 'https://prolificpersonalities.com';

      // Sample archetype for testing
      const sampleArchetype = {
        id: 'strategic-planner',
        title: 'The Strategic Planner',
        tagline: 'Methodical mastery through systematic thinking',
        description: 'Strategic Planners thrive on structure, long-term goals, and detailed planning. You excel at breaking complex projects into manageable steps and maintaining focus on the big picture while executing tactical details.'
      };

      const sampleScores = {
        structure: 85,
        motivation: 70,
        cognitive: 65,
        task: 80
      };

      const results = [];

      // 1. Send Welcome Email
      try {
        const welcomeEmail = generateWelcomeEmail({
          recipientEmail: email,
          archetype: {
            id: sampleArchetype.id,
            title: sampleArchetype.title,
          },
          resultsUrl: `${baseUrl}/results?session=test-session-123`,
          unsubscribeUrl: `${baseUrl}/unsubscribe?email=${encodeURIComponent(email)}`,
        });

        await resend.emails.send({
          from: 'Prolific Personalities <support@prolificpersonalities.com>',
          to: email,
          subject: `[TEST] ${welcomeEmail.subject}`,
          html: welcomeEmail.html,
        });
        results.push({ type: 'Welcome Email', status: 'sent' });
      } catch (e) {
        results.push({ type: 'Welcome Email', status: 'failed', error: String(e) });
      }

      // 2. Send Abandoned Cart Email
      try {
        const abandonedCartEmail = generateAbandonedCartEmail({
          recipientEmail: email,
          archetype: {
            id: sampleArchetype.id,
            title: sampleArchetype.title,
          },
          checkoutUrl: `${baseUrl}/results/test-session-123#premium`,
          unsubscribeUrl: `${baseUrl}/unsubscribe?email=${encodeURIComponent(email)}`,
        });

        await resend.emails.send({
          from: 'Prolific Personalities <support@prolificpersonalities.com>',
          to: email,
          subject: `[TEST] ${abandonedCartEmail.subject}`,
          html: abandonedCartEmail.html,
        });
        results.push({ type: 'Abandoned Cart Email', status: 'sent' });
      } catch (e) {
        results.push({ type: 'Abandoned Cart Email', status: 'failed', error: String(e) });
      }

      // 3. Send Results Email
      try {
        const resultsEmail = generateResultsEmail({
          recipientEmail: email,
          archetype: sampleArchetype,
          scores: sampleScores,
          resultsUrl: `${baseUrl}/results/test-session-123`,
        });

        await resend.emails.send({
          from: 'Prolific Personalities <support@prolificpersonalities.com>',
          to: email,
          subject: `[TEST] ${resultsEmail.subject}`,
          html: resultsEmail.html,
        });
        results.push({ type: 'Results Email', status: 'sent' });
      } catch (e) {
        results.push({ type: 'Results Email', status: 'failed', error: String(e) });
      }

      console.log(`✅ Test emails sent to ${email}:`, results);
      res.json({ message: "Test emails sent", results });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid email address", errors: error.errors });
      } else {
        console.error("Error sending test emails:", error);
        res.status(500).json({ message: "Failed to send test emails" });
      }
    }
  });

  // XML Sitemap for SEO
  app.get("/sitemap.xml", async (req, res) => {
    // Use APP_URL if set, otherwise safely construct from request
    let baseUrl = process.env.APP_URL;
    if (!baseUrl) {
      if (process.env.NODE_ENV === 'production') {
        baseUrl = 'https://prolificpersonalities.com';
      } else {
        // Safely construct URL from request, defaulting to https
        const protocol = req.protocol || 'https';
        const host = req.get('host') || 'localhost:5000';
        // Validate host to prevent injection
        const safeHost = host.replace(/[^a-zA-Z0-9.:-]/g, '');
        baseUrl = `${protocol}://${safeHost}`;
      }
    }
    
    const staticPages = [
      { url: '/', priority: '1.0', changefreq: 'weekly' },
      { url: '/quiz', priority: '0.9', changefreq: 'monthly' },
      { url: '/archetypes', priority: '0.8', changefreq: 'monthly' },
      { url: '/pricing', priority: '0.8', changefreq: 'monthly' },
      { url: '/blog', priority: '0.7', changefreq: 'weekly' },
      { url: '/science', priority: '0.7', changefreq: 'monthly' },
      { url: '/resources', priority: '0.7', changefreq: 'monthly' },
      { url: '/about', priority: '0.6', changefreq: 'monthly' },
      { url: '/faq', priority: '0.6', changefreq: 'monthly' },
      { url: '/founder', priority: '0.5', changefreq: 'yearly' },
      { url: '/refund-policy', priority: '0.3', changefreq: 'yearly' },
      { url: '/dashboard', priority: '0.4', changefreq: 'weekly' },
      { url: '/payment-success', priority: '0.2', changefreq: 'yearly' },
      { url: '/payment-cancelled', priority: '0.2', changefreq: 'yearly' },
      { url: '/purchase-success', priority: '0.2', changefreq: 'yearly' },
    ];

    const archetypes = [
      'chaotic-creative',
      'anxious-perfectionist', 
      'structured-achiever',
      'novelty-seeker',
      'strategic-planner',
      'flexible-improviser'
    ];

    const blogSlugs = [
      'understanding-productivity-archetypes',
      'productivity-guilt-self-compassion',
      'fluid-productivity-style-transitions',
      'digital-minimalism-notification-freedom',
      'science-behind-personalized-productivity'
    ];

    const today = new Date().toISOString().split('T')[0];
    
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    for (const page of staticPages) {
      sitemap += `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
    }

    for (const archetype of archetypes) {
      sitemap += `  <url>
    <loc>${baseUrl}/archetypes/${archetype}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
    }

    for (const slug of blogSlugs) {
      sitemap += `  <url>
    <loc>${baseUrl}/blog/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
`;
    }

    // Add playbook pages (premium content)
    for (const archetype of archetypes) {
      sitemap += `  <url>
    <loc>${baseUrl}/playbook/${archetype}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
`;
    }

    sitemap += `</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  });

  // Register generic chat routes
  registerChatRoutes(app);

  // AI Coach rate limiter - 30 requests per 15 minutes
  const aiCoachLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    message: { message: "Too many AI coach requests, please try again later" },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // AI Coach endpoint - archetype-aware productivity coaching
  const openai = new OpenAI({
    apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  });

  const FREE_DAILY_LIMIT = 10;

  // Helper to check rate limit
  async function checkChatRateLimit(userId: string | null, sessionId: string | null): Promise<{ allowed: boolean; remaining: number; isPremium: boolean }> {
    const today = new Date().toISOString().split('T')[0];
    
    // Premium users have unlimited access
    if (userId) {
      const isPremium = await storage.isPremiumUser(userId);
      if (isPremium) {
        return { allowed: true, remaining: -1, isPremium: true };
      }
    }

    const usage = await storage.getChatUsage(userId, sessionId, today);
    const messageCount = usage?.messageCount || 0;
    const remaining = FREE_DAILY_LIMIT - messageCount;

    return {
      allowed: messageCount < FREE_DAILY_LIMIT,
      remaining: Math.max(0, remaining),
      isPremium: false
    };
  }

  // Get usage status endpoint
  app.get("/api/ai-coach/usage", async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || null;
      const sessionId = req.query.sessionId as string || null;
      
      const { allowed, remaining, isPremium } = await checkChatRateLimit(userId, sessionId);
      
      res.json({
        remaining: isPremium ? -1 : remaining,
        limit: isPremium ? -1 : FREE_DAILY_LIMIT,
        isPremium
      });
    } catch (error) {
      console.error("Error getting usage:", error);
      res.status(500).json({ error: "Failed to get usage" });
    }
  });

  app.post("/api/ai-coach", aiCoachLimiter, async (req: any, res) => {
    try {
      const { message, archetype, scores, history = [], conversationId, sessionId: clientSessionId } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const userId = req.user?.claims?.sub || null;
      const sessionId = clientSessionId || null;

      // Check rate limit
      const { allowed, remaining, isPremium } = await checkChatRateLimit(userId, sessionId);
      if (!allowed) {
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        res.write(`data: ${JSON.stringify({ 
          error: "Daily limit reached", 
          limitReached: true,
          message: "You've reached your daily limit of 10 messages. Upgrade to Productivity Partner for unlimited AI coaching!"
        })}\n\n`);
        res.end();
        return;
      }

      const archetypeInfo = archetype ? getArchetypeInfo(archetype) : null;
      
      // Use detailed archetype-specific prompts
      const systemPrompt = buildSystemPrompt(
        archetype,
        archetypeInfo?.title,
        archetypeInfo?.description,
        scores
      );

      const messages = [
        { role: "system" as const, content: systemPrompt },
        ...history.map((h: any) => ({ role: h.role as "user" | "assistant", content: h.content })),
        { role: "user" as const, content: message }
      ];

      // Set up SSE for streaming
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      // Send remaining count
      res.write(`data: ${JSON.stringify({ remaining: isPremium ? -1 : remaining - 1, isPremium })}\n\n`);

      const stream = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
        stream: true,
        max_completion_tokens: 1024,
      });

      let fullResponse = "";

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          fullResponse += content;
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }

      // Increment usage after successful response
      await storage.incrementChatUsage(userId, sessionId, new Date().toISOString().split('T')[0]);

      // Save to chat history if conversationId provided
      if (conversationId) {
        try {
          await storage.createMessage({
            conversationId: parseInt(conversationId),
            userId,
            role: "user",
            content: message
          });
          await storage.createMessage({
            conversationId: parseInt(conversationId),
            userId,
            role: "assistant",
            content: fullResponse
          });
        } catch (e) {
          console.error("Failed to save chat history:", e);
        }
      }

      res.write(`data: ${JSON.stringify({ done: true, fullResponse })}\n\n`);
      res.end();
    } catch (error) {
      console.error("Error in AI coach:", error);
      if (res.headersSent) {
        res.write(`data: ${JSON.stringify({ error: "Failed to get AI response" })}\n\n`);
        res.end();
      } else {
        res.status(500).json({ error: "Failed to get AI response" });
      }
    }
  });

  // Non-streaming version for mobile API
  app.post("/api/v1/ai-coach", aiCoachLimiter, async (req: any, res) => {
    try {
      const { message, archetype, scores, history = [], conversationId, sessionId: clientSessionId } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const userId = req.user?.claims?.sub || null;
      const sessionId = clientSessionId || null;

      // Check rate limit
      const { allowed, remaining, isPremium } = await checkChatRateLimit(userId, sessionId);
      if (!allowed) {
        return res.status(429).json({ 
          error: "Daily limit reached",
          limitReached: true,
          message: "You've reached your daily limit of 10 messages. Upgrade to Productivity Partner for unlimited AI coaching!"
        });
      }

      const archetypeInfo = archetype ? getArchetypeInfo(archetype) : null;
      
      // Use detailed archetype-specific prompts
      const systemPrompt = buildSystemPrompt(
        archetype,
        archetypeInfo?.title,
        archetypeInfo?.description,
        scores
      );

      const messages = [
        { role: "system" as const, content: systemPrompt },
        ...history.map((h: any) => ({ role: h.role as "user" | "assistant", content: h.content })),
        { role: "user" as const, content: message }
      ];

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
        max_completion_tokens: 1024,
      });

      const content = response.choices[0]?.message?.content || "";

      // Increment usage after successful response
      await storage.incrementChatUsage(userId, sessionId, new Date().toISOString().split('T')[0]);

      // Save to chat history if conversationId provided
      if (conversationId) {
        try {
          await storage.createMessage({
            conversationId: parseInt(conversationId),
            userId,
            role: "user",
            content: message
          });
          await storage.createMessage({
            conversationId: parseInt(conversationId),
            userId,
            role: "assistant",
            content
          });
        } catch (e) {
          console.error("Failed to save chat history:", e);
        }
      }

      res.json({ 
        response: content,
        remaining: isPremium ? -1 : remaining - 1,
        isPremium
      });
    } catch (error) {
      console.error("Error in AI coach:", error);
      res.status(500).json({ error: "Failed to get AI response" });
    }
  });

  // Chat history endpoints
  app.get("/api/chat/conversations", async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const sessionId = req.query.sessionId as string;

      if (!userId && !sessionId) {
        return res.status(400).json({ error: "User ID or session ID required" });
      }

      const conversations = userId 
        ? await storage.getConversationsByUser(userId)
        : await storage.getConversationsBySession(sessionId);

      res.json(conversations);
    } catch (error) {
      console.error("Error getting conversations:", error);
      res.status(500).json({ error: "Failed to get conversations" });
    }
  });

  app.post("/api/chat/conversations", writeLimiter, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || null;
      const { sessionId, archetype, title } = req.body;

      if (!userId && !sessionId) {
        return res.status(400).json({ error: "User ID or session ID required" });
      }

      const conversation = await storage.createConversation({
        userId,
        sessionId,
        archetype,
        title: title || "New Conversation"
      });

      res.json(conversation);
    } catch (error) {
      console.error("Error creating conversation:", error);
      res.status(500).json({ error: "Failed to create conversation" });
    }
  });

  app.get("/api/chat/conversations/:id/messages", async (req: any, res) => {
    try {
      const conversationId = parseInt(req.params.id);
      const messages = await storage.getMessagesByConversation(conversationId);
      res.json(messages);
    } catch (error) {
      console.error("Error getting messages:", error);
      res.status(500).json({ error: "Failed to get messages" });
    }
  });

  app.delete("/api/chat/conversations/:id", writeLimiter, async (req: any, res) => {
    try {
      const conversationId = parseInt(req.params.id);
      await storage.deleteConversation(conversationId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting conversation:", error);
      res.status(500).json({ error: "Failed to delete conversation" });
    }
  });

  app.post("/api/chat/messages/:id/feedback", writeLimiter, async (req: any, res) => {
    try {
      const messageId = parseInt(req.params.id);
      const { feedback, reason } = req.body;
      
      const message = await storage.updateMessageFeedback(messageId, feedback, reason);
      res.json(message);
    } catch (error) {
      console.error("Error updating feedback:", error);
      res.status(500).json({ error: "Failed to update feedback" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
