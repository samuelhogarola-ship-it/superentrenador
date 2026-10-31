import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { HeroSearchBar } from "../src/components/hero-search-bar";
import { TrainerCard } from "../src/components/trainer-card";
import { TrainerListItem } from "../src/components/trainer-list-item";
import { publicTrainerProfiles } from "../src/lib/marketplace-data";

test("home search submits modality alongside query and city", () => {
  const html = renderToStaticMarkup(createElement(HeroSearchBar, { categories: ["Yoga"], cities: [] }));
  assert.match(html, /name="q"/);
  assert.match(html, /name="city"/);
  assert.match(html, /name="modality"/);
  for (const modality of ["Presencial", "Online", "Híbrido"]) assert.ok(html.includes(`value="${modality}"`));
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
