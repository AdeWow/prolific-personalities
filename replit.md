# Prolific Personalities - Productivity Assessment Platform

## Overview

Prolific Personalities is a web application designed to help users identify their unique productivity archetype through a research-backed assessment. The platform analyzes user responses across four cognitive and behavioral dimensions to assign one of six distinct productivity archetypes. It then provides personalized strategies, tool recommendations, and insights tailored to their specific working style. The project aims to offer a user-friendly, mobile-responsive experience with immediate, shareable results, fostering improved personal productivity and understanding. The business vision is to become the leading platform for personalized productivity insights, leveraging market potential in self-improvement and professional development.

## User Preferences

Preferred communication style: Simple, everyday language.

**Blog Management**:
- Do NOT pin blogs unless explicitly requested
- Keep "Confessions of an Imperfect Founder: I Procrastinated on My Anti-Procrastination Platform" as the first blog until told otherwise

## System Architecture

### Application Structure

The application employs a monorepo structure, separating the React-based frontend (`client/`), an Express.js backend API (`server/`), and shared TypeScript types and database schemas (`shared/`).

### Frontend Architecture

**Technology Stack**: React 18 with TypeScript, Vite.
**UI/UX**: shadcn/ui components (Radix UI primitives) and Tailwind CSS, "new-york" design aesthetic with a logo-derived muted color palette. Wouter for client-side routing, TanStack Query for server state management.

### Design System (January 2026 Refresh)

**Color Palette** (derived from hexagonal logo):
- **Primary**: Muted Teal `hsl(172, 34%, 43%)` - main brand color for buttons and CTAs
- **Secondary**: Dusty Rose `hsl(16, 38%, 62%)` - complementary accent
- **Accent**: Soft Lavender `hsl(281, 24%, 64%)` - highlights and badges
- **Support**: Sage Green `hsl(96, 22%, 52%)` - success states and secondary accents
- **Background**: Warm Cream `hsl(36, 20%, 97%)` - page backgrounds
- **Foreground**: Dark Blue-Gray `hsl(206, 21%, 16%)` - primary text

**Gradient Utilities** (defined in index.css):
- `gradient-primary`: Teal-to-teal (single-family)
- `gradient-secondary`: Coral-to-coral
- `gradient-accent`: Lavender-to-lavender
- `gradient-subtle`: Cream-to-muted (page backgrounds)
- `text-gradient`: Teal-to-lavender (headline accents)

**Component Styling**:
- Header: White background with subtle shadow for visual separation
- Page containers: `bg-gradient-to-b from-background to-muted` for depth
- Text: Uses semantic tokens (`text-foreground`, `text-muted-foreground`)
- Interactive elements: Primary teal for buttons and links

### Backend Architecture

**Server Framework**: Express.js on Node.js.
**API Design**: RESTful API for quiz results, authentication, email capture, productivity tools, and sitemap generation. Zod schemas for validation.
**Security**: API rate limiting, Supabase JWT token validation.
**Authentication**: Supabase Auth for user login (Google OAuth, Email magic links) with support for anonymous quiz taking. Email-based user migration automatically links existing user data when signing in with a matching email address.

### Data Storage

**Database**: PostgreSQL via Neon serverless driver.
**ORM**: Drizzle ORM for type-safe database interactions and schema management.
**Schema Design**: Key tables include `users`, `sessions`, `quiz_results`, `tools`, `email_captures`, `waitlist`, `feedback`, `orders`, `playbook_progress`, `action_plan_progress`, `tool_tracking`, and `playbook_notes`.
**Data Access**: Repository pattern via `DatabaseStorage` class.

### Quiz Logic Architecture

**Assessment Design**: 28 questions across four dimensions: Structure Orientation, Motivation Style, Cognitive Focus, and Task Relationship.
**Quiz Flow**: 5 questions per page, auto-advance on answer selection, auto-advance to next page after 5 questions.
**Scoring Algorithm**: Answers contribute to a numeric score per axis, determining archetype via range matching and a distance-based fit scoring system (Manhattan distance), with edge case handling.
**Archetypes**: Six distinct, scientifically-grounded archetypes.

### UI/UX Decisions and Features

-   **Results Page Architecture (Jan 2026 Refactor)**: Modular component structure in `client/src/components/results/` for maintainability. Sections in order: ResultsHero (simplified "You're a {archetype}" format with confidence badge), 4-Axis Visualization, Mobile App Waitlist, ShowsUpSection (merged strengths/friction points), FastestWinCard (single highlighted action with scroll-to-upsell), UpsellSection (id="upsell" anchor, moved earlier for conversion), TestimonialsSection, EmailFallbackSection (secondary "Not ready yet?" capture), ToolsAccordion (collapsed by default), RetakeSection, MobileStickyCTA (sticky bottom bar on mobile after scrolling past hero).
-   **Modern 4-Axis Visualization**: Dynamic, animated horizontal bar chart for score visualization.
-   **Enhanced Homepage**: Research-backed messaging, trust badges, founder story, social proof.
-   **Mobile Navigation**: Responsive hamburger menu.
-   **Blog System**: Full-featured blog.
-   **Email Capture**: Integrated forms and exit-intent popup.
-   **Productivity Tools Database**: 20 tools with archetype-specific fit scores.
-   **PDF Export**: Professional, print-optimized PDF export of quiz results.
-   **SEO Optimization**: Unique meta tags, Open Graph tags, canonical URLs, dynamic XML sitemap.
-   **Progress Tracking**: Dashboard displays score evolution and archetype changes.
-   **Social Sharing**: Multi-platform sharing on results page.
-   **Analytics Integration**: Google Analytics 4 with automatic page view and event tracking.
-   **Email Results Feature**: Users can email their complete assessment results to themselves.
-   **Stripe Premium Payment Integration**: E-commerce system with 2-tier pricing (Discovery free, Complete Playbook $19-$29) featuring early-bird pricing (first 100 customers get $19, then $29), guest purchase flow, and secure webhooks.
-   **Premium Playbook System**: Interactive web-based playbooks with chapter progress tracking, 30-Day Action Plan, Tool Implementation Tracker, and Personal Notes System (CRUD). Premium access middleware ensures paid access. PDF download available.
-   **Progress Tracking Database Schema**: `playbook_progress`, `action_plan_progress`, `tool_tracking`, `playbook_notes`.
-   **Resources Page**: Curated productivity tools.
-   **Science Page**: Redesigned for accessibility with downloadable research paper and embedded PDF preview.
-   **Refund Policy Page**: Comprehensive 30-day satisfaction guarantee.
-   **Image Optimization**: Images compressed using sharp library.
-   **Progressive Web App (PWA)**: Full PWA support with web app manifest, service worker, and install prompt.
-   **Mobile App (Coming Soon)**: AI Productivity Coach feature is being developed as a dedicated mobile app for iOS and Android. Results page includes waitlist CTA with email capture and source tracking.
-   **Promo Code System**: Supports both 100% discount codes (direct access) and partial discounts (10%, 25%, 50%) via Stripe coupon integration. Active codes: FRIEND1019, BETATESTER2026! (valid until Feb 28, 2026).
-   **Weekly Accountability Emails**: Partner subscribers receive archetype-specific productivity tips and motivational content weekly via `/api/cron/weekly-accountability` endpoint.
-   **Abandoned Cart Automation**: Daily cron job sends follow-up emails to users who started but didn't complete checkout via `/api/cron/abandoned-cart` endpoint.
-   **Email Automation System (Feb 2026)**: Complete email nurture and onboarding sequences with archetype-specific personalization:
    - **Nurture Sequence (Pre-purchase)**: 5 emails over 14 days (Day 3, 5, 7, 10, 14) sent to quiz-takers who haven't purchased. Cron: `/api/cron/nurture-sequence`
    - **Onboarding Sequence (Post-purchase)**: 3 emails over 30 days (Day 3, 7, 30) sent to buyers. Cron: `/api/cron/onboarding-sequence`
    - **Email Tracking**: `email_captures` table tracks nurture/onboarding email flags and purchase status. `email_log` table logs all sent emails with Resend IDs.
    - **Archetype Content**: `server/email-content.ts` contains personalized content for each archetype (advantages, mistakes, fixes, tool recommendations).
-   **Subscription Lifecycle Webhooks**: Full Stripe webhook handling for subscription events (checkout.session.completed, customer.subscription.deleted, invoice.paid, invoice.payment_failed) with automatic order status updates and email notifications.

### Mobile API Endpoints

The backend exposes mobile-ready API endpoints:

**Mobile App API v1 (Supabase JWT Auth)**:
-   `GET /api/v1/mobile/user` - Get user profile, latest assessment, and premium status
-   `POST /api/v1/mobile/assessment` - Save assessment results (expects { vispiCategory, answers, scores })
-   `GET /api/v1/mobile/assessment` - Get user's latest assessment
-   `GET /api/v1/mobile/assessment/history` - Get all user's assessments

**Legacy Mobile Endpoints**:
-   **AI Coach API**: `POST /api/ai-coach` (streaming SSE) and `POST /api/v1/ai-coach` (non-streaming JSON) - reserved for upcoming mobile app.
-   **Quiz & Results API**: `GET /api/quiz/results/:sessionId`, `POST /api/quiz/submit`, `POST /api/quiz/claim/:sessionId`.
-   **Tools API**: `GET /api/tools`, `GET /api/tools/archetype/:archetypeId`.

## External Dependencies

### Database & Infrastructure

-   **Neon Database**: Serverless PostgreSQL.
-   **Drizzle ORM**: TypeScript ORM.
-   **Drizzle Kit**: CLI for migrations.

### Frontend Libraries

-   **React**: Core UI.
-   **Vite**: Build tool.
-   **Wouter**: Client-side routing.
-   **TanStack Query**: Server state management.
-   **shadcn/ui / Radix UI**: UI components.
-   **Tailwind CSS**: Styling.
-   **React Hook Form**: Form management.
-   **Zod**: Runtime type validation.
-   **Lucide React**: Icon library.
-   **Google Analytics 4**: Analytics tracking.

### Backend Libraries

-   **Express**: Web server framework.
-   **ws**: WebSocket support (for Neon).
-   **Resend**: Transactional email service.
-   **Stripe**: Payment processing.
-   **OpenAI**: AI productivity coach (via Replit AI Integrations).

### Development Tools

-   **TypeScript**: Language.
-   **esbuild**: Server-side bundling.
-   **tsx**: TypeScript execution for development.