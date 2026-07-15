import type { MetadataRoute } from "next";
import { listMarketplaceCities, listPublicTrainerProfiles } from "@/lib/repositories/trainers";
import { siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [cities, trainers] = await Promise.all([listMarketplaceCities(), listPublicTrainerProfiles()]);
  const activeCitySlugs = new Set(trainers.map((trainer) => trainer.citySlug));
  const activeCities = cities.filter((city) => activeCitySlugs.has(city.slug));
  const hasPublishedSupply = trainers.length > 0;

  return [
    {
      url: siteConfig.url,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...(hasPublishedSupply
      ? [
          {
            url: `${siteConfig.url}/entrenadores`,
            changeFrequency: "daily" as const,
            priority: 0.9,
          },
          {
            url: `${siteConfig.url}/andalucia`,
            changeFrequency: "weekly" as const,
            priority: 0.85,
          },
        ]
      : []),
    ...activeCities.map((city) => ({
      url: `${siteConfig.url}/ciudades/${city.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...trainers.map((trainer) => ({
      url: `${siteConfig.url}/entrenadores/${trainer.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
