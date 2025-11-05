# Prolific Personalities - Productivity Assessment Platform

## Overview

Prolific Personalities is a web application designed to help users identify their unique productivity archetype through a research-backed assessment. The platform analyzes user responses across four cognitive and behavioral dimensions to assign one of six distinct productivity archetypes. It then provides personalized strategies, tool recommendations, and insights tailored to their specific working style. The project aims to offer a user-friendly, mobile-responsive experience with immediate, shareable results, fostering improved personal productivity and understanding.

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