# Access Model

## Principio base

El acceso es por producto, no global.

Un usuario puede tener acceso a:

- solo `marketplace`
- solo `coach-studio`
- ambos productos

## Conceptos

- `profiles`
  Identidad base del usuario
- `products/apps`
  `marketplace` y `coach-studio`
- `user_product_access`
  Relacion usuario-producto
- `roles`
  Roles por producto
- `plans/subscriptions`
  Planes por producto
- `permissions helpers`
  Helpers compartidos para resolver acceso

## Modelo minimo preparado

`packages/permissions` define:

- `ProductKey`
- `ProductRoleKey`
- `PlanKey`
- `UserProductAccess`
- `hasProductAccess`
- `hasProductRole`

## Intencion futura

Cuando ambos productos compartan autenticacion y persistencia reales, este modelo servira como base para auth y permisos unificados sin mezclar comportamientos de negocio distintos.
