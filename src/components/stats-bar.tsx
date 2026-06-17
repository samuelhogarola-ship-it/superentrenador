import { MapPinned, MessageSquareText, Star, Users } from "lucide-react";

interface StatsBarProps {
  totalTrainers: number;
  avgRating: number;
  totalReviews: number;
  totalCities: number;
}

export function StatsBar({ totalTrainers, avgRating, totalReviews, totalCities }: StatsBarProps) {
  const stats = [
    { icon: Users, value: `${totalTrainers}+`, label: "Entrenadores verificados" },
    { icon: Star, value: avgRating.toFixed(1), label: "Valoración media" },
    { icon: MessageSquareText, value: `${totalReviews}+`, label: "Opiniones reales" },
    { icon: MapPinned, value: `${totalCities}`, label: "Ciudades activas" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="flex items-center gap-3 rounded-[22px] border border-[var(--line)] bg-white px-4 py-3.5"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)]">
              <Icon size={17} className="text-[var(--accent)]" />
            </span>
            <span className="flex flex-col leading-tight">
              <strong className="font-heading text-lg text-[var(--text)]">{stat.value}</strong>
              <span className="text-xs text-[var(--muted)]">{stat.label}</span>
            </span>
          </div>
        );
      })}
    </div>
  );
}
