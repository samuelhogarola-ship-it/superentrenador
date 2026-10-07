# Informe completo de contenido y marketplace

Fecha de actualización: 7 de octubre de 2026

Zona horaria de trabajo: Asia/Makassar (UTC+08)

Este archivo conserva en GitHub el estado verificable del trabajo para poder recuperarlo desde otros ordenadores.

## Web Fuengirola

La PR [webfuengirola#123](https://github.com/samuelhogarola-ship-it/webfuengirola/pull/123) se fusionó el 6 de octubre de 2026 a las 02:36:09 UTC en el commit `1e87131faf451b0c164b4f5a5086f4688e6d161b`.

Se publicaron y comprobaron con HTTP 200 tres guías:

- `https://webfuengirola.com/blog/web-para-entrenador-personal-contenidos-contacto/`
- `https://webfuengirola.com/blog/como-medir-contactos-web-negocio-local/`
- `https://webfuengirola.com/blog/contenidos-locales-utiles-sin-duplicar-paginas/`

Las respuestas de producción coincidían con el commit fusionado y las tres rutas constaban en el sitemap. Se preservaron diseño, logo y recursos existentes. Pasaron 37 pruebas unitarias, cinco comprobaciones Chromium, dos pruebas adaptables, generación completa y auditoría de dependencias.

## Superentrenador: entrega fusionada

La PR [superentrenador#44](https://github.com/samuelhogarola-ship-it/superentrenador/pull/44) se fusionó el 6 de octubre de 2026 a las 02:45:50 UTC en el commit `3b7e1f744f9bc38658c5ce59f2ee21dc545fa54e`. La CI de `main` terminó correctamente.

La entrega añade:

- `/blog/seguro-responsabilidad-civil-entrenador-andalucia`
- `/blog/preparar-primer-cliente-entrenador-andalucia`
- `/como-funciona`

También revisa siete artículos existentes, distingue alta censal y RETA, corrige el tratamiento del modelo 037, contextualiza IVA e IRPF y diferencia responsabilidad civil, accidentes y salud. La normativa andaluza no se presenta como obligación estatal.

El marketplace explica búsqueda, comparación, registro, contacto y revisión de perfiles. No presenta el contacto como reserva, no promete aprobación inmediata y no atribuye pagos integrados que todavía no existen.

Se corrigieron la unidad de precio por hora o sesión, el estado sin precio, la superposición de filtros y el contraste de la navegación móvil. Se mantuvieron logo, colores y componentes existentes.

Validación local:

- 103 pruebas superadas.
- Lint, compilación de producción, hooks y auditoría superados.
- Auditoría final sin vulnerabilidades reportadas.
- Chromium comprobado a 320, 390 y 1440 píxeles, sin desbordamiento horizontal.
- Flujo editorial comprobado desde el índice hasta fuentes, funcionamiento y registro profesional.

## Estado de producción de Superentrenador

La comprobación posterior a la fusión detectó que las tres rutas nuevas respondían HTTP 404 y no aparecían en el sitemap público. Por tanto, la entrega está desarrollada y fusionada, pero su publicación no está confirmada.

El dominio y `www` resolvían a `187.124.55.36`. En ese servidor existe un panel Coolify en el puerto 8000 y requiere autenticación. La integración puede estar gestionada mediante una GitHub App; la ausencia de webhooks visibles en la API normal del repositorio no demuestra que no exista esa integración. No se ha confirmado todavía dónde se interrumpió la cadena GitHub App → Coolify → aplicación.

Las claves SSH locales comprobadas no tienen acceso al servidor. No se modificaron secretos, variables ni configuración remota.

## Nueva dirección editorial aprobada

Superentrenador ya dispone de marketplace, aplicación independiente para entrenadores y aplicación independiente para personas entrenadas. Los planes profesionales limitan el número de personas gestionadas y los usuarios pueden registrar sus entrenamientos. La nueva entrega no vuelve a construir esas funciones: añade una biblioteca SEO separada y conectada con el ecosistema existente.

La biblioteca tendrá:

- `/biblioteca` como índice independiente.
- Temas como `/biblioteca/autonomos`, `/biblioteca/seguros` y `/biblioteca/entrenamiento-online`.
- Ciudades como `/biblioteca/sevilla`, `/biblioteca/malaga`, `/biblioteca/fuengirola` y `/biblioteca/madrid`.

La prioridad es captar entrenadores para que los clientes encuentren oferta útil. La biblioteca también responderá a búsquedas de clientes y enlazará al marketplace filtrado. Las páginas compartirán estructura, pero no texto local duplicado.

La implementación se dividirá en fases: cimientos y cuatro ciudades; Andalucía y mercados solicitados; expansión nacional basada en datos. Después se diseñará una comunidad sencilla con perfiles gratuitos y premium, recetas, foro y publicaciones, reutilizando las cuentas y aplicaciones existentes. Queda excluido el análisis de calorías mediante fotografías.

La especificación completa está en `docs/superpowers/specs/2026-10-07-biblioteca-seo-design.md`.

## Registro administrativo

El registro final en WF-Studio sigue pendiente porque el panel requiere una sesión autenticada. No se han inventado cliente, proyecto, entrega o identificadores. Antes de cerrar la entrega se deberá encontrar el registro existente, actualizarlo sin duplicarlo, adjuntar evidencias y releer el registro persistido.
