import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const page = readFileSync(new URL("../src/app/page.tsx", import.meta.url), "utf8");
const header = readFileSync(new URL("../src/components/site-header.tsx", import.meta.url), "utf8");
const auth = readFileSync(new URL("../src/lib/auth.ts", import.meta.url), "utf8");

test("keeps the homepage hero compact and focused on progressive search", () => {
  assert.match(page, /Encuentra tu entrenador ideal/);
  assert.doesNotMatch(page, /Entrenamiento para todos los niveles/);
  assert.doesNotMatch(page, /CategoryMarquee/);
  for (const category of ["Entrenador personal", "Tenis", "Pádel", "Fútbol", "Boxeo", "Pilates"]) {
    assert.ok(page.includes(category));
  }
});

test("keeps the public header limited to brand and account actions", () => {
  assert.doesNotMatch(header, />Buscar entrenador</);
  assert.doesNotMatch(header, />Guías</);
  assert.doesNotMatch(header, />Cómo funciona</);
  assert.match(header, /Publica tu anuncio/);
  assert.match(header, /Iniciar sesión/);
});

test("keeps the public header usable in local preview without Supabase credentials", () => {
  assert.match(auth, /if \(!hasSupabaseEnv\(\)\)/);
  assert.match(auth, /useState\(\(\) => !hasSupabaseEnv\(\)\)/);
});
