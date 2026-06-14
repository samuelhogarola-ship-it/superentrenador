import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/entrenadores", "/ciudades", "/login"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
