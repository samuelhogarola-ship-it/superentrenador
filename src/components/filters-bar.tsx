"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronDown, RotateCcw, SlidersHorizontal } from "lucide-react";
import type { MarketplaceCity } from "@/types/marketplace";

interface FiltersBarProps {
  categories: string[];
  specialties: string[];
  modalities: string[];
  cities: MarketplaceCity[];
  basePath: string;
  lockCity?: boolean;
}

export function FiltersBar({ categories, specialties, modalities, cities, basePath, lockCity = false }: FiltersBarProps) {
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
    "min-h-[50px] w-full appearance-none border-0 bg-transparent px-4 pr-10 text-sm font-semibold text-[#111214] outline-none sm:min-w-[190px]";

  const selectWrapClass =
    "relative border border-[#111214]/15 bg-white transition-colors focus-within:border-[#111214]";

  return (
    <div className="border border-[#111214] bg-white p-3 sm:p-4">
      <span className="mb-3 inline-flex items-center gap-2 px-2 text-sm font-semibold text-[#5b5b63] sm:hidden">
        <SlidersHorizontal size={15} />
        Filtrar
      </span>

      <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
        <span className="hidden items-center gap-2 px-2 text-sm font-bold text-[#5b5b63] sm:inline-flex">
          <SlidersHorizontal size={15} />
          Filtrar
        </span>

        <span className={`${selectWrapClass} col-span-2 sm:col-span-1`}>
          <select
            aria-label="Filtrar por categoría"
            defaultValue={searchParams.get("category") ?? ""}
            onChange={(event) => updateParam("category", event.target.value)}
            className={selectClass}
          >
            <option value="">Todas las categorías</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#8a8a92]" />
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
          <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#8a8a92]" />
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
            <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#8a8a92]" />
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
          <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#8a8a92]" />
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
          <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#8a8a92]" />
        </span>

        {hasActiveFilters ? (
          <Link
            href={basePath}
            className="col-span-2 inline-flex min-h-[50px] items-center justify-center gap-2 border border-[#111214]/15 bg-white px-4 py-2 text-sm font-semibold text-[#5b5b63] transition-colors hover:border-[#111214] hover:text-[#111214] sm:col-span-1"
          >
            <RotateCcw size={14} />
            Limpiar
          </Link>
        ) : null}
      </div>
    </div>
  );
}
