# Migration Packages

This folder prepares the split from the local hybrid prototype into the two correct product repos:

- `samuelhogarola-ship-it/superentrenador`
- `samuelhogarola-ship-it/coach-studio.superentrenador`

## Package Intent

### `marketplace-bundle`

Use this for direct migration work into:

- `superentrenador/apps/marketplace`

This bundle is relatively close to a direct port because the target repo already contains the same marketplace-origin codebase and route model.

### `coach-bundle`

Use this for guided integration into:

- `coach-studio.superentrenador`

This bundle is **reference-first**, not copy-paste-first.
The target repo has a different architecture:

- auth-driven routing
- Supabase services
- feature folders
- domain types centered on the PT product

So the coach migration should port concepts and UI flows, not overwrite the existing app shell blindly.

## Reference Clones Used

Prepared against:

- `/private/tmp/superentrenador-marketplace`
- `/private/tmp/coach-studio-superentrenador`

## Status

The local hybrid repo has already been split internally into:

- `src/marketplace`
- `src/coach`
- `src/admin`

and no longer shares a single runtime state or central demo seed across products.
