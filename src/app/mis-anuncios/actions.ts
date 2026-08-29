"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hasVerifiedEmail } from "@/lib/server/request-security";
import { getSupabaseAdminClient, getSupabaseSessionServerClient } from "@/lib/supabase/server";
import { getTrainerPhotoCleanupPaths } from "@/lib/trainer-photo";

type DeleteResult = { ok: true } | { ok: false; error: string };

export async function deleteTrainerProfile(trainerId: string): Promise<DeleteResult> {
  const supabase = await getSupabaseSessionServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Debes iniciar sesión." };
  }

  if (!hasVerifiedEmail(user)) {
    return { ok: false, error: "Confirma tu email antes de eliminar el perfil." };
  }

  const { data: existing } = await supabase
    .from("trainer_profiles")
    .select("id, slug, city_slug, photo_url, is_published, review_status")
    .eq("id", trainerId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!existing) {
    return { ok: false, error: "Perfil no encontrado o sin permisos." };
  }

  const { data: preparedProfile, error: prepareError } = await supabase
    .from("trainer_profiles")
    .update({
      photo_url: null,
      is_published: false,
      review_status: "pending",
    })
    .eq("id", trainerId)
    .eq("user_id", user.id)
    .select("id")
    .maybeSingle();

  if (prepareError || !preparedProfile) {
    return { ok: false, error: "No se pudo preparar el anuncio para eliminarlo." };
  }

  const photoPaths = getTrainerPhotoCleanupPaths(user.id);
  const { error: photoError } = await supabase.storage
    .from("trainer-photos")
    .remove(photoPaths);

  if (photoError) {
    try {
      const admin = getSupabaseAdminClient();
      const { data: restoredProfile, error: restoreError } = await admin
        .from("trainer_profiles")
        .update({
          photo_url: existing.photo_url,
          is_published: existing.is_published,
          review_status: existing.review_status,
        })
        .eq("id", trainerId)
        .eq("user_id", user.id)
        .is("photo_url", null)
        .eq("is_published", false)
        .eq("review_status", "pending")
        .select("photo_url, is_published, review_status")
        .maybeSingle();

      if (
        restoreError ||
        !restoredProfile ||
        restoredProfile.photo_url !== existing.photo_url ||
        restoredProfile.is_published !== existing.is_published ||
        restoredProfile.review_status !== existing.review_status
      ) {
        throw new Error("Profile restoration was not confirmed.");
      }
    } catch {
      return {
        ok: false,
        error: "No se pudieron eliminar las fotos y el anuncio quedó oculto. Vuelve a intentarlo.",
      };
    }

    return { ok: false, error: "No se pudieron eliminar las fotos. Vuelve a intentarlo." };
  }

  const { data: deletedProfile, error: deleteError } = await supabase
    .from("trainer_profiles")
    .delete()
    .eq("id", trainerId)
    .eq("user_id", user.id)
    .select("id")
    .maybeSingle();

  if (deleteError || !deletedProfile) {
    return { ok: false, error: "Las fotos se eliminaron, pero no el anuncio. Vuelve a intentarlo." };
  }

  revalidatePath("/mis-anuncios");
  revalidatePath("/entrenadores");
  revalidatePath(`/entrenadores/${existing.slug}`);
  revalidatePath(`/ciudades/${existing.city_slug}`);

  redirect("/mis-anuncios");
}
