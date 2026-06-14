import Link from "next/link";
import { ArrowRight, Check, LockKeyhole, MapPin, Search, ShieldCheck } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { TrainerCard } from "@/components/trainer-card";
import { listFeaturedTrainerProfiles, listMarketplaceCities } from "@/lib/repositories/trainers";

export default async function Home() {
  const [featuredTrainers, cities] = await Promise.all([
    listFeaturedTrainerProfiles(),
    listMarketplaceCities(),
  ]);

  return (
    <main className="flex flex-1 flex-col">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(226,179,79,0.22),transparent_28%),linear-gradient(180deg,rgba(7,12,18,0.96)_0%,rgba(10,15,22,1)_100%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:py-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[var(--accent)]">
              Marketplace SEO + zona privada futura
            </p>
            <h1 className="mt-6 font-heading text-6xl uppercase tracking-[0.05em] text-[var(--text)] sm:text-7xl lg:text-8xl">
              Encuentra entrenador personal en Fuengirola, Málaga y toda España
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
              Super Entrenador nace como marketplace indexable para buscadores: perfiles públicos, landings por ciudad
              y una futura capa premium para desbloquear contacto, contratar o entrar en zona privada.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/entrenadores"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--ink)]"
              >
                Buscar entrenadores
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-[var(--text)]"
              >
                Soy entrenador
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                "Perfiles públicos indexables",
                "Páginas SEO por ciudad",
                "Desbloqueo premium tras login",
              ].map((item) => (
                <div key={item} className="rounded-[24px] border border-white/10 bg-white/5 p-4 text-sm text-[var(--text)]">
                  <Check size={18} className="mb-3 text-[var(--accent)]" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-[var(--panel)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
            <div className="rounded-[24px] border border-white/10 bg-[rgba(255,255,255,0.04)] p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-[var(--accent)]">Perfil premium</p>
                  <h2 className="mt-2 font-heading text-5xl uppercase tracking-[0.05em] text-[var(--text)]">
                    Contacto protegido
                  </h2>
                </div>
                <ShieldCheck className="text-[var(--accent)]" size={32} />
              </div>

              <div className="mt-6 grid gap-4 text-sm text-[var(--muted)]">
                <span className="inline-flex items-center gap-3">
                  <Search size={16} className="text-[var(--accent)]" />
                  El usuario encuentra al entrenador desde Google.
                </span>
                <span className="inline-flex items-center gap-3">
                  <MapPin size={16} className="text-[var(--accent)]" />
                  La ficha pública posiciona por ciudad y especialidad.
                </span>
                <span className="inline-flex items-center gap-3">
                  <LockKeyhole size={16} className="text-[var(--accent)]" />
                  El contacto completo se desbloquea tras login o pago.
                </span>
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              {featuredTrainers.map((trainer) => (
                <Link
                  key={trainer.id}
                  href={`/entrenadores/${trainer.slug}`}
                  className="rounded-[24px] border border-white/10 bg-white/5 p-4 transition-colors hover:border-[var(--accent)]/40"
                >
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--accent)]">
                    {trainer.city} · {trainer.region}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-[var(--text)]">{trainer.displayName}</h3>
                  <p className="mt-1 text-sm text-[var(--muted)]">{trainer.headline}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-16 lg:px-10">
        <SectionHeading
          eyebrow="Ciudades iniciales"
          title="Landings preparadas para escalar"
          body="Empezamos en Fuengirola y Málaga, pero la estructura ya permite crecer por ciudad, región y especialidad sin rehacer el proyecto."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {cities.map((city) => (
            <Link
              key={city.slug}
              href={`/ciudades/${city.slug}`}
              className="rounded-[28px] border border-white/10 bg-[var(--panel)] p-6 transition-transform hover:-translate-y-1"
            >
              <p className="text-xs uppercase tracking-[0.25em] text-[var(--accent)]">{city.region}</p>
              <h3 className="mt-3 font-heading text-5xl uppercase tracking-[0.05em] text-[var(--text)]">
                {city.name}
              </h3>
              <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{city.intro}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 pb-20 lg:px-10">
        <SectionHeading
          eyebrow="Perfiles destacados"
          title="La capa pública ya enseña valor real"
          body="Cada entrenador tiene una ficha preparada para indexar, convertir y luego esconder la parte sensible detrás de login, pago o suscripción."
        />

        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {featuredTrainers.map((trainer) => (
            <TrainerCard key={trainer.id} trainer={trainer} />
          ))}
        </div>
      </section>
    </main>
  );
}
