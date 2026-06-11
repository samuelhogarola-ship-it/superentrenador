# Marketplace Migration Bundle

Target repo:

- `samuelhogarola-ship-it/superentrenador`
- target app path: `apps/marketplace`

## Migration Goal

Bring the cleaned public marketplace surfaces from this local repo into the monorepo marketplace app while removing product-mixed ownership from the target app.

## Direct Copy Candidates

These files are safe candidates for near-direct replacement or careful merge into `apps/marketplace`:

- `reference/src/marketplace/pages/LandingPage.tsx`
- `reference/src/marketplace/pages/TrainerProfilePage.tsx`
- `reference/src/marketplace/hooks/useMarketplaceState.ts`
- `reference/src/components/BrandMark.tsx`
- `reference/src/components/Avatar.tsx`
- `reference/src/components/SectionTitle.tsx`
- `reference/src/data/marketplaceSeed.ts`
- `reference/public/favicon.svg`

## Target Mapping

- `reference/src/marketplace/pages/LandingPage.tsx` -> `apps/marketplace/src/pages/LandingPage.tsx`
- `reference/src/marketplace/pages/TrainerProfilePage.tsx` -> `apps/marketplace/src/pages/TrainerProfilePage.tsx`
- `reference/src/components/BrandMark.tsx` -> `apps/marketplace/src/components/BrandMark.tsx`
- `reference/src/components/Avatar.tsx` -> `apps/marketplace/src/components/Avatar.tsx`
- `reference/src/components/SectionTitle.tsx` -> `apps/marketplace/src/components/SectionTitle.tsx`
- `reference/public/favicon.svg` -> `apps/marketplace/public/favicon.svg`

## Manual Work Required

Do not directly copy these files without adapting the app shell:

- `reference/src/routes/MarketplaceRoutes.tsx`
- `reference/src/marketplace/hooks/useMarketplaceState.ts`
- `reference/src/data/marketplaceSeed.ts`

Why:

- the target app still uses the older hybrid `App.tsx`
- the target app still has `context/AppStateContext.tsx`
- the target app still contains `/app/pt`, `/app/client`, and `/app/admin` demo routes

## Recommended Changes In Target Repo

1. Replace `apps/marketplace/src/App.tsx` with a marketplace-only router.
2. Keep only:
   - `/`
   - `/trainers/:slug`
3. Remove marketplace ownership of:
   - `PtDashboardPage.tsx`
   - `ClientAppPage.tsx`
   - `AdminPage.tsx`
   - `context/AppStateContext.tsx`
   - hybrid `seed.ts`
4. Introduce a thin marketplace-only data source modeled on `reference/src/data/marketplaceSeed.ts`.
5. Preserve CI, favicon, and Playwright improvements already landed in the monorepo.

## Validation After Migration

Inside monorepo root:

```bash
npm install
npm run build:marketplace
```
