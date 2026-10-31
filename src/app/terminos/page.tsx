import type { Metadata } from "next";
import Link from "next/link";
import { createSocialMetadata } from "@/lib/site";

const TERMS_DESCRIPTION =
  "Condiciones de uso de Super Entrenador para usuarios, entrenadores y visitantes.";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description: TERMS_DESCRIPTION,
  alternates: {
    canonical: "/terminos",
  },
  ...createSocialMetadata("Términos y condiciones", TERMS_DESCRIPTION, "/terminos"),
};

const SECTIONS = [
  {
    title: "1. Objeto del servicio",
    body: "Super Entrenador es un marketplace en fase de despliegue que permite descubrir perfiles de entrenadores personales por ciudad, especialidad y modalidad. La plataforma facilita visibilidad, registro y contacto protegido, pero no sustituye el criterio profesional, médico o legal que pueda requerir cada usuario.",
  },
  {
    title: "2. Registro y acceso",
    body: "Puedes crear una cuenta con email, magic link o proveedores de autenticación disponibles. Eres responsable de que los datos facilitados sean correctos y de mantener el control de tu email de acceso. Podemos suspender cuentas que usen información falsa, suplanten identidades o intenten vulnerar el servicio.",
  },
  {
    title: "3. Perfiles de entrenadores",
    body: "Los entrenadores pueden enviar información profesional para crear o completar su perfil público. Super Entrenador puede revisar, editar formato, rechazar o despublicar perfiles cuando falte información verificable, haya contenido engañoso o no encaje con la calidad mínima del marketplace.",
  },
  {
    title: "4. Contacto entre usuarios",
    body: "La cuenta gratuita de alumno no permite iniciar contacto con entrenadores. Para enviar mensajes o consultar los datos de contacto habilitados es necesario tener el correo confirmado y un Pase Alumno activo, actualmente ofrecido por 10 € al mes. El pase facilita el contacto dentro del marketplace, pero no incluye sesiones de entrenamiento. Las conversaciones, acuerdos, sesiones y pagos externos entre alumnos y entrenadores son responsabilidad de las partes salvo que una funcionalidad indique expresamente lo contrario.",
  },
  {
    title: "5. Planes y activación",
    body: "Los planes de pago para alumnos y profesionales tienen públicos, prestaciones y precios distintos. Hasta que se habilite la contratación automática, una solicitud de acceso no produce por sí sola un cobro ni activa el plan: Super Entrenador debe confirmar la activación, vigencia y forma de pago. Las condiciones concretas mostradas durante la contratación prevalecerán sobre información promocional anterior.",
  },
  {
    title: "6. Contenido permitido",
    body: "No se permite publicar contenido ofensivo, fraudulento, sanitario engañoso, datos de terceros sin autorización, spam ni promesas de resultados garantizados. También podremos retirar contenido que dañe la confianza del marketplace o incumpla la legislación aplicable.",
  },
  {
    title: "7. Disponibilidad",
    body: "Trabajamos para mantener la plataforma estable, pero el servicio puede cambiar, pausarse o interrumpirse por mantenimiento, mejoras, incidencias técnicas o decisiones de producto propias de una fase de lanzamiento.",
  },
  {
    title: "8. Responsabilidad",
    body: "Super Entrenador no garantiza resultados físicos, deportivos, comerciales ni económicos. La elección de entrenador, la contratación de servicios externos y la ejecución de programas de entrenamiento corresponden a usuarios y profesionales.",
  },
  {
    title: "9. Cambios en las condiciones",
    body: "Podemos actualizar estas condiciones para reflejar cambios del producto, requisitos legales o nuevas funcionalidades. Si el cambio es relevante, procuraremos comunicarlo mediante aviso visible o email.",
  },
];

export default function TerminosPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 md:px-6 md:py-14 lg:px-8">
      <div className="app-surface rounded-[28px] px-6 py-10 sm:px-10 sm:py-12">
        <p className="app-kicker">Legal</p>
        <h1 className="app-title mt-3 text-4xl text-[var(--text)]">Términos y condiciones</h1>
        <p className="app-copy mt-4 text-sm">Última actualización: octubre 2026</p>

        <div className="mt-10 flex flex-col gap-7 text-sm leading-7 text-[var(--text)]">
          {SECTIONS.map((section) => (
            <section key={section.title}>
              <h2 className="app-title text-xl text-[var(--text)]">{section.title}</h2>
              <p className="app-copy mt-3">{section.body}</p>
            </section>
          ))}

          <section>
            <h2 className="app-title text-xl text-[var(--text)]">10. Contacto</h2>
            <p className="app-copy mt-3">
              Para dudas legales o solicitudes relacionadas con estas condiciones, escribe a{" "}
              <a href="mailto:hola@superentrenador.com" className="font-semibold text-[var(--accent)] hover:underline">
                hola@superentrenador.com
              </a>
              . También puedes revisar nuestra{" "}
              <Link href="/politica-privacidad" className="font-semibold text-[var(--accent)] hover:underline">
                política de privacidad
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
