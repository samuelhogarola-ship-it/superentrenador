import { ChevronDown, MapPin, Search, Sparkles } from "lucide-react";
import type { MarketplaceCity } from "@/types/marketplace";

interface HeroSearchBarProps {
  specialties: string[];
  cities: MarketplaceCity[];
}

export function HeroSearchBar({ specialties, cities }: HeroSearchBarProps) {
  const paperClass =
    "grid gap-3 rounded-[28px] border border-black/10 bg-[linear-gradient(180deg,rgba(255,253,250,0.98),rgba(247,245,239,0.94))] p-3 text-[var(--ink)] shadow-[0_26px_70px_rgba(0,0,0,0.28)] sm:grid-cols-[1.15fr_1fr_auto] sm:items-stretch";
  const fieldClass =
    "relative flex min-w-0 items-center gap-4 rounded-[22px] border border-black/10 bg-white/75 px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_12px_30px_rgba(7,9,14,0.06)] transition focus-within:-translate-y-0.5 focus-within:border-[rgba(240,160,0,0.55)] focus-within:shadow-[0_0_0_4px_rgba(240,160,0,0.14),0_18px_42px_rgba(7,9,14,0.10)] sm:min-h-[76px]";
  const selectClass = "w-full appearance-none border-0 bg-transparent text-base font-semibold text-[var(--ink)] outline-none sm:text-lg";

  return (
    <form
      action="/entrenadores"
      method="get"
      className={paperClass}
    >
      <label className={fieldClass}>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--blue-soft)] text-[var(--accent-2)]">
          <Sparkles size={19} />
        </span>
        <span className="relative min-w-0 flex-1 pr-6">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--paper-muted)]">
            Especialidad
          </span>
          <select
            name="specialty"
            defaultValue=""
            aria-label="Filtrar por especialidad"
            className={selectClass}
          >
            <option value="">¿Qué quieres entrenar?</option>
            {specialties.map((specialty) => (
              <option key={specialty} value={specialty}>
                {specialty}
              </option>
            ))}
          </select>
          <ChevronDown size={18} className="pointer-events-none absolute bottom-1.5 right-0 text-[var(--paper-muted)]" />
        </span>
      </label>

      <label className={fieldClass}>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--gold-soft)] text-[var(--accent)]">
          <MapPin size={19} />
        </span>
        <span className="relative min-w-0 flex-1 pr-6">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--paper-muted)]">
            Ciudad
          </span>
          <select
            name="city"
            defaultValue=""
            aria-label="Filtrar por ciudad"
            className={selectClass}
          >
            <option value="">¿Dónde?</option>
            {cities.map((city) => (
              <option key={city.slug} value={city.slug}>
                {city.name}
              </option>
            ))}
          </select>
          <ChevronDown size={18} className="pointer-events-none absolute bottom-1.5 right-0 text-[var(--paper-muted)]" />
        </span>
      </label>

      <button
        type="submit"
        className="inline-flex min-h-[68px] items-center justify-center gap-2 rounded-[22px] bg-[var(--ink)] px-7 py-4 text-sm font-bold text-[var(--accent)] shadow-[0_18px_42px_rgba(7,9,14,0.28)] transition-transform hover:-translate-y-0.5 sm:min-h-[76px]"
      >
        <Search size={17} />
        Buscar entrenador
      </button>
    </form>
  );
}
