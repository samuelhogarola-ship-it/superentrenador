"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronDown, RotateCcw, SlidersHorizontal } from "lucide-react";
import type { MarketplaceCity } from "@/types/marketplace";

interface FiltersBarProps {
  specialties: string[];
  modalities: string[];
  cities: MarketplaceCity[];
  basePath: string;
  lockCity?: boolean;
}

export function FiltersBar({ specialties, modalities, cities, basePath, lockCity = false }: FiltersBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasActiveFilters = searchParams.toString().length > 0;
  const paperClass =
    "rounded-[26px] border border-black/10 bg-[linear-gradient(180deg,rgba(255,253,250,0.98),rgba(247,245,239,0.94))] p-3 text-[var(--ink)] shadow-[0_24px_64px_rgba(0,0,0,0.24)] sm:p-4";

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${basePath}${params.toString() ? `?${params.toString()}` : ""}`);
  }

  const selectClass =
    "min-h-[50px] w-full appearance-none border-0 bg-transparent px-4 pr-10 text-sm font-semibold text-[var(--ink)] outline-none sm:min-w-[190px]";

  const selectWrapClass =
    "relative rounded-[18px] border border-black/10 bg-white/75 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_12px_30px_rgba(7,9,14,0.06)] transition focus-within:-translate-y-0.5 focus-within:border-[rgba(240,160,0,0.55)] focus-within:shadow-[0_0_0_4px_rgba(240,160,0,0.14),0_18px_42px_rgba(7,9,14,0.10)]";

  return (
    <div className={paperClass}>
      <span className="mb-3 inline-flex items-center gap-2 px-2 text-sm font-semibold text-[var(--paper-muted)] sm:hidden">
        <SlidersHorizontal size={15} />
        Filtrar
      </span>

      <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
        <span className="hidden items-center gap-2 px-2 text-sm font-bold text-[var(--paper-muted)] sm:inline-flex">
          <SlidersHorizontal size={15} />
          Filtrar
        </span>

        <span className={`${selectWrapClass} col-span-2 sm:col-span-1`}>
          <select
            aria-label="Filtrar por especialidad"
            defaultValue={searchParams.get("specialty") ?? ""}
            onChange={(event) => updateParam("specialty", event.target.value)}
            className={selectClass}
          >
            <option value="">Todas las especialidades</option>
            {specialties.map((specialty) => (
              <option key={specialty} value={specialty}>
                {specialty}
              </option>
            ))}
          </select>
          <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--paper-muted)]" />
        </span>

        {lockCity ? null : (
          <span className={selectWrapClass}>
            <select
              aria-label="Filtrar por ciudad"
              defaultValue={searchParams.get("city") ?? ""}
              onChange={(event) => updateParam("city", event.target.value)}
              className={selectClass}
            >
              <option value="">Todas las ciudades</option>
              {cities.map((city) => (
                <option key={city.slug} value={city.slug}>
                  {city.name}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--paper-muted)]" />
          </span>
        )}

        <span className={selectWrapClass}>
          <select
            aria-label="Filtrar por modalidad"
            defaultValue={searchParams.get("modality") ?? ""}
            onChange={(event) => updateParam("modality", event.target.value)}
            className={selectClass}
          >
            <option value="">Cualquier modalidad</option>
            {modalities.map((modality) => (
              <option key={modality} value={modality}>
                {modality}
              </option>
            ))}
          </select>
          <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--paper-muted)]" />
        </span>

        <span className={`${selectWrapClass} col-span-2 sm:col-span-1 sm:ml-auto`}>
          <select
            aria-label="Ordenar perfiles"
            defaultValue={searchParams.get("sort") ?? "featured"}
            onChange={(event) => updateParam("sort", event.target.value)}
            className={selectClass}
          >
            <option value="featured">Recomendados</option>
            <option value="rating">Mejor valorados</option>
            <option value="price-asc">Precio: menor a mayor</option>
            <option value="price-desc">Precio: mayor a menor</option>
          </select>
          <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--paper-muted)]" />
        </span>

        {hasActiveFilters ? (
          <Link
            href={basePath}
            className="col-span-2 inline-flex min-h-[50px] items-center justify-center gap-2 rounded-[18px] border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold text-[var(--paper-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--ink)] sm:col-span-1"
          >
            <RotateCcw size={14} />
            Limpiar
          </Link>
        ) : null}
      </div>
    </div>
  );
}
