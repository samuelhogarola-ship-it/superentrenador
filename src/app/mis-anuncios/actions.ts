"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseSessionServerClient } from "@/lib/supabase/server";

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
    .select("id, slug, city_slug")
    .eq("id", trainerId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!existing) {
    return { ok: false, error: "Perfil no encontrado o sin permisos." };
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
