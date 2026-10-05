import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  buildEmailTemplatePatch,
  pushEmailTemplates,
} from "../scripts/push-supabase-email-templates.mjs";

const confirmationTemplate = `
  <a href="{{ .RedirectTo }}&amp;token_hash={{ .TokenHash }}&amp;type=email">
    Confirmar cuenta
  </a>
`;

const magicLinkTemplate = `
  <a href="{{ .RedirectTo }}&amp;token_hash={{ .TokenHash }}&amp;type=email">
    Acceder
  </a>
`;

test("builds TokenHash templates without enabling the separate recovery flow", () => {
  const payload = buildEmailTemplatePatch({ confirmationTemplate, magicLinkTemplate });

  assert.deepEqual(payload, {
    mailer_subjects_confirmation: "Confirma tu cuenta en Super Entrenador",
    mailer_templates_confirmation_content: confirmationTemplate,
    mailer_subjects_magic_link: "Tu enlace de acceso a Super Entrenador",
    mailer_templates_magic_link_content: magicLinkTemplate,
  });

  const serialized = JSON.stringify(payload);
  assert.match(serialized, /token_hash=\{\{ \.TokenHash \}\}/);
  assert.doesNotMatch(serialized, /ConfirmationURL|mailer_templates_recovery/);
});

test("accepts the versioned templates and rejects a different email flow", async () => {
  const [actualConfirmation, actualMagicLink] = await Promise.all([
    readFile(new URL("../supabase/templates/confirmation.html", import.meta.url), "utf8"),
    readFile(new URL("../supabase/templates/magic-link.html", import.meta.url), "utf8"),
  ]);

  assert.doesNotThrow(() =>
    buildEmailTemplatePatch({
      confirmationTemplate: actualConfirmation,
      magicLinkTemplate: actualMagicLink,
    }),
  );
  assert.throws(
    () =>
      buildEmailTemplatePatch({
        confirmationTemplate: confirmationTemplate.replace("type=email", "type=email_change"),
        magicLinkTemplate,
      }),
    /confirmation template has an invalid TokenHash link/,
  );

  for (const invalidTemplate of [
    `<!-- ${confirmationTemplate} -->`,
    `<!-- ${confirmationTemplate}`,
    confirmationTemplate.replace("href=", 'href="https://evil.example" href='),
    `${confirmationTemplate}\n{{`,
  ]) {
    assert.throws(
      () =>
        buildEmailTemplatePatch({
          confirmationTemplate: invalidTemplate,
          magicLinkTemplate,
        }),
      /confirmation template has an invalid TokenHash link/,
    );
  }
});

test("patches only the guarded Super Entrenador project", async () => {
  const requests: Array<{ url: string; init?: RequestInit }> = [];
  const fetchImpl: typeof fetch = async (input, init) => {
    requests.push({ url: String(input), init });
    return new Response("{}", { status: 200, headers: { "Content-Type": "application/json" } });
  };

  await pushEmailTemplates({
    accessToken: "test-management-token",
    confirmationTemplate,
    magicLinkTemplate,
    fetchImpl,
  });

  assert.equal(requests.length, 1);
  assert.equal(
    requests[0]?.url,
    "https://api.supabase.com/v1/projects/qxugymzyvtbxeyqcvtgk/config/auth",
  );
  assert.equal(requests[0]?.init?.method, "PATCH");
  assert.equal(
    new Headers(requests[0]?.init?.headers).get("Authorization"),
    "Bearer test-management-token",
  );
  assert.deepEqual(
    JSON.parse(String(requests[0]?.init?.body)),
    buildEmailTemplatePatch({ confirmationTemplate, magicLinkTemplate }),
  );
});

test("refuses to contact Supabase without a management token", async () => {
  let contacted = false;
  const fetchImpl: typeof fetch = async () => {
    contacted = true;
    return new Response("{}", { status: 200 });
  };

  await assert.rejects(
    pushEmailTemplates({
      accessToken: "",
      confirmationTemplate,
      magicLinkTemplate,
      fetchImpl,
    }),
    /SUPABASE_ACCESS_TOKEN is required/,
  );
  assert.equal(contacted, false);
});

test("redacts the management token from Supabase error responses", async () => {
  const fetchImpl: typeof fetch = async () =>
    new Response("request rejected for Bearer private-management-token", { status: 403 });

  await assert.rejects(
    pushEmailTemplates({
      accessToken: "private-management-token",
      confirmationTemplate,
      magicLinkTemplate,
      fetchImpl,
    }),
    (error: unknown) => {
      assert.ok(error instanceof Error);
      assert.match(error.message, /Supabase email template update failed \(403\)/);
      assert.doesNotMatch(error.message, /private-management-token/);
      return true;
    },
  );
});

test("normalizes the management token before sending and redacting it", async () => {
  let authorization: string | null = null;
  const fetchImpl: typeof fetch = async (_input, init) => {
    authorization = new Headers(init?.headers).get("Authorization");
    return new Response("request rejected for private-management-token", { status: 403 });
  };

  await assert.rejects(
    pushEmailTemplates({
      accessToken: " private-management-token ",
      confirmationTemplate,
      magicLinkTemplate,
      fetchImpl,
    }),
    (error: unknown) => {
      assert.ok(error instanceof Error);
      assert.doesNotMatch(error.message, /private-management-token/);
      return true;
    },
  );
  assert.equal(authorization, "Bearer private-management-token");
});
