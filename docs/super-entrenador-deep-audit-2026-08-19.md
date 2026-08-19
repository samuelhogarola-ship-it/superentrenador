# Auditoria profunda de Super Entrenador

Fecha: 2026-08-19

## Resumen ejecutivo

Se ha recorrido el repositorio completo: rutas publicas, panel de cliente, panel de entrenador, administracion, Supabase, autenticacion, variables de entorno, acciones, almacenamiento, seguridad, SEO, CI y tests.

El codigo local queda en un estado sensiblemente mas seguro y coherente. Los riesgos criticos encontrados en permisos anonimos, acceso con email sin verificar, mutaciones cross-site, abuso del rate limit, fotos externas y datos demo en produccion se han corregido en el repositorio. El lanzamiento sigue bloqueado por tareas externas: aplicar la migracion en Supabase cloud, configurar SMTP real y verificar dominio/DNS.

## Estado por prioridad

| Prioridad | Area | Estado | Que arreglo yo | Que haces tu | Riesgo restante | Esfuerzo |
| --- | --- | --- | --- | --- | --- | --- |
| P0 | Permisos de `trainer_profiles` | Corregido en migracion | Revocar `SELECT` anonimo por columna y exponer solo la vista publica | Aplicar `20260819120000_harden_marketplace_security.sql` y comprobar grants en cloud | Alto hasta aplicar la migracion | 30-60 min |
| P0 | Email verificado | Corregido en app y SQL | Bloquear contacto, mensajes, perfil y fotos sin confirmacion | Activar SMTP y probar alta, magic link y confirmacion reales | Alto hasta configurar Auth cloud | 1-2 h |
| P0 | CSRF en mutaciones | Corregido | Validacion estricta de `Origin` en mensajes, perfil y cierre de sesion | Verificar dominios finales autorizados en produccion | Bajo | 15 min |
| P0 | Rate limit compartido | Corregido en migracion | Vincular claves al usuario autenticado y limitar parametros del RPC | Aplicar migracion y ejecutar prueba de abuso en cloud | Medio hasta desplegar SQL | 30 min |
| P1 | Datos demo en produccion | Corregido | Demo solo con `MARKETPLACE_DEMO_MODE=true`; seed unico de Samuel | Mantener la variable en `false` en Preview y Production | Bajo | 5 min |
| P1 | Fotos de entrenador | Corregido | Aceptar solo URLs del bucket y ruta del usuario; borrar foto al eliminar perfil | Revisar limites y politica de retencion deseada | Bajo | 30 min |
| P1 | Mensajeria | Corregido | Errores visibles, reintento y control de respuestas PATCH | Probar dos cuentas confirmadas en cloud | Medio hasta prueba E2E real | 30-45 min |
| P1 | Rutas y SEO | Corregido | Redirects legacy, premium sin indexar, sitemap vivo y rutas de datos dinamicas | Validar canonical y dominio raiz tras el despliegue | Bajo | 20 min |
| P1 | CI y supply chain | Corregido | Gitleaks y audit-ci en CI; eliminadas excepciones obsoletas | Proteger la rama y exigir el workflow | Bajo | 10 min |
| P2 | Paneles privados | Corregido parcialmente | Retirar metricas y promesas ficticias; mostrar estados reales | Definir KPIs cuando exista telemetria real | Bajo | Producto: 1-2 dias |
| P2 | Marca, legal y cookies | Pendiente | La base tecnica y las paginas legales existen | Aportar logo final, textos legales validados y criterio de consentimiento | Medio comercial/legal | 1-3 dias |
| P2 | Observabilidad | Pendiente | Se puede integrar una vez elegido proveedor | Elegir Sentry/PostHog y politica de privacidad/retencion | Medio operativo | 0.5-1 dia |
| P3 | Coach Studio | Pendiente de politica | Mantenerlo fuera de exposicion publica no autenticada | Aprobar modelo de acceso por token y alcance de producto | Alto si se publica sin politica | 1-3 dias |

## Cambios implementados

- Seguridad de rutas: email confirmado y mismo origen para operaciones sensibles.
- Seguridad de base de datos: grants anonimos endurecidos, RLS de mensajes y fotos, RPCs restringidos.
- Datos: sin mezcla silenciosa entre Supabase y modelos estaticos; demo explicita por entorno.
- Marketplace: home conectada al repositorio, estados vacios reales y rutas antiguas redirigidas.
- Privado: eliminacion de fotos asociadas, enlaces publicos solo para anuncios publicados y mejor manejo de errores.
- Producto: retiradas metricas simuladas, etiquetas de verificacion falsas y claims premium no demostrados.
- Operacion: variables documentadas, CI con secretos/dependencias y documentacion de despliegue actualizada.
- Renderizado: home, Andalucia y sitemap no quedan congelados con datos vacios si Supabase falla durante el build.

## Evidencias de verificacion

- `npm run ci`: 40 tests, ESLint, TypeScript y build de Next.js correctos.
- `npm run secrets:scan`: 88 commits revisados, sin secretos detectados.
- `npm run audit:deps`: 0 vulnerabilidades conocidas en 597 dependencias.
- Navegador: home, listado y login cargan sin errores ni overlays.
- Autorizacion: dashboard, anuncios y admin redirigen a login conservando `redirectTo`.
- Responsive: portada sin overflow horizontal medido en viewport movil.

La validacion SQL local no se pudo ejecutar porque Docker/Colima no estaba disponible. El build tampoco pudo resolver el host de Supabase desde el sandbox, pero completo correctamente y las rutas dependientes de datos quedaron marcadas como dinamicas.

## Plan de salida

1. Aplicar todas las migraciones en Supabase cloud con una cuenta Owner/Admin.
2. Configurar SMTP, redirects de Auth y rate limits en el proyecto cloud.
3. Ejecutar una prueba E2E con dos usuarios confirmados: publicar perfil, aprobarlo, contactar y responder mensajes.
4. Verificar grants anonimos, RLS y borrado de fotos directamente contra cloud.
5. Confirmar `MARKETPLACE_DEMO_MODE=false` y todas las variables de produccion.
6. Validar dominio raiz, `www`, canonical, sitemap y robots en el despliegue final.
7. Completar logo, cookies y revision legal antes de presentacion publica.
8. Activar proteccion de rama y exigir CI para cada cambio.

## Criterio de cierre

El producto se considera listo para lanzamiento tecnico cuando los pasos 1 a 6 esten verificados en cloud. Los pasos 7 y 8 son requisitos de salida comercial y operativa. Coach Studio debe permanecer privado hasta definir y probar su politica de acceso.
