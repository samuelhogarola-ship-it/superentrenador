import type { Metadata } from "next";
import Link from "next/link";
import { Award, LockKeyhole, MapPin, MessageSquare, Star } from "lucide-react";
import { notFound } from "next/navigation";
import { getPublicTrainerProfileBySlug, listPublicTrainerProfiles } from "@/lib/repositories/trainers";
import { siteConfig } from "@/lib/site";

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
      title: "Entrenador no encontrado | Super Entrenador",
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
      <section className="app-surface grid gap-6 rounded-[36px] p-6 sm:p-8 lg:grid-cols-[1.4fr_0.8fr]">
        <div>
          <p className="app-kicker">
            {trainer.city} · {trainer.region}
          </p>
          <h1 className="app-title mt-3 text-4xl text-[var(--text)] sm:text-5xl lg:text-6xl">
            {trainer.displayName}
          </h1>
          <p className="mt-4 text-xl font-semibold text-[var(--text)]">{trainer.headline}</p>
          <p className="app-copy mt-5 max-w-3xl text-base">{trainer.longBio}</p>

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

        <aside className="rounded-[30px] border border-[var(--line)] bg-[var(--bg-soft)] p-6">
          <div className="grid gap-4 text-sm text-[var(--muted)]">
            <span className="inline-flex items-center gap-3">
              <Star size={16} className="text-[var(--accent)]" />
              {trainer.rating} · {trainer.reviewsCount} opiniones
            </span>
            <span className="inline-flex items-center gap-3">
              <Award size={16} className="text-[var(--accent)]" />
              {trainer.yearsExperience} años de experiencia
            </span>
            <span className="inline-flex items-center gap-3">
              <MapPin size={16} className="text-[var(--accent)]" />
              {trainer.modalities.join(" · ")}
            </span>
          </div>

          <div className="mt-8 rounded-[26px] border border-[var(--line)] bg-white p-5">
            <p className="app-kicker">
              Acceso premium
            </p>
            <p className="mt-3 text-sm leading-7 text-[var(--text)]">
              {trainer.hiddenContactHint}
            </p>
            <div className="mt-5 grid gap-3">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--text)] px-4 py-3 text-sm font-semibold text-white"
              >
                <MessageSquare size={16} />
                Iniciar sesión para desbloquear
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--line)] px-4 py-3 text-sm font-semibold text-[var(--text)]"
              >
                <LockKeyhole size={16} />
                Ver opciones premium
              </Link>
            </div>
          </div>
        </aside>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <article className="app-surface rounded-[30px] p-6">
          <h2 className="app-title text-3xl text-[var(--text)]">
            Idiomas
          </h2>
          <p className="mt-4 text-[var(--muted)]">{trainer.languages.join(" · ")}</p>
        </article>
        <article className="app-surface rounded-[30px] p-6">
          <h2 className="app-title text-3xl text-[var(--text)]">
            Modalidades
          </h2>
          <p className="mt-4 text-[var(--muted)]">{trainer.modalities.join(" · ")}</p>
        </article>
        <article className="app-surface rounded-[30px] p-6">
          <h2 className="app-title text-3xl text-[var(--text)]">
            Desde
          </h2>
          <p className="mt-4 text-[var(--muted)]">{trainer.priceFrom} € por sesión o plan equivalente</p>
        </article>
      </section>
    </main>
  );
}
