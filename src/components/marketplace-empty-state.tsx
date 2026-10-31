import Link from "next/link";
import { ArrowRight, RotateCcw, UserPlus } from "lucide-react";

interface MarketplaceEmptyStateProps {
  cityName?: string;
  resetHref: string;
}

export function MarketplaceEmptyState({ cityName, resetHref }: MarketplaceEmptyStateProps) {
  const locationCopy = cityName ? ` de ${cityName}` : "";

  return (
    <section className="bg-[#fafaf8] px-6 py-10 text-center text-[#111214] sm:px-10 sm:py-14">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8a6a1f]">Sin resultados por ahora</p>
      <h2 className="mx-auto mt-3 max-w-xl font-heading text-2xl font-bold text-[#111214] sm:text-3xl">
        No hay perfiles publicados{locationCopy} que coincidan con estos filtros.
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[#5b5b63]">
        Prueba otra ciudad o amplía la búsqueda. No mostramos entrenadores de ejemplo ni perfiles sin aprobar.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link
          href={resetHref}
          className="inline-flex items-center gap-2 rounded-full border border-[#111214]/15 bg-white px-5 py-3 text-sm font-bold text-[#111214] transition-colors hover:border-[#111214]"
        >
          <RotateCcw size={15} />
          Limpiar filtros
        </Link>
        <Link
          href="/registro?intent=trainer"
          className="empty-state-publish-cta inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition-colors"
        >
          <UserPlus size={15} />
          Publicar perfil
          <ArrowRight size={15} />
        </Link>
      </div>
    </section>
  );
}
