import { supabaseAuth } from "./supabaseAuth";
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertQuizResultSchema,
  insertEmailCaptureSchema,
  insertWaitlistSchema,
  insertFeedbackSchema,
} from "@shared/schema";
import { toolsData } from "./tools-data";
import { z } from "zod";
import rateLimit from "express-rate-limit";
import Stripe from "stripe";
import express from "express";
import path from "path";
import fs from "fs";
import { getPremiumAssetForArchetype } from "./premiumAssets";
import { Resend } from "resend";
import {
  generateResultsEmail,
  generatePremiumPlaybookEmail,
  generateWelcomeEmail,
  generateAbandonedCartEmail,
  generateWeeklyAccountabilityEmail,
  generateDay3NurtureEmail,
  generateDay5NurtureEmail,
  generateDay7NurtureEmail,
  generateDay10NurtureEmail,
  generateDay14NurtureEmail,
  generateDay3OnboardEmail,
  generateDay7OnboardEmail,
  generateDay30OnboardEmail,
} from "./emailTemplates";
import { getArchetypeInfo } from "./archetypeData";
import {
  insertCheckoutAttemptSchema,
  insertUnsubscribeFeedbackSchema,
} from "@shared/schema";
import { registerChatRoutes } from "./replit_integrations/chat";
import OpenAI from "openai";
import { buildSystemPrompt } from "./archetypePrompts";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import {
  magicLinkTokens,
  mobileSessions,
  magicLinkRateLimits,
  quizResults,
  orders,
} from "@shared/schema";
import { eq, and, gt, sql, desc, or } from "drizzle-orm";
import { db } from "./db";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing required Stripe secret: STRIPE_SECRET_KEY");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-10-29.clover",
});

// Initialize Resend client for email sending
if (!process.env.RESEND_API_KEY) {
  console.warn("⚠️ RESEND_API_KEY not set - email sending will be disabled");
}

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// Register Stripe webhook handler with raw body parser (must be called before express.json())
export function registerWebhookRoute(app: Express) {
  app.post(
    "/api/webhook/stripe",
    express.raw({ type: "application/json" }),
    async (req, res) => {
      const sig = req.headers["stripe-signature"];

      if (!sig) {
        res.status(400).send("Missing stripe-signature header");
        return;
      }

      try {
        // Verify webhook signature if STRIPE_WEBHOOK_SECRET is set
        let event;
        if (process.env.STRIPE_WEBHOOK_SECRET) {
          event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET,
          );
        } else {
          // Development mode - parse the event without verification
          console.warn(
            "⚠️ STRIPE_WEBHOOK_SECRET not set - webhook signature verification disabled (development only)",
          );
          event = JSON.parse(req.body.toString());
        }

        // Handle checkout completion
        if (event.type === "checkout.session.completed") {
          const session = event.data.object as Stripe.Checkout.Session;
          const orderId = session.metadata?.orderId;
          const archetype = session.metadata?.archetype;
          const sessionId = session.metadata?.sessionId;
          const productType = session.metadata?.productType;
          const customerEmail = session.customer_details?.email;

          if (orderId) {
            // Look up local user by email to link the order correctly
            // This handles legacy users with numeric IDs
            let userId: string | undefined;
            if (customerEmail) {
              const existingUser = await storage.getUserByEmail(customerEmail);
              if (existingUser) {
                userId = existingUser.id;
                console.log(`✅ Linking order to existing user ${userId} via email ${customerEmail}`);
              }
            }

            // Update order status, customer email, and link to user
            // For subscriptions, store the subscription ID instead of payment_intent
            const isSubscription = session.mode === "subscription";
            await storage.updateOrderStatus(
              parseInt(orderId),
              "completed",
              isSubscription ? null : (session.payment_intent as string),
              customerEmail || undefined,
              isSubscription ? (session.subscription as string) : undefined,
              userId,
            );
            console.log(
              `✅ Order ${orderId} marked as completed via webhook (${isSubscription ? "subscription" : "one-time"})`,
            );

            // Mark checkout attempt as completed (for abandoned cart tracking)
            if (sessionId && archetype) {
              try {
                await storage.markCheckoutCompleted(sessionId, archetype);
                console.log(
                  `✅ Checkout attempt marked as completed for session ${sessionId}`,
                );
              } catch (err) {
                console.error("Failed to mark checkout completed:", err);
              }
            }

            // Mark email capture as purchased (for nurture sequence tracking)
            if (customerEmail) {
              try {
                await storage.markEmailCapturePurchased(customerEmail);
                console.log(
                  `✅ Email capture marked as purchased for ${customerEmail}`,
                );
              } catch (err) {
                console.error("Failed to mark email capture purchased:", err);
              }
            }

            // Send premium PDF email if we have customer email
            if (resend && customerEmail && archetype && sessionId) {
              try {
                // Get archetype info
                const archetypeInfo = getArchetypeInfo(archetype);
                if (!archetypeInfo) {
                  console.error("❌ Archetype info not found:", archetype);
                  return;
                }

                // Get PDF for archetype
                const pdfAsset = getPremiumAssetForArchetype(archetype);
                if (!pdfAsset) {
                  console.error("❌ PDF not found for archetype:", archetype);
                  return;
                }

                const pdfPath = path.join(
                  process.cwd(),
                  "attached_assets",
                  pdfAsset.pdfFilename,
                );

                // Check if PDF exists
                if (!fs.existsSync(pdfPath)) {
                  console.error("❌ PDF file does not exist:", pdfPath);
                  return;
                }

                // Read PDF file
                const pdfBuffer = fs.readFileSync(pdfPath);
                const pdfBase64 = pdfBuffer.toString("base64");

                // Generate results URL - use environment variable or default
                const baseUrl =
                  process.env.APP_URL ||
                  (process.env.NODE_ENV === "production"
                    ? "https://prolificpersonalities.com"
                    : "http://localhost:5000");
                const resultsUrl = `${baseUrl}/results/${sessionId}`;

                // Generate email content
                const { subject, html } = generatePremiumPlaybookEmail({
                  recipientEmail: customerEmail,
                  archetype: archetypeInfo,
                  resultsUrl,
                });

                // Send email with PDF attachment
                const emailResponse = await resend.emails.send({
                  from: "Prolific Personalities <support@prolificpersonalities.com>",
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
                  console.error(
                    "❌ Error sending premium PDF email:",
                    emailResponse.error,
                  );
                } else {
                  console.log(`✅ Premium PDF emailed to ${customerEmail}`);
                }
              } catch (emailError) {
                console.error(
                  "❌ Error in premium PDF email flow:",
                  emailError,
                );
              }
            } else {
              if (!resend)
                console.warn("⚠️ Resend not configured - skipping email");
              if (!customerEmail)
                console.warn("⚠️ No customer email - skipping email");
              if (!archetype)
                console.warn("⚠️ No archetype metadata - skipping email");
              if (!sessionId)
                console.warn("⚠️ No sessionId metadata - skipping email");
            }
          }
        }

        // Handle subscription cancellation
        if (event.type === "customer.subscription.deleted") {
          const subscription = event.data.object as Stripe.Subscription;
          const subscriptionId = subscription.id;
          
          // Find and update order with this subscription ID
          try {
            const order = await storage.getOrderBySubscriptionId(subscriptionId);
            if (order) {
              await storage.updateOrderStatus(order.id, "cancelled");
              console.log(`✅ Subscription ${subscriptionId} cancelled - order ${order.id} updated`);
            } else {
              console.warn(`⚠️ No order found for cancelled subscription ${subscriptionId}`);
            }
          } catch (err) {
            console.error("Failed to handle subscription cancellation:", err);
          }
        }

        // Handle subscription renewal (invoice paid)
        if (event.type === "invoice.paid") {
          const invoice = event.data.object as Stripe.Invoice;
          // Only process subscription invoices (not one-time payments)
          const invoiceSubscription = (invoice as any).subscription;
          if (invoiceSubscription) {
            const subscriptionId = invoiceSubscription as string;
            console.log(`✅ Subscription ${subscriptionId} renewed - invoice ${invoice.id} paid`);
            
            // If payment previously failed and now succeeds, restore order to completed
            try {
              const order = await storage.getOrderBySubscriptionId(subscriptionId);
              if (order && order.status === "failed") {
                await storage.updateOrderStatus(order.id, "completed");
                console.log(`✅ Order ${order.id} restored to completed after successful renewal`);
              }
            } catch (err) {
              console.error("Failed to update order on renewal:", err);
            }
          }
        }

        // Handle subscription payment failure
        if (event.type === "invoice.payment_failed") {
          const invoice = event.data.object as Stripe.Invoice;
          const failedInvoiceSubscription = (invoice as any).subscription;
          if (failedInvoiceSubscription) {
            const subscriptionId = failedInvoiceSubscription as string;
            const customerEmail = invoice.customer_email;
            
            console.log(`⚠️ Subscription ${subscriptionId} payment failed - invoice ${invoice.id}`);
            
            // Find order and update status to 'failed'
            try {
              const order = await storage.getOrderBySubscriptionId(subscriptionId);
              if (order) {
                // Mark order as failed to indicate payment issue
                await storage.updateOrderStatus(order.id, "failed");
                console.log(`⚠️ Order ${order.id} marked as failed due to payment failure`);
                
                // Send payment failure notification email
                if (resend && customerEmail) {
                  try {
                    await resend.emails.send({
                      from: "Prolific Personalities <support@prolificpersonalities.com>",
                      to: customerEmail,
                      subject: "Action Required: Payment Failed for Your Productivity Partner Subscription",
                      html: `
                        <h2>Payment Failed</h2>
                        <p>We were unable to process your subscription payment. Please update your payment method to continue your Productivity Partner benefits.</p>
                        <p><a href="https://prolificpersonalities.com/dashboard">Update Payment Method</a></p>
                        <p>If you have questions, reply to this email.</p>
                      `,
                    });
                    console.log(`✅ Payment failure notification sent to ${customerEmail}`);
                  } catch (emailErr) {
                    console.error("Failed to send payment failure email:", emailErr);
                  }
                }
              }
            } catch (err) {
              console.error("Failed to handle payment failure:", err);
            }
          }
        }

        res.json({ received: true });
      } catch (err: any) {
        console.error("❌ Webhook error:", err.message);
        res.status(400).send(`Webhook Error: ${err.message}`);
      }
    },
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

  // Sync Supabase user to local database (called on login)
  app.post("/api/auth/sync", supabaseAuth, async (req: any, res) => {
    try {
      const supabaseUser = req.supabaseUser;
      const { firstName, lastName, profileImageUrl } = req.body;

      await storage.upsertUser({
        id: supabaseUser.id,
        email: supabaseUser.email || null,
        firstName: firstName || null,
        lastName: lastName || null,
        profileImageUrl: profileImageUrl || null,
      });

      res.json({ success: true });
    } catch (error) {
      console.error("Error syncing user:", error);
      res.status(500).json({ message: "Failed to sync user" });
    }
  });

  // Link quiz result to logged-in user
  app.post(
    "/api/quiz/claim/:sessionId",
    writeLimiter,
    supabaseAuth,
    async (req: any, res) => {
      try {
        const { sessionId } = req.params;
        const supabaseUser = req.supabaseUser;

        // Get the local user ID (may differ from Supabase ID for legacy users)
        const localUser = await storage.upsertUser({
          id: supabaseUser.id,
          email: supabaseUser.email || null,
          firstName: supabaseUser.user_metadata?.full_name?.split(' ')[0] || null,
          lastName: supabaseUser.user_metadata?.full_name?.split(' ').slice(1).join(' ') || null,
          profileImageUrl: supabaseUser.user_metadata?.avatar_url || null,
        });
        const userId = localUser.id;

        console.log(`🔍 Claim request for session ${sessionId} by user ${userId} (supabase: ${supabaseUser.id})`);

        // Check if result exists and is already claimed
        const existing = await storage.getQuizResultBySessionId(sessionId);
        if (!existing) {
          res.status(404).json({ message: "Quiz result not found" });
          return;
        }

        if (existing.userId !== null && existing.userId !== userId) {
          res
            .status(403)
            .json({
              message: "This quiz result is already claimed by another user",
            });
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
        console.log(
          `✅ Claimed quiz session ${sessionId} and associated orders for user ${userId}`,
        );

        res.json(result);
      } catch (error) {
        console.error("Error linking quiz result:", error);
        res.status(500).json({ message: "Failed to link quiz result" });
      }
    },
  );

  // Get all quiz results for logged-in user
  app.get("/api/dashboard/results", supabaseAuth, async (req: any, res) => {
    try {
      const supabaseUser = req.supabaseUser;
      
      // Get the local user ID (may differ from Supabase ID for legacy users)
      const localUser = await storage.upsertUser({
        id: supabaseUser.id,
        email: supabaseUser.email || null,
        firstName: supabaseUser.user_metadata?.full_name?.split(' ')[0] || null,
        lastName: supabaseUser.user_metadata?.full_name?.split(' ').slice(1).join(' ') || null,
        profileImageUrl: supabaseUser.user_metadata?.avatar_url || null,
      });
      
      const results = await storage.getQuizResultsByUserId(localUser.id);
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
      
      // If userId is provided, verify it exists or look up by email from auth header
      let finalUserId = validatedData.userId;
      if (finalUserId) {
        const existingUser = await storage.getUser(finalUserId);
        if (!existingUser) {
          // User ID doesn't exist in DB - try to get email from auth token and look up by email
          const authHeader = req.headers.authorization;
          if (authHeader?.startsWith('Bearer ')) {
            try {
              const token = authHeader.substring(7);
              const { createClient } = await import('@supabase/supabase-js');
              const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
              const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
              if (supabaseUrl && supabaseKey) {
                const supabase = createClient(supabaseUrl, supabaseKey);
                const { data } = await supabase.auth.getUser(token);
                if (data?.user?.email) {
                  const userByEmail = await storage.getUserByEmail(data.user.email);
                  if (userByEmail) {
                    finalUserId = userByEmail.id;
                  }
                }
              }
            } catch (e) {
              console.error("Error looking up user by email:", e);
            }
          }
          // If still no valid user, save without userId (anonymous)
          if (!await storage.getUser(finalUserId || '')) {
            finalUserId = undefined;
          }
        }
      }
      
      const result = await storage.saveQuizResult({
        ...validatedData,
        userId: finalUserId,
      });
      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res
          .status(400)
          .json({ message: "Invalid quiz data", errors: error.errors });
      } else {
        console.error("Error saving quiz results:", error);
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

  // Get playbook purchase count (for early-bird pricing)
  app.get("/api/playbook-purchase-count", async (req, res) => {
    try {
      const count = await storage.getPlaybookPurchaseCount();
      res.json({ count });
    } catch (error) {
      console.error("Error getting playbook purchase count:", error);
      res.status(500).json({ message: "Failed to get purchase count" });
    }
  });

  // Add to mobile app waitlist
  app.post("/api/app-waitlist", emailLimiter, async (req, res) => {
    try {
      const { email, sessionId, source } = req.body;
      
      if (!email) {
        res.status(400).json({ message: "Email is required" });
        return;
      }
      
      // Use source as sessionId if sessionId not provided (for playbook banner etc)
      const entrySource = source || 'app_waitlist';
      await storage.addToWaitlist(email, sessionId || entrySource, 'app_waitlist');
      res.json({ success: true, message: "You're on the list!" });
    } catch (error) {
      console.error("Error adding to app waitlist:", error);
      res.status(500).json({ message: "Failed to join waitlist" });
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
        res.json({
          message: "Tools already seeded",
          count: existingTools.length,
        });
        return;
      }

      // Seed tools
      const seededTools = [];
      for (const toolData of toolsData) {
        const tool = await storage.createTool(toolData);
        seededTools.push(tool);
      }

      res.json({
        message: "Tools seeded successfully",
        count: seededTools.length,
      });
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
              : "https://prolificpersonalities.com";

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
              from: "Prolific Personalities <support@prolificpersonalities.com>",
              to: validatedData.email,
              subject,
              html,
            });

            // Mark welcome email as sent
            await storage.updateEmailCaptureWelcomeSent(capture.id);
            console.log(`Welcome email sent to ${validatedData.email}`);
          }
        } catch (emailError) {
          console.error("Failed to send welcome email:", emailError);
          // Don't fail the request if email fails
        }
      }

      res.json(capture);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res
          .status(400)
          .json({ message: "Invalid email data", errors: error.errors });
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
        res
          .status(400)
          .json({ message: "Invalid waitlist data", errors: error.errors });
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
        res
          .status(400)
          .json({ message: "Invalid feedback data", errors: error.errors });
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

      const { email, sessionId } = z
        .object({
          email: z.string().email(),
          sessionId: z.string(),
        })
        .parse(req.body);

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
      const baseUrl =
        process.env.NODE_ENV === "production"
          ? "https://prolificpersonalities.com"
          : `${req.protocol}://${req.get("host")}`;
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
        from: "Prolific Personalities <support@prolificpersonalities.com>",
        to: email,
        subject,
        html,
      });

      if (emailResponse.error) {
        console.error("Error sending email:", emailResponse.error);
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
            : "https://prolificpersonalities.com";

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
            from: "Prolific Personalities <support@prolificpersonalities.com>",
            to: email,
            subject: welcomeEmail.subject,
            html: welcomeEmail.html,
          });

          await storage.updateEmailCaptureWelcomeSent(capture.id);
          console.log(`✅ Welcome email sent to ${email}`);
        }
      } catch (captureError) {
        console.error(
          "Failed to save email capture or send welcome email:",
          captureError,
        );
        // Don't fail the main request
      }

      res.json({ success: true });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res
          .status(400)
          .json({ message: "Invalid request data", errors: error.errors });
      } else {
        console.error("Error sending email:", error);
        res.status(500).json({ message: "Failed to send email" });
      }
    }
  });

  // Validate promo code
  app.post("/api/promo-code/validate", async (req, res) => {
    try {
      const { code } = req.body;

      if (!code) {
        res
          .status(400)
          .json({ valid: false, message: "Promo code is required" });
        return;
      }

      const promoCode = await storage.getPromoCodeByCode(code.trim());

      if (!promoCode) {
        res.status(404).json({ valid: false, message: "Invalid promo code" });
        return;
      }

      // Check if active
      if (!promoCode.isActive) {
        res
          .status(400)
          .json({
            valid: false,
            message: "This promo code is no longer active",
          });
        return;
      }

      // Check if expired
      if (promoCode.expiresAt && new Date(promoCode.expiresAt) < new Date()) {
        res
          .status(400)
          .json({ valid: false, message: "This promo code has expired" });
        return;
      }

      // Check if max uses reached
      if (
        promoCode.maxUses !== null &&
        promoCode.currentUses >= promoCode.maxUses
      ) {
        res
          .status(400)
          .json({
            valid: false,
            message: "This promo code has reached its maximum uses",
          });
        return;
      }

      res.json({
        valid: true,
        discountPercent: promoCode.discountPercent,
        productType: promoCode.productType,
        message:
          promoCode.discountPercent === 100
            ? "100% off - Free access!"
            : `${promoCode.discountPercent}% off`,
      });
    } catch (error: any) {
      console.error("Error validating promo code:", error);
      res
        .status(500)
        .json({ valid: false, message: "Error validating promo code" });
    }
  });

  // Redeem promo code (bypasses Stripe for 100% discount)
  app.post("/api/promo-code/redeem", writeLimiter, async (req, res) => {
    try {
      const { code, archetype, sessionId, email } = req.body;

      if (!code || !archetype || !sessionId) {
        res
          .status(400)
          .json({ success: false, message: "Missing required fields" });
        return;
      }

      const promoCode = await storage.getPromoCodeByCode(code.trim());

      if (!promoCode) {
        res.status(404).json({ success: false, message: "Invalid promo code" });
        return;
      }

      // Validate promo code is still valid
      if (!promoCode.isActive) {
        res
          .status(400)
          .json({
            success: false,
            message: "This promo code is no longer active",
          });
        return;
      }

      if (promoCode.expiresAt && new Date(promoCode.expiresAt) < new Date()) {
        res
          .status(400)
          .json({ success: false, message: "This promo code has expired" });
        return;
      }

      if (
        promoCode.maxUses !== null &&
        promoCode.currentUses >= promoCode.maxUses
      ) {
        res
          .status(400)
          .json({
            success: false,
            message: "This promo code has reached its maximum uses",
          });
        return;
      }

      // Check if already redeemed by this session
      const alreadyRedeemed = await storage.hasUserRedeemedPromoCode(
        sessionId,
        promoCode.id,
      );
      if (alreadyRedeemed) {
        res
          .status(400)
          .json({
            success: false,
            message: "You have already redeemed this promo code",
          });
        return;
      }

      // Verify quiz result exists
      const quizResult = await storage.getQuizResultBySessionId(sessionId);
      if (!quizResult) {
        res
          .status(404)
          .json({ success: false, message: "Quiz result not found" });
        return;
      }

      // For 100% discount, create a completed order without Stripe
      if (promoCode.discountPercent === 100) {
        // Create completed order
        const order = await storage.createOrder({
          userId: quizResult.userId || null,
          sessionId,
          archetype,
          amount: 0,
          status: "completed",
          productType: promoCode.productType,
          customerEmail: email || null,
        });

        // Update order status to completed
        await storage.updateOrderStatus(
          order.id,
          "completed",
          null,
          email || undefined,
        );

        // Record the redemption
        await storage.redeemPromoCode(promoCode.id, {
          sessionId,
          userId: quizResult.userId || null,
          email: email || null,
          archetype,
        });

        // Send email with PDF if email is provided
        if (resend && email) {
          try {
            const archetypeInfo = getArchetypeInfo(archetype);
            const pdfAsset = getPremiumAssetForArchetype(archetype);

            if (archetypeInfo && pdfAsset) {
              const pdfPath = path.join(
                process.cwd(),
                "attached_assets",
                pdfAsset.pdfFilename,
              );

              if (fs.existsSync(pdfPath)) {
                const pdfBuffer = fs.readFileSync(pdfPath);
                const pdfBase64 = pdfBuffer.toString("base64");

                const baseUrl =
                  process.env.APP_URL ||
                  (process.env.NODE_ENV === "production"
                    ? "https://prolificpersonalities.com"
                    : "http://localhost:5000");
                const resultsUrl = `${baseUrl}/results/${sessionId}`;

                const { subject, html } = generatePremiumPlaybookEmail({
                  recipientEmail: email,
                  archetype: archetypeInfo,
                  resultsUrl,
                });

                const emailResponse = await resend.emails.send({
                  from: "Prolific Personalities <support@prolificpersonalities.com>",
                  to: email,
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
                  console.error("❌ Error sending promo PDF email:", emailResponse.error);
                } else {
                  console.log(`✅ Promo PDF emailed to ${email}`);
                }
              }
            }
          } catch (emailError) {
            console.error("❌ Error in promo PDF email flow:", emailError);
          }
        }

        res.json({
          success: true,
          message:
            "Promo code redeemed successfully! You now have premium access.",
          orderId: order.id,
          redirectUrl: `/purchase-success?session_id=${sessionId}&archetype=${archetype}&promo=true`,
        });
      } else {
        // For partial discounts, redirect to Stripe checkout with coupon
        if (!stripe) {
          res.status(503).json({
            success: false,
            message: "Payment service not configured",
          });
          return;
        }

        try {
          // Create or get Stripe coupon for this discount percentage
          const couponId = `PROMO_${promoCode.discountPercent}_OFF`;
          let stripeCoupon;
          
          try {
            stripeCoupon = await stripe.coupons.retrieve(couponId);
          } catch {
            // Coupon doesn't exist, create it
            stripeCoupon = await stripe.coupons.create({
              id: couponId,
              percent_off: promoCode.discountPercent,
              duration: 'once',
              name: `${promoCode.discountPercent}% Off`,
            });
          }

          // Calculate discounted amount
          const originalAmount = 1900; // $19.00 in cents
          const discountedAmount = Math.round(originalAmount * (1 - promoCode.discountPercent / 100));

          // Create pending order
          const order = await storage.createOrder({
            userId: quizResult.userId || null,
            sessionId,
            archetype,
            amount: discountedAmount,
            status: "pending",
            productType: promoCode.productType,
            customerEmail: email || null,
          });

          const baseUrl =
            process.env.APP_URL ||
            (process.env.NODE_ENV === "production"
              ? "https://prolificpersonalities.com"
              : "http://localhost:5000");

          // Create Stripe checkout session with coupon
          const checkoutSession = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
              {
                price_data: {
                  currency: "usd",
                  product_data: {
                    name: `Premium ${archetype.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} Playbook`,
                    description: "Interactive web playbook with progress tracking, 30-day action plan, tool guides, and downloadable PDF",
                  },
                  unit_amount: originalAmount,
                },
                quantity: 1,
              },
            ],
            discounts: [{ coupon: couponId }],
            mode: "payment",
            success_url: `${baseUrl}/purchase-success?session_id=${sessionId}&archetype=${archetype}`,
            cancel_url: `${baseUrl}/results/${sessionId}`,
            customer_email: email || undefined,
            metadata: {
              orderId: order.id.toString(),
              sessionId,
              archetype,
              productType: promoCode.productType,
              promoCodeId: promoCode.id.toString(),
            },
          });

          // Record the redemption (pending until payment completes)
          await storage.redeemPromoCode(promoCode.id, {
            sessionId,
            userId: quizResult.userId || null,
            email: email || null,
            archetype,
          });

          res.json({
            success: true,
            message: `${promoCode.discountPercent}% discount applied! Redirecting to checkout...`,
            checkoutUrl: checkoutSession.url,
            discountPercent: promoCode.discountPercent,
            originalPrice: 19,
            discountedPrice: discountedAmount / 100,
          });
        } catch (stripeError: any) {
          console.error("Stripe coupon error:", stripeError);
          res.status(500).json({
            success: false,
            message: "Error applying discount. Please try again.",
          });
        }
      }
    } catch (error: any) {
      console.error("Error redeeming promo code:", error);
      res
        .status(500)
        .json({ success: false, message: "Error redeeming promo code" });
    }
  });

  // Admin test page - get user state (protected by email check)
  const ADMIN_EMAIL = "adeola1994@gmail.com";
  
  app.get("/api/admin/test-state", supabaseAuth, async (req: any, res) => {
    try {
      const supabaseUser = req.supabaseUser;
      const userEmail = supabaseUser.email?.toLowerCase();
      
      if (userEmail !== ADMIN_EMAIL) {
        res.status(403).json({ message: "Access denied" });
        return;
      }

      // Get the local user ID
      const localUser = await storage.upsertUser({
        id: supabaseUser.id,
        email: supabaseUser.email || null,
        firstName: supabaseUser.user_metadata?.full_name?.split(' ')[0] || null,
        lastName: supabaseUser.user_metadata?.full_name?.split(' ').slice(1).join(' ') || null,
        profileImageUrl: supabaseUser.user_metadata?.avatar_url || null,
      });

      const quizResults = await storage.getQuizResultsByUserId(localUser.id);
      const orders = await storage.getOrdersByUserId(localUser.id);
      const isPremium = await storage.isPremiumUser(localUser.id);

      res.json({
        supabaseId: supabaseUser.id,
        localUserId: localUser.id,
        user: localUser,
        quizResults,
        orders,
        isPremium,
      });
    } catch (error) {
      console.error("Error fetching admin test state:", error);
      res.status(500).json({ message: "Failed to fetch test state" });
    }
  });

  // Admin test page - reset user state (protected by email check)
  app.post("/api/admin/reset-state", supabaseAuth, async (req: any, res) => {
    try {
      const supabaseUser = req.supabaseUser;
      const userEmail = supabaseUser.email?.toLowerCase();
      
      if (userEmail !== ADMIN_EMAIL) {
        res.status(403).json({ message: "Access denied" });
        return;
      }

      const { resetType } = req.body;
      
      // Get the local user ID
      const localUser = await storage.upsertUser({
        id: supabaseUser.id,
        email: supabaseUser.email || null,
        firstName: supabaseUser.user_metadata?.full_name?.split(' ')[0] || null,
        lastName: supabaseUser.user_metadata?.full_name?.split(' ').slice(1).join(' ') || null,
        profileImageUrl: supabaseUser.user_metadata?.avatar_url || null,
      });

      let deletedOrders = 0;
      let deletedQuizResults = 0;
      let deletedProgress = 0;

      if (resetType === "orders" || resetType === "all") {
        deletedOrders = await storage.deleteOrdersByUserId(localUser.id);
        await storage.deletePromoCodeRedemptionsByUserId(localUser.id);
      }

      if (resetType === "quiz_results" || resetType === "all") {
        deletedQuizResults = await storage.deleteQuizResultsByUserId(localUser.id);
      }

      if (resetType === "all") {
        deletedProgress += await storage.deletePlaybookProgressByUserId(localUser.id);
        deletedProgress += await storage.deleteActionPlanProgressByUserId(localUser.id);
        deletedProgress += await storage.deleteToolTrackingByUserId(localUser.id);
        deletedProgress += await storage.deletePlaybookNotesByUserId(localUser.id);
      }

      res.json({
        success: true,
        message: `Reset complete. Deleted: ${deletedOrders} orders, ${deletedQuizResults} quiz results, ${deletedProgress} progress records.`,
        deletedOrders,
        deletedQuizResults,
        deletedProgress,
      });
    } catch (error) {
      console.error("Error resetting admin test state:", error);
      res.status(500).json({ message: "Failed to reset test state" });
    }
  });

  // Get all promo codes (admin endpoint)
  app.get("/api/admin/promo-codes", async (req, res) => {
    try {
      const codes = await storage.getAllPromoCodes();
      res.json(codes);
    } catch (error: any) {
      console.error("Error fetching promo codes:", error);
      res.status(500).json({ message: "Error fetching promo codes" });
    }
  });

  // Get redemptions for a promo code (admin endpoint)
  app.get("/api/admin/promo-codes/:id/redemptions", async (req, res) => {
    try {
      const promoCodeId = parseInt(req.params.id);
      const redemptions = await storage.getPromoCodeRedemptions(promoCodeId);
      res.json(redemptions);
    } catch (error: any) {
      console.error("Error fetching redemptions:", error);
      res.status(500).json({ message: "Error fetching redemptions" });
    }
  });

  // Stripe Checkout Session - Create payment for premium report
  app.post("/api/create-checkout-session", writeLimiter, async (req, res) => {
    try {
      // Block checkout if email delivery is not configured
      if (!resend) {
        res.status(503).json({
          message:
            "Premium purchases are temporarily unavailable. Email delivery service is not configured.",
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

      const baseUrl =
        process.env.NODE_ENV === "production"
          ? "https://prolificpersonalities.com"
          : `${req.protocol}://${req.get("host")}`;

      // Create order record
      const order = await storage.createOrder({
        userId: quizResult.userId || null,
        sessionId,
        archetype,
        amount: 1900,
        status: "pending",
      });

      // Create Stripe Checkout Session
      const checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `Premium ${archetype
                  .split("-")
                  .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(" ")} Playbook`,
                description:
                  "Interactive web playbook with progress tracking, 30-day action plan, tool guides, and downloadable PDF",
              },
              unit_amount: 1900,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${baseUrl}/purchase-success?session_id=${sessionId}&archetype=${archetype}`,
        cancel_url: `${baseUrl}/results/${sessionId}?payment=cancelled`,
        metadata: {
          orderId: order.id.toString(),
          archetype,
          sessionId,
        },
      });

      // Track checkout attempt for abandoned cart emails (after we have Stripe session ID)
      try {
        const emailCapture =
          await storage.getEmailCaptureBySessionId(sessionId);
        await storage.createCheckoutAttempt({
          sessionId,
          archetype,
          email: emailCapture?.email || null,
          stripeCheckoutSessionId: checkoutSession.id,
        });
      } catch (err) {
        console.error("Failed to track checkout attempt:", err);
        // Don't block checkout if tracking fails
      }

      res.json({ sessionId: checkoutSession.id, url: checkoutSession.url });
    } catch (error: any) {
      console.error("Error creating checkout session:", error);
      res
        .status(500)
        .json({ message: "Error creating checkout session: " + error.message });
    }
  });

  // Verify payment and complete order if webhook hasn't processed it
  // This is a fallback for when webhooks don't fire (e.g., testing in development)
  app.post("/api/verify-payment", writeLimiter, async (req, res) => {
    try {
      const { sessionId, archetype } = req.body;

      if (!sessionId || !archetype) {
        res.status(400).json({ message: "Missing sessionId or archetype" });
        return;
      }

      // Find the order by sessionId and archetype
      const existingOrders = await storage.getOrderBySessionAndArchetype(sessionId, archetype);
      
      if (!existingOrders) {
        res.status(404).json({ message: "Order not found" });
        return;
      }

      // If already completed, just return success
      if (existingOrders.status === "completed") {
        res.json({ success: true, message: "Order already completed", order: existingOrders });
        return;
      }

      // Find the Stripe checkout session by looking at checkout_attempts
      const checkoutAttempt = await storage.getCheckoutAttemptBySessionArchetype(sessionId, archetype);
      
      if (!checkoutAttempt?.stripeCheckoutSessionId) {
        res.status(404).json({ message: "Stripe session not found" });
        return;
      }

      // Retrieve the Stripe session to verify payment
      const stripeSession = await stripe.checkout.sessions.retrieve(checkoutAttempt.stripeCheckoutSessionId);

      if (stripeSession.payment_status !== "paid") {
        res.status(400).json({ message: "Payment not completed" });
        return;
      }

      // Security: Validate Stripe session metadata matches the order
      const stripeOrderId = stripeSession.metadata?.orderId;
      const stripeSessionId = stripeSession.metadata?.sessionId;
      const stripeArchetype = stripeSession.metadata?.archetype;

      if (stripeOrderId !== existingOrders.id.toString()) {
        console.error(`❌ Order ID mismatch: Stripe ${stripeOrderId} vs DB ${existingOrders.id}`);
        res.status(403).json({ message: "Order verification failed" });
        return;
      }

      if (stripeSessionId !== sessionId || stripeArchetype !== archetype) {
        console.error(`❌ Session/archetype mismatch in verify-payment`);
        res.status(403).json({ message: "Order verification failed" });
        return;
      }

      const customerEmail = stripeSession.customer_details?.email;

      // Look up local user by email to link the order correctly
      // This handles legacy users with numeric IDs
      let userId: string | undefined;
      if (customerEmail) {
        const existingUser = await storage.getUserByEmail(customerEmail);
        if (existingUser) {
          userId = existingUser.id;
          console.log(`✅ Linking order to existing user ${userId} via email ${customerEmail}`);
        }
      }

      // Update order status to completed and link to user
      await storage.updateOrderStatus(
        existingOrders.id,
        "completed",
        stripeSession.payment_intent as string || null,
        customerEmail || undefined,
        undefined, // stripeSubscriptionId
        userId,
      );

      console.log(`✅ Order ${existingOrders.id} marked as completed via verify-payment fallback`);

      // Mark checkout attempt as completed
      await storage.markCheckoutCompleted(sessionId, archetype);

      // Only send email if we haven't already (check completedAt to avoid duplicate emails)
      // If completedAt was null before this update, we're the first to complete it
      const orderBeforeUpdate = existingOrders.completedAt;
      if (resend && customerEmail && archetype && !orderBeforeUpdate) {
        try {
          const archetypeInfo = getArchetypeInfo(archetype);
          const pdfAsset = getPremiumAssetForArchetype(archetype);

          if (archetypeInfo && pdfAsset) {
            const pdfPath = path.join(process.cwd(), "attached_assets", pdfAsset.pdfFilename);
            
            if (fs.existsSync(pdfPath)) {
              const pdfBuffer = fs.readFileSync(pdfPath);
              const pdfBase64 = pdfBuffer.toString("base64");

              const baseUrl = process.env.APP_URL || 
                (process.env.NODE_ENV === "production" ? "https://prolificpersonalities.com" : "http://localhost:5000");
              const resultsUrl = `${baseUrl}/results/${sessionId}`;

              const { subject, html } = generatePremiumPlaybookEmail({
                recipientEmail: customerEmail,
                archetype: archetypeInfo,
                resultsUrl,
              });

              const emailResponse = await resend.emails.send({
                from: "Prolific Personalities <support@prolificpersonalities.com>",
                to: customerEmail,
                subject,
                html,
                attachments: [{ filename: pdfAsset.pdfFilename, content: pdfBase64 }],
              });

              if (emailResponse.error) {
                console.error("❌ Error sending email via verify-payment:", emailResponse.error);
              } else {
                console.log(`✅ Premium PDF emailed to ${customerEmail} via verify-payment fallback`);
              }
            }
          }
        } catch (emailError) {
          console.error("❌ Error in verify-payment email flow:", emailError);
        }
      }

      res.json({ success: true, message: "Payment verified and order completed", order: existingOrders });
    } catch (error: any) {
      console.error("Error verifying payment:", error);
      res.status(500).json({ message: "Error verifying payment: " + error.message });
    }
  });

  // Pre-purchase checkout - Pay first, then take quiz
  app.post("/api/create-prepurchase-session", writeLimiter, async (req, res) => {
    try {
      // Block checkout if email delivery is not configured
      if (!resend) {
        res.status(503).json({
          message:
            "Premium purchases are temporarily unavailable. Email delivery service is not configured.",
        });
        return;
      }

      const { email } = req.body;

      const baseUrl =
        process.env.NODE_ENV === "production"
          ? "https://prolificpersonalities.com"
          : `${req.protocol}://${req.get("host")}`;

      // Check current purchase count to determine price
      const purchaseCount = await storage.getPlaybookPurchaseCount();
      const isEarlyBird = purchaseCount < 100;
      const amount = isEarlyBird ? 1900 : 2900;

      // Generate a temporary prepurchase session ID and verification token
      const prepurchaseSessionId = `prepurchase-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const verificationToken = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}-${Math.random().toString(36).substring(2, 15)}`;

      // Create order record with temporary sessionId (will be linked to quiz after)
      const order = await storage.createOrder({
        userId: null,
        sessionId: prepurchaseSessionId,
        archetype: "pending", // Will be updated after quiz
        amount,
        status: "pending",
        customerEmail: email || null,
      });

      // Create Stripe Checkout Session with verification token in metadata
      const checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        customer_email: email || undefined,
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Complete Productivity Playbook",
                description:
                  "Interactive web playbook with progress tracking, 30-day action plan, tool guides, and downloadable PDF. Take the quiz after purchase to get your personalized results.",
              },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${baseUrl}/quiz?prepaid=true&orderId=${order.id}&token=${verificationToken}`,
        cancel_url: `${baseUrl}/pricing?payment=cancelled`,
        metadata: {
          orderId: order.id.toString(),
          productType: "prepurchase",
          verificationToken, // Store token for validation
        },
      });

      // Store the Stripe checkout session ID for token verification later
      await storage.updateOrderStripeSessionId(order.id, checkoutSession.id);

      res.json({ sessionId: checkoutSession.id, url: checkoutSession.url });
    } catch (error: any) {
      console.error("Error creating prepurchase session:", error);
      res
        .status(500)
        .json({ message: "Error creating checkout session: " + error.message });
    }
  });

  // Link a prepurchase order to a quiz session after quiz completion
  app.post("/api/link-prepurchase-order", writeLimiter, async (req, res) => {
    try {
      const { orderId, sessionId, archetype, token } = req.body;

      if (!orderId || !sessionId || !archetype || !token) {
        res.status(400).json({ message: "Missing required fields" });
        return;
      }

      // Verify the order exists and is completed
      const order = await storage.getOrderById(parseInt(orderId));
      if (!order) {
        res.status(404).json({ message: "Order not found" });
        return;
      }

      if (order.status !== "completed") {
        res.status(400).json({ message: "Order is not completed" });
        return;
      }

      // Prevent relinking if order already has a real quiz session
      if (order.archetype !== "pending") {
        res.status(400).json({ message: "Order already linked to a quiz session" });
        return;
      }

      // Verify this is a prepurchase order
      if (!order.sessionId?.startsWith('prepurchase-')) {
        res.status(403).json({ message: "Invalid order type" });
        return;
      }

      // Verify the token by retrieving the Stripe checkout session and checking metadata
      if (!order.stripeSessionId) {
        res.status(400).json({ message: "Order missing Stripe session" });
        return;
      }

      try {
        const stripeSession = await stripe.checkout.sessions.retrieve(order.stripeSessionId);
        const storedToken = stripeSession.metadata?.verificationToken;
        if (!storedToken || storedToken !== token) {
          res.status(403).json({ message: "Invalid verification token" });
          return;
        }
      } catch (stripeError) {
        console.error("Failed to verify token with Stripe:", stripeError);
        res.status(500).json({ message: "Failed to verify purchase" });
        return;
      }

      // Verify quiz result exists
      const quizResult = await storage.getQuizResultBySessionId(sessionId);
      if (!quizResult) {
        res.status(404).json({ message: "Quiz result not found" });
        return;
      }

      // Update the order with the quiz session and archetype
      await storage.linkOrderToQuizSession(parseInt(orderId), sessionId, archetype);
      console.log(`✅ Linked prepurchase order ${orderId} to quiz session ${sessionId} with archetype ${archetype}`);

      res.json({ success: true });
    } catch (error: any) {
      console.error("Error linking prepurchase order:", error);
      res.status(500).json({ message: "Failed to link order: " + error.message });
    }
  });

  // Stripe Checkout Session - Create subscription for Productivity Partner
  app.post(
    "/api/create-subscription-session",
    writeLimiter,
    async (req, res) => {
      try {
        // Block checkout if email delivery is not configured
        if (!resend) {
          res.status(503).json({
            message:
              "Premium purchases are temporarily unavailable. Email delivery service is not configured.",
          });
          return;
        }

        const { archetype, sessionId, billingPeriod } = req.body;

        if (!archetype || !sessionId || !billingPeriod) {
          res
            .status(400)
            .json({
              message: "Missing archetype, sessionId, or billingPeriod",
            });
          return;
        }

        if (!["monthly", "yearly"].includes(billingPeriod)) {
          res
            .status(400)
            .json({
              message: "Invalid billing period. Must be 'monthly' or 'yearly'",
            });
          return;
        }

        // Verify quiz result exists
        const quizResult = await storage.getQuizResultBySessionId(sessionId);
        if (!quizResult) {
          res.status(404).json({ message: "Quiz result not found" });
          return;
        }

        const baseUrl =
          process.env.NODE_ENV === "production"
            ? "https://prolificpersonalities.com"
            : `${req.protocol}://${req.get("host")}`;

        // Determine price based on billing period
        // Monthly: $7/month, Yearly: $75/year
        const unitAmount = billingPeriod === "monthly" ? 700 : 7500;
        const interval = billingPeriod === "monthly" ? "month" : "year";

        // Create order record for subscription
        const order = await storage.createOrder({
          userId: quizResult.userId || null,
          sessionId,
          archetype,
          amount: unitAmount,
          status: "pending",
          productType: "productivity_partner",
          billingPeriod,
        });

        // Create Stripe Checkout Session for subscription
        const checkoutSession = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: "Productivity Partner",
                  description:
                    "Unlimited AI coaching, chat history, priority support, and early access to new features",
                },
                unit_amount: unitAmount,
                recurring: {
                  interval: interval as "month" | "year",
                },
              },
              quantity: 1,
            },
          ],
          mode: "subscription",
          success_url: `${baseUrl}/purchase-success?session_id=${sessionId}&archetype=${archetype}&product=partner`,
          cancel_url: `${baseUrl}/results/${sessionId}?payment=cancelled`,
          metadata: {
            orderId: order.id.toString(),
            archetype,
            sessionId,
            productType: "productivity_partner",
            billingPeriod,
          },
        });

        // Track checkout attempt for abandoned cart emails (after we have Stripe session ID)
        try {
          const emailCapture =
            await storage.getEmailCaptureBySessionId(sessionId);
          await storage.createCheckoutAttempt({
            sessionId,
            archetype,
            email: emailCapture?.email || null,
            stripeCheckoutSessionId: checkoutSession.id,
          });
        } catch (err) {
          console.error("Failed to track checkout attempt:", err);
        }

        res.json({ sessionId: checkoutSession.id, url: checkoutSession.url });
      } catch (error: any) {
        console.error("Error creating subscription session:", error);
        res
          .status(500)
          .json({
            message: "Error creating subscription session: " + error.message,
          });
      }
    },
  );

  // Stripe webhook is registered separately in registerWebhookRoute() before JSON middleware

  // Get user's orders
  app.get("/api/orders", supabaseAuth, async (req: any, res) => {
    try {
      const supabaseUser = req.supabaseUser;
      // Get the local user ID (may differ from Supabase ID for legacy users)
      const localUser = await storage.upsertUser({
        id: supabaseUser.id,
        email: supabaseUser.email || null,
        firstName: supabaseUser.user_metadata?.full_name?.split(' ')[0] || null,
        lastName: supabaseUser.user_metadata?.full_name?.split(' ').slice(1).join(' ') || null,
        profileImageUrl: supabaseUser.user_metadata?.avatar_url || null,
      });
      const orders = await storage.getOrdersByUserId(localUser.id);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // Removed unauthenticated order check endpoint - security risk

  // Download premium PDF
  app.get("/api/download/:orderId", supabaseAuth, async (req: any, res) => {
    try {
      const { orderId } = req.params;
      const supabaseUser = req.supabaseUser;
      
      // Get the local user ID (may differ from Supabase ID for legacy users)
      const localUser = await storage.upsertUser({
        id: supabaseUser.id,
        email: supabaseUser.email || null,
        firstName: supabaseUser.user_metadata?.full_name?.split(' ')[0] || null,
        lastName: supabaseUser.user_metadata?.full_name?.split(' ').slice(1).join(' ') || null,
        profileImageUrl: supabaseUser.user_metadata?.avatar_url || null,
      });
      const userId = localUser.id;

      const order = await storage.getOrderById(parseInt(orderId));

      if (!order) {
        res.status(404).json({ message: "Order not found" });
        return;
      }

      if (order.userId !== userId) {
        res.status(403).json({ message: "Unauthorized" });
        return;
      }

      if (order.status !== "completed") {
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
      const pdfPath = path.join(
        process.cwd(),
        "attached_assets",
        asset.pdfFilename,
      );

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

  // Middleware to check premium access (pay once, lifetime access to ALL archetypes)
  const hasPremiumAccess = async (req: any, res: any, next: any) => {
    try {
      const supabaseUser = req.supabaseUser;
      const archetype = req.params.archetype || req.body.archetype;
      const sessionId = req.query.sessionId || req.body.sessionId;

      if (!archetype) {
        res.status(400).json({ message: "Archetype is required" });
        return;
      }

      // Get the local user ID (may differ from Supabase ID for legacy users)
      const localUser = await storage.upsertUser({
        id: supabaseUser.id,
        email: supabaseUser.email || null,
        firstName: supabaseUser.user_metadata?.full_name?.split(' ')[0] || null,
        lastName: supabaseUser.user_metadata?.full_name?.split(' ').slice(1).join(' ') || null,
        profileImageUrl: supabaseUser.user_metadata?.avatar_url || null,
      });
      const userId = localUser.id;

      // Pay once, lifetime access: Check if user has ANY completed purchase
      const hasAccess = await storage.hasAnyPremiumAccess(userId, sessionId);

      if (!hasAccess) {
        res
          .status(403)
          .json({
            message:
              "Premium access required. Please purchase a playbook to unlock lifetime access.",
          });
        return;
      }

      // Store local user ID in request for downstream use
      req.localUserId = userId;
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
  app.get(
    "/api/playbook/:archetype/progress",
    supabaseAuth,
    hasPremiumAccess,
    async (req: any, res) => {
      try {
        const userId = req.localUserId; // Set by hasPremiumAccess middleware
        const { archetype } = req.params;
        const progress = await storage.getPlaybookProgress(userId, archetype);
        res.json(progress);
      } catch (error) {
        console.error("Error fetching playbook progress:", error);
        res.status(500).json({ message: "Failed to fetch progress" });
      }
    },
  );

  // Update chapter completion
  app.post(
    "/api/playbook/:archetype/progress/chapter",
    writeLimiter,
    supabaseAuth,
    hasPremiumAccess,
    async (req: any, res) => {
      try {
        const userId = req.localUserId; // Set by hasPremiumAccess middleware
        const { archetype } = req.params;
        const { chapterId, completed } = req.body;

        if (typeof completed !== "boolean") {
          res.status(400).json({ message: "completed must be a boolean" });
          return;
        }

        const progress = await storage.updateChapterProgress(
          userId,
          archetype,
          chapterId,
          completed,
        );
        res.json(progress);
      } catch (error) {
        console.error("Error updating chapter progress:", error);
        res.status(500).json({ message: "Failed to update progress" });
      }
    },
  );

  // Get action plan progress
  app.get(
    "/api/playbook/:archetype/action-plan",
    supabaseAuth,
    hasPremiumAccess,
    async (req: any, res) => {
      try {
        const userId = req.localUserId; // Set by hasPremiumAccess middleware
        const { archetype } = req.params;
        const progress = await storage.getActionPlanProgress(userId, archetype);
        res.json(progress);
      } catch (error) {
        console.error("Error fetching action plan progress:", error);
        res.status(500).json({ message: "Failed to fetch action plan" });
      }
    },
  );

  // Update action plan task
  app.post(
    "/api/playbook/:archetype/action-plan/task",
    writeLimiter,
    supabaseAuth,
    hasPremiumAccess,
    async (req: any, res) => {
      try {
        const userId = req.localUserId; // Set by hasPremiumAccess middleware
        const { archetype } = req.params;
        const { dayNumber, taskId, completed } = req.body;

        if (typeof completed !== "boolean" || typeof dayNumber !== "number") {
          res.status(400).json({ message: "Invalid request data" });
          return;
        }

        const progress = await storage.updateActionPlanTask(
          userId,
          archetype,
          dayNumber,
          taskId,
          completed,
        );
        res.json(progress);
      } catch (error) {
        console.error("Error updating action plan task:", error);
        res.status(500).json({ message: "Failed to update task" });
      }
    },
  );

  // Get tool tracking
  app.get(
    "/api/playbook/:archetype/tools",
    supabaseAuth,
    hasPremiumAccess,
    async (req: any, res) => {
      try {
        const userId = req.localUserId; // Set by hasPremiumAccess middleware
        const { archetype } = req.params;
        const tracking = await storage.getToolTracking(userId, archetype);
        res.json(tracking);
      } catch (error) {
        console.error("Error fetching tool tracking:", error);
        res.status(500).json({ message: "Failed to fetch tool tracking" });
      }
    },
  );

  // Update tool tracking status
  app.post(
    "/api/playbook/:archetype/tools/update",
    writeLimiter,
    supabaseAuth,
    hasPremiumAccess,
    async (req: any, res) => {
      try {
        const userId = req.localUserId; // Set by hasPremiumAccess middleware
        const { archetype } = req.params;
        const { toolId, status, notes } = req.body;

        if (!["not_started", "testing", "using_daily"].includes(status)) {
          res.status(400).json({ message: "Invalid tool status" });
          return;
        }

        const tracking = await storage.updateToolTracking(
          userId,
          archetype,
          toolId,
          status,
          notes,
        );
        res.json(tracking);
      } catch (error) {
        console.error("Error updating tool tracking:", error);
        res.status(500).json({ message: "Failed to update tool tracking" });
      }
    },
  );

  // Get playbook notes
  app.get(
    "/api/playbook/:archetype/notes",
    supabaseAuth,
    hasPremiumAccess,
    async (req: any, res) => {
      try {
        const userId = req.localUserId; // Set by hasPremiumAccess middleware
        const { archetype } = req.params;
        const { sectionId } = req.query;
        const notes = await storage.getPlaybookNotes(
          userId,
          archetype,
          sectionId as string | undefined,
        );
        res.json(notes);
      } catch (error) {
        console.error("Error fetching notes:", error);
        res.status(500).json({ message: "Failed to fetch notes" });
      }
    },
  );

  // Create playbook note
  app.post(
    "/api/playbook/:archetype/notes",
    writeLimiter,
    supabaseAuth,
    hasPremiumAccess,
    async (req: any, res) => {
      try {
        const userId = req.localUserId; // Set by hasPremiumAccess middleware
        const { archetype } = req.params;
        const { sectionId, content } = req.body;

        if (!sectionId || !content) {
          res
            .status(400)
            .json({ message: "sectionId and content are required" });
          return;
        }

        const note = await storage.savePlaybookNote(
          userId,
          archetype,
          sectionId,
          content,
        );
        res.json(note);
      } catch (error) {
        console.error("Error creating note:", error);
        res.status(500).json({ message: "Failed to create note" });
      }
    },
  );

  // Update playbook note
  app.put(
    "/api/playbook/notes/:noteId",
    writeLimiter,
    supabaseAuth,
    async (req: any, res) => {
      try {
        const { noteId } = req.params;
        const { content } = req.body;

        if (!content) {
          res.status(400).json({ message: "content is required" });
          return;
        }

        const note = await storage.updatePlaybookNote(
          parseInt(noteId),
          content,
        );
        if (!note) {
          res.status(404).json({ message: "Note not found" });
          return;
        }

        res.json(note);
      } catch (error) {
        console.error("Error updating note:", error);
        res.status(500).json({ message: "Failed to update note" });
      }
    },
  );

  // Delete playbook note
  app.delete(
    "/api/playbook/notes/:noteId",
    writeLimiter,
    supabaseAuth,
    async (req: any, res) => {
      try {
        const { noteId } = req.params;
        await storage.deletePlaybookNote(parseInt(noteId));
        res.json({ message: "Note deleted successfully" });
      } catch (error) {
        console.error("Error deleting note:", error);
        res.status(500).json({ message: "Failed to delete note" });
      }
    },
  );

  // Check if sessionId has premium access (no auth required - for prepaid anonymous users)
  app.get("/api/playbook/:archetype/session-access", async (req, res) => {
    try {
      const { archetype } = req.params;
      const sessionId = req.query.sessionId as string | undefined;

      if (!sessionId) {
        res.json({ hasAccess: false });
        return;
      }

      // Check if there's a completed order for this sessionId
      const order = await storage.getOrderBySessionId(sessionId);
      const hasAccess = order?.status === 'completed';
      
      console.log('[Session Access Debug] sessionId:', sessionId, '| archetype:', archetype, '| order:', order?.id, '| hasAccess:', hasAccess);
      res.json({ hasAccess, orderEmail: hasAccess ? order?.customerEmail : null });
    } catch (error) {
      console.error("Error checking session access:", error);
      res.status(500).json({ message: "Failed to check access" });
    }
  });

  // Check if user has premium access to an archetype
  app.get(
    "/api/playbook/:archetype/access",
    supabaseAuth,
    async (req: any, res) => {
      try {
        const supabaseUser = req.supabaseUser;
        const { archetype } = req.params;
        const sessionId = req.query.sessionId as string | undefined;

        // Ensure user exists in local users table (needed for claiming orders by sessionId)
        // IMPORTANT: upsertUser may return an existing user with a different ID (email-based matching)
        const localUser = await storage.upsertUser({
          id: supabaseUser.id,
          email: supabaseUser.email || null,
          firstName: supabaseUser.user_metadata?.full_name?.split(' ')[0] || null,
          lastName: supabaseUser.user_metadata?.full_name?.split(' ').slice(1).join(' ') || null,
          profileImageUrl: supabaseUser.user_metadata?.avatar_url || null,
        });
        
        // Use the local user's ID (which may differ from Supabase ID if user existed before)
        const userId = localUser.id;
        console.log('[Playbook Access Debug] supabaseId:', supabaseUser.id, '| localUserId:', userId, '| archetype:', archetype, '| sessionId:', sessionId);

        // Pay once, lifetime access: Check if user has ANY completed purchase
        const hasAccess = await storage.hasAnyPremiumAccess(userId, sessionId);
        console.log('[Playbook Access Debug] hasAccess:', hasAccess);
        res.json({ hasAccess });
      } catch (error) {
        console.error("Error checking access:", error);
        res.status(500).json({ message: "Failed to check access" });
      }
    },
  );

  // Resend playbook email
  app.post(
    "/api/playbook/:archetype/resend-email",
    supabaseAuth,
    async (req: any, res) => {
      try {
        if (!resend) {
          res.status(503).json({ message: "Email service not configured" });
          return;
        }

        const supabaseUser = req.supabaseUser;
        const { archetype } = req.params;
        const { sessionId } = req.body;

        if (!supabaseUser.email) {
          res.status(400).json({ message: "No email address found for your account" });
          return;
        }

        // Get the local user ID
        const localUser = await storage.upsertUser({
          id: supabaseUser.id,
          email: supabaseUser.email || null,
          firstName: supabaseUser.user_metadata?.full_name?.split(' ')[0] || null,
          lastName: supabaseUser.user_metadata?.full_name?.split(' ').slice(1).join(' ') || null,
          profileImageUrl: supabaseUser.user_metadata?.avatar_url || null,
        });
        const userId = localUser.id;

        // Pay once, lifetime access: Check if user has ANY completed purchase
        const hasAccess = await storage.hasAnyPremiumAccess(userId, sessionId);
        if (!hasAccess) {
          res.status(403).json({ message: "You don't have access to this playbook" });
          return;
        }

        // Get archetype info
        const archetypeInfo = getArchetypeInfo(archetype);
        if (!archetypeInfo) {
          res.status(400).json({ message: "Invalid archetype" });
          return;
        }

        // Get PDF for archetype
        const pdfAsset = getPremiumAssetForArchetype(archetype);
        if (!pdfAsset) {
          res.status(404).json({ message: "Playbook PDF not found" });
          return;
        }

        const pdfPath = path.join(process.cwd(), "attached_assets", pdfAsset.pdfFilename);
        if (!fs.existsSync(pdfPath)) {
          res.status(404).json({ message: "Playbook PDF file not found" });
          return;
        }

        // Read and encode PDF
        const pdfBuffer = fs.readFileSync(pdfPath);
        const pdfBase64 = pdfBuffer.toString("base64");

        // Generate results URL
        const baseUrl = process.env.APP_URL || 
          (process.env.NODE_ENV === "production" ? "https://prolificpersonalities.com" : "http://localhost:5000");
        const resultsUrl = sessionId ? `${baseUrl}/results/${sessionId}` : `${baseUrl}/dashboard`;

        // Generate and send email
        const { subject, html } = generatePremiumPlaybookEmail({
          recipientEmail: supabaseUser.email,
          archetype: archetypeInfo,
          resultsUrl,
        });

        const emailResponse = await resend.emails.send({
          from: "Prolific Personalities <support@prolificpersonalities.com>",
          to: supabaseUser.email,
          subject: `[Resend] ${subject}`,
          html,
          attachments: [
            {
              filename: pdfAsset.pdfFilename,
              content: pdfBase64,
            },
          ],
        });

        if (emailResponse.error) {
          console.error("Error resending playbook email:", emailResponse.error);
          res.status(500).json({ message: "Failed to send email" });
          return;
        }

        console.log(`✅ Playbook email resent to ${supabaseUser.email}`);
        res.json({ message: "Email sent successfully" });
      } catch (error) {
        console.error("Error resending playbook email:", error);
        res.status(500).json({ message: "Failed to resend email" });
      }
    },
  );

  // Download playbook PDF
  app.get(
    "/api/playbook/:archetype/pdf",
    supabaseAuth,
    async (req: any, res) => {
      try {
        const supabaseUser = req.supabaseUser;
        const { archetype } = req.params;

        // Get the local user ID (may differ from Supabase ID for legacy users)
        const localUser = await storage.upsertUser({
          id: supabaseUser.id,
          email: supabaseUser.email || null,
          firstName: supabaseUser.user_metadata?.full_name?.split(' ')[0] || null,
          lastName: supabaseUser.user_metadata?.full_name?.split(' ').slice(1).join(' ') || null,
          profileImageUrl: supabaseUser.user_metadata?.avatar_url || null,
        });
        const userId = localUser.id;

        // Pay once, lifetime access: Check if user has ANY completed purchase
        const hasAccess = await storage.hasAnyPremiumAccess(userId);
        if (!hasAccess) {
          res.status(403).json({ message: "You don't have access to this playbook" });
          return;
        }

        // Get PDF asset for archetype
        const asset = getPremiumAssetForArchetype(archetype);
        if (!asset) {
          res.status(404).json({ message: "PDF not found for this archetype" });
          return;
        }

        // Safely resolve PDF path
        const pdfPath = path.join(
          process.cwd(),
          "attached_assets",
          asset.pdfFilename,
        );

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
        console.error("Error downloading playbook PDF:", error);
        res.status(500).json({ message: "Failed to download PDF" });
      }
    },
  );

  // Process abandoned cart emails (call this from a cron job or manually)
  app.post("/api/process-abandoned-carts", async (req, res) => {
    try {
      if (!resend) {
        res.status(503).json({ message: "Email service not configured" });
        return;
      }

      const abandonedCheckouts = await storage.getAbandonedCheckouts();
      console.log(
        `Found ${abandonedCheckouts.length} abandoned checkouts to process`,
      );

      let sentCount = 0;
      const baseUrl = process.env.REPLIT_DEV_DOMAIN
        ? `https://${process.env.REPLIT_DEV_DOMAIN}`
        : "https://prolificpersonalities.com";

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

          const { data: emailData } = await resend.emails.send({
            from: "Prolific Personalities <support@prolificpersonalities.com>",
            to: checkout.email,
            subject,
            html,
          });

          await storage.markAbandonedEmailSent(checkout.id);
          await storage.logEmail(checkout.email, 'abandoned_cart', checkout.archetype, emailData?.id);
          sentCount++;
          console.log(`✅ Abandoned cart email sent to ${checkout.email}`);
        } catch (emailError) {
          console.error(
            `Failed to send abandoned cart email to ${checkout.email}:`,
            emailError,
          );
        }
      }

      res.json({
        message: `Processed ${abandonedCheckouts.length} abandoned carts, sent ${sentCount} emails`,
      });
    } catch (error) {
      console.error("Error processing abandoned carts:", error);
      res.status(500).json({ message: "Failed to process abandoned carts" });
    }
  });

  // Unsubscribe endpoint
  app.post("/api/unsubscribe", async (req, res) => {
    try {
      const { email, reason, reasonOther, rating, feedbackText } = z
        .object({
          email: z.string().email(),
          reason: z.string(),
          reasonOther: z.string().optional(),
          rating: z.string().optional(),
          feedbackText: z.string().optional(),
        })
        .parse(req.body);

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

      const { email } = z
        .object({
          email: z.string().email(),
        })
        .parse(req.body);

      const baseUrl = process.env.REPLIT_DEV_DOMAIN
        ? `https://${process.env.REPLIT_DEV_DOMAIN}`
        : "https://prolificpersonalities.com";

      // Sample archetype for testing
      const sampleArchetype = {
        id: "strategic-planner",
        title: "The Strategic Planner",
        tagline: "Methodical mastery through systematic thinking",
        description:
          "Strategic Planners thrive on structure, long-term goals, and detailed planning. You excel at breaking complex projects into manageable steps and maintaining focus on the big picture while executing tactical details.",
      };

      const sampleScores = {
        structure: 85,
        motivation: 70,
        cognitive: 65,
        task: 80,
      };

      const results: Array<{ type: string; status: string; error?: string; resendId?: string }> = [];
      
      // Helper function to send email with proper error checking and delay
      const sendTestEmail = async (name: string, sendFn: () => Promise<{ data: any; error: any }>) => {
        try {
          const { data, error } = await sendFn();
          if (error) {
            console.error(`❌ ${name} failed:`, error);
            results.push({ type: name, status: "failed", error: error.message || String(error) });
          } else {
            console.log(`✅ ${name} sent:`, data?.id);
            results.push({ type: name, status: "sent", resendId: data?.id });
          }
          // Delay of 600ms to stay under Resend's 2 requests/second rate limit
          await new Promise(resolve => setTimeout(resolve, 600));
        } catch (e) {
          console.error(`❌ ${name} threw error:`, e);
          results.push({ type: name, status: "failed", error: String(e) });
        }
      };

      // 1. Send Welcome Email
      await sendTestEmail("Welcome Email", () => 
        resend.emails.send({
          from: "Prolific Personalities <support@prolificpersonalities.com>",
          to: email,
          subject: `[TEST] ${generateWelcomeEmail({
            recipientEmail: email,
            archetype: { id: sampleArchetype.id, title: sampleArchetype.title },
            resultsUrl: `${baseUrl}/results?session=test-session-123`,
            unsubscribeUrl: `${baseUrl}/unsubscribe?email=${encodeURIComponent(email)}`,
          }).subject}`,
          html: generateWelcomeEmail({
            recipientEmail: email,
            archetype: { id: sampleArchetype.id, title: sampleArchetype.title },
            resultsUrl: `${baseUrl}/results?session=test-session-123`,
            unsubscribeUrl: `${baseUrl}/unsubscribe?email=${encodeURIComponent(email)}`,
          }).html,
        })
      );

      // 2. Send Abandoned Cart Email
      await sendTestEmail("Abandoned Cart Email", () => 
        resend.emails.send({
          from: "Prolific Personalities <support@prolificpersonalities.com>",
          to: email,
          subject: `[TEST] ${generateAbandonedCartEmail({
            recipientEmail: email,
            archetype: { id: sampleArchetype.id, title: sampleArchetype.title },
            checkoutUrl: `${baseUrl}/results/test-session-123#premium`,
            unsubscribeUrl: `${baseUrl}/unsubscribe?email=${encodeURIComponent(email)}`,
          }).subject}`,
          html: generateAbandonedCartEmail({
            recipientEmail: email,
            archetype: { id: sampleArchetype.id, title: sampleArchetype.title },
            checkoutUrl: `${baseUrl}/results/test-session-123#premium`,
            unsubscribeUrl: `${baseUrl}/unsubscribe?email=${encodeURIComponent(email)}`,
          }).html,
        })
      );

      // 3. Send Results Email
      await sendTestEmail("Results Email", () => 
        resend.emails.send({
          from: "Prolific Personalities <support@prolificpersonalities.com>",
          to: email,
          subject: `[TEST] ${generateResultsEmail({
            recipientEmail: email,
            archetype: sampleArchetype,
            scores: sampleScores,
            resultsUrl: `${baseUrl}/results/test-session-123`,
          }).subject}`,
          html: generateResultsEmail({
            recipientEmail: email,
            archetype: sampleArchetype,
            scores: sampleScores,
            resultsUrl: `${baseUrl}/results/test-session-123`,
          }).html,
        })
      );

      // Sample user data for nurture/onboarding emails
      const sampleUser = {
        email,
        archetype: sampleArchetype.id,
        capturedAt: new Date(),
      };

      // 4. Nurture Sequence Emails (5 emails)
      const nurtureEmails = [
        { name: "Nurture Day 3", generator: generateDay3NurtureEmail },
        { name: "Nurture Day 5", generator: generateDay5NurtureEmail },
        { name: "Nurture Day 7", generator: generateDay7NurtureEmail },
        { name: "Nurture Day 10", generator: generateDay10NurtureEmail },
        { name: "Nurture Day 14", generator: generateDay14NurtureEmail },
      ];

      for (const { name, generator } of nurtureEmails) {
        const { subject, html } = generator(sampleUser);
        await sendTestEmail(name, () =>
          resend.emails.send({
            from: "Prolific Personalities <support@prolificpersonalities.com>",
            to: email,
            subject: `[TEST] ${subject}`,
            html,
          })
        );
      }

      // 5. Onboarding Sequence Emails (3 emails)
      const onboardingEmails = [
        { name: "Onboarding Day 3", generator: generateDay3OnboardEmail },
        { name: "Onboarding Day 7", generator: generateDay7OnboardEmail },
        { name: "Onboarding Day 30", generator: generateDay30OnboardEmail },
      ];

      for (const { name, generator } of onboardingEmails) {
        const { subject, html } = generator(sampleUser);
        await sendTestEmail(name, () =>
          resend.emails.send({
            from: "Prolific Personalities <support@prolificpersonalities.com>",
            to: email,
            subject: `[TEST] ${subject}`,
            html,
          })
        );
      }

      // 6. Weekly Accountability Emails (all 8 variations)
      for (let week = 1; week <= 8; week++) {
        const weeklyEmail = generateWeeklyAccountabilityEmail({
          firstName: null,
          archetype: sampleArchetype.title,
          weekNumber: week,
        });
        await sendTestEmail(`Weekly Accountability Week ${week}`, () =>
          resend.emails.send({
            from: "Prolific Personalities <support@prolificpersonalities.com>",
            to: email,
            subject: `[TEST] ${weeklyEmail.subject}`,
            html: weeklyEmail.html,
          })
        );
      }

      console.log(`✅ Test emails sent to ${email}:`, results);
      res.json({ message: "Test emails sent", results, totalEmails: results.length });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res
          .status(400)
          .json({ message: "Invalid email address", errors: error.errors });
      } else {
        console.error("Error sending test emails:", error);
        res.status(500).json({ message: "Failed to send test emails" });
      }
    }
  });

  // Abandoned Cart Email Cron Job - Call this endpoint daily via external cron service
  // Example: Use cron-job.org to hit this endpoint daily with the CRON_SECRET header
  app.post("/api/cron/abandoned-cart", async (req, res) => {
    // Verify cron secret for security
    const cronSecret = process.env.CRON_SECRET;
    const providedSecret =
      req.headers["x-cron-secret"] ||
      req.headers.authorization?.replace("Bearer ", "");

    if (cronSecret && providedSecret !== cronSecret) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (!resend) {
      res.status(503).json({ error: "Email service not configured" });
      return;
    }

    try {
      // Get abandoned checkouts (older than 1 hour, not completed, email not sent)
      const abandonedCheckouts = await storage.getAbandonedCheckouts();

      const results = [];

      for (const checkout of abandonedCheckouts) {
        let email = checkout.email;
        
        // If no email, try to get it from Stripe checkout session
        if (!email && checkout.stripeCheckoutSessionId && stripe) {
          try {
            const stripeSession = await stripe.checkout.sessions.retrieve(checkout.stripeCheckoutSessionId);
            if (stripeSession.customer_details?.email) {
              email = stripeSession.customer_details.email;
              // Update the checkout attempt with the email for future use
              await storage.updateCheckoutAttemptEmail(checkout.id, email);
            }
          } catch (stripeError) {
            console.error(`Failed to fetch email from Stripe for checkout ${checkout.id}:`, stripeError);
          }
        }
        
        if (!email) {
          results.push({
            id: checkout.id,
            status: "skipped",
            reason: "No email available",
          });
          continue;
        }

        try {
          // Get archetype info
          const archetypeInfo = getArchetypeInfo(checkout.archetype);
          if (!archetypeInfo) {
            results.push({
              id: checkout.id,
              status: "skipped",
              reason: "Unknown archetype",
            });
            continue;
          }

          const baseUrl =
            process.env.NODE_ENV === "production"
              ? "https://prolificpersonalities.com"
              : `${req.protocol}://${req.get("host")}`;

          // Generate abandoned cart email
          const { subject, html } = generateAbandonedCartEmail({
            recipientEmail: email,
            archetype: {
              id: checkout.archetype,
              title: archetypeInfo.title,
            },
            checkoutUrl: `${baseUrl}/results/${checkout.sessionId}#premium`,
            unsubscribeUrl: `${baseUrl}/unsubscribe?email=${encodeURIComponent(email)}`,
          });

          // Send the email
          const { data, error } = await resend.emails.send({
            from: "Prolific Personalities <support@prolificpersonalities.com>",
            to: email,
            subject,
            html,
          });

          // Check for Resend errors before marking as sent
          if (error) {
            console.error(`Resend error for ${email}:`, error);
            results.push({
              id: checkout.id,
              email: email,
              status: "failed",
              error: error.message,
            });
            continue;
          }

          // Mark as sent only on success
          await storage.markAbandonedEmailSent(checkout.id);
          results.push({
            id: checkout.id,
            email: email,
            status: "sent",
            resendId: data?.id,
          });
          console.log(
            `✅ Abandoned cart email sent to ${email} (${data?.id})`,
          );
        } catch (err) {
          console.error(
            `Failed to send abandoned cart email to ${email}:`,
            err,
          );
          results.push({
            id: checkout.id,
            email: email,
            status: "failed",
            error: String(err),
          });
        }
      }

      console.log(
        `📧 Abandoned cart cron completed: ${results.filter((r) => r.status === "sent").length} sent, ${results.filter((r) => r.status === "skipped").length} skipped, ${results.filter((r) => r.status === "failed").length} failed`,
      );
      res.json({
        success: true,
        processed: abandonedCheckouts.length,
        sent: results.filter((r) => r.status === "sent").length,
        skipped: results.filter((r) => r.status === "skipped").length,
        failed: results.filter((r) => r.status === "failed").length,
        results,
      });
    } catch (error) {
      console.error("Abandoned cart cron error:", error);
      res.status(500).json({ error: "Failed to process abandoned carts" });
    }
  });

  // Weekly Accountability Email Cron Job - Call this endpoint weekly via external cron service
  // Example: Use cron-job.org to hit this endpoint every Monday at 9 AM with the CRON_SECRET header
  app.post("/api/cron/weekly-accountability", async (req, res) => {
    // Verify cron secret for security
    const cronSecret = process.env.CRON_SECRET;
    const providedSecret =
      req.headers["x-cron-secret"] ||
      req.headers.authorization?.replace("Bearer ", "");

    if (cronSecret && providedSecret !== cronSecret) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (!resend) {
      res.status(503).json({ error: "Email service not configured" });
      return;
    }

    try {
      // Get active Partner subscribers
      const partnerSubscribers = await storage.getActivePartnerSubscribers();

      // Calculate week number (1-8 rotating cycle based on weeks since a fixed date)
      // Using Jan 1, 2026 as epoch for cleaner tracking
      const epochStart = new Date('2026-01-01').getTime();
      const weeksSinceEpoch = Math.floor((Date.now() - epochStart) / (7 * 24 * 60 * 60 * 1000));
      const weekNumber = (weeksSinceEpoch % 8) + 1; // 1-8 rotating cycle
      
      const results = [];

      for (const subscriber of partnerSubscribers) {
        try {
          // Generate weekly accountability email
          const { subject, html } = generateWeeklyAccountabilityEmail({
            firstName: subscriber.firstName,
            archetype: subscriber.archetype,
            weekNumber,
          });

          const { data, error } = await resend.emails.send({
            from: "Prolific Personalities <hello@prolificpersonalities.com>",
            to: [subscriber.email],
            subject,
            html,
          });

          if (error) {
            console.error(`Failed to send weekly email to ${subscriber.email}:`, error);
            results.push({
              userId: subscriber.userId,
              email: subscriber.email,
              status: "failed",
              error: error.message,
            });
            continue;
          }

          results.push({
            userId: subscriber.userId,
            email: subscriber.email,
            status: "sent",
            resendId: data?.id,
          });
          console.log(`✅ Weekly accountability email sent to ${subscriber.email} (${data?.id})`);
        } catch (err) {
          console.error(`Failed to send weekly email to ${subscriber.email}:`, err);
          results.push({
            userId: subscriber.userId,
            email: subscriber.email,
            status: "failed",
            error: String(err),
          });
        }
      }

      console.log(
        `📧 Weekly accountability cron completed: ${results.filter((r) => r.status === "sent").length} sent, ${results.filter((r) => r.status === "failed").length} failed`
      );
      res.json({
        success: true,
        weekNumber,
        processed: partnerSubscribers.length,
        sent: results.filter((r) => r.status === "sent").length,
        failed: results.filter((r) => r.status === "failed").length,
        results,
      });
    } catch (error) {
      console.error("Weekly accountability cron error:", error);
      res.status(500).json({ error: "Failed to send weekly accountability emails" });
    }
  });

  // Nurture sequence cron endpoint - sends nurture emails to non-buyers
  app.post("/api/cron/nurture-sequence", async (req, res) => {
    const cronSecret = process.env.CRON_SECRET;
    const providedSecret =
      req.headers["x-cron-secret"] ||
      req.headers.authorization?.replace("Bearer ", "");

    if (cronSecret && providedSecret !== cronSecret) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (!resend) {
      res.status(503).json({ error: "Email service not configured" });
      return;
    }

    try {
      const nurtureDays = [3, 5, 7, 10, 14];
      const results: { day: number; sent: number; failed: number }[] = [];

      for (const dayNumber of nurtureDays) {
        const emailCaptures = await storage.getEmailCapturesForNurture(dayNumber);
        let sent = 0;
        let failed = 0;

        for (const capture of emailCaptures) {
          if (!capture.archetype) continue;

          try {
            const user = { email: capture.email, archetype: capture.archetype };
            let emailContent;

            switch (dayNumber) {
              case 3:
                emailContent = generateDay3NurtureEmail(user);
                break;
              case 5:
                emailContent = generateDay5NurtureEmail(user);
                break;
              case 7:
                emailContent = generateDay7NurtureEmail(user);
                break;
              case 10:
                emailContent = generateDay10NurtureEmail(user);
                break;
              case 14:
                emailContent = generateDay14NurtureEmail(user);
                break;
              default:
                continue;
            }

            const { data, error } = await resend.emails.send({
              from: "John from Prolific Personalities <support@prolificpersonalities.com>",
              to: capture.email,
              subject: emailContent.subject,
              html: emailContent.html,
            });

            if (error) {
              console.error(`Failed to send day ${dayNumber} nurture to ${capture.email}:`, error);
              failed++;
              continue;
            }

            await storage.markNurtureEmailSent(capture.id, dayNumber);
            await storage.logEmail(capture.email, `nurture_day${dayNumber}`, capture.archetype, data?.id);
            console.log(`✅ Day ${dayNumber} nurture email sent to ${capture.email}`);
            sent++;
          } catch (err) {
            console.error(`Failed to send day ${dayNumber} nurture to ${capture.email}:`, err);
            failed++;
          }
        }

        results.push({ day: dayNumber, sent, failed });
      }

      const totalSent = results.reduce((acc, r) => acc + r.sent, 0);
      const totalFailed = results.reduce((acc, r) => acc + r.failed, 0);
      
      console.log(`📧 Nurture sequence cron completed: ${totalSent} sent, ${totalFailed} failed`);
      res.json({
        success: true,
        totalSent,
        totalFailed,
        results,
      });
    } catch (error) {
      console.error("Nurture sequence cron error:", error);
      res.status(500).json({ error: "Failed to send nurture emails" });
    }
  });

  // Onboarding sequence cron endpoint - sends onboarding emails to buyers
  app.post("/api/cron/onboarding-sequence", async (req, res) => {
    const cronSecret = process.env.CRON_SECRET;
    const providedSecret =
      req.headers["x-cron-secret"] ||
      req.headers.authorization?.replace("Bearer ", "");

    if (cronSecret && providedSecret !== cronSecret) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (!resend) {
      res.status(503).json({ error: "Email service not configured" });
      return;
    }

    try {
      const onboardDays = [3, 7, 30];
      const results: { day: number; sent: number; failed: number }[] = [];

      for (const dayNumber of onboardDays) {
        const emailCaptures = await storage.getEmailCapturesForOnboarding(dayNumber);
        let sent = 0;
        let failed = 0;

        for (const capture of emailCaptures) {
          if (!capture.archetype) continue;

          try {
            const user = { email: capture.email, archetype: capture.archetype };
            let emailContent;

            switch (dayNumber) {
              case 3:
                emailContent = generateDay3OnboardEmail(user);
                break;
              case 7:
                emailContent = generateDay7OnboardEmail(user);
                break;
              case 30:
                emailContent = generateDay30OnboardEmail(user);
                break;
              default:
                continue;
            }

            const { data, error } = await resend.emails.send({
              from: "John from Prolific Personalities <support@prolificpersonalities.com>",
              to: capture.email,
              subject: emailContent.subject,
              html: emailContent.html,
            });

            if (error) {
              console.error(`Failed to send day ${dayNumber} onboard to ${capture.email}:`, error);
              failed++;
              continue;
            }

            await storage.markOnboardingEmailSent(capture.id, dayNumber);
            await storage.logEmail(capture.email, `onboard_day${dayNumber}`, capture.archetype, data?.id);
            console.log(`✅ Day ${dayNumber} onboard email sent to ${capture.email}`);
            sent++;
          } catch (err) {
            console.error(`Failed to send day ${dayNumber} onboard to ${capture.email}:`, err);
            failed++;
          }
        }

        results.push({ day: dayNumber, sent, failed });
      }

      const totalSent = results.reduce((acc, r) => acc + r.sent, 0);
      const totalFailed = results.reduce((acc, r) => acc + r.failed, 0);
      
      console.log(`📧 Onboarding sequence cron completed: ${totalSent} sent, ${totalFailed} failed`);
      res.json({
        success: true,
        totalSent,
        totalFailed,
        results,
      });
    } catch (error) {
      console.error("Onboarding sequence cron error:", error);
      res.status(500).json({ error: "Failed to send onboarding emails" });
    }
  });

  // XML Sitemap for SEO
  app.get("/sitemap.xml", async (req, res) => {
    // Use APP_URL if set, otherwise safely construct from request
    let baseUrl = process.env.APP_URL;
    if (!baseUrl) {
      if (process.env.NODE_ENV === "production") {
        baseUrl = "https://prolificpersonalities.com";
      } else {
        // Safely construct URL from request, defaulting to https
        const protocol = req.protocol || "https";
        const host = req.get("host") || "localhost:5000";
        // Validate host to prevent injection
        const safeHost = host.replace(/[^a-zA-Z0-9.:-]/g, "");
        baseUrl = `${protocol}://${safeHost}`;
      }
    }

    const staticPages = [
      { url: "/", priority: "1.0", changefreq: "weekly" },
      { url: "/quiz", priority: "0.9", changefreq: "monthly" },
      { url: "/archetypes", priority: "0.8", changefreq: "monthly" },
      { url: "/pricing", priority: "0.8", changefreq: "monthly" },
      { url: "/blog", priority: "0.7", changefreq: "weekly" },
      { url: "/science", priority: "0.7", changefreq: "monthly" },
      { url: "/resources", priority: "0.7", changefreq: "monthly" },
      { url: "/about", priority: "0.6", changefreq: "monthly" },
      { url: "/faq", priority: "0.6", changefreq: "monthly" },
      { url: "/founder", priority: "0.5", changefreq: "yearly" },
      { url: "/refund-policy", priority: "0.3", changefreq: "yearly" },
      { url: "/dashboard", priority: "0.4", changefreq: "weekly" },
      { url: "/payment-success", priority: "0.2", changefreq: "yearly" },
      { url: "/payment-cancelled", priority: "0.2", changefreq: "yearly" },
      { url: "/purchase-success", priority: "0.2", changefreq: "yearly" },
    ];

    const archetypes = [
      "chaotic-creative",
      "anxious-perfectionist",
      "structured-achiever",
      "novelty-seeker",
      "strategic-planner",
      "flexible-improviser",
    ];

    const blogSlugs = [
      "dog-applied-head-of-growth-productivity-strategy",
      "confessions-imperfect-founder-procrastination",
      "time-blocking-less-productive-some-brains",
      "constant-stimulation-adhd-or-productivity-style",
      "cant-stick-to-routine-what-to-do-instead",
      "start-everything-finish-nothing-psychology",
      "cant-focus-anymore-brain-wont-cooperate",
      "flexible-improvisers-energy-wont-follow-schedule",
      "strategic-planners-brilliant-plans-never-reality",
      "novelty-seekers-boredom-kills-projects",
      "structured-achiever-hidden-trap",
      "anxious-perfectionist-paradox",
      "chaotic-creatives-brain-not-broken",
      "choose-productivity-tool-5-minutes",
      "discipline-advice-destroys-productivity",
      "why-every-productivity-system-has-failed-you",
      "productivity-archetype-changes-fluid-styles",
      "digital-minimalism-challenge",
      "when-productivity-hurts",
      "6-productivity-archetypes-explained",
    ];

    const today = new Date().toISOString().split("T")[0];

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

    res.header("Content-Type", "application/xml");
    res.send(sitemap);
  });

  // ============================================
  // MOBILE AUTHENTICATION ENDPOINTS
  // ============================================

  const JWT_SECRET =
    process.env.SESSION_SECRET || "fallback-jwt-secret-change-in-production";
  const MAGIC_LINK_EXPIRY_MINUTES = 60;
  const SESSION_EXPIRY_DAYS = 30;
  const RATE_LIMIT_WINDOW_HOURS = 1;
  const RATE_LIMIT_MAX_REQUESTS = 5;

  // Helper: Generate secure random token
  function generateSecureToken(): string {
    return crypto.randomBytes(32).toString("hex");
  }

  // Helper: Generate JWT session token
  function generateSessionToken(userId: string, email: string): string {
    return jwt.sign({ userId, email }, JWT_SECRET, {
      expiresIn: `${SESSION_EXPIRY_DAYS}d`,
    });
  }

  // Helper: Verify JWT session token
  function verifySessionToken(
    token: string,
  ): { userId: string; email: string } | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        userId: string;
        email: string;
      };
      return decoded;
    } catch {
      return null;
    }
  }

  // POST /api/mobile/auth/signin - Send magic link to user's email
  app.post("/api/mobile/auth/signin", async (req, res) => {
    try {
      const { email } = req.body;

      // Validate email format
      const emailSchema = z.string().email();
      const validationResult = emailSchema.safeParse(email);
      if (!validationResult.success) {
        res.status(400).json({ success: false, error: "Invalid email format" });
        return;
      }

      const normalizedEmail = email.toLowerCase().trim();

      // Check rate limiting
      const oneHourAgo = new Date(
        Date.now() - RATE_LIMIT_WINDOW_HOURS * 60 * 60 * 1000,
      );
      const rateLimitCheck = await db
        .select()
        .from(magicLinkRateLimits)
        .where(
          and(
            eq(magicLinkRateLimits.email, normalizedEmail),
            gt(magicLinkRateLimits.windowStart, oneHourAgo),
          ),
        );

      if (
        rateLimitCheck.length > 0 &&
        rateLimitCheck[0].requestCount >= RATE_LIMIT_MAX_REQUESTS
      ) {
        res.status(429).json({
          success: false,
          error: "Too many sign-in attempts. Please try again in an hour.",
        });
        return;
      }

      // Update or create rate limit record
      if (rateLimitCheck.length > 0) {
        await db
          .update(magicLinkRateLimits)
          .set({ requestCount: rateLimitCheck[0].requestCount + 1 })
          .where(eq(magicLinkRateLimits.id, rateLimitCheck[0].id));
      } else {
        await db.insert(magicLinkRateLimits).values({
          email: normalizedEmail,
          requestCount: 1,
          windowStart: new Date(),
        });
      }

      // Check if user exists, create if not
      let user = await storage.getUserByEmail(normalizedEmail);
      if (!user) {
        // Create new user with generated ID
        const newUserId = crypto.randomUUID();
        await storage.upsertUser({
          id: newUserId,
          email: normalizedEmail,
          firstName: null,
          lastName: null,
          profileImageUrl: null,
        });
        user = await storage.getUserByEmail(normalizedEmail);
      }

      // Generate magic link token
      const token = generateSecureToken();
      const expiresAt = new Date(
        Date.now() + MAGIC_LINK_EXPIRY_MINUTES * 60 * 1000,
      );

      // Store token in database
      await db.insert(magicLinkTokens).values({
        email: normalizedEmail,
        token,
        expiresAt,
        used: 0,
      });

      // Generate magic link URL
      const baseUrl =
        process.env.APP_URL || "https://prolificpersonalities.com";
      const magicLink = `${baseUrl}/api/mobile/auth/verify?token=${token}`;

      // Send email with magic link
      if (!resend) {
        console.warn("⚠️ Resend not configured - magic link email not sent");
        res.status(503).json({
          success: false,
          error: "Email service not configured",
        });
        return;
      }

      await resend.emails.send({
        from: "Prolific Personalities <support@prolificpersonalities.com>",
        to: normalizedEmail,
        subject: "Sign in to Prolific Personalities",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #0d9488; margin-bottom: 20px;">Sign in to Prolific Personalities</h1>
            <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
              Click the button below to sign in to your account. This link will expire in ${MAGIC_LINK_EXPIRY_MINUTES} minutes.
            </p>
            <a href="${magicLink}" style="display: inline-block; background-color: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-bottom: 20px;">
              Sign In
            </a>
            <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
              If you didn't request this link, you can safely ignore this email.
            </p>
            <p style="font-size: 12px; color: #9ca3af; margin-top: 30px;">
              If the button doesn't work, copy and paste this link into your browser:<br/>
              <a href="${magicLink}" style="color: #0d9488;">${magicLink}</a>
            </p>
          </div>
        `,
      });

      console.log(`✅ Magic link sent to ${normalizedEmail}`);
      res.json({
        success: true,
        message: "Check your email for the magic link",
      });
    } catch (error) {
      console.error("Magic link signin error:", error);
      res
        .status(500)
        .json({ success: false, error: "Failed to send magic link" });
    }
  });

  // GET /api/mobile/auth/verify - Verify magic link token and create session
  app.get("/api/mobile/auth/verify", async (req, res) => {
    try {
      const { token } = req.query;

      if (!token || typeof token !== "string") {
        res.status(400).json({ success: false, error: "Token is required" });
        return;
      }

      // Find token in database
      const tokenRecord = await db
        .select()
        .from(magicLinkTokens)
        .where(
          and(
            eq(magicLinkTokens.token, token),
            eq(magicLinkTokens.used, 0),
            gt(magicLinkTokens.expiresAt, new Date()),
          ),
        );

      if (tokenRecord.length === 0) {
        res
          .status(400)
          .json({ success: false, error: "Invalid or expired token" });
        return;
      }

      const magicToken = tokenRecord[0];

      // Mark token as used
      await db
        .update(magicLinkTokens)
        .set({ used: 1 })
        .where(eq(magicLinkTokens.id, magicToken.id));

      // Get user
      const user = await storage.getUserByEmail(magicToken.email);
      if (!user) {
        res.status(400).json({ success: false, error: "User not found" });
        return;
      }

      // Generate session token
      const sessionToken = generateSessionToken(user.id, magicToken.email);
      const sessionExpiresAt = new Date(
        Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
      );

      // Store session in database
      await db.insert(mobileSessions).values({
        userId: user.id,
        token: sessionToken,
        expiresAt: sessionExpiresAt,
      });

      console.log(`✅ Mobile session created for ${magicToken.email}`);

      res.json({
        success: true,
        sessionToken,
        user: {
          id: user.id,
          email: user.email,
          name:
            [user.firstName, user.lastName].filter(Boolean).join(" ") || null,
        },
      });
    } catch (error) {
      console.error("Magic link verify error:", error);
      res.status(500).json({ success: false, error: "Failed to verify token" });
    }
  });

  // GET /api/mobile/auth/session - Validate session token and get user info
  app.get("/api/mobile/auth/session", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res
          .status(401)
          .json({ success: false, error: "Authorization header required" });
        return;
      }

      const sessionToken = authHeader.substring(7); // Remove 'Bearer ' prefix

      // Verify JWT
      const decoded = verifySessionToken(sessionToken);
      if (!decoded) {
        res
          .status(401)
          .json({ success: false, error: "Invalid or expired session" });
        return;
      }

      // Check session exists in database and is not expired
      const sessionRecord = await db
        .select()
        .from(mobileSessions)
        .where(
          and(
            eq(mobileSessions.token, sessionToken),
            gt(mobileSessions.expiresAt, new Date()),
          ),
        );

      if (sessionRecord.length === 0) {
        res
          .status(401)
          .json({ success: false, error: "Session not found or expired" });
        return;
      }

      // Get user info
      const user = await storage.getUserByEmail(decoded.email);
      if (!user) {
        res.status(401).json({ success: false, error: "User not found" });
        return;
      }

      res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name:
            [user.firstName, user.lastName].filter(Boolean).join(" ") || null,
        },
      });
    } catch (error) {
      console.error("Session validation error:", error);
      res
        .status(500)
        .json({ success: false, error: "Failed to validate session" });
    }
  });

  // POST /api/mobile/auth/signout - Invalidate session
  app.post("/api/mobile/auth/signout", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res
          .status(401)
          .json({ success: false, error: "Authorization header required" });
        return;
      }

      const sessionToken = authHeader.substring(7);

      // Delete session from database
      await db
        .delete(mobileSessions)
        .where(eq(mobileSessions.token, sessionToken));

      res.json({ success: true, message: "Signed out successfully" });
    } catch (error) {
      console.error("Signout error:", error);
      res.status(500).json({ success: false, error: "Failed to sign out" });
    }
  });

  // ============================================
  // MOBILE USER PROFILE ENDPOINT
  // ============================================

  // GET /api/mobile/user/profile - Get user's complete profile with quiz results and premium status
  app.get("/api/mobile/user/profile", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res
          .status(401)
          .json({ success: false, error: "Authorization header required" });
        return;
      }

      const sessionToken = authHeader.substring(7);

      // Verify JWT
      const decoded = verifySessionToken(sessionToken);
      if (!decoded) {
        res
          .status(401)
          .json({ success: false, error: "Invalid or expired session" });
        return;
      }

      // Check session exists in database and is not expired
      const sessionRecord = await db
        .select()
        .from(mobileSessions)
        .where(
          and(
            eq(mobileSessions.token, sessionToken),
            gt(mobileSessions.expiresAt, new Date()),
          ),
        );

      if (sessionRecord.length === 0) {
        res
          .status(401)
          .json({ success: false, error: "Session not found or expired" });
        return;
      }

      // Get user from database
      const user = await storage.getUser(decoded.userId);
      if (!user) {
        res.status(404).json({ success: false, error: "User not found" });
        return;
      }

      // Get latest quiz result for this user
      const quizResultsData = await db
        .select()
        .from(quizResults)
        .where(eq(quizResults.userId, decoded.userId))
        .orderBy(desc(quizResults.completedAt))
        .limit(1);

      const latestQuizResult = quizResultsData[0] || null;

      // Check premium status - any completed or paid order
      const premiumOrders = await db
        .select()
        .from(orders)
        .where(
          and(
            eq(orders.userId, decoded.userId),
            or(eq(orders.status, "completed"), eq(orders.status, "paid")),
          ),
        )
        .orderBy(orders.createdAt)
        .limit(1);

      const isPremium = premiumOrders.length > 0;
      const premiumSince =
        isPremium && premiumOrders[0].createdAt
          ? premiumOrders[0].createdAt.toISOString()
          : null;

      // Build archetype response
      let archetypeResponse = null;
      if (latestQuizResult) {
        const scores = latestQuizResult.scores as {
          structure?: number;
          motivation?: number;
          cognitive?: number;
          taskRelationship?: number;
        };

        // Get archetype info for display name
        const archetypeInfo = getArchetypeInfo(latestQuizResult.archetype);

        archetypeResponse = {
          id: latestQuizResult.archetype,
          name: archetypeInfo?.title || latestQuizResult.archetype,
          assessmentDate: latestQuizResult.completedAt.toISOString(),
          scores: {
            structure: scores.structure || 0,
            motivation: scores.motivation || 0,
            cognitive: scores.cognitive || 0,
            taskRelationship: scores.taskRelationship || 0,
          },
        };
      }

      // Build user name from firstName and lastName
      const userName =
        [user.firstName, user.lastName].filter(Boolean).join(" ") || null;

      res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: userName,
        },
        archetype: archetypeResponse,
        isPremium,
        premiumSince,
      });
    } catch (error) {
      console.error("Profile fetch error:", error);
      res
        .status(500)
        .json({ success: false, error: "Failed to fetch profile" });
    }
  });

  // ============================================
  // MOBILE QUIZ ENDPOINTS
  // ============================================

  const VALID_ARCHETYPES = [
    "chaotic-creative",
    "anxious-perfectionist",
    "strategic-planner",
    "novelty-seeker",
    "flexible-improviser",
    "structured-achiever",
    "adaptive-generalist",
  ];

  // POST /api/mobile/quiz/submit - Submit quiz results
  app.post("/api/mobile/quiz/submit", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res
          .status(401)
          .json({ success: false, error: "Authorization header required" });
        return;
      }

      const sessionToken = authHeader.substring(7);

      // Verify JWT
      const decoded = verifySessionToken(sessionToken);
      if (!decoded) {
        res
          .status(401)
          .json({ success: false, error: "Invalid or expired session" });
        return;
      }

      // Check session exists in database
      const sessionRecord = await db
        .select()
        .from(mobileSessions)
        .where(
          and(
            eq(mobileSessions.token, sessionToken),
            gt(mobileSessions.expiresAt, new Date()),
          ),
        );

      if (sessionRecord.length === 0) {
        res
          .status(401)
          .json({ success: false, error: "Session not found or expired" });
        return;
      }

      // Validate request body
      const { responses, archetype, scores } = req.body;

      if (!responses || typeof responses !== "object") {
        res
          .status(400)
          .json({ success: false, error: "Responses object is required" });
        return;
      }

      if (!archetype || !VALID_ARCHETYPES.includes(archetype)) {
        res.status(400).json({
          success: false,
          error: `Invalid archetype. Must be one of: ${VALID_ARCHETYPES.join(", ")}`,
        });
        return;
      }

      if (!scores || typeof scores !== "object") {
        res
          .status(400)
          .json({ success: false, error: "Scores object is required" });
        return;
      }

      // Validate all 28 responses are present
      const responseKeys = Object.keys(responses);
      if (responseKeys.length < 28) {
        res.status(400).json({
          success: false,
          error: `All 28 responses are required. Received ${responseKeys.length}`,
        });
        return;
      }

      // Validate response values are 0-100
      for (const [key, value] of Object.entries(responses)) {
        if (typeof value !== "number" || value < 0 || value > 100) {
          res.status(400).json({
            success: false,
            error: `Response for question ${key} must be a number between 0-100`,
          });
          return;
        }
      }

      // Validate scores structure
      const requiredScores = [
        "structure",
        "motivation",
        "cognitive",
        "taskRelationship",
      ];
      for (const scoreKey of requiredScores) {
        if (typeof scores[scoreKey] !== "number") {
          res.status(400).json({
            success: false,
            error: `Score '${scoreKey}' is required and must be a number`,
          });
          return;
        }
      }

      // Generate a unique session ID for this quiz result
      const quizSessionId = `mobile_${decoded.userId}_${Date.now()}`;

      // Delete any existing quiz results for this user (to handle retakes)
      await db
        .delete(quizResults)
        .where(eq(quizResults.userId, decoded.userId));

      // Insert new quiz result
      const [newResult] = await db
        .insert(quizResults)
        .values({
          sessionId: quizSessionId,
          userId: decoded.userId,
          answers: responses,
          scores: scores,
          archetype: archetype,
        })
        .returning();

      res.json({
        success: true,
        archetype: archetype,
        message: "Quiz results saved successfully",
      });
    } catch (error) {
      console.error("Quiz submit error:", error);
      res
        .status(500)
        .json({ success: false, error: "Failed to save quiz results" });
    }
  });

  // GET /api/mobile/quiz/results - Get user's quiz results
  app.get("/api/mobile/quiz/results", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res
          .status(401)
          .json({ success: false, error: "Authorization header required" });
        return;
      }

      const sessionToken = authHeader.substring(7);

      // Verify JWT
      const decoded = verifySessionToken(sessionToken);
      if (!decoded) {
        res
          .status(401)
          .json({ success: false, error: "Invalid or expired session" });
        return;
      }

      // Check session exists in database
      const sessionRecord = await db
        .select()
        .from(mobileSessions)
        .where(
          and(
            eq(mobileSessions.token, sessionToken),
            gt(mobileSessions.expiresAt, new Date()),
          ),
        );

      if (sessionRecord.length === 0) {
        res
          .status(401)
          .json({ success: false, error: "Session not found or expired" });
        return;
      }

      // Get latest quiz result for this user
      const quizResultsData = await db
        .select()
        .from(quizResults)
        .where(eq(quizResults.userId, decoded.userId))
        .orderBy(desc(quizResults.completedAt))
        .limit(1);

      if (quizResultsData.length === 0) {
        res.json({
          success: true,
          archetype: null,
        });
        return;
      }

      const latestResult = quizResultsData[0];
      const scores = latestResult.scores as {
        structure?: number;
        motivation?: number;
        cognitive?: number;
        taskRelationship?: number;
      };

      res.json({
        success: true,
        archetype: latestResult.archetype,
        scores: {
          structure: scores.structure || 0,
          motivation: scores.motivation || 0,
          cognitive: scores.cognitive || 0,
          taskRelationship: scores.taskRelationship || 0,
        },
        completedAt: latestResult.completedAt.toISOString(),
      });
    } catch (error) {
      console.error("Quiz results fetch error:", error);
      res
        .status(500)
        .json({ success: false, error: "Failed to fetch quiz results" });
    }
  });

  // ============================================
  // MOBILE PREMIUM STATUS ENDPOINT
  // ============================================

  // GET /api/mobile/user/premium - Check user's premium status
  app.get("/api/mobile/user/premium", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res
          .status(401)
          .json({ success: false, error: "Authorization header required" });
        return;
      }

      const sessionToken = authHeader.substring(7);

      // Verify JWT
      const decoded = verifySessionToken(sessionToken);
      if (!decoded) {
        res
          .status(401)
          .json({ success: false, error: "Invalid or expired session" });
        return;
      }

      // Check session exists in database
      const sessionRecord = await db
        .select()
        .from(mobileSessions)
        .where(
          and(
            eq(mobileSessions.token, sessionToken),
            gt(mobileSessions.expiresAt, new Date()),
          ),
        );

      if (sessionRecord.length === 0) {
        res
          .status(401)
          .json({ success: false, error: "Session not found or expired" });
        return;
      }

      // Query orders table for successful purchases
      const premiumOrders = await db
        .select()
        .from(orders)
        .where(
          and(
            eq(orders.userId, decoded.userId),
            or(
              eq(orders.status, "completed"),
              eq(orders.status, "paid"),
              eq(orders.status, "succeeded"),
            ),
          ),
        )
        .orderBy(desc(orders.createdAt))
        .limit(1);

      if (premiumOrders.length === 0) {
        res.json({
          success: true,
          isPremium: false,
        });
        return;
      }

      const latestOrder = premiumOrders[0];

      res.json({
        success: true,
        isPremium: true,
        purchaseDate: latestOrder.createdAt.toISOString(),
        productType: latestOrder.productType || "playbook",
      });
    } catch (error) {
      console.error("Premium status fetch error:", error);
      res
        .status(500)
        .json({ success: false, error: "Failed to fetch premium status" });
    }
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
  async function checkChatRateLimit(
    userId: string | null,
    sessionId: string | null,
  ): Promise<{ allowed: boolean; remaining: number; isPremium: boolean }> {
    const today = new Date().toISOString().split("T")[0];

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
      isPremium: false,
    };
  }

  // Get usage status endpoint
  app.get("/api/ai-coach/usage", async (req: any, res) => {
    try {
      const userId = req.supabaseUser?.claims?.sub || null;
      const sessionId = (req.query.sessionId as string) || null;

      const { allowed, remaining, isPremium } = await checkChatRateLimit(
        userId,
        sessionId,
      );

      res.json({
        remaining: isPremium ? -1 : remaining,
        limit: isPremium ? -1 : FREE_DAILY_LIMIT,
        isPremium,
      });
    } catch (error) {
      console.error("Error getting usage:", error);
      res.status(500).json({ error: "Failed to get usage" });
    }
  });

  app.post("/api/ai-coach", aiCoachLimiter, async (req: any, res) => {
    try {
      const {
        message,
        archetype,
        scores,
        history = [],
        conversationId,
        sessionId: clientSessionId,
      } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const userId = req.supabaseUser?.claims?.sub || null;
      const sessionId = clientSessionId || null;

      // Check rate limit
      const { allowed, remaining, isPremium } = await checkChatRateLimit(
        userId,
        sessionId,
      );
      if (!allowed) {
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        res.write(
          `data: ${JSON.stringify({
            error: "Daily limit reached",
            limitReached: true,
            message:
              "You've reached your daily limit of 10 messages. Upgrade to Productivity Partner for unlimited AI coaching!",
          })}\n\n`,
        );
        res.end();
        return;
      }

      const archetypeInfo = archetype ? getArchetypeInfo(archetype) : null;

      // Use detailed archetype-specific prompts
      const systemPrompt = buildSystemPrompt(
        archetype,
        archetypeInfo?.title,
        archetypeInfo?.description,
        scores,
      );

      const messages = [
        { role: "system" as const, content: systemPrompt },
        ...history.map((h: any) => ({
          role: h.role as "user" | "assistant",
          content: h.content,
        })),
        { role: "user" as const, content: message },
      ];

      // Set up SSE for streaming
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      // Send remaining count
      res.write(
        `data: ${JSON.stringify({ remaining: isPremium ? -1 : remaining - 1, isPremium })}\n\n`,
      );

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
      await storage.incrementChatUsage(
        userId,
        sessionId,
        new Date().toISOString().split("T")[0],
      );

      // Save to chat history if conversationId provided
      if (conversationId) {
        try {
          await storage.createMessage({
            conversationId: parseInt(conversationId),
            userId,
            role: "user",
            content: message,
          });
          await storage.createMessage({
            conversationId: parseInt(conversationId),
            userId,
            role: "assistant",
            content: fullResponse,
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
        res.write(
          `data: ${JSON.stringify({ error: "Failed to get AI response" })}\n\n`,
        );
        res.end();
      } else {
        res.status(500).json({ error: "Failed to get AI response" });
      }
    }
  });

  // Non-streaming version for mobile API
  app.post("/api/v1/ai-coach", aiCoachLimiter, async (req: any, res) => {
    try {
      const {
        message,
        archetype,
        scores,
        history = [],
        conversationId,
        sessionId: clientSessionId,
      } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const userId = req.supabaseUser?.claims?.sub || null;
      const sessionId = clientSessionId || null;

      // Check rate limit
      const { allowed, remaining, isPremium } = await checkChatRateLimit(
        userId,
        sessionId,
      );
      if (!allowed) {
        return res.status(429).json({
          error: "Daily limit reached",
          limitReached: true,
          message:
            "You've reached your daily limit of 10 messages. Upgrade to Productivity Partner for unlimited AI coaching!",
        });
      }

      const archetypeInfo = archetype ? getArchetypeInfo(archetype) : null;

      // Use detailed archetype-specific prompts
      const systemPrompt = buildSystemPrompt(
        archetype,
        archetypeInfo?.title,
        archetypeInfo?.description,
        scores,
      );

      const messages = [
        { role: "system" as const, content: systemPrompt },
        ...history.map((h: any) => ({
          role: h.role as "user" | "assistant",
          content: h.content,
        })),
        { role: "user" as const, content: message },
      ];

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
        max_completion_tokens: 1024,
      });

      const content = response.choices[0]?.message?.content || "";

      // Increment usage after successful response
      await storage.incrementChatUsage(
        userId,
        sessionId,
        new Date().toISOString().split("T")[0],
      );

      // Save to chat history if conversationId provided
      if (conversationId) {
        try {
          await storage.createMessage({
            conversationId: parseInt(conversationId),
            userId,
            role: "user",
            content: message,
          });
          await storage.createMessage({
            conversationId: parseInt(conversationId),
            userId,
            role: "assistant",
            content,
          });
        } catch (e) {
          console.error("Failed to save chat history:", e);
        }
      }

      res.json({
        response: content,
        remaining: isPremium ? -1 : remaining - 1,
        isPremium,
      });
    } catch (error) {
      console.error("Error in AI coach:", error);
      res.status(500).json({ error: "Failed to get AI response" });
    }
  });

  // Chat history endpoints
  app.get("/api/chat/conversations", async (req: any, res) => {
    try {
      const userId = req.supabaseUser?.claims?.sub;
      const sessionId = req.query.sessionId as string;

      if (!userId && !sessionId) {
        return res
          .status(400)
          .json({ error: "User ID or session ID required" });
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
      const userId = req.supabaseUser?.claims?.sub || null;
      const { sessionId, archetype, title } = req.body;

      if (!userId && !sessionId) {
        return res
          .status(400)
          .json({ error: "User ID or session ID required" });
      }

      const conversation = await storage.createConversation({
        userId,
        sessionId,
        archetype,
        title: title || "New Conversation",
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

  app.delete(
    "/api/chat/conversations/:id",
    writeLimiter,
    async (req: any, res) => {
      try {
        const conversationId = parseInt(req.params.id);
        await storage.deleteConversation(conversationId);
        res.json({ success: true });
      } catch (error) {
        console.error("Error deleting conversation:", error);
        res.status(500).json({ error: "Failed to delete conversation" });
      }
    },
  );

  app.post(
    "/api/chat/messages/:id/feedback",
    writeLimiter,
    async (req: any, res) => {
      try {
        const messageId = parseInt(req.params.id);
        const { feedback, reason } = req.body;

        const message = await storage.updateMessageFeedback(
          messageId,
          feedback,
          reason,
        );
        res.json(message);
      } catch (error) {
        console.error("Error updating feedback:", error);
        res.status(500).json({ error: "Failed to update feedback" });
      }
    },
  );

  // ============================================
  // MOBILE APP API v1 (Supabase JWT Auth)
  // ============================================
  // These endpoints use Supabase JWT tokens directly
  // Mobile app sends: Authorization: Bearer <supabase_access_token>

  // GET /api/v1/mobile/health - Health check (no auth required)
  app.get("/api/v1/mobile/health", (_req, res) => {
    res.json({ status: "ok", timestamp: Date.now() });
  });

  // GET /api/v1/mobile/user - Get current user's profile
  app.get("/api/v1/mobile/user", supabaseAuth, async (req: any, res) => {
    try {
      const supabaseUser = req.supabaseUser;
      const userEmail = supabaseUser.email;

      // Get the local user ID (may differ from Supabase ID for legacy users)
      const localUser = await storage.upsertUser({
        id: supabaseUser.id,
        email: userEmail || null,
        firstName: supabaseUser.user_metadata?.full_name?.split(' ')[0] || null,
        lastName: supabaseUser.user_metadata?.full_name?.split(' ').slice(1).join(' ') || null,
        profileImageUrl: supabaseUser.user_metadata?.avatar_url || null,
      });
      const userId = localUser.id;

      // Get latest quiz result using local user ID
      const quizResults = await storage.getQuizResultsByUserId(userId);
      const latestQuizResult = quizResults.length > 0 ? quizResults[0] : null;

      // Check premium status using local user ID
      const isPremium = await storage.isPremiumUser(userId);

      res.json({
        success: true,
        user: {
          id: userId,
          email: userEmail,
          firstName: localUser.firstName || null,
          lastName: localUser.lastName || null,
          profileImageUrl: localUser.profileImageUrl || null,
        },
        latestAssessment: latestQuizResult
          ? {
              archetype: latestQuizResult.archetype,
              scores: latestQuizResult.scores,
              completedAt: latestQuizResult.completedAt,
            }
          : null,
        isPremium,
      });
    } catch (error) {
      console.error("Error getting mobile user:", error);
      res
        .status(500)
        .json({ success: false, error: "Failed to get user profile" });
    }
  });

  // POST /api/v1/mobile/assessment - Save assessment results
  app.post(
    "/api/v1/mobile/assessment",
    supabaseAuth,
    writeLimiter,
    async (req: any, res) => {
      try {
        const supabaseUser = req.supabaseUser;
        const { vispiCategory, answers, timestamp, scores } = req.body;

        // Get the local user ID (may differ from Supabase ID for legacy users)
        const localUser = await storage.upsertUser({
          id: supabaseUser.id,
          email: supabaseUser.email || null,
          firstName: supabaseUser.user_metadata?.full_name?.split(' ')[0] || null,
          lastName: supabaseUser.user_metadata?.full_name?.split(' ').slice(1).join(' ') || null,
          profileImageUrl: supabaseUser.user_metadata?.avatar_url || null,
        });
        const userId = localUser.id;

        // Validate required fields
        if (!vispiCategory) {
          return res
            .status(400)
            .json({ success: false, error: "vispiCategory is required" });
        }

        // Generate a unique session ID for this assessment
        const sessionId = `mobile-${userId}-${Date.now()}`;

        // Save the quiz result
        const result = await storage.saveQuizResult({
          sessionId,
          archetype: vispiCategory,
          scores: scores || {},
          answers: answers || [],
          userId,
        });

        res.json({
          success: true,
          assessment: {
            id: result.id,
            archetype: result.archetype,
            scores: result.scores,
            completedAt: result.completedAt,
          },
        });
      } catch (error) {
        console.error("Error saving mobile assessment:", error);
        res
          .status(500)
          .json({ success: false, error: "Failed to save assessment" });
      }
    },
  );

  // GET /api/v1/mobile/assessment - Get user's latest assessment
  app.get(
    "/api/v1/mobile/assessment",
    supabaseAuth,
    async (req: any, res) => {
      try {
        const supabaseUser = req.supabaseUser;
        // Get the local user ID (may differ from Supabase ID for legacy users)
        const localUser = await storage.upsertUser({
          id: supabaseUser.id,
          email: supabaseUser.email || null,
          firstName: supabaseUser.user_metadata?.full_name?.split(' ')[0] || null,
          lastName: supabaseUser.user_metadata?.full_name?.split(' ').slice(1).join(' ') || null,
          profileImageUrl: supabaseUser.user_metadata?.avatar_url || null,
        });
        const userId = localUser.id;

        // Get all quiz results for user, ordered by date (newest first)
        const quizResults = await storage.getQuizResultsByUserId(userId);

        if (quizResults.length === 0) {
          return res.json({
            success: true,
            assessment: null,
            message: "No assessment found",
          });
        }

        const latest = quizResults[0];

        res.json({
          success: true,
          assessment: {
            id: latest.id,
            archetype: latest.archetype,
            scores: latest.scores,
            answers: latest.answers,
            completedAt: latest.completedAt,
          },
        });
      } catch (error) {
        console.error("Error getting mobile assessment:", error);
        res
          .status(500)
          .json({ success: false, error: "Failed to get assessment" });
      }
    },
  );

  // GET /api/v1/mobile/assessment/history - Get all user's assessments
  app.get(
    "/api/v1/mobile/assessment/history",
    supabaseAuth,
    async (req: any, res) => {
      try {
        const supabaseUser = req.supabaseUser;
        // Get the local user ID (may differ from Supabase ID for legacy users)
        const localUser = await storage.upsertUser({
          id: supabaseUser.id,
          email: supabaseUser.email || null,
          firstName: supabaseUser.user_metadata?.full_name?.split(' ')[0] || null,
          lastName: supabaseUser.user_metadata?.full_name?.split(' ').slice(1).join(' ') || null,
          profileImageUrl: supabaseUser.user_metadata?.avatar_url || null,
        });
        const userId = localUser.id;
        const quizResults = await storage.getQuizResultsByUserId(userId);

        res.json({
          success: true,
          assessments: quizResults.map((result) => ({
            id: result.id,
            archetype: result.archetype,
            scores: result.scores,
            completedAt: result.completedAt,
          })),
        });
      } catch (error) {
        console.error("Error getting mobile assessment history:", error);
        res
          .status(500)
          .json({ success: false, error: "Failed to get assessment history" });
      }
    },
  );

  // ==========================================
  // MOBILE API ENDPOINTS (without v1 prefix)
  // ==========================================

  app.post("/api/mobile/quiz/submit", supabaseAuth, async (req: any, res) => {
    try {
      const user = req.supabaseUser;
      const { responses, archetype, scores } = req.body;

      if (!responses || !archetype || !scores) {
        return res.status(400).json({ success: false, error: 'Missing fields' });
      }

      const result = await storage.saveQuizResult({
        sessionId: `mobile_${user.id}_${Date.now()}`,
        archetype,
        answers: responses,
        scores,
        userId: user.id,
      });

      return res.json({ success: true, archetype, sessionId: result.sessionId });
    } catch (error) {
      console.error('Mobile quiz error:', error);
      return res.status(500).json({ success: false, error: 'Server error' });
    }
  });

  app.get("/api/mobile/user/profile", supabaseAuth, async (req: any, res) => {
    try {
      const user = req.supabaseUser;
      return res.json({ success: true, user: { id: user.id, email: user.email } });
    } catch (error) {
      return res.status(500).json({ success: false, error: 'Server error' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
