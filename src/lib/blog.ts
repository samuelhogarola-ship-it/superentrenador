export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  audience: "Clientes" | "Entrenadores" | "Marketplace";
  publishedAt: string;
  readingMinutes: number;
  hero: string;
  sections: Array<{
    heading: string;
    body: string[];
  }>;
  cta: {
    label: string;
    href: string;
  };
}

export const blogPosts: BlogPost[] = [
  {
    slug: "como-elegir-entrenador-personal-con-criterio",
    title: "Cómo elegir entrenador personal con criterio antes de contactar",
    excerpt:
      "Una guía práctica para comparar entrenadores por objetivo, ciudad, modalidad y señales profesionales sin caer en perfiles inflados.",
    category: "Guía de compra",
    audience: "Clientes",
    publishedAt: "2026-07-16",
    readingMinutes: 5,
    hero:
      "Elegir entrenador no debería depender de una foto potente o una promesa imposible. Debería parecerse más a tomar una decisión profesional: comparar señales, detectar encaje y contactar cuando hay intención real.",
    sections: [
      {
        heading: "Empieza por el objetivo, no por el físico del entrenador",
        body: [
          "El primer filtro útil es tu objetivo: fuerza, pérdida de grasa, recomposición, salud, posparto, rendimiento o seguimiento online. Un buen perfil debe explicar para quién trabaja mejor y qué tipo de proceso suele diseñar.",
          "Si un entrenador intenta servir a todo el mundo con el mismo mensaje, falta una señal de especialización. No siempre es mala señal, pero sí conviene comparar con más calma.",
        ],
      },
      {
        heading: "Compara modalidad, precio de entrada y experiencia",
        body: [
          "La modalidad cambia mucho la experiencia: presencial, online o híbrida. También cambia el precio razonable, la frecuencia de contacto y el tipo de seguimiento que vas a recibir.",
          "Un marketplace útil debe enseñarte esos datos antes de que tengas que escribir. Así evitas conversaciones largas que terminan descubriendo una incompatibilidad básica.",
        ],
      },
      {
        heading: "Busca claridad, no promesas absolutas",
        body: [
          "Desconfía de garantías universales, resultados extremos o mensajes que prometen una transformación sin contexto. El entrenamiento depende de historial, adherencia, descanso, alimentación y salud.",
          "Los mejores perfiles suelen ser concretos: explican método, límites, especialidades y qué esperan de ti como cliente.",
        ],
      },
    ],
    cta: {
      label: "Comparar entrenadores",
      href: "/entrenadores",
    },
  },
  {
    slug: "por-que-publicar-perfil-fundador",
    title: "Por qué publicar tu perfil fundador antes de que llegue el tráfico",
    excerpt:
      "Para entrenadores: cómo entrar pronto ayuda a posicionar ciudad, especialidad y oferta antes de competir en un marketplace maduro.",
    category: "Captación",
    audience: "Entrenadores",
    publishedAt: "2026-07-16",
    readingMinutes: 4,
    hero:
      "Los primeros perfiles de un marketplace no solo ocupan espacio: definen el estándar. Para un entrenador, entrar pronto puede ser la forma más inteligente de posicionarse antes de que el canal se llene.",
    sections: [
      {
        heading: "Llegar antes ayuda a ocupar intención local",
        body: [
          "La búsqueda de entrenador suele ser local: ciudad, barrio, modalidad y objetivo. Publicar pronto permite trabajar esa presencia antes de que haya decenas de perfiles compitiendo por la misma categoría.",
          "No se trata de prometer leads inmediatos. Se trata de preparar una ficha pública seria, revisable y lista para campañas cuando se active la demanda.",
        ],
      },
      {
        heading: "Un perfil claro vende mejor que una bio genérica",
        body: [
          "Los clientes no necesitan leer una autobiografía completa para dar el primer paso. Necesitan entender especialidad, precio de entrada, formato de trabajo, experiencia y tipo de cliente al que ayudas.",
          "Cuanto más fácil sea compararte, más fácil será que una persona con intención real decida escribirte.",
        ],
      },
      {
        heading: "La ventaja inicial es aprender el mensaje",
        body: [
          "Los perfiles fundadores permiten ajustar textos, categorías, ciudades y llamadas a la acción antes del lanzamiento abierto. Esa información vale mucho para convertir mejor después.",
          "El objetivo no es llenar una ficha: es construir una presencia comercial que puedas mejorar con datos reales.",
        ],
      },
    ],
    cta: {
      label: "Crear perfil fundador",
      href: "/registro",
    },
  },
  {
    slug: "andalucia-primer-mercado-entrenadores-personales",
    title: "Andalucía como primer mercado para entrenadores personales",
    excerpt:
      "Por qué activar una región completa, con capitales y Costa del Sol, es mejor que lanzar una web generalista sin foco.",
    category: "Mercado",
    audience: "Marketplace",
    publishedAt: "2026-07-16",
    readingMinutes: 4,
    hero:
      "Un marketplace no gana por estar en todas partes desde el primer día. Gana cuando concentra oferta, demanda y mensajes locales en un territorio que puede validar.",
    sections: [
      {
        heading: "Una región completa crea más contexto",
        body: [
          "Andalucía permite combinar capitales, ciudades medianas y zonas de alta demanda como la Costa del Sol. Eso hace posible comparar patrones de búsqueda sin dispersar demasiado el producto.",
          "La estrategia regional ayuda a construir landings locales, categorías y mensajes comerciales con una narrativa coherente.",
        ],
      },
      {
        heading: "Las ciudades vacías deben tratarse con cuidado",
        body: [
          "Publicar páginas locales sin perfiles puede ser útil para captación, pero no siempre conviene indexarlas de inmediato. Si no hay oferta, el usuario no encuentra valor suficiente y Google tampoco.",
          "Por eso las páginas de ciudad deben activarse para SEO cuando haya perfiles publicados o contenido local suficiente.",
        ],
      },
      {
        heading: "El siguiente paso natural es España por oleadas",
        body: [
          "Cuando Andalucía tenga oferta real, el sistema puede replicarse por regiones: Madrid, Comunidad Valenciana, Cataluña, País Vasco y el resto de España.",
          "La clave es mantener el mismo estándar: perfiles comparables, contacto protegido y contenido local útil.",
        ],
      },
    ],
    cta: {
      label: "Ver cobertura Andalucía",
      href: "/andalucia",
    },
  },
  {
    slug: "contacto-protegido-marketplace-entrenadores",
    title: "Contacto protegido: menos ruido para clientes y entrenadores",
    excerpt:
      "Cómo un flujo de contacto ordenado mejora la calidad de las conversaciones y evita perder tiempo con mensajes sin intención.",
    category: "Producto",
    audience: "Marketplace",
    publishedAt: "2026-07-16",
    readingMinutes: 3,
    hero:
      "En fitness, el problema no siempre es conseguir más mensajes. A veces es conseguir mejores conversaciones: con contexto, intención y expectativas razonables.",
    sections: [
      {
        heading: "El contacto directo sin contexto genera fricción",
        body: [
          "Cuando un usuario escribe sin haber comparado objetivo, precio, modalidad y experiencia, la conversación empieza demasiado pronto. El entrenador tiene que filtrar a mano lo que la plataforma podría aclarar antes.",
          "El contacto protegido no bloquea el negocio: ordena el momento en el que aparece.",
        ],
      },
      {
        heading: "El cliente también gana control",
        body: [
          "Un cliente puede revisar varias fichas, entender diferencias y contactar cuando tiene una shortlist clara. Eso reduce presión y mejora la sensación de decisión.",
          "La confianza no depende solo de reseñas. También depende de que el producto no empuje a contactar a ciegas.",
        ],
      },
      {
        heading: "La calidad del lead importa más que el volumen bruto",
        body: [
          "Para un entrenador, diez conversaciones desordenadas pueden valer menos que dos mensajes con objetivo, ciudad y modalidad bien definidos.",
          "Un marketplace premium debe optimizar para esa calidad de señal.",
        ],
      },
    ],
    cta: {
      label: "Entrar al marketplace",
      href: "/entrenadores",
    },
  },
];

export function listBlogPosts() {
  return [...blogPosts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug) ?? null;
}
