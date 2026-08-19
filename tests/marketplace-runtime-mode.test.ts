import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function readSource(path: string) {
  return readFile(new URL(path, import.meta.url), "utf8");
}

test("home gets featured trainers through the repository", async () => {
  const source = await readSource("../src/app/page.tsx");

  assert.match(source, /listFeaturedTrainerProfiles\(\)/);
  assert.doesNotMatch(source, /trainersToShow\s*=\s*publicTrainerProfiles/);
});

test("database-backed public indexes render at request time", async () => {
  const [home, andalucia, sitemap] = await Promise.all([
    readSource("../src/app/page.tsx"),
    readSource("../src/app/andalucia/page.tsx"),
    readSource("../src/app/sitemap.ts"),
  ]);

  for (const source of [home, andalucia, sitemap]) {
    assert.match(source, /export const dynamic = ["']force-dynamic["']/);
  }
});

test("home renders the marketplace empty state when production has no profiles", async () => {
  const source = await readSource("../src/app/page.tsx");

  assert.match(source, /MarketplaceEmptyState/);
  assert.match(source, /trainersToShow\.length\s*>\s*0/);
});

test("production profile lookup never falls back to a static model profile", async () => {
  const source = await readSource("../src/lib/repositories/trainers.ts");

  assert.doesNotMatch(source, /staticProfile\.reviewStatus\s*===\s*"approved"/);
  assert.match(source, /isMarketplaceDemoMode\(\)[\s\S]*publicTrainerProfiles\.find/);
});

test("local seed contains only the explicit Samuel demo profile", async () => {
  const seed = await readSource("../supabase/seed.sql");

  assert.match(seed, /samuel-entrenador-personal-fuengirola/);
  assert.match(seed, /'samuel-entrenador-personal-fuengirola'[\s\S]*true/);
  assert.doesNotMatch(seed, /carlos-ruiz-entrenador-personal-fuengirola/);
  assert.doesNotMatch(seed, /laura-moreno-fitness-malaga/);
  assert.doesNotMatch(seed, /sergio-navarro-rendimiento-madrid/);
  assert.match(seed, /DELETE FROM public\.trainer_profiles[\s\S]*is_demo = true/);
});

test("generated database types include rate_limit_buckets", async () => {
  const types = await readSource("../src/lib/supabase/database.types.ts");
  assert.match(types, /rate_limit_buckets:\s*\{/);
});

test("configured Supabase city reads do not merge static fallback data", async () => {
  const source = await readSource("../src/lib/repositories/trainers.ts");

  assert.doesNotMatch(source, /mergeCitiesWithFallback/);
  assert.match(source, /listMarketplaceCities failed[\s\S]*return \[\]/);
  assert.match(source, /getMarketplaceCity failed[\s\S]*return null/);
  assert.doesNotMatch(source, /Math\.max\(citiesCountRes\.count/);
});
