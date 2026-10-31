# Super Entrenador

Marketplace de `superentrenador.com` construido con `Next.js + Supabase`. El frontend anterior se conserva como referencia en `legacy-vite/`.

## Estado actual

- `root`: nueva app `Next.js App Router`
- `legacy-vite/`: proyecto anterior basado en `React + Vite`, preservado completo
- `superentrenador.com`: marketplace público SEO
- Coach Studio vive en su repo y deployment independiente: `samuelhogarola-ship-it/coach-studio.superentrenador`

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS v4
- Supabase Auth, Postgres, RLS y Storage

## Comandos

```bash
npm install
npm run dev
npm run build
npm run start
npm run lint
npm run check
npm test
npm run audit:deps
npm run secrets:scan
npm run supabase:verify
npm run supabase:db:push
npm run supabase:auth:push
```

## Variables de entorno

Usa `.env.example` como base:

```bash
NEXT_PUBLIC_SITE_URL=https://superentrenador.com
NEXT_PUBLIC_COACH_STUDIO_URL=https://coach-studio.superentrenador.com
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
MARKETPLACE_DEMO_MODE=false
SUPABASE_DB_PASSWORD=
SUPABASE_AUTH_SMTP_HOST=
SUPABASE_AUTH_SMTP_USER=
SUPABASE_AUTH_SMTP_PASS=
SUPABASE_AUTH_SMTP_ADMIN_EMAIL=
SUPABASE_ACCESS_TOKEN=
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
│   ├── dashboard/page.tsx
│   ├── mis-anuncios/page.tsx
│   └── admin/entrenadores/page.tsx
├── src/components
├── src/lib
│   ├── marketplace-data.ts
│   ├── repositories/trainers.ts
│   └── supabase/
├── public/
└── legacy-vite/
```

## Estado funcional

- Home, listado, fichas y landings públicas conectadas al repositorio Supabase
- `sitemap.xml` y `robots.txt`
- Supabase Auth con magic link y Google
- Panel de cliente, panel de entrenador, anuncios y mensajería
- Panel de administración para revisar y publicar entrenadores
- Fotos de perfil en el bucket `trainer-photos`
- RLS, funciones SQL restringidas, rate limiting y cabeceras de seguridad
- Perfil modelo de Samuel disponible sólo con `MARKETPLACE_DEMO_MODE=true`

## Pendiente de lanzamiento

- aplicar todas las migraciones de `supabase/migrations/` en el proyecto remoto
- enlazar la CLI al proyecto `qxugymzyvtbxeyqcvtgk` y aplicar migraciones con `npm run supabase:db:push`
- activar confirmación de email y SMTP propio con `npm run supabase:auth:push`
- publicar confirmación y Magic Link con TokenHash mediante `npm run supabase:auth:templates:push`
- verificar grants, RLS y Storage contra Supabase remoto
- validar dominio, redirects OAuth y DNS finales
- integrar el cobro y la renovación automática del Pase Alumno y de los planes profesionales; por ahora la activación comercial es manual
- mantener Coach Studio separado del marketplace y enlazado mediante `NEXT_PUBLIC_COACH_STUDIO_URL`
- montar el volumen compartido de WF-Blogger en `WF_BLOGGER_ROOT` y configurar el secreto de publicación en ambos servicios
- añadir páginas SEO por especialidad / ciudad / combinación

## Notas de deploy en Coolify

Si despliegas esta app como servicio Node:

- Install command: `npm install`
- Build command: `npm run build`
- Start command: `npm run start`

No es un static site. Esta base está pensada como marketplace público indexable con crecimiento hacia lógica privada y Supabase.

### WF-Blogger

Superentrenador usa el tenant `superentrenador` del WF-Blogger central. El volumen persistente debe montarse en la misma ruta dentro de WF-Panel y de esta aplicación, recomendada: `/data/blogger/superentrenador`.

En Superentrenador:

```env
WF_BLOGGER_ROOT=/data/blogger/superentrenador
WF_BLOGGER_BUILD_SECRET=<shared-random-secret>
```

En WF-Panel:

```env
BLOGGER_SITE_ROOTS_JSON={"superentrenador":"/data/blogger/superentrenador"}
BLOGGER_BUILD_HOOK_SUPERENTRENADOR=https://superentrenador.com/api/wf-blogger/publish
BLOGGER_BUILD_SECRET_SUPERENTRENADOR=<shared-random-secret>
```

El secreto debe coincidir en ambos servicios. La web ignora borradores y solo muestra Markdown con `status: published`.
