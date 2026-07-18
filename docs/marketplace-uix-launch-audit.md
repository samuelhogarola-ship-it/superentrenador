# Auditoria UIX de lanzamiento del marketplace

Fecha: 2026-07-17

## Objetivo

Preparar el marketplace para empezar a incorporar entrenadores reales con el menor riesgo operativo posible: registro claro, ficha editable, datos guardables en Supabase, revision admin y salida publica controlada.

## Diagnostico ejecutivo

El producto ya tiene una base visual fuerte y una arquitectura de marketplace razonable, pero el punto critico para salir a mercado no era estetico: era la fiabilidad del flujo de alta. Si la tabla `cities` no tenia ciudades activas, el guardado de perfiles podia fallar por la relacion `trainer_profiles.city_slug -> cities.slug`. Tambien faltaba una capa de validacion y orientacion para que un entrenador entendiera que debe completar antes de enviar su ficha.

## Hallazgos principales

1. Alta de entrenadores: el flujo necesitaba datos base de ciudades en Supabase para no romper al guardar perfiles.
2. Jerarquia del formulario: el entrenador no tenia un checklist visual de progreso antes de enviar.
3. Conversion: varios CTAs de "Publicar perfil" apuntaban a un registro generico en vez del intent explicito de entrenador.
4. Validacion: el cliente podia intentar guardar perfiles incompletos sin feedback previo suficientemente concreto.
5. API: faltaba una validacion server-side mas defensiva para arrays comerciales esenciales: especialidades, modalidades e idiomas.
6. Admin: la revision de perfiles pendientes mostraba poca informacion para decidir si aprobar o rechazar.
7. Confianza: enlazar una ficha pendiente podia generar confusion si todavia no estaba publicada.
8. Operacion: la app necesitaba una migracion idempotente de ciudades para poder replicar el estado minimo en entornos nuevos.

## Cambios aplicados

1. Se anade migracion de seed para ciudades iniciales de Andalucia, Costa del Sol y Madrid: Almeria, Cadiz, Cordoba, Fuengirola, Granada, Huelva, Jaen, Jerez, Malaga, Marbella, Madrid, Sevilla y Torremolinos.
2. El formulario de `Mi perfil` ahora arranca con ciudades fallback del marketplace aunque Supabase no devuelva filas.
3. El formulario incorpora checklist visual de publicacion: datos basicos, oferta clara y perfil revisable.
4. El cliente valida campos obligatorios antes de llamar a la API: nombre, ciudad, titular, bios, especialidades, modalidades, idiomas y precio.
5. La API valida que la ciudad exista, que los arrays comerciales no esten vacios y que el precio sea mayor que cero.
6. Los CTAs comerciales de publicacion apuntan a `/registro?intent=trainer`.
7. El panel admin carga bio completa, modalidades, idiomas, experiencia, precio y contacto para revisar mejor cada ficha.
8. El enlace "Ver ficha" del admin solo aparece si el perfil ya esta publicado.

## Comparativa UIX con marketplace tipo Superprof

Superprof reduce friccion con tres patrones fuertes: intencion clara desde el primer CTA, filtros entendibles y perfiles comparables. Este marketplace ya se acerca a ese modelo en busqueda por ciudad/especialidad, pero para competir necesita que cada entrenador pueda crear una ficha comparable sin asistencia manual.

La mejora clave no es copiar la interfaz, sino copiar el sistema: cada perfil debe responder rapido a "quien eres", "donde trabajas", "que objetivo resuelves", "como contacto" y "cuanto cuesta empezar". Los cambios de esta rama empujan el alta hacia ese formato.

## Siguientes mejoras recomendadas

1. Anadir preview privada de ficha antes de solicitar aprobacion.
2. Separar estado "borrador" de "pendiente de revision" si se quiere permitir guardar incompleto.
3. Anadir subida de foto real o integracion de storage para avatar profesional.
4. Crear campos estructurados para WhatsApp, email e Instagram en vez de un contacto libre.
5. Anadir email transaccional al admin cuando entra un perfil pendiente.
6. Anadir email al entrenador cuando su perfil se aprueba o rechaza.
7. Crear dashboard de cobertura por ciudad: perfiles publicados, pendientes y ciudades vacias.
8. Medir conversion de CTA a registro, registro a perfil guardado y perfil guardado a aprobado.

## Condicion para empezar a cargar entrenadores

El codigo esta preparado para empezar a registrar entrenadores cuando la migracion de ciudades este aplicada en Supabase. Desde esta sesion no se pudo consultar ni empujar migraciones porque el token actual no tiene privilegios suficientes y falta `SUPABASE_DB_PASSWORD`.
