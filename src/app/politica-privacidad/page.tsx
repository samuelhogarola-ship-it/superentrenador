import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Cómo recopilamos, usamos y protegemos tus datos en el marketplace de entrenadores personales Super Entrenador.",
  alternates: {
    canonical: "/politica-privacidad",
  },
};

export default function PoliticaPrivacidadPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 md:px-6 md:py-14 lg:px-8">
      <div className="app-surface rounded-[28px] px-6 py-10 sm:px-10 sm:py-12">
        <p className="app-kicker">Legal</p>
        <h1 className="app-title mt-3 text-4xl text-[var(--text)]">Política de privacidad</h1>
        <p className="app-copy mt-4 text-sm">Última actualización: julio 2026</p>

        <div className="prose-custom mt-10 flex flex-col gap-8 text-sm leading-7 text-[var(--text)]">

          <section>
            <h2 className="app-title text-xl text-[var(--text)]">I — Preámbulo</h2>
            <div className="app-copy mt-4 flex flex-col gap-3">
              <p>Los datos de contacto de los entrenadores nunca se transmiten a los alumnos excepto cuando el entrenador acepta una solicitud y decide compartirlos para organizar la primera sesión.</p>
              <p>Todas las páginas de Super Entrenador están protegidas mediante el protocolo HTTPS y la navegación entre páginas está cifrada.</p>
              <p>Super Entrenador no vende ni alquila ninguna información o dato sobre sus miembros a terceros.</p>
              <p>Tras consultar los perfiles, los alumnos registrados pueden acceder a los datos de contacto de los entrenadores que hayan seleccionado.</p>
            </div>
          </section>

          <section>
            <h2 className="app-title text-xl text-[var(--text)]">II — Política de privacidad</h2>

            <div className="mt-6 flex flex-col gap-6">
              <div>
                <h3 className="font-semibold text-[var(--text)]">1. General</h3>
                <p className="app-copy mt-2">Super Entrenador, en calidad de responsable del tratamiento, concede gran importancia a la protección y el respeto de tu privacidad. Esta política tiene como objetivo informarte sobre nuestras prácticas respecto a la recopilación, el uso y el intercambio de información que nos proporcionas a través de nuestra plataforma accesible desde <strong className="text-[var(--text)]">www.superentrenador.com</strong>.</p>
              </div>

              <div>
                <h3 className="font-semibold text-[var(--text)]">2. Información que recopilamos</h3>
                <div className="app-copy mt-2 flex flex-col gap-3">
                  <p><strong className="text-[var(--text)]">2.1. Información que nos envías directamente.</strong> Al utilizar nuestra plataforma, puedes enviarnos información que probablemente te identifique (&ldquo;Datos personales&rdquo;), en particular al completar formularios de registro, al contactar con otro miembro, al comunicarte con nosotros por correo electrónico o al informarnos de un problema.</p>
                  <p>Esta información incluye: nombre y apellidos, dirección de correo electrónico, contraseña, ciudad, fotografía de perfil, descripción profesional, especialidades, precio, datos de contacto directo (teléfono o redes sociales) que el entrenador decide compartir voluntariamente, e historial de mensajes intercambiados en la plataforma.</p>
                  <p><strong className="text-[var(--text)]">2.2. Datos que recopilamos automáticamente.</strong> Durante cada visita podemos recopilar, de acuerdo con la legislación aplicable, información técnica relacionada con los dispositivos y redes desde los que accedes: dirección IP, tipo de navegador, sistema operativo, páginas visitadas y datos básicos de seguridad o diagnóstico.</p>
                  <p><strong className="text-[var(--text)]">2.3. Plazo de conservación.</strong> Tus datos se conservarán mientras mantengas una cuenta activa. Puedes solicitar su supresión en cualquier momento escribiendo a <strong className="text-[var(--accent)]">hola@superentrenador.com</strong>.</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-[var(--text)]">3. Cómo utilizamos los datos</h3>
                <ul className="app-copy mt-2 flex flex-col gap-2 pl-4">
                  {[
                    "Gestionar tu cuenta y prestarte los servicios solicitados.",
                    "Mostrar tu perfil público en el marketplace.",
                    "Permitir que los alumnos te encuentren por ciudad y especialidad.",
                    "Enviarte notificaciones de servicio relacionadas con tu cuenta.",
                    "Mejorar y optimizar la plataforma mediante análisis de uso.",
                    "Garantizar la seguridad de la plataforma y el cumplimiento de nuestras condiciones.",
                    "Enviarte comunicaciones de marketing solo con tu consentimiento previo.",
                  ].map((item) => (
                    <li key={item} className="list-disc">{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-[var(--text)]">4. Destinatarios de la información</h3>
                <div className="app-copy mt-2 flex flex-col gap-3">
                  <p>Parte de tu información es visible en tu perfil público (nombre, ciudad, especialidades, experiencia y precio de entrada). Los datos de contacto directo solo se revelan a usuarios registrados cuando el flujo del marketplace lo permite.</p>
                  <p>Trabajamos con proveedores técnicos de confianza (alojamiento, autenticación, analítica) que pueden acceder a tus datos exclusivamente para prestar sus servicios. No compartimos tus datos con terceros con fines comerciales propios.</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-[var(--text)]">5. Moderación de mensajes</h3>
                <p className="app-copy mt-2">Podemos revisar los mensajes intercambiados en la plataforma con el único fin de prevenir fraudes, garantizar el cumplimiento de nuestras condiciones y mejorar el servicio. No utilizamos estas comunicaciones con fines publicitarios.</p>
              </div>

              <div>
                <h3 className="font-semibold text-[var(--text)]">6. Comunicaciones comerciales</h3>
                <p className="app-copy mt-2">Solo te enviaremos comunicaciones de marketing con tu consentimiento previo. Puedes retirar dicho consentimiento en cualquier momento desde los ajustes de tu cuenta o haciendo clic en el enlace de baja que aparece en cada correo.</p>
              </div>

              <div>
                <h3 className="font-semibold text-[var(--text)]">7. Transferencia internacional de datos</h3>
                <p className="app-copy mt-2">Almacenamos tus datos preferentemente dentro de la Unión Europea. En caso de que algún proveedor técnico esté ubicado fuera de la UE, nos aseguramos de que la transferencia cuente con las garantías adecuadas conforme al RGPD (cláusulas contractuales tipo de la Comisión Europea).</p>
              </div>

              <div>
                <h3 className="font-semibold text-[var(--text)]">8. Tus derechos</h3>
                <div className="app-copy mt-2 flex flex-col gap-2">
                  <p>De acuerdo con el RGPD y la LOPDGDD, tienes derecho a:</p>
                  <ul className="flex flex-col gap-1.5 pl-4">
                    {[
                      "Acceder a los datos personales que tenemos sobre ti.",
                      "Rectificar datos inexactos o incompletos.",
                      "Solicitar la supresión de tus datos (derecho al olvido).",
                      "Oponerte al tratamiento de tus datos con fines de marketing directo.",
                      "Solicitar la limitación del tratamiento en determinadas circunstancias.",
                      "Recibir tus datos en un formato estructurado y legible por máquina (portabilidad).",
                      "Presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD).",
                    ].map((item) => (
                      <li key={item} className="list-disc">{item}</li>
                    ))}
                  </ul>
                  <p className="mt-2">Para ejercer estos derechos escríbenos a <strong className="text-[var(--accent)]">hola@superentrenador.com</strong>.</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-[var(--text)]">9. Seguridad de tu contraseña</h3>
                <p className="app-copy mt-2">Eres responsable de mantener la confidencialidad de tu contraseña. Aconsejamos no compartirla con nadie y cambiarla regularmente. Super Entrenador nunca te pedirá tu contraseña por correo electrónico o teléfono.</p>
              </div>

              <div>
                <h3 className="font-semibold text-[var(--text)]">10. Cookies</h3>
                <p className="app-copy mt-2">
                  Utilizamos cookies técnicas necesarias para el funcionamiento de la plataforma (sesión de usuario y preferencias básicas). En esta fase no activamos cookies analíticas o publicitarias no necesarias desde la propia aplicación. Puedes consultar más detalle en la{" "}
                  <Link href="/cookies" className="font-semibold text-[var(--accent)] hover:underline">
                    política de cookies
                  </Link>
                  .
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[var(--text)]">11. Cambios en esta política</h3>
                <p className="app-copy mt-2">Podemos actualizar esta política ocasionalmente. Cuando los cambios sean significativos, te informaremos por correo electrónico o mediante un aviso visible en la plataforma. Te recomendamos revisar esta página periódicamente.</p>
              </div>

              <div>
                <h3 className="font-semibold text-[var(--text)]">12. Contacto</h3>
                <p className="app-copy mt-2">Para cualquier consulta sobre esta política o para ejercer tus derechos puedes escribirnos a:</p>
                <div className="mt-3 rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-5 py-4 text-sm">
                  <p className="font-semibold text-[var(--text)]">Super Entrenador</p>
                  <p className="mt-1 text-[var(--muted)]">Email: <a href="mailto:hola@superentrenador.com" className="text-[var(--accent)] hover:underline">hola@superentrenador.com</a></p>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
