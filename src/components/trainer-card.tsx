import Link from "next/link";
import { BadgeCheck, MapPin, MessageCircle, ShieldCheck, Star } from "lucide-react";
import { Avatar } from "@/components/avatar";
import type { PublicTrainerProfile } from "@/types/marketplace";

interface TrainerCardProps {
  trainer: PublicTrainerProfile;
  featured?: boolean;
}

export function TrainerCard({ trainer, featured = false }: TrainerCardProps) {
  return (
    <article className="group relative flex h-full flex-col rounded-[28px] border border-black/10 bg-[linear-gradient(180deg,rgba(255,253,250,0.98),rgba(247,245,239,0.94))] p-6 text-[var(--ink)] shadow-[0_24px_64px_rgba(0,0,0,0.22)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_34px_86px_rgba(0,0,0,0.32)]">
      {featured ? (
        <span className="absolute -top-3 left-6 inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-[var(--ink)] px-3 py-1 text-xs font-bold text-[var(--accent)] shadow-[var(--shadow-soft)]">
          Selección destacada
        </span>
      ) : null}

      <div className="flex items-start gap-4">
        <div className="shrink-0">
          <Avatar name={trainer.displayName} photoUrl={trainer.photoUrl} size="lg" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-heading text-xl text-[var(--ink)]">{trainer.displayName}</h3>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                trainer.verified ? "bg-[var(--accent-soft)] text-[var(--ink)]" : "bg-[var(--gold-soft)] text-[var(--ink)]"
              }`}
            >
              {trainer.verified ? <BadgeCheck size={13} /> : <ShieldCheck size={13} />}
              {trainer.verified ? "Verificado" : "En revisión"}
            </span>
          </div>
          <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-[var(--paper-muted)]">
            <MapPin size={13} className="text-[var(--accent)]" />
            {trainer.city} · {trainer.region}
          </p>
          <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--ink)]">
            <Star size={14} className="fill-[var(--accent)] text-[var(--accent)]" />
            {trainer.rating.toFixed(1)} · {trainer.reviewsCount} reseñas
          </p>
        </div>
      </div>

      <p className="mt-5 text-base font-semibold leading-snug text-[var(--ink)]">{trainer.headline}</p>
      <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--paper-muted)]">{trainer.shortBio}</p>

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

      <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-semibold text-[var(--paper-muted)]">
        <span className="rounded-2xl border border-black/10 bg-white/70 px-3 py-2">
          {trainer.yearsExperience} años exp.
        </span>
        <span className="rounded-2xl border border-black/10 bg-white/70 px-3 py-2">
          {trainer.modalities.slice(0, 2).join(" + ")}
        </span>
      </div>

      <div className="mt-6 flex items-end justify-between gap-4 border-t border-black/10 pt-5">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--paper-muted)]">Desde</p>
          <p className="mt-1 font-heading text-3xl text-[var(--ink)]">
            {trainer.priceFrom}€<span className="ml-1 text-sm font-medium text-[var(--paper-muted)]">/ sesión</span>
          </p>
        </div>
        <Link
          href={`/entrenadores/${trainer.slug}`}
          className="inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-5 py-3 text-sm font-bold text-[var(--accent)] transition-transform hover:-translate-y-0.5"
        >
          Contactar
          <MessageCircle size={15} />
        </Link>
      </div>
    </article>
  );
}
