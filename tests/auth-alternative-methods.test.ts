import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import * as authModule from "../src/lib/auth";
import * as turnstileModule from "../src/components/turnstile-widget";

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
const smokeSource = readFileSync(new URL("../scripts/smoke-auth.mjs", import.meta.url), "utf8");

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

test("a submitted magic-link request always consumes its Turnstile token", async () => {
  const runCaptchaProtectedRequest = (
    authModule as unknown as Record<string, unknown>
  ).runCaptchaProtectedRequest as
    | (<T>(request: () => Promise<T>, onConsumed: () => void) => Promise<T>)
    | undefined;

  assert.equal(typeof runCaptchaProtectedRequest, "function");

  let consumed = 0;
  const result = await runCaptchaProtectedRequest!(async () => "sent", () => {
    consumed += 1;
  });
  assert.equal(result, "sent");
  assert.equal(consumed, 1);

  await assert.rejects(
    runCaptchaProtectedRequest!(async () => {
      throw new Error("network error");
    }, () => {
      consumed += 1;
    }),
    /network error/,
  );
  assert.equal(consumed, 2);
});

test("magic-link login does not reveal whether an email is registered", () => {
  const getMagicLinkFeedback = (
    authModule as unknown as Record<string, unknown>
  ).getMagicLinkFeedback as
    | ((errorMessage: string | null, mode: "login" | "register") => { tone: "error" | "success"; text: string })
    | undefined;

  assert.equal(typeof getMagicLinkFeedback, "function");

  const sent = getMagicLinkFeedback!(null, "login");
  const missing = getMagicLinkFeedback!("422: Signups not allowed for otp", "login");
  assert.deepEqual(missing, sent);
  assert.deepEqual(sent, {
    tone: "success",
    text: "Si hay una cuenta asociada a ese email, recibirás un enlace mágico.",
  });
});

test("Turnstile switches to compact mode below its 300px flexible-width minimum", () => {
  const getTurnstileSize = (
    turnstileModule as unknown as Record<string, unknown>
  ).getTurnstileSize as ((containerWidth: number) => "compact" | "flexible") | undefined;

  assert.equal(typeof getTurnstileSize, "function");
  assert.equal(getTurnstileSize!(299), "compact");
  assert.equal(getTurnstileSize!(300), "flexible");

  const shouldRerenderTurnstile = (
    turnstileModule as unknown as Record<string, unknown>
  ).shouldRerenderTurnstile as
    | ((currentSize: "compact" | "flexible" | null, containerWidth: number) => boolean)
    | undefined;
  assert.equal(typeof shouldRerenderTurnstile, "function");
  assert.equal(shouldRerenderTurnstile!("compact", 299), false);
  assert.equal(shouldRerenderTurnstile!("compact", 300), true);
  assert.equal(shouldRerenderTurnstile!("flexible", 299), true);
});

test("auth smoke waits for hydration and the optional Turnstile iframe", () => {
  assert.doesNotMatch(smokeSource, /waitUntil:\s*"domcontentloaded"/);
  assert.match(smokeSource, /waitUntil:\s*"load"/);
  assert.match(smokeSource, /challenges\.cloudflare\.com/);
  assert.match(smokeSource, /iframe/);
});

test("Google registration carries trainer intent through the OAuth callback", () => {
  const buildAuthCallbackUrl = (
    authModule as unknown as Record<string, unknown>
  ).buildAuthCallbackUrl as
    | ((origin: string, redirectPath: string, intent?: "client" | "trainer") => string)
    | undefined;

  assert.equal(typeof buildAuthCallbackUrl, "function");
  assert.equal(
    buildAuthCallbackUrl!("https://superentrenador.com", "/mi-perfil", "trainer"),
    "https://superentrenador.com/auth/callback?next=%2Fmi-perfil&intent=trainer",
  );
});
