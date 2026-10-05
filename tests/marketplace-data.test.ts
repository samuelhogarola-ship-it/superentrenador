import assert from "node:assert/strict";
import test from "node:test";
import { publicTrainerProfiles } from "../src/lib/marketplace-data";

test("exposes only the Samuel Irongar Viking Fitness model profile", () => {
  assert.equal(publicTrainerProfiles.length, 1);

  const [profile] = publicTrainerProfiles;
  assert.equal(profile.displayName, "Samuel Irongar");
  assert.equal(profile.slug, "samuel-entrenador-personal-fuengirola");
  assert.equal(profile.citySlug, "fuengirola");
  assert.equal(profile.category, "Entrenador personal");
  assert.deepEqual(profile.modalities, ["Presencial", "Online"]);
  assert.equal(profile.reviewStatus, "approved");
  assert.match(profile.headline, /Viking Fitness/i);
});
