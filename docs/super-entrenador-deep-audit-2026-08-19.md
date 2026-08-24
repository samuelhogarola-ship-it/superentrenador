# Auditoria profunda de Super Entrenador

Fecha: 2026-08-19

## Resumen ejecutivo

Se ha recorrido el repositorio completo: rutas publicas, panel de cliente, panel de entrenador, administracion, Supabase, autenticacion, variables de entorno, acciones, almacenamiento, seguridad, SEO, CI y tests.

El codigo local queda en un estado sensiblemente mas seguro y coherente. Los riesgos criticos encontrados en permisos anonimos, acceso con email sin verificar, mutaciones cross-site, abuso del rate limit, fotos externas y datos demo en produccion se han corregido en el repositorio. El lanzamiento sigue bloqueado por tareas externas: aplicar la migracion en Supabase cloud, configurar SMTP real y verificar dominio/DNS.

## Estado por prioridad

| Prioridad | Area | Estado | Que arreglo yo | Que haces tu | Riesgo restante | Esfuerzo |
| --- | --- | --- | --- | --- | --- | --- |
| P0 | Permisos de `trainer_profiles` | Corregido en migracion | Revocar `SELECT` anonimo por columna y exponer solo la vista publica | Aplicar `20260819120000_harden_marketplace_security.sql` y comprobar grants en cloud | Alto hasta aplicar la migracion | 30-60 min |
| P0 | Email verificado | Corregido en app y SQL | Bloquear contacto, mensajes, perfil, borrado y moderacion sin confirmacion | Activar SMTP y probar alta, magic link y confirmacion reales | Alto hasta configurar Auth cloud | 1-2 h |
| P0 | CSRF en mutaciones | Corregido | Validacion estricta de `Origin` en mensajes, perfil y cierre de sesion | Verificar dominios finales autorizados en produccion | Bajo | 15 min |
| P0 | Rate limit compartido | Corregido en migracion | Vincular claves al usuario y consumir cuota dentro del RPC/politica de base de datos | Aplicar migraciones y ejecutar prueba de abuso en cloud | Medio hasta desplegar SQL | 30 min |
| P0 | Proyecto Supabase objetivo | Corregido localmente | Retirar enlace residual a `tiynn...` y bloquear operaciones si app, enlace y ref esperado divergen | Conceder acceso Owner/Admin a `qxug...` y volver a enlazar | Alto: cloud sigue sin migrar | 10-20 min |
| P1 | Datos demo en produccion | Corregido | Demo solo con `MARKETPLACE_DEMO_MODE=true`; seed unico de Samuel | Mantener la variable en `false` en Preview y Production | Bajo | 5 min |
| P1 | Fotos de entrenador | Corregido | Usar una ruta estable, aceptar solo nombres gestionados y limpiar variantes al guardar o eliminar | Verificar el bucket tras aplicar politicas en cloud | Bajo | 30 min |
| P1 | Abuso de Auth | Parcial: limites endurecidos | Reducir email, login y OTP; documentar integracion segura de Turnstile | Aportar claves, integrar el widget y activar CAPTCHA tras prueba en Preview | Medio hasta activar CAPTCHA | 1-2 h |
| P1 | Mensajeria | Corregido | Errores visibles, reintento y control de respuestas PATCH | Probar dos cuentas confirmadas en cloud | Medio hasta prueba E2E real | 30-45 min |
| P1 | Rutas y SEO | Corregido | Redirects legacy, premium sin indexar, sitemap vivo y rutas de datos dinamicas | Validar canonical y dominio raiz tras el despliegue | Bajo | 20 min |
| P1 | CI y supply chain | Corregido | Gitleaks y audit-ci en CI; eliminadas excepciones obsoletas | Proteger la rama y exigir el workflow | Bajo | 10 min |
| P2 | Paneles privados | Corregido parcialmente | Retirar metricas y promesas ficticias; mostrar estados reales | Definir KPIs cuando exista telemetria real | Bajo | Producto: 1-2 dias |
| P2 | Marca, legal y cookies | Pendiente | La base tecnica y las paginas legales existen | Aportar logo final, textos legales validados y criterio de consentimiento | Medio comercial/legal | 1-3 dias |
| P2 | Observabilidad | Pendiente | Se puede integrar una vez elegido proveedor | Elegir Sentry/PostHog y politica de privacidad/retencion | Medio operativo | 0.5-1 dia |
| P3 | Coach Studio | Pendiente de politica | Mantenerlo fuera de exposicion publica no autenticada | Aprobar modelo de acceso por token y alcance de producto | Alto si se publica sin politica | 1-3 dias |

## Cambios implementados

- Seguridad de rutas: email confirmado y mismo origen para operaciones sensibles.
- Seguridad de base de datos: grants anonimos endurecidos, publicacion ligada a aprobacion, RLS de mensajes y fotos, RPCs restringidos.
- Datos: sin mezcla silenciosa entre Supabase y modelos estaticos; demo explicita por entorno.
- Marketplace: home conectada al repositorio, estados vacios reales y rutas antiguas redirigidas.
- Privado: limpieza de todas las variantes de fotos, revalidacion de slug/ciudad anteriores, enlaces publicos solo para anuncios aprobados y mejor manejo de errores.
- Producto: retiradas metricas simuladas, etiquetas de verificacion falsas y claims premium no demostrados.
- Operacion: variables documentadas, CI con secretos/dependencias y documentacion de despliegue actualizada.
- Renderizado: home, Andalucia y sitemap no quedan congelados con datos vacios si Supabase falla durante el build.
- Despliegue Supabase: guard previo a migraciones/Auth y enlace local incorrecto retirado.

## Evidencias de verificacion

- `npm run ci`: 63 tests, ESLint, TypeScript y build de Next.js correctos.
- `npm run secrets:scan`: historial Git completo revisado, sin secretos detectados.
- `npm run audit:deps`: 0 vulnerabilidades conocidas en 597 dependencias.
- `supabase db reset --local`: todas las migraciones aplicadas desde cero y `seed.sql` cargado correctamente.
- `supabase db lint --local --level warning`: esquema `public` y extensiones sin errores.
- PostgreSQL local: contacto admite 30 intentos y bloquea el 31; mensajes admite 5 y bloquea el 6; parametros de cuota y claves manipuladas son rechazados.
- Navegador: home, listado y login cargan sin errores ni overlays.
- Autorizacion: dashboard, anuncios y admin redirigen a login conservando `redirectTo`.
- Responsive: portada sin overflow horizontal medido en viewport movil.

La validacion SQL local se completo en un entorno Supabase aislado y detecto una referencia ambigua a `reset_at` en `check_rate_limit`; se corrigio mediante la migracion incremental `20260824130000_fix_rate_limit_lint.sql` y una segunda reconstruccion limpia quedo sin errores. El build no pudo resolver el host cloud de Supabase desde el sandbox, pero completo correctamente: home, Andalucia y sitemap permanecen dinamicos; ciudad y perfil usan ISR con revalidacion explicita.

El 2026-08-23 se detecto que la CLI local estaba enlazada a `tiynnllrcdhsvrzsdsct` mientras la aplicacion y la documentacion apuntan a `qxugymzyvtbxeyqcvtgk`. El enlace residual se retiro y los comandos remotos ahora abortan ante cualquier discrepancia. La cuenta CLI actual no puede enlazar el proyecto correcto por falta de privilegios.

El 2026-08-24 una segunda revision independiente detecto y se corrigieron cinco huecos: parametros manipulables del RPC de rate limit, publicacion sin aprobacion obligatoria, variantes de foto huerfanas, cache antigua tras cambiar slug/ciudad y acciones sensibles sin confirmacion de email. Tambien se alineo la CSP con Analytics consentido y se redujeron los limites locales de Auth. CAPTCHA permanece pendiente porque requiere claves y token del cliente antes de poder activarse sin bloquear usuarios legitimos.

La revision del PR añadio seis correcciones: permisos `contents: read` en CI, pushes de Supabase anclados a la raiz validada, politica DELETE por propietario, compensacion ante fallos parciales de Storage/base, estados publicos basados en publicacion y aprobacion, y cancelacion de cargas antiguas de mensajes. El runbook separa ahora la prueba real de inicio de sesion de la autorizacion defensiva con fixture no confirmado.

Una ultima pasada movio el consumo del rate limit a los puntos de entrada de Postgres para impedir bypass por PostgREST directo, excluyo perfiles demo del contacto y acoto `connect-src` al proyecto Supabase configurado. El borrado de perfiles despublica y elimina la referencia a la foto antes de tocar Storage, confirma despues la fila eliminada y, si Storage falla, restaura y verifica la instantanea original mediante el cliente servidor privilegiado; si esa compensacion falla, el perfil permanece oculto de forma segura.

## Plan de salida

1. Aplicar todas las migraciones en Supabase cloud con una cuenta Owner/Admin.
2. Configurar SMTP, redirects de Auth y rate limits en el proyecto cloud.
3. Integrar Turnstile en Preview, enviar `captchaToken` y activar CAPTCHA solo tras una prueba completa.
4. Ejecutar una prueba E2E con dos usuarios confirmados: publicar perfil, aprobarlo, contactar y responder mensajes.
5. Verificar grants anonimos, RLS y borrado de fotos directamente contra cloud.
6. Confirmar `MARKETPLACE_DEMO_MODE=false` y todas las variables de produccion.
7. Validar dominio raiz, `www`, canonical, sitemap y robots en el despliegue final.
8. Completar logo, cookies y revision legal antes de presentacion publica.
9. Activar proteccion de rama y exigir CI para cada cambio.

## Criterio de cierre

El producto se considera listo para lanzamiento tecnico cuando los pasos 1 a 7 esten verificados en cloud. Los pasos 8 y 9 son requisitos de salida comercial y operativa. Coach Studio debe permanecer privado hasta definir y probar su politica de acceso.
