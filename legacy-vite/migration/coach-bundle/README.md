# Coach Studio Migration Bundle

Target repo:

- `samuelhogarola-ship-it/coach-studio.superentrenador`

## Migration Goal

Port the useful coach-side ideas from the local prototype into the real PT product without overwriting the current auth, Supabase, and feature-folder architecture.

## Important Constraint

This is **not** a direct replacement bundle.

The target repo already has:

- auth flow
- onboarding
- client CRUD
- templates
- print plan flow
- Supabase runtime

So this migration should be treated as:

- feature inspiration
- UI reference
- domain gap checklist
- optional selective port

## Best Source Files In This Bundle

- `reference/src/coach/pages/PtDashboardPage.tsx`
- `reference/src/coach/pages/ClientAppPage.tsx`
- `reference/src/coach/context/CoachStateContext.tsx`
- `reference/src/data/coachSeed.ts`
- `reference/src/types/coach.ts`
- `reference/src/types/shared.ts`
- `reference/src/utils/pdf.ts`
- `reference/src/utils/format.ts`
- `reference/src/components/ClientBadge.tsx`
- `reference/src/components/MetricCard.tsx`

## What To Port Conceptually

### From PT dashboard

Good candidates to port into the real coach product:

- richer dashboard summary blocks
- nutrition assignment UX
- export history UX
- connected vs external client labeling
- lightweight billing/status presentation

### From client app

Good candidates to port as future product scope:

- connected-client workout execution flow
- set completion tracking
- progress timeline view
- connection acceptance experience

### From PDF utility

Good candidate to compare with current print/export approach:

- `reference/src/utils/pdf.ts`

This may help if the target repo later expands beyond browser print to structured generated exports.

## Mapping To Existing Target Architecture

Likely destination zones in `coach-studio.superentrenador`:

- dashboard ideas -> `src/components/AppShell.tsx` plus new coach dashboard feature
- client status and assignment UX -> `src/features/clients/*`
- routine and nutrition patterns -> `src/features/plans/*`
- connected client execution -> likely future new feature area, not current overwrite
- coach-facing domain ideas -> `src/types/domain.ts` and service layer contracts

## Do Not Overwrite Directly

Avoid direct replacement of:

- `src/app/App.tsx`
- `src/features/auth/*`
- `src/services/*`
- `src/lib/supabase.ts`

Reason:

The target app already has real product plumbing that this local demo does not.

## Recommended Migration Sequence

1. Port UI ideas for dashboard cards and labels.
2. Port nutrition/template concepts only where they fill actual product gaps.
3. Decide whether connected-client workout tracking belongs in this repo or a future client app.
4. Keep Supabase services and auth architecture as the source of truth.

## Validation After Migration

Inside target repo:

```bash
npm install
npm run build
npm run test:e2e
```
