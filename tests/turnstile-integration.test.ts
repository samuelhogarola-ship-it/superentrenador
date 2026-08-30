import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function readSource(path: string) {
  return readFile(new URL(path, import.meta.url), "utf8");
}

test("documents the public Turnstile site key", async () => {
  const env = await readSource("../.env.example");

  assert.match(env, /NEXT_PUBLIC_TURNSTILE_SITE_KEY=/);
  assert.match(env, /SUPABASE_AUTH_CAPTCHA_SECRET=/);
});

test("activates Turnstile validation in the reproducible Supabase auth config", async () => {
  const config = await readSource("../supabase/config.toml");

  assert.match(config, /\[auth\.captcha\][\s\S]*enabled = true/);
  assert.match(config, /\[auth\.captcha\][\s\S]*provider = "turnstile"/);
  assert.match(config, /\[auth\.captcha\][\s\S]*secret = "env\(SUPABASE_AUTH_CAPTCHA_SECRET\)"/);
});

test("passes CAPTCHA tokens to Supabase email auth calls", async () => {
  const auth = await readSource("../src/lib/auth.ts");

  assert.match(auth, /signInWithMagicLink[\s\S]*captchaToken[\s\S]*signInWithOtp/);
  assert.match(auth, /signUpWithMagicLink[\s\S]*captchaToken[\s\S]*signInWithOtp/);
  assert.match(auth, /signIn\([\s\S]*captchaToken[\s\S]*signInWithPassword/);
});

test("renders independent Turnstile challenges for login and registration", async () => {
  const [login, registration, widget] = await Promise.all([
    readSource("../src/components/login-page-client.tsx"),
    readSource("../src/components/registro-page-client.tsx"),
    readSource("../src/components/turnstile-widget.tsx"),
  ]);

  assert.match(login, /<TurnstileWidget[\s\S]*action="magic_link"/);
  assert.match(login, /<TurnstileWidget[\s\S]*action="password_login"/);
  assert.match(registration, /<TurnstileWidget[\s\S]*action="registration"/);
  assert.match(widget, /challenges\.cloudflare\.com\/turnstile\/v0\/api\.js\?render=explicit/);
  assert.match(widget, /expired-callback/);
  assert.match(widget, /turnstile\.reset/);
});

test("allows the Turnstile script, verification request and iframe in CSP", async () => {
  const config = await readSource("../next.config.ts");

  assert.match(config, /https:\/\/challenges\.cloudflare\.com/);
  assert.match(config, /scriptSources[\s\S]*challenges\.cloudflare\.com/);
  assert.match(config, /connect-src[\s\S]*challenges\.cloudflare\.com/);
  assert.match(config, /frame-src[\s\S]*challenges\.cloudflare\.com/);
});
