import type { MetadataRoute } from "next";
import { listMarketplaceCities, listPublicTrainerProfiles } from "@/lib/repositories/trainers";
import { siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [cities, trainers] = await Promise.all([listMarketplaceCities(), listPublicTrainerProfiles()]);

  return [
    {
      url: siteConfig.url,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/entrenadores`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/andalucia`,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    ...cities.map((city) => ({
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
