export const siteConfig = {
  name: "Super Entrenador",
  description:
    "Marketplace de entrenadores personales con SEO público, perfiles indexables y futura zona privada conectada a Supabase.",
  domain: "https://superentrenador.com",
  get url() {
    return process.env.NEXT_PUBLIC_SITE_URL ?? this.domain;
  },
};
