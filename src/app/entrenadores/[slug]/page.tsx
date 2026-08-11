import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, ChevronRight, MapPin, ShieldCheck, Star } from "lucide-react";
import { notFound } from "next/navigation";
import { Avatar } from "@/components/avatar";
import { ContactPanel } from "@/components/contact-panel";
import { JsonLd } from "@/components/json-ld";
import { Reveal } from "@/components/reveal";
import { trainerBreadcrumbJsonLd, trainerProfileJsonLd } from "@/lib/marketplace-seo";
import { getPublicTrainerProfileBySlug, listPublicTrainerProfiles } from "@/lib/repositories/trainers";
import { siteConfig } from "@/lib/site";

export const dynamicParams = true;
export const revalidate = 3600;

interface TrainerProfilePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const trainers = await listPublicTrainerProfiles();
  return trainers.map((trainer) => ({ slug: trainer.slug }));
}

export async function generateMetadata({ params }: TrainerProfilePageProps): Promise<Metadata> {
  const { slug } = await params;
  const trainer = await getPublicTrainerProfileBySlug(slug);

  if (!trainer) {
    return {
      title: "Entrenador no encontrado",
    };
  }

  return {
    title: `${trainer.displayName} | Entrenador personal en ${trainer.city}`,
    description: trainer.shortBio,
    alternates: {
      canonical: `/entrenadores/${trainer.slug}`,
    },
    openGraph: {
      title: `${trainer.displayName} | Super Entrenador`,
      description: trainer.shortBio,
      url: `${siteConfig.url}/entrenadores/${trainer.slug}`,
      type: "profile",
    },
  };
}

export default async function TrainerProfilePage({ params }: TrainerProfilePageProps) {
  const { slug } = await params;
  const trainer = await getPublicTrainerProfileBySlug(slug);

  if (!trainer) {
    notFound();
  }

  return (
    <main className="profile-page-shell flex w-full flex-1 flex-col gap-6 bg-white px-4 py-6 text-[#17171b] md:px-6 md:py-8 lg:px-8">
      <JsonLd data={trainerProfileJsonLd(trainer)} />
      <JsonLd data={trainerBreadcrumbJsonLd(trainer)} />
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-[var(--muted)]">
        <Link href="/entrenadores" className="hover:text-[var(--text)]">
          Entrenadores
        </Link>
        <ChevronRight size={13} />
        <Link href={`/ciudades/${trainer.citySlug}`} className="hover:text-[var(--text)]">
          {trainer.city}
        </Link>
        <ChevronRight size={13} />
        <span className="text-[var(--text)]">{trainer.displayName}</span>
      </nav>

      <section className="grid gap-8 rounded-[32px] border border-black/10 bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.08)] sm:p-8 lg:grid-cols-[1.4fr_0.8fr]">
        <div>
          <div className="flex flex-wrap items-center gap-4">
            <Avatar name={trainer.displayName} photoUrl={trainer.photoUrl ?? undefined} size="xl" />
            <div>
              <p className="app-kicker inline-flex items-center gap-1.5">
                <MapPin size={12} />
                {trainer.city} · {trainer.region}
              </p>
              <h1 className="app-title mt-2 text-3xl text-[#17171b] sm:text-4xl lg:text-5xl">
                {trainer.displayName}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                    trainer.verified ? "bg-[var(--accent-soft)] text-[var(--accent)]" : "bg-[var(--gold-soft)] text-[var(--gold)]"
                  }`}
                >
                  {trainer.verified ? <BadgeCheck size={13} /> : <ShieldCheck size={13} />}
                  {trainer.verified ? "Identidad verificada" : "Perfil aprobado"}
                </span>
                {trainer.reviewsCount > 0 ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1 text-xs font-semibold text-[var(--text)]">
                    <Star size={13} className="fill-[var(--accent)] text-[var(--accent)]" />
                    {trainer.rating.toFixed(1)} · {trainer.reviewsCount} reseñas
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-[var(--muted)]">Nuevo en Super Entrenador</span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {trainer.category ? <span className="rounded-full bg-[#fff0ee] px-3 py-1.5 text-sm font-bold text-[#d85e5e]">{trainer.category}</span> : null}
            {trainer.specialties.map((specialty) => <span key={specialty} className="rounded-full border border-black/10 bg-[#f7f7f7] px-3 py-1.5 text-sm font-semibold text-[#55555b]">{specialty}</span>)}
          </div>

          <h2 className="app-title mt-8 max-w-3xl text-2xl leading-tight text-[#17171b] sm:text-3xl">{trainer.headline}</h2>

          <div className="mt-7 rounded-[22px] bg-[#fafafa] p-5">
            <h2 className="text-lg font-bold text-[#17171b]">Lugar de las clases</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-[#55555b]"><MapPin size={14} className="text-[var(--accent)]" />{trainer.city}</span>
              {trainer.modalities.map((modality) => <span key={modality} className="rounded-full border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-[#55555b]">{modality}</span>)}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="app-title text-2xl text-[#17171b]">Sobre {trainer.displayName}</h2>
            <p className="mt-4 max-w-3xl whitespace-pre-line text-base leading-7 text-[#55555b]">{trainer.longBio}</p>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[18px] border border-black/10 bg-[#fafafa] p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#77777d]">Experiencia</p>
              <p className="mt-1 font-heading text-2xl text-[#17171b]">{trainer.yearsExperience} años</p>
            </div>
            <div className="rounded-[18px] border border-black/10 bg-[#fafafa] p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#77777d]">Desde</p>
              <p className="mt-1 font-heading text-2xl text-[#17171b]">{trainer.priceFrom}€</p>
            </div>
            <div className="rounded-[18px] border border-black/10 bg-[#fafafa] p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#77777d]">Formato</p>
              <p className="mt-1 text-sm font-semibold text-[#17171b]">{trainer.modalities.join(" · ")}</p>
            </div>
          </div>

        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <ContactPanel
            priceFrom={trainer.priceFrom}
            yearsExperience={trainer.yearsExperience}
            modalities={trainer.modalities}
            languages={trainer.languages}
            hiddenContactHint={trainer.hiddenContactHint}
            trainerName={trainer.displayName}
            trainerSlug={trainer.slug}
            trainerProfileId={trainer.id}
          />
        </aside>
      </section>

      <Reveal>
        <section className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="app-title text-2xl text-[#17171b]">Acerca de la clase</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[18px] bg-[#fafafa] p-4">
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#77777d]">Especialidades</p>
              <p className="mt-2 text-sm font-semibold text-[#55555b]">{trainer.specialties.length ? trainer.specialties.join(" · ") : "Añade tus especialidades"}</p>
            </div>
            <div className="rounded-[18px] bg-[#fafafa] p-4">
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#77777d]">Idiomas</p>
              <p className="mt-2 text-sm font-semibold text-[#55555b]">{trainer.languages.length ? trainer.languages.join(" · ") : "Añade tus idiomas"}</p>
            </div>
            <div className="rounded-[18px] bg-[#fafafa] p-4">
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#77777d]">Experiencia</p>
              <p className="mt-2 text-sm font-semibold text-[#55555b]">{trainer.yearsExperience ? `${trainer.yearsExperience} años` : "Añade tu experiencia"}</p>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section id="opiniones" className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="app-title text-2xl text-[#17171b]">Opiniones</h2>
            {trainer.reviewsCount > 0 ? (
              <span className="inline-flex items-center gap-2 font-semibold text-[#55555b]"><Star size={16} className="fill-[var(--accent)] text-[var(--accent)]" /> {trainer.rating.toFixed(1)} ({trainer.reviewsCount} opiniones)</span>
            ) : null}
          </div>
          <div className="mt-5 rounded-[20px] bg-[#fafafa] px-5 py-8 text-center text-sm text-[#68686f]">
            {trainer.reviewsCount > 0 ? "Las opiniones verificadas aparecerán aquí." : `Aún no hay opiniones sobre ${trainer.displayName}.`}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="grid gap-5 rounded-[28px] border border-black/10 bg-white p-6 shadow-sm sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="app-kicker">Siguiente paso</p>
            <h2 className="app-title mt-2 text-3xl text-[#17171b]">
              Contacta con {trainer.displayName} desde una cuenta protegida.
            </h2>
            <p className="mt-4 text-sm text-[#68686f]">
              El registro por magic link mantiene el contacto ordenado y evita conversaciones sin intención real.
            </p>
          </div>
          <Link
            href={`/login?redirectTo=${encodeURIComponent(`/entrenadores/${trainer.slug}`)}`}
            className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-bold text-[var(--ink)] transition-transform hover:-translate-y-0.5"
          >
            Desbloquear contacto
          </Link>
        </section>
      </Reveal>
    </main>
  );
}
