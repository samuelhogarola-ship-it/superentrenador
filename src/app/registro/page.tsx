"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, CheckCircle, UserRound } from "lucide-react";
import { signUp } from "@/lib/auth";

const BENEFITS = [
  "Perfil público indexado en Google por ciudad y especialidad.",
  "Apareces en búsquedas de Fuengirola, Málaga y Madrid desde el primer día.",
  "Los clientes te comparan con criterio real: ratings, precio y bio.",
  "Tú controlas tu información y la actualizas cuando quieras.",
];

export default function RegistroPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);
    const { error: authError, data } = await signUp(email, password);

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      router.push("/mi-perfil");
      router.refresh();
    } else {
      setDone(true);
    }
  }

  if (done) {
    return (
      <main className="mx-auto flex w-full max-w-3xl flex-1 items-center px-4 py-10 md:px-6 lg:px-8">
        <section className="app-surface w-full rounded-[36px] p-6 text-center sm:p-10">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10">
            <CheckCircle size={24} className="text-emerald-600" />
          </span>
          <h1 className="app-title mt-5 text-3xl text-[var(--text)]">Revisa tu email</h1>
          <p className="app-copy mx-auto mt-4 max-w-sm text-base">
            Te hemos enviado un enlace de confirmación a <strong>{email}</strong>. Haz clic en él y vuelve a iniciar sesión para completar tu perfil.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--text)] px-6 py-3 text-sm font-semibold text-white"
          >
            Ir al login
            <ArrowRight size={15} />
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 items-center px-4 py-10 md:px-6 lg:px-8">
      <section className="app-surface grid w-full gap-8 overflow-hidden rounded-[36px] p-6 sm:p-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="app-kicker inline-flex items-center gap-1.5">
            <UserRound size={13} />
            Únete como entrenador
          </p>
          <h1 className="app-title mt-4 text-4xl text-[var(--text)] sm:text-5xl">
            Crea tu perfil público en el marketplace
          </h1>
          <p className="app-copy mt-5 text-base">
            Gratis. Tú rellenas tu ficha, apareces en las búsquedas locales y los clientes te encuentran por ciudad y especialidad.
          </p>

          <ul className="mt-6 flex flex-col gap-3">
            {BENEFITS.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3 text-sm text-[var(--text)]">
                <CheckCircle size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                {benefit}
              </li>
            ))}
          </ul>

          <p className="mt-8 text-sm text-[var(--muted)]">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="font-semibold text-[var(--text)] hover:text-[var(--accent)]">
              Inicia sesión
            </Link>
          </p>
        </div>

        <div className="rounded-[28px] border border-[var(--line)] bg-[var(--bg-soft)] p-6 sm:p-8">
          <p className="app-kicker">Crear cuenta</p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5 text-sm font-medium text-[var(--text)]">
              Email profesional
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu@email.com"
                className="rounded-full border border-[var(--line)] bg-white px-4 py-3 text-sm outline-none focus-visible:border-[var(--accent)]"
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-medium text-[var(--text)]">
              Contraseña
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Mínimo 6 caracteres"
                className="rounded-full border border-[var(--line)] bg-white px-4 py-3 text-sm outline-none focus-visible:border-[var(--accent)]"
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-medium text-[var(--text)]">
              Confirmar contraseña
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                placeholder="Repite la contraseña"
                className="rounded-full border border-[var(--line)] bg-white px-4 py-3 text-sm outline-none focus-visible:border-[var(--accent)]"
              />
            </label>

            {error ? (
              <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--text)] px-4 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              {loading ? "Creando cuenta…" : "Crear cuenta gratis"}
              {!loading && <ArrowRight size={15} />}
            </button>

            <p className="text-center text-xs text-[var(--muted)]">
              Al registrarte aceptas que tu perfil sea público en el marketplace.
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
