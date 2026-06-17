import Link from "next/link";
import { BadgeCheck, MapPin } from "lucide-react";
import { Avatar } from "@/components/avatar";
import { RatingStars } from "@/components/rating-stars";
import type { PublicTrainerProfile } from "@/types/marketplace";

interface TrainerListItemProps {
  trainer: PublicTrainerProfile;
}

export function TrainerListItem({ trainer }: TrainerListItemProps) {
  return (
    <article className="app-surface group flex flex-col gap-5 rounded-[26px] p-5 transition-transform hover:-translate-y-0.5 sm:flex-row sm:items-center sm:p-6">
      <Avatar name={trainer.displayName} size="lg" />

      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-heading text-xl text-[var(--text)]">{trainer.displayName}</h3>
          {trainer.verified ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-700">
              <BadgeCheck size={13} />
              Verificado
            </span>
          ) : null}
        </div>

        <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-[var(--muted)]">
          <MapPin size={13} className="text-[var(--accent)]" />
          {trainer.city} · {trainer.region}
        </p>

        <p className="mt-2 line-clamp-2 text-sm text-[var(--text)]">{trainer.headline}</p>

        <div className="mt-3 flex flex-wrap gap-2">
          {trainer.specialties.slice(0, 3).map((specialty) => (
            <span
              key={specialty}
              className="rounded-full border border-[var(--line)] bg-[var(--bg-soft)] px-3 py-1 text-xs font-medium text-[var(--text)]"
            >
              {specialty}
            </span>
          ))}
        </div>

        <div className="mt-3">
          <RatingStars rating={trainer.rating} reviewsCount={trainer.reviewsCount} />
        </div>
      </div>

      <div className="flex shrink-0 flex-row items-center justify-between gap-4 border-t border-[var(--line)] pt-4 sm:flex-col sm:items-end sm:gap-3 sm:border-t-0 sm:border-l sm:pl-6 sm:pt-0">
        <div className="text-right">
          <p className="text-xs text-[var(--muted)]">Desde</p>
          <p className="font-heading text-2xl text-[var(--text)]">
            {trainer.priceFrom}€<span className="text-sm font-medium text-[var(--muted)]"> /sesión</span>
          </p>
        </div>
        <Link
          href={`/entrenadores/${trainer.slug}`}
          className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[var(--ink)] transition-transform group-hover:-translate-y-0.5"
        >
          Ver perfil
        </Link>
      </div>
    </article>
  );
}
