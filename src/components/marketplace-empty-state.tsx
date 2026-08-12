import Link from "next/link";
import { ArrowRight, MapPinned, RotateCcw, UserPlus } from "lucide-react";

interface MarketplaceEmptyStateProps {
  cityName?: string;
  resetHref: string;
}

export function MarketplaceEmptyState({ cityName, resetHref }: MarketplaceEmptyStateProps) {
  const locationCopy = cityName ? ` de ${cityName}` : "";

  return (
    <section className="border border-[#111214] bg-white p-8 text-center text-[#111214] sm:p-12">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">Estamos ampliando la oferta</p>
      <h2 className="mx-auto mt-3 max-w-xl font-heading text-3xl font-bold text-[#111214]">
        Aún no hay entrenadores disponibles{locationCopy} con estos filtros.
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[#5b5b63]">
        Prueba otra ciudad o limpia los filtros. Si eres entrenador, publica tu perfil para que nuevos clientes puedan encontrarte.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link
          href={resetHref}
          className="inline-flex items-center gap-2 border border-[#111214]/15 bg-white px-5 py-3 text-sm font-bold text-[#111214] transition-colors hover:border-[#111214]"
        >
          <RotateCcw size={15} />
          Limpiar filtros
        </Link>
        <Link
          href="/andalucia"
          className="inline-flex items-center gap-2 border border-[#111214]/15 bg-white px-5 py-3 text-sm font-bold text-[#111214] transition-colors hover:border-[#111214]"
        >
          <MapPinned size={15} />
          Ver ciudades
        </Link>
        <Link
          href="/registro?intent=trainer"
          className="inline-flex items-center gap-2 bg-[#111214] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[var(--accent)] hover:text-[#111214]"
        >
          <UserPlus size={15} />
          Publicar perfil
          <ArrowRight size={15} />
        </Link>
      </div>
    </section>
  );
}
