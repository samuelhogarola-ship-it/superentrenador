# SuperEntrenador Monorepo

Monorepo principal de la plataforma SuperEntrenador.

En esta primera migracion se consolida:

- `apps/coach-studio`: workspace profesional para entrenadores
- `apps/marketplace`: producto publico/client-facing
- `packages/permissions`: contratos minimos de acceso por producto
- `packages/config`: base de configuracion compartida para el workspace

La separacion de auth, database y UI compartida se deja preparada, pero todavia no se extrae runtime comun salvo helpers minimos donde haga falta.

## Instalacion

```bash
npm install
```

## Comandos

```bash
npm run dev:coach-studio
npm run dev:marketplace
npm run build:coach-studio
npm run build:marketplace
npm run build
```

## Estructura

- `apps/`: productos desplegables
- `packages/`: librerias y contratos compartidos
- `docs/`: documentacion de arquitectura y migracion

## Documentacion

- `docs/repo-structure.md`
- `docs/products.md`
- `docs/access-model.md`
- `docs/migration-notes.md`

## Nota

La intencion es compartir auth, database y permisos entre productos, pero en esta fase cada app conserva su runtime propio para evitar una migracion demasiado agresiva.

Las rutas `marketplace` `/app/pt`, `/app/client` y `/app/admin` se mantienen solo como demos heredadas para no romper la migracion. Deben moverse o reescribirse en una PR posterior.
