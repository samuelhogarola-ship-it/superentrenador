import Link from "next/link";
import { ArrowRight, LockKeyhole, MapPin, Search, ShieldCheck, Star } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { TrainerCard } from "@/components/trainer-card";
import { listFeaturedTrainerProfiles, listMarketplaceCities } from "@/lib/repositories/trainers";

export default async function Home() {
  const [featuredTrainers, cities] = await Promise.all([
    listFeaturedTrainerProfiles(),
    listMarketplaceCities(),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-6 md:gap-10 md:px-6 md:py-8 lg:px-8">
      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="app-surface rounded-[36px] px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          <p className="app-kicker">Marketplace fitness premium</p>
          <h1 className="app-title mt-4 max-w-4xl text-4xl leading-none text-[var(--text)] sm:text-5xl lg:text-6xl">
            Encuentra entrenador personal con una experiencia simple, seria y directa.
          </h1>
          <p className="app-copy mt-5 max-w-2xl text-base sm:text-lg">
            Super Entrenador ordena discovery, perfil publico y futura conversion premium en una sola capa limpia:
            ciudad, especialidad y confianza antes de desbloquear contacto.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/entrenadores"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--text)] px-5 py-3 text-sm font-semibold text-white"
            >
              Buscar entrenadores
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--line)] bg-white px-5 py-3 text-sm font-semibold text-[var(--text)]"
            >
              Soy entrenador
            </Link>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              "Perfiles públicos indexables",
              "Landings por ciudad preparadas",
              "Desbloqueo premium tras login",
            ].map((item) => (
              <div key={item} className="rounded-[24px] border border-[var(--line)] bg-[var(--bg-soft)] p-4">
                <p className="text-sm font-medium text-[var(--text)]">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="app-surface rounded-[36px] px-6 py-8 sm:px-8 sm:py-10">
          <div className="rounded-[28px] border border-[var(--line)] bg-[var(--bg-soft)] p-5">
            <p className="app-kicker">Como funciona</p>
            <h2 className="app-title mt-3 text-3xl text-[var(--text)]">Un perfil publico que ya convierte.</h2>
            <div className="mt-5 grid gap-4 text-sm text-[var(--muted)]">
              <span className="inline-flex items-start gap-3">
                <Search size={16} className="mt-0.5 text-[var(--accent)]" />
                El usuario llega desde Google, ciudad o especialidad.
              </span>
              <span className="inline-flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 text-[var(--accent)]" />
                La ficha posiciona localmente y presenta al PT con claridad.
              </span>
              <span className="inline-flex items-start gap-3">
                <LockKeyhole size={16} className="mt-0.5 text-[var(--accent)]" />
                El dato sensible queda protegido para una capa premium futura.
              </span>
            </div>
          </div>

          <div className="mt-5 grid gap-4">
            {featuredTrainers.slice(0, 2).map((trainer) => (
              <Link
                key={trainer.id}
                href={`/entrenadores/${trainer.slug}`}
                className="rounded-[24px] border border-[var(--line)] bg-white p-4 transition-colors hover:border-[var(--line-strong)]"
              >
                <p className="app-kicker">
                  {trainer.city} · {trainer.region}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-[var(--text)]">{trainer.displayName}</h3>
                <p className="mt-1 text-sm text-[var(--muted)]">{trainer.headline}</p>
              </Link>
            ))}
          </div>
        </aside>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="app-surface rounded-[36px] px-6 py-8 sm:px-8">
          <SectionHeading
            eyebrow="Ciudades activas"
            title="Empezamos local, preparados para escalar."
            body="Fuengirola y Malaga ya tienen estructura lista. El mismo sistema sirve para crecer por ciudad, zona y especialidad sin reconstruir el producto."
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {cities.map((city) => (
            <Link
              key={city.slug}
              href={`/ciudades/${city.slug}`}
              className="app-surface rounded-[30px] p-6 transition-transform hover:-translate-y-1"
            >
              <p className="app-kicker">{city.region}</p>
              <h3 className="app-title mt-3 text-3xl text-[var(--text)]">{city.name}</h3>
              <p className="app-copy mt-4 text-sm">{city.intro}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
        <div className="app-surface rounded-[36px] px-6 py-8 sm:px-8">
          <p className="app-kicker">Valor visible</p>
          <h2 className="app-title mt-3 text-4xl text-[var(--text)]">El marketplace ya enseña confianza antes del pago.</h2>
          <div className="mt-6 grid gap-4 text-sm text-[var(--muted)]">
            <span className="inline-flex items-start gap-3">
              <ShieldCheck size={16} className="mt-0.5 text-[var(--accent)]" />
              Verified y social proof como capa de credibilidad.
            </span>
            <span className="inline-flex items-start gap-3">
              <Star size={16} className="mt-0.5 text-[var(--accent)]" />
              Rating, especialidades y narrativa clara en cada ficha.
            </span>
            <span className="inline-flex items-start gap-3">
              <LockKeyhole size={16} className="mt-0.5 text-[var(--accent)]" />
              Contacto protegido para premium y monetizacion posterior.
            </span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {featuredTrainers.map((trainer) => (
            <TrainerCard key={trainer.id} trainer={trainer} />
          ))}
        </div>
      </section>
    </main>
  );
}
