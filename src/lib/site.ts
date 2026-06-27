export const siteConfig = {
  name: "Super Entrenador",
  description:
    "Encuentra tu entrenador personal ideal. Perfiles verificados, especialidades, precios y contacto directo en un solo lugar.",
  domain: "https://superentrenador.com",
  get url() {
    return process.env.NEXT_PUBLIC_SITE_URL ?? this.domain;
  },
};
