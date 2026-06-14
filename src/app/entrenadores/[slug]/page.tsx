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
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-6 py-14 lg:px-10">
      <section className="grid gap-6 rounded-[32px] border border-white/10 bg-[var(--panel)] p-8 shadow-[0_20px_70px_rgba(0,0,0,0.28)] lg:grid-cols-[1.4fr_0.8fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)]">
            {trainer.city} · {trainer.region}
          </p>
          <h1 className="mt-3 font-heading text-6xl uppercase tracking-[0.05em] text-[var(--text)]">
            {trainer.displayName}
          </h1>
          <p className="mt-4 text-xl text-[var(--text)]">{trainer.headline}</p>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--muted)]">{trainer.longBio}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            {trainer.specialties.map((specialty) => (
              <span
                key={specialty}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-[var(--text)]"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>

        <aside className="rounded-[28px] border border-white/10 bg-[rgba(255,255,255,0.03)] p-6">
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

          <div className="mt-8 rounded-[24px] border border-[var(--accent)]/20 bg-[var(--accent)]/10 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
              Acceso premium
            </p>
            <p className="mt-3 text-sm leading-7 text-[var(--text)]">
              {trainer.hiddenContactHint}
            </p>
            <div className="mt-5 grid gap-3">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-[var(--ink)]"
              >
                <MessageSquare size={16} />
                Iniciar sesión para desbloquear
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-3 text-sm font-semibold text-[var(--text)]"
              >
                <LockKeyhole size={16} />
                Ver opciones premium
              </Link>
            </div>
          </div>
        </aside>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <article className="rounded-[28px] border border-white/10 bg-[var(--panel)] p-6">
          <h2 className="font-heading text-4xl uppercase tracking-[0.05em] text-[var(--text)]">
            Idiomas
          </h2>
          <p className="mt-4 text-[var(--muted)]">{trainer.languages.join(" · ")}</p>
        </article>
        <article className="rounded-[28px] border border-white/10 bg-[var(--panel)] p-6">
          <h2 className="font-heading text-4xl uppercase tracking-[0.05em] text-[var(--text)]">
            Modalidades
          </h2>
          <p className="mt-4 text-[var(--muted)]">{trainer.modalities.join(" · ")}</p>
        </article>
        <article className="rounded-[28px] border border-white/10 bg-[var(--panel)] p-6">
          <h2 className="font-heading text-4xl uppercase tracking-[0.05em] text-[var(--text)]">
            Desde
          </h2>
          <p className="mt-4 text-[var(--muted)]">{trainer.priceFrom} € por sesión o plan equivalente</p>
        </article>
      </section>
    </main>
  );
}
