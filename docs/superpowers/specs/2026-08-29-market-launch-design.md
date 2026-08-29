# Salida definitiva al mercado — Super Entrenador

## Objetivo

Llevar Super Entrenador y su administración en WF-Panel desde el estado actual hasta una salida pública verificable, sin P0 abiertos y con evidencias reproducibles de integración, seguridad, operación, analítica y recorrido de usuario.

## Principios

- Ejecutar por bloques con una puerta de verificación al final de cada uno.
- No promover a producción si Preview, migraciones, Auth o E2E no pasan.
- Mantener secretos exclusivamente en los gestores de entorno de producción.
- Preferir operaciones recuperables y detener cualquier acción destructiva no prevista.
- No añadir funcionalidades ajenas al lanzamiento.
- No considerar un cambio terminado por estar en el repositorio: debe quedar fusionado, desplegado y comprobado.

## Bloque 1 — Integración y estado fuente

### Alcance

- Revisar el PR de analítica de Super Entrenador y el PR del panel Umami de WF-Panel.
- Resolver checks, comentarios, conflictos y divergencias con `main`.
- Confirmar que cambios anteriores de seguridad, UX y producción ya estén en `main` o incorporarlos mediante sus PRs existentes.
- Fusionar únicamente ramas verdes y sincronizar los checkouts locales sin perder archivos del usuario.

### Puerta de salida

- Ambos repositorios tienen una rama principal coherente y sin cambios de lanzamiento pendientes fuera de PRs conocidos.
- Tests, lint, TypeScript, build, auditoría de dependencias y escaneo de secretos pasan en el resultado integrado.
- El SHA que se desplegará queda identificado.

## Bloque 2 — Supabase, Auth y protección contra abuso

### Alcance

- Enlazar la CLI exclusivamente al proyecto `qxugymzyvtbxeyqcvtgk`.
- Comparar el historial local y remoto antes de aplicar migraciones.
- Aplicar solo migraciones pendientes mediante los scripts protegidos del repositorio.
- Verificar directamente en cloud:
  - acceso público solo mediante `trainer_profiles_public`;
  - ausencia de privilegios anónimos sobre `trainer_profiles`;
  - RLS de perfiles, mensajes y fotos;
  - aprobación obligatoria para publicación;
  - rate limits no manipulables y consumidos desde los puntos de entrada de base de datos;
  - restricciones a usuarios sin email confirmado.
- Configurar redirects, caducidad OTP, límites y SMTP real de Auth.
- Configurar Turnstile en Preview y activarlo en producción solo tras probar registro, login y contacto.

### Puerta de salida

- Migraciones locales y remotas coinciden.
- Los probes de grants/RLS/rate limit pasan contra cloud.
- Alta, confirmación, magic link, login y recuperación funcionan con SMTP real.
- Turnstile bloquea peticiones inválidas y admite usuarios legítimos.

## Bloque 3 — Umami y WF-Panel

### Alcance

- Configurar en Super Entrenador la URL y website ID públicos de Umami.
- Configurar en WF-Panel URL, usuario, contraseña y website ID exclusivamente como variables de servidor.
- Configurar las credenciales de Supabase de Super Entrenador necesarias para Entrenadores y Usuarios en WF-Panel.
- Desplegar la integración y verificar:
  - carga del script permitida por CSP;
  - páginas vistas;
  - eventos del embudo;
  - periodos 7/30/90;
  - tendencias actuales y anteriores;
  - estados no configurado/error/vacío;
  - caché de cinco minutos sin exposición de secretos.

### Puerta de salida

- Un recorrido controlado aparece en Umami y en `/paneladmin/superentrenador/estadisticas`.
- El panel está protegido por rol administrador y no entrega credenciales al cliente.

## Bloque 4 — Preview y promoción a producción

### Alcance

- Desplegar los SHA identificados primero en Preview o entorno equivalente aislado.
- Validar variables, logs, conexiones, assets, páginas dinámicas y ausencia de datos demo.
- Ejecutar smoke tests de rutas públicas, privadas y administrativas.
- Promover exactamente los SHA verificados a producción.
- Confirmar en Coolify/proveedor que el dominio apunta al contenedor y revisión correctos.

### Puerta de salida

- Preview pasa todos los smoke tests.
- Producción sirve el SHA esperado sin errores de runtime o chunks antiguos.
- `MARKETPLACE_DEMO_MODE=false` y ninguna variable apunta a otro proyecto.

## Bloque 5 — Recorrido E2E de negocio

### Alcance

Ejecutar con dos cuentas confirmadas y datos de prueba identificables:

1. Registro de cliente y entrenador.
2. Confirmación de correo.
3. Creación y edición de perfil con foto.
4. Envío a revisión y aprobación desde WF-Panel.
5. Aparición en listado, ciudad, sitemap y ficha pública.
6. Acceso protegido al contacto.
7. Envío y respuesta de mensaje.
8. Verificación de límites y rechazo cross-origin.
9. Despublicación/borrado y limpieza o compensación de Storage.
10. Registro de páginas y eventos en Umami.

Los datos de prueba se retirarán de forma recuperable o mediante los flujos normales de la aplicación. No se borrarán datos reales.

### Puerta de salida

- El recorrido completo pasa sin intervención en base de datos.
- Los fallos muestran mensajes útiles y no dejan perfiles, fotos o mensajes en estados incoherentes.

## Bloque 6 — Cierre comercial y operativo

### Alcance

- Confirmar `www.superentrenador.com` → `superentrenador.com`.
- Verificar canonical, sitemap, robots, Open Graph, favicon y páginas de ciudad/perfil.
- Revisar responsive, contraste, overflow, navegación y formularios en móvil/escritorio.
- Confirmar privacidad, términos, cookies y consentimiento de Google Analytics.
- Confirmar que Umami se describe de acuerdo con su funcionamiento real.
- Revisar cabeceras CSP, HSTS, Permissions-Policy, Referrer-Policy y `X-Content-Type-Options`.
- Activar protección de rama y checks obligatorios si los permisos lo permiten.
- Documentar runbook de despliegue, rollback, variables y diagnóstico.

### Puerta de salida

- No quedan P0 ni P1 operativos sin propietario y fecha.
- CI obligatorio está verde sobre el SHA de producción.
- Existe un informe final con evidencias, riesgos aceptados y pasos de rollback.

## Manejo de bloqueos

- Credenciales o permisos ausentes: registrar el bloqueo exacto y continuar solo con bloques independientes.
- Fallo de migración: detener despliegue, conservar estado y diagnosticar antes de reintentar.
- Fallo de Preview: no promover a producción.
- Fallo de producción: ejecutar el rollback documentado al último SHA verificado.
- Acción destructiva no prevista: solicitar confirmación específica con objetivo e impacto.

## Criterio definitivo de lanzamiento

El producto se considera listo cuando las seis puertas están cerradas, el recorrido E2E pasa contra producción, los SHA desplegados son conocidos, las migraciones cloud coinciden con el repositorio y no hay vulnerabilidades críticas/altas ni controles P0 pendientes.
