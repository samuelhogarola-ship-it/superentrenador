import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Rocket } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard futuro | Super Entrenador",
  description: "Placeholder para la futura zona privada o subdominio app.superentrenador.com.",
};

export default function DashboardPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 items-center px-4 py-10 md:px-6 lg:px-8">
      <section className="app-surface w-full rounded-[36px] p-6 sm:p-10">
        <p className="app-kicker inline-flex items-center gap-1.5">
          <Rocket size={13} />
          Preparado para crecer
        </p>
        <h1 className="app-title mt-4 text-4xl text-[var(--text)] sm:text-5xl">Zona privada futura</h1>
        <p className="app-copy mt-5 max-w-2xl text-base">
          Este placeholder separa desde hoy el marketplace público de la futura zona privada. Más adelante podrá
          vivir aquí o detrás de <code className="rounded bg-[var(--bg-soft)] px-1.5 py-0.5 text-sm">app.superentrenador.com</code>,
          con autenticación Supabase, pagos y paneles protegidos para entrenadores y clientes.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-5 py-3 text-sm font-semibold text-[var(--text)] hover:border-[var(--line-strong)]"
        >
          <ArrowLeft size={15} />
          Volver al inicio
        </Link>
      </section>
    </main>
  );
}
