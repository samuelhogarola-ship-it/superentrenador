import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionHeading } from "@/components/section-heading";
import { TrainerCard } from "@/components/trainer-card";
import { getMarketplaceCity, listMarketplaceCities, listTrainerProfilesByCity } from "@/lib/repositories/trainers";

interface CityPageProps {
  params: Promise<{ city: string }>;
}

export async function generateStaticParams() {
  const cities = await listMarketplaceCities();
  return cities.map((city) => ({ city: city.slug }));
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const { city } = await params;
  const currentCity = await getMarketplaceCity(city);

  if (!currentCity) {
    return {
      title: "Ciudad no encontrada | Super Entrenador",
    };
  }

  return {
    title: `${currentCity.heroTitle} | Super Entrenador`,
    description: currentCity.seoDescription,
    alternates: {
      canonical: `/ciudades/${currentCity.slug}`,
    },
  };
}

export default async function CityPage({ params }: CityPageProps) {
  const { city } = await params;
  const currentCity = await getMarketplaceCity(city);

  if (!currentCity) {
    notFound();
  }

  const trainers = await listTrainerProfilesByCity(currentCity.slug);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-12 px-6 py-14 lg:px-10">
      <SectionHeading
        eyebrow={`${currentCity.name} · ${currentCity.region}`}
        title={currentCity.heroTitle}
        body={currentCity.intro}
      />

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {trainers.map((trainer) => (
          <TrainerCard key={trainer.id} trainer={trainer} />
        ))}
      </div>
    </main>
  );
}
