import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/blog", "/entrenadores", "/ciudades", "/login"],
        disallow: ["/dashboard", "/mi-perfil", "/mis-anuncios", "/admin", "/api"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
