#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import path from "node:path";

const EXPECTED_PROJECT_REF = "qxugymzyvtbxeyqcvtgk";

function parseArguments(argv) {
  let workdir = process.cwd();
  let requireLinked = false;

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];

    if (argument === "--require-linked") {
      requireLinked = true;
      continue;
    }

    if (argument === "--workdir") {
      const value = argv[index + 1];
      if (!value) {
        throw new Error("--workdir requires a path");
      }
      workdir = path.resolve(value);
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${argument}`);
  }

  return { requireLinked, workdir };
}

async function readOptional(filePath) {
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

function extractAppProjectRef(envSource) {
  const match = envSource.match(/^NEXT_PUBLIC_SUPABASE_URL\s*=\s*["']?([^"'\s#]+)["']?\s*(?:#.*)?$/m);
  if (!match) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is missing from .env.local");
  }

  let url;
  try {
    url = new URL(match[1]);
  } catch {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not a valid URL");
  }

  const hostnameMatch = url.hostname.match(/^([a-z0-9]+)\.supabase\.(?:co|in)$/i);
  if (!hostnameMatch) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not a Supabase project URL");
  }

  return hostnameMatch[1];
}

async function verifyProject({ requireLinked, workdir }) {
  const envPath = path.join(workdir, ".env.local");
  const envSource = await readOptional(envPath);
  if (envSource === null) {
    throw new Error(`Missing application environment file: ${envPath}`);
  }

  const appProjectRef = extractAppProjectRef(envSource);
  if (appProjectRef !== EXPECTED_PROJECT_REF) {
    throw new Error(
      `Application Supabase project mismatch: expected ${EXPECTED_PROJECT_REF}, found ${appProjectRef}`,
    );
  }

  const linkedRefPath = path.join(workdir, "supabase", ".temp", "project-ref");
  const linkedRefSource = await readOptional(linkedRefPath);
  const linkedProjectRef = linkedRefSource?.trim() || null;

  if (linkedProjectRef && linkedProjectRef !== EXPECTED_PROJECT_REF) {
    throw new Error(
      `Linked Supabase project mismatch: expected ${EXPECTED_PROJECT_REF}, found ${linkedProjectRef}`,
    );
  }

  if (requireLinked && !linkedProjectRef) {
    throw new Error(
      `No linked Supabase project. Run: supabase link --project-ref ${EXPECTED_PROJECT_REF}`,
    );
  }

  process.stdout.write(`Supabase project verified: ${EXPECTED_PROJECT_REF}\n`);
}

try {
  await verifyProject(parseArguments(process.argv.slice(2)));
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
}
