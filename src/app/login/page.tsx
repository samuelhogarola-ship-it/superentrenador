import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Acceso | Super Entrenador",
  description:
    "Pantalla base preparada para autenticación futura con Supabase en la zona privada del marketplace.",
};

export default function LoginPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 items-center px-4 py-10 md:px-6 lg:px-8">
      <section className="app-surface grid w-full gap-8 overflow-hidden rounded-[36px] p-6 sm:p-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="app-kicker inline-flex items-center gap-1.5">
            <Sparkles size={13} />
            Zona privada futura
          </p>
          <h1 className="app-title mt-4 text-4xl text-[var(--text)] sm:text-5xl">
            Inicia sesión para desbloquear contacto
          </h1>
          <p className="app-copy mt-5 max-w-md text-base">
            Esta ruta queda preparada para Supabase Auth, pago futuro y desbloqueo de contacto directo con cada
            entrenador del marketplace.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/entrenadores"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--text)] px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              Volver al marketplace
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--line)] px-5 py-3 text-sm font-semibold text-[var(--text)] hover:border-[var(--line-strong)]"
            >
              Ver placeholder privado
            </Link>
          </div>
        </div>

        <div className="rounded-[28px] border border-[var(--line)] bg-[var(--bg-soft)] p-6 sm:p-8">
          <p className="app-kicker">Lo que vas a desbloquear</p>
          <div className="mt-5 grid gap-4 text-sm text-[var(--text)]">
            <span className="inline-flex items-start gap-3">
              <LockKeyhole size={16} className="mt-0.5 shrink-0 text-[var(--accent)]" />
              Contacto directo con el entrenador elegido.
            </span>
            <span className="inline-flex items-start gap-3">
              <ShieldCheck size={16} className="mt-0.5 shrink-0 text-[var(--accent)]" />
              Reseñas completas y verificación ampliada.
            </span>
            <span className="inline-flex items-start gap-3">
              <Sparkles size={16} className="mt-0.5 shrink-0 text-[var(--accent)]" />
              Reserva y seguimiento premium próximamente.
            </span>
          </div>

          <div className="mt-7 grid gap-3">
            <input
              type="email"
              disabled
              placeholder="tu@email.com"
              className="w-full cursor-not-allowed rounded-full border border-[var(--line)] bg-white px-4 py-3 text-sm text-[var(--muted)] outline-none"
            />
            <button
              type="button"
              disabled
              className="w-full cursor-not-allowed rounded-full bg-[var(--text)]/40 px-4 py-3 text-sm font-semibold text-white"
            >
              Continuar (próximamente)
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
