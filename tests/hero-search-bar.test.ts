import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(new URL("../src/components/hero-search-bar.tsx", import.meta.url), "utf8");
const filtersSource = readFileSync(new URL("../src/components/filters-bar.tsx", import.meta.url), "utf8");

test("lets visitors choose a known city or type any other location", () => {
  assert.match(source, /list="hero-city-options"/);
  assert.match(source, /id="hero-city-options"/);
  assert.match(source, /value=\{item\.name\}/);
  assert.doesNotMatch(source, /<select[\s\S]*name="city"/);
});

test("keeps category, city and modality in one progressive search flow", () => {
  assert.match(source, /type SearchStep = "idle" \| "category" \| "city" \| "modality"/);
  assert.match(source, /setStep\("city"\)/);
  assert.match(source, /setStep\("modality"\)/);
  assert.match(source, /role="search"/);
});

test("builds category suggestions from the supplied data", () => {
  assert.match(source, /categories\.filter/);
  assert.match(source, /visibleCategories\.map/);
  assert.doesNotMatch(source, /const CATEGORIES/);
});

test("keeps free city entry available in the results filters", () => {
  assert.match(filtersSource, /list="filter-city-options"/);
  assert.match(filtersSource, /placeholder="Cualquier ciudad"/);
});
