import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(new URL("../src/components/marketplace-empty-state.tsx", import.meta.url), "utf8");

test("uses a stable contrast class for the empty-state publish CTA", () => {
  assert.match(source, /empty-state-publish-cta/);
  assert.doesNotMatch(source, /text-white transition-colors hover:bg-\[var\(--accent\)\] hover:text-\[#111214\]/);
});
