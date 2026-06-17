import Link from "next/link";
import { BadgeCheck, MapPin } from "lucide-react";
import { Avatar } from "@/components/avatar";
import { RatingStars } from "@/components/rating-stars";
import type { PublicTrainerProfile } from "@/types/marketplace";

interface TrainerCardProps {
  trainer: PublicTrainerProfile;
  featured?: boolean;
}

export function TrainerCard({ trainer, featured = false }: TrainerCardProps) {
  return (
    <article className="app-surface group relative flex flex-col rounded-[30px] p-6 transition-transform hover:-translate-y-1">
      {featured ? (
        <span className="absolute -top-3 left-6 inline-flex items-center gap-1.5 rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-bold text-white shadow-[var(--shadow-soft)]">
          ⭐ Top valorado
        </span>
      ) : null}

      <div className="flex items-start gap-4">
        <div className="relative shrink-0">
          <Avatar name={trainer.displayName} photoUrl={trainer.photoUrl} size="lg" />
          <span className="absolute -bottom-1 -right-2 flex items-center justify-center rounded-full border-2 border-[var(--bg)] bg-[var(--accent)] px-2 py-0.5 font-heading text-xs font-bold text-[var(--ink)] shadow-sm whitespace-nowrap">
            {trainer.priceFrom}€
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <h3 className="font-heading text-lg text-[var(--text)]">{trainer.displayName}</h3>
            {trainer.verified ? (
              <BadgeCheck size={15} className="shrink-0 text-emerald-500" />
            ) : null}
          </div>
          <p className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-[var(--muted)]">
            <MapPin size={11} className="text-[var(--accent)]" />
            {trainer.city}
          </p>
          <div className="mt-1.5">
            <RatingStars rating={trainer.rating} reviewsCount={trainer.reviewsCount} />
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm font-semibold leading-snug text-[var(--text)]">{trainer.headline}</p>
      <p className="app-copy mt-1.5 line-clamp-2 text-sm">{trainer.shortBio}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {trainer.specialties.slice(0, 3).map((specialty) => (
          <span
            key={specialty}
            className="rounded-full border border-[var(--line)] bg-[var(--bg-soft)] px-3 py-1 text-xs font-medium text-[var(--text)]"
          >
            {specialty}
          </span>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between gap-4 border-t border-[var(--line)] pt-4">
        <p className="text-xs text-[var(--muted)]">
          Desde <span className="font-heading text-base text-[var(--text)]">{trainer.priceFrom}€</span>/ses.
        </p>
        <Link
          href={`/entrenadores/${trainer.slug}`}
          className="rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[var(--ink)] transition-transform group-hover:-translate-y-0.5"
        >
          Ver perfil
        </Link>
      </div>
    </article>
  );
}
