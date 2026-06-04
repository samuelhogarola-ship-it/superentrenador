# Migration Notes

## Origenes importados

### Coach Studio

- Repo/logica origen:
  - `https://github.com/samuelhogarola-ship-it/coach-studio.superentrenador`
- Fuente local usada para la migracion:
  - `/Users/sam/.codex/worktrees/9d3c/pt-fuengirola/apps/superentrenador`
- Destino:
  - `apps/coach-studio`

### Marketplace

- Fuente local usada para la migracion:
  - `/Users/sam/Desktop/webs/super entrenador`
- Destino:
  - `apps/marketplace`

## Qué se movió

- Coach Studio:
  - `src/`
  - `public/`
  - `supabase/`
  - `tests/`
  - `index.html`
  - `package.json`
  - `package-lock.json`
  - `playwright.config.ts`
  - `tsconfig*.json`
  - `vite.config.ts`
  - `.env.example`
- Marketplace:
  - `src/`
  - `index.html`
  - `package.json`
  - `package-lock.json`
  - `tsconfig*.json`
  - `vite.config.ts`

## Qué se excluyó

- nested `.git/`
- `node_modules/`
- `dist/`
- `test-results/`
- `.DS_Store`
- `*.tsbuildinfo`
- generated `vite.config.js`
- generated `vite.config.d.ts`

## Qué se renombró

- package name de Coach Studio:
  - `superentrenador-mvp-online` → `@superentrenador/coach-studio`
- package name de Marketplace:
  - `super-entrenador` → `@superentrenador/marketplace`
- docs heredadas de Coach Studio:
  - `AGENTS.md`, `NEXT.md`, `ROADMAP.md` se movieron a `docs/archive/coach-studio/`

## Áreas provisionales

Las rutas de `apps/marketplace`:

- `/app/pt`
- `/app/client`
- `/app/admin`

se mantienen como legacy/demo routes para no romper la migracion inicial.

Estas rutas deben moverse o reescribirse dentro de `apps/coach-studio` en una PR posterior.

## Pendiente tras esta migracion

- redefinir o mover rutas demo heredadas de marketplace
- unificar acceso/auth real entre productos
- decidir si se comparte database/auth runtime
- revisar alineacion futura de versiones React/router/tooling
- añadir CI/automatizacion cuando la estructura se estabilice
