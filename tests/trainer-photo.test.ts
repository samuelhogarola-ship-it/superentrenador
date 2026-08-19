import assert from "node:assert/strict";
import test from "node:test";

type TrainerPhotoModule = {
  getTrainerPhotoStoragePath?: (photoUrl: string, userId: string, supabaseUrl: string) => string | null;
};

async function loadTrainerPhoto(): Promise<TrainerPhotoModule> {
  return import("../src/lib/trainer-photo").catch(() => ({}));
}

test("extracts a trainer-owned storage path from a public bucket URL", async () => {
  const { getTrainerPhotoStoragePath } = await loadTrainerPhoto();
  assert.equal(typeof getTrainerPhotoStoragePath, "function");

  assert.equal(
    getTrainerPhotoStoragePath?.(
      "https://project.supabase.co/storage/v1/object/public/trainer-photos/user-123/profile.webp?t=1",
      "user-123",
      "https://project.supabase.co",
    ),
    "user-123/profile.webp",
  );
});

test("rejects external, cross-user and malformed trainer photo URLs", async () => {
  const { getTrainerPhotoStoragePath } = await loadTrainerPhoto();
  assert.equal(typeof getTrainerPhotoStoragePath, "function");

  const supabaseUrl = "https://project.supabase.co";
  assert.equal(getTrainerPhotoStoragePath?.("https://tracker.example/photo.jpg", "user-123", supabaseUrl), null);
  assert.equal(
    getTrainerPhotoStoragePath?.(
      "https://project.supabase.co/storage/v1/object/public/trainer-photos/other-user/profile.jpg",
      "user-123",
      supabaseUrl,
    ),
    null,
  );
  assert.equal(getTrainerPhotoStoragePath?.("not-a-url", "user-123", supabaseUrl), null);
});
