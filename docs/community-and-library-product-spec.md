# Biblioteca y comunidad de Superentrenador

Actualizado: 2026-10-31

## Objetivo

Convertir la biblioteca en la capa de conocimiento de Superentrenador y usar la comunidad para conectar alumnos y profesionales sin convertir el foro en un canal de spam o en una forma de saltarse el Pase Alumno.

## Biblioteca y Blogger

- La ruta pública principal es `/biblioteca`.
- Reúne guías, rutinas, recetas y comunidad, aunque cada tipo de contenido pueda tener su propia ruta más adelante.
- Los artículos editoriales que ya viven en el repositorio siguen disponibles en `/blog` para conservar sus URL y su historial SEO.
- WF-Blogger usa el tenant `superentrenador` del panel central de WF Studio. El panel y la aplicación montan el mismo volumen en `WF_BLOGGER_ROOT`; la web solo lee archivos con estado `published`.
- El webhook `/api/wf-blogger/publish` exige un secreto compartido y sirve para invalidar la biblioteca después de publicar. No admite contenido en el cuerpo ni expone el volumen.
- Las categorías de WF-Blogger deben normalizarse a `Guías`, `Rutinas`, `Recetas` o `Comunidad`. La aplicación no inyecta HTML remoto: interpreta Markdown con componentes propios y reduce a texto plano cualquier entrada HTML heredada.

## Audiencias y permisos

### Usuario registrado gratuito

- Puede leer toda la biblioteca pública.
- Puede participar en debates generales tras confirmar su correo.
- No puede iniciar contacto con entrenadores ni formular preguntas privadas a expertos.

### Pase Alumno — 10 € al mes

- Incluye el contacto protegido con entrenadores.
- Puede formular una pregunta a expertos por mes, con un máximo de cinco preguntas dentro del periodo que se defina comercialmente.
- Las preguntas no utilizadas no se acumulan salvo que las condiciones de contratación lo indiquen expresamente.

### Entrenador Pro — 20 € al mes

- Incluye las ventajas profesionales publicadas, Coach Studio completo para hasta tres clientes y el banco de rutinas.
- Puede realizar hasta diez consultas a expertos por mes.
- Puede obtener puntos por iniciar debates útiles, responder y recibir valoraciones positivas.

## Reputación y respuestas

- Cada entrenador usa un alias público único, moderado y separado de su nombre comercial.
- El alias no puede contener teléfono, email, URL, red social, marca comercial propia ni llamadas a contactar fuera de la plataforma.
- Una pregunta admite varias respuestas. La primera respuesta válida recibe una bonificación de rapidez, pero no bloquea respuestas posteriores.
- El autor puede marcar una respuesta como aceptada. Los votos de usuarios y la moderación ponderan la utilidad; la longitud por sí sola no genera puntos.
- El sistema elimina puntos por contenido duplicado, relleno, respuestas generadas en masa, autopromoción o coordinación de votos.

## Descuentos para entrenadores

- Los descuentos son créditos mensuales revisables del 5 %, 10 % o 15 %, nunca una modificación inmediata de la suscripción.
- Se calculan con actividad validada del mes anterior: respuestas aceptadas, votos útiles de usuarios distintos, debates aprobados y ausencia de sanciones.
- Debe existir un mínimo de palabras, pero también controles de similitud, calidad y moderación para que escribir más no sea suficiente.
- El primer respondedor puede recibir más puntos, pero una respuesta posterior aceptada debe valer más que la mera rapidez.
- Los créditos tienen un estado auditable: `pending`, `approved`, `applied` o `rejected`.
- Nunca se concede descuento por responder a una conversación propia, usar cuentas relacionadas o repetir sustancialmente una respuesta existente.

## Modelo de datos propuesto

1. `community_profiles`: usuario, alias, alias normalizado, estado de moderación y fecha de aprobación.
2. `forum_topics`: autor, tipo (`discussion` o `expert_question`), título, cuerpo, estado y respuesta aceptada.
3. `forum_replies`: tema, autor, cuerpo, estado y marca de primera respuesta válida.
4. `forum_votes`: un voto por usuario y respuesta, sin permitir voto propio.
5. `community_point_events`: libro mayor inmutable con origen, puntos y motivo de moderación.
6. `expert_question_usage`: periodo mensual, plan aplicable y consumo.
7. `trainer_discount_credits`: mes, porcentaje, estado, explicación y factura a la que se aplica.

Todas las escrituras deben pasar por funciones SQL o endpoints que validen sesión, correo confirmado, plan, cuota, propiedad y límites. RLS sigue siendo la última barrera en base de datos.

## Orden de implementación

1. Activar Blogger y clasificar contenido de biblioteca.
2. Crear perfiles comunitarios y reserva de alias.
3. Lanzar debates generales sin puntos ni descuentos.
4. Añadir preguntas a expertos con cuotas mensuales.
5. Añadir votos, respuesta aceptada y moderación.
6. Medir abuso y calidad durante al menos un ciclo mensual.
7. Activar puntos y créditos de descuento después de validar las reglas con datos reales.

## Decisiones todavía necesarias

- Confirmar si el máximo de cinco preguntas del Pase Alumno es anual, por suscripción o simultáneo.
- Definir quién puede presentarse como experto y cómo se verifica.
- Elegir el umbral exacto de puntos para 5 %, 10 % y 15 %.
- Decidir si los créditos caducan y si pueden acumularse.
- Definir política de moderación, apelación y retirada de insignias.
