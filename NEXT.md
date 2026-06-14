# NEXT

## Prioridad inmediata

- Rehacer la home pública con una dirección visual mucho más simple, premium y controlada.
- Tomar como referencia de tono: Porsche, McDonald's, Superprof.
- Mantener el marketplace en Next.js, pero rehacer la capa visual casi desde cero.

## Problemas detectados

- La visual actual no representa la marca ni la intención del producto.
- La hero no transmite una propuesta premium, clara ni minimalista.
- Falta el logo real de Super Entrenador.
- Falta la capa legal reutilizable desde `core-general`.
- Falta banner de cookies.
- El sitio está desplegado, pero todavía no está listo como presentación pública de marca.

## Dirección creativa para la siguiente iteración

- Hero muy sencilla y potente.
- Menos bloques, menos ruido y menos texto.
- Jerarquía visual fuerte.
- Tipografía sobria y premium.
- Espaciado amplio.
- Colores contenidos.
- Conversión clara al estilo marketplace serio, no app genérica.
- Referencia funcional: discovery limpio tipo Superprof.

## Trabajo a realizar

### 1. Replanteamiento visual

- Rediseñar `src/app/page.tsx`.
- Rediseñar header y footer públicos.
- Eliminar estética genérica actual.
- Introducir una home con:
  - hero principal
  - buscador o CTA principal
  - prueba social o bloque de confianza
  - bloque breve de valor para usuarios
  - bloque breve de valor para entrenadores

### 2. Branding

- Integrar el logo real de Super Entrenador.
- Revisar favicon y consistencia de marca.

### 3. Legal

- Traer legal desde `core-general` o adaptar su estructura al proyecto Next.
- Añadir páginas legales mínimas si faltan:
  - privacidad
  - términos
  - cookies

### 4. Cookies

- Añadir banner de cookies.
- Debe quedar visible, claro y no intrusivo.
- Debe ser compatible con futura capa legal/compliance real.

### 5. QA visual

- Revisar desktop y móvil.
- Revisar contraste, espaciado y densidad.
- Revisar que la home se sienta marca premium y no plantilla.

## No hacer todavía

- No priorizar backend nuevo.
- No priorizar auth real.
- No priorizar dashboard privada.
- No abrir nuevas features mientras la capa pública no esté a nivel de marca.

## Criterio de “listo”

- La home puede enseñarse sin pedir contexto.
- La hero explica el producto en segundos.
- La marca se reconoce.
- La navegación pública se siente coherente.
- Legal y cookies están presentes.
- El resultado se acerca más a “premium minimal marketplace” que a “demo técnica”.
