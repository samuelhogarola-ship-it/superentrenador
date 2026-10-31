"use client";

import { ArrowLeft, ArrowRight, MapPin, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { type KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import type { MarketplaceCity } from "@/types/marketplace";

interface HeroSearchBarProps {
  categories: string[];
  cities: MarketplaceCity[];
}

type SearchStep = "idle" | "category" | "city" | "modality";

const MODALITIES = ["Presencial", "Online", "Híbrido"] as const;
const SEARCH_EXAMPLES = ["Tenis", "PT", "Pádel"] as const;

function normalized(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es")
    .trim();
}

export function HeroSearchBar({ categories, cities }: HeroSearchBarProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<SearchStep>("idle");
  const [category, setCategory] = useState("");
  const [categoryQuery, setCategoryQuery] = useState("");
  const [city, setCity] = useState("");
  const [exampleIndex, setExampleIndex] = useState(0);

  const visibleCategories = useMemo(() => {
    const query = normalized(categoryQuery);
    if (!query) return categories;
    return categories.filter((item) => normalized(item).includes(query));
  }, [categories, categoryQuery]);

  useEffect(() => {
    if (step === "category" || step === "city") inputRef.current?.focus();
  }, [step]);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const interval = window.setInterval(() => {
      setExampleIndex((current) => (current + 1) % SEARCH_EXAMPLES.length);
    }, 2200);

    return () => window.clearInterval(interval);
  }, []);

  function activateSearch() {
    setStep("category");
  }

  function chooseCategory(value: string) {
    setCategory(value);
    setCategoryQuery(value);
    setStep("city");
  }

  function continueFromCategory() {
    const exact = categories.find((item) => normalized(item) === normalized(categoryQuery));
    const selected = exact ?? visibleCategories[0];
    if (selected) chooseCategory(selected);
  }

  function continueFromCity() {
    setCity((current) => current.trim());
    setStep("modality");
  }

  function runSearch(modality = "") {
    const params = new URLSearchParams();
    params.set("category", category);
    if (city.trim()) params.set("city", city.trim());
    if (modality) params.set("modality", modality);
    router.push(`/entrenadores?${params.toString()}`);
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      if (step === "category") continueFromCategory();
      else if (step === "city") continueFromCity();
    }
    if (event.key === "Escape") {
      setStep("idle");
      setCategoryQuery(category);
    }
  }

  function goBack() {
    if (step === "modality") setStep("city");
    else if (step === "city") setStep("category");
    else setStep("idle");
  }

  const stepLabel =
    step === "category"
      ? "Primero, elige una categoría"
      : step === "city"
        ? "Ahora indica dónde quieres entrenar"
        : step === "modality"
          ? "Por último, elige una modalidad"
          : "Activa la búsqueda para elegir una categoría";

  return (
    <div className="w-full">
      <div
        role="search"
        aria-label="Buscar entrenadores"
        className="flex min-h-[72px] w-full items-center gap-2 rounded-[24px] border border-black/10 bg-white p-2.5 text-[var(--ink)] shadow-[0_18px_45px_rgba(31,41,55,0.12)] sm:min-h-[78px] sm:gap-3 sm:p-3"
      >
        {step !== "idle" ? (
          <button
            type="button"
            onClick={goBack}
            aria-label="Volver al paso anterior"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-[#575b64] transition-colors hover:bg-[#f2f3f5] hover:text-[#111214]"
          >
            <ArrowLeft size={19} aria-hidden="true" />
          </button>
        ) : (
          <span className="ml-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#eef5fb] text-[#087dcc] sm:ml-0">
            <Search size={20} aria-hidden="true" />
          </span>
        )}

        <div className="min-w-0 flex-1">
          {step === "idle" ? (
            <button
              type="button"
              onClick={activateSearch}
              aria-label="¿Qué entrenador necesitas?"
              className="block w-full truncate px-1 text-left text-base font-bold text-[#111214] sm:text-lg"
            >
              Prueba con <span className="text-[#087dcc]">{SEARCH_EXAMPLES[exampleIndex]}</span>
            </button>
          ) : null}

          {step === "category" ? (
            <>
              <label htmlFor="hero-category" className="sr-only">Categoría de entrenamiento</label>
              <input
                ref={inputRef}
                id="hero-category"
                value={categoryQuery}
                onChange={(event) => setCategoryQuery(event.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Elige una categoría"
                autoComplete="off"
                aria-controls="hero-category-options"
                className="w-full border-0 bg-transparent px-1 text-base font-bold text-[#111214] outline-none placeholder:text-[#737780] sm:text-lg"
              />
            </>
          ) : null}

          {step === "city" ? (
            <>
              <label htmlFor="hero-city" className="sr-only">Ciudad donde quieres entrenar</label>
              <input
                ref={inputRef}
                id="hero-city"
                value={city}
                onChange={(event) => setCity(event.target.value)}
                onKeyDown={handleInputKeyDown}
                list="hero-city-options"
                placeholder="Ciudad o localidad"
                autoComplete="address-level2"
                className="w-full border-0 bg-transparent px-1 text-base font-bold text-[#111214] outline-none placeholder:text-[#737780] sm:text-lg"
              />
              <datalist id="hero-city-options">
                {cities.map((item) => <option key={item.slug} value={item.name} />)}
              </datalist>
            </>
          ) : null}

          {step === "modality" ? (
            <p className="truncate px-1 text-base font-bold text-[#111214] sm:text-lg">¿Cómo quieres entrenar?</p>
          ) : null}
        </div>

        {step !== "idle" && step !== "modality" ? (
          <button
            type="button"
            onClick={step === "category" ? continueFromCategory : continueFromCity}
            disabled={step === "category" && visibleCategories.length === 0}
            aria-label="Continuar"
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-[var(--accent)] text-[#111214] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 sm:h-14 sm:w-14"
          >
            <ArrowRight size={20} aria-hidden="true" />
          </button>
        ) : step === "modality" ? (
          <button type="button" onClick={() => runSearch()} className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-[18px] bg-[var(--accent)] px-4 text-sm font-bold text-[#111214] transition-transform hover:-translate-y-0.5 sm:min-h-14 sm:px-6">
            <Search size={17} aria-hidden="true" />
            <span className="hidden sm:inline">Buscar</span>
          </button>
        ) : (
          <button type="button" onClick={activateSearch} className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-[18px] bg-[var(--accent)] px-4 text-sm font-bold text-[#111214] transition-transform hover:-translate-y-0.5 sm:min-h-14 sm:px-6">
            Empezar
          </button>
        )}
      </div>

      <p className="sr-only" aria-live="polite">{stepLabel}</p>

      {step === "category" ? (
        <div id="hero-category-options" aria-label="Categorías disponibles" className="mt-3 flex w-full gap-1 overflow-x-auto border-y border-black/10 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {visibleCategories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => chooseCategory(item)}
              className="shrink-0 border-r border-black/10 px-4 py-1.5 text-sm font-semibold text-[#26282d] transition-colors first:pl-1 last:border-r-0 hover:text-[#087dcc] focus-visible:text-[#087dcc]"
            >
              {item}
            </button>
          ))}
          {visibleCategories.length === 0 ? <span className="px-1 py-1.5 text-sm text-[#676b73]">No hay categorías que coincidan.</span> : null}
        </div>
      ) : null}

      {step === "city" ? (
        <div className="mt-3 flex items-center gap-2 overflow-x-auto border-y border-black/10 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <MapPin size={16} className="ml-1 shrink-0 text-[#087dcc]" aria-hidden="true" />
          <button type="button" onClick={() => { setCity(""); setStep("modality"); }} className="shrink-0 px-2 py-1.5 text-sm font-semibold text-[#26282d] hover:text-[#087dcc]">
            Cualquier ciudad
          </button>
          {cities.slice(0, 6).map((item) => (
            <button key={item.slug} type="button" onClick={() => { setCity(item.name); setStep("modality"); }} className="shrink-0 border-l border-black/10 px-3 py-1.5 text-sm font-semibold text-[#26282d] hover:text-[#087dcc]">
              {item.name}
            </button>
          ))}
        </div>
      ) : null}

      {step === "modality" ? (
        <div aria-label="Modalidades disponibles" className="mt-3 flex items-center gap-1 overflow-x-auto border-y border-black/10 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button type="button" value="" onClick={() => runSearch()} className="shrink-0 px-3 py-1.5 text-sm font-semibold text-[#26282d] hover:text-[#087dcc]">
            Cualquier modalidad
          </button>
          {MODALITIES.map((item) => (
            <button key={item} type="button" value={item} onClick={() => runSearch(item)} className="shrink-0 border-l border-black/10 px-4 py-1.5 text-sm font-semibold text-[#26282d] hover:text-[#087dcc]">
              {item}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
