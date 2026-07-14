import { ChevronDown, MapPin, Search, Sparkles } from "lucide-react";
import type { MarketplaceCity } from "@/types/marketplace";

interface HeroSearchBarProps {
  specialties: string[];
  cities: MarketplaceCity[];
}

export function HeroSearchBar({ specialties, cities }: HeroSearchBarProps) {
  return (
    <form
      action="/entrenadores"
      method="get"
      className="grid gap-3 rounded-[20px] border border-[var(--line-strong)] bg-[var(--surface)] p-3 shadow-[var(--shadow-soft)] sm:grid-cols-[1.1fr_1fr_auto] sm:items-center"
    >
      <label className="flex min-w-0 items-center gap-3 rounded-[16px] border border-[var(--line)] bg-[var(--panel-strong)] px-4 py-3">
        <Sparkles size={18} className="shrink-0 text-[var(--accent)]" />
        <span className="min-w-0 flex-1">
          <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
            Especialidad
          </span>
          <select
            name="specialty"
            defaultValue=""
            aria-label="Filtrar por especialidad"
            className="w-full appearance-none bg-transparent text-sm font-semibold text-[var(--text)] outline-none"
          >
            <option value="">¿Qué quieres entrenar?</option>
            {specialties.map((specialty) => (
              <option key={specialty} value={specialty}>
                {specialty}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="pointer-events-none -ml-5 shrink-0 text-[var(--muted)]" />
        </span>
      </label>

      <label className="flex min-w-0 items-center gap-3 rounded-[16px] border border-[var(--line)] bg-[var(--panel-strong)] px-4 py-3">
        <MapPin size={18} className="shrink-0 text-[var(--accent)]" />
        <span className="min-w-0 flex-1">
          <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
            Ciudad
          </span>
          <select
            name="city"
            defaultValue=""
            aria-label="Filtrar por ciudad"
            className="w-full appearance-none bg-transparent text-sm font-semibold text-[var(--text)] outline-none"
          >
            <option value="">¿Dónde?</option>
            {cities.map((city) => (
              <option key={city.slug} value={city.slug}>
                {city.name}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="pointer-events-none -ml-5 shrink-0 text-[var(--muted)]" />
        </span>
      </label>

      <button
        type="submit"
        className="inline-flex min-h-[56px] items-center justify-center gap-2 rounded-[16px] bg-[var(--accent)] px-6 py-3.5 text-sm font-bold text-white transition-colors hover:opacity-95"
      >
        <Search size={17} />
        Buscar entrenador
      </button>
    </form>
  );
}
