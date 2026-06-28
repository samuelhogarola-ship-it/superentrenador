import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BadgeCheck, Clock, ExternalLink, MessageSquare, PenLine, Search, XCircle } from "lucide-react";
import { getSupabaseSessionServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard | Super Entrenador",
};

export default async function DashboardPage() {
  const supabase = await getSupabaseSessionServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirectTo=/dashboard");

  const { data: trainerProfile } = await supabase
    .from("trainer_profiles")
    .select("id, slug, display_name, review_status, is_published")
    .eq("user_id", user.id)
    .maybeSingle();

  if (trainerProfile) {
    const { count: unread } = await supabase
      .from("messages")
      .select("id", { count: "exact", head: true })
      .eq("trainer_profile_id", trainerProfile.id)
      .is("read_at", null);

    return <TrainerDashboard profile={trainerProfile} unreadMessages={unread ?? 0} />;
  }

  const { count: sentMessages } = await supabase
    .from("messages")
    .select("id", { count: "exact", head: true })
    .eq("sender_id", user.id);

  return <ClientDashboard name={user.user_metadata?.full_name ?? user.email} sentMessages={sentMessages ?? 0} />;
}

// ─── PT dashboard ────────────────────────────────────────────────────────────

type ReviewStatus = "pending" | "approved" | "rejected" | string;

interface TrainerProfile {
  id: string;
  slug: string;
  display_name: string;
  review_status: ReviewStatus;
  is_published: boolean;
}

function TrainerDashboard({ profile, unreadMessages }: { profile: TrainerProfile; unreadMessages: number }) {
  const status = profile.review_status;

  const statusBadge =
    status === "approved"
      ? { label: "Publicado", icon: BadgeCheck, cls: "text-emerald-700 bg-emerald-500/10" }
      : status === "rejected"
        ? { label: "Rechazado", icon: XCircle, cls: "text-red-600 bg-red-500/10" }
        : { label: "Pendiente de revisión", icon: Clock, cls: "text-amber-600 bg-amber-500/10" };

  const StatusIcon = statusBadge.icon;

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-8 md:px-6 lg:px-8">
      <div>
        <p className="app-kicker">Panel de entrenador</p>
        <h1 className="app-title mt-1 text-3xl text-[var(--text)]">{profile.display_name}</h1>
      </div>

      <div className="app-surface rounded-[28px] p-6 sm:p-8">
        <p className="text-sm font-semibold text-[var(--muted)] uppercase tracking-[0.12em]">Estado del perfil</p>
        <div className="mt-3 flex items-center gap-3">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold ${statusBadge.cls}`}>
            <StatusIcon size={14} />
            {statusBadge.label}
          </span>
        </div>
        {status === "pending" && (
          <p className="mt-3 text-sm text-[var(--muted)]">
            Tu perfil está en revisión. Te notificaremos cuando sea aprobado.
          </p>
        )}
        {status === "rejected" && (
          <p className="mt-3 text-sm text-[var(--muted)]">
            Tu perfil ha sido rechazado. Revisa la información y envíalo de nuevo desde el editor.
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/mi-perfil"
          className="app-surface flex items-center gap-4 rounded-[24px] p-5 transition-colors hover:border-[var(--line-strong)]"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)]">
            <PenLine size={18} className="text-[var(--accent)]" />
          </span>
          <div>
            <p className="font-semibold text-[var(--text)]">Editar perfil</p>
            <p className="text-sm text-[var(--muted)]">Actualiza tu información pública</p>
          </div>
        </Link>

        <Link
          href="/dashboard/mensajes"
          className="app-surface flex items-center gap-4 rounded-[24px] p-5 transition-colors hover:border-[var(--line-strong)]"
        >
          <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)]">
            <MessageSquare size={18} className="text-[var(--accent)]" />
            {unreadMessages > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--accent)] text-[9px] font-bold text-[var(--ink)]">
                {unreadMessages}
              </span>
            )}
          </span>
          <div>
            <p className="font-semibold text-[var(--text)]">Mensajes</p>
            <p className="text-sm text-[var(--muted)]">
              {unreadMessages > 0 ? `${unreadMessages} sin leer` : "Bandeja de entrada"}
            </p>
          </div>
        </Link>

        {profile.is_published && (
          <Link
            href={`/entrenadores/${profile.slug}`}
            className="app-surface flex items-center gap-4 rounded-[24px] p-5 transition-colors hover:border-[var(--line-strong)]"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)]">
              <ExternalLink size={18} className="text-[var(--accent)]" />
            </span>
            <div>
              <p className="font-semibold text-[var(--text)]">Ver ficha pública</p>
              <p className="text-sm text-[var(--muted)]">Así te ven los clientes</p>
            </div>
          </Link>
        )}
      </div>
    </main>
  );
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
          className="app-surface flex items-center gap-4 rounded-[24px] p-5 transition-colors hover:border-[var(--line-strong)]"
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
          className="app-surface flex items-center gap-4 rounded-[24px] p-5 transition-colors hover:border-[var(--line-strong)]"
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
