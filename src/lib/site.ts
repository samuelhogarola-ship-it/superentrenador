export const siteConfig = {
  name: "Super Entrenador",
  description:
    "Encuentra entrenadores personales por ciudad, especialidad, modalidad y precio de entrada con contacto protegido.",
  domain: "https://superentrenador.com",
  get url() {
    return process.env.NEXT_PUBLIC_SITE_URL ?? this.domain;
  },
};
