export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  audience: "Clientes" | "Entrenadores" | "Marketplace";
  publishedAt: string;
  updatedAt: string;
  reviewedAt: string;
  sources: Array<{ label: string; href: string }>;
  relatedSlugs: string[];
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

export const EDITORIAL_UPDATED_AT = "2026-10-06";

export const blogPosts: BlogPost[] = [
  {
    "slug": "como-elegir-entrenador-personal-con-criterio",
    "title": "Cómo elegir entrenador personal con criterio antes de contactar",
    "excerpt": "Una guía práctica para comparar entrenadores por objetivo, ciudad, modalidad y señales profesionales sin caer en perfiles inflados.",
    "category": "Guía de compra",
    "audience": "Clientes",
    "publishedAt": "2026-07-16",
    "readingMinutes": 5,
    "hero": "Elegir entrenador no debería depender de una foto potente o una promesa imposible. Debería parecerse más a tomar una decisión profesional: comparar señales, detectar encaje y contactar cuando hay intención real.",
    "sections": [
      {
        "heading": "Empieza por el objetivo, no por el físico del entrenador",
        "body": [
          "El primer filtro útil es tu objetivo: fuerza, pérdida de grasa, recomposición, salud, posparto, rendimiento o seguimiento online. Un buen perfil debe explicar para quién trabaja mejor y qué tipo de proceso suele diseñar.",
          "Si un entrenador intenta servir a todo el mundo con el mismo mensaje, falta una señal de especialización. No siempre es mala señal, pero sí conviene comparar con más calma."
        ]
      },
      {
        "heading": "Compara modalidad, precio de entrada y experiencia",
        "body": [
          "La modalidad cambia mucho la experiencia: presencial, online o híbrida. También cambia el precio razonable, la frecuencia de contacto y el tipo de seguimiento que vas a recibir.",
          "Un marketplace útil debe enseñarte esos datos antes de que tengas que escribir. Así evitas conversaciones largas que terminan descubriendo una incompatibilidad básica."
        ]
      },
      {
        "heading": "Busca claridad, no promesas absolutas",
        "body": [
          "Desconfía de garantías universales, resultados extremos o mensajes que prometen una transformación sin contexto. El entrenamiento depende de historial, adherencia, descanso, alimentación y salud.",
          "Los mejores perfiles suelen ser concretos: explican método, límites, especialidades y qué esperan de ti como cliente."
        ]
      }
    ],
    "cta": {
      "label": "Comparar entrenadores",
      "href": "/entrenadores"
    },
    "updatedAt": "2026-10-06",
    "reviewedAt": "2026-10-06",
    "sources": [
      {
        "label": "Superentrenador: funcionamiento y límites del servicio",
        "href": "/como-funciona"
      }
    ],
    "relatedSlugs": [
      "contacto-protegido-marketplace-entrenadores",
      "preparar-primer-cliente-entrenador-andalucia"
    ]
  },
  {
    "slug": "como-publicar-perfil-entrenador-que-convierte",
    "title": "Cómo publicar un perfil de entrenador que convierte",
    "excerpt": "Para entrenadores: cómo explicar especialidad, ciudad, precios y método para que un cliente entienda rápido si encajas.",
    "category": "Captación",
    "audience": "Entrenadores",
    "publishedAt": "2026-07-16",
    "readingMinutes": 4,
    "hero": "Un perfil público no es una bio decorativa. Es una página de venta breve: tiene que explicar a quién ayudas, cómo trabajas y por qué merece la pena escribirte.",
    "sections": [
      {
        "heading": "Empieza por ciudad, objetivo y especialidad",
        "body": [
          "La búsqueda de entrenador suele ser local: ciudad, barrio, modalidad y objetivo. Si esos datos no aparecen claros, el cliente no sabe si debe seguir leyendo.",
          "No prometas resultados imposibles. Explica para qué tipo de persona eres una buena opción y qué problema concreto sabes resolver."
        ]
      },
      {
        "heading": "Un perfil claro vende mejor que una bio genérica",
        "body": [
          "Los clientes no necesitan leer una autobiografía completa para dar el primer paso. Necesitan entender especialidad, precio de entrada, formato de trabajo, experiencia y tipo de cliente al que ayudas.",
          "Cuanto más fácil sea compararte, más fácil será que una persona con intención real decida escribirte."
        ]
      },
      {
        "heading": "Ajusta el mensaje con datos reales",
        "body": [
          "Un buen perfil se mejora con preguntas reales: qué dudas repiten los clientes, qué especialidad genera más interés y qué oferta se entiende más rápido.",
          "El objetivo no es llenar una ficha: es construir una presencia comercial que puedas mejorar con datos reales."
        ]
      },
      {
        "heading": "Envía el perfil a revisión",
        "body": [
          "Necesitas una cuenta y el correo confirmado para guardar tu perfil profesional. El alta y las ediciones quedan pendientes de revisión antes de publicarse. Completa información comprobable: una ficha publicada no garantiza visitas ni clientes."
        ]
      }
    ],
    "cta": {
      "label": "Publicar perfil",
      "href": "/registro?intent=trainer"
    },
    "updatedAt": "2026-10-06",
    "reviewedAt": "2026-10-06",
    "sources": [
      {
        "label": "Superentrenador: funcionamiento y límites del servicio",
        "href": "/como-funciona"
      }
    ],
    "relatedSlugs": [
      "preparar-primer-cliente-entrenador-andalucia",
      "necesito-web-entrenador-personal"
    ]
  },
  {
    "slug": "andalucia-primer-mercado-entrenadores-personales",
    "title": "Andalucía como primer mercado para entrenadores personales",
    "excerpt": "Por qué activar una región completa, con capitales y Costa del Sol, es mejor que lanzar una web generalista sin foco.",
    "category": "Mercado",
    "audience": "Marketplace",
    "publishedAt": "2026-07-16",
    "readingMinutes": 4,
    "hero": "Un marketplace no gana por estar en todas partes desde el primer día. Gana cuando concentra oferta, demanda y mensajes locales en un territorio que puede validar.",
    "sections": [
      {
        "heading": "Una región completa crea más contexto",
        "body": [
          "Andalucía permite combinar capitales, ciudades medianas y zonas de alta demanda como la Costa del Sol. Eso hace posible comparar patrones de búsqueda sin dispersar demasiado el producto.",
          "La estrategia regional ayuda a construir páginas de ciudad, categorías y mensajes comerciales con una narrativa coherente."
        ]
      },
      {
        "heading": "Las ciudades vacías deben tratarse con cuidado",
        "body": [
          "Publicar páginas de ciudad sin perfiles puede ser útil para preparar el mercado, pero no siempre aporta valor al usuario desde el primer día.",
          "Por eso cada ciudad debe abrirse con una experiencia mínima: perfiles reales, filtros claros y una razón concreta para seguir navegando."
        ]
      },
      {
        "heading": "El siguiente paso natural es España por oleadas",
        "body": [
          "Cuando Andalucía tenga oferta real, el sistema puede replicarse por regiones: Madrid, Comunidad Valenciana, Cataluña, País Vasco y el resto de España.",
          "La clave es mantener el mismo estándar: perfiles comparables, contacto protegido y contenido local útil."
        ]
      }
    ],
    "cta": {
      "label": "Ver cobertura Andalucía",
      "href": "/andalucia"
    },
    "updatedAt": "2026-10-06",
    "reviewedAt": "2026-10-06",
    "sources": [
      {
        "label": "Superentrenador: funcionamiento y límites del servicio",
        "href": "/como-funciona"
      }
    ],
    "relatedSlugs": [
      "como-elegir-entrenador-personal-con-criterio",
      "como-publicar-perfil-entrenador-que-convierte"
    ]
  },
  {
    "slug": "contacto-protegido-marketplace-entrenadores",
    "title": "Cómo contactar con un entrenador en Superentrenador",
    "excerpt": "De la comparación de perfiles al primer mensaje, con cuenta y correo confirmado.",
    "category": "Producto",
    "audience": "Marketplace",
    "publishedAt": "2026-07-16",
    "readingMinutes": 3,
    "hero": "Revisa primero si el perfil encaja con tu objetivo, modalidad y zona. Después entra en tu cuenta para consultar las opciones de contacto disponibles y explicar qué necesitas.",
    "sections": [
      {
        "heading": "Compara antes de escribir",
        "body": [
          "El directorio permite filtrar perfiles. En cada ficha puedes consultar la información publicada por el entrenador, como especialidades, modalidad, experiencia y precio orientativo. Un precio sin importe se presenta como «Consultar precio»."
        ]
      },
      {
        "heading": "Cuenta y correo confirmado",
        "body": [
          "Para acceder al contacto protegido o enviar un mensaje necesitas iniciar sesión y tener el correo confirmado. Las opciones dependen de la información disponible en cada perfil; no todos tienen que ofrecer el mismo canal.",
          "Puedes seguir los mensajes de la plataforma desde tu panel. Presenta tu objetivo, ciudad o preferencia online y disponibilidad aproximada, sin incluir datos de salud sensibles en el primer contacto."
        ]
      },
      {
        "heading": "Acordad el servicio directamente",
        "body": [
          "La plataforma no confirma reservas ni procesa pagos de sesiones. Precio definitivo, disponibilidad, condiciones y forma de pago se acuerdan con el profesional. No hay una promesa de respuesta inmediata.",
          "Comprueba las credenciales y las condiciones del servicio antes de contratar. La publicación de una ficha no garantiza un resultado deportivo ni sustituye esa comprobación."
        ]
      }
    ],
    "cta": {
      "label": "Entrar al marketplace",
      "href": "/entrenadores"
    },
    "updatedAt": "2026-10-06",
    "reviewedAt": "2026-10-06",
    "sources": [
      {
        "label": "Superentrenador: funcionamiento y límites del servicio",
        "href": "/como-funciona"
      }
    ],
    "relatedSlugs": [
      "como-elegir-entrenador-personal-con-criterio",
      "preparar-primer-cliente-entrenador-andalucia"
    ]
  },
  {
    "slug": "necesito-ser-autonomo-entrenador-personal",
    "title": "¿Necesito ser autónomo para trabajar como entrenador personal?",
    "excerpt": "Distingue el alta censal en Hacienda del alta en Seguridad Social y prepara los trámites antes de empezar.",
    "category": "Autónomos",
    "audience": "Entrenadores",
    "publishedAt": "2026-08-05",
    "readingMinutes": 6,
    "hero": "Publicar un perfil no sustituye los trámites para ejercer. Si vas a trabajar por tu cuenta, revisa por separado tus obligaciones fiscales, de Seguridad Social y profesionales antes de prestar servicios.",
    "sections": [
      {
        "heading": "Hacienda y Seguridad Social: dos trámites distintos",
        "body": [
          "El alta censal comunica a Hacienda tu actividad y tus obligaciones fiscales. Se presenta mediante el modelo 036 antes del inicio de la actividad u operaciones que lo requieren; no conviene esperar a emitir la primera factura. El modelo 037 fue suprimido el 3 de febrero de 2025.",
          "El alta en el RETA corresponde a la Seguridad Social. La regla general comprende la actividad económica o profesional realizada de forma habitual, personal, directa, por cuenta propia y con ánimo de lucro. Estar de alta en Hacienda no implica estar de alta en el RETA, ni al revés."
        ]
      },
      {
        "heading": "No decidas solo por cuánto ingresas",
        "body": [
          "Ingresar menos que el salario mínimo no crea por sí solo una exención automática del RETA. Si tu actividad es ocasional, la valoración depende de las circunstancias: evita aplicar un umbral como permiso general para trabajar sin alta.",
          "La Seguridad Social indica que el alta debe tramitarse antes de empezar y puede solicitarse hasta 60 días antes. Si vas a trabajar contratado por un gimnasio, distingue la relación laboral de una actividad propia real antes de elegir el régimen."
        ]
      },
      {
        "heading": "Prepara la actividad antes del primer cliente",
        "body": [
          "Define qué servicios prestarás, dónde y bajo qué condiciones. Confirma el epígrafe fiscal, los impuestos aplicables y la documentación con la administración o una asesoría; no todos los entrenadores tienen la misma situación.",
          "Revisa también la titulación o habilitación que corresponda al servicio y territorio, el seguro y las condiciones del centro. Conserva los justificantes de tus altas. Esta guía orienta sobre trámites generales en España; no resuelve un caso individual."
        ]
      }
    ],
    "cta": {
      "label": "Publicar mi perfil",
      "href": "/registro?intent=trainer"
    },
    "updatedAt": "2026-10-06",
    "reviewedAt": "2026-10-06",
    "sources": [
      {
        "label": "AEAT: supresión del modelo 037 desde el 3 de febrero de 2025",
        "href": "https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/manual-iva-2025/capitulo-01-novedades-destacar-2025/modelo-037.html"
      },
      {
        "label": "AEAT: plazo de la declaración de alta censal",
        "href": "https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/guia-practica-cumplimentacion-modelo-censal-036/anexos/anexo-03-instrucciones-modelo-036/plazo-presentacion/declaracion-alta.html"
      },
      {
        "label": "Seguridad Social: guía del trabajo autónomo",
        "href": "https://portal.seg-social.gob.es/wps/portal/importass/importass/Colectivos/Trabajo%2BAutonomo/guia"
      }
    ],
    "relatedSlugs": [
      "como-facturar-entrenador-personal",
      "seguro-responsabilidad-civil-entrenador-andalucia"
    ]
  },
  {
    "slug": "como-facturar-entrenador-personal",
    "title": "Cómo facturar como entrenador personal: IVA, IRPF y datos básicos",
    "excerpt": "Qué revisar antes de emitir una factura, sin aplicar el mismo impuesto o retención a todos los servicios.",
    "category": "Fiscalidad",
    "audience": "Entrenadores",
    "publishedAt": "2026-08-05",
    "readingMinutes": 7,
    "hero": "Una factura debe reflejar el servicio real y su tratamiento fiscal. El tipo de actividad, quién la presta, el cliente y el territorio pueden cambiar las obligaciones.",
    "sections": [
      {
        "heading": "Identifica el servicio y el destinatario",
        "body": [
          "Antes de facturar, comprueba tu alta censal y la clasificación de la actividad. La obligación general de expedir factura tiene excepciones y reglas para facturas simplificadas; no elijas un formato solo porque el importe sea pequeño.",
          "En una factura completa, revisa numeración correlativa dentro de cada serie, fecha de expedición, identificación y datos fiscales exigibles de emisor y destinatario, descripción del servicio, base imponible, tipo y cuota del impuesto cuando proceda. Si la fecha de la operación es distinta, también debe constar. Conserva copia y utiliza el procedimiento de rectificación si hay un error."
        ]
      },
      {
        "heading": "IVA: practicar deporte no implica exención",
        "body": [
          "En operaciones sujetas al IVA español en Península y Baleares, el tipo general es el 21 %, salvo que corresponda otro tratamiento. No apliques automáticamente una exención por llamar al servicio deportivo, educativo o de salud.",
          "La exención de determinados servicios deportivos depende, entre otros requisitos, de la entidad que los presta: la ley contempla organismos públicos, federaciones y determinadas entidades deportivas de carácter social. No es una exención general para cualquier entrenador autónomo. Las operaciones en otros territorios o con clientes del extranjero requieren una revisión específica."
        ]
      },
      {
        "heading": "IRPF: depende de la actividad y de quién paga",
        "body": [
          "Cuando son rendimientos de una actividad profesional y el pagador está obligado a retener, el tipo general es el 15 %. El 7 % para inicio de actividad profesional exige requisitos y comunicación al pagador; no se aplica a todo nuevo autónomo.",
          "Un consumidor particular que contrata para su uso personal no practica esta retención por esa condición. Tampoco debe asumirse que toda actividad de entrenamiento está clasificada como profesional: confirma tu caso antes de añadir una retención a cada factura."
        ]
      },
      {
        "heading": "Antes de enviar la factura",
        "body": [
          "Comprueba datos, concepto, impuestos, total y condiciones acordadas. Una factura correcta no convierte por sí sola un gasto en deducible: la deducción tiene sus propios requisitos y justificantes.",
          "Superentrenador permite descubrir perfiles y contactar. No emite tus facturas ni calcula tus impuestos, y no incorpora el cobro o la reserva de sesiones. Consulta las fuentes y revisa tu caso con una asesoría cuando haya dudas."
        ]
      }
    ],
    "cta": {
      "label": "Publicar mi perfil",
      "href": "/registro?intent=trainer"
    },
    "updatedAt": "2026-10-06",
    "reviewedAt": "2026-10-06",
    "sources": [
      {
        "label": "BOE: Reglamento de facturación, artículos 6 y 7",
        "href": "https://www.boe.es/buscar/act.php?id=BOE-A-2012-14696"
      },
      {
        "label": "AEAT: exenciones deportivas del IVA",
        "href": "https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/manual-iva-2026/capitulo-03-entregas-realizadas-empresarios-profesionales/entregas-bienes-servic-realizadas-empresarios-profesionales/operaciones-exentas/exenciones-operaciones-interiores/exenciones-sociales-culturales-deportivas.html"
      },
      {
        "label": "BOE: Ley del IVA, artículos 20 y 90",
        "href": "https://www.boe.es/buscar/act.php?id=BOE-A-1992-28740"
      },
      {
        "label": "BOE: Reglamento del IRPF, artículos 76 y 95",
        "href": "https://www.boe.es/buscar/act.php?id=BOE-A-2007-6820"
      }
    ],
    "relatedSlugs": [
      "necesito-ser-autonomo-entrenador-personal",
      "preparar-primer-cliente-entrenador-andalucia"
    ]
  },
  {
    "slug": "necesito-web-entrenador-personal",
    "title": "¿Necesito una web propia como entrenador personal?",
    "excerpt": "Perfil en un marketplace, web propia y recomendaciones: canales distintos para explicar tus servicios.",
    "category": "Marketing digital",
    "audience": "Entrenadores",
    "publishedAt": "2026-08-05",
    "readingMinutes": 5,
    "hero": "Elige un canal que puedas mantener con información útil y actualizada. Tener una página o un perfil no garantiza visitas, posicionamiento ni nuevos clientes.",
    "sections": [
      {
        "heading": "Empieza por una oferta comprensible",
        "body": [
          "Explica a quién ayudas, en qué ciudad o modalidad trabajas, tu experiencia y cómo es tu servicio. Publica precios con su unidad o indica que deben consultarse. Una descripción concreta facilita que alguien valore si encajas con lo que busca."
        ]
      },
      {
        "heading": "Qué aporta un perfil en Superentrenador",
        "body": [
          "Un perfil aprobado puede aparecer en el directorio y facilitar la comparación por ciudad, modalidad y especialidad. El alta y las ediciones pasan por revisión; enviar el formulario no equivale a publicar de inmediato.",
          "No garantizamos tráfico, una posición en buscadores ni contactos. La demanda y la visibilidad dependen de factores que no controla por completo el marketplace."
        ]
      },
      {
        "heading": "Cuándo puede ayudarte una web propia",
        "body": [
          "Una web permite desarrollar tu método, contenidos y presentación con más detalle, pero requiere mantenimiento. Puedes combinarla con tu perfil y otros canales sin duplicar promesas ni información desactualizada.",
          "Google explica que las mejoras de SEO pueden tardar en reflejarse y que no hay garantías de indexación o posicionamiento. Prioriza información útil para tus clientes y mide consultas reales antes de invertir más."
        ]
      }
    ],
    "cta": {
      "label": "Preparar mi perfil",
      "href": "/registro?intent=trainer"
    },
    "updatedAt": "2026-10-06",
    "reviewedAt": "2026-10-06",
    "sources": [
      {
        "label": "Superentrenador: funcionamiento y límites del servicio",
        "href": "/como-funciona"
      },
      {
        "label": "Google Search Central: guía de SEO para principiantes",
        "href": "https://developers.google.com/search/docs/fundamentals/seo-starter-guide?hl=es"
      }
    ],
    "relatedSlugs": [
      "como-publicar-perfil-entrenador-que-convierte",
      "contacto-protegido-marketplace-entrenadores"
    ]
  },
  {
    "slug": "seguro-responsabilidad-civil-entrenador-andalucia",
    "title": "Seguro de responsabilidad civil, salud y accidentes: qué revisar como entrenador en Andalucía",
    "excerpt": "Tres coberturas distintas y el alcance de la normativa andaluza sobre servicios deportivos.",
    "category": "Profesión",
    "audience": "Entrenadores",
    "readingMinutes": 6,
    "hero": "Un seguro de salud no sustituye a un seguro de responsabilidad civil. Antes de comenzar, identifica qué riesgos cubre cada póliza, quién figura como asegurado y qué actividad has declarado.",
    "sections": [
      {
        "heading": "Tres seguros, tres preguntas",
        "body": [
          "La responsabilidad civil cubre, dentro del contrato, la obligación de indemnizar daños causados a terceros por hechos previstos en la póliza. El seguro de accidentes cubre las consecuencias de una lesión accidental según lo contratado. El de enfermedad o asistencia sanitaria atiende prestaciones sanitarias o económicas pactadas.",
          "Una lesión durante una sesión no implica automáticamente responsabilidad del entrenador ni cobertura de cualquier póliza. Revisa actividad, personas aseguradas, límites, franquicias y exclusiones con la entidad aseguradora."
        ]
      },
      {
        "heading": "Qué dice la ley andaluza",
        "body": [
          "El artículo 45 de la Ley 5/2016 del Deporte de Andalucía establece la obligación de seguro de responsabilidad civil para la prestación de servicios deportivos. Su apartado 3 contempla el turismo activo con cobertura equivalente para evitar exigir un seguro específico adicional. Esta referencia territorial no debe extenderse sin más a toda España.",
          "El artículo 97 prevé un seguro para el ejercicio de las profesiones reguladas en ese título y excepciones para quienes prestan servicios a la Administración mediante relación administrativa o laboral, para actividad exclusivamente por cuenta ajena ya cubierta y para los supuestos de cobertura colegial previstos. Sin embargo, la disposición final quinta condiciona la entrada en vigor del título VII a su desarrollo reglamentario. En la fecha de revisión, la Junta mantiene el proyecto de ordenación profesional en elaboración. No presentamos el artículo 97 como una obligación universal ya operativa ni sus excepciones como una exención general de toda responsabilidad o seguro.",
          "Esa situación no elimina la obligación del artículo 45. Si trabajas para un centro, pide confirmación de que su póliza cubre tu actividad y relación concreta; no basta con que el centro diga que tiene seguro. La cobertura colegial exige comprobar la condición profesional y las condiciones de la póliza, no solo estar colegiado."
        ]
      },
      {
        "heading": "Qué pedir antes de contratar o renovar",
        "body": [
          "Describe las sesiones presenciales y online, el lugar de trabajo, las actividades y si colaboras con otros profesionales. Solicita por escrito qué queda cubierto, el ámbito territorial, capitales, franquicia, exclusiones y procedimiento ante un incidente.",
          "El seguro de accidentes ligado a licencias y competiciones oficiales del artículo 42 tiene su propio ámbito: no equivale a afirmar que todas las sesiones particulares estén cubiertas. Guarda la documentación y revisa la póliza cuando cambies de actividad. Esta guía no valora un siniestro ni sustituye revisar tu contrato."
        ]
      }
    ],
    "sources": [
      {
        "label": "BOE: Ley 5/2016 del Deporte de Andalucía, artículos 42, 45, 97 y disposición final quinta",
        "href": "https://www.boe.es/buscar/act.php?id=BOE-A-2016-7566"
      },
      {
        "label": "Junta de Andalucía: proyecto de ordenación de profesiones del deporte",
        "href": "https://www.juntadeandalucia.es/servicios/normativa/normas-elaboracion/detalle/238945.html"
      },
      {
        "label": "BOE: Ley de Contrato de Seguro, artículos 73, 100 y 105",
        "href": "https://www.boe.es/buscar/act.php?id=BOE-A-1980-22501"
      }
    ],
    "publishedAt": "2026-10-06",
    "updatedAt": "2026-10-06",
    "reviewedAt": "2026-10-06",
    "cta": {
      "label": "Preparar mi perfil",
      "href": "/registro?intent=trainer"
    },
    "relatedSlugs": [
      "preparar-primer-cliente-entrenador-andalucia",
      "necesito-ser-autonomo-entrenador-personal"
    ]
  },
  {
    "slug": "preparar-primer-cliente-entrenador-andalucia",
    "title": "Cómo preparar tu primer cliente como entrenador en Andalucía",
    "excerpt": "Una lista práctica para llegar a la primera sesión con servicio, condiciones y documentación claros.",
    "category": "Profesión",
    "audience": "Entrenadores",
    "readingMinutes": 5,
    "hero": "Conseguir un contacto es el comienzo de una conversación. Antes de aceptar una primera sesión, comprueba que puedes prestar el servicio y que ambas partes entienden qué están acordando.",
    "sections": [
      {
        "heading": "Define el servicio que puedes prestar",
        "body": [
          "Explica el objetivo, formato, lugar, duración y material necesario. Comprueba la titulación o habilitación que corresponda a las funciones concretas y al territorio; no conviertas el nombre comercial «entrenador personal» en una autorización para cualquier actividad.",
          "En Andalucía, la Ley 5/2016 contiene regulación profesional con condiciones de desarrollo reglamentario. Consulta su estado y el supuesto concreto con la administración competente. Evita prometer diagnósticos, rehabilitación o resultados que excedan tu preparación y funciones."
        ]
      },
      {
        "heading": "Revisa altas, cobertura y espacio",
        "body": [
          "Si trabajas por cuenta propia, revisa las altas censal y de Seguridad Social antes de empezar. Si trabajas contratado, aclara tus funciones y condiciones con el centro. Guarda justificantes y confirma la cobertura de responsabilidad civil aplicable al servicio.",
          "Comprueba que puedes usar el espacio previsto y qué normas, permisos y medidas de seguridad corresponden. Un parque, un gimnasio ajeno y una sesión online no plantean las mismas condiciones."
        ]
      },
      {
        "heading": "Acordad las condiciones antes de la sesión",
        "body": [
          "Confirma por escrito precio y unidad —hora, sesión o programa—, duración, lugar o enlace, disponibilidad, cancelaciones y forma de pago. Explica qué incluye el servicio y cuándo revisaréis el progreso.",
          "No solicites historias clínicas por un mensaje inicial. Recoge solo la información necesaria por un canal y procedimiento adecuados; si el caso requiere valoración sanitaria, remite al profesional competente."
        ]
      },
      {
        "heading": "Usa el perfil para facilitar una conversación útil",
        "body": [
          "En Superentrenador puedes preparar tu ficha y enviarla a revisión tras confirmar tu correo. Mantén ciudad, modalidad, experiencia y precio coherentes con lo que vas a ofrecer. Las ediciones también pasan por revisión.",
          "El cliente puede descubrir y comparar perfiles y contactar con su cuenta confirmada. Las reservas, pagos y condiciones de la sesión se acuerdan directamente: publicar un perfil no equivale a tener una cita confirmada ni garantiza contactos."
        ]
      }
    ],
    "sources": [
      {
        "label": "BOE: Ley 5/2016 del Deporte de Andalucía",
        "href": "https://www.boe.es/buscar/act.php?id=BOE-A-2016-7566"
      },
      {
        "label": "Seguridad Social: guía del trabajo autónomo",
        "href": "https://portal.seg-social.gob.es/wps/portal/importass/importass/Colectivos/Trabajo%2BAutonomo/guia"
      },
      {
        "label": "Superentrenador: funcionamiento y límites del servicio",
        "href": "/como-funciona"
      }
    ],
    "publishedAt": "2026-10-06",
    "updatedAt": "2026-10-06",
    "reviewedAt": "2026-10-06",
    "cta": {
      "label": "Preparar mi perfil",
      "href": "/registro?intent=trainer"
    },
    "relatedSlugs": [
      "seguro-responsabilidad-civil-entrenador-andalucia",
      "como-facturar-entrenador-personal"
    ]
  }
];

export function listBlogPosts() {
  return [...blogPosts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug) ?? null;
}

export function getRelatedBlogPosts(slug: string): BlogPost[] {
  return (getBlogPost(slug)?.relatedSlugs ?? []).flatMap((relatedSlug) => {
    const post = getBlogPost(relatedSlug);
    return post ? [post] : [];
  });
}
