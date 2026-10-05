#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

export const EXPECTED_SUPABASE_PROJECT_REF = "qxugymzyvtbxeyqcvtgk";

const managementApiUrl =
  `https://api.supabase.com/v1/projects/${EXPECTED_SUPABASE_PROJECT_REF}/config/auth`;
const tokenHashHref =
  "{{ .RedirectTo }}&amp;token_hash={{ .TokenHash }}&amp;type=email";

function validateTokenHashTemplate(name, content) {
  const activeHtml = content.replace(/<!--[\s\S]*?-->/g, "");
  const anchors = [...activeHtml.matchAll(/<a\b[^>]*>/gi)].map((match) => match[0]);
  const closingAnchors = activeHtml.match(/<\/a\s*>/gi) ?? [];
  const anchor = anchors[0] ?? "";
  const hrefCount = (anchor.match(/\bhref\s*=/gi) ?? []).length;
  const href = anchor.match(/\bhref\s*=\s*(["'])(.*?)\1/i)?.[2];
  const remainingGoTemplate = content
    .replaceAll("{{ .RedirectTo }}", "")
    .replaceAll("{{ .TokenHash }}", "");

  if (
    content.includes("<!--") ||
    content.includes("-->") ||
    anchors.length !== 1 ||
    closingAnchors.length !== 1 ||
    hrefCount !== 1 ||
    href !== tokenHashHref ||
    remainingGoTemplate.includes("{{") ||
    remainingGoTemplate.includes("}}")
  ) {
    throw new Error(`${name} template has an invalid TokenHash link`);
  }
}

export function buildEmailTemplatePatch({ confirmationTemplate, magicLinkTemplate }) {
  validateTokenHashTemplate("confirmation", confirmationTemplate);
  validateTokenHashTemplate("magic link", magicLinkTemplate);

  return {
    mailer_subjects_confirmation: "Confirma tu cuenta en Super Entrenador",
    mailer_templates_confirmation_content: confirmationTemplate,
    mailer_subjects_magic_link: "Tu enlace de acceso a Super Entrenador",
    mailer_templates_magic_link_content: magicLinkTemplate,
  };
}

export async function pushEmailTemplates({
  accessToken,
  confirmationTemplate,
  magicLinkTemplate,
  fetchImpl = fetch,
}) {
  const normalizedAccessToken = accessToken.trim();

  if (!normalizedAccessToken) {
    throw new Error("SUPABASE_ACCESS_TOKEN is required");
  }

  const response = await fetchImpl(managementApiUrl, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${normalizedAccessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(buildEmailTemplatePatch({ confirmationTemplate, magicLinkTemplate })),
  });

  if (!response.ok) {
    const detail = (await response.text())
      .trim()
      .replaceAll(normalizedAccessToken, "[REDACTED]");
    throw new Error(
      `Supabase email template update failed (${response.status})${detail ? `: ${detail}` : ""}`,
    );
  }
}

async function main() {
  const confirmationTemplate = await readFile(
    new URL("../supabase/templates/confirmation.html", import.meta.url),
    "utf8",
  );
  const magicLinkTemplate = await readFile(
    new URL("../supabase/templates/magic-link.html", import.meta.url),
    "utf8",
  );

  await pushEmailTemplates({
    accessToken: process.env.SUPABASE_ACCESS_TOKEN ?? "",
    confirmationTemplate,
    magicLinkTemplate,
  });

  process.stdout.write(
    `Supabase email templates updated for ${EXPECTED_SUPABASE_PROJECT_REF}\n`,
  );
}

const entrypoint = process.argv[1]
  ? pathToFileURL(resolve(process.argv[1])).href
  : null;

if (entrypoint === import.meta.url) {
  main().catch((error) => {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`${message}\n`);
    process.exitCode = 1;
  });
}
