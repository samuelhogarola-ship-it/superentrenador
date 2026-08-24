import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BadgeCheck, Clock, ExternalLink, MapPin, MessageSquare, PenLine, Search, Star, XCircle } from "lucide-react";
import { Avatar } from "@/components/avatar";
import { getSupabaseSessionServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard | Super Entrenador",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const supabase = await getSupabaseSessionServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirectTo=/dashboard");

  const { data: ownTrainerProfiles } = await supabase.rpc("get_own_trainer_dashboard_profile");
  const trainerProfile = ownTrainerProfiles?.[0] ?? null;

  if (trainerProfile) {
    const { data: profileDetails } = await supabase
      .from("trainer_profiles")
      .select("city_slug, photo_url, rating, reviews_count, price_from, specialties, modalities")
      .eq("id", trainerProfile.id)
      .maybeSingle();

    const { count: unread } = await supabase
      .from("messages")
      .select("id", { count: "exact", head: true })
      .eq("trainer_profile_id", trainerProfile.id)
      .neq("sender_id", user.id)
      .is("read_at", null);

    return <TrainerDashboard profile={{ ...trainerProfile, ...(profileDetails ?? {}) }} unreadMessages={unread ?? 0} />;
  }

  const { count: sentMessages } = await supabase
    .from("messages")
    .select("id", { count: "exact", head: true })
    .eq("sender_id", user.id);

  return <ClientDashboard name={user.user_metadata?.full_name ?? user.email} sentMessages={sentMessages ?? 0} />;
}

// ─── PT dashboard ────────────────────────────────────────────────────────────

type ReviewStatus = "pending" | "approved" | "rejected";

interface TrainerProfile {
  id: string;
  slug: string;
  display_name: string;
  review_status: ReviewStatus;
  is_published: boolean;
  city_slug?: string | null;
  photo_url?: string | null;
  rating?: number | null;
  reviews_count?: number | null;
  price_from?: number | null;
  specialties?: string[] | null;
  modalities?: string[] | null;
}

function TrainerDashboard({ profile, unreadMessages }: { profile: TrainerProfile; unreadMessages: number }) {
  const status = profile.review_status;
  const canViewPublic = profile.is_published && status === "approved";
  const profileIncomplete =
    !profile.photo_url ||
    !profile.specialties?.length ||
    !profile.modalities?.length ||
    !profile.price_from;

  const statusBadge =
    canViewPublic
      ? { label: "Publicado", icon: BadgeCheck, cls: "text-[var(--accent)] bg-[var(--accent-soft)]" }
      : status === "rejected"
        ? { label: "Rechazado", icon: XCircle, cls: "text-red-600 bg-red-500/10" }
        : status === "approved"
          ? { label: "No publicado", icon: Clock, cls: "text-[var(--accent)] bg-[var(--accent-soft)]" }
        : { label: "Pendiente de revisión", icon: Clock, cls: "text-[var(--accent)] bg-[var(--accent-soft)]" };

  const StatusIcon = statusBadge.icon;

  return (
    <main className="flex flex-1 flex-col bg-[#f6f6f6] text-[#202020]">
      <nav className="bg-[#202020] px-4 text-white sm:px-6 lg:px-8" aria-label="Panel del entrenador">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto">
          {[
            { label: "Panel de control", href: "/dashboard", active: true },
            { label: "Mensajes", href: "/dashboard/mensajes", active: false },
            { label: "Mis anuncios", href: "/mis-anuncios", active: false },
            { label: "Mi cuenta", href: "/mi-perfil", active: false },
            { label: "Premium", href: "/premium", active: false },
          ].map((item) => (
            <Link key={item.label} href={item.href} className={`whitespace-nowrap border-b-4 px-4 py-5 text-sm font-bold sm:px-6 ${item.active ? "border-[#ff6868] text-white" : "border-transparent text-white/60 hover:text-white"}`}>
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {profileIncomplete && (
        <div className="bg-[#ffc94d] px-4 py-5 text-center text-sm font-bold text-[#5b4300] sm:py-6">
          <span className="inline-flex items-center gap-3"><Star size={22} className="fill-[#ffae00] text-[#ffae00]" /> Completa tu perfil para conseguir más visibilidad <Link href="/mi-perfil" className="rounded-full bg-white/70 px-3 py-1 hover:bg-white">Completar</Link></span>
        </div>
      )}

      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:px-8 lg:py-8">
        <aside className="h-fit rounded-[22px] border border-[#e4e4e4] bg-white p-6 text-center shadow-sm lg:sticky lg:top-6">
          <div className="flex justify-center"><div className="relative"><Avatar name={profile.display_name} photoUrl={profile.photo_url} size="xl" /><span className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-[#ff6868] text-white"><PenLine size={17} /></span></div></div>
          <h1 className="mt-5 font-heading text-3xl font-bold">{profile.display_name}</h1>
          <p className="mt-2 flex items-center justify-center gap-1 text-sm font-semibold text-[#858585]"><MapPin size={14} /> {profile.city_slug ?? "Añade tu ciudad"}</p>
          <div className="mt-6 border-t border-[#eeeeee] pt-5" />
          <MetricRow label="Comentarios" value={`${profile.reviews_count ?? 0}`} />
          {profile.rating ? <MetricRow label="Valoración" value={`${profile.rating.toFixed(1)} ★`} /> : null}
          {profile.price_from ? <MetricRow label="Tarifa horaria" value={`${profile.price_from}€`} /> : null}
          <Link href="/mi-perfil" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#ff6868]"><PenLine size={15} /> Editar perfil</Link>
        </aside>

        <section className="min-w-0">
          <div className="rounded-[22px] border border-[#e4e4e4] bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-[#777]">Estado de publicación</p>
                <h2 className="mt-1 font-heading text-2xl font-bold">{statusBadge.label}</h2>
                <p className="mt-2 text-sm text-[#666]">
                  {canViewPublic
                    ? "Tu perfil está visible en el marketplace."
                    : status === "rejected"
                      ? "Revisa tu perfil y vuelve a enviarlo para evaluación."
                      : status === "approved"
                        ? "Tu perfil está aprobado, pero todavía no está visible."
                      : "Revisaremos el perfil antes de hacerlo público."}
                </p>
              </div>
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${statusBadge.cls}`}>
                <StatusIcon size={24} />
              </span>
            </div>
          </div>

          <section className="mt-6 overflow-hidden rounded-[22px] border border-[#e4e4e4] bg-white shadow-sm">
            <div className="border-b border-[#eeeeee] px-6 py-5"><h2 className="font-heading text-2xl font-bold">Mensajes</h2></div>
            <div className="px-6 py-10 text-center"><MessageSquare size={30} className="mx-auto text-[#ffb72d]" /><p className="mt-3 font-semibold">{unreadMessages > 0 ? `${unreadMessages} mensajes pendientes` : "Todavía no tienes mensajes"}</p><Link href="/dashboard/mensajes" className="mt-4 inline-flex items-center gap-2 font-bold text-[#ff6868]">Abrir mensajes <ExternalLink size={15} /></Link></div>
          </section>
        </section>
      </div>
    </main>
  );
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between border-t border-[#eeeeee] py-4 text-sm"><span className="font-semibold text-[#555]">{label}</span><strong className="text-xl">{value}</strong></div>;
}

// ─── Client dashboard ─────────────────────────────────────────────────────────

function ClientDashboard({ name, sentMessages }: { name?: string; sentMessages: number }) {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-8 md:px-6 lg:px-8">
      <div>
        <p className="app-kicker">Panel de cliente</p>
        <h1 className="app-title mt-1 text-3xl text-[var(--text)]">
          {name ? `Hola, ${name.split(" ")[0]}` : "Bienvenido"}
        </h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/dashboard/mensajes"
          className="app-surface flex items-center gap-4 rounded-[20px] p-5 transition-colors hover:border-[var(--line-strong)]"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)]">
            <MessageSquare size={18} className="text-[var(--accent)]" />
          </span>
          <div>
            <p className="font-semibold text-[var(--text)]">Mis mensajes</p>
            <p className="text-sm text-[var(--muted)]">
              {sentMessages > 0 ? `${sentMessages} mensaje${sentMessages !== 1 ? "s" : ""} enviado${sentMessages !== 1 ? "s" : ""}` : "Sin mensajes aún"}
            </p>
          </div>
        </Link>

        <Link
          href="/entrenadores"
          className="app-surface flex items-center gap-4 rounded-[20px] p-5 transition-colors hover:border-[var(--line-strong)]"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)]">
            <Search size={18} className="text-[var(--accent)]" />
          </span>
          <div>
            <p className="font-semibold text-[var(--text)]">Buscar entrenadores</p>
            <p className="text-sm text-[var(--muted)]">Encuentra tu entrenador ideal</p>
          </div>
        </Link>
      </div>
    </main>
  );
}
