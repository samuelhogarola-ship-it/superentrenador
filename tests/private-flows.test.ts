import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function readSource(path: string) {
  return readFile(new URL(path, import.meta.url), "utf8");
}

test("profile API accepts only trainer-owned Supabase photo URLs", async () => {
  const source = await readSource("../src/app/api/own-trainer-profile/route.ts");
  assert.match(source, /getTrainerPhotoStoragePath\(photoUrl, user\.id/);
});

test("photo upload does not accept arbitrary external URLs", async () => {
  const source = await readSource("../src/components/photo-upload.tsx");
  assert.doesNotMatch(source, /O pega una URL directa/);
  assert.doesNotMatch(source, /placeholder="https:\/\/ejemplo\.com/);
});

test("deleting a trainer profile removes its owned storage photo", async () => {
  const source = await readSource("../src/app/mis-anuncios/actions.ts");
  assert.match(source, /select\("id, slug, city_slug, photo_url"\)/);
  assert.match(source, /storage[\s\S]*from\("trainer-photos"\)[\s\S]*remove\(\[photoPath\]\)/);
});

test("unpublished ads do not link to a missing public page", async () => {
  const source = await readSource("../src/app/mis-anuncios/page.tsx");
  assert.match(source, /trainerProfile\.is_published\s*&&\s*trainerProfile\.review_status\s*===\s*"approved"/);
});

test("messages page distinguishes load errors from an empty inbox", async () => {
  const source = await readSource("../src/app/dashboard/mensajes/page.tsx");
  assert.match(source, /const \[loadError, setLoadError\]/);
  assert.match(source, /setReloadToken\(\(token\) => token \+ 1\)/);
  assert.match(source, /No se pudieron cargar los mensajes/);
  assert.match(source, /const response = await fetch\("\/api\/messages", \{[\s\S]*method: "PATCH"[\s\S]*if \(!response\.ok\)/);
});

test("manual premium access is noindex and absent from the sitemap", async () => {
  const [page, sitemap] = await Promise.all([
    readSource("../src/app/premium/page.tsx"),
    readSource("../src/app/sitemap.ts"),
  ]);
  assert.match(page, /robots:\s*\{\s*index:\s*false,\s*follow:\s*false\s*\}/);
  assert.doesNotMatch(sitemap, /siteConfig\.url\}\/premium/);
});

test("private panels do not present placeholder metrics or unsupported conversion claims", async () => {
  const [dashboard, ads, premium] = await Promise.all([
    readSource("../src/app/dashboard/page.tsx"),
    readSource("../src/app/mis-anuncios/page.tsx"),
    readSource("../src/app/premium/page.tsx"),
  ]);

  assert.doesNotMatch(dashboard, /Clases realizadas \(próximamente\)/);
  assert.doesNotMatch(dashboard, /Perfil verificado/);
  assert.doesNotMatch(ads, /Apariciones en búsquedas \(próximamente\)/);
  assert.doesNotMatch(ads, /Visitas al anuncio \(próximamente\)/);
  assert.doesNotMatch(premium, /hasta 3× más contactos/);
});
