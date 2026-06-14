import Link from "next/link";
import { MapPin, ShieldCheck, Star } from "lucide-react";
import type { PublicTrainerProfile } from "@/types/marketplace";

interface TrainerCardProps {
  trainer: PublicTrainerProfile;
}

export function TrainerCard({ trainer }: TrainerCardProps) {
  return (
    <article className="group rounded-[28px] border border-white/10 bg-[var(--panel)] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.24)] transition-transform hover:-translate-y-1">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--accent)]">
            {trainer.city} · {trainer.region}
          </p>
          <h3 className="mt-2 font-heading text-4xl uppercase tracking-[0.05em] text-[var(--text)]">
            {trainer.displayName}
          </h3>
        </div>
        {trainer.verified ? (
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
            <ShieldCheck size={14} />
            Verified
          </span>
        ) : null}
      </div>

      <p className="text-lg text-[var(--text)]">{trainer.headline}</p>
      <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{trainer.shortBio}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {trainer.specialties.map((specialty) => (
          <span
            key={specialty}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-[var(--text)]"
          >
            {specialty}
          </span>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-4 text-sm text-[var(--muted)]">
        <span className="inline-flex items-center gap-2">
          <Star size={16} className="text-[var(--accent)]" />
          {trainer.rating} · {trainer.reviewsCount} opiniones
        </span>
        <span className="inline-flex items-center gap-2">
          <MapPin size={16} className="text-[var(--accent)]" />
          Desde {trainer.priceFrom} €
        </span>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <span className="text-sm text-[var(--muted)]">{trainer.hiddenContactHint}</span>
        <Link
          href={`/entrenadores/${trainer.slug}`}
          className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--ink)] transition-transform group-hover:-translate-y-0.5"
        >
          Ver perfil
        </Link>
      </div>
    </article>
  );
}
