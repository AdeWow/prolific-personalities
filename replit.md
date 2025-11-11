# Prolific Personalities - Productivity Assessment Platform

## Overview

Prolific Personalities is a web application designed to help users identify their unique productivity archetype through a research-backed assessment. The platform analyzes user responses across four cognitive and behavioral dimensions to assign one of six distinct productivity archetypes. It then provides personalized strategies, tool recommendations, and insights tailored to their specific working style. The project aims to offer a user-friendly, mobile-responsive experience with immediate, shareable results, fostering improved personal productivity and understanding.

## Recent Changes (November 11, 2025)

-   **Stripe Premium Payment Integration**: Complete e-commerce system for selling premium archetype playbooks ($27 each):
    - **Payment Processing**: Integrated Stripe Checkout with test mode keys (pk_test_, sk_test_) ready for production
    - **Database Schema**: Added `orders` table tracking userId/sessionId, archetype, amount, payment status, and PDF URLs
    - **API Endpoints**:
      * POST /api/create-checkout-session: Creates Stripe checkout session with orderId in metadata
      * POST /api/webhook/stripe: Handles payment confirmations with raw body parsing and signature verification
      * GET /api/orders: Fetches user's completed orders
      * GET /api/download/:orderId: Serves premium PDF downloads with authorization check
    - **Webhook Security**: 
      * Registered webhook route BEFORE express.json() middleware to preserve raw body for signature verification
      * STRIPE_WEBHOOK_SECRET optional in development (with warning), required for production
      * Proper signature verification using Stripe SDK
    - **Guest Purchase Flow**: 
      * Guests can purchase premium reports without logging in (order linked to sessionId)
      * When guest later logs in and claims quiz session, orders are automatically claimed via `claimOrdersBySession()`
      * Claimed orders appear in user's dashboard for download
    - **Frontend UI**:
      * Results page: Premium upgrade card with benefits list and "Get My Full Report - $27" button
      * Dashboard: Premium downloads section showing purchased reports with download buttons
      * Payment success/cancelled pages with clear next steps
      * Routes: /payment-success and /payment-cancelled
    - **Storage Layer**: Added methods (createOrder, getOrdersByUserId, updateOrderStatus, claimOrdersBySession)
    - **Premium PDFs**: 6 archetype-specific playbooks ready to upload to attached_assets directory

-   **Distance-Based Fit Scoring System**: Advanced archetype matching using Manhattan distance calculation:
    - Score normalization: Raw scores (7-35) mapped to 0-100 scale using formula ((score-7)/28)*100
    - Ideal archetype profiles: Each of 6 archetypes defined with target scores across 4 dimensions
    - Distance-based fit calculation: Manhattan distance across all axes, converted to similarity percentage
    - Archetype breakdown: Results page shows all 6 archetypes ranked by fit percentage (0-100%)
    - Visual progress bars: Each archetype displayed with color-coded bar (indigo for primary, gray for others)
    - Enhanced edge case handling:
      * Co-primary blends (≤10% difference between top 2)
      * Multiple moderate matches (≤15% spread across 3 archetypes)
      * Adaptive generalists (3+ balanced axes)
    - Confidence levels: Exact (≥80%), Strong (65-79%), Moderate (50-64%), Weak (<50%)
    - Contextual notes: Dynamic explanations based on fit patterns and score distributions
    - Algorithm: 100% client-side calculation, no backend changes required
-   **Enhanced Assessment Algorithm**: Comprehensive edge case handling system for quiz scoring:
    - Score categorization (LOW/MEDIUM/HIGH) for each axis based on 7-35 score range
    - Multiple archetype matching for balanced profiles
    - Personalized notes explaining balanced tendencies and adaptability
    - Secondary archetypes displayed for moderate/weak matches
    - Results page shows confidence badge, profile notes, and alternative archetypes
    - Handles mid-range scores, weak matches, and ties gracefully
-   **Resources Page Launch**: New comprehensive tools and resources page (`/resources`) featuring:
    - Curated productivity tools organized by archetype
    - Tabbed interface: "By Archetype" and "All Tools" views
    - Essential Stack recommendations for each of the 6 archetypes
    - Tool comparison table with 8+ universal productivity tools
    - Guidance on choosing the right tool stack
    - Fully responsive with dark mode support
    - Added to main navigation (desktop and mobile)
-   **Science Page Simplification**: Redesigned `/science` page for better accessibility while maintaining credibility:
    - Condensed research content into scannable, digestible sections
    - Simplified language while preserving key statistics and findings
    - Full 30+ page research paper available as downloadable PDF
    - Two prominent download buttons (top and bottom of page)
    - Visual hierarchy with colored section cards
    - Evidence badges (Strong Evidence vs. Mixed Results) for productivity frameworks
-   **About Page Enhancements**: Three major additions to `/about` page:
    - Research link button in "Research Behind It" section linking to `/science`
    - Waitlist form in "What's Next" section with compelling incentive messaging:
      - Early access to new features
      - Exclusive beta access
      - Special discounts on premium features
    - Comprehensive feedback form in "Stay Connected" section:
      - Name (optional), Email (optional), Type selector, Message (required)
      - Proper validation using shadcn Form + react-hook-form
      - Email format validation, 10-character minimum for messages
      - Success toasts and form reset on submission
-   **Database Additions**: Two new tables for user engagement:
    - `waitlist`: Captures early access signups with email and session tracking
    - `feedback`: Stores user feedback with type categorization (feedback/recommendation/feature_request)
-   **Blog Content Expansion**: Added two new blog posts:
    - "When Productivity Hurts: The Real Weight of Guilt" - addresses productivity guilt and self-compassion
    - "Digital Minimalism Challenge: Can You Survive Without Notifications?" - 7-day challenge with research on attention and distraction
    - Reorganized blog page layout with email capture moved to bottom after posts grid

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Application Structure

The application employs a monorepo structure, separating the React-based frontend (`client/`), an Express.js backend API (`server/`), and shared TypeScript types and database schemas (`shared/`). This setup ensures type-safe communication and clear separation of concerns.

### Frontend Architecture

**Technology Stack**: React 18 with TypeScript, using Vite for build and development.
**UI/UX**: Utilizes shadcn/ui components (Radix UI primitives) and Tailwind CSS for styling, adhering to a "new-york" design aesthetic with a custom productivity-focused color palette (indigo primary, teal accent).
**Routing**: Wouter handles client-side routing for pages like the homepage, quiz, results, dashboard, blog, and informational pages.
**State Management**: Relies on TanStack Query for server state, data fetching, and caching, alongside local React state for UI-specific data.

### Backend Architecture

**Server Framework**: Express.js on Node.js.
**API Design**: A RESTful API provides endpoints for quiz result management (saving, retrieval, claiming), user authentication (Replit Auth integration), email capture, productivity tool data, and sitemap generation. Zod schemas are used for runtime data validation.
**Security**: Comprehensive API rate limiting is implemented across general, write, and email capture operations to prevent abuse.
**Authentication**: Integrated Replit Auth for optional user login (Google/GitHub/email), allowing users to save results and access a dashboard of past quizzes. Anonymous quiz taking is also supported.

### Data Storage

**Database**: PostgreSQL, accessed via Neon serverless driver.
**ORM**: Drizzle ORM provides type-safe database interactions and schema management.
**Schema Design**: Key tables include `users` (for authentication), `sessions`, `quiz_results` (storing quiz completions, scores, and archetype assignments), `tools` (productivity tool details), and `email_captures`.
**Data Access**: A repository pattern via the `DatabaseStorage` class abstracts database operations, enhancing maintainability and testability.

### Quiz Logic Architecture

**Assessment Design**: The quiz features 24-28 questions, a mix of Likert scale, scenario-based, and binary choices, distributed across four axes:
1.  **Structure Orientation**: Preference for routine vs. spontaneity.
2.  **Motivation Style**: Intrinsic vs. extrinsic motivation.
3.  **Cognitive Focus**: Attention scope and working memory.
4.  **Task Relationship**: Procrastination and flow state tendencies.
**Scoring Algorithm**: Each answer contributes to a numeric score per axis. These scores determine the user's archetype through range matching, with distance-based penalties for non-exact matches.
**Archetypes**: Six distinct archetypes (e.g., The Structured Achiever, The Chaotic Creative) are defined, each representing a unique combination of the four dimensions.
**Scientific Foundation**: The assessment is grounded in psychological theories such as Executive Function Theory, Cognitive Load Theory, Self-Determination Theory, procrastination research, and flow theory.

### UI/UX Decisions and Features

-   **Modern 4-Axis Visualization**: Dynamic, animated horizontal bar chart replaces traditional radar charts for score visualization.
-   **Enhanced Homepage**: Features research-backed messaging, trust badges, founder story, and social proof elements.
-   **Mobile Navigation**: Responsive hamburger menu for optimized mobile experience.
-   **Blog System**: A full-featured blog with listing and detail pages for productivity insights, including CTA to take the assessment.
-   **Email Capture**: Integrated email capture forms and an exit-intent popup for lead generation.
-   **Productivity Tools Database**: A database of 20 tools with archetype-specific fit scores, providing personalized recommendations.
-   **PDF Export**: Professional, print-optimized PDF export of quiz results with detailed analysis and scientific foundation.
-   **SEO Optimization**: Unique meta tags, Open Graph tags, canonical URLs, and a dynamic XML sitemap.
-   **Progress Tracking**: Dashboard displays score evolution over time, comparing latest vs. first assessment across all four dimensions with visual indicators for changes. Shows archetype evolution when users' productivity styles change between assessments.
-   **Social Sharing**: Multi-platform sharing dropdown on results page with pre-filled content for Twitter, Facebook, LinkedIn, WhatsApp, and one-click copy link functionality.
-   **Analytics Integration**: Google Analytics 4 integration with automatic page view tracking and event tracking utilities (requires VITE_GA_MEASUREMENT_ID secret).

## External Dependencies

### Database & Infrastructure

-   **Neon Database**: Serverless PostgreSQL for data storage.
-   **Drizzle ORM**: TypeScript ORM for database interaction.
-   **Drizzle Kit**: CLI tool for database migrations.

### Frontend Libraries

-   **React**: Core UI library.
-   **Vite**: Build tool.
-   **Wouter**: Client-side routing.
-   **TanStack Query**: Server state management.
-   **shadcn/ui / Radix UI**: UI component library.
-   **Tailwind CSS**: Styling framework.
-   **React Hook Form**: Form management.
-   **Zod**: Runtime type validation.
-   **Lucide React**: Icon library.

### Backend Libraries

-   **Express**: Web server framework.
-   **ws**: WebSocket support for Neon.

### Development Tools

-   **TypeScript**: Language for type safety.
-   **esbuild**: Server-side bundling.
-   **tsx**: TypeScript execution for development.