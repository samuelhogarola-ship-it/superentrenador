import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative, resolve } from "node:path";
import { createRequire } from "node:module";
import test from "node:test";
import { Linter } from "eslint";

const require = createRequire(import.meta.url);
const { getRootDirs } = require("@next/eslint-plugin-next/dist/utils/get-root-dirs");

test("Next lint root discovery keeps default cwd, literal roots, arrays and missing roots", () => {
  const root = mkdtempSync(join(tmpdir(), "next-lint-roots-"));
  try {
    for (const name of ["app-one", "app-two", ".hidden"]) mkdirSync(join(root, name));
    writeFileSync(join(root, "not-a-directory"), "fixture");
    const discover = (rootDir?: unknown) => getRootDirs({ cwd: root, settings: { next: { rootDir } } }).map((dir: string) => resolve(dir)).sort();
    assert.deepEqual(discover(), [root]);
    assert.deepEqual(discover(join(root, "app-one")), [join(root, "app-one")]);
    assert.deepEqual(discover(relative(process.cwd(), join(root, "app-one"))), [join(root, "app-one")]);
    assert.deepEqual(discover(join(root, "app-one").replaceAll("/", "\\")), [join(root, "app-one")]);
    assert.throws(() => discover(join(root, "*")), /Glob patterns.*unsupported/);
    assert.throws(() => discover(join(root, "{app-one,app-two}")), /Glob patterns.*unsupported/);
    assert.deepEqual(discover([join(root, "app-one"), join(root, "app-two"), null]), [join(root, "app-one"), join(root, "app-two")]);
    assert.deepEqual(discover(join(root, "missing")), []);
    assert.deepEqual(discover(join(root, "not-a-directory")), []);
    symlinkSync(join(root, "app-one"), join(root, "linked-app"), "dir");
    assert.deepEqual(discover(join(root, "linked-app")), [join(root, "linked-app")]);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});


test("Next still rejects internal HTML links when roots use literal paths or Windows separators", () => {
  const root = mkdtempSync(join(tmpdir(), "next-lint-rule-"));
  try {
    const appRoot = join(root, "app-one");
    mkdirSync(join(appRoot, "pages"), { recursive: true });
    writeFileSync(join(appRoot, "pages", "about.tsx"), "export default function About() {}");
    mkdirSync(join(appRoot, "fixtures", "pages"), { recursive: true });
    writeFileSync(join(appRoot, "fixtures", "pages", "fixture-only.tsx"), "fixture");
    const plugin = require("@next/eslint-plugin-next");
    const linter = new Linter();
    for (const rootDir of [appRoot, relative(process.cwd(), appRoot), appRoot.replaceAll("/", "\\")]) {
      const config = {
        languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
        plugins: { next: plugin },
        settings: { next: { rootDir } },
        rules: { "next/no-html-link-for-pages": "error" as const },
      };
      const invalid = linter.verify('const link = <a href="/about">About</a>', config);
      assert.equal(invalid.length, 1);
      assert.equal(invalid[0].ruleId, "next/no-html-link-for-pages");
      assert.deepEqual(linter.verify('const link = <a href="https://example.com">External</a>', config), []);
      assert.deepEqual(linter.verify('const link = <a href="/fixture-only">Not an app page</a>', config), []);
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});


test("Next root discovery also resolves absolute roots inside cwd", () => {
  const root = mkdtempSync(join(process.cwd(), ".lint-root-fixture-"));
  try {
    mkdirSync(join(root, "nested", "pages"), { recursive: true });
    const found = getRootDirs({ cwd: process.cwd(), settings: { next: { rootDir: root } } });
    assert.deepEqual(found.map((dir: string) => resolve(dir)), [root]);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
