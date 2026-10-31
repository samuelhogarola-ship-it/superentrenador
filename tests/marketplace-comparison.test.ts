import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { TrainerCard } from "../src/components/trainer-card";
import { TrainerListItem } from "../src/components/trainer-list-item";
import { publicTrainerProfiles } from "../src/lib/marketplace-data";

const heroSearchSource = readFileSync(new URL("../src/components/hero-search-bar.tsx", import.meta.url), "utf8");
const filtersSource = readFileSync(new URL("../src/components/filters-bar.tsx", import.meta.url), "utf8");
const resultsSource = readFileSync(new URL("../src/app/entrenadores/page.tsx", import.meta.url), "utf8");
const repositorySource = readFileSync(new URL("../src/lib/repositories/trainers.ts", import.meta.url), "utf8");

test("home search progressively submits category, city and modality", () => {
  assert.match(heroSearchSource, /params\.set\("category", category\)/);
  assert.match(heroSearchSource, /params\.set\("city", city\.trim\(\)\)/);
  assert.match(heroSearchSource, /params\.set\("modality", modality\)/);
  for (const modality of ["Presencial", "Online", "Híbrido"]) assert.ok(heroSearchSource.includes(`"${modality}"`));
});

test("home search starts with a single progressive entry point", () => {
  assert.match(heroSearchSource, /useState<SearchStep>\("idle"\)/);
  assert.match(heroSearchSource, /¿Qué entrenador necesitas\?/);
  assert.match(heroSearchSource, /const SEARCH_EXAMPLES = \["Tenis", "PT", "Pádel"\]/);
  assert.match(heroSearchSource, /Prueba con/);
});

test("results use honest, lightweight marketplace filters", () => {
  for (const option of ["Cerca de mí", "Presencial", "Online"]) assert.match(filtersSource, new RegExp(`>${option}<`));
  assert.match(filtersSource, /Filtrar por precio máximo/);
  assert.match(filtersSource, /Escribe una ciudad para buscar entrenadores presenciales cerca de ti/);
  assert.match(resultsSource, /Entrenadores disponibles/);
  for (const noisyClaim of ["Contacto protegido", "Perfiles comparables", "Búsqueda por ciudad", "Tiempo de respuesta"]) {
    assert.doesNotMatch(resultsSource, new RegExp(noisyClaim));
  }
});

test("maximum price filters real repository data", () => {
  assert.match(repositorySource, /priceFrom > 0 && trainer\.priceFrom <= filters\.maxPrice/);
  assert.match(repositorySource, /\.gt\("price_from", 0\)\.lte\("price_from", filters\.maxPrice\)/);
});

for (const Component of [TrainerCard, TrainerListItem]) {
  test(`${Component.name} does not invent response times or consultation offers`, () => {
    const html = renderToStaticMarkup(createElement(Component, { trainer: { ...publicTrainerProfiles[0], verified: true } }));
    assert.doesNotMatch(html, /Responde en el día|Primera consulta/);
  });
  test(`${Component.name} shows an unavailable price honestly and preserves hourly units`, () => {
    const unknown = renderToStaticMarkup(createElement(Component, { trainer: { ...publicTrainerProfiles[0], priceFrom: 0 } }));
    assert.match(unknown, /Consultar precio/);
    const hourly = renderToStaticMarkup(createElement(Component, { trainer: { ...publicTrainerProfiles[0], priceFrom: 35, priceUnit: "hora" } }));
    assert.match(hourly, /35€/);
    assert.match(hourly, /hora/);
  });
}
