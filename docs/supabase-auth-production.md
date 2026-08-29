# Supabase Auth production setup

Proyecto cloud:

- Ref: `qxugymzyvtbxeyqcvtgk`
- App URL: `https://superentrenador.com`

## Objetivo

Magic link y registro necesitan SMTP propio en Supabase Auth. El SMTP integrado de Supabase aplica limites muy bajos de email y puede devolver `email rate limit exceeded` durante pruebas normales.

## Variables necesarias

Antes de empujar configuracion:

```bash
export SUPABASE_AUTH_SMTP_HOST="smtp.example.com"
export SUPABASE_AUTH_SMTP_USER="..."
export SUPABASE_AUTH_SMTP_PASS="..."
export SUPABASE_AUTH_SMTP_ADMIN_EMAIL="no-reply@superentrenador.com"
```

La CLI tambien necesita una sesion con permisos de Owner/Admin:

```bash
supabase login
```

## Aplicar configuracion

```bash
npm run supabase:auth:push
```

El script ejecuta:

```bash
supabase config push --project-ref qxugymzyvtbxeyqcvtgk
```

Antes del push, el script comprueba que `.env.local` apunta al mismo proyecto y aborta si detecta un enlace local a otro ref.

Tras el push:

- Usar una cuenta confirmada para probar inicio de sesion y acceso a las rutas privadas.
- Verificar con una cuenta sin confirmar que no puede iniciar sesion en produccion.
- Comprobar aparte la defensa de las rutas con un fixture autenticado cuyo
  `email_confirmed_at` sea `null`; si produccion no puede emitir esa sesion, ejecutar
  contacto y mensajes contra ese fixture en la suite de integracion.

## Dashboard checklist

En `Authentication > URL Configuration`:

- Site URL: `https://superentrenador.com`
- Redirect URLs:
  - `https://superentrenador.com/**`
  - `https://www.superentrenador.com/**`
  - `http://localhost:3000/**`
  - `http://127.0.0.1:3000/**`

En `Authentication > Emails > Magic Link / OTP`:

- Usar `{{ .ConfirmationURL }}`.
- Confirmar que `Confirm email` esta activado; `supabase/config.toml` usa `enable_confirmations = true`.

En `Authentication > Rate Limits`:

- Email sent: `30` por hora.
- Sign in / sign ups: `30` por 5 minutos y por IP.
- OTP / magic link verifications: `30` por 5 minutos y por IP.
- Reenvio de email: minimo `60s` entre solicitudes.

## CAPTCHA preparado; activacion cloud pendiente

Turnstile es el proveedor recomendado para registro, magic link y recuperacion. Login,
magic link y registro ya montan desafios independientes cuando existe
`NEXT_PUBLIC_TURNSTILE_SITE_KEY`, envian su `captchaToken` a Supabase Auth y reinician el
desafio despues de cada intento. Sin esa variable, el frontend conserva el flujo actual.

No activar `[auth.captcha]` hasta disponer de una clave real de produccion y haber validado
el recorrido completo en Preview. Activarlo solo en Supabase, sin desplegar simultaneamente
la clave publica del frontend, haria fallar todas las solicitudes legitimas.

Orden de implantacion:

1. Crear el sitio en Cloudflare Turnstile para produccion y localhost.
2. Guardar la clave publica como `NEXT_PUBLIC_TURNSTILE_SITE_KEY` en Preview y desplegar el frontend preparado.
3. Guardar la clave secreta solo en Supabase y habilitar `[auth.captcha]` con `provider = "turnstile"`.
4. Probar registro, magic link, recuperacion, expiracion y token invalido en Preview.
5. Aplicar la misma configuracion en Production y vigilar rechazos durante el lanzamiento.

## Estado actual

La integracion frontend y la CSP estan implementadas y verificadas localmente con la clave
publica oficial de pruebas de Cloudflare. Falta crear el widget real, guardar su clave publica
en el entorno de despliegue y su secreto exclusivamente en Supabase antes de habilitar CAPTCHA.

El intento de `supabase config push` desde Codex alcanzo el proyecto cloud, pero Supabase devolvio:

```text
403 Your account does not have the necessary privileges to access this endpoint
```

Tambien faltaba:

```text
SUPABASE_AUTH_SMTP_PASS
```

Con una cuenta Supabase con permisos suficientes y SMTP real, la configuracion ya esta lista en `supabase/config.toml`. La prueba de una cuenta sin confirmar valida el rechazo de inicio de sesion; la autorizacion defensiva de contacto y mensajes se valida por separado con el fixture descrito arriba.
