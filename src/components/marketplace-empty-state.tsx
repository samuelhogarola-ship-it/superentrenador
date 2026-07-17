import Link from "next/link";
import { ArrowRight, RotateCcw, UserPlus } from "lucide-react";

interface MarketplaceEmptyStateProps {
  cityName?: string;
  resetHref: string;
}

export function MarketplaceEmptyState({ cityName, resetHref }: MarketplaceEmptyStateProps) {
  const locationCopy = cityName ? ` de ${cityName}` : "";

  return (
    <section className="rounded-[20px] border border-[var(--line)] bg-[var(--surface)] p-6 text-center shadow-[var(--shadow-soft)] sm:p-8">
      <p className="app-kicker">Oferta en preparación</p>
      <h2 className="app-title mx-auto mt-2 max-w-xl text-2xl text-[var(--text)]">
        Estamos preparando la primera selección de entrenadores{locationCopy}.
      </h2>
      <p className="app-copy mx-auto mt-3 max-w-2xl text-sm">
        Antes de abrir tráfico local a clientes, estamos priorizando perfiles completos, claros y revisables. Si eres entrenador, puedes entrar ahora y dejar tu ficha lista.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href={resetHref}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--line-strong)] bg-[var(--surface)] px-5 py-3 text-sm font-semibold text-[var(--text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          <RotateCcw size={15} />
          Limpiar filtros
        </Link>
        <Link
          href="/registro"
          className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:opacity-95"
        >
          <UserPlus size={15} />
          Publicar perfil
          <ArrowRight size={15} />
        </Link>
      </div>
    </section>
  );
}
