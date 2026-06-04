# Coach Studio

Workspace profesional de SuperEntrenador para entrenadores personales.

Esta app conserva el MVP existente: autenticacion, clientes, rutinas, plantillas, PDF imprimible, pagina legal, cookies y setup basico de Playwright.

## Stack

- React + Vite + TypeScript
- Supabase Auth
- Supabase Database
- Supabase Storage

## Variables de entorno

Crea `apps/coach-studio/.env` a partir de `.env.example`:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Desarrollo desde la raiz del monorepo

```bash
npm install
npm run dev:coach-studio
```

## Build

```bash
npm run build:coach-studio
```

## Flujo local recomendado con Supabase

1. Crear un proyecto en Supabase.
2. Ejecutar la migracion SQL en `apps/coach-studio/supabase/migrations/20260530193000_superentrenador_mvp.sql`.
3. Ejecutar el seed `apps/coach-studio/supabase/seeds/0001_seed_base.sql`.
4. Crear `.env` con la URL y la anon key.
5. Arrancar la app desde la raiz del repo.

## Estructura

- `src/app`: enrutado y composicion principal.
- `src/features`: pantallas y bloques de dominio.
- `src/services`: acceso a Supabase por area funcional.
- `src/utils`: calculos y logica determinista.
- `supabase/migrations`: esquema SQL + RLS.
- `supabase/seeds`: banco inicial de ejercicios y plantillas globales.

## Notas

- Este producto corresponde al workspace profesional del entrenador.
- La extraccion de auth/database compartidos con marketplace queda para una fase posterior.
