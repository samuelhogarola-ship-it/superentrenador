import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const migrationPath = new URL(
  "../supabase/migrations/20260819120000_harden_marketplace_security.sql",
  import.meta.url,
);

async function readSecurityMigration() {
  return readFile(migrationPath, "utf8").catch(() => "");
}

test("revokes every anonymous trainer_profiles column privilege", async () => {
  const sql = await readSecurityMigration();

  assert.match(sql, /information_schema\.columns/i);
  assert.match(sql, /REVOKE SELECT \(%I\).*trainer_profiles FROM anon/i);
  assert.match(sql, /REVOKE ALL PRIVILEGES ON TABLE public\.trainer_profiles FROM anon/i);
});

test("requires confirmed email before returning trainer contact details", async () => {
  const sql = await readSecurityMigration();

  assert.match(sql, /auth\.users/i);
  assert.match(sql, /email_confirmed_at IS NOT NULL/i);
});

test("constrains direct calls to the shared rate-limit RPC", async () => {
  const sql = await readSecurityMigration();

  assert.match(sql, /p_limit NOT BETWEEN 1 AND 100/i);
  assert.match(sql, /p_window_seconds NOT BETWEEN 1 AND 86400/i);
  assert.match(sql, /auth\.uid\(\)::text/i);
});

test("enforces confirmed email in message and photo storage policies", async () => {
  const sql = await readSecurityMigration();

  assert.match(sql, /CREATE OR REPLACE FUNCTION public\.has_confirmed_email/i);
  assert.match(sql, /CREATE POLICY "Participants can insert thread messages"[\s\S]*has_confirmed_email\(\)/i);
  assert.match(sql, /CREATE POLICY "Thread client can read messages"[\s\S]*has_confirmed_email\(\)/i);
  assert.match(sql, /CREATE POLICY "trainer_photos_authenticated_insert"[\s\S]*has_confirmed_email\(\)/i);
});
