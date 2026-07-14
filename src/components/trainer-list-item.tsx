import Link from "next/link";
import { BadgeCheck, MapPin, ShieldCheck } from "lucide-react";
import { Avatar } from "@/components/avatar";
import type { PublicTrainerProfile } from "@/types/marketplace";

interface TrainerListItemProps {
  trainer: PublicTrainerProfile;
}

export function TrainerListItem({ trainer }: TrainerListItemProps) {
  return (
    <article className="group flex flex-col gap-5 rounded-[24px] border border-[var(--line)] bg-[linear-gradient(180deg,#fff,#fcfaf5)] p-5 shadow-[var(--shadow-soft)] transition duration-200 hover:-translate-y-0.5 hover:border-[var(--line-strong)] hover:shadow-[var(--shadow)] sm:flex-row sm:gap-6 sm:p-6">
      <div className="shrink-0 self-start">
        <Avatar name={trainer.displayName} photoUrl={trainer.photoUrl} size="xl" />
      </div>

      <div className="flex flex-1 flex-col gap-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-heading text-xl text-[var(--text)]">{trainer.displayName}</h3>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
              trainer.verified ? "bg-emerald-500/10 text-emerald-700" : "bg-[var(--gold-soft)] text-[var(--gold)]"
            }`}
          >
            {trainer.verified ? <BadgeCheck size={13} /> : <ShieldCheck size={13} />}
            {trainer.verified ? "Verificado" : "En revisión"}
          </span>
        </div>

        <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-[var(--muted)]">
          <MapPin size={13} className="text-[var(--accent)]" />
          {trainer.city} · {trainer.region}
        </p>

        <p className="mt-2 text-sm font-semibold text-[var(--accent)]">Perfil revisado editorialmente</p>

        <p className="mt-2 line-clamp-2 text-sm text-[var(--text)]">{trainer.headline}</p>

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

        <div className="mt-4 flex flex-wrap gap-2 text-xs text-[var(--muted)]">
          <span className="rounded-full border border-[var(--line)] bg-white/70 px-3 py-1.5">
            {trainer.yearsExperience} años de experiencia
          </span>
          <span className="rounded-full border border-[var(--line)] bg-white/70 px-3 py-1.5">
            {trainer.modalities.join(" · ")}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 flex-row items-center justify-between gap-3 border-t border-[var(--line)] pt-4 sm:flex-col sm:items-end sm:justify-center sm:border-t-0 sm:border-l sm:pl-6 sm:pt-0">
        <div className="text-right">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">Desde</p>
          <p className="font-heading text-2xl text-[var(--text)]">
            {trainer.priceFrom}€<span className="text-sm font-medium text-[var(--muted)]"> /ses.</span>
          </p>
        </div>
        <Link
          href={`/entrenadores/${trainer.slug}`}
          className="inline-flex items-center justify-center rounded-full border border-[var(--text)] bg-[var(--text)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-[var(--accent)] hover:bg-[var(--accent)]"
        >
          Ver perfil
        </Link>
      </div>
    </article>
  );
}
