import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard futuro | Super Entrenador",
  description: "Placeholder para la futura zona privada o subdominio app.superentrenador.com.",
};

export default function DashboardPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 px-6 py-16 lg:px-10">
      <section className="grid w-full gap-6 rounded-[32px] border border-white/10 bg-[var(--panel)] p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)]">Preparado para crecer</p>
        <h1 className="font-heading text-6xl uppercase tracking-[0.05em] text-[var(--text)]">
          Zona privada futura
        </h1>
        <p className="max-w-3xl text-lg leading-8 text-[var(--muted)]">
          Este placeholder separa desde hoy el marketplace público de la futura zona privada. Más adelante podrá vivir
          aquí o detrás de `app.superentrenador.com`, con autenticación Supabase, pagos y paneles protegidos.
        </p>
      </section>
    </main>
  );
}
