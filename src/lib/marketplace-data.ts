import type { MarketplaceCity, PublicTrainerProfile } from "@/types/marketplace";

export const marketplaceCities: MarketplaceCity[] = [
  {
    slug: "almeria",
    name: "Almería",
    region: "Almería",
    country: "España",
    heroTitle: "Entrenadores personales en Almería",
    intro:
      "Compara entrenadores personales en Almería para fuerza, pérdida de grasa, salud y seguimiento online con perfiles preparados para captar demanda local.",
    seoDescription:
      "Encuentra entrenadores personales en Almería por especialidad, modalidad, experiencia y precio antes de desbloquear el contacto.",
  },
  {
    slug: "cadiz",
    name: "Cádiz",
    region: "Cádiz",
    country: "España",
    heroTitle: "Entrenadores personales en Cádiz",
    intro:
      "Marketplace de entrenadores personales en Cádiz con fichas claras para comparar objetivos, modalidades y experiencia antes de contactar.",
    seoDescription:
      "Compara entrenadores personales en Cádiz por especialidad, experiencia, valoración y formato de entrenamiento.",
  },
  {
    slug: "cordoba",
    name: "Córdoba",
    region: "Córdoba",
    country: "España",
    heroTitle: "Entrenadores personales en Córdoba",
    intro:
      "Descubre entrenadores personales en Córdoba con perfiles pensados para decisiones rápidas: objetivo, experiencia, precio y modalidad.",
    seoDescription:
      "Encuentra entrenadores personales en Córdoba para entrenamiento presencial, online o híbrido con contacto protegido.",
  },
  {
    slug: "fuengirola",
    name: "Fuengirola",
    region: "Málaga",
    country: "España",
    heroTitle: "Entrenadores personales en Fuengirola",
    intro:
      "Descubre entrenadores revisados para recomposición corporal, fuerza, pérdida de grasa y entrenamiento online o presencial.",
    seoDescription:
      "Marketplace de entrenadores personales en Fuengirola con perfiles públicos, especialidades y contacto protegido tras registro.",
  },
  {
    slug: "granada",
    name: "Granada",
    region: "Granada",
    country: "España",
    heroTitle: "Entrenadores personales en Granada",
    intro:
      "Perfiles de entrenadores personales en Granada para comparar fuerza, recomposición corporal, rendimiento y planes online o presenciales.",
    seoDescription:
      "Marketplace de entrenadores personales en Granada con perfiles claros, especialidades visibles y contacto tras registro.",
  },
  {
    slug: "huelva",
    name: "Huelva",
    region: "Huelva",
    country: "España",
    heroTitle: "Entrenadores personales en Huelva",
    intro:
      "Encuentra entrenadores personales en Huelva con una experiencia de búsqueda simple, local y centrada en objetivos reales.",
    seoDescription:
      "Compara entrenadores personales en Huelva por objetivo, modalidad, precio de entrada y experiencia profesional.",
  },
  {
    slug: "jaen",
    name: "Jaén",
    region: "Jaén",
    country: "España",
    heroTitle: "Entrenadores personales en Jaén",
    intro:
      "Encuentra entrenadores personales en Jaén con perfiles comparables por objetivo, modalidad, experiencia y precio.",
    seoDescription:
      "Encuentra entrenadores personales en Jaén para fuerza, salud, pérdida de grasa y entrenamiento online o presencial.",
  },
  {
    slug: "jerez",
    name: "Jerez",
    region: "Cádiz",
    country: "España",
    heroTitle: "Entrenadores personales en Jerez",
    intro:
      "Compara entrenadores personales en Jerez por especialidad, experiencia y modalidad antes de iniciar una conversación.",
    seoDescription:
      "Marketplace de entrenadores personales en Jerez con perfiles públicos, contacto protegido y búsqueda por ciudad.",
  },
  {
    slug: "malaga",
    name: "Málaga",
    region: "Málaga",
    country: "España",
    heroTitle: "Entrenadores personales en Málaga",
    intro:
      "Compara perfiles públicos de entrenadores que trabajan presencialmente, online o con planes híbridos en Málaga.",
    seoDescription:
      "Compara entrenadores personales en Málaga por especialidad, experiencia y formato de servicio antes de desbloquear el contacto.",
  },
  {
    slug: "marbella",
    name: "Marbella",
    region: "Málaga",
    country: "España",
    heroTitle: "Entrenadores personales en Marbella",
    intro:
      "Perfiles premium de entrenadores personales en Marbella para comparar servicios presenciales, online e híbridos con criterio.",
    seoDescription:
      "Encuentra entrenadores personales en Marbella por especialidad, valoración, experiencia y precio desde el marketplace.",
  },
  {
    slug: "madrid",
    name: "Madrid",
    region: "Comunidad de Madrid",
    country: "España",
    heroTitle: "Entrenadores personales en Madrid",
    intro:
      "Ciudad preparada para ampliar el marketplace con perfiles por barrio, objetivo y modalidad de entrenamiento.",
    seoDescription:
      "Marketplace de entrenadores personales en Madrid con perfiles públicos claros y experiencia de búsqueda premium.",
  },
  {
    slug: "sevilla",
    name: "Sevilla",
    region: "Sevilla",
    country: "España",
    heroTitle: "Entrenadores personales en Sevilla",
    intro:
      "Marketplace de entrenadores personales en Sevilla con perfiles comparables para fuerza, salud, estética y seguimiento online.",
    seoDescription:
      "Compara entrenadores personales en Sevilla por especialidad, experiencia, modalidad y precio de entrada.",
  },
  {
    slug: "torremolinos",
    name: "Torremolinos",
    region: "Málaga",
    country: "España",
    heroTitle: "Entrenadores personales en Torremolinos",
    intro:
      "Encuentra entrenadores personales en Torremolinos con fichas claras, contacto protegido y cobertura local conectada con Málaga.",
    seoDescription:
      "Marketplace de entrenadores personales en Torremolinos para comparar servicios presenciales, online e híbridos.",
  },
];

export const publicTrainerProfiles: PublicTrainerProfile[] = [
  {
    id: "trainer-samuel-irongar",
    slug: "samuel-entrenador-personal-fuengirola",
    displayName: "Samuel Irongar",
    citySlug: "fuengirola",
    city: "Fuengirola",
    region: "Málaga",
    category: "Entrenador personal",
    headline: "Viking Fitness: entrenador personal en Fuengirola para fuerza, recomposición y hábitos reales.",
    shortBio:
      "Samuel Irongar dirige Viking Fitness en Fuengirola con sesiones presenciales y seguimiento online para personas que quieren entrenar con estructura.",
    longBio:
      "Viking Fitness nace para ayudar a personas de Fuengirola y alrededores a entrenar con un plan claro, medible y sostenible. Trabajo fuerza, recomposición corporal, pérdida de grasa y mejora de hábitos con sesiones presenciales, planificación online y revisiones periódicas.\n\nMi enfoque combina técnica, progresión y acompañamiento cercano: primero entendemos tu punto de partida, después definimos objetivos realistas y por último construimos una rutina que puedas mantener. Puedes entrenar de forma presencial en Fuengirola, online desde cualquier lugar o combinar ambos formatos según tu agenda.",
    specialties: ["Fuerza", "Recomposición corporal", "Pérdida de grasa", "Hábitos saludables", "Seguimiento online"],
    verified: true,
    yearsExperience: 7,
    rating: 5,
    reviewsCount: 12,
    priceFrom: 50,
    priceUnit: "hora",
    modalities: ["Presencial", "Online"],
    languages: ["Español", "Inglés"],
    hiddenContactHint: "Contacta con Viking Fitness desde una cuenta protegida para consultar disponibilidad presencial u online.",
    photoUrl: null,
    reviewStatus: "approved",
  },
];
