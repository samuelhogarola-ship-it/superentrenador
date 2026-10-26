# Auditoría de seguridad Supabase — 2026-10-26

## Alcance

Auditoría de lectura del proyecto Supabase `qxugymzyvtbxeyqcvtgk`, contrastada con las migraciones versionadas de Super Entrenador. No se han ejecutado cambios SQL remotos, no se han creado usuarios y no se han enviado correos de prueba.

## Hallazgos priorizados

### P1 — Vista `public.trainer_profiles_public` con SECURITY DEFINER

Advisor la marca porque la vista se ejecuta con los privilegios de su propietario. La definición remota comprobada limita los resultados a:

- `is_published = true`
- `review_status = 'approved'`
- `is_demo = false`

También se comprobó que `anon` solo tiene `SELECT` sobre la vista y no tiene privilegios sobre la tabla base; los privilegios DML de la vista están revocados.

**Diagnóstico:** no hay una exposición confirmada en la definición actual, pero sí una superficie privilegiada que debe mantenerse bajo control. El diseño se introdujo porque una vista `security_invoker` fallaba al no tener `anon` acceso a la tabla base.

**Corrección recomendada:** migrar el marketplace a una proyección pública dedicada (tabla/materialized view sincronizada) o rediseñar la vista invoker con una política y privilegios de columnas revisados junto con Coach Studio/FORMe. No aplicar unilateralmente sobre el proyecto compartido.

### P1 — Protección de contraseñas filtradas desactivada

Advisor informa de que la protección contra contraseñas comprometidas no está activa.

**Corrección:** activar Leaked Password Protection en Supabase Auth. Es una configuración de Auth, no una migración local, y debe hacerse desde el panel con una comprobación posterior del proveedor.

### P1 — Opciones MFA insuficientes

Advisor informa de que no hay suficientes opciones MFA habilitadas.

**Diagnóstico:** es una mejora de endurecimiento de la cuenta y del equipo administrador, no un fallo específico del flujo público de Super Entrenador.

**Corrección:** definir primero la política de MFA para administradores y usuarios; activar al menos TOTP para las cuentas privilegiadas antes de imponerlo al marketplace.

### P2 — Funciones SECURITY DEFINER y `search_path`

La consulta remota de lectura confirmó que las funciones críticas de este repositorio fijan el `search_path` (`public` o vacío): rate limit, contacto protegido, perfiles propios, administración y funciones de mensajes. Las migraciones también revocan su ejecución pública cuando corresponde.

Advisor sigue mostrando avisos para funciones de otros módulos (`coach_*` y `forme_*`) que comparten el proyecto. No deben modificarse desde este repositorio sin revisar sus contratos.

### P2 — Políticas RLS con múltiples políticas permisivas

Advisor informa de varias tablas con políticas permisivas acumuladas. Algunas son intencionadas: cliente y entrenador necesitan reglas distintas para leer o insertar mensajes. Debe hacerse una matriz de roles y acciones antes de consolidarlas; eliminar una política a ciegas puede romper mensajería o moderación.

### P2 — Plan de inicialización RLS

Advisor muestra avisos de rendimiento por evaluar `auth.uid()`/`auth.jwt()` por fila. Es una optimización, no una vulnerabilidad confirmada. La corrección típica es envolver llamadas estables como `(select auth.uid())`, pero debe probarse por tabla y rol.

### P2 — Buckets públicos

`trainer-photos` es público por diseño porque los perfiles publicados muestran fotos mediante URL pública. Advisor también menciona `coach-logos`, que pertenece al módulo compartido y no está definido en este repositorio.

**Corrección segura:** mantener público solo lo que la interfaz necesita y revisar que no exista listado público de objetos ni nombres sensibles. No cambiar `coach-logos` sin su propietario funcional.

## Estado verificado

- Dependencias locales: 0 vulnerabilidades en `npm audit`.
- Secretos: 0 filtraciones detectadas por Gitleaks.
- Migraciones locales: tests de seguridad existentes pasan.
- Vista pública: filtros de publicación, aprobación y no-demo confirmados remotamente.
- Plantillas de confirmación y Magic Link: alineadas con `token_hash` y el callback local.
- No se han aplicado migraciones ni políticas nuevas remotamente.

## Próximas acciones seguras

1. Activar Leaked Password Protection en Supabase Auth.
2. Definir y activar MFA para cuentas administrativas.
3. Preparar una matriz de políticas RLS por tabla antes de consolidar políticas permisivas.
4. Diseñar una proyección pública dedicada para retirar la vista SECURITY DEFINER sin afectar aplicaciones compartidas.
5. Ejecutar una prueba real de Magic Link con un email propiedad del usuario. Para Google OAuth, usar una cuenta de prueba autorizada por el usuario.

## Dato mínimo para la prueba real de login

Hace falta un email de prueba controlado por el usuario. No hace falta compartir la contraseña: para Magic Link basta con que el usuario pueda abrir el correo recibido; para Google basta con autorizar la cuenta en el navegador durante la prueba.
