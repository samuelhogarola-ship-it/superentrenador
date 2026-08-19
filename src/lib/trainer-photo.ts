const PUBLIC_TRAINER_PHOTO_PREFIX = "/storage/v1/object/public/trainer-photos/";

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
    if (segments[0] !== userId || segments.length < 2 || segments.some((segment) => !segment || segment === "." || segment === "..")) {
      return null;
    }

    return storagePath;
  } catch {
    return null;
  }
}
