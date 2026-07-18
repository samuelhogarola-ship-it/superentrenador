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
scripts/push-supabase-auth-config.sh
```

El script ejecuta:

```bash
supabase config push --project-ref qxugymzyvtbxeyqcvtgk
```

## Dashboard checklist

En `Authentication > URL Configuration`:

- Site URL: `https://superentrenador.com`
- Redirect URLs:
  - `https://superentrenador.com/**`
  - `https://www.superentrenador.com/**`
  - `https://coach-studio.superentrenador.com/**`
  - `http://localhost:3000/**`
  - `http://127.0.0.1:3000/**`

En `Authentication > Emails > Magic Link / OTP`:

- Usar `{{ .ConfirmationURL }}`.

En `Authentication > Rate Limits`:

- Email sent: `500` por hora.
- Sign in / sign ups: `120` por 5 minutos.
- OTP / magic link verifications: `120` por 5 minutos.

## Estado actual

El intento de `supabase config push` desde Codex alcanzo el proyecto cloud, pero Supabase devolvio:

```text
403 Your account does not have the necessary privileges to access this endpoint
```

Tambien faltaba:

```text
SUPABASE_AUTH_SMTP_PASS
```

Con una cuenta Supabase con permisos suficientes y SMTP real, la configuracion ya esta lista en `supabase/config.toml`.
