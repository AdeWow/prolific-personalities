# Migration Audit: Replit → Vercel

**Project:** Prolific Personalities
**Date:** 2026-02-12
**Source Platform:** Replit (autoscale deployment)
**Target Platform:** Vercel

---

## Table of Contents

1. [Project Structure & File Tree](#1-project-structure--file-tree)
2. [Entry Points & Build Configuration](#2-entry-points--build-configuration)
3. [Express Server & Route Inventory](#3-express-server--route-inventory)
4. [Frontend Pages Inventory](#4-frontend-pages-inventory)
5. [Replit-Specific Code](#5-replit-specific-code)
6. [Database Usage](#6-database-usage)
7. [Middleware & Auth](#7-middleware--auth)
8. [Static Assets & File Handling](#8-static-assets--file-handling)
9. [Cron Jobs & Background Tasks](#9-cron-jobs--background-tasks)
10. [Stripe & Payment Flow](#10-stripe--payment-flow)
11. [Resend Email Integration](#11-resend-email-integration)
12. [Environment Variable Usage Map](#12-environment-variable-usage-map)
13. [Dependencies Audit](#13-dependencies-audit)

---

## 1. Project Structure & File Tree

```
Prolific-Personalities-Replit/
├── .env                          # Client-only Supabase env vars (not committed)
├── .gitignore
├── .replit                       # Replit config (contains secrets - see Section 5)
├── client/
│   ├── .env                      # Client Supabase env vars
│   ├── index.html                # SPA entry point (contains Replit dev banner)
│   └── src/
│       ├── App.tsx               # React router + providers
│       ├── main.tsx              # ReactDOM entry
│       ├── index.css             # Tailwind CSS entry
│       ├── components/           # ~40 React components
│       │   ├── ui/               # shadcn/ui components
│       │   ├── quiz-container.tsx
│       │   ├── exit-intent-popup.tsx
│       │   └── ...
│       ├── contexts/
│       │   └── AuthContext.tsx    # Supabase auth state
│       ├── hooks/
│       │   ├── useAuth.ts
│       │   ├── use-toast.ts
│       │   └── ...
│       ├── lib/
│       │   ├── analytics.ts      # Google Analytics
│       │   ├── posthog.ts        # PostHog funnel tracking
│       │   ├── queryClient.ts    # TanStack Query config
│       │   ├── supabase.ts       # Client-side Supabase client
│       │   └── authUtils.ts
│       └── pages/                # ~30 page components
│           ├── home.tsx
│           ├── quiz.tsx
│           ├── results.tsx
│           ├── playbook.tsx
│           ├── pricing.tsx
│           ├── dashboard.tsx
│           ├── login.tsx
│           ├── auth-callback.tsx
│           ├── purchase-success.tsx
│           ├── admin-test-flows.tsx
│           └── ... (blog, about, science, archetypes, etc.)
├── server/
│   ├── index.ts                  # Express app bootstrap
│   ├── routes.ts                 # ALL API routes (~4843 lines)
│   ├── db.ts                     # Neon PostgreSQL connection
│   ├── storage.ts                # DatabaseStorage class (60+ methods)
│   ├── supabaseAuth.ts           # Auth middleware
│   ├── vite.ts                   # Dev/prod static serving
│   ├── premiumAssets.ts          # PDF asset mapping
│   ├── emailTemplates.ts         # 13+ email template generators (~1865 lines)
│   ├── email-content.ts          # Archetype-specific email copy
│   ├── archetypeData.ts          # Archetype definitions
│   ├── archetypePrompts.ts       # AI coach system prompts
│   ├── tools-data.ts             # Productivity tools seed data
│   └── replit_integrations/      # AI integration modules
│       ├── chat/
│       │   ├── index.ts
│       │   ├── routes.ts         # Chat AI routes (5 endpoints)
│       │   └── storage.ts        # Chat DB storage
│       ├── image/
│       │   ├── index.ts
│       │   ├── client.ts         # OpenAI image generation
│       │   └── routes.ts         # Image generation route
│       └── batch/
│           ├── index.ts
│           └── utils.ts          # Generic batch processing utils
├── shared/
│   ├── schema.ts                 # Drizzle ORM schema (23 tables)
│   └── models/
│       └── chat.ts               # Chat table definitions
├── attached_assets/              # PDFs, images, reference docs
├── scripts/
│   ├── optimize-images.js        # sharp-based image optimizer
│   ├── generate-favicons.js      # Favicon generator
│   ├── push-to-github.ts         # Replit GitHub integration
│   ├── github-init-push.ts       # Replit GitHub integration
│   └── github-push-api.ts        # Replit GitHub integration
├── migrations/                   # Drizzle migrations
├── package.json
├── tsconfig.json
├── vite.config.ts
├── drizzle.config.ts
├── replit.md                     # Replit agent documentation
└── list-models.ts                # Anthropic API utility
```

---

## 2. Entry Points & Build Configuration

### `package.json` — Scripts

```json
// File: /package.json
{
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "start": "NODE_ENV=production node dist/index.js",
    "check": "tsc",
    "db:push": "drizzle-kit push"
  }
}
```

**Migration notes:**
- `dev`: Uses `tsx` to run the Express server with TypeScript in development.
- `build`: Two-step: (1) Vite builds the React SPA to `dist/public/`, (2) esbuild bundles the Express server to `dist/index.js`.
- `start`: Runs the bundled server from `dist/index.js`. On Vercel, this will need to become a Serverless Function or be adapted for their runtime.
- The Express server serves BOTH the API and the static SPA — on Vercel, these will be separated (static via Edge Network, API via Serverless Functions).

### `vite.config.ts` — Full Contents

```typescript
// File: /vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
```

**Replit-specific items to remove:**
- `@replit/vite-plugin-runtime-error-modal` — always loaded, must be removed
- `@replit/vite-plugin-cartographer` — conditionally loaded when `REPL_ID` is defined, must be removed

### `tsconfig.json` — Full Contents

```json
// File: /tsconfig.json
{
  "include": ["client/src/**/*", "shared/**/*", "server/**/*"],
  "exclude": ["node_modules", "build", "dist", "**/*.test.ts"],
  "compilerOptions": {
    "incremental": true,
    "tsBuildInfoFile": "./node_modules/typescript/tsbuildinfo",
    "noEmit": true,
    "module": "ESNext",
    "strict": true,
    "lib": ["esnext", "dom", "dom.iterable"],
    "jsx": "preserve",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "allowImportingTsExtensions": true,
    "moduleResolution": "bundler",
    "baseUrl": ".",
    "types": ["node", "vite/client"],
    "paths": {
      "@/*": ["./client/src/*"],
      "@shared/*": ["./shared/*"]
    }
  }
}
```

### `drizzle.config.ts` — Full Contents

```typescript
// File: /drizzle.config.ts
import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
```

### `.replit` — Build & Deployment Config

```toml
# File: /.replit (relevant sections)
modules = ["nodejs-20", "postgresql-16", "python-3.11", "web"]
run = "npm run dev"

[nix]
channel = "stable-24_05"
packages = ["imagemagick", "poppler_utils"]

[deployment]
deploymentTarget = "autoscale"
build = ["npm", "run", "build"]
run = ["npm", "run", "start"]

[[ports]]
localPort = 5000
externalPort = 80
```

**Migration notes:**
- `postgresql-16` module auto-provisions `DATABASE_URL` — on Vercel, you'll need to provision a Neon database separately and set `DATABASE_URL` manually.
- `imagemagick` and `poppler_utils` are Nix packages used for build scripts only (not runtime). These are not needed on Vercel if you run image optimization locally or in CI.
- Port 5000 mapping is Replit-specific. Vercel handles port assignment automatically.

### `.gitignore` — Full Contents

```
node_modules
dist
.DS_Store
server/public
vite.config.ts.*
*.tar.gz.replit
```

**Migration note:** Add `.env`, `.env.local`, `.replit`, `.local/` to `.gitignore` if not already ignored.

---

## 3. Express Server & Route Inventory

### Server Entry Point

```typescript
// File: /server/index.ts (full contents)
import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import { registerRoutes, registerWebhookRoute } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

app.set('trust proxy', 1);

const allowedOrigins = [
  'https://prolificpersonalities.com',
  'https://www.prolificpersonalities.com',
  ...(process.env.NODE_ENV === 'development' ? [
    'http://localhost:5000',
    'http://localhost:3000',
    /\.replit\.dev$/,
    /\.repl\.co$/
  ] : [])
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') return origin === allowed;
      return allowed.test(origin);
    });
    if (isAllowed) callback(null, true);
    else callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

registerWebhookRoute(app);  // Before JSON middleware (raw body for Stripe)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Request logging middleware (truncated to 80 chars)
app.use((req, res, next) => { /* ... */ });

(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => { /* error handler */ });

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = 5000;
  server.listen({ port, host: "0.0.0.0", reusePort: true }, () => {
    log(`serving on port ${port}`);
  });
})();
```

### Complete Route Table

**Total: 80 routes** (75 in `server/routes.ts` + 5 in `server/replit_integrations/chat/routes.ts`)

| Method | Path | File:Line | Auth | External Services |
|--------|------|-----------|------|-------------------|
| POST | `/api/webhook/stripe` | routes.ts:74 | Stripe sig | Stripe, Supabase, Resend |
| POST | `/api/auth/sync` | routes.ts:416 | supabaseAuth | Storage |
| POST | `/api/quiz/claim/:sessionId` | routes.ts:444 | supabaseAuth | Storage |
| GET | `/api/dashboard/results` | routes.ts:510 | supabaseAuth | Storage |
| POST | `/api/quiz/results` | routes.ts:539 | None (rate limited) | Supabase (token lookup), Storage |
| GET | `/api/quiz/results/:sessionId` | routes.ts:595 | None | Storage |
| GET | `/api/playbook-purchase-count` | routes.ts:612 | None | Storage |
| GET | `/api/user-purchase-status` | routes.ts:623 | Inline Supabase | Storage |
| POST | `/api/app-waitlist` | routes.ts:650 | None | Storage |
| GET | `/api/tools` | routes.ts:670 | None | Storage |
| GET | `/api/tools/archetype/:archetype` | routes.ts:680 | None | Storage |
| POST | `/api/tools/seed` | routes.ts:692 | None | Storage |
| POST | `/api/email-capture` | routes.ts:722 | None | Resend, Storage |
| POST | `/api/waitlist` | routes.ts:787 | None | Storage |
| POST | `/api/feedback` | routes.ts:805 | None | Storage |
| POST | `/api/email-results` | routes.ts:823 | None | Resend, Storage |
| POST | `/api/promo-code/validate` | routes.ts:942 | None | Storage |
| POST | `/api/promo-code/redeem` | routes.ts:1011 | None | Stripe, Resend, Storage |
| GET | `/api/admin/test-state` | routes.ts:1288 | supabaseAuth + email | Storage |
| POST | `/api/admin/reset-state` | routes.ts:1326 | supabaseAuth + email | Storage |
| GET | `/api/admin/promo-codes` | routes.ts:1381 | None | Storage |
| GET | `/api/admin/promo-codes/:id/redemptions` | routes.ts:1392 | None | Storage |
| POST | `/api/create-checkout-session` | routes.ts:1404 | None | Stripe, Storage |
| POST | `/api/verify-payment` | routes.ts:1499 | None | Stripe, Resend, Storage |
| POST | `/api/create-prepurchase-session` | routes.ts:1636 | None | Stripe, Storage |
| POST | `/api/link-prepurchase-order` | routes.ts:1714 | None | Stripe, Storage |
| POST | `/api/create-subscription-session` | routes.ts:1785 | None | Stripe, Storage |
| GET | `/api/orders` | routes.ts:1908 | supabaseAuth | Storage |
| GET | `/api/download/:orderId` | routes.ts:1930 | supabaseAuth | Storage, Filesystem |
| GET | `/api/playbook/:archetype/progress` | routes.ts:2048 | supabaseAuth | Storage |
| POST | `/api/playbook/:archetype/progress/chapter` | routes.ts:2066 | supabaseAuth | Storage |
| GET | `/api/playbook/:archetype/action-plan` | routes.ts:2097 | supabaseAuth | Storage |
| POST | `/api/playbook/:archetype/action-plan/task` | routes.ts:2115 | supabaseAuth | Storage |
| GET | `/api/playbook/:archetype/tools` | routes.ts:2147 | supabaseAuth | Storage |
| POST | `/api/playbook/:archetype/tools/update` | routes.ts:2165 | supabaseAuth | Storage |
| GET | `/api/playbook/:archetype/notes` | routes.ts:2197 | supabaseAuth | Storage |
| POST | `/api/playbook/:archetype/notes` | routes.ts:2220 | supabaseAuth | Storage |
| PUT | `/api/playbook/notes/:noteId` | routes.ts:2253 | supabaseAuth | Storage |
| DELETE | `/api/playbook/notes/:noteId` | routes.ts:2285 | supabaseAuth | Storage |
| GET | `/api/playbook/:archetype/responses` | routes.ts:2302 | supabaseAuth | Storage |
| POST | `/api/playbook/:archetype/responses` | routes.ts:2325 | supabaseAuth | Storage |
| GET | `/api/playbook/:archetype/session-access` | routes.ts:2358 | None | Storage |
| GET | `/api/playbook/:archetype/access` | routes.ts:2381 | supabaseAuth | Storage |
| POST | `/api/playbook/:archetype/resend-email` | routes.ts:2416 | supabaseAuth | Resend, Storage, FS |
| GET | `/api/playbook/:archetype/pdf` | routes.ts:2517 | supabaseAuth | Storage, FS |
| POST | `/api/process-abandoned-carts` | routes.ts:2580 | **None** | Resend, Storage |
| POST | `/api/unsubscribe` | routes.ts:2643 | None | Storage |
| POST | `/api/test-emails` | routes.ts:2679 | None | Resend |
| POST | `/api/cron/abandoned-cart` | routes.ts:2873 | CRON_SECRET | Stripe, Resend, Storage |
| POST | `/api/cron/weekly-accountability` | routes.ts:3014 | CRON_SECRET | Resend, Storage |
| POST | `/api/cron/nurture-sequence` | routes.ts:3106 | CRON_SECRET | Resend, Storage |
| POST | `/api/cron/onboarding-sequence` | routes.ts:3201 | CRON_SECRET | Resend, Storage |
| GET | `/robots.txt` | routes.ts:3290 | None | None |
| GET | `/sitemap.xml` | routes.ts:3317 | None | None |
| POST | `/api/mobile/auth/signin` | routes.ts:3462 | None | Resend, DB |
| GET | `/api/mobile/auth/verify` | routes.ts:3597 | None | DB |
| GET | `/api/mobile/auth/session` | routes.ts:3672 | JWT | DB |
| POST | `/api/mobile/auth/signout` | routes.ts:3737 | JWT | DB |
| GET | `/api/mobile/user/profile` | routes.ts:3767 | JWT | Storage, DB |
| POST | `/api/mobile/quiz/submit` | routes.ts:3907 | JWT | Storage, DB |
| GET | `/api/mobile/quiz/results` | routes.ts:4044 | JWT | DB |
| GET | `/api/mobile/user/premium` | routes.ts:4132 | JWT | DB |
| GET | `/api/ai-coach/usage` | routes.ts:4260 | None | Storage |
| POST | `/api/ai-coach` | routes.ts:4281 | None | OpenAI, Storage |
| POST | `/api/v1/ai-coach` | routes.ts:4409 | None | OpenAI, Storage |
| GET | `/api/chat/conversations` | routes.ts:4507 | None | Storage |
| POST | `/api/chat/conversations` | routes.ts:4529 | None | Storage |
| GET | `/api/chat/conversations/:id/messages` | routes.ts:4554 | None | Storage |
| DELETE | `/api/chat/conversations/:id` | routes.ts:4565 | None | Storage |
| POST | `/api/chat/messages/:id/feedback` | routes.ts:4580 | None | Storage |
| GET | `/api/v1/mobile/health` | routes.ts:4608 | None | None |
| GET | `/api/v1/mobile/user` | routes.ts:4613 | supabaseAuth | Storage |
| POST | `/api/v1/mobile/assessment` | routes.ts:4662 | supabaseAuth | Storage |
| GET | `/api/v1/mobile/assessment` | routes.ts:4719 | supabaseAuth | Storage |
| GET | `/api/v1/mobile/assessment/history` | routes.ts:4768 | supabaseAuth | Storage |
| POST | `/api/mobile/quiz/submit` | routes.ts:4807 | supabaseAuth | Storage |
| GET | `/api/mobile/user/profile` | routes.ts:4831 | supabaseAuth | Storage |

**Replit integrations chat routes** (file: `server/replit_integrations/chat/routes.ts`):

| Method | Path | Line | Auth | External Services |
|--------|------|------|------|-------------------|
| GET | `/api/conversations` | 12 | None | Chat Storage |
| GET | `/api/conversations/:id` | 23 | None | Chat Storage |
| POST | `/api/conversations` | 39 | None | Chat Storage |
| DELETE | `/api/conversations/:id` | 51 | None | Chat Storage |
| POST | `/api/conversations/:id/messages` | 63 | None | OpenAI (gpt-5.1), Chat Storage |

**Duplicate route paths:** `/api/mobile/quiz/submit` and `/api/mobile/user/profile` are each registered twice — once with JWT auth (lines ~3907, 3767) and once with Supabase auth (lines ~4807, 4831). Express uses the first matching route.

### Rate Limiters

Defined in `server/routes.ts`:

| Limiter | Window | Max Requests | Applied To |
|---------|--------|--------------|------------|
| `apiLimiter` | 15 min | 100 | General API endpoints |
| `writeLimiter` | 15 min | 20 | Write operations (POST/PUT/DELETE) |
| `strictLimiter` | 60 min | 5 | Checkout/payment endpoints |
| `aiCoachLimiter` | 15 min | 30 | AI coach endpoint |

---

## 4. Frontend Pages Inventory

All page components are in `/client/src/pages/`. The app uses `wouter` for client-side routing.

### Route Map (from `client/src/App.tsx`)

| Path | Component | API Calls | Auth Required |
|------|-----------|-----------|---------------|
| `/` | `home.tsx` | None | No |
| `/quiz` | `quiz.tsx` → `QuizContainer` | POST `/api/quiz/results`, POST `/api/link-prepurchase-order` | No |
| `/results/:sessionId` | `results.tsx` | GET `/api/quiz/results/:sessionId`, GET `/api/tools/archetype/:id`, GET `/api/playbook/:id/access`, POST `/api/email-capture`, POST `/api/email-results`, POST `/api/create-checkout-session`, POST `/api/promo-code/validate`, POST `/api/promo-code/redeem`, POST `/api/app-waitlist` | No (optional auth for premium features) |
| `/results` | `results.tsx` | Same as above | No |
| `/pricing` | `pricing.tsx` | GET `/api/playbook-purchase-count`, GET `/api/user-purchase-status`, POST `/api/create-prepurchase-session` | No |
| `/playbook/:archetype` | `playbook.tsx` | 10+ endpoints (progress, action-plan, tools, notes, responses, PDF) | Yes (premium) |
| `/dashboard` | `dashboard.tsx` | GET `/api/dashboard/results`, GET `/api/orders` | Yes |
| `/payment-success` | `payment-success.tsx` | None (reads URL params) | No |
| `/payment-cancelled` | `payment-cancelled.tsx` | None | No |
| `/purchase-success` | `purchase-success.tsx` | POST `/api/verify-payment`, GET `/api/playbook/:archetype/resend-email` | Yes |
| `/login` | `login.tsx` | Supabase Auth (OAuth, OTP) | No |
| `/auth/callback` | `auth-callback.tsx` | Supabase `getSession()` | No |
| `/blog` | `blog.tsx` | None (static data) | No |
| `/blog/:slug` | `blog-post.tsx` | None (static data) | No |
| `/about` | `about.tsx` | None | No |
| `/science` | `science.tsx` | None | No |
| `/the-research` | `science.tsx` | None (alias) | No |
| `/archetypes` | `archetypes.tsx` | None | No |
| `/archetypes/:slug` | `archetype-detail.tsx` | None | No |
| `/resources` | `resources.tsx` | GET `/api/dashboard/results` | Optional |
| `/faq` | `faq.tsx` | None | No |
| `/founder` | `founder.tsx` | None | No |
| `/feedback` | `feedback.tsx` | POST `/api/feedback` | No |
| `/refund-policy` | `refund-policy.tsx` | None | No |
| `/unsubscribe` | `unsubscribe.tsx` | POST `/api/unsubscribe` | No |
| `/privacy` | `privacy.tsx` | None | No |
| `/terms` | `terms.tsx` | None | No |
| `/dev` | `dev-tools.tsx` | POST `/api/quiz/results` | Dev only |
| `/admin/test-flows` | `admin-test-flows.tsx` | Auth-gated admin endpoints | Email-restricted |

---

## 5. Replit-Specific Code

### Files Requiring Changes

#### 1. `vite.config.ts` — Remove Replit plugins

```typescript
// REMOVE: line 4
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

// REMOVE from plugins array: line 9
runtimeErrorOverlay(),

// REMOVE: lines 10-17 (cartographer conditional)
...(process.env.NODE_ENV !== "production" &&
process.env.REPL_ID !== undefined
  ? [await import("@replit/vite-plugin-cartographer").then((m) => m.cartographer())]
  : []),
```

#### 2. `server/routes.ts` — Remove `REPLIT_DEV_DOMAIN` references (4 occurrences)

```typescript
// Lines 742-744, 896-898, 2593-2595, 2692-2694 — All follow this pattern:
const baseUrl = process.env.REPLIT_DEV_DOMAIN
  ? `https://${process.env.REPLIT_DEV_DOMAIN}`
  : "https://prolificpersonalities.com";

// REPLACE ALL with:
const baseUrl = process.env.APP_URL || "https://prolificpersonalities.com";
```

#### 3. `server/index.ts` — Remove Replit CORS patterns

```typescript
// Lines 19-20 — Remove regex patterns (already dev-only, but clean up):
/\.replit\.dev$/,
/\.repl\.co$/
```

#### 4. `client/index.html` — Remove Replit dev banner

```html
<!-- Line 41-42 — REMOVE these lines -->
<!-- This is a replit script which adds a banner on the top of the page... -->
<script type="text/javascript" src="https://replit.com/public/js/replit-dev-banner.js"></script>
```

#### 5. `server/replit_integrations/` — Rename/relocate

The `replit_integrations/` directory contains 8 files across 3 modules:
- `chat/` — AI chat routes using OpenAI. **Not Replit-specific** — just uses `AI_INTEGRATIONS_OPENAI_*` env vars.
- `image/` — Image generation using OpenAI. **Not Replit-specific** — same env vars.
- `batch/` — Generic batch processing utilities. **Not Replit-specific at all.**

**Action:** Rename directory from `server/replit_integrations/` to `server/integrations/` and update the import at `server/routes.ts:40`:
```typescript
// Change from:
import { registerChatRoutes } from "./replit_integrations/chat";
// Change to:
import { registerChatRoutes } from "./integrations/chat";
```

#### 6. Scripts to delete (Replit-only)

These scripts use `REPLIT_CONNECTORS_HOSTNAME` and `REPL_IDENTITY` and are only functional on Replit:
- `scripts/push-to-github.ts`
- `scripts/github-init-push.ts`
- `scripts/github-push-api.ts`

#### 7. Files to delete

- `.replit` — Replit config file (not needed on Vercel)
- `replit.md` — Replit agent documentation
- `.local/` — Replit agent state

#### 8. Comments to clean up

Stale "Replit Auth" comments in:
- `server/storage.ts:10` — `// User operations for Replit Auth`
- `server/storage.ts:104` — `// User operations for Replit Auth`
- `shared/schema.ts:6` — `// Session storage table - required for Replit Auth`
- `shared/schema.ts:17` — `// User storage table - updated for Replit Auth`

### Summary Table

| Category | Files Affected | Severity |
|----------|---------------|----------|
| `REPLIT_DEV_DOMAIN` env var | `server/routes.ts` (4 occurrences) | **Must fix** — active code |
| `REPL_ID` env var | `vite.config.ts` (1 occurrence) | **Must fix** — conditional plugin |
| `@replit/` npm packages | `package.json`, `vite.config.ts` | **Must fix** — build dependency |
| Replit dev banner | `client/index.html` (line 42) | **Must fix** — loads external JS |
| `replit.dev` / `repl.co` CORS | `server/index.ts` (dev-only) | **Should fix** — clean up |
| `replit_integrations/` directory | 8 files + 1 import | **Should fix** — rename |
| Replit GitHub scripts | 3 files in `scripts/` | **Should delete** |
| `.replit`, `replit.md`, `.local/` | Root files | **Should delete** |
| Stale comments | 4 files | **Nice to fix** |

---

## 6. Database Usage

### Architecture: Two Separate Database Systems

**Database 1: Replit-Provisioned PostgreSQL (Neon)**
- Connected via `DATABASE_URL` (auto-injected by Replit)
- Driver: `@neondatabase/serverless` v0.10.4
- ORM: Drizzle ORM v0.39.1 with `drizzle-orm/neon-serverless`
- Purpose: **ALL application data** (23 tables)
- Uses WebSocket connections via the `ws` package

**Database 2: Supabase (`cunmkubhojdhbzhoedft.supabase.co`)**
- Connected via `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` (server) and `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` (client)
- Driver: `@supabase/supabase-js` v2.91.0
- Purpose: **Authentication only** (login, JWT tokens, session management)
- No `supabase.from('table_name')` data queries exist in the codebase

### Database Connection

```typescript
// File: /server/db.ts (full contents)
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });
```

**Migration note:** `DATABASE_URL` is NOT defined in any config file — it's auto-injected by Replit's `postgresql-16` module. On Vercel, you need to:
1. Provision a Neon database (or continue using the existing one if you have the connection string)
2. Set `DATABASE_URL` as an environment variable in Vercel

### Schema (23 Tables)

Defined in `shared/schema.ts`:

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `sessions` | Legacy (unused) | `sid`, `sess` (jsonb), `expire` |
| `users` | User accounts | `id` (varchar PK), `email` (unique), `firstName`, `lastName` |
| `quiz_results` | Personality quiz results | `sessionId` (unique), `userId` (FK), `answers` (jsonb), `scores` (jsonb), `archetype` |
| `tools` | Productivity tools catalog | `toolId` (unique), `name`, `archetypeFit` (jsonb), `platforms` (text[]) |
| `email_captures` | Email collection + sequence tracking | `email`, `sessionId`, `archetype`, nurture/onboard day flags |
| `email_log` | Email send logging | `email`, `emailType`, `resendId`, `status` |
| `checkout_attempts` | Stripe checkout tracking | `email`, `sessionId`, `stripeCheckoutSessionId` |
| `unsubscribe_feedback` | Unsubscribe reasons | `email`, `reason`, `rating`, `feedbackText` |
| `waitlist` | Waitlist entries | `email`, `sessionId`, `source` |
| `feedback` | User feedback | `name`, `email`, `message`, `type` |
| `orders` | Purchase orders | `userId` (FK), `sessionId`, `archetype`, `amount`, Stripe IDs, `productType` |
| `playbook_progress` | Chapter completion | `userId` (FK), `archetype`, `chapterId`, `completed` |
| `action_plan_progress` | Daily task tracking | `userId` (FK), `archetype`, `dayNumber`, `taskId`, `completed` |
| `tool_tracking` | Tool adoption status | `userId` (FK), `archetype`, `toolId`, `status` |
| `playbook_notes` | User notes | `userId` (FK), `archetype`, `sectionId`, `content` |
| `playbook_responses` | Interactive form responses | `userId` (FK), `archetype`, `sectionId`, `responses` (jsonb) |
| `promo_codes` | Promo code definitions | `code` (unique), `discountPercent`, `maxUses`, `currentUses` |
| `promo_code_redemptions` | Promo code usage records | `promoCodeId` (FK), `userId` (FK), `email` |
| `magic_link_tokens` | Mobile auth magic links | `email`, `token` (unique), `expiresAt`, `used` |
| `mobile_sessions` | Mobile JWT sessions | `userId` (FK), `token` (unique), `expiresAt` |
| `magic_link_rate_limits` | Magic link rate limiting | `email`, `requestCount`, `windowStart` |
| `chat_conversations` | AI chat conversations | `userId`, `sessionId`, `archetype`, `title` |
| `chat_messages` | Chat message history | `conversationId` (FK, cascade), `role`, `content`, `feedback` |
| `chat_usage` | Daily message rate limiting | `userId`, `sessionId`, `messageCount`, `date` |

### Storage Layer

`server/storage.ts` implements a `DatabaseStorage` class with 60+ methods using Drizzle ORM. All queries use:
- `db.select().from(table)` / `db.insert()` / `db.update()` / `db.delete()`
- `.onConflictDoUpdate()` for upserts
- `memoizee` for caching tool queries (5 min TTL)

---

## 7. Middleware & Auth

### Authentication Architecture

**Web app:** Supabase Auth (client-side OAuth/OTP → server validates Bearer tokens)
**Mobile app:** Custom magic link flow with JWT tokens (signed with `jsonwebtoken`)

### Supabase Auth Middleware

```typescript
// File: /server/supabaseAuth.ts (full contents)
import { createClient } from "@supabase/supabase-js";
import { RequestHandler } from "express";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export const supabaseAdmin = supabase;

const recentlySyncedUsers = new Map<string, number>();
const SYNC_COOLDOWN_MS = 5 * 60 * 1000;

export const supabaseAuth: RequestHandler = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, error: "Missing token" });
  }
  const token = authHeader.replace("Bearer ", "");
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ success: false, error: "Invalid token" });
    }
    (req as any).supabaseUser = user;
    // Background sync to local DB with 5-min cooldown
    const lastSynced = recentlySyncedUsers.get(user.id);
    const now = Date.now();
    if (!lastSynced || now - lastSynced > SYNC_COOLDOWN_MS) {
      const { storage } = await import("./storage");
      await storage.upsertUser({ /* user data */ });
      recentlySyncedUsers.set(user.id, now);
    }
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: "Auth failed" });
  }
};
```

**Migration concern:** The `recentlySyncedUsers` in-memory `Map` is per-process. On Vercel Serverless Functions, each invocation may be a different instance, so this cooldown won't work reliably. Consider using a TTL cache backed by the database or removing the cooldown (it's just an optimization).

### Mobile JWT Auth

```typescript
// File: /server/routes.ts:3427-3458
const JWT_SECRET =
  process.env.SESSION_SECRET || "fallback-jwt-secret-change-in-production";
const MAGIC_LINK_EXPIRY_MINUTES = 60;
const SESSION_EXPIRY_DAYS = 30;

function generateSessionToken(userId: string, email: string): string {
  return jwt.sign({ userId, email }, JWT_SECRET, {
    expiresIn: `${SESSION_EXPIRY_DAYS}d`,
  });
}

function verifySessionToken(token: string): { userId: string; email: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    return decoded;
  } catch {
    return null;
  }
}
```

**SECURITY WARNING:** The hardcoded fallback `"fallback-jwt-secret-change-in-production"` means anyone who reads the source can forge mobile JWTs if `SESSION_SECRET` is not set. Ensure `SESSION_SECRET` is set in Vercel environment variables.

### CORS Configuration

```typescript
// File: /server/index.ts:12-22
const allowedOrigins = [
  'https://prolificpersonalities.com',
  'https://www.prolificpersonalities.com',
  ...(process.env.NODE_ENV === 'development' ? [
    'http://localhost:5000',
    'http://localhost:3000',
    /\.replit\.dev$/,   // REMOVE
    /\.repl\.co$/       // REMOVE
  ] : [])
];
```

**Migration note:** Add your Vercel preview URLs to the development origins (e.g., `/\.vercel\.app$/`).

### Dead Auth Dependencies

These packages are in `package.json` but **never imported in any source file**:
- `express-session` v1.18.1
- `connect-pg-simple` v10.0.0
- `memorystore` v1.6.7
- `passport` v0.7.0
- `passport-local` v1.0.0

**Action:** Remove from `package.json`.

---

## 8. Static Assets & File Handling

### Static File Serving

```typescript
// File: /server/vite.ts
// Development: Vite middleware mode with HMR
export async function setupVite(app: Express, server: Server) {
  const vite = await createViteServer({ /* ... */ });
  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    // Read client/index.html, transform, serve
  });
}

// Production: express.static from dist/public
export function serveStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "public");
  app.use(express.static(distPath));
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
```

**Migration note:** On Vercel, static files from `dist/public/` will be served via Vercel's Edge Network automatically. The `serveStatic` function and SPA fallback will not be needed — Vercel handles this via `vercel.json` rewrites.

### Premium PDF Assets

```typescript
// File: /server/premiumAssets.ts (full contents)
export const PREMIUM_ASSETS: Record<ArchetypeSlug, PremiumAsset> = {
  "adaptive-generalist": { pdfFilename: "Adaptive Generalist Premium_1762886907832.pdf" },
  "anxious-perfectionist": { pdfFilename: "Anxious Perfectionist Premium_1762886907847.pdf" },
  "chaotic-creative": { pdfFilename: "Chaotic Creative Premium_1762886907848.pdf" },
  "flexible-improviser": { pdfFilename: "Flexible Improviser Premium_1762886907848.pdf" },
  "novelty-seeker": { pdfFilename: "Novelty Seeker Premium_1762886907848.pdf" },
  "strategic-planner": { pdfFilename: "Strategic Planner Premium_1762886907849.pdf" },
  "structured-achiever": { pdfFilename: "Structured Achiever Premium_1762886907850.pdf" },
};
```

PDFs are served from `attached_assets/` via two auth-protected routes:
- `GET /api/download/:orderId` — uses `res.download()`
- `GET /api/playbook/:archetype/pdf` — uses `res.download()`

PDF path construction: `path.join(process.cwd(), "attached_assets", pdfAsset.pdfFilename)`

**Migration concern:** On Vercel Serverless Functions, `process.cwd()` and filesystem access works differently. The `attached_assets/` directory must be included in the serverless function bundle, or PDFs should be moved to cloud storage (S3, Vercel Blob, etc.).

PDFs are also sent as email attachments via Resend:
```typescript
// routes.ts:216-220 (inside webhook handler)
const pdfPath = path.join(process.cwd(), "attached_assets", pdfAsset.pdfFilename);
const pdfContent = fs.readFileSync(pdfPath);
// Used as Resend attachment
```

### Image Processing

- `sharp` v0.34.5 — Used in build-time scripts only (`scripts/optimize-images.js`, `scripts/generate-favicons.js`). Not used at runtime.
- `html2canvas` v1.4.1 — Client-side library for DOM screenshots.
- Nix packages `imagemagick` and `poppler_utils` are referenced in `.replit` but not in application code.

### No CDN or Cloud Storage

All images and static assets are served directly through Express/Vite. No CloudFront, S3, Cloudinary, or ImageKit usage.

---

## 9. Cron Jobs & Background Tasks

### Architecture

There are **no in-process scheduled tasks** (no `node-cron`, no server-side `setInterval` schedulers). All cron jobs are triggered by **external HTTP calls** to 4 endpoints, intended to be called by an external cron service (e.g., cron-job.org).

### Cron Endpoints

| Endpoint | Frequency | Purpose | Auth |
|----------|-----------|---------|------|
| `POST /api/cron/abandoned-cart` | Daily | Recovery emails for incomplete checkouts (>1 hour old) | `CRON_SECRET` |
| `POST /api/cron/weekly-accountability` | Weekly (Mon 9 AM) | Accountability emails to Partner subscribers | `CRON_SECRET` |
| `POST /api/cron/nurture-sequence` | Daily | Drip emails to non-buyers (days 3, 5, 7, 10, 14) | `CRON_SECRET` |
| `POST /api/cron/onboarding-sequence` | Daily | Drip emails to buyers (days 3, 7, 30) | `CRON_SECRET` |

All four endpoints check for the secret in `x-cron-secret` header or `Authorization: Bearer <secret>`.

**SECURITY NOTE:** If `CRON_SECRET` is not set, the authentication check is **bypassed** (the `if (cronSecret && ...)` guard allows all requests through when undefined).

### Legacy Endpoint

`POST /api/process-abandoned-carts` (routes.ts:2580) — Older abandoned cart processor with **NO authentication**. Should be removed or secured.

### Vercel Cron Migration

On Vercel, these can be migrated to [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs) defined in `vercel.json`:

```json
{
  "crons": [
    { "path": "/api/cron/abandoned-cart", "schedule": "0 9 * * *" },
    { "path": "/api/cron/nurture-sequence", "schedule": "0 10 * * *" },
    { "path": "/api/cron/onboarding-sequence", "schedule": "0 11 * * *" },
    { "path": "/api/cron/weekly-accountability", "schedule": "0 9 * * 1" }
  ]
}
```

---

## 10. Stripe & Payment Flow

### Initialization

```typescript
// File: /server/routes.ts:55-61
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing required Stripe secret: STRIPE_SECRET_KEY");
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-10-29.clover",
});
```

### Stripe Routes

| Route | Purpose | Price |
|-------|---------|-------|
| `POST /api/create-checkout-session` | One-time playbook purchase | $19 |
| `POST /api/create-prepurchase-session` | Pay-first-then-quiz | $19 (early bird) / $29 |
| `POST /api/create-subscription-session` | Partner subscription | $7/mo or $75/yr |
| `POST /api/verify-payment` | Fallback payment verification | — |
| `POST /api/link-prepurchase-order` | Link prepurchase to quiz | — |
| `POST /api/promo-code/redeem` | Apply promo code | Variable |

### Webhook Handler

```typescript
// File: /server/routes.ts:73-380
// Registered via registerWebhookRoute() BEFORE express.json() (needs raw body)
export function registerWebhookRoute(app: Express) {
  app.post("/api/webhook/stripe",
    express.raw({ type: "application/json" }),
    async (req, res) => { /* ... */ }
  );
}
```

Handles 4 event types:
- `checkout.session.completed` — Completes order, sends PDF email, mirrors to Supabase
- `customer.subscription.deleted` — Marks order as "cancelled"
- `invoice.paid` — Restores "failed" orders to "completed"
- `invoice.payment_failed` — Marks order as "failed", sends notification

**Migration note:** The webhook must receive the raw request body for signature verification. On Vercel, you'll need to configure the API route to not parse the body:

```typescript
// vercel.json or route config
export const config = { api: { bodyParser: false } };
```

### Webhook Signature Verification

```typescript
// routes.ts:88-100
if (process.env.STRIPE_WEBHOOK_SECRET) {
  event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
} else {
  console.warn("⚠️ STRIPE_WEBHOOK_SECRET not set");
  event = JSON.parse(body);
}
```

**SECURITY WARNING:** If `STRIPE_WEBHOOK_SECRET` is not set, the webhook parses the body without verification. Ensure this is always set in production.

---

## 11. Resend Email Integration

### Initialization

```typescript
// File: /server/routes.ts:63-70
if (!process.env.RESEND_API_KEY) {
  console.warn("⚠️ RESEND_API_KEY not set - email sending will be disabled");
}
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;
```

### Email Templates

All templates in `server/emailTemplates.ts` (~1865 lines). Base URL:
```typescript
const BASE_URL = process.env.APP_URL || 'https://prolificpersonalities.com';
```

### Complete Email Inventory

| # | Type | Template Function | Trigger | Attachment |
|---|------|-------------------|---------|------------|
| 1 | Quiz Results | `generateResultsEmail()` | POST `/api/email-results` | No |
| 2 | Welcome | `generateWelcomeEmail()` | POST `/api/email-capture` or `/api/email-results` | No |
| 3 | Premium Playbook PDF | `generatePremiumPlaybookEmail()` | Stripe webhook / verify-payment / promo redemption | **Yes** (PDF) |
| 4 | Payment Failure | Inline HTML | Stripe `invoice.payment_failed` | No |
| 5 | Playbook Resend | `generatePremiumPlaybookEmail()` | POST `/api/playbook/:archetype/resend` | **Yes** (PDF) |
| 6 | Magic Link Sign-In | Inline HTML | POST `/api/mobile/auth/signin` | No |
| 7 | Day 3 Nurture | `generateDay3NurtureEmail()` | Cron (non-buyers, day 3) | No |
| 8 | Day 5 Nurture | `generateDay5NurtureEmail()` | Cron (non-buyers, day 5) | No |
| 9 | Day 7 Nurture | `generateDay7NurtureEmail()` | Cron (non-buyers, day 7) | No |
| 10 | Day 10 Nurture | `generateDay10NurtureEmail()` | Cron (non-buyers, day 10) | No |
| 11 | Day 14 Nurture | `generateDay14NurtureEmail()` | Cron (non-buyers, day 14) | No |
| 12 | Abandoned Cart | `generateAbandonedCartEmail()` | Cron (incomplete checkouts) | No |
| 13 | Abandoned Cart v2 | `generateAbandonedCartEmailV2()` | Test endpoint only | No |
| 14 | Day 3 Onboarding | `generateDay3OnboardEmail()` | Cron (buyers, day 3) | No |
| 15 | Day 7 Onboarding | `generateDay7OnboardEmail()` | Cron (buyers, day 7) | No |
| 16 | Day 30 Onboarding | `generateDay30OnboardEmail()` | Cron (buyers, day 30) | No |
| 17 | Weekly Accountability | `generateWeeklyAccountabilityEmail()` | Cron (Partner subscribers, weekly) | No |

**From addresses:**
- Transactional: `"Prolific Personalities <support@prolificpersonalities.com>"`
- Nurture/Onboarding crons: `"John from Prolific Personalities <support@prolificpersonalities.com>"`

### PDF Email Attachments

```typescript
// routes.ts (inside webhook handler and verify-payment)
const pdfPath = path.join(process.cwd(), "attached_assets", pdfAsset.pdfFilename);
const pdfContent = fs.readFileSync(pdfPath);
// Sent via Resend as attachment
```

**Migration concern:** Same as Section 8 — `attached_assets/` must be accessible from Vercel Serverless Functions.

---

## 12. Environment Variable Usage Map

### Server-Side (Required)

| Variable | Used In | Purpose | Hard Fail? |
|----------|---------|---------|------------|
| `DATABASE_URL` | `server/db.ts:8`, `drizzle.config.ts:3` | PostgreSQL connection string (Neon) | **Yes** — throws on startup |
| `STRIPE_SECRET_KEY` | `server/routes.ts:55` | Stripe API key | **Yes** — throws on startup |
| `SUPABASE_URL` | `server/supabaseAuth.ts:5`, `server/routes.ts:554` | Supabase project URL | **Yes** — undefined behavior |
| `SUPABASE_SERVICE_ROLE_KEY` | `server/supabaseAuth.ts:6`, `server/routes.ts:555` | Supabase admin key | **Yes** — undefined behavior |
| `RESEND_API_KEY` | `server/routes.ts:64` | Resend email service | No — warns, disables email |
| `STRIPE_WEBHOOK_SECRET` | `server/routes.ts:88` | Stripe webhook verification | No — warns, skips verification |
| `CRON_SECRET` | `server/routes.ts:2875,3016,3107,3202` | Cron endpoint auth | No — skips auth if unset |
| `SESSION_SECRET` | `server/routes.ts:3428` | JWT signing for mobile auth | No — **dangerous fallback** |
| `APP_URL` | `server/routes.ts` (7 locations), `server/emailTemplates.ts:1238` | Base URL for emails/redirects | No — defaults to `prolificpersonalities.com` |
| `AI_INTEGRATIONS_OPENAI_API_KEY` | `server/routes.ts:4227`, `server/replit_integrations/chat/routes.ts:6`, `server/replit_integrations/image/client.ts:6` | OpenAI API key (via Replit proxy) | No — AI features disabled |
| `AI_INTEGRATIONS_OPENAI_BASE_URL` | Same files as above | OpenAI API base URL | No — defaults to OpenAI |

### Client-Side (VITE_ prefix)

| Variable | Used In | Purpose |
|----------|---------|---------|
| `VITE_SUPABASE_URL` | `client/src/lib/supabase.ts:3` | Supabase client URL |
| `VITE_SUPABASE_ANON_KEY` | `client/src/lib/supabase.ts:4` | Supabase anon key |
| `VITE_POSTHOG_KEY` | `client/src/lib/posthog.ts:3`, `client/src/App.tsx:108` | PostHog analytics key |
| `VITE_POSTHOG_HOST` | `client/src/lib/posthog.ts:4` | PostHog API host |
| `VITE_GA_MEASUREMENT_ID` | `client/src/lib/analytics.ts:12`, `client/src/App.tsx:102` | Google Analytics ID |

### Replit-Specific (Remove)

| Variable | Used In | Action |
|----------|---------|--------|
| `REPLIT_DEV_DOMAIN` | `server/routes.ts` (4 locations) | Replace with `APP_URL` |
| `REPL_ID` | `vite.config.ts:11` | Remove conditional |
| `REPLIT_CONNECTORS_HOSTNAME` | `scripts/*.ts` | Delete scripts |
| `REPL_IDENTITY` | `scripts/*.ts` | Delete scripts |

### Defined But Unused

These are defined in `.replit` but never referenced in source code:
- `VITE_SITE_URL`
- `VITE_APP_URL`
- `SITE_URL`
- `VITE_API_URL`
- `API_BASE_URL`
- `VITE_STRIPE_PUBLIC_KEY`
- `VITE_GOOGLE_SITE_VERIFICATION`
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`

---

## 13. Dependencies Audit

### Dependencies to Remove (Dead/Unused)

| Package | Version | Reason |
|---------|---------|--------|
| `express-session` | ^1.18.1 | Never imported — app uses token-based auth |
| `connect-pg-simple` | ^10.0.0 | Session store for express-session — unused |
| `memorystore` | ^1.6.7 | Session store for express-session — unused |
| `passport` | ^0.7.0 | Never imported — leftover from old auth |
| `passport-local` | ^1.0.0 | Passport strategy — unused |
| `@types/express-session` | ^1.18.0 | Types for unused package |
| `@types/connect-pg-simple` | ^7.0.3 | Types for unused package |
| `@types/passport` | ^1.0.16 | Types for unused package |
| `@types/passport-local` | ^1.0.38 | Types for unused package |

### Dev Dependencies to Remove (Replit-specific)

| Package | Version | Reason |
|---------|---------|--------|
| `@replit/vite-plugin-cartographer` | ^0.2.7 | Replit-specific Vite plugin |
| `@replit/vite-plugin-runtime-error-modal` | ^0.0.3 | Replit-specific Vite plugin |

### Dependencies Requiring Migration Attention

| Package | Version | Concern |
|---------|---------|---------|
| `@neondatabase/serverless` | ^0.10.4 | Works on Vercel natively (Neon is a Vercel partner). The `ws` WebSocket polyfill may not be needed on Vercel's edge runtime but works in Node.js serverless functions. |
| `sharp` | ^0.34.5 | Native binary — only used in build scripts, not at runtime. If you add runtime image processing later, Vercel supports sharp natively. |
| `ws` | ^8.18.0 | Used by Neon driver for WebSocket connections. Works in Node.js serverless functions. |
| `openai` | ^6.15.0 | Currently accessed via `AI_INTEGRATIONS_OPENAI_BASE_URL` (Replit proxy). On Vercel, switch to direct OpenAI API (`OPENAI_API_KEY` + default base URL). |

### SSE (Server-Sent Events) Endpoints

The AI coach at `POST /api/ai-coach` uses SSE streaming:
```typescript
res.setHeader("Content-Type", "text/event-stream");
res.setHeader("Cache-Control", "no-cache");
res.setHeader("Connection", "keep-alive");
```

**Migration note:** Vercel Serverless Functions support streaming responses. However, there is a 30-second execution time limit on Hobby plans (300s on Pro). Long AI coach conversations may need to be adapted.

### Full Production Dependencies

```
@anthropic-ai/sdk, @hookform/resolvers, @jridgewell/trace-mapping,
@neondatabase/serverless, @octokit/rest, @radix-ui/* (15 packages),
@stripe/react-stripe-js, @stripe/stripe-js, @supabase/supabase-js,
@tanstack/react-query, @types/cors, @types/jsonwebtoken, @types/memoizee,
class-variance-authority, clsx, cmdk, cors, date-fns, drizzle-orm,
drizzle-zod, embla-carousel-react, express, express-rate-limit,
framer-motion, html2canvas, input-otp, jsonwebtoken, lucide-react,
memoizee, next-themes, openai, openid-client, p-limit, p-retry,
posthog-js, react, react-day-picker, react-dom, react-hook-form,
react-icons, react-markdown, react-resizable-panels, recharts,
remark-gfm, resend, sharp, stripe, tailwind-merge,
tailwindcss-animate, tw-animate-css, vaul, wouter, ws, zod,
zod-validation-error
```

---

## Security Findings Summary

| Finding | Severity | Location | Action |
|---------|----------|----------|--------|
| Live Stripe keys in `.replit` | **CRITICAL** | `.replit:54-60` | Rotate all keys immediately; `.replit` was committed to git history |
| Supabase service role key in `.replit` | **CRITICAL** | `.replit:59,68` | Rotate key; should only be in env vars |
| Hardcoded JWT fallback secret | **HIGH** | `server/routes.ts:3428` | Set `SESSION_SECRET` in production env |
| Webhook sig verification optional | **HIGH** | `server/routes.ts:88-100` | Ensure `STRIPE_WEBHOOK_SECRET` is always set |
| Unauthenticated cron endpoint | **MEDIUM** | `server/routes.ts:2580` | Add auth to `/api/process-abandoned-carts` or remove |
| CRON_SECRET bypass when unset | **MEDIUM** | `server/routes.ts:2875+` | Make CRON_SECRET required (fail if unset) |
| No security headers | **LOW** | `server/vite.ts` | Add `helmet` or Vercel security headers |
| In-memory auth cooldown | **LOW** | `server/supabaseAuth.ts:11` | Won't persist across serverless invocations |
