const PUBLIC_TRAINER_PHOTO_PREFIX = "/storage/v1/object/public/trainer-photos/";
const MANAGED_TRAINER_PHOTO_NAMES = [
  "profile",
  "profile.jpg",
  "profile.png",
  "profile.webp",
  "profile.gif",
] as const;

export function getTrainerPhotoCleanupPaths(userId: string, keepPath?: string | null) {
  if (!userId) return [];

  return MANAGED_TRAINER_PHOTO_NAMES
    .map((name) => `${userId}/${name}`)
    .filter((path) => path !== keepPath);
}

export function getTrainerPhotoStoragePath(photoUrl: string, userId: string, supabaseUrl: string) {
  if (!photoUrl || !userId || !supabaseUrl) return null;

  try {
    const photo = new URL(photoUrl);
    const supabase = new URL(supabaseUrl);
    if (photo.origin !== supabase.origin || !photo.pathname.startsWith(PUBLIC_TRAINER_PHOTO_PREFIX)) {
      return null;
    }

    const storagePath = decodeURIComponent(photo.pathname.slice(PUBLIC_TRAINER_PHOTO_PREFIX.length));
    const segments = storagePath.split("/");
    if (
      segments[0] !== userId ||
      segments.length !== 2 ||
      !MANAGED_TRAINER_PHOTO_NAMES.includes(
        segments[1] as (typeof MANAGED_TRAINER_PHOTO_NAMES)[number],
      )
    ) {
      return null;
    }

    return storagePath;
  } catch {
    return null;
  }
}
