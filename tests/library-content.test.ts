import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function readSource(path: string) {
  return readFile(new URL(path, import.meta.url), "utf8");
}

test("library separates guides, routines, recipes and community without claiming unfinished modules", async () => {
  const page = await readSource("../src/app/biblioteca/page.tsx");
  assert.match(page, /title: "Guías"/);
  assert.match(page, /title: "Rutinas"/);
  assert.match(page, /title: "Recetas"/);
  assert.match(page, /title: "Comunidad"/);
  assert.match(page, /En preparación/);
  assert.match(page, /Próximamente/);
  assert.match(page, /Edición y sistema de contenidos gestionados con WF Studio/);
});

test("WF-Blogger integration stays server-only and publishes only approved content", async () => {
  const [adapter, endpoint, env] = await Promise.all([
    readSource("../src/lib/wf-blogger.ts"),
    readSource("../src/app/api/wf-blogger/publish/route.ts"),
    readSource("../.env.example"),
  ]);
  assert.match(adapter, /import "server-only"/);
  assert.match(adapter, /meta\.status !== "published"/);
  assert.match(adapter, /path\.join\(contentRoot\(\), "blog-posts"\)/);
  assert.match(endpoint, /timingSafeEqual/);
  assert.match(endpoint, /payload\?\.siteKey !== "superentrenador"/);
  assert.match(env, /^WF_BLOGGER_ROOT=/m);
  assert.match(env, /^WF_BLOGGER_BUILD_SECRET=/m);
  assert.doesNotMatch(adapter, /dangerouslySetInnerHTML/);
});

test("community incentives are specified as moderated credits instead of automatic discounts", async () => {
  const spec = await readSource("../docs/community-and-library-product-spec.md");
  assert.match(spec, /créditos mensuales revisables del 5 %, 10 % o 15 %/);
  assert.match(spec, /nunca una modificación inmediata de la suscripción/);
  assert.match(spec, /El primer respondedor puede recibir más puntos/);
  assert.match(spec, /respuesta posterior aceptada debe valer más que la mera rapidez/);
  assert.match(spec, /alias público único, moderado y separado de su nombre comercial/);
});

test("pricing uses intent labels and keeps student and trainer plans in separate panels", async () => {
  const [switcher, page] = await Promise.all([
    readSource("../src/components/plan-audience-switcher.tsx"),
    readSource("../src/app/premium/page.tsx"),
  ]);
  assert.match(switcher, /Quiero entrenar/);
  assert.match(switcher, /Soy entrenador/);
  assert.match(switcher, /role="tablist"/);
  assert.match(page, /STUDENT_PLANS/);
  assert.match(page, /TRAINER_PLANS/);
  assert.match(page, /id: "entrenador-gratis"/);
});
