# Google OAuth y Magic Link Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Exponer y verificar Google OAuth y Magic Link en login y registro local.

**Architecture:** Un componente cliente común encapsulará las acciones alternativas y sus estados. Las páginas existentes seguirán controlando el destino seguro y el intent de registro, pasándolos al componente.

**Tech Stack:** Next.js App Router, React, TypeScript, Supabase Auth, Node test runner.

**Spec:** `docs/superpowers/specs/2026-10-26-auth-methods-design.md`

## Global Constraints

- No modificar configuración remota de Supabase ni Google Cloud.
- Mantener `getSafeInternalPath` como única fuente para destinos internos.
- Mantener `shouldCreateUser: false` para Magic Link de login y `true` para registro.
- Mantener Turnstile activo cuando exista `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.

## Review Focus

- Email vacío o inválido: no debe intentar enviar el enlace.
- Rate limit de email: debe mostrar el mensaje existente y no romper la pantalla.
- OAuth cancelado o fallido: debe volver al callback de error existente.
- Registro de entrenador: Google y Magic Link deben conservar `intent=trainer`.
- Redirect externo: nunca debe salir de `getSafeInternalPath`.

### Task 1: Auth method component

**Files:**
- Create: `src/components/auth-alternative-methods.tsx`
- Test: `tests/auth-alternative-methods.test.ts`

**Interfaces:**
- Consumes: `redirectPath`, optional `intent`, and optional captcha token.
- Produces: rendered controls labelled `Continuar con Google` and `Entrar con magic link` / `Crear cuenta con magic link`, plus success/error state.

- [ ] Write source-level failing tests for Google redirect intent and Magic Link success/error labels.
- [ ] Run the focused test and confirm it fails because the component is absent.
- [ ] Implement the component using `signInWithGoogle`, `signInWithMagicLink`, and `signUpWithMagicLink`.
- [ ] Run the focused test and confirm it passes.

### Task 2: Integrate login and registration

**Files:**
- Modify: `src/components/login-page-client.tsx`
- Modify: `src/components/registro-page-client.tsx`
- Modify: `tests/password-login.test.ts`
- Modify: `tests/turnstile-integration.test.ts`

**Interfaces:**
- Consumes: Task 1 component.
- Produces: visible alternative-auth controls on both routes.

- [ ] Replace stale password-only assertions with assertions for password plus alternatives.
- [ ] Run focused tests and confirm the new expectations fail.
- [ ] Render the shared component in both pages, passing the safe redirect and registration intent.
- [ ] Run focused tests and confirm they pass.

### Task 3: Smoke coverage and full verification

**Files:**
- Modify: `scripts/smoke-auth.mjs`

- [ ] Align smoke selectors and expected messages with the implemented labels.
- [ ] Run `npm test`, `npm run lint`, `npm run build`, and `git diff --check`.
- [ ] Review the diff for accidental remote/config/secrets changes.
