import type { Metadata } from "next";
import { createSocialMetadata } from "@/lib/site";

const COOKIES_DESCRIPTION =
  "Información sobre las cookies técnicas y la analítica sin cookies de Super Entrenador.";

export const metadata: Metadata = {
  title: "Política de cookies",
  description: COOKIES_DESCRIPTION,
  alternates: {
    canonical: "/cookies",
  },
  ...createSocialMetadata("Política de cookies", COOKIES_DESCRIPTION, "/cookies"),
};

export default function CookiesPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 md:px-6 md:py-14 lg:px-8">
      <div className="app-surface rounded-[28px] px-6 py-10 sm:px-10 sm:py-12">
        <p className="app-kicker">Legal</p>
        <h1 className="app-title mt-3 text-4xl text-[var(--text)]">Política de cookies</h1>
        <p className="app-copy mt-4 text-sm">Última actualización: octubre 2026</p>

        <div className="mt-10 flex flex-col gap-7 text-sm leading-7 text-[var(--text)]">
          <section>
            <h2 className="app-title text-xl text-[var(--text)]">Qué usamos ahora</h2>
            <p className="app-copy mt-3">
              Super Entrenador utiliza cookies técnicas y almacenamiento local necesarios para mantener la sesión, recordar preferencias básicas y mejorar la estabilidad del producto. Estas cookies son necesarias para que el registro, el acceso y la navegación funcionen correctamente.
            </p>
          </section>

          <section>
            <h2 className="app-title text-xl text-[var(--text)]">Analítica y marketing</h2>
            <p className="app-copy mt-3">
              Utilizamos Umami, una herramienta de analítica alojada en nuestra propia infraestructura que <strong className="text-[var(--text)]">no instala cookies ni guarda ningún identificador en tu dispositivo</strong>. Solo registra datos agregados de navegación —páginas, origen, navegador, dispositivo y país aproximado— que no se comparten con proveedores externos de analítica. Google Analytics no se carga y la aplicación no usa cookies publicitarias.
            </p>
          </section>

          <section>
            <h2 className="app-title text-xl text-[var(--text)]">Gestión de preferencias</h2>
            <p className="app-copy mt-3">
              Las cookies técnicas son necesarias para iniciar sesión y conservar preferencias básicas. Puedes borrarlas o bloquearlas desde la configuración de tu navegador, aunque algunas funciones de la cuenta podrían dejar de funcionar. Umami no requiere una preferencia de cookies porque no guarda identificadores en tu dispositivo.
            </p>
          </section>

          <section>
            <h2 className="app-title text-xl text-[var(--text)]">Contacto</h2>
            <p className="app-copy mt-3">
              Para dudas sobre cookies o privacidad, escríbenos a{" "}
              <a href="mailto:hola@superentrenador.com" className="font-semibold text-[var(--accent)] hover:underline">
                hola@superentrenador.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
