# Repo Split Map

## Executive Summary

This local project is **not** a pure marketplace and **not** a pure coach studio.
It is a hybrid demo that mixes:

- public marketplace surfaces
- coach operating surfaces
- client app surfaces
- platform admin surfaces
- shared demo state for all of the above

Because of that, it should **not** be pushed as-is into either product repo without splitting.

## Findings

### P1. Router mixes four different products in one app shell

The root router combines:

- `/` public landing
- `/trainers/:slug` public trainer profile
- `/app/pt` trainer backoffice
- `/app/client` client app
- `/app/admin` platform admin

Reference: [src/App.tsx](/Users/sam/Desktop/webs/super entrenador/src/App.tsx:1)

Why it matters:

- `marketplace` should not own trainer operations, client execution, and admin moderation
- `coach-studio` should not own the public directory and growth landing
- platform admin should not be bundled into either public or coach day-to-day UX

### P1. Shared domain state blends sales, operations, nutrition, exports, and moderation

The main state container stores at once:

- trainer profile and subscription
- PT clients and connections
- routines and nutrition templates
- progress and workout logs
- exports
- leads
- verification requests

Reference: [src/types.ts](/Users/sam/Desktop/webs/super entrenador/src/types.ts:1), [src/context/AppStateContext.tsx](/Users/sam/Desktop/webs/super entrenador/src/context/AppStateContext.tsx:1)

Why it matters:

- `leads` and `verificationRequests` are marketplace/platform concerns
- `clients`, `routines`, `nutritionTemplates`, `progressEntries`, and `workoutLogs` are coach-studio concerns
- keeping them in one state layer makes repo ownership fuzzy and future extraction expensive

### P1. PT dashboard is clearly coach-studio, not marketplace

The PT dashboard includes:

- clients
- routines
- nutrition
- progress
- exports
- billing
- public profile controls

Reference: [src/pages/PtDashboardPage.tsx](/Users/sam/Desktop/webs/super entrenador/src/pages/PtDashboardPage.tsx:1)

Why it matters:

- this is the operating core of the coach product
- it should live in `coach-studio.superentrenador`
- only very thin demo hooks from this surface belong in a marketplace, if any

### P2. Client app belongs to the connected training experience, not the marketplace core

The client page contains:

- connection acceptance
- workout execution
- progress visibility
- coach relationship state

Reference: [src/pages/ClientAppPage.tsx](/Users/sam/Desktop/webs/super entrenador/src/pages/ClientAppPage.tsx:1)

Why it matters:

- this is product usage, not acquisition
- it fits better as part of coach-studio's connected client flow or as a future separate client app

### P2. Admin page is platform operations, not marketplace or coach studio core

The admin surface handles:

- moderation
- verification approval
- support/leads overview
- subscription monitoring

Reference: [src/pages/AdminPage.tsx](/Users/sam/Desktop/webs/super entrenador/src/pages/AdminPage.tsx:1)

Why it matters:

- this should be an internal ops surface
- it should not stay bundled into either main product repo unless there is a deliberate internal-tools strategy

## Product Ownership

### Marketplace

Purpose:

- attract trainers
- explain the product
- surface pricing and verification
- expose public trainer discovery and profiles
- convert leads

Belongs here from this local project:

- [src/pages/LandingPage.tsx](/Users/sam/Desktop/webs/super entrenador/src/pages/LandingPage.tsx:1)
- [src/pages/TrainerProfilePage.tsx](/Users/sam/Desktop/webs/super entrenador/src/pages/TrainerProfilePage.tsx:1)
- [src/components/BrandMark.tsx](/Users/sam/Desktop/webs/super entrenador/src/components/BrandMark.tsx:1)
- [src/components/SectionTitle.tsx](/Users/sam/Desktop/webs/super entrenador/src/components/SectionTitle.tsx:1)
- [src/components/Avatar.tsx](/Users/sam/Desktop/webs/super entrenador/src/components/Avatar.tsx:1)
- visual parts of [src/styles.css](/Users/sam/Desktop/webs/super entrenador/src/styles.css:1) that style public pages
- favicon/public shell assets: [public/favicon.svg](/Users/sam/Desktop/webs/super entrenador/public/favicon.svg:1), [index.html](/Users/sam/Desktop/webs/super entrenador/index.html:1)

Belongs here only after trimming:

- `TrainerProfile` fields in [src/types.ts](/Users/sam/Desktop/webs/super entrenador/src/types.ts:1)
- marketplace-facing parts of seed data from [src/data/seed.ts](/Users/sam/Desktop/webs/super entrenador/src/data/seed.ts:1)

Should not stay in marketplace:

- PT clients
- routines
- nutrition templates
- progress tracking
- exports
- client workout execution
- internal admin moderation

### Coach Studio

Purpose:

- let trainers run client operations
- manage plans, routines, nutrition, tracking, exports, and account state

Belongs here from this local project:

- [src/pages/PtDashboardPage.tsx](/Users/sam/Desktop/webs/super entrenador/src/pages/PtDashboardPage.tsx:1)
- domain-heavy helpers in [src/context/AppStateContext.tsx](/Users/sam/Desktop/webs/super entrenador/src/context/AppStateContext.tsx:1)
- coach operational types in [src/types.ts](/Users/sam/Desktop/webs/super entrenador/src/types.ts:1):
  - `PTClient`
  - `ClientConnection`
  - `RoutineTemplate`
  - `NutritionTemplate`
  - `ProgressEntry`
  - `WorkoutLog`
  - `PDFExport`
  - `TrainerSubscription`
- coach operational seed data in [src/data/seed.ts](/Users/sam/Desktop/webs/super entrenador/src/data/seed.ts:1)
- PDF generation in [src/utils/pdf.ts](/Users/sam/Desktop/webs/super entrenador/src/utils/pdf.ts:1)
- coach utility formatting in [src/utils/format.ts](/Users/sam/Desktop/webs/super entrenador/src/utils/format.ts:1)
- coach UI blocks:
  - [src/components/ClientBadge.tsx](/Users/sam/Desktop/webs/super entrenador/src/components/ClientBadge.tsx:1)
  - [src/components/MetricCard.tsx](/Users/sam/Desktop/webs/super entrenador/src/components/MetricCard.tsx:1)

Belongs here but should likely be split into internal modules:

- billing controls inside PT dashboard
- public profile editing controls inside PT dashboard

### Connected Client App

Purpose:

- let the end client accept connection
- see routine
- complete workout
- see progress

Belongs here from this local project:

- [src/pages/ClientAppPage.tsx](/Users/sam/Desktop/webs/super entrenador/src/pages/ClientAppPage.tsx:1)

Recommended ownership:

- short term: keep under coach-studio if it is the same deployed product family
- long term: extract if the client experience becomes a separate app

### Internal Admin / Platform Ops

Purpose:

- review verification
- manage leads and support
- monitor subscriptions and abuse risk

Belongs here from this local project:

- [src/pages/AdminPage.tsx](/Users/sam/Desktop/webs/super entrenador/src/pages/AdminPage.tsx:1)
- `Lead` and `VerificationRequest` in [src/types.ts](/Users/sam/Desktop/webs/super entrenador/src/types.ts:1)
- related seed data in [src/data/seed.ts](/Users/sam/Desktop/webs/super entrenador/src/data/seed.ts:1)

Recommended ownership:

- do not keep this in either product repo unless there is a deliberate internal-tools plan

## Concrete File Split

### Move to Marketplace

- [src/pages/LandingPage.tsx](/Users/sam/Desktop/webs/super entrenador/src/pages/LandingPage.tsx:1)
- [src/pages/TrainerProfilePage.tsx](/Users/sam/Desktop/webs/super entrenador/src/pages/TrainerProfilePage.tsx:1)
- [src/components/BrandMark.tsx](/Users/sam/Desktop/webs/super entrenador/src/components/BrandMark.tsx:1)
- [src/components/SectionTitle.tsx](/Users/sam/Desktop/webs/super entrenador/src/components/SectionTitle.tsx:1)
- public-compatible portions of [src/components/Avatar.tsx](/Users/sam/Desktop/webs/super entrenador/src/components/Avatar.tsx:1)
- public-only CSS slices from [src/styles.css](/Users/sam/Desktop/webs/super entrenador/src/styles.css:1)
- [public/favicon.svg](/Users/sam/Desktop/webs/super entrenador/public/favicon.svg:1)
- public metadata in [index.html](/Users/sam/Desktop/webs/super entrenador/index.html:1)

### Move to Coach Studio

- [src/pages/PtDashboardPage.tsx](/Users/sam/Desktop/webs/super entrenador/src/pages/PtDashboardPage.tsx:1)
- [src/pages/ClientAppPage.tsx](/Users/sam/Desktop/webs/super entrenador/src/pages/ClientAppPage.tsx:1)
- [src/context/AppStateContext.tsx](/Users/sam/Desktop/webs/super entrenador/src/context/AppStateContext.tsx:1)
- coach entities from [src/types.ts](/Users/sam/Desktop/webs/super entrenador/src/types.ts:1)
- coach demo records from [src/data/seed.ts](/Users/sam/Desktop/webs/super entrenador/src/data/seed.ts:1)
- [src/utils/pdf.ts](/Users/sam/Desktop/webs/super entrenador/src/utils/pdf.ts:1)
- [src/utils/format.ts](/Users/sam/Desktop/webs/super entrenador/src/utils/format.ts:1)
- [src/components/ClientBadge.tsx](/Users/sam/Desktop/webs/super entrenador/src/components/ClientBadge.tsx:1)
- operational use of [src/components/MetricCard.tsx](/Users/sam/Desktop/webs/super entrenador/src/components/MetricCard.tsx:1)

### Remove from Both Main Product Repos or Isolate

- [src/pages/AdminPage.tsx](/Users/sam/Desktop/webs/super entrenador/src/pages/AdminPage.tsx:1)
- admin-only state and seed data

### Replace with Separate Per-Repo Routers

- [src/App.tsx](/Users/sam/Desktop/webs/super entrenador/src/App.tsx:1)

Recommended result:

- marketplace router only serves public routes
- coach-studio router only serves trainer and connected-client routes
- admin router is isolated

## Shared Concepts That Need Duplication or a Shared Package

These concepts exist across products but should not force product coupling:

- trainer public identity
- verification badge display
- brand components
- date/number formatting helpers

Do not share by importing whole product files.
Share only through:

- small copied UI if simpler
- or a thin shared package later

## Recommended Extraction Order

1. Split routing first.
2. Move PT dashboard and client app into coach-studio ownership.
3. Keep landing and trainer profile in marketplace.
4. Remove admin from both product routers.
5. Split state/types into marketplace-facing and coach-facing modules.
6. Only then decide whether any shared package is worth it.

## Recommended Decision

If the goal is to align repos cleanly:

- `samuelhogarola-ship-it/superentrenador` should own the marketplace surfaces
- `samuelhogarola-ship-it/coach-studio.superentrenador` should own trainer operations and connected client experience
- admin should remain separate or internal-only

This local repo should be treated as a **transitional hybrid prototype**, not as the final source of truth for either product.
