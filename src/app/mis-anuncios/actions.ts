"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseSessionServerClient } from "@/lib/supabase/server";
import { getTrainerPhotoStoragePath } from "@/lib/trainer-photo";

type DeleteResult = { ok: true } | { ok: false; error: string };

export async function deleteTrainerProfile(trainerId: string): Promise<DeleteResult> {
  const supabase = await getSupabaseSessionServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Debes iniciar sesión." };
  }

  const { data: existing } = await supabase
    .from("trainer_profiles")
    .select("id, slug, city_slug, photo_url")
    .eq("id", trainerId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!existing) {
    return { ok: false, error: "Perfil no encontrado o sin permisos." };
  }

  const photoPath = existing.photo_url
    ? getTrainerPhotoStoragePath(
        existing.photo_url,
        user.id,
        process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
      )
    : null;

  if (photoPath) {
    const { error: photoError } = await supabase.storage
      .from("trainer-photos")
      .remove([photoPath]);

    if (photoError) {
      return { ok: false, error: "No se pudo eliminar la foto del anuncio." };
    }
  }

  const { error } = await supabase
    .from("trainer_profiles")
    .delete()
    .eq("id", trainerId)
    .eq("user_id", user.id);

  if (error) {
    return { ok: false, error: "No se pudo eliminar el anuncio." };
  }

  revalidatePath("/mis-anuncios");
  revalidatePath("/entrenadores");
  revalidatePath(`/entrenadores/${existing.slug}`);
  revalidatePath(`/ciudades/${existing.city_slug}`);

  redirect("/mis-anuncios");
}
