import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("category marquee keeps the marketplace background uniform at both edges", async () => {
  const css = await readFile(new URL("../src/app/globals.css", import.meta.url), "utf8");
  const marqueeRule = css.match(/\.category-marquee\s*\{([^}]*)\}/)?.[1] ?? "";

  assert.doesNotMatch(marqueeRule, /mask-image\s*:/);
});
