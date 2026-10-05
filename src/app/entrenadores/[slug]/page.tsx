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
    <main className="profile-page-shell mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 bg-white px-4 py-6 text-[#111214] md:px-6 md:py-8 lg:px-8">
      <JsonLd data={trainerProfileJsonLd(trainer)} />
      <JsonLd data={trainerBreadcrumbJsonLd(trainer)} />
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-[#8a8a92]">
        <Link href="/entrenadores" className="hover:text-[#111214]">
          Entrenadores
        </Link>
        <ChevronRight size={13} />
        <Link href={`/ciudades/${trainer.citySlug}`} className="hover:text-[#111214]">
          {trainer.city}
        </Link>
        <ChevronRight size={13} />
        <span className="text-[#111214]">{trainer.displayName}</span>
      </nav>

      <section className="grid gap-8 border border-[#111214] bg-white p-6 sm:p-8 lg:grid-cols-[1.4fr_0.8fr]">
        <div>
          <div className="flex flex-wrap items-center gap-4">
            <Avatar name={trainer.displayName} photoUrl={trainer.photoUrl ?? undefined} size="xl" />
            <div>
              <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent)]">
                <MapPin size={12} />
                {trainer.city} · {trainer.region}
              </p>
              <h1 className="mt-2 font-heading text-3xl font-bold text-[#111214] sm:text-4xl lg:text-5xl">
                {trainer.displayName}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <span
                  className={`inline-flex items-center gap-1.5 border px-3 py-1 text-xs font-semibold ${
                    trainer.verified ? "border-[var(--accent)] text-[#8a5c0f]" : "border-[#111214]/15 text-[#5b5b63]"
                  }`}
                >
                  {trainer.verified ? <BadgeCheck size={13} /> : <ShieldCheck size={13} />}
                  {trainer.verified ? "Identidad verificada" : "Perfil aprobado"}
                </span>
                {trainer.reviewsCount > 0 ? (
                  <span className="inline-flex items-center gap-1.5 border border-[#111214]/15 px-3 py-1 text-xs font-semibold text-[#111214]">
                    <Star size={13} className="fill-[var(--accent)] text-[var(--accent)]" />
                    {trainer.rating.toFixed(1)} · {trainer.reviewsCount} reseñas
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-[#8a8a92]">Nuevo en Super Entrenador</span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {trainer.category ? (
              <span className="bg-[var(--accent)] px-3 py-1.5 text-sm font-bold text-[#111214]">{trainer.category}</span>
            ) : null}
            {trainer.specialties.map((specialty) => (
              <span key={specialty} className="border border-[#111214]/15 px-3 py-1.5 text-sm font-semibold text-[#5b5b63]">
                {specialty}
              </span>
            ))}
          </div>

          <h2 className="mt-8 max-w-3xl font-heading text-2xl font-bold leading-tight text-[#111214] sm:text-3xl">
            {trainer.headline}
          </h2>

          <div className="mt-7 border border-[#111214]/12 bg-[#fafafa] p-5">
            <h2 className="text-lg font-bold text-[#111214]">Lugar de las clases</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 border border-[#111214]/15 bg-white px-3 py-2 text-sm font-semibold text-[#5b5b63]">
                <MapPin size={14} className="text-[var(--accent)]" />
                {trainer.city}
              </span>
              {trainer.modalities.map((modality) => (
                <span key={modality} className="border border-[#111214]/15 bg-white px-3 py-2 text-sm font-semibold text-[#5b5b63]">
                  {modality}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="font-heading text-2xl font-bold text-[#111214]">Sobre {trainer.displayName}</h2>
            <p className="mt-4 max-w-3xl whitespace-pre-line text-base leading-7 text-[#5b5b63]">{trainer.longBio}</p>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            <div className="border border-[#111214]/12 bg-[#fafafa] p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#8a8a92]">Experiencia</p>
              <p className="mt-1 font-heading text-2xl font-bold text-[#111214]">{trainer.yearsExperience} años</p>
            </div>
            <div className="border border-[#111214]/12 bg-[#fafafa] p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#8a8a92]">Desde</p>
              <p className="mt-1 font-heading text-2xl font-bold text-[#111214]">{trainer.priceFrom}€</p>
            </div>
            <div className="border border-[#111214]/12 bg-[#fafafa] p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#8a8a92]">Formato</p>
              <p className="mt-1 text-sm font-semibold text-[#111214]">{trainer.modalities.join(" · ")}</p>
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
        <section className="border border-[#111214]/15 bg-white p-6 sm:p-8">
          <h2 className="font-heading text-2xl font-bold text-[#111214]">Acerca de la clase</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="bg-[#fafafa] p-4">
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#8a8a92]">Especialidades</p>
              <p className="mt-2 text-sm font-semibold text-[#5b5b63]">
                {trainer.specialties.length ? trainer.specialties.join(" · ") : "Añade tus especialidades"}
              </p>
            </div>
            <div className="bg-[#fafafa] p-4">
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#8a8a92]">Idiomas</p>
              <p className="mt-2 text-sm font-semibold text-[#5b5b63]">
                {trainer.languages.length ? trainer.languages.join(" · ") : "Añade tus idiomas"}
              </p>
            </div>
            <div className="bg-[#fafafa] p-4">
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#8a8a92]">Experiencia</p>
              <p className="mt-2 text-sm font-semibold text-[#5b5b63]">
                {trainer.yearsExperience ? `${trainer.yearsExperience} años` : "Añade tu experiencia"}
              </p>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section id="opiniones" className="border border-[#111214]/15 bg-white p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-heading text-2xl font-bold text-[#111214]">Opiniones</h2>
            {trainer.reviewsCount > 0 ? (
              <span className="inline-flex items-center gap-2 font-semibold text-[#5b5b63]">
                <Star size={16} className="fill-[var(--accent)] text-[var(--accent)]" /> {trainer.rating.toFixed(1)} (
                {trainer.reviewsCount} opiniones)
              </span>
            ) : null}
          </div>
          <div className="mt-5 bg-[#fafafa] px-5 py-8 text-center text-sm text-[#5b5b63]">
            {trainer.reviewsCount > 0 ? "Las opiniones verificadas aparecerán aquí." : `Aún no hay opiniones sobre ${trainer.displayName}.`}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="grid gap-5 border border-[#111214] bg-[#111214] p-6 text-white sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">Siguiente paso</p>
            <h2 className="mt-2 font-heading text-3xl font-bold">
              Contacta con {trainer.displayName} desde una cuenta protegida.
            </h2>
            <p className="mt-4 text-sm text-white/70">
              El registro por magic link mantiene el contacto ordenado y evita conversaciones sin intención real.
            </p>
          </div>
          <Link
            href={`/login?redirectTo=${encodeURIComponent(`/entrenadores/${trainer.slug}`)}`}
            className="inline-flex items-center justify-center border-2 border-[var(--accent)] bg-[var(--accent)] px-5 py-3 text-sm font-bold text-[#111214] transition-colors hover:bg-transparent hover:text-[var(--accent)]"
          >
            Desbloquear contacto
          </Link>
        </section>
      </Reveal>
    </main>
  );
}
