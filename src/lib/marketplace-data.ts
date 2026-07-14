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
      "Marketplace de entrenadores personales en Granada con perfiles indexables, especialidades y contacto tras registro.",
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
      "Landings locales para entrenadores personales en Jaén con estructura SEO y perfiles comparables para captar demanda cercana.",
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
      "Marketplace de entrenadores personales en Jerez con perfiles públicos, contacto protegido y estructura SEO local.",
  },
  {
    slug: "malaga",
    name: "Málaga",
    region: "Málaga",
    country: "España",
    heroTitle: "Entrenadores personales en Málaga",
    intro:
      "Perfiles públicos indexables para captar demanda local y conectar con entrenadores que trabajan presencialmente y online.",
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
      "Ciudad preparada para escalar el marketplace con perfiles indexables por barrio, objetivo y modalidad de entrenamiento.",
    seoDescription:
      "Marketplace SEO de entrenadores personales en Madrid con perfiles públicos optimizados para buscadores y captación premium.",
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
    id: "trainer-carlos-ruiz",
    slug: "carlos-ruiz-entrenador-personal-fuengirola",
    displayName: "Carlos Ruiz",
    citySlug: "fuengirola",
    city: "Fuengirola",
    region: "Málaga",
    headline: "Hipertrofia, pérdida de grasa y seguimiento online con estructura real.",
    shortBio:
      "Entrenador personal en Fuengirola especializado en recomposición corporal y adherencia para perfiles que necesitan orden y constancia.",
    longBio:
      "Trabajo con clientes presenciales y online que quieren entrenar con dirección, seguimiento y una experiencia mucho más profesional que el clásico PDF suelto por WhatsApp. Mi enfoque combina fuerza, progresión real y procesos claros.",
    specialties: ["Hipertrofia", "Pérdida de grasa", "Seguimiento online", "Planes híbridos"],
    verified: true,
    yearsExperience: 8,
    rating: 4.9,
    reviewsCount: 47,
    priceFrom: 45,
    modalities: ["Presencial", "Online", "Híbrido"],
    languages: ["Español", "Inglés"],
    hiddenContactHint: "El contacto directo y la contratación se desbloquean tras registro o pago.",
    photoUrl: null,
    reviewStatus: "approved",
  },
  {
    id: "trainer-laura-moreno",
    slug: "laura-moreno-fitness-malaga",
    displayName: "Laura Moreno",
    citySlug: "malaga",
    city: "Málaga",
    region: "Málaga",
    headline: "Fuerza femenina, posparto y entrenamiento funcional sin humo.",
    shortBio:
      "Perfil orientado a mujeres que buscan un proceso claro, técnico y sostenible, tanto presencial como online.",
    longBio:
      "Acompaño a mujeres en etapas de vuelta al entrenamiento, fuerza general y objetivos de salud o estética con una metodología clara y progresiva. El foco está en mantener adherencia sin sacrificar calidad técnica.",
    specialties: ["Fuerza femenina", "Posparto", "Entrenamiento funcional"],
    verified: true,
    yearsExperience: 6,
    rating: 4.8,
    reviewsCount: 31,
    priceFrom: 50,
    modalities: ["Presencial", "Online"],
    languages: ["Español"],
    hiddenContactHint: "El perfil público muestra el valor; el contacto se reserva para usuarios registrados.",
    photoUrl: null,
    reviewStatus: "approved",
  },
  {
    id: "trainer-sergio-navarro",
    slug: "sergio-navarro-rendimiento-madrid",
    displayName: "Sergio Navarro",
    citySlug: "madrid",
    city: "Madrid",
    region: "Comunidad de Madrid",
    headline: "Rendimiento, fuerza aplicada y preparación física para deportistas.",
    shortBio:
      "Entrenador orientado a deportistas y perfiles intermedios que quieren estructura, métricas y progresión seria.",
    longBio:
      "Diseño programas de fuerza y preparación física para deportistas amateur y semiprofesionales. Mi servicio combina planificación clara, control de carga y una capa digital pensada para trabajar con datos reales.",
    specialties: ["Rendimiento", "Preparación física", "Fuerza aplicada"],
    verified: false,
    yearsExperience: 10,
    rating: 4.7,
    reviewsCount: 22,
    priceFrom: 60,
    modalities: ["Online", "Híbrido"],
    languages: ["Español", "Inglés"],
    hiddenContactHint: "El acceso completo al entrenador se activará en la zona privada premium.",
    photoUrl: null,
    reviewStatus: "approved",
  },
];
