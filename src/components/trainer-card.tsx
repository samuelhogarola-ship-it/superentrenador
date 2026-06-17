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
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar name={trainer.displayName} size="md" />
          <div>
            <h3 className="font-heading text-xl text-[var(--text)]">{trainer.displayName}</h3>
            <p className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-[var(--muted)]">
              <MapPin size={12} className="text-[var(--accent)]" />
              {trainer.city} · {trainer.region}
            </p>
          </div>
        </div>
        {trainer.verified ? (
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700">
            <BadgeCheck size={13} />
            Verificado
          </span>
        ) : null}
      </div>

      <p className="mt-5 text-base font-semibold leading-snug text-[var(--text)]">{trainer.headline}</p>
      <p className="app-copy mt-2 line-clamp-2 text-sm">{trainer.shortBio}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {trainer.specialties.slice(0, 3).map((specialty) => (
          <span
            key={specialty}
            className="rounded-full border border-[var(--line)] bg-[var(--bg-soft)] px-3 py-1 text-xs font-medium text-[var(--text)]"
          >
            {specialty}
          </span>
        ))}
      </div>

      <div className="mt-5">
        <RatingStars rating={trainer.rating} reviewsCount={trainer.reviewsCount} />
      </div>

      <div className="mt-6 flex items-center justify-between gap-4 border-t border-[var(--line)] pt-5">
        <div>
          <p className="text-xs text-[var(--muted)]">Desde</p>
          <p className="font-heading text-2xl text-[var(--text)]">
            {trainer.priceFrom}€<span className="text-sm font-medium text-[var(--muted)]"> /sesión</span>
          </p>
        </div>
        <Link
          href={`/entrenadores/${trainer.slug}`}
          className="rounded-full bg-[var(--text)] px-5 py-2.5 text-sm font-semibold text-white transition-transform group-hover:-translate-y-0.5"
        >
          Ver perfil
        </Link>
      </div>
    </article>
  );
}
