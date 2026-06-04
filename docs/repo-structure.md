# Repo Structure

## Objetivo

Este repo agrupa la plataforma SuperEntrenador en un solo monorepo simple basado en `npm` workspaces.

## Estructura

- `apps/marketplace`
  Producto publico y orientado a clientes.
- `apps/coach-studio`
  Workspace profesional para entrenadores.
- `packages/permissions`
  Tipos y helpers minimos de acceso por producto.
- `packages/config`
  Configuracion base compartida.
- `packages/ui`, `packages/auth`, `packages/database`
  Placeholders documentales para extraccion futura.
- `docs/`
  Arquitectura, separacion de producto y notas de migracion.

## Criterio de separacion

Cada app conserva su runtime y sus assets propios. Solo se comparte lo que ya es claramente transversal y estable.
