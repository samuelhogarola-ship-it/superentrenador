# AGENTS

## Contexto del proyecto

Superentrenador es una app SaaS para entrenadores personales. Esta version se centra en:

- landing + acceso
- modo demo sin registro
- gestion de clientes
- plantillas globales / privadas
- generacion determinista de rutinas
- vista imprimible tipo PDF

## Reglas de trabajo

1. No hardcodear credenciales.
2. Mantener Supabase como backend objetivo.
3. Preservar el soporte de modo demo mientras no exista onboarding real completo.
4. No romper la exportacion imprimible A4.
5. Mantener la UI en espanol.

## Puntos importantes del codigo

- `src/features/auth/`: acceso, landing y modo demo.
- `src/features/clients/`: ficha y formulario de clientes.
- `src/features/plans/`: plantillas, editor y vista imprimible.
- `src/features/theme/`: cambio claro/oscuro.
- `src/services/`: capa de acceso a datos.
- `src/lib/demo-data.ts`: datos demo actuales.
- `supabase/migrations/`: esquema y RLS.

## Convenciones utiles

1. Si Supabase no esta configurado, la app debe seguir siendo navegable en demo.
2. Cuando una feature exista en PDF y en editor, priorizar consistencia visual entre ambos.
3. Antes de tocar autenticacion o RLS, validar el impacto en modo demo.
4. Si se anaden nuevas tablas o campos, reflejarlos tambien en seeds, tipos TS y servicios.

## Primeras tareas recomendadas para otro agente

1. Conectar login real a Supabase y mantener boton demo.
2. Mejorar el editor con tabla mas clara, selector de ejercicios e imagenes placeholder.
3. Crear una experiencia publica mas comercial para la futura web madre.
