import { MapPinned, ShieldCheck, Star, Users } from "lucide-react";

interface StatsBarProps {
  totalTrainers: number;
  totalCities: number;
  totalReviews: number;
  avgRating: number;
}

export function StatsBar({ totalTrainers, totalCities, totalReviews, avgRating }: StatsBarProps) {
  const hasReviews = totalReviews > 0;
  const stats = [
    { icon: Users, value: `${totalTrainers}`, label: "Perfiles para comparar" },
    { icon: MapPinned, value: `${totalCities}`, label: "Ciudades" },
    { icon: Star, value: hasReviews ? avgRating.toFixed(1) : "Revisión", label: hasReviews ? `${totalReviews} reseñas` : "Editorial previa" },
    { icon: ShieldCheck, value: "Registro", label: "Contacto protegido" },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="rounded-[20px] border border-[var(--line)] bg-[var(--surface)] px-4 py-4"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
                {stat.label}
              </span>
              <Icon size={16} className="text-[var(--accent)]" />
            </div>
            <strong className="mt-3 block font-heading text-3xl text-[var(--text)]">{stat.value}</strong>
          </div>
        );
      })}
    </div>
  );
}
