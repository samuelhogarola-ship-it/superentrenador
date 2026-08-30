import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function readSource(path: string) {
  return readFile(new URL(path, import.meta.url), "utf8");
}

async function getContentSecurityPolicies(url: string, nodeEnv: "development" | "production") {
  const previousUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const previousNodeEnv = process.env.NODE_ENV;

  try {
    process.env.NEXT_PUBLIC_SUPABASE_URL = url;
    process.env.NODE_ENV = nodeEnv;
    const { default: nextConfig } = await import(`../next.config.ts?csp=${nodeEnv}-${Date.now()}`);
    const headerRules = await nextConfig.headers?.();

    return (
      headerRules?.flatMap((rule) =>
        rule.headers
          .filter((header) => header.key === "Content-Security-Policy")
          .map((header) => header.value),
      ) ?? []
    );
  } finally {
    if (previousUrl === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    else process.env.NEXT_PUBLIC_SUPABASE_URL = previousUrl;
    if (previousNodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = previousNodeEnv;
  }
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
  const validateStart = workflow.indexOf("  validate:\n");
  assert.notEqual(validateStart, -1);

  const remainingJobs = workflow.slice(validateStart + "  validate:\n".length);
  const nextJobOffset = remainingJobs.search(/^  [a-zA-Z0-9_-]+:\s*$/m);
  const validateJob = workflow.slice(
    validateStart,
    nextJobOffset === -1 ? workflow.length : validateStart + "  validate:\n".length + nextJobOffset,
  );

  assert.match(validateJob, /permissions:\s*\n\s*contents:\s*read/);
  assert.match(validateJob, /npm run security:setup/);
  assert.match(validateJob, /npm run secrets:scan/);
  assert.match(validateJob, /npm run audit:deps/);
});

test("Supabase push scripts execute from the verified repository root", async () => {
  const scripts = await Promise.all([
    readSource("../scripts/push-supabase-migrations.sh"),
    readSource("../scripts/push-supabase-auth-config.sh"),
  ]);

  for (const source of scripts) {
    const changeDirectoryIndex = source.indexOf('cd "${repo_root}"');
    const pushIndex = source.indexOf("supabase ");
    assert.notEqual(changeDirectoryIndex, -1);
    assert.ok(changeDirectoryIndex < pushIndex);
  }
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

test("CSP permits the consent-gated Google Analytics transport", async () => {
  const config = await readSource("../next.config.ts");

  assert.match(config, /scriptSources\.push\("https:\/\/www\.googletagmanager\.com"\)/);
  assert.match(
    config,
    /connect-src[^\n]*https:\/\/www\.google-analytics\.com[^\n]*https:\/\/\*\.google-analytics\.com/,
  );
});

test("connect CSP is scoped to the configured Supabase project", async () => {
  const policies = await getContentSecurityPolicies("https://audit-project.supabase.co", "production");

  assert.ok(policies.length > 0);
  for (const policy of policies) {
    const connectDirective = policy.split("; ").find((directive) => directive.startsWith("connect-src"));
    assert.match(connectDirective ?? "", /https:\/\/audit-project\.supabase\.co/);
    assert.match(connectDirective ?? "", /wss:\/\/audit-project\.supabase\.co/);
    assert.doesNotMatch(connectDirective ?? "", /\*\.supabase\.(co|in)/);
  }
});

test("development CSP permits the local Supabase HTTP and websocket origins", async () => {
  const { getSupabaseConnectSources } = await import("../next.config.ts");

  assert.deepEqual(getSupabaseConnectSources("http://127.0.0.1:54321", "development"), [
    "http://127.0.0.1:54321",
    "ws://127.0.0.1:54321",
  ]);
  assert.deepEqual(getSupabaseConnectSources("http://127.0.0.1:54321", "production"), []);
});

test("Umami origin is allowlisted only for valid https hosts", async () => {
  const { getUmamiOrigin } = await import("../next.config.ts");

  assert.equal(getUmamiOrigin("https://analytics.example.com"), null);
  // Trailing paths must not leak into the CSP directive.
  assert.equal(
    getUmamiOrigin("https://analytics.187.124.55.36.sslip.io/"),
    "https://analytics.187.124.55.36.sslip.io",
  );
  // A plaintext or malformed host would weaken the policy, so it is dropped.
  assert.equal(getUmamiOrigin("http://analytics.example.com"), null);
  assert.equal(getUmamiOrigin("not-a-url"), null);
  assert.equal(getUmamiOrigin(undefined), null);
});

test("Umami accepts only the personal host and exposes canonical domains", async () => {
  const {
    PERSONAL_UMAMI_HOST,
    SUPERENTRENADOR_UMAMI_DOMAINS,
    resolvePersonalUmamiConfig,
  } = await import("../src/lib/umami-config.ts");

  assert.deepEqual(
    resolvePersonalUmamiConfig({
      hostUrl: `${PERSONAL_UMAMI_HOST}/`,
      websiteId: "superentrenador-test-id",
    }),
    {
      hostUrl: PERSONAL_UMAMI_HOST,
      websiteId: "superentrenador-test-id",
    },
  );
  assert.equal(
    resolvePersonalUmamiConfig({
      hostUrl: "https://analytics.2.24.10.239.sslip.io",
      websiteId: "superentrenador-test-id",
    }),
    null,
  );
  assert.equal(
    resolvePersonalUmamiConfig({
      hostUrl: PERSONAL_UMAMI_HOST,
      websiteId: "",
    }),
    null,
  );
  assert.equal(
    SUPERENTRENADOR_UMAMI_DOMAINS,
    "superentrenador.com,www.superentrenador.com",
  );
});

test("README describes the implemented auth and private surfaces", async () => {
  const readme = await readSource("../README.md");

  assert.doesNotMatch(readme, /Placeholder limpio para login y zona privada futura/);
  assert.doesNotMatch(readme, /sustituir mocks por consultas reales a Supabase/);
  assert.match(readme, /Supabase Auth/);
  assert.match(readme, /panel de administración/i);
});
