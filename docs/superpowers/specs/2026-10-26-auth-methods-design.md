# Google OAuth y Magic Link

## Intención

Conectar en local los métodos de autenticación que ya existen en `src/lib/auth.ts` con las pantallas de login y registro, para que el usuario pueda continuar con Google o recibir un enlace mágico sin perder el destino solicitado.

## Alcance

- Añadir Google OAuth y Magic Link a login.
- Añadir Google OAuth y Magic Link a registro, conservando `intent=client|trainer`.
- Mostrar estados de carga, éxito y error en español.
- Mantener Turnstile cuando esté habilitado.
- Actualizar el smoke test para detectar los controles reales.

## Fuera de alcance

- No modificar Supabase, Google Cloud, plantillas remotas ni secretos.
- No cambiar el callback existente ni el modelo de sesión.
- No activar todavía cambios SEO.

## Decisión de diseño

Se usará un componente cliente común para los métodos alternativos. Recibirá el destino, el intent opcional y callbacks de estado; las pantallas conservarán sus formularios de contraseña y el componente centralizará la interacción con Google y Magic Link.

## Criterios de aceptación

- Login ofrece Google y Magic Link.
- Registro ofrece Google y Magic Link y conserva la intención de cliente/entrenador.
- Un email válido muestra confirmación de envío; errores de red o rate limit muestran mensajes seguros.
- El callback de OAuth conserva `redirectTo`.
- Tests, lint y build pasan.
