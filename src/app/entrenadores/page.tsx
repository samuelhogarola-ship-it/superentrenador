import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { FiltersBar } from "@/components/filters-bar";
import { JsonLd } from "@/components/json-ld";
import { MarketplaceEmptyState } from "@/components/marketplace-empty-state";
import { Reveal } from "@/components/reveal";
import { TrainerListItem } from "@/components/trainer-list-item";
import { trainerCollectionJsonLd } from "@/lib/marketplace-seo";
import { siteConfig } from "@/lib/site";
import {
  listAllModalities,
  listAllSpecialties,
  listMarketplaceCities,
  listPublicTrainerProfiles,
} from "@/lib/repositories/trainers";

interface TrainersPageProps {
  searchParams: Promise<{ specialty?: string; city?: string; modality?: string; sort?: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const trainers = await listPublicTrainerProfiles();
  const hasPublishedSupply = trainers.length > 0;

  return {
    title: "Entrenadores personales",
    description: hasPublishedSupply
      ? "Explora perfiles públicos de entrenadores personales por ciudad, especialidad y formato antes de desbloquear contacto y contratación."
      : "Publica o explora perfiles locales de entrenadores personales antes de abrir el marketplace a más tráfico por ciudad.",
    alternates: {
      canonical: "/entrenadores",
    },
    robots: hasPublishedSupply ? undefined : { index: false, follow: true },
  };
}

export default async function TrainersPage({ searchParams }: TrainersPageProps) {
  const params = await searchParams;
  const [trainers, specialties, modalities, cities] = await Promise.all([
    listPublicTrainerProfiles({
      specialty: params.specialty,
      citySlug: params.city,
      modality: params.modality,
      sort: params.sort as "featured" | "rating" | "price-asc" | "price-desc" | undefined,
    }),
    listAllSpecialties(),
    listAllModalities(),
    listMarketplaceCities(),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 md:px-6 md:py-8 lg:px-8">
      <JsonLd data={trainerCollectionJsonLd(trainers, `${siteConfig.url}/entrenadores`, "Entrenadores personales")} />
      <section className="premium-card grid gap-5 rounded-[28px] px-6 py-7 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="app-kicker">Marketplace</p>
          <h1 className="app-title mt-2 text-3xl text-[var(--text)] sm:text-5xl">
            {trainers.length > 0
              ? `${trainers.length} entrenador${trainers.length === 1 ? "" : "es"} para comparar con criterio`
              : "Estamos preparando los primeros perfiles por ciudad"}
          </h1>
          <p className="app-copy mt-3 max-w-2xl text-sm">
            {trainers.length > 0
              ? "Filtra por especialidad, ciudad o modalidad y revisa perfiles con precio, experiencia y formato antes de desbloquear el contacto."
              : "Estamos preparando la primera oferta publicada por ciudades. Si eres entrenador, entra ahora para dejar tu perfil listo antes de abrir tráfico local a clientes."}
          </p>
        </div>
        <Link
          href="/registro"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--line-strong)] bg-[var(--surface)] px-5 py-3 text-sm font-bold text-[var(--text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          Publicar perfil
          <ArrowRight size={15} />
        </Link>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        {["Contacto protegido", "Perfiles comparables", "Búsqueda por ciudad"].map((item) => (
          <div key={item} className="rounded-[18px] border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm font-semibold text-[var(--text)]">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck size={15} className="text-[var(--accent)]" />
              {item}
            </span>
          </div>
        ))}
      </section>

      <Suspense fallback={null}>
        <FiltersBar specialties={specialties} modalities={modalities} cities={cities} basePath="/entrenadores" />
      </Suspense>

      <div className="grid gap-4">
        {trainers.map((trainer, index) => (
          <Reveal key={trainer.id} delay={Math.min(index, 6) * 60}>
            <TrainerListItem trainer={trainer} />
          </Reveal>
        ))}
        {trainers.length === 0 ? (
          <MarketplaceEmptyState resetHref="/entrenadores" />
        ) : null}
      </div>
    </main>
  );
}
