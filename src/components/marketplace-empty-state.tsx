import Link from "next/link";
import { ArrowRight, MapPinned, RotateCcw, UserPlus } from "lucide-react";

interface MarketplaceEmptyStateProps {
  cityName?: string;
  resetHref: string;
}

export function MarketplaceEmptyState({ cityName, resetHref }: MarketplaceEmptyStateProps) {
  const locationCopy = cityName ? ` de ${cityName}` : "";

  return (
    <section className="rounded-[28px] border border-black/10 bg-[linear-gradient(180deg,rgba(255,253,250,0.98),rgba(247,245,239,0.94))] p-6 text-center text-[var(--ink)] shadow-[0_24px_64px_rgba(0,0,0,0.22)] sm:p-8">
      <p className="app-kicker">Estamos ampliando la oferta</p>
      <h2 className="app-title mx-auto mt-2 max-w-xl text-3xl text-[var(--ink)]">
        Aún no tenemos suficientes entrenadores{locationCopy} para una comparación seria.
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[var(--paper-muted)]">
        Prueba otra ciudad o limpia filtros. Si eres entrenador, publica tu perfil para aparecer cuando abramos más búsquedas locales.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href={resetHref}
          className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/75 px-5 py-3 text-sm font-bold text-[var(--ink)] transition-colors hover:border-[var(--accent)]"
        >
          <RotateCcw size={15} />
          Limpiar filtros
        </Link>
        <Link
          href="/andalucia"
          className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/75 px-5 py-3 text-sm font-bold text-[var(--ink)] transition-colors hover:border-[var(--accent)]"
        >
          <MapPinned size={15} />
          Ver ciudades
        </Link>
        <Link
          href="/registro?intent=trainer"
          className="inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-5 py-3 text-sm font-bold text-[var(--accent)] transition-transform hover:-translate-y-0.5"
        >
          <UserPlus size={15} />
          Publicar perfil
          <ArrowRight size={15} />
        </Link>
      </div>
    </section>
  );
}
