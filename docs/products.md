# Products

## Marketplace

Producto publico y client-facing de SuperEntrenador.

Objetivos actuales:

- descubrimiento de entrenadores
- perfiles publicos
- evolucion futura hacia booking, pagos, reviews y mensajeria

## Coach Studio

Workspace profesional para entrenadores.

Objetivos actuales:

- clientes
- rutinas y plantillas
- PDF imprimible
- progreso y seguimiento
- preparacion para auth y datos reales

## Nota sobre rutas demo heredadas

El import inicial de `apps/marketplace` conserva `/app/pt`, `/app/client` y `/app/admin` como rutas demo/legacy para no romper el prototipo existente.

Estas rutas no definen la arquitectura final y deben moverse o reescribirse dentro de `apps/coach-studio` en una PR posterior.
