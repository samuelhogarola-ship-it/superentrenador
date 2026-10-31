import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(
  new URL("../src/components/site-footer.tsx", import.meta.url),
  "utf8",
);

test("organizes the footer without mixing marketplace filters and editorial guides", () => {
  assert.match(source, /title: "Marketplace"/);
  assert.match(source, /title: "Biblioteca"/);
  assert.match(source, /title: "Entrenadores"/);
  assert.doesNotMatch(source, /title: "Blog"/);
  assert.doesNotMatch(source, /specialty=Hipertrofia/);
  assert.doesNotMatch(source, /specialty=Pérdida de grasa/);
  assert.doesNotMatch(source, /label: "Publicar perfil"/);
});

test("exposes pricing and the WF Studio maintenance credit", () => {
  assert.match(source, /href: "\/premium", label: "Planes y precios"/);
  assert.match(source, /Desarrollado y mantenido por WF Studio/);
  assert.match(source, /https:\/\/webfuengirola\.com\//);
});
