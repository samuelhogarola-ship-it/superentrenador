import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const scriptPath = fileURLToPath(new URL("../scripts/verify-supabase-project.mjs", import.meta.url));
const expectedRef = "qxugymzyvtbxeyqcvtgk";

async function createProjectFixture(linkedRef?: string) {
  const workdir = await mkdtemp(path.join(tmpdir(), "super-entrenador-supabase-"));
  await writeFile(
    path.join(workdir, ".env.local"),
    `NEXT_PUBLIC_SUPABASE_URL=https://${expectedRef}.supabase.co\n`,
  );

  if (linkedRef) {
    const tempDir = path.join(workdir, "supabase", ".temp");
    await mkdir(tempDir, { recursive: true });
    await writeFile(path.join(tempDir, "project-ref"), linkedRef);
  }

  return workdir;
}

function runGuard(workdir: string, ...args: string[]) {
  return spawnSync(process.execPath, [scriptPath, "--workdir", workdir, ...args], {
    encoding: "utf8",
  });
}

test("allows remote operations when app and linked project refs match", async (t) => {
  const workdir = await createProjectFixture(expectedRef);
  t.after(() => rm(workdir, { recursive: true, force: true }));

  const result = runGuard(workdir, "--require-linked");

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Supabase project verified/);
});

test("rejects a linked project that differs from the application project", async (t) => {
  const workdir = await createProjectFixture("tiynnllrcdhsvrzsdsct");
  t.after(() => rm(workdir, { recursive: true, force: true }));

  const result = runGuard(workdir, "--require-linked");

  assert.equal(result.status, 1);
  assert.match(result.stderr, /Linked Supabase project mismatch/);
});

test("rejects an application environment that targets another project", async (t) => {
  const workdir = await createProjectFixture(expectedRef);
  t.after(() => rm(workdir, { recursive: true, force: true }));
  await writeFile(
    path.join(workdir, ".env.local"),
    "NEXT_PUBLIC_SUPABASE_URL=https://differentproject.supabase.co\n",
  );

  const result = runGuard(workdir, "--require-linked");

  assert.equal(result.status, 1);
  assert.match(result.stderr, /Application Supabase project mismatch/);
});

test("rejects database pushes when the project is not linked", async (t) => {
  const workdir = await createProjectFixture();
  t.after(() => rm(workdir, { recursive: true, force: true }));

  const result = runGuard(workdir, "--require-linked");

  assert.equal(result.status, 1);
  assert.match(result.stderr, /No linked Supabase project/);
});
