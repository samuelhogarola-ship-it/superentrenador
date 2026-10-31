import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(new URL("../src/components/hero-search-bar.tsx", import.meta.url), "utf8");
const filtersSource = readFileSync(new URL("../src/components/filters-bar.tsx", import.meta.url), "utf8");

test("lets visitors choose a known city or type any other location", () => {
  assert.match(source, /list="marketplace-city-options"/);
  assert.match(source, /marketplace-city-options/);
  assert.match(source, /value=\{city\.name\}/);
  assert.doesNotMatch(source, /<select[\s\S]*name="city"/);
});

test("keeps category, city and modality in the same visual field system", () => {
  assert.match(source, /const fieldClass/);
  assert.match(source, /const inputClass/);
  assert.match(source, /const selectClass/);
});

test("keeps free city entry available in the results filters", () => {
  assert.match(filtersSource, /list="filter-city-options"/);
  assert.match(filtersSource, /placeholder="Cualquier ciudad"/);
});
