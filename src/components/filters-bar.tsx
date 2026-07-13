"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { RotateCcw, SlidersHorizontal } from "lucide-react";
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
    "w-full rounded-full border border-[var(--line)] bg-[var(--bg-soft)] px-4 py-2 text-sm font-medium text-[var(--text)] outline-none sm:w-auto";

  return (
    <div className="app-surface rounded-[20px] p-3">
      <span className="mb-2 inline-flex items-center gap-2 px-2 text-sm font-semibold text-[var(--muted)] sm:hidden">
        <SlidersHorizontal size={15} />
        Filtrar
      </span>

      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
        <span className="hidden items-center gap-2 px-2 text-sm font-semibold text-[var(--muted)] sm:inline-flex">
          <SlidersHorizontal size={15} />
          Filtrar
        </span>

        <select
          defaultValue={searchParams.get("specialty") ?? ""}
          onChange={(event) => updateParam("specialty", event.target.value)}
          className={`${selectClass} col-span-2 sm:col-span-1`}
        >
          <option value="">Todas las especialidades</option>
          {specialties.map((specialty) => (
            <option key={specialty} value={specialty}>
              {specialty}
            </option>
          ))}
        </select>

        {lockCity ? null : (
          <select
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
        )}

        <select
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

        <select
          defaultValue={searchParams.get("sort") ?? "rating"}
          onChange={(event) => updateParam("sort", event.target.value)}
          className={`${selectClass} col-span-2 sm:col-span-1 sm:ml-auto`}
        >
          <option value="rating">Mejor valorados</option>
          <option value="price-asc">Precio: menor a mayor</option>
          <option value="price-desc">Precio: mayor a menor</option>
        </select>

        {hasActiveFilters ? (
          <Link
            href={basePath}
            className="col-span-2 inline-flex items-center justify-center gap-2 rounded-full border border-[var(--line)] px-4 py-2 text-sm font-semibold text-[var(--muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] sm:col-span-1"
          >
            <RotateCcw size={14} />
            Limpiar
          </Link>
        ) : null}
      </div>
    </div>
  );
}
