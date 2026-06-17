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
      className="app-surface flex flex-col gap-2 rounded-[26px] p-2.5 sm:flex-row sm:items-center sm:rounded-full"
    >
      <label className="flex flex-1 items-center gap-3 rounded-[20px] px-4 py-3 sm:rounded-full">
        <Sparkles size={18} className="shrink-0 text-[var(--accent)]" />
        <span className="relative flex-1">
          <select
            name="specialty"
            defaultValue=""
            className="w-full appearance-none bg-transparent text-sm font-semibold text-[var(--text)] outline-none"
          >
            <option value="">¿Qué quieres entrenar?</option>
            {specialties.map((specialty) => (
              <option key={specialty} value={specialty}>
                {specialty}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
        </span>
      </label>

      <span className="hidden h-8 w-px bg-[var(--line)] sm:block" aria-hidden="true" />

      <label className="flex flex-1 items-center gap-3 rounded-[20px] px-4 py-3 sm:rounded-full">
        <MapPin size={18} className="shrink-0 text-[var(--accent)]" />
        <span className="relative flex-1">
          <select
            name="city"
            defaultValue=""
            className="w-full appearance-none bg-transparent text-sm font-semibold text-[var(--text)] outline-none"
          >
            <option value="">¿Dónde?</option>
            {cities.map((city) => (
              <option key={city.slug} value={city.slug}>
                {city.name}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
        </span>
      </label>

      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 rounded-[20px] bg-[var(--text)] px-6 py-3.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5 sm:rounded-full"
      >
        <Search size={17} />
        Buscar entrenador
      </button>
    </form>
  );
}
