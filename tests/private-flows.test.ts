import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function readSource(path: string) {
  return readFile(new URL(path, import.meta.url), "utf8");
}

test("profile API accepts only trainer-owned Supabase photo URLs", async () => {
  const source = await readSource("../src/app/api/own-trainer-profile/route.ts");
  assert.match(source, /getTrainerPhotoStoragePath\([\s\S]*photoUrl,[\s\S]*user\.id/);
});

test("photo upload does not accept arbitrary external URLs", async () => {
  const source = await readSource("../src/components/photo-upload.tsx");
  assert.doesNotMatch(source, /O pega una URL directa/);
  assert.doesNotMatch(source, /placeholder="https:\/\/ejemplo\.com/);
  assert.match(source, /const path = `\$\{userId\}\/profile`/);
});

test("profile save and deletion remove stale managed photo objects", async () => {
  const [profileRoute, deleteAction] = await Promise.all([
    readSource("../src/app/api/own-trainer-profile/route.ts"),
    readSource("../src/app/mis-anuncios/actions.ts"),
  ]);

  assert.match(profileRoute, /getTrainerPhotoCleanupPaths\(user\.id, newPhotoPath\)/);
  assert.match(profileRoute, /from\("trainer-photos"\)[\s\S]*remove\(stalePhotoPaths\)/);
  assert.match(deleteAction, /getTrainerPhotoCleanupPaths\(user\.id\)/);
  assert.match(deleteAction, /from\("trainer-photos"\)[\s\S]*remove\(photoPaths\)/);
});

test("profile changes revalidate both old and new public routes", async () => {
  const source = await readSource("../src/app/api/own-trainer-profile/route.ts");
  const revalidationHelper =
    source.match(/function revalidatePublicTrainerPaths[\s\S]*?\n}\n\nexport async function POST/)?.[0] ?? "";

  assert.match(
    source,
    /from\("trainer_profiles"\)[\s\S]*select\("slug, city_slug"\)[\s\S]*eq\("user_id", user\.id\)[\s\S]*maybeSingle\(\)/,
  );
  assert.match(
    source,
    /revalidatePublicTrainerPaths\([\s\S]*existingProfile\?\.slug[\s\S]*data\.slug[\s\S]*existingProfile\?\.city_slug[\s\S]*citySlug/,
  );
  assert.doesNotMatch(revalidationHelper, /supabase|from\("cities"\)/);
});

test("profile deletion and trainer moderation require a confirmed email", async () => {
  const [deleteAction, reviewAction] = await Promise.all([
    readSource("../src/app/mis-anuncios/actions.ts"),
    readSource("../src/app/admin/entrenadores/actions.ts"),
  ]);

  assert.match(deleteAction, /hasVerifiedEmail\(user\)/);
  assert.match(reviewAction, /hasVerifiedEmail\(user\)/);
});

test("profile deletion compensates failures and confirms the deleted row", async () => {
  const source = await readSource("../src/app/mis-anuncios/actions.ts");
  const prepareIndex = source.indexOf("photo_url: null");
  const databaseDeleteIndex = source.indexOf(".delete()");
  const storageRemoveIndex = source.indexOf(".remove(photoPaths)");

  assert.notEqual(prepareIndex, -1);
  assert.notEqual(databaseDeleteIndex, -1);
  assert.notEqual(storageRemoveIndex, -1);
  assert.ok(prepareIndex < storageRemoveIndex);
  assert.ok(storageRemoveIndex < databaseDeleteIndex);
  assert.match(source, /\.delete\(\)[\s\S]*\.select\("id"\)[\s\S]*\.maybeSingle\(\)/);
  assert.match(source, /if \(deleteError \|\| !deletedProfile\)/);
  assert.match(source, /select\("id, slug, city_slug, photo_url, is_published, review_status"\)/);
  assert.match(
    source,
    /if \(photoError\)[\s\S]*photo_url: existing\.photo_url[\s\S]*is_published: existing\.is_published[\s\S]*review_status: existing\.review_status/,
  );
  assert.match(source, /if \(photoError\)[\s\S]*getSupabaseAdminClient\(\)/);
  assert.match(
    source,
    /\.is\("photo_url", null\)[\s\S]*\.eq\("is_published", false\)[\s\S]*\.eq\("review_status", "pending"\)/,
  );
  assert.match(
    source,
    /select\("photo_url, is_published, review_status"\)[\s\S]*restoredProfile\.photo_url !== existing\.photo_url[\s\S]*restoredProfile\.is_published !== existing\.is_published[\s\S]*restoredProfile\.review_status !== existing\.review_status/,
  );
});

test("private trainer surfaces only call an approved published profile public", async () => {
  const [ads, dashboard] = await Promise.all([
    readSource("../src/app/mis-anuncios/page.tsx"),
    readSource("../src/app/dashboard/page.tsx"),
  ]);

  assert.match(ads, /canViewPublic \? "Anuncio en línea" : "Pendiente de publicación"/);
  assert.match(dashboard, /const canViewPublic = profile\.is_published && status === "approved"/);
  assert.match(dashboard, /canViewPublic[\s\S]*Tu perfil está visible en el marketplace/);
});

test("message reloads cannot overwrite state with a stale response", async () => {
  const source = await readSource("../src/app/dashboard/mensajes/page.tsx");

  assert.match(source, /const controller = new AbortController\(\)/);
  assert.match(source, /fetch\("\/api\/messages", \{ signal: controller\.signal \}\)/);
  assert.match(source, /if \(!active\) return/);
  assert.match(source, /return \(\) => \{[\s\S]*active = false[\s\S]*controller\.abort\(\)/);
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
