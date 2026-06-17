"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, LockKeyhole, Sparkles } from "lucide-react";
import { signIn } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const { error: authError } = await signIn(email, password);

    if (authError) {
      setError(authError.message === "Invalid login credentials"
        ? "Email o contraseña incorrectos."
        : authError.message);
      setLoading(false);
      return;
    }

    router.push("/mi-perfil");
    router.refresh();
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 items-center px-4 py-10 md:px-6 lg:px-8">
      <section className="app-surface grid w-full gap-8 overflow-hidden rounded-[36px] p-6 sm:p-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="app-kicker inline-flex items-center gap-1.5">
            <LockKeyhole size={13} />
            Acceso entrenadores
          </p>
          <h1 className="app-title mt-4 text-4xl text-[var(--text)] sm:text-5xl">
            Inicia sesión para gestionar tu perfil
          </h1>
          <p className="app-copy mt-5 max-w-md text-base">
            Accede a tu ficha pública, edita tu información y gestiona cómo te encuentran tus futuros clientes.
          </p>
          <p className="mt-6 text-sm text-[var(--muted)]">
            ¿Todavía no tienes cuenta?{" "}
            <Link href="/registro" className="font-semibold text-[var(--text)] hover:text-[var(--accent)]">
              Regístrate gratis
            </Link>
          </p>
        </div>

        <div className="rounded-[28px] border border-[var(--line)] bg-[var(--bg-soft)] p-6 sm:p-8">
          <p className="app-kicker inline-flex items-center gap-1.5">
            <Sparkles size={13} />
            Entrar al marketplace
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5 text-sm font-medium text-[var(--text)]">
              Email
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
                placeholder="••••••••"
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
              {loading ? "Entrando…" : "Iniciar sesión"}
              {!loading && <ArrowRight size={15} />}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
