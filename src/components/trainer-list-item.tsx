import Link from "next/link";
import { BadgeCheck, CalendarCheck2, Clock3, MapPin, MessageCircle, ShieldCheck, Star, Video } from "lucide-react";
import { Avatar } from "@/components/avatar";
import type { PublicTrainerProfile } from "@/types/marketplace";

interface TrainerListItemProps {
  trainer: PublicTrainerProfile;
}

export function TrainerListItem({ trainer }: TrainerListItemProps) {
  const hasOnline = trainer.modalities.includes("Online");
  const responseLabel = trainer.verified ? "Responde en el día" : "Perfil revisado";

  return (
    <article className="group flex flex-col gap-5 border border-[#111214] bg-white p-5 text-[#111214] transition-shadow duration-150 hover:shadow-[6px_6px_0_0_#111214] sm:flex-row sm:gap-6 sm:p-6">
      <div className="shrink-0 self-start">
        <Avatar name={trainer.displayName} photoUrl={trainer.photoUrl} size="xl" />
      </div>

      <div className="flex flex-1 flex-col gap-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-heading text-xl font-bold text-[#111214]">{trainer.displayName}</h3>
          <span
            className={`inline-flex items-center gap-1 border px-2 py-0.5 text-xs font-semibold ${
              trainer.verified
                ? "border-[var(--accent)] text-[#8a5c0f]"
                : "border-[#111214]/15 text-[#5b5b63]"
            }`}
          >
            {trainer.verified ? <BadgeCheck size={13} /> : <ShieldCheck size={13} />}
            {trainer.verified ? "Identidad verificada" : "Perfil aprobado"}
          </span>
        </div>

        <p className="mt-1.5 inline-flex items-center gap-1.5 text-sm text-[#5b5b63]">
          <MapPin size={13} className="text-[var(--accent)]" />
          {trainer.city} · {trainer.region}
        </p>

        {trainer.reviewsCount > 0 ? (
          <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-[#111214]">
            <Star size={14} className="fill-[var(--accent)] text-[var(--accent)]" />
            {trainer.rating.toFixed(1)} · {trainer.reviewsCount} reseñas
          </p>
        ) : (
          <p className="mt-2 text-sm font-semibold text-[#8a8a92]">Nuevo en Super Entrenador</p>
        )}

        <p className="mt-2 line-clamp-2 text-sm font-medium leading-6 text-[#3d3d42]">{trainer.headline}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {trainer.specialties.slice(0, 2).map((specialty) => (
            <span key={specialty} className="border border-[#111214]/15 px-2.5 py-1 text-xs font-semibold text-[#111214]">
              {specialty}
            </span>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-xs font-semibold text-[#5b5b63]">
          <span>{trainer.yearsExperience} años de experiencia</span>
          <span className="text-[#111214]/20">·</span>
          <span>{trainer.modalities.join(" · ")}</span>
        </div>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs font-semibold text-[#5b5b63]">
          <span className="inline-flex items-center gap-1.5">
            <Clock3 size={13} className="text-[var(--accent)]" />
            {responseLabel}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Video size={13} className="text-[var(--accent-2)]" />
            {hasOnline ? "Online disponible" : "Trabajo presencial"}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarCheck2 size={13} className="text-[var(--accent)]" />
            Primera consulta
          </span>
        </div>
      </div>

      <div className="flex shrink-0 flex-row items-center justify-between gap-3 border-t border-[#111214]/12 pt-4 sm:flex-col sm:items-end sm:justify-center sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
        <div className="text-right">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#8a8a92]">Desde</p>
          <p className="font-heading text-3xl font-bold text-[#111214]">
            {trainer.priceFrom}€<span className="text-sm font-medium text-[#8a8a92]"> /ses.</span>
          </p>
        </div>
        <Link
          href={`/entrenadores/${trainer.slug}`}
          className="inline-flex items-center justify-center gap-2 bg-[#111214] px-5 py-3 text-sm font-bold text-white transition-colors group-hover:bg-[var(--accent)] group-hover:text-[#111214]"
        >
          Ver perfil
          <MessageCircle size={15} />
        </Link>
      </div>
    </article>
  );
}
