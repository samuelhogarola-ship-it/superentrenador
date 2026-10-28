import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function readSource(path: string) {
  return readFile(new URL(path, import.meta.url), "utf8");
}

test("contact access requires a confirmed email and the protected database RPC", async () => {
  const source = await readSource("../src/app/api/trainer-contact/route.ts");

  assert.match(source, /hasVerifiedEmail\(user\)/);
  assert.match(source, /rpc\("get_public_trainer_contact_info"/);
  assert.doesNotMatch(source, /getClientIp/);
});

test("message mutations require same origin and confirmed email", async () => {
  const source = await readSource("../src/app/api/messages/route.ts");

  assert.match(source, /isSameOriginRequest\(request\)/);
  assert.match(source, /hasVerifiedEmail\(user\)/);
  assert.doesNotMatch(source, /getClientIp/);
});

test("contact and message mutations rely on database-enforced limits", async () => {
  const [contact, messages] = await Promise.all([
    readSource("../src/app/api/trainer-contact/route.ts"),
    readSource("../src/app/api/messages/route.ts"),
  ]);

  for (const source of [contact, messages]) {
    assert.doesNotMatch(source, /import \{ rateLimit \}/);
    assert.doesNotMatch(source, /await rateLimit\(/);
    assert.match(source, /rate_limit_exceeded/);
  }
});

test("profile updates and sign-out require same origin", async () => {
  const [profileSource, signOutSource] = await Promise.all([
    readSource("../src/app/api/own-trainer-profile/route.ts"),
    readSource("../src/app/auth/sign-out/route.ts"),
  ]);

  assert.match(profileSource, /isSameOriginRequest\(request\)/);
  assert.match(signOutSource, /isSameOriginRequest\(request\)/);
});

test("local Supabase auth requires email confirmation", async () => {
  const config = await readSource("../supabase/config.toml");
  const emailSection = config.match(/\[auth\.email\]([\s\S]*?)(?=\n\[|$)/)?.[1] ?? "";

  assert.match(emailSection, /enable_confirmations\s*=\s*true/);
  assert.match(config, /minimum_password_length\s*=\s*8/);
});

test("versioned Supabase auth documents the Google OAuth credentials", async () => {
  const [config, env, pushScript] = await Promise.all([
    readSource("../supabase/config.toml"),
    readSource("../.env.example"),
    readSource("../scripts/push-supabase-auth-config.sh"),
  ]);

  assert.match(config, /\[auth\.external\.google\][\s\S]*enabled = true/);
  assert.match(config, /SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID/);
  assert.match(config, /SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET/);
  assert.match(env, /SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID=/);
  assert.match(env, /SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET=/);
  assert.match(pushScript, /SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID/);
  assert.match(pushScript, /SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET/);
});

test("local Supabase auth throttles email and credential abuse", async () => {
  const config = await readSource("../supabase/config.toml");
  const rateLimitSection = config.match(/\[auth\.rate_limit\]([\s\S]*?)(?=\n\[|$)/)?.[1] ?? "";
  const emailSection = config.match(/\[auth\.email\]([\s\S]*?)(?=\n\[|$)/)?.[1] ?? "";

  assert.match(rateLimitSection, /email_sent\s*=\s*30/);
  assert.match(rateLimitSection, /sign_in_sign_ups\s*=\s*30/);
  assert.match(rateLimitSection, /token_verifications\s*=\s*30/);
  assert.match(emailSection, /max_frequency\s*=\s*"60s"/);
});

test("production auth runbook tracks CAPTCHA as a coordinated launch requirement", async () => {
  const runbook = await readSource("../docs/supabase-auth-production.md");

  assert.match(runbook, /CAPTCHA/);
  assert.match(runbook, /Turnstile/);
  assert.match(runbook, /captchaToken/);
  assert.match(runbook, /no activar[\s\S]*sin[\s\S]*clave/i);
});

test("production auth runbook separates sign-in and route authorization checks", async () => {
  const runbook = await readSource("../docs/supabase-auth-production.md");

  assert.match(runbook, /cuenta confirmada[\s\S]*rutas privadas/i);
  assert.match(runbook, /cuenta sin confirmar[\s\S]*no puede iniciar sesion/i);
  assert.match(runbook, /email_confirmed_at[\s\S]*null[\s\S]*integracion/i);
});
