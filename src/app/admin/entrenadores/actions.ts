"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseSessionServerClient } from "@/lib/supabase/server";

type TrainerReviewStatus = "approved" | "rejected";
type TrainerReviewResult =
  | { ok: true }
  | { ok: false; error: string };

export async function updateTrainerReviewStatus(
  trainerId: string,
  status: TrainerReviewStatus
): Promise<TrainerReviewResult> {
  const supabase = await getSupabaseSessionServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Debes iniciar sesión." };
  }

  const { data: adminRecord } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!adminRecord) {
    return { ok: false, error: "No tienes permisos de administrador." };
  }

  const { data: trainerProfile } = await supabase
    .from("trainer_profiles")
    .select("slug, city_slug")
    .eq("id", trainerId)
    .maybeSingle();

  if (!trainerProfile) {
    return { ok: false, error: "No se encontró el perfil." };
  }

  const { error } = await supabase
    .from("trainer_profiles")
    .update({
      is_published: status === "approved",
      review_status: status,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", trainerId);

  if (error) {
    return { ok: false, error: "No se pudo actualizar el perfil." };
  }

  revalidatePath("/admin/entrenadores");
  revalidatePath("/");
  revalidatePath("/entrenadores");
  revalidatePath(`/entrenadores/${trainerProfile.slug}`);
  revalidatePath(`/ciudades/${trainerProfile.city_slug}`);
  revalidatePath("/sitemap.xml");
  return { ok: true };
}
