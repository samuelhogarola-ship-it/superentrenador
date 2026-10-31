import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(
  new URL("../src/components/mobile-bottom-nav.tsx", import.meta.url),
  "utf8",
);

test("keeps the mobile navigation focused on home, search and account access", () => {
  assert.match(source, /label: "Inicio"/);
  assert.match(source, /label: "Buscar"/);
  assert.doesNotMatch(source, /label: "Zonas"/);
  assert.match(source, /grid-cols-3/);
});
