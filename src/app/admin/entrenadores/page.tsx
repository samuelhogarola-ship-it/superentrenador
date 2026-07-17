import { redirect } from "next/navigation";
import { getSupabaseSessionServerClient } from "@/lib/supabase/server";
import { AdminEntrenadoresClient, type PendingTrainer } from "./admin-entrenadores-client";

export const dynamic = "force-dynamic";

export default async function AdminEntrenadoresPage() {
  const supabase = await getSupabaseSessionServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/admin/entrenadores");
  }

  const { data: adminRecord } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!adminRecord) {
    redirect("/dashboard");
  }

  const { data } = await supabase
    .from("trainer_profiles")
    .select(
      "id, slug, display_name, city_slug, headline, short_bio, long_bio, specialties, modalities, languages, years_experience, price_from, contact_info, photo_url, review_status, is_published, created_at, cities(name, region)"
    )
    .order("created_at", { ascending: false });

  return <AdminEntrenadoresClient initialTrainers={(data ?? []) as PendingTrainer[]} />;
}
