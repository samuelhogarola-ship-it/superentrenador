import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(new URL("../src/app/page.tsx", import.meta.url), "utf8");

test("places the trainer signup CTA after the featured profiles section", () => {
  const featuredSection = source.indexOf('className="bg-white px-5 py-16');
  const trainerCta = source.indexOf('aria-label="Inscripción de entrenadores"');

  assert.notEqual(featuredSection, -1);
  assert.notEqual(trainerCta, -1);
  assert.ok(trainerCta > featuredSection);
  assert.match(
    source,
    /<\/section>\s*<section\s+aria-label="Inscripción de entrenadores"/,
  );
  assert.match(source, /href="\/registro\?intent=trainer"/);
  assert.match(source, /¿Eres entrenador\?/);
  assert.match(source, /Inscríbete/);
});
