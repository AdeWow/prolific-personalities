# Prolific Personalities - Productivity Assessment Platform

## Overview

Prolific Personalities is a research-backed web application that helps users discover their unique productivity archetype through a scientifically-designed assessment. The platform analyzes users across four cognitive and behavioral dimensions (Structure Orientation, Motivation Style, Cognitive Focus, and Task Relationship) to map them to one of six productivity archetypes, then provides personalized strategies, tools, and insights tailored to their working style.

The application is built as a full-stack TypeScript web application with a React frontend and Express backend, designed to deliver an engaging, mobile-friendly assessment experience with immediate, shareable results.

**Recent Features Added (November 2025)**:
- **Blog System**: Full-featured blog with listing and detail pages to share productivity insights
  - First blog post: "6 Productivity Archetypes Explained" covering all six archetypes with actionable strategies
  - Each blog post includes CTA to take the assessment
  - Blog accessible via header and footer navigation links
  - Posts include metadata: publish date, read time, tags, author
- **Modern 4-Axis Visualization**: Replaced radar chart with dynamic, animated horizontal bar visualization showing Structure Orientation, Motivation Style, Cognitive Focus, and Task Relationship with real-time score indicators and interpretation guidance
- **Email Capture**: Users can save their results via email for marketing campaigns and follow-up engagement
- **Productivity Tools Database**: 20 productivity tools (Freedom, Notion, Todoist, Asana, IFTTT, Airtable, etc.) with archetype-specific fit scores (0-100) to recommend the best tools for each user's working style
- **PDF Export**: Users can export their results as PDF using browser's native print functionality with professional print CSS
- **Tool Recommendations**: Results page displays up to 9 tools filtered and sorted by archetype fit score, showing pricing, pros/cons, and platform information
- **Enhanced Homepage**:
  - Research-backed hero messaging emphasizing peer-reviewed science
  - Trust badges section (Research-Backed, 2,000+ Users, GDPR Compliant, Actionable Advice)
  - Founder story section explaining the personal journey behind the platform
  - Social proof with user testimonials and validated statistics

**Latest Updates (November 4, 2025)**:
- **Mobile Navigation**: Responsive hamburger menu with mobile-optimized navigation across all pages
- **Pricing Page**: Comprehensive pricing page with free vs premium comparison, FAQ section, and clear value propositions
- **Email Capture Components**: Reusable email capture cards on blog listing and archetypes pages for lead generation
- **Exit-Intent Popup**: Global exit-intent modal for capturing emails before users leave the site
- **SEO Optimization**: Added unique meta tags, Open Graph tags, and canonical URLs to key pages (Home, Pricing, Archetypes)
- **Testimonials on Homepage**: Social proof section displaying three customer testimonials with archetype badges
- **Navigation Updates**: Added Pricing link to both desktop and mobile navigation menus
- **Print CSS**: Enhanced PDF export with professional print styles (hidden headers, optimized page breaks, readable text)

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Application Structure

**Monorepo Organization**: The codebase uses a monorepo structure with three main directories:
- `client/` - React-based frontend application
- `server/` - Express.js backend API
- `shared/` - TypeScript types and database schemas shared between frontend and backend

This architecture enables type-safe communication between client and server while maintaining clear separation of concerns.

### Frontend Architecture

**Technology Stack**: React 18 with TypeScript, using Vite as the build tool and development server.

**UI Framework**: The application uses shadcn/ui components (Radix UI primitives) styled with Tailwind CSS. This provides a comprehensive, accessible component library with a consistent "new-york" design style and a custom productivity-focused color palette (primary: indigo, accent: teal, neutral grays).

**Routing**: Client-side routing is handled by Wouter, a lightweight React router that provides path-based navigation without requiring a full routing framework. Routes include:
- `/` - Homepage
- `/quiz` - Assessment quiz
- `/results/:sessionId` - Results page with personalized insights
- `/blog` - Blog listing page
- `/blog/:slug` - Individual blog post pages
- `/about`, `/science`, `/archetypes`, `/faq` - Informational pages

**State Management**: 
- TanStack Query (React Query) manages server state, data fetching, and caching
- Local React state (useState) handles ephemeral UI state like quiz progress and current answers
- No global state management library (Redux, Zustand) is used - the application relies on React Query's cache and local component state

**Key Design Patterns**:
- Component composition with reusable UI primitives (Button, Card, Badge, etc.)
- Custom hooks for cross-cutting concerns (useToast, useIsMobile)
- Separation of business logic into utility modules (quiz-logic.ts)
- Type-safe API communication using shared schemas

### Backend Architecture

**Server Framework**: Express.js running on Node.js with ESM module format.

**API Design**: RESTful API with endpoints for:
- `POST /api/quiz/results` - Saves completed quiz results
- `GET /api/quiz/results/:sessionId` - Retrieves results by session ID
- `POST /api/email-capture` - Saves email address for marketing campaigns
- `GET /api/tools` - Retrieves all productivity tools
- `GET /api/tools/archetype/:archetypeId` - Retrieves tools filtered and sorted by archetype fit score
- `POST /api/tools/seed` - Seeds the database with initial productivity tools (one-time operation)

The API uses Zod schemas for runtime validation of incoming data, ensuring type safety at the API boundary.

**Development vs Production**:
- Development: Vite dev server integrated as Express middleware for HMR and fast refresh
- Production: Static files served from `dist/public` after Vite build

**Error Handling**: Centralized error handling middleware catches and formats errors consistently, returning JSON error responses with appropriate HTTP status codes.

### Data Storage

**Database**: PostgreSQL accessed via Neon serverless driver (WebSocket-based connection pooling).

**ORM**: Drizzle ORM provides type-safe database queries and schema management. The schema is defined in TypeScript and migrations are generated using Drizzle Kit.

**Schema Design**:
- `users` table - Basic user authentication (username, password)
- `quiz_results` table - Stores quiz completions with:
  - Unique session IDs for retrieval
  - JSONB columns for answers and calculated scores
  - Archetype assignment
  - Completion timestamp
- `tools` table - Productivity tool database with:
  - Tool name, description, category
  - JSONB columns for pricing and archetype fit scores
  - Array columns for pros, cons, platforms
  - URL for external links
- `email_captures` table - Email marketing captures with:
  - Email address
  - Session ID linking to quiz results
  - Timestamp of capture

**Data Access Pattern**: Repository pattern implemented through the `DatabaseStorage` class, which provides an abstraction layer (`IStorage` interface) over direct database access. This enables easier testing and potential future storage backend changes.

### Quiz Logic Architecture

**Assessment Design**: The quiz implements a validated psychological assessment methodology with:
- 24-28 questions across four axes (6-7 questions per axis)
- Mixed question types: Likert scale (70%), scenario-based (15%), binary choice (15%)
- Reverse-scored items to prevent response bias
- Attention check questions for data quality

**Four-Axis Framework**:
1. **Structure Orientation** - Measures preference for routines vs. spontaneity, planning vs. improvisation
2. **Motivation Style** - Assesses intrinsic vs. extrinsic motivation, response to deadlines and accountability
3. **Cognitive Focus** - Evaluates attention scope (deep focus vs. task-switching), working memory patterns
4. **Task Relationship** - Captures procrastination patterns, flow state tendency, emotional approach to tasks

**Scoring Algorithm**: 
- Each answer maps to a numeric score based on question-specific scoring rules
- Scores are aggregated per axis to create a four-dimensional profile
- Archetype determination uses range matching - the archetype whose defined score ranges best match the user's calculated scores is selected
- When scores don't perfectly match ranges, distance-based penalties determine the closest match

**Six Archetypes**: The Structured Achiever, The Chaotic Creative, The Integrator, The Executor, The Visionary, and The Alchemist - each represents a distinct combination of the four dimensions with tailored recommendations.

### Scientific Foundation

The assessment is grounded in:
- Executive Function Theory (Barkley)
- Cognitive Load Theory (Sweller)
- Self-Determination Theory (Deci & Ryan)
- Procrastination research (Pychyl, Ferrari)
- Flow theory (Csikszentmihalyi)

Content and archetype definitions are informed by behavioral psychology and motivational theory literature.

## External Dependencies

### Database & Infrastructure
- **Neon Database** - Serverless PostgreSQL with WebSocket connections
- **Drizzle ORM** - TypeScript ORM for database queries and schema management
- **Drizzle Kit** - CLI tool for database migrations and schema pushing

### Frontend Libraries
- **React** - UI library
- **Vite** - Build tool and dev server
- **Wouter** - Client-side routing
- **TanStack Query** - Server state management and data fetching
- **shadcn/ui / Radix UI** - Component library (Accordion, Dialog, Dropdown, Popover, Toast, etc.)
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form state management (via @hookform/resolvers)
- **Zod** - Runtime type validation and schema validation
- **date-fns** - Date formatting utilities
- **class-variance-authority & clsx** - Conditional className utilities
- **Lucide React** - Icon library

### Backend Libraries
- **Express** - Web server framework
- **ws** - WebSocket support for Neon database connections
- **connect-pg-simple** - PostgreSQL session store for Express (currently included but sessions not implemented)

### Development Tools
- **TypeScript** - Type safety across the stack
- **esbuild** - Server-side bundling for production
- **tsx** - TypeScript execution for development
- **@replit/vite-plugin-runtime-error-modal** - Development error overlay
- **@replit/vite-plugin-cartographer** - Replit integration (development only)

### Asset Management
The `attached_assets/` directory contains content documents that inform the quiz design, archetype descriptions, and educational content. These are referenced by the frontend pages but not directly imported as modules.

### Blog Content System
The blog is powered by a simple TypeScript data file (`client/src/data/blog-posts.ts`) containing an array of blog post objects. Each post includes:
- Metadata: id, title, slug, excerpt, publishDate, author, readTime, tags
- Content: Markdown-style string with headings and bold formatting
- Blog listing page (`/blog`) displays all posts in a card grid with metadata
- Blog post detail page (`/blog/:slug`) renders the full content with simple paragraph/heading parsing
- Each post ends with a CTA card encouraging users to take the assessment