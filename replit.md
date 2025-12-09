# Prolific Personalities - Productivity Assessment Platform

## Overview

Prolific Personalities is a web application designed to help users identify their unique productivity archetype through a research-backed assessment. The platform analyzes user responses across four cognitive and behavioral dimensions to assign one of six distinct productivity archetypes. It then provides personalized strategies, tool recommendations, and insights tailored to their specific working style. The project aims to offer a user-friendly, mobile-responsive experience with immediate, shareable results, fostering improved personal productivity and understanding. The business vision is to become the leading platform for personalized productivity insights, leveraging market potential in self-improvement and professional development.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Application Structure

The application employs a monorepo structure, separating the React-based frontend (`client/`), an Express.js backend API (`server/`), and shared TypeScript types and database schemas (`shared/`). This setup ensures type-safe communication and clear separation of concerns.

### Frontend Architecture

**Technology Stack**: React 18 with TypeScript, using Vite for build and development.
**UI/UX**: Utilizes shadcn/ui components (Radix UI primitives) and Tailwind CSS for styling, adhering to a "new-york" design aesthetic with a custom productivity-focused color palette (indigo primary, teal accent). Wouter handles client-side routing, and TanStack Query manages server state, data fetching, and caching.

### Backend Architecture

**Server Framework**: Express.js on Node.js.
**API Design**: A RESTful API provides endpoints for quiz result management, user authentication, email capture, productivity tool data, and sitemap generation. Zod schemas are used for runtime data validation.
**Security**: Comprehensive API rate limiting is implemented.
**Authentication**: Integrated Replit Auth for optional user login (Google/GitHub/email) allowing users to save results and access a dashboard. Anonymous quiz taking is also supported.

### Data Storage

**Database**: PostgreSQL, accessed via Neon serverless driver.
**ORM**: Drizzle ORM provides type-safe database interactions and schema management.
**Schema Design**: Key tables include `users`, `sessions`, `quiz_results`, `tools`, `email_captures`, `waitlist`, `feedback`, `orders`, `playbook_progress`, `action_plan_progress`, `tool_tracking`, and `playbook_notes`.
**Data Access**: A repository pattern via the `DatabaseStorage` class abstracts database operations.

### Quiz Logic Architecture

**Assessment Design**: The quiz features 28 questions across four cognitive and behavioral dimensions: Structure Orientation, Motivation Style, Cognitive Focus, and Task Relationship.
**Quiz Flow (16personalities-style)**: 5 questions displayed per page with auto-advance on answer selection. Users don't need to click Next for individual questions - selecting an answer automatically scrolls to the next question. After completing all 5 questions on a page, auto-advances to the next page. Page navigation dots allow jumping between pages. 6 total pages (28 questions / 5 per page).
**Scoring Algorithm**: Answers contribute to a numeric score per axis, determining the user's archetype through range matching and a distance-based fit scoring system (Manhattan distance) for all six archetypes, with edge case handling for co-primary blends and multiple moderate matches.
**Archetypes**: Six distinct archetypes are defined, each representing a unique combination of the four dimensions.
**Scientific Foundation**: Grounded in psychological theories such as Executive Function Theory, Cognitive Load Theory, Self-Determination Theory, procrastination research, and flow theory.

### UI/UX Decisions and Features

-   **Modern 4-Axis Visualization**: Dynamic, animated horizontal bar chart for score visualization.
-   **Enhanced Homepage**: Features research-backed messaging, trust badges, founder story, and social proof.
-   **Mobile Navigation**: Responsive hamburger menu.
-   **Blog System**: Full-featured blog with listing and detail pages.
-   **Email Capture**: Integrated forms and an exit-intent popup.
-   **Productivity Tools Database**: 20 tools with archetype-specific fit scores for personalized recommendations.
-   **PDF Export**: Professional, print-optimized PDF export of quiz results.
-   **SEO Optimization**: Unique meta tags, Open Graph tags, canonical URLs, and a dynamic XML sitemap.
-   **Progress Tracking**: Dashboard displays score evolution over time and archetype changes.
-   **Social Sharing**: Multi-platform sharing dropdown on results page.
-   **Analytics Integration**: Google Analytics 4 integration with automatic page view and event tracking. VITE_GA_MEASUREMENT_ID configured and actively tracking user behavior.
-   **Email Results Feature**: Users can email their complete assessment results to themselves.
-   **Stripe Premium Payment Integration**: E-commerce system for selling premium archetype playbooks ($27), including guest purchase flow and secure webhook handling. Stores customer email for post-purchase communication.
-   **Premium Playbook System**: Interactive web-based playbooks with comprehensive progress tracking:
    -   **Purchase Success Page**: Post-payment confirmation with email notification and clear CTA to access the playbook.
    -   **Chapter Progress Tracking**: Users can mark chapters as complete, with completion percentage displayed.
    -   **30-Day Action Plan Progress**: Interactive daily task tracking with completion checkboxes and streak monitoring.
    -   **Tool Implementation Tracker**: Monitor recommended productivity tool adoption with status tracking (Not Started/Testing/Using Daily) and personal notes.
    -   **Personal Notes System**: Users can save reflections and insights for each playbook section, with CRUD operations.
    -   **Premium Access Middleware**: Server-side verification ensures only paying users can access playbook content for their archetype.
    -   **PDF Download**: Users can download the PDF version of their playbook for offline access.
-   **Progress Tracking Database Schema**: Four new tables track user engagement:
    -   `playbook_progress`: Chapter completion tracking with timestamps
    -   `action_plan_progress`: 30-day plan task completion with day number and task IDs
    -   `tool_tracking`: Tool adoption status and user notes per tool
    -   `playbook_notes`: User reflections and notes per section with CRUD support
-   **Resources Page**: Curated productivity tools organized by archetype and universal tools.
-   **Science Page Simplification**: Redesigned for accessibility with downloadable research paper and embedded PDF preview.
-   **PDF Preview Component**: Reusable component for previewing PDF documents with download and fullscreen buttons, used on Science page (research paper) and Playbook page (PDF tab).
-   **About Page Enhancements**: Research link, waitlist form, and comprehensive feedback form.
-   **Refund Policy Page**: Comprehensive 30-day satisfaction guarantee with clear step-by-step refund process documentation. Links added to footer, pricing page, and results checkout section.
-   **Image Optimization**: All images compressed using sharp library with 60-90% file size reduction (archetype images 15MB→3MB, logos 4MB→1MB, ~20MB total savings) while maintaining visual quality.

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
-   **Google Analytics 4**: For analytics tracking.

### Backend Libraries

-   **Express**: Web server framework.
-   **ws**: WebSocket support for Neon.
-   **Resend**: Transactional email service for sending assessment results.
-   **Stripe**: Payment processing for premium playbook purchases.

### Development Tools

-   **TypeScript**: Language for type safety.
-   **esbuild**: Server-side bundling.
-   **tsx**: TypeScript execution for development.