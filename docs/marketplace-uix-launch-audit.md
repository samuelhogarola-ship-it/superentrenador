# Auditoría UX y plan de lanzamiento del marketplace

Actualizado: 2026-10-31

## Objetivo

Dejar Superentrenador listo para captar entrenadores reales y validar demanda local en un máximo de dos semanas, empezando por el entorno de Gimnasio Escolindantes. La referencia es el sistema de decisión de marketplaces consolidados como Superprof —búsqueda directa, filtros comprensibles y perfiles comparables— sin copiar su diseño, textos ni identidad.

## Resumen ejecutivo

La entrada al buscador y la página de resultados ya tienen una jerarquía más corta y comprensible. La interfaz no inventa entrenadores, reseñas, precios, tiempos de respuesta ni promociones. Cuando no existe oferta publicada, lo dice de forma explícita y mantiene la página fuera del índice mediante `noindex`.

El principal riesgo de lanzamiento ya no es visual: es atraer alumnos antes de tener suficiente oferta real en la zona. Los folletos solo deberían activarse cuando existan perfiles aprobados, formas de contacto probadas y medición de las conversiones principales.

## Estado UX implementado

### Entrada y búsqueda

- Cabecera reducida, sin navegación secundaria que compita con buscar o iniciar sesión.
- Hero compacto con una única entrada progresiva: categoría, ciudad y modalidad.
- Categorías rápidas limitadas a seis opciones frecuentes.
- La ciudad admite texto libre además de las ciudades ya registradas.
- No existe navegación inferior con apariencia de aplicación móvil.

### Resultados

- Título editorial estable: “Entrenadores disponibles”.
- Recuento basado únicamente en perfiles públicos reales.
- Eliminados los bloques redundantes “Contacto protegido”, “Perfiles comparables” y “Búsqueda por ciudad”.
- Filtros ligeros para categoría, especialidad, ciudad, ubicación/modalidad, precio máximo y orden.
- Modalidades visibles: “Cerca de mí”, “Presencial” y “Online”.
- “Cerca de mí” limita a perfiles presenciales de la ciudad elegida. No promete kilómetros exactos porque los perfiles todavía no guardan coordenadas.
- El precio máximo filtra realmente por `price_from`; los perfiles sin precio no se presentan como si cumplieran ese límite.
- Las fichas usan separadores y espacio en blanco en lugar de cajas y sombras pesadas.
- El estado vacío explica que no hay perfiles aprobados y no introduce datos de demostración.

### Accesibilidad y responsive

- Controles con etiquetas accesibles, foco visible y áreas táctiles de al menos 44 px.
- Distribución de dos columnas en móvil y progresión a seis controles en escritorio.
- Flujo principal utilizable con teclado y envío mediante Enter.
- El contenido esencial se mantiene antes que los argumentos comerciales en pantallas pequeñas.

## Comparativa conceptual con Superprof

| Criterio | Patrón de referencia | Superentrenador actual | Próximo ajuste útil |
| --- | --- | --- | --- |
| Velocidad percibida | Decisión rápida desde una intención clara | Entrada progresiva y resultados sin bloques promocionales | Añadir analítica de tiempo hasta el primer resultado |
| Claridad de búsqueda | Qué, dónde y formato | Categoría, ciudad y modalidad en el flujo principal | Recordar la última ciudad con consentimiento |
| Fricción de filtros | Pocos filtros de alto valor | Categoría, objetivo, ciudad, modalidad, precio y orden | Mostrar contador por filtro cuando haya suficiente oferta |
| Comparación | Información homogénea por perfil | Nombre, ubicación, verificación, reseñas reales, propuesta, precio y modalidad | Estandarizar credenciales y disponibilidad |
| Confianza | Señales verificables y contacto controlado | Solo muestra estados y reseñas existentes | Proceso visible de verificación y política de moderación |
| Conversión | CTA único y siguiente paso obvio | “Ver perfil” y “Publicar perfil” diferenciados | Medir vista de perfil y solicitud de contacto |

No se replica la composición visual de Superprof. Se conservan la tipografía, los colores, el tono y la estructura de marca de Superentrenador.

## Límites actuales que no deben ocultarse

1. No hay coordenadas en ciudades ni perfiles; por tanto, un radio real de 5, 10 o 20 km todavía no es técnicamente fiable.
2. Las páginas locales vacías deben seguir con `noindex, follow`; indexarlas produciría páginas débiles.
3. La búsqueda por categoría se apoya parcialmente en especialidades y texto porque el perfil público no tiene una columna de categoría dedicada.
4. Antes de invertir en captación hace falta probar el contacto completo con un perfil y un usuario reales.
5. La reputación solo debe mostrarse cuando existan reseñas verificadas; nunca se deben generar testimonios de lanzamiento.

## Plan de lanzamiento en dos semanas

### Días 1–2: cerrar la propuesta y la medición

- Definir la promesa mínima: encontrar entrenadores reales por disciplina, ciudad, modalidad y precio inicial.
- Confirmar el modelo inicial por audiencia: cuenta gratuita para alumnos sin contacto, Pase Alumno de 10 € al mes para contactar y planes profesionales desde 20 € al mes para visibilidad y Coach Studio.
- Configurar eventos: `search_started`, `search_completed`, `filter_changed`, `profile_viewed`, `contact_started`, `trainer_signup_started`, `trainer_profile_submitted` y `trainer_profile_approved`.
- Registrar origen de campaña con UTM específico para los folletos de Gimnasio Escolindantes.

### Días 3–5: crear oferta real

- Incorporar manualmente entre 8 y 15 entrenadores del área inmediata y disciplinas con demanda observable.
- Revisar identidad, foto, ciudad, servicio, modalidad, precio inicial y consentimiento de publicación.
- Exigir una descripción concreta y un medio de contacto probado.
- Publicar únicamente perfiles aprobados; conservar borradores y pendientes fuera del marketplace.

### Días 6–7: prueba completa y confianza

- Ejecutar registro por email, Magic Link y Google en móvil y escritorio.
- Probar búsqueda, filtros, ficha y contacto con cuentas reales de prueba.
- Verificar privacidad, términos, política de moderación, eliminación de cuenta y canal de incidencias.
- Comprobar que emails y pantallas usan la identidad de Superentrenador y textos en español.

### Días 8–10: base SEO local útil

- Publicar solo páginas de ciudad o disciplina que ya tengan oferta real y contenido propio.
- Crear una página local del área de Gimnasio Escolindantes cuando se confirme el nombre geográfico, dirección/NAP y cobertura exacta.
- Añadir títulos, descripciones, canonical, enlazado interno y datos estructurados coherentes con los perfiles mostrados.
- Mantener en `noindex` las combinaciones sin resultados o con contenido insuficiente.
- Preparar dos piezas de biblioteca que respondan a intención local real, no artículos genéricos creados para rellenar.

### Días 11–12: validación de captación

- Crear QR y URL corta con UTM para el folleto.
- Hacer una tirada pequeña o prueba controlada antes de imprimir volumen.
- Revisar el recorrido desde el QR hasta búsqueda, perfil y contacto en un teléfono real y con conexión móvil.
- Confirmar que la página carga rápido y que no aparecen errores de autenticación ni CAPTCHA bloqueado.

### Días 13–14: salida y revisión diaria

- Distribuir la primera tanda en Gimnasio Escolindantes con autorización del centro.
- Revisar búsquedas, perfiles vistos, contactos iniciados, altas de entrenadores y errores.
- Contactar manualmente con los primeros usuarios que acepten seguimiento para entender abandonos.
- Decidir si ampliar zona, captar más oferta o corregir el embudo antes de imprimir otra tanda.

## Mínimo para considerar el producto listo para promocionar

- Al menos 8 perfiles reales, aprobados y completos en la zona de campaña.
- Al menos 3 disciplinas con opciones útiles o una disciplina claramente dominante con varias alternativas.
- Búsqueda, perfil y contacto probados de extremo a extremo en móvil.
- Login por email/Magic Link y Google comprobados en producción.
- Correos transaccionales en español y con identidad de Superentrenador.
- Eventos de conversión visibles en analítica y UTM del folleto validado.
- Privacidad, términos, moderación y canal de soporte accesibles.
- Páginas sin oferta fuera del índice y sitemap sin URLs vacías.
- CI verde, despliegue estable y ausencia de errores críticos en registros.

## Métricas de la primera validación

- Escaneos del QR y sesiones con UTM.
- Porcentaje que inicia y completa una búsqueda.
- Porcentaje de resultados que abre una ficha.
- Porcentaje de fichas que inicia contacto.
- Búsquedas sin resultados por categoría y ciudad.
- Altas iniciadas, perfiles enviados y perfiles aprobados.
- Coste por contacto útil, aunque la distribución inicial sea manual.

La señal de éxito de estas dos semanas no es el tráfico bruto. Es demostrar que una persona de la zona puede encontrar una opción real, entenderla y contactar sin ayuda, y que nuevos entrenadores pueden publicar una ficha revisable sin intervención técnica.
