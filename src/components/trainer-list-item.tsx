import Link from "next/link";
import { BadgeCheck, MapPin, MessageCircle, ShieldCheck, Star } from "lucide-react";
import { Avatar } from "@/components/avatar";
import type { PublicTrainerProfile } from "@/types/marketplace";

interface TrainerListItemProps {
  trainer: PublicTrainerProfile;
}

export function TrainerListItem({ trainer }: TrainerListItemProps) {
  return (
    <article className="group flex flex-col gap-5 rounded-[28px] border border-black/10 bg-[linear-gradient(180deg,rgba(255,253,250,0.98),rgba(247,245,239,0.94))] p-5 text-[var(--ink)] shadow-[0_24px_64px_rgba(0,0,0,0.22)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_34px_86px_rgba(0,0,0,0.32)] sm:flex-row sm:gap-6 sm:p-6">
      <div className="shrink-0 self-start">
        <Avatar name={trainer.displayName} photoUrl={trainer.photoUrl} size="xl" />
      </div>

      <div className="flex flex-1 flex-col gap-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-heading text-xl text-[var(--ink)]">{trainer.displayName}</h3>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
              trainer.verified ? "bg-[var(--accent-soft)] text-[var(--ink)]" : "bg-[var(--gold-soft)] text-[var(--ink)]"
            }`}
          >
            {trainer.verified ? <BadgeCheck size={13} /> : <ShieldCheck size={13} />}
            {trainer.verified ? "Identidad verificada" : "Perfil aprobado"}
          </span>
        </div>

        <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-[var(--paper-muted)]">
          <MapPin size={13} className="text-[var(--accent)]" />
          {trainer.city} · {trainer.region}
        </p>

        {trainer.reviewsCount > 0 ? (
          <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--ink)]">
            <Star size={14} className="fill-[var(--accent)] text-[var(--accent)]" />
            {trainer.rating.toFixed(1)} · {trainer.reviewsCount} reseñas
          </p>
        ) : (
          <p className="mt-2 text-sm font-semibold text-[var(--paper-muted)]">Nuevo en Super Entrenador</p>
        )}

        <p className="mt-2 line-clamp-2 text-sm font-medium leading-6 text-[var(--ink)]">{trainer.headline}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {trainer.specialties.slice(0, 2).map((specialty) => (
            <span
              key={specialty}
              className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-[var(--ink)] ring-1 ring-black/10"
            >
              {specialty}
            </span>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-[var(--paper-muted)]">
          <span className="rounded-full border border-black/10 bg-white/70 px-3 py-1.5">
            {trainer.yearsExperience} años de experiencia
          </span>
          <span className="rounded-full border border-black/10 bg-white/70 px-3 py-1.5">
            {trainer.modalities.join(" · ")}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 flex-row items-center justify-between gap-3 border-t border-black/10 pt-4 sm:flex-col sm:items-end sm:justify-center sm:border-l sm:pl-6 sm:pt-0">
        <div className="text-right">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--paper-muted)]">Desde</p>
          <p className="font-heading text-3xl text-[var(--ink)]">
            {trainer.priceFrom}€<span className="text-sm font-medium text-[var(--paper-muted)]"> /ses.</span>
          </p>
        </div>
        <Link
          href={`/entrenadores/${trainer.slug}`}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--ink)] px-5 py-3 text-sm font-bold text-[var(--accent)] transition-transform hover:-translate-y-0.5"
        >
          Contactar
          <MessageCircle size={15} />
        </Link>
      </div>
    </article>
  );
}
