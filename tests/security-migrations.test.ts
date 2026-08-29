import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const migrationPath = new URL(
  "../supabase/migrations/20260819120000_harden_marketplace_security.sql",
  import.meta.url,
);
const reviewMigrationPath = new URL(
  "../supabase/migrations/20260824100000_close_security_review_findings.sql",
  import.meta.url,
);
const ownerDeleteMigrationPath = new URL(
  "../supabase/migrations/20260824110000_allow_owner_profile_deletion.sql",
  import.meta.url,
);
const databaseRateLimitsMigrationPath = new URL(
  "../supabase/migrations/20260824120000_enforce_database_rate_limits.sql",
  import.meta.url,
);
const rateLimitLintMigrationPath = new URL(
  "../supabase/migrations/20260824130000_fix_rate_limit_lint.sql",
  import.meta.url,
);
const publicViewPrivilegesMigrationPath = new URL(
  "../supabase/migrations/20260829180000_restrict_public_view_privileges.sql",
  import.meta.url,
);

async function readSecurityMigration() {
  return readFile(migrationPath, "utf8").catch(() => "");
}

async function readReviewMigration() {
  return readFile(reviewMigrationPath, "utf8").catch(() => "");
}

async function readOwnerDeleteMigration() {
  return readFile(ownerDeleteMigrationPath, "utf8").catch(() => "");
}

async function readDatabaseRateLimitsMigration() {
  return readFile(databaseRateLimitsMigrationPath, "utf8").catch(() => "");
}

async function readRateLimitLintMigration() {
  return readFile(rateLimitLintMigrationPath, "utf8").catch(() => "");
}

async function readPublicViewPrivilegesMigration() {
  return readFile(publicViewPrivilegesMigrationPath, "utf8").catch(() => "");
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

test("requires approval everywhere a trainer can become public", async () => {
  const sql = await readReviewMigration();

  assert.match(sql, /CREATE OR REPLACE VIEW public\.trainer_profiles_public[\s\S]*review_status = 'approved'/i);
  assert.match(sql, /get_public_trainer_contact_info[\s\S]*tp\.review_status = 'approved'/i);
  assert.match(sql, /Participants can insert thread messages[\s\S]*tp\.review_status = 'approved'/i);
  assert.match(sql, /CHECK \(NOT is_published OR review_status = 'approved'\)/i);
});

test("constrains direct calls to the shared rate-limit RPC", async () => {
  const sql = await readReviewMigration();

  assert.match(sql, /WHEN p_key LIKE 'trainer-contact:%' THEN 30/i);
  assert.match(sql, /WHEN p_key LIKE 'messages:post:%' THEN 5/i);
  assert.match(sql, /p_limit <> v_expected_limit/i);
  assert.match(sql, /p_window_seconds <> v_expected_window_seconds/i);
  assert.match(sql, /auth\.uid\(\)::text/i);
});

test("enforces confirmed email in message and photo storage policies", async () => {
  const sql = `${await readSecurityMigration()}\n${await readReviewMigration()}`;

  assert.match(sql, /CREATE OR REPLACE FUNCTION public\.has_confirmed_email/i);
  assert.match(sql, /CREATE POLICY "Participants can insert thread messages"[\s\S]*has_confirmed_email\(\)/i);
  assert.match(sql, /CREATE POLICY "Thread client can read messages"[\s\S]*has_confirmed_email\(\)/i);
  assert.match(sql, /CREATE POLICY "trainer_photos_authenticated_insert"[\s\S]*has_confirmed_email\(\)/i);
});

test("applies review fixes incrementally and restricts future photo object names", async () => {
  const [historicalSql, reviewSql] = await Promise.all([
    readSecurityMigration(),
    readReviewMigration(),
  ]);

  assert.doesNotMatch(historicalSql, /trainer_profiles_published_requires_approval/i);
  assert.match(reviewSql, /trainer_profiles_published_requires_approval/i);
  assert.match(reviewSql, /name = auth\.uid\(\)::text \|\| '\/profile'/i);
});

test("allows confirmed trainers to delete only their own profile", async () => {
  const sql = await readOwnerDeleteMigration();

  assert.match(sql, /GRANT DELETE ON public\.trainer_profiles TO authenticated/i);
  assert.match(
    sql,
    /CREATE POLICY "Trainer can delete own profile"[\s\S]*FOR DELETE TO authenticated[\s\S]*has_confirmed_email\(\)[\s\S]*auth\.uid\(\) = user_id/i,
  );
});

test("enforces contact and message limits in database entry points", async () => {
  const sql = await readDatabaseRateLimitsMigration();

  assert.match(
    sql,
    /get_public_trainer_contact_info[\s\S]*check_rate_limit\(\s*'trainer-contact:'\s*\|\|\s*auth\.uid\(\)::text,\s*30,\s*600\s*\)[\s\S]*is_demo = false/i,
  );
  assert.match(
    sql,
    /consume_message_rate_limit[\s\S]*check_rate_limit\(\s*'messages:post:'\s*\|\|\s*auth\.uid\(\)::text,\s*5,\s*600\s*\)[\s\S]*rate_limit_exceeded/i,
  );
  assert.match(
    sql,
    /Participants can insert thread messages[\s\S]*THEN public\.consume_message_rate_limit\(\)/i,
  );
});

test("qualifies rate-limit cleanup columns that conflict with output parameters", async () => {
  const sql = await readRateLimitLintMigration();

  assert.match(sql, /DELETE FROM public\.rate_limit_buckets AS bucket/i);
  assert.match(sql, /WHERE bucket\.reset_at < v_now - interval '1 day'/i);
  assert.match(sql, /WHEN 'trainer-contact:' \|\| auth\.uid\(\)::text THEN 30/i);
  assert.match(sql, /WHEN 'messages:post:' \|\| auth\.uid\(\)::text THEN 5/i);
  assert.doesNotMatch(sql, /p_key LIKE|right\(p_key, 36\)/i);
  assert.match(sql, /p_limit <> v_expected_limit/i);
  assert.match(sql, /p_window_seconds <> v_expected_window_seconds/i);
});

test("exposes the public trainer view as read-only", async () => {
  const sql = await readPublicViewPrivilegesMigration();

  assert.match(
    sql,
    /REVOKE ALL PRIVILEGES ON TABLE public\.trainer_profiles_public FROM anon, authenticated/i,
  );
  assert.match(sql, /GRANT SELECT ON TABLE public\.trainer_profiles_public TO anon, authenticated/i);
});
