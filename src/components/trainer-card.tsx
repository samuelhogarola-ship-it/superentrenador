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
    <article className="group relative flex h-full flex-col rounded-[20px] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[var(--shadow-soft)] transition-colors hover:border-[var(--line-strong)]">
      {featured ? (
        <span className="absolute -top-3 left-6 inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1 text-xs font-bold text-[var(--accent)] shadow-[var(--shadow-soft)]">
          Selección destacada
        </span>
      ) : null}

      <div className="flex items-start gap-4">
        <div className="shrink-0">
          <Avatar name={trainer.displayName} photoUrl={trainer.photoUrl} size="lg" />
        </div>

        <div className="min-w-0 flex-1">
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
          <div className="mt-3">
            <RatingStars rating={trainer.rating} reviewsCount={trainer.reviewsCount} />
          </div>
        </div>
      </div>

      <p className="mt-5 text-base font-semibold leading-snug text-[var(--text)]">{trainer.headline}</p>
      <p className="app-copy mt-2 line-clamp-2 text-sm">{trainer.shortBio}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {trainer.specialties.slice(0, 2).map((specialty) => (
          <span
            key={specialty}
            className="rounded-full bg-[var(--bg-soft)] px-3 py-1 text-xs font-medium text-[var(--text)]"
          >
            {specialty}
          </span>
        ))}
      </div>

      <div className="mt-6 flex items-end justify-between gap-4 border-t border-[var(--line)] pt-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">Desde</p>
          <p className="mt-1 font-heading text-2xl text-[var(--text)]">
            {trainer.priceFrom}€<span className="ml-1 text-sm font-medium text-[var(--muted)]">/ sesión</span>
          </p>
        </div>
        <Link
          href={`/entrenadores/${trainer.slug}`}
          className="rounded-full border border-[var(--line-strong)] bg-[var(--surface)] px-5 py-2.5 text-sm font-semibold text-[var(--text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          Ver perfil
        </Link>
      </div>
    </article>
  );
}
