# Prolific Personalities - Productivity Assessment Platform

## Overview

Prolific Personalities is a web application designed to help users identify their unique productivity archetype through a research-backed assessment. The platform analyzes user responses across four cognitive and behavioral dimensions to assign one of six distinct productivity archetypes. It then provides personalized strategies, tool recommendations, and insights tailored to their specific working style. The project aims to offer a user-friendly, mobile-responsive experience with immediate, shareable results, fostering improved personal productivity and understanding. The business vision is to become the leading platform for personalized productivity insights, leveraging market potential in self-improvement and professional development.

## User Preferences

Preferred communication style: Simple, everyday language.

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
**Security**: API rate limiting.
**Authentication**: Replit Auth for user login (Google/GitHub/email) with support for anonymous quiz taking.

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
-   **Stripe Premium Payment Integration**: E-commerce system with 3-tier pricing (Discovery, Complete Playbook, Productivity Partner) including guest purchase flow, subscriptions, and secure webhooks.
-   **Premium Playbook System**: Interactive web-based playbooks with chapter progress tracking, 30-Day Action Plan, Tool Implementation Tracker, and Personal Notes System (CRUD). Premium access middleware ensures paid access. PDF download available.
-   **Progress Tracking Database Schema**: `playbook_progress`, `action_plan_progress`, `tool_tracking`, `playbook_notes`.
-   **Resources Page**: Curated productivity tools.
-   **Science Page**: Redesigned for accessibility with downloadable research paper and embedded PDF preview.
-   **Refund Policy Page**: Comprehensive 30-day satisfaction guarantee.
-   **Image Optimization**: Images compressed using sharp library.
-   **Progressive Web App (PWA)**: Full PWA support with web app manifest, service worker, and install prompt.
-   **AI Productivity Coach**: Personalized AI coaching powered by OpenAI GPT-4o-mini. Dedicated coach page (`/coach`) with conversation history, archetype-specific prompts, personalization banner, enhanced system prompts, usage-based rate limiting, and chat history persistence.

### Mobile API Endpoints

The backend exposes mobile-ready API endpoints:
-   **AI Coach API**: `POST /api/ai-coach` (streaming SSE) and `POST /api/v1/ai-coach` (non-streaming JSON).
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