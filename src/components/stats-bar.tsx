import { MapPinned, ShieldCheck, Users } from "lucide-react";

interface StatsBarProps {
  totalTrainers: number;
  totalCities: number;
}

export function StatsBar({ totalTrainers, totalCities }: StatsBarProps) {
  const stats = [
    { icon: Users, value: `${totalTrainers}`, label: "Perfiles publicados" },
    { icon: MapPinned, value: `${totalCities}`, label: "Ciudades" },
    { icon: ShieldCheck, value: "100%", label: "Contacto protegido" },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-3">
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
