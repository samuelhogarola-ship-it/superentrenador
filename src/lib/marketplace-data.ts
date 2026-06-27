import type { MarketplaceCity, PublicTrainerProfile } from "@/types/marketplace";

export const marketplaceCities: MarketplaceCity[] = [
  {
    slug: "fuengirola",
    name: "Fuengirola",
    region: "Málaga",
    country: "España",
    heroTitle: "Entrenadores personales en Fuengirola",
    intro:
      "Descubre entrenadores verificados para recomposición corporal, fuerza, pérdida de grasa y entrenamiento online o presencial.",
    seoDescription:
      "Marketplace de entrenadores personales en Fuengirola con perfiles públicos, especialidades, reseñas y acceso privado tras registro o pago.",
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
