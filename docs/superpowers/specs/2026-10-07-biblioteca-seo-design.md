# Biblioteca SEO de Superentrenador

Fecha: 7 de octubre de 2026

Estado: diseño aprobado para preparar el plan de implementación

## Objetivo

Crear una biblioteca editorial independiente dentro de `superentrenador.com` que atraiga entrenadores personales y clientes mediante contenido útil, temático y local. La biblioteca debe conducir a los profesionales hacia el alta y a los clientes hacia perfiles reales del marketplace, sin convertir la portada ni las aplicaciones existentes en un archivo de artículos.

La prioridad comercial inmediata es captar entrenadores suficientes para que las personas interesadas encuentren oferta útil. El marketplace ya existe y se completará a medida que la biblioteca genere demanda y altas profesionales.

## Ecosistema existente y límites de esta entrega

Superentrenador ya existe como un ecosistema con productos independientes:

1. El marketplace público: portada, buscador, ciudades y perfiles profesionales.
2. La aplicación para entrenadores, donde cada plan admite un número determinado de personas entrenadas.
3. La aplicación para personas entrenadas, que permite registrar sus propios entrenamientos.

Esta entrega no reconstruye esas aplicaciones ni fusiona sus bases funcionales. Añade una cuarta superficie: la biblioteca SEO, accesible sin iniciar sesión y conectada mediante enlaces claros con el marketplace y las aplicaciones existentes.

La biblioteca reutiliza logo, colores, tipografía y componentes de marca, pero dispone de índice, navegación y jerarquía editorial propios. Una sola entrada discreta desde la navegación pública evita sobrecargar la portada.

## Arquitectura de URLs

- `/biblioteca`: índice general.
- `/biblioteca/autonomos`, `/biblioteca/seguros`, `/biblioteca/entrenamiento-online`, `/biblioteca/trabajar-en-gimnasios` y `/biblioteca/aplicaciones-para-entrenadores`: capítulos temáticos.
- `/biblioteca/malaga`, `/biblioteca/sevilla`, `/biblioteca/fuengirola`, `/biblioteca/madrid`, etc.: centros editoriales de ciudad.
- `/entrenadores?city=<slug>`: resultados del marketplace para una ciudad.
- `/registro?intent=trainer`: alta profesional.

Los slugs temáticos quedan reservados y no pueden usarse como ciudad. El registro editorial valida colisiones antes de generar rutas.

Los artículos existentes de `/blog/<slug>` se trasladarán a su destino canónico dentro de `/biblioteca`. Las rutas antiguas conservarán redirecciones permanentes individuales. No habrá dos páginas indexables con el mismo contenido.

## Modelo editorial

### Contenido nacional

Los conceptos de alcance estatal se mantienen en una única fuente editorial: alta censal, RETA, facturación, modalidades de trabajo, selección de herramientas y principios generales de seguros. Cada pieza incluye fuentes primarias, fecha de publicación, fecha de revisión y alcance explícito.

### Contenido autonómico

Las variaciones normativas o administrativas se modelan como contenido regional reutilizable. Una página local solo incorpora una diferencia autonómica cuando existe una fuente oficial que la respalda. No se extrapolan reglas de Andalucía al resto de España.

### Contenido de ciudad

Cada centro de ciudad responde a las dos intenciones principales:

- `entrenador personal <ciudad>` para clientes que quieren comparar opciones;
- `trabajar como entrenador personal en <ciudad>` para captar profesionales.

Cada página contiene introducción propia, modalidades locales, zonas o contextos de entrenamiento relevantes, acceso presencial y online, orientación para profesionales, preguntas frecuentes específicas, fuentes y dos llamadas a la acción: buscar entrenadores y publicar un perfil.

La estructura visual puede repetirse. El texto, las fuentes, las preguntas y los datos locales no se publican mediante sustitución automática del nombre de ciudad. Las páginas que no alcancen un mínimo editorial útil permanecen fuera del sitemap.

## Entrega por fases

### Fase 1: cimientos y primeras intenciones

- Crear `/biblioteca` y su navegación independiente.
- Migrar los nueve artículos existentes y conservar redirecciones desde `/blog`.
- Crear o ampliar las guías de autónomos, seguros, entrenamiento online, aplicaciones propias y trabajo en distintos gimnasios.
- Publicar los primeros centros de ciudad: Sevilla, Málaga, Fuengirola y Madrid.
- Registrar todas las rutas, fuentes, keywords e hitos en CSV y Markdown versionados.

Esta fase demuestra la arquitectura con cuatro mercados distintos: capital andaluza, gran mercado costero, mercado local de origen y principal mercado nacional.

### Fase 2: Andalucía y mercados solicitados

- Completar Marbella, Granada, Córdoba, Cádiz, Jerez de la Frontera, Almería, Huelva y Jaén.
- Añadir Tarragona, Bilbao, San Sebastián y Vitoria-Gasteiz.
- Añadir Barcelona, Valencia, Zaragoza, Murcia, Alicante, Palma, Las Palmas y Valladolid.
- Revisar enlaces internos entre ciudad, tema, buscador y alta profesional.

### Fase 3: expansión nacional basada en evidencia

- Ampliar a nuevas ciudades españolas según población relevante, cobertura profesional, impresiones y consultas reales de Search Console.
- Mejorar las páginas existentes antes de multiplicar rutas.
- Priorizar ciudades donde falten entrenadores y crear campañas editoriales de captación profesional específicas.

## Flujo hacia el marketplace

Las páginas locales no sustituyen los resultados del marketplace. El enlace `Buscar entrenador en <ciudad>` abre el directorio filtrado. Si todavía no existe oferta publicada, la biblioteca lo expresa sin inventar perfiles y destaca la captación profesional.

Las guías para entrenadores enlazan al alta y explican el funcionamiento real: confirmación de correo, preparación del perfil, revisión y publicación. No prometen clientes, posiciones en buscadores ni tiempos de aprobación no garantizados.

## Calidad, seguridad editorial y mantenimiento

- Fuentes oficiales para normativa, fiscalidad, Seguridad Social y requisitos autonómicos.
- Fecha de revisión visible y `dateModified` estable.
- Canonical único y redirecciones comprobadas.
- Sitemap limitado a contenido publicado y revisado.
- Datos estructurados acordes al contenido visible.
- Sin afirmaciones médicas, legales o fiscales universales cuando dependen del caso.
- Sin estadísticas de demanda inventadas ni texto copiado de competidores.
- Registro por URL con keyword principal, intención, ámbito, fuentes, estado, PR, fusión y producción.

## Verificación

Las pruebas deben cubrir resolución de slugs reservados, metadatos, canonical, redirecciones, sitemap, enlaces al marketplace, ausencia de contenido duplicado y exclusión de borradores. La comprobación visual abarcará 320, 390 y 1440 píxeles, navegación por teclado y ausencia de desbordamiento horizontal.

La validación de producción comprobará cada URL, su canonical, aparición en sitemap y coincidencia con el commit fusionado. Una compilación correcta o una PR fusionada no se considerarán publicación.

## Documentación recuperable

El repositorio guardará en `docs/seo/`:

- el informe completo de estado;
- un registro CSV de todas las URLs;
- los lotes editoriales por fecha;
- fuentes y fechas de revisión;
- evidencia de desarrollo, fusión y publicación.

Esta documentación se versionará en GitHub para recuperarla desde cualquier ordenador autorizado.

## Trabajo posterior fuera de este diseño

Después de la biblioteca se diseñará por separado una comunidad sencilla para usuarios y entrenadores: perfiles gratuitos y premium, recetas, foro, publicaciones y relaciones entre perfiles. Ese proyecto reutilizará las cuentas y capacidades de entrenamiento ya existentes en lugar de duplicarlas. Se estudiarán aplicaciones comparables como referencia funcional sin copiar textos, datos o diseño. El marketplace continuará completándose en paralelo a su captación de oferta. No se incluye análisis de calorías mediante fotografías.
