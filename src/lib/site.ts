const CANONICAL_PRODUCTION_ORIGIN = "https://superentrenador.com";

export function normalizeSiteUrl(value: string, nodeEnv = process.env.NODE_ENV) {
  const origin = new URL(value).origin;
  if (nodeEnv === "production" && origin !== CANONICAL_PRODUCTION_ORIGIN) {
    throw new Error(`Invalid canonical production origin: ${origin}`);
  }
  return origin;
}

export const siteConfig = {
  name: "Super Entrenador",
  description:
    "Encuentra entrenadores por ciudad, especialidad, modalidad y precio de entrada con contacto protegido.",
  domain: CANONICAL_PRODUCTION_ORIGIN,
  get url() {
    return normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL ?? this.domain);
  },
};

export function createSocialMetadata(title: string, description: string, path: string) {
  return {
    openGraph: {
      type: "website" as const,
      title,
      description,
      url: `${siteConfig.url}${path}`,
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
    },
  };
}
