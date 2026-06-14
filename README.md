# Super Entrenador

Base nueva del marketplace público de `superentrenador.com`, rehecha dentro del mismo repositorio con `Next.js + Supabase` y conservando el frontend anterior en `legacy-vite/`.

## Estado actual

- `root`: nueva app `Next.js App Router`
- `legacy-vite/`: proyecto anterior basado en `React + Vite`, preservado completo
- `superentrenador.com`: marketplace público SEO
- `app.superentrenador.com`: reservado para futura zona privada
- `coach-studio.superentrenador.com`: app/PT tool separada futura o existente

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS v4
- Supabase preparado por variables de entorno

## Comandos

```bash
npm install
npm run dev
npm run build
npm run start
npm run lint
npm run check
```

## Variables de entorno

Usa `.env.example` como base:

```bash
NEXT_PUBLIC_SITE_URL=https://superentrenador.com
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Estructura útil

```text
.
├── src/app
│   ├── page.tsx
│   ├── entrenadores/[slug]/page.tsx
│   ├── entrenadores/page.tsx
│   ├── ciudades/[city]/page.tsx
│   ├── login/page.tsx
│   └── dashboard/page.tsx
├── src/components
├── src/lib
│   ├── marketplace-data.ts
│   ├── repositories/trainers.ts
│   └── supabase/
├── public/
└── legacy-vite/
```

## Qué está ya preparado

- Home pública inicial para marketplace
- Listado público de entrenadores
- Ficha pública SEO por entrenador
- Landings SEO por ciudad
- `sitemap.xml` y `robots.txt`
- Placeholder limpio para login y zona privada futura
- Capa Supabase preparada para integrar datos reales

## Qué falta después

- sustituir mocks por consultas reales a Supabase
- implementar auth con Supabase
- definir desbloqueo premium y pagos
- separar la zona privada real detrás de `app.superentrenador.com`
- añadir páginas SEO por especialidad / ciudad / combinación

## Notas de deploy en Coolify

Si despliegas esta app como servicio Node:

- Install command: `npm install`
- Build command: `npm run build`
- Start command: `npm run start`

No es un static site. Esta base está pensada como marketplace público indexable con crecimiento hacia lógica privada y Supabase.
