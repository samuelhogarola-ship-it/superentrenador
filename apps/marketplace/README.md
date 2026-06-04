# Marketplace

Producto publico y client-facing de SuperEntrenador.

Esta importacion conserva el prototipo actual: landing, perfiles publicos de entrenador y varias rutas internas/demo que se mantienen temporalmente para no romper la migracion inicial.

## Desarrollo desde la raiz del monorepo

```bash
npm install
npm run dev:marketplace
```

## Build

```bash
npm run build:marketplace
```

## Rutas actuales

- `/`
- `/trainers/:slug`
- `/app/pt`
- `/app/client`
- `/app/admin`

## Nota importante

Las rutas `/app/pt`, `/app/client` y `/app/admin` son provisionales. Se conservan como legacy/demo routes y deben moverse o reescribirse dentro de `apps/coach-studio` en una PR posterior.
