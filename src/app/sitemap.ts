import type { MetadataRoute } from "next";
import { listBlogPosts } from "@/lib/blog";
import { listMarketplaceCities, listPublicTrainerProfiles } from "@/lib/repositories/trainers";
import { siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [cities, trainers] = await Promise.all([listMarketplaceCities(), listPublicTrainerProfiles()]);
  const posts = listBlogPosts();
  const activeCitySlugs = new Set(trainers.map((trainer) => trainer.citySlug));
  const activeCities = cities.filter((city) => activeCitySlugs.has(city.slug));
  const hasPublishedSupply = trainers.length > 0;

  return [
    {
      url: siteConfig.url,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/blog`,
      changeFrequency: "weekly",
      priority: 0.75,
    },
    ...posts.map((post) => ({
      url: `${siteConfig.url}/blog/${post.slug}`,
      lastModified: post.publishedAt,
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
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
