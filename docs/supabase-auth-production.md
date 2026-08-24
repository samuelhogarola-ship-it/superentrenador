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

## CAPTCHA pendiente

Turnstile es el proveedor recomendado para registro, magic link y recuperacion. No activar
`[auth.captcha]` sin integrar antes el widget en los formularios, enviar su `captchaToken`
a Supabase Auth y disponer de la clave secreta del proveedor en el proyecto cloud. Activarlo
solo en el servidor haria fallar todas las solicitudes legitimas.

Orden de implantacion:

1. Crear el sitio en Cloudflare Turnstile para produccion y localhost.
2. Añadir la clave publica al frontend y entregar `captchaToken` en las llamadas de Auth.
3. Guardar la clave secreta solo en Supabase y habilitar `[auth.captcha]` con `provider = "turnstile"`.
4. Probar registro, magic link, recuperacion, expiracion y token invalido en Preview.
5. Aplicar la misma configuracion en Production y vigilar rechazos durante el lanzamiento.

## Estado actual

El intento de `supabase config push` desde Codex alcanzo el proyecto cloud, pero Supabase devolvio:

```text
403 Your account does not have the necessary privileges to access this endpoint
```

Tambien faltaba:

```text
SUPABASE_AUTH_SMTP_PASS
```

Con una cuenta Supabase con permisos suficientes y SMTP real, la configuracion ya esta lista en `supabase/config.toml`. Tras el push, crear una cuenta de prueba sin confirmar y comprobar que no puede leer contacto ni mensajes.
