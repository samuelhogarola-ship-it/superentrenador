"use client";

import { useState } from "react";
import { BadgeCheck, CheckCircle, Clock, MapPin, XCircle } from "lucide-react";
import { Avatar } from "@/components/avatar";
import { updateTrainerReviewStatus } from "./actions";

type ReviewStatus = "pending" | "approved" | "rejected";

export interface PendingTrainer {
  id: string;
  slug: string;
  display_name: string;
  city_slug: string;
  headline: string;
  short_bio: string;
  long_bio: string;
  specialties: string[];
  modalities: string[];
  languages: string[];
  years_experience: number;
  price_from: number;
  contact_info: string | null;
  photo_url: string | null;
  review_status: ReviewStatus;
  is_published: boolean;
  created_at: string;
  city_name: string | null;
  city_region: string | null;
}

export function AdminEntrenadoresClient({
  initialTrainers,
  loadError = null,
}: {
  initialTrainers: PendingTrainer[];
  loadError?: string | null;
}) {
  const [trainers, setTrainers] = useState<PendingTrainer[]>(initialTrainers);
  const [acting, setActing] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  async function handleApprove(id: string) {
    setActing(id);
    setActionError(null);
    const result = await updateTrainerReviewStatus(id, "approved");
    if (!result.ok) {
      setActionError(result.error);
      setActing(null);
      return;
    }
    setTrainers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, is_published: true, review_status: "approved" } : t))
    );
    setActing(null);
  }

  async function handleReject(id: string) {
    setActing(id);
    setActionError(null);
    const result = await updateTrainerReviewStatus(id, "rejected");
    if (!result.ok) {
      setActionError(result.error);
      setActing(null);
      return;
    }
    setTrainers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, is_published: false, review_status: "rejected" } : t))
    );
    setActing(null);
  }

  const pending = trainers.filter((t) => t.review_status === "pending");
  const rest = trainers.filter((t) => t.review_status !== "pending");

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-8 md:px-6 lg:px-8">
      <div>
        <p className="app-kicker">Admin</p>
        <h1 className="app-title mt-1 text-3xl text-[var(--text)]">Revisión de entrenadores</h1>
        <p className="app-copy mt-2 text-sm">
          {pending.length} pendiente{pending.length !== 1 ? "s" : ""} · {trainers.length} total
        </p>
        {actionError || loadError ? (
          <p role="alert" className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {actionError ?? loadError}
          </p>
        ) : null}
      </div>

      {pending.length > 0 ? (
        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-[var(--muted)]">
            Pendientes de revisión
          </h2>
          {pending.map((trainer) => (
            <TrainerReviewCard
              key={trainer.id}
              trainer={trainer}
              acting={acting === trainer.id}
              onApprove={() => handleApprove(trainer.id)}
              onReject={() => handleReject(trainer.id)}
            />
          ))}
        </section>
      ) : (
        <div className="app-surface rounded-[20px] px-6 py-8 text-center text-sm text-[var(--muted)]">
          No hay perfiles pendientes de revisión.
        </div>
      )}

      {rest.length > 0 ? (
        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-[var(--muted)]">
            Revisados
          </h2>
          {rest.map((trainer) => (
            <TrainerReviewCard
              key={trainer.id}
              trainer={trainer}
              acting={acting === trainer.id}
              onApprove={() => handleApprove(trainer.id)}
              onReject={() => handleReject(trainer.id)}
            />
          ))}
        </section>
      ) : null}
    </main>
  );
}

function TrainerReviewCard({
  trainer,
  acting,
  onApprove,
  onReject,
}: {
  trainer: PendingTrainer;
  acting: boolean;
  onApprove: () => void;
  onReject: () => void;
}) {
  const statusColor =
    trainer.review_status === "approved"
      ? "text-[var(--accent)] bg-[var(--accent-soft)]"
      : trainer.review_status === "rejected"
        ? "text-red-600 bg-red-500/10"
        : "text-amber-600 bg-amber-500/10";

  const StatusIcon =
    trainer.review_status === "approved"
      ? CheckCircle
      : trainer.review_status === "rejected"
        ? XCircle
        : Clock;

  return (
    <div className="app-surface flex flex-col gap-4 rounded-[20px] p-5 sm:flex-row sm:items-start sm:gap-5">
      <Avatar name={trainer.display_name} photoUrl={trainer.photo_url} size="lg" />

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-heading text-lg text-[var(--text)]">{trainer.display_name}</h3>
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${statusColor}`}>
            <StatusIcon size={12} />
            {trainer.review_status === "approved"
              ? "Aprobado"
              : trainer.review_status === "rejected"
                ? "Rechazado"
                : "Pendiente"}
          </span>
          {trainer.is_published ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--accent)]">
              <BadgeCheck size={12} />
              Publicado
            </span>
          ) : null}
        </div>

        <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-[var(--muted)]">
          <MapPin size={12} className="text-[var(--accent)]" />
          {trainer.city_name ?? trainer.city_slug}
        </p>

        <p className="mt-1.5 text-sm font-semibold text-[var(--text)]">{trainer.headline}</p>
        <p className="mt-1 line-clamp-2 text-xs text-[var(--muted)]">{trainer.short_bio}</p>
        <p className="mt-1 line-clamp-3 text-xs leading-5 text-[var(--muted)]">{trainer.long_bio}</p>

        <div className="mt-3 grid gap-2 text-xs text-[var(--muted)] sm:grid-cols-3">
          <span className="rounded-2xl border border-[var(--line)] px-3 py-2">
            {trainer.years_experience} años exp.
          </span>
          <span className="rounded-2xl border border-[var(--line)] px-3 py-2">
            Desde {trainer.price_from}€/sesión
          </span>
          <span className="rounded-2xl border border-[var(--line)] px-3 py-2">
            {trainer.languages?.join(" · ") || "Sin idiomas"}
          </span>
        </div>

        <div className="mt-2 flex flex-wrap gap-1.5">
          {trainer.specialties?.slice(0, 4).map((s) => (
            <span
              key={s}
              className="rounded-full border border-[var(--line)] px-2.5 py-0.5 text-xs text-[var(--text)]"
            >
              {s}
            </span>
          ))}
        </div>

        <div className="mt-2 flex flex-wrap gap-1.5">
          {trainer.modalities?.map((m) => (
            <span
              key={m}
              className="rounded-full bg-[var(--accent-soft)] px-2.5 py-0.5 text-xs font-semibold text-[var(--accent)]"
            >
              {m}
            </span>
          ))}
        </div>

        {trainer.photo_url ? (
          <p className="mt-2 text-xs text-[var(--muted)] truncate">
            Foto: <span className="text-[var(--text)]">{trainer.photo_url}</span>
          </p>
        ) : (
          <p className="mt-2 text-xs text-amber-600">Sin foto de perfil</p>
        )}

        <p className="mt-1 text-xs text-[var(--muted)]">
          Contacto: <span className="text-[var(--text)]">{trainer.contact_info || "No indicado"}</span>
        </p>

        <p className="mt-1 text-xs text-[var(--muted)]">
          Registrado: {new Date(trainer.created_at).toLocaleDateString("es-ES")}
        </p>
      </div>

      <div className="flex shrink-0 flex-row gap-2 sm:flex-col">
        <button
          onClick={onApprove}
          disabled={acting || trainer.review_status === "approved"}
          className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--ink)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <CheckCircle size={14} />
          Aprobar
        </button>
        <button
          onClick={onReject}
          disabled={acting || trainer.review_status === "rejected"}
          className="inline-flex items-center justify-center gap-1.5 rounded-full border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-600 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <XCircle size={14} />
          Rechazar
        </button>
        {trainer.is_published ? (
          <a
            href={`/entrenadores/${trainer.slug}`}
            target="_blank"
            rel="noreferrer"
            className="text-center text-xs text-[var(--muted)] hover:text-[var(--text)] pt-1"
          >
            Ver ficha →
          </a>
        ) : null}
      </div>
    </div>
  );
}
