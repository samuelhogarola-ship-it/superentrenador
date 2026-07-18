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

  const { data, error } = await supabase.rpc("get_admin_trainer_profiles");

  if (error) {
    console.error("[admin/trainers] get_admin_trainer_profiles failed", error);
    return <AdminEntrenadoresClient initialTrainers={[]} loadError="No se pudo cargar la revisión de perfiles." />;
  }

  return <AdminEntrenadoresClient initialTrainers={(data ?? []) as PendingTrainer[]} />;
}
