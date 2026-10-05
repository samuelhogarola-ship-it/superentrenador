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
    slug: "como-publicar-perfil-entrenador-que-convierte",
    title: "Cómo publicar un perfil de entrenador que convierte",
    excerpt:
      "Para entrenadores: cómo explicar especialidad, ciudad, precios y método para que un cliente entienda rápido si encajas.",
    category: "Captación",
    audience: "Entrenadores",
    publishedAt: "2026-07-16",
    readingMinutes: 4,
    hero:
      "Un perfil público no es una bio decorativa. Es una página de venta breve: tiene que explicar a quién ayudas, cómo trabajas y por qué merece la pena escribirte.",
    sections: [
      {
        heading: "Empieza por ciudad, objetivo y especialidad",
        body: [
          "La búsqueda de entrenador suele ser local: ciudad, barrio, modalidad y objetivo. Si esos datos no aparecen claros, el cliente no sabe si debe seguir leyendo.",
          "No prometas resultados imposibles. Explica para qué tipo de persona eres una buena opción y qué problema concreto sabes resolver.",
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
        heading: "Ajusta el mensaje con datos reales",
        body: [
          "Un buen perfil se mejora con preguntas reales: qué dudas repiten los clientes, qué especialidad genera más interés y qué oferta se entiende más rápido.",
          "El objetivo no es llenar una ficha: es construir una presencia comercial que puedas mejorar con datos reales.",
        ],
      },
    ],
    cta: {
      label: "Publicar perfil",
      href: "/registro?intent=trainer",
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
          "La estrategia regional ayuda a construir páginas de ciudad, categorías y mensajes comerciales con una narrativa coherente.",
        ],
      },
      {
        heading: "Las ciudades vacías deben tratarse con cuidado",
        body: [
          "Publicar páginas de ciudad sin perfiles puede ser útil para preparar el mercado, pero no siempre aporta valor al usuario desde el primer día.",
          "Por eso cada ciudad debe abrirse con una experiencia mínima: perfiles reales, filtros claros y una razón concreta para seguir navegando.",
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
  {
    slug: "necesito-ser-autonomo-entrenador-personal",
    title: "¿Necesito darme de alta como autónomo para ser entrenador personal?",
    excerpt:
      "Cuándo es obligatorio darse de alta en Hacienda y en el RETA para entrenar por tu cuenta, y qué pasa si cobras sin estar dado de alta.",
    category: "Autónomos",
    audience: "Entrenadores",
    publishedAt: "2026-08-05",
    readingMinutes: 6,
    hero:
      "Si cobras por entrenar a alguien de forma habitual, la ley te considera autónomo aunque sea a tiempo parcial o como complemento a otro trabajo. Esto es lo que suele determinar si toca darte de alta y qué implica cada paso.",
    sections: [
      {
        heading: "La regla no es cuánto cobras, es si es una actividad habitual",
        body: [
          "Hacienda no mide el alta por la cantidad facturada, sino por si ejerces la actividad de forma habitual, personal y directa a cambio de una contraprestación económica. Dar clases sueltas a un amigo por dinero, una vez, es distinto a tener clientes fijos cada semana.",
          "En la práctica, si entrenas a personas a cambio de dinero de forma recurrente —aunque sea solo los fines de semana o combinado con un contrato por cuenta ajena—, se considera actividad económica habitual y hay que darse de alta.",
          "La 'tarifa plana' de autónomos reduce la cuota de la Seguridad Social durante los primeros meses, así que empezar de alta cuesta menos de lo que mucha gente cree.",
        ],
      },
      {
        heading: "Qué altas hacen falta en concreto",
        body: [
          "Dos trámites, no uno: alta censal en Hacienda (modelo 036 o 037, declarando el epígrafe del IAE correspondiente a actividades deportivas) y alta en el Régimen Especial de Trabajadores Autónomos (RETA) de la Seguridad Social.",
          "Ambos trámites se pueden hacer online y, en la mayoría de casos, entran en vigor desde el mismo día que los presentas. No hace falta un gestor para darse de alta, aunque muchos entrenadores prefieren delegar la parte fiscal recurrente (IVA, IRPF trimestral) para no llevarla a mano.",
        ],
      },
      {
        heading: "Qué riesgo hay si cobras sin estar dado de alta",
        body: [
          "Trabajar cobrando sin alta expone a sanciones de Hacienda y de la Seguridad Social, y además deja sin cobertura (baja médica, accidente, jubilación) el tiempo trabajado en esa situación.",
          "También es un problema para crecer: sin factura no puedes justificar ingresos ante un banco, ni deducir gastos (material, formación, seguro de responsabilidad civil, la propia suscripción a un marketplace), ni construir un historial de cotización.",
        ],
      },
      {
        heading: "Esto no es asesoría fiscal personalizada",
        body: [
          "Cada situación cambia según si combinas el entrenamiento con un contrato por cuenta ajena, si trabajas para un gimnasio como autónomo o si facturas directamente a particulares. Antes de darte de alta, una consulta breve con una gestoría te ahorra errores caros en los primeros meses.",
        ],
      },
    ],
    cta: {
      label: "Publicar mi perfil",
      href: "/registro?intent=trainer",
    },
  },
  {
    slug: "como-facturar-entrenador-personal",
    title: "Cómo facturar como entrenador personal: la guía completa",
    excerpt:
      "Qué debe llevar una factura de entrenamiento personal, cómo va el IVA, cuándo se aplica retención de IRPF y qué errores hacen que Hacienda la rechace.",
    category: "Fiscalidad",
    audience: "Entrenadores",
    publishedAt: "2026-08-05",
    readingMinutes: 7,
    hero:
      "Facturar bien no es opcional ni un detalle administrativo: es lo que te permite cobrar de forma legal, deducir gastos y no llevarte un susto en la declaración trimestral. Esto es lo mínimo que necesitas entender.",
    sections: [
      {
        heading: "Qué debe llevar sí o sí una factura",
        body: [
          "Número de factura correlativo (sin saltos ni duplicados dentro del mismo año), fecha de emisión, tus datos fiscales completos (nombre, NIF, dirección) y los del cliente, descripción clara del servicio (por ejemplo 'sesiones de entrenamiento personal, mes de agosto'), base imponible, tipo y cuota de IVA, y el total.",
          "Si facturas a un particular, basta con estos datos. Si facturas a una empresa o a otro autónomo, revisa además si aplica retención de IRPF (ver más abajo).",
        ],
      },
      {
        heading: "El IVA de las clases de entrenamiento personal",
        body: [
          "Los servicios de entrenamiento personal y preparación física tributan, con carácter general, al tipo general de IVA (21%). No es un servicio educativo exento como sí lo son ciertas clases regladas impartidas por centros autorizados, así que la mayoría de entrenadores personales que facturan a particulares deben repercutir IVA en sus facturas.",
          "Hay matices según cómo esté organizada la actividad (por ejemplo, si trabajas dentro de un centro deportivo con un régimen distinto), así que conviene confirmar el epígrafe y el tratamiento de IVA con una gestoría al darte de alta.",
        ],
      },
      {
        heading: "Cuándo hay que aplicar retención de IRPF",
        body: [
          "Si facturas a otro profesional o empresa (por ejemplo, un gimnasio que te subcontrata), normalmente esa factura sí lleva retención de IRPF (habitualmente el 15%, o el 7% durante los primeros años de actividad si cumples los requisitos). Esa retención la ingresa el pagador directamente a Hacienda a cuenta de tu IRPF.",
          "Si facturas a un particular (tu alumno de toda la vida, por ejemplo), no se aplica retención: la factura lleva IVA pero no retención.",
        ],
      },
      {
        heading: "Qué gastos puedes deducir con factura",
        body: [
          "Material deportivo usado para el trabajo, formación y certificaciones, seguro de responsabilidad civil profesional, parte proporcional del alquiler de un espacio si entrenas en local propio, herramientas de gestión y suscripciones profesionales, entre otros —siempre que estén afectos a la actividad y tengas la factura correspondiente.",
          "Sin factura correcta no hay deducción posible, así que el mismo cuidado que pones en cobrar hay que ponerlo en pedir factura de lo que gastas.",
        ],
      },
      {
        heading: "Errores que más se repiten",
        body: [
          "Numeración de facturas desordenada o repetida, olvidar el NIF del cliente en facturas a empresas, no guardar copia de las facturas emitidas y recibidas (obligatorio conservarlas varios años), y confundir el tratamiento de IVA entre particulares y empresas.",
          "Un programa de facturación sencillo (o una gestoría) evita la mayoría de estos errores desde el primer trimestre.",
        ],
      },
    ],
    cta: {
      label: "Publicar mi perfil",
      href: "/registro?intent=trainer",
    },
  },
  {
    slug: "necesito-web-entrenador-personal",
    title: "¿Necesito una página web siendo entrenador personal?",
    excerpt:
      "Lo que realmente aporta una web propia frente a estar solo en redes o en un marketplace, y cuándo tiene sentido invertir en ella.",
    category: "Marketing digital",
    audience: "Entrenadores",
    publishedAt: "2026-08-05",
    readingMinutes: 5,
    hero:
      "La pregunta no es 'web sí o no' en abstracto. Es qué necesitas resolver ahora mismo: que te encuentren, que confíen en ti, o que te contacten sin fricción. Cada una pide una herramienta distinta.",
    sections: [
      {
        heading: "Lo que una web resuelve y las redes sociales no",
        body: [
          "Instagram o TikTok son buenos para mostrar trabajo y construir marca personal, pero dependen del algoritmo y no son tuyos: un cambio de política o una cuenta bloqueada te deja sin nada. Una web es un activo propio que no depende de un tercero para existir.",
          "Una web también es lo primero que revisa alguien que ya te vio en redes o te recomendaron, antes de escribirte: quiere confirmar que eres real, ver precios orientativos, especialidad y alguna prueba social (reseñas, casos, certificaciones).",
        ],
      },
      {
        heading: "Lo que una web NO resuelve sola",
        body: [
          "Una web bonita sin tráfico no genera clientes. Si nadie la visita, da igual el diseño: no aparece en las búsquedas locales que hace la gente cuando busca 'entrenador personal en [tu ciudad]', y construir ese posicionamiento SEO lleva meses de contenido y enlaces, no es automático.",
          "Aquí es donde un marketplace especializado adelanta trabajo: agrupa la demanda que ya busca activamente entrenador por ciudad y especialidad, en vez de depender de que tu web sola compita por ese tráfico desde cero.",
        ],
      },
      {
        heading: "Un orden razonable para la mayoría de entrenadores",
        body: [
          "Si estás empezando: perfil completo en un marketplace (visibilidad inmediata, sin coste de mantenimiento técnico) + redes sociales activas (para mostrar trabajo y generar confianza). Es la combinación con menos fricción y menos gasto fijo.",
          "Cuando ya tienes un flujo estable de clientes y quieres reforzar marca propia, controlar mejor el mensaje o vender productos digitales propios (programas, membresías), ahí sí una web dedicada empieza a justificar la inversión de tiempo y dinero.",
          "No son excluyentes: muchos entrenadores acaban con las tres cosas a la vez, cada una cumpliendo un papel distinto en el proceso de captación.",
        ],
      },
    ],
    cta: {
      label: "Publicar mi perfil gratis",
      href: "/registro?intent=trainer",
    },
  },
];

export function listBlogPosts() {
  return [...blogPosts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug) ?? null;
}
