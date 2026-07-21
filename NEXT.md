# NEXT

## Prioridad inmediata

- Activar en Supabase cloud la configuracion de Auth preparada en este repo cuando haya cuenta Owner/Admin y SMTP real.
- Aplicar la migracion `20260714090000_separate_demo_marketplace_data.sql` en Supabase remoto cuando haya `SUPABASE_DB_PASSWORD` o permisos Owner/Admin.
- Pulir la home pública ya migrada al sistema visual tipo Saulo para llevarla a un nivel comercial real.
- Tomar como referencia de tono: Porsche, McDonald's, Superprof.
- Mantener el marketplace en Next.js y terminar de cerrar la capa pública antes de abrir más frentes.

## Problemas detectados

- Supabase Auth esta implementado en app y configurado en repo, pero el push cloud devolvio `403` por falta de permisos de la cuenta actual.
- Supabase CLI tambien devuelve `403` al listar migraciones remotas sin una cuenta con privilegios y pide `SUPABASE_DB_PASSWORD`; la migracion demo/produccion ya esta en repo pero pendiente de aplicar en cloud.
- Magic link necesita SMTP propio para evitar el limite bajo del SMTP integrado de Supabase.
- Coach Studio ya tiene editor configurable por lineas y vista alumno demo/local; para produccion falta aprobar y aplicar una politica segura de acceso por token en Supabase antes de exponer rutinas sin login.
- La nueva base visual ya es más coherente, pero la hero aún no transmite suficiente autoridad de marca.
- Falta el logo real de Super Entrenador.
- Falta la capa legal reutilizable desde `core-general`.
- Falta banner de cookies.
- El sitio está desplegado, pero todavía no está listo como presentación pública final de marca.
- El dominio raíz `superentrenador.com` sigue pendiente de validar/ajustar frente a `www.superentrenador.com`.

## Dirección creativa para la siguiente iteración

- Hero muy sencilla y potente.
- Menos bloques, menos ruido y menos texto.
- Jerarquía visual fuerte.
- Tipografía sobria y premium.
- Espaciado amplio.
- Colores contenidos.
- Conversión clara al estilo marketplace serio, no app genérica.
- Referencia funcional: discovery limpio tipo Superprof.

## Trabajo a realizar

### 0. Bloqueos externos que no puede resolver Codex sin acceso

- Entrar con una cuenta Supabase Owner/Admin del proyecto `qxugymzyvtbxeyqcvtgk`.
- Configurar SMTP real en variables:
  - `SUPABASE_AUTH_SMTP_HOST`
  - `SUPABASE_AUTH_SMTP_USER`
  - `SUPABASE_AUTH_SMTP_PASS`
  - `SUPABASE_AUTH_SMTP_ADMIN_EMAIL`
- Ejecutar `scripts/push-supabase-auth-config.sh`.
- Ejecutar `supabase db push` o aplicar manualmente `supabase/migrations/20260714090000_separate_demo_marketplace_data.sql`.
- Confirmar en dashboard Auth que Magic Link, redirect URLs y rate limits quedan aplicados.
- Validar DNS/dominio final de `superentrenador.com` y `www.superentrenador.com`.

### 1. Replanteamiento visual

- Pulir `src/app/page.tsx`.
- Afinar hero, ritmo vertical y jerarquía visual.
- Mantener el sistema base ya implantado:
  - superficies claras tipo app premium
  - tipografía `Sora` + `Plus Jakarta Sans`
  - navegación inferior móvil
  - header limpio en desktop
- Llevar la home a una versión comercial con:
  - hero principal
  - buscador o CTA principal
  - prueba social o bloque de confianza
  - bloque breve de valor para usuarios
  - bloque breve de valor para entrenadores

### 2. Branding

- Integrar el logo real de Super Entrenador.
- Revisar favicon y consistencia de marca.

### 3. Legal

- Traer legal desde `core-general` o adaptar su estructura al proyecto Next.
- Añadir páginas legales mínimas si faltan:
  - privacidad
  - términos
  - cookies

### 4. Cookies

- Añadir banner de cookies.
- Debe quedar visible, claro y no intrusivo.
- Debe ser compatible con futura capa legal/compliance real.

### 5. QA visual

- Revisar desktop y móvil.
- Revisar contraste, espaciado y densidad.
- Revisar que la home se sienta marca premium y no plantilla.

### 6. Tooling base

- El paquete base de `core-general` ya está replicado aquí:
  - Husky
  - commitlint
  - audit-ci
  - gitleaks
- Mantenerlo y usarlo como estándar del repo.

## No hacer todavía

- No priorizar backend nuevo.
- No priorizar dashboard privada.
- No abrir nuevas features mientras la capa pública no esté a nivel de marca.

## Current Focus

- Cerrar la capa pública comercial de `superentrenador`.
- Pulir hero + branding + legal + cookies.
- Validar dominio raíz y dejar el marketplace listo para presentación comercial.
- Priorizar Marketplaces: home, listado, ciudades, fichas y conversión a contacto/registro.
- Andalucía queda como primera región completa; siguiente bloque: Comunidad Valenciana, Madrid, Cataluña y principales capitales de España.

## Expansión territorial

- Mantener cada región con una landing índice propia (`/andalucia`, después `/madrid`, `/comunidad-valenciana`, etc.).
- Añadir ciudades por oleadas comerciales, no una lista infinita sin intención.
- Prioridad España:
  - capitales autonómicas
  - capitales de provincia
  - ciudades de costa/alto valor fitness
  - áreas metropolitanas con demanda SEO
- Cada ciudad nueva debe añadirse en:
  - `src/lib/marketplace-data.ts`
  - `supabase/seed.sql`
  - landing regional si aplica

## Criterio de “listo”

- La home puede enseñarse sin pedir contexto.
- La hero explica el producto en segundos.
- La marca se reconoce.
- La navegación pública se siente coherente.
- Legal y cookies están presentes.
- El resultado se acerca más a “premium minimal marketplace” que a “demo técnica”.
