import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const componentSource = readFileSync(
  new URL("../src/components/auth-alternative-methods.tsx", import.meta.url),
  "utf8",
);
const loginSource = readFileSync(
  new URL("../src/components/login-page-client.tsx", import.meta.url),
  "utf8",
);
const registrationSource = readFileSync(
  new URL("../src/components/registro-page-client.tsx", import.meta.url),
  "utf8",
);

test("renders Google OAuth and login magic-link actions", () => {
  assert.match(componentSource, /Continuar con Google/);
  assert.match(componentSource, /Entrar con magic link/);
  assert.match(componentSource, /signInWithGoogle/);
  assert.match(componentSource, /signInWithMagicLink/);
});

test("renders registration magic-link action and preserves registration intent", () => {
  assert.match(componentSource, /Crear cuenta con magic link/);
  assert.match(componentSource, /signUpWithMagicLink/);
  assert.match(registrationSource, /AuthAlternativeMethods/);
  assert.match(registrationSource, /intent/);
});

test("login renders the shared alternative-auth component", () => {
  assert.match(loginSource, /AuthAlternativeMethods/);
  assert.ok(
    loginSource.indexOf("<AuthAlternativeMethods") < loginSource.indexOf('type="password"'),
    "social and magic-link actions should appear before password login",
  );
});

test("registration renders alternative-auth before password fields", () => {
  assert.ok(
    registrationSource.indexOf("<AuthAlternativeMethods") < registrationSource.indexOf('autoComplete="new-password"'),
    "social and magic-link actions should appear before password registration",
  );
});
