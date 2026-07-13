import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, ChevronRight, MapPin } from "lucide-react";
import { notFound } from "next/navigation";
import { Avatar } from "@/components/avatar";
import { ContactPanel } from "@/components/contact-panel";
import { JsonLd } from "@/components/json-ld";
import { RatingStars } from "@/components/rating-stars";
import { Reveal } from "@/components/reveal";
import { trainerProfileJsonLd } from "@/lib/marketplace-seo";
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
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 md:px-6 md:py-8 lg:px-8">
      <JsonLd data={trainerProfileJsonLd(trainer)} />
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

      <section className="app-surface grid gap-8 rounded-[28px] p-6 sm:p-8 lg:grid-cols-[1.4fr_0.8fr]">
        <div>
          <div className="flex flex-wrap items-center gap-4">
            <Avatar name={trainer.displayName} photoUrl={trainer.photoUrl ?? undefined} size="xl" />
            <div>
              <p className="app-kicker inline-flex items-center gap-1.5">
                <MapPin size={12} />
                {trainer.city} · {trainer.region}
              </p>
              <h1 className="app-title mt-2 text-3xl text-[var(--text)] sm:text-4xl lg:text-5xl">
                {trainer.displayName}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <RatingStars rating={trainer.rating} reviewsCount={trainer.reviewsCount} size={16} />
                {trainer.verified ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <BadgeCheck size={13} />
                    Verificado
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <p className="mt-6 text-xl font-semibold text-[var(--text)]">{trainer.headline}</p>
          <p className="app-copy mt-4 max-w-3xl text-base">{trainer.longBio}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            {trainer.specialties.map((specialty) => (
              <span
                key={specialty}
                className="rounded-full border border-[var(--line)] bg-[var(--bg-soft)] px-4 py-2 text-sm text-[var(--text)]"
              >
                {specialty}
              </span>
            ))}
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
        <section className="grid gap-6 lg:grid-cols-3">
          <article className="app-surface rounded-[28px] p-6">
            <h2 className="app-title text-2xl text-[var(--text)]">Idiomas</h2>
            <p className="app-copy mt-3">{trainer.languages.join(" · ")}</p>
          </article>
          <article className="app-surface rounded-[28px] p-6">
            <h2 className="app-title text-2xl text-[var(--text)]">Modalidades</h2>
            <p className="app-copy mt-3">{trainer.modalities.join(" · ")}</p>
          </article>
          <article className="app-surface rounded-[28px] p-6">
            <h2 className="app-title text-2xl text-[var(--text)]">Experiencia</h2>
            <p className="app-copy mt-3">{trainer.yearsExperience} años entrenando clientes reales</p>
          </article>
        </section>
      </Reveal>

      {trainer.reviewsCount > 0 ? (
        <Reveal>
          <section className="app-surface rounded-[28px] p-6 sm:p-8">
            <p className="app-kicker">Opiniones</p>
            <h2 className="app-title mt-2 text-3xl text-[var(--text)]">
              {trainer.rating} de 5 · {trainer.reviewsCount} opiniones verificadas
            </h2>
            <p className="app-copy mt-4 text-sm">
              Inicia sesión para ver el detalle de cada reseña y contactar con {trainer.displayName}.
            </p>
          </section>
        </Reveal>
      ) : null}
    </main>
  );
}
