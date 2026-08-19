import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function readSource(path: string) {
  return readFile(new URL(path, import.meta.url), "utf8");
}

test("env template documents launch and demo configuration", async () => {
  const env = await readSource("../.env.example");

  for (const name of [
    "MARKETPLACE_DEMO_MODE",
    "SUPABASE_DB_PASSWORD",
    "SUPABASE_AUTH_SMTP_HOST",
    "SUPABASE_AUTH_SMTP_USER",
    "SUPABASE_AUTH_SMTP_PASS",
    "SUPABASE_AUTH_SMTP_ADMIN_EMAIL",
  ]) {
    assert.match(env, new RegExp(`^${name}=`, "m"));
  }
  assert.match(env, /^MARKETPLACE_DEMO_MODE=false$/m);
});

test("CI runs secret and dependency security gates", async () => {
  const workflow = await readSource("../.github/workflows/ci.yml");

  assert.match(workflow, /npm run security:setup/);
  assert.match(workflow, /npm run secrets:scan/);
  assert.match(workflow, /npm run audit:deps/);
});

test("dependency audit has no stale vulnerability allowlist", async () => {
  const config = await readSource("../audit-ci.jsonc");

  assert.doesNotMatch(config, /"allowlist"/);
});

test("Open Graph image uses the supported Node.js runtime", async () => {
  const source = await readSource("../src/app/opengraph-image.tsx");

  assert.doesNotMatch(source, /runtime\s*=\s*["']edge["']/);
});

test("image CSP allows only app and Supabase image origins", async () => {
  const config = await readSource("../next.config.ts");

  assert.match(config, /img-src 'self' data: blob: https:\/\/\*\.supabase\.co https:\/\/\*\.supabase\.in/);
  assert.doesNotMatch(config, /"img-src 'self' data: blob: https:"/);
});

test("README describes the implemented auth and private surfaces", async () => {
  const readme = await readSource("../README.md");

  assert.doesNotMatch(readme, /Placeholder limpio para login y zona privada futura/);
  assert.doesNotMatch(readme, /sustituir mocks por consultas reales a Supabase/);
  assert.match(readme, /Supabase Auth/);
  assert.match(readme, /panel de administración/i);
});
