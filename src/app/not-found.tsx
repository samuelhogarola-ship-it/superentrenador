import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 items-center px-4 py-10 md:px-6 lg:px-8">
      <section className="app-surface w-full rounded-[36px] p-6 text-center sm:p-10">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent-soft)]">
          <Compass size={22} className="text-[var(--accent)]" />
        </span>
        <p className="app-kicker mt-5">Error 404</p>
        <h1 className="app-title mt-3 text-4xl text-[var(--text)] sm:text-5xl">Página no encontrada</h1>
        <p className="app-copy mx-auto mt-4 max-w-md text-base">
          La URL que buscas no existe todavía o forma parte de una fase futura del marketplace.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--ink)] transition-transform hover:-translate-y-0.5"
          >
            Volver al inicio
            <ArrowRight size={15} />
          </Link>
          <Link
            href="/entrenadores"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-5 py-3 text-sm font-semibold text-[var(--text)] hover:border-[var(--line-strong)]"
          >
            Ver entrenadores
          </Link>
        </div>
      </section>
    </main>
  );
}
