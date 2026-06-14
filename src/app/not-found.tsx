import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 items-center px-6 py-16 lg:px-10">
      <section className="grid gap-6 rounded-[32px] border border-white/10 bg-[var(--panel)] p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)]">404</p>
        <h1 className="font-heading text-6xl uppercase tracking-[0.05em] text-[var(--text)]">
          Página no encontrada
        </h1>
        <p className="text-lg leading-8 text-[var(--muted)]">
          La URL que buscas no existe todavía o forma parte de una fase futura del marketplace.
        </p>
        <div>
          <Link
            href="/"
            className="inline-flex rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--ink)]"
          >
            Volver al inicio
          </Link>
        </div>
      </section>
    </main>
  );
}
