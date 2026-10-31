"use client";

import { useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronDown, RotateCcw } from "lucide-react";
import type { MarketplaceCity } from "@/types/marketplace";

interface FiltersBarProps {
  categories: string[];
  specialties: string[];
  cities: MarketplaceCity[];
  basePath: string;
  lockCity?: boolean;
}

export function FiltersBar({ categories, specialties, cities, basePath, lockCity = false }: FiltersBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cityInputRef = useRef<HTMLInputElement>(null);
  const [locationHint, setLocationHint] = useState("");
  const hasActiveFilters = searchParams.toString().length > 0;
  const cityParam = searchParams.get("city") ?? "";
  const cityValue = cities.find((city) => city.slug === cityParam)?.name ?? cityParam;

  function updateParams(changes: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(changes)) {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    }
    router.push(`${basePath}${params.toString() ? `?${params.toString()}` : ""}`);
  }

  function updateParam(key: string, value: string) {
    updateParams({ [key]: value });
  }

  const modalityValue = searchParams.get("nearby") === "1"
    ? "nearby"
    : searchParams.get("modality") ?? "";

  const selectClass =
    "min-h-11 w-full appearance-none border-0 bg-transparent px-3 pr-9 text-sm font-semibold text-[#111214] outline-none";

  const selectWrapClass =
    "relative rounded-full border border-[#111214]/12 bg-[#f7f7f5] transition-colors focus-within:border-[#111214]/45 focus-within:bg-white";

  return (
    <div className="border-y border-[#111214]/10 py-4">
      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 lg:grid-cols-6">
        <span className={`${selectWrapClass} col-span-2 md:col-span-1`}>
          <select
            aria-label="Filtrar por categoría"
            value={searchParams.get("category") ?? ""}
            onChange={(event) => updateParam("category", event.target.value)}
            className={selectClass}
          >
            <option value="">Categoría</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#8a8a92]" />
        </span>

        <span className={`${selectWrapClass} col-span-2 md:col-span-1`}>
          <select
            aria-label="Filtrar por especialidad"
            value={searchParams.get("specialty") ?? ""}
            onChange={(event) => updateParam("specialty", event.target.value)}
            className={selectClass}
          >
            <option value="">Especialidad</option>
            {specialties.map((specialty) => (
              <option key={specialty} value={specialty}>
                {specialty}
              </option>
            ))}
          </select>
          <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#8a8a92]" />
        </span>

        {lockCity ? null : (
          <span className={`${selectWrapClass} col-span-2 md:col-span-1`}>
            <input
              ref={cityInputRef}
              key={cityParam}
              list="filter-city-options"
              defaultValue={cityValue}
              placeholder="Cualquier ciudad"
              aria-label="Filtrar por ciudad"
              aria-describedby={locationHint ? "nearby-location-hint" : undefined}
              autoComplete="address-level2"
              onBlur={(event) => updateParam("city", event.currentTarget.value.trim())}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  event.currentTarget.blur();
                }
              }}
              className={selectClass}
            />
            <datalist id="filter-city-options">
              {cities.map((city) => <option key={city.slug} value={city.name} />)}
            </datalist>
          </span>
        )}

        <span className={selectWrapClass}>
          <select
            aria-label="Filtrar por ubicación o modalidad"
            value={modalityValue}
            onChange={(event) => {
              const value = event.target.value;
              if (value === "nearby" && !lockCity && !cityParam) {
                setLocationHint("Escribe una ciudad para buscar entrenadores presenciales cerca de ti.");
                cityInputRef.current?.focus();
                return;
              }
              setLocationHint("");
              updateParams(value === "nearby"
                ? { nearby: "1", modality: "Presencial" }
                : { nearby: "", modality: value });
            }}
            className={selectClass}
          >
            <option value="">Modalidad</option>
            <option value="nearby">Cerca de mí</option>
            <option value="Presencial">Presencial</option>
            <option value="Online">Online</option>
          </select>
          <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#8a8a92]" />
        </span>

        <span className={selectWrapClass}>
          <select
            aria-label="Filtrar por precio máximo"
            value={searchParams.get("maxPrice") ?? ""}
            onChange={(event) => updateParam("maxPrice", event.target.value)}
            className={selectClass}
          >
            <option value="">Cualquier precio</option>
            <option value="25">Hasta 25 €</option>
            <option value="40">Hasta 40 €</option>
            <option value="60">Hasta 60 €</option>
            <option value="100">Hasta 100 €</option>
          </select>
          <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8a8a92]" />
        </span>

        <span className={selectWrapClass}>
          <select
            aria-label="Ordenar perfiles"
            value={searchParams.get("sort") ?? "featured"}
            onChange={(event) => updateParam("sort", event.target.value)}
            className={selectClass}
          >
            <option value="featured">Recomendados</option>
            <option value="rating">Mejor valorados</option>
            <option value="price-asc">Precio: menor a mayor</option>
            <option value="price-desc">Precio: mayor a menor</option>
          </select>
          <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8a8a92]" />
        </span>

        {hasActiveFilters ? (
          <Link
            href={basePath}
            className="col-span-2 inline-flex min-h-11 items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-[#5b5b63] transition-colors hover:text-[#111214] md:col-span-1 lg:col-start-6"
          >
            <RotateCcw size={14} />
            Limpiar
          </Link>
        ) : null}
      </div>
      {locationHint ? (
        <p id="nearby-location-hint" role="status" className="mt-2 px-2 text-xs font-medium text-[#76500e]">
          {locationHint}
        </p>
      ) : null}
    </div>
  );
}
