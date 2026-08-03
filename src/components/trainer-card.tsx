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
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[22px] border border-[#e6e6e6] bg-white text-[var(--ink)] shadow-[0_12px_30px_rgba(7,9,14,0.08)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(7,9,14,0.14)]">
      {featured ? (
        <span className="absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-[var(--accent)] shadow-sm">
          Selección destacada
        </span>
      ) : null}

      <div className="trainer-card-cover flex h-40 items-end px-5 pb-4">
        <Avatar name={trainer.displayName} photoUrl={trainer.photoUrl} size="lg" className="ring-4 ring-white" />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2">
          <h3 className="font-heading text-xl text-[var(--ink)]">{trainer.displayName}</h3>
          {trainer.verified ? <BadgeCheck size={17} className="text-[var(--accent-2)]" /> : <ShieldCheck size={17} className="text-[var(--accent)]" />}
        </div>
        <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-[#656565]">
          <MapPin size={14} className="text-[var(--accent)]" />
          {trainer.city} ({trainer.modalities.join(" · ")})
        </p>
        {trainer.reviewsCount > 0 ? (
          <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-[var(--ink)]">
            <Star size={16} className="fill-[var(--accent)] text-[var(--accent)]" />
            {trainer.rating.toFixed(1)} ({trainer.reviewsCount} opiniones)
          </p>
        ) : null}
        {trainer.category || trainer.specialties.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {trainer.category ? <span className="rounded-full bg-[#fff0ee] px-2.5 py-1 text-xs font-bold text-[#d85e5e]">{trainer.category}</span> : null}
            {trainer.specialties.slice(0, 3).map((specialty) => (
              <span key={specialty} className="rounded-full bg-[#f3f5f6] px-2.5 py-1 text-xs font-semibold text-[#656565]">{specialty}</span>
            ))}
          </div>
        ) : null}
        <p className="mt-4 line-clamp-2 text-sm leading-6 text-[#656565]">{trainer.headline}</p>
        <div className="mt-auto flex items-end justify-between gap-4 border-t border-[#ededed] pt-5">
          <p className="font-heading text-2xl text-[var(--ink)]">
            {trainer.priceFrom > 0 ? `${trainer.priceFrom}€` : ""}
            {trainer.priceFrom > 0 ? <span className="ml-1 text-sm font-medium text-[#656565]">/ {trainer.priceUnit ?? "sesión"}</span> : null}
          </p>
          <Link
            href={`/entrenadores/${trainer.slug}`}
            className="inline-flex items-center gap-2 font-bold text-[var(--accent)] transition-colors hover:text-[var(--ink)]"
          >
            Ver perfil
            <MessageCircle size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}
