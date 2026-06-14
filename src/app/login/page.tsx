import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acceso | Super Entrenador",
  description:
    "Pantalla base preparada para autenticación futura con Supabase en la zona privada del marketplace.",
};

export default function LoginPage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 items-center px-6 py-16 lg:px-10">
      <section className="grid w-full gap-6 rounded-[32px] border border-white/10 bg-[var(--panel)] p-8 shadow-[0_20px_70px_rgba(0,0,0,0.28)]">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)]">Zona privada futura</p>
        <h1 className="font-heading text-6xl uppercase tracking-[0.05em] text-[var(--text)]">
          Login y desbloqueo premium
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-[var(--muted)]">
          Esta ruta queda preparada para Supabase Auth, pago futuro y desbloqueo de contacto o funcionalidades premium
          del marketplace.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/entrenadores"
            className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--ink)]"
          >
            Volver al marketplace
          </Link>
          <Link
            href="/dashboard"
            className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-[var(--text)]"
          >
            Ver placeholder privado
          </Link>
        </div>
      </section>
    </main>
  );
}
