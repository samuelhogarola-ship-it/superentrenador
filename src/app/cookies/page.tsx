import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de cookies",
  description: "Información sobre las cookies técnicas y preferencias de Super Entrenador.",
  alternates: {
    canonical: "/cookies",
  },
};

export default function CookiesPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 md:px-6 md:py-14 lg:px-8">
      <div className="app-surface rounded-[28px] px-6 py-10 sm:px-10 sm:py-12">
        <p className="app-kicker">Legal</p>
        <h1 className="app-title mt-3 text-4xl text-[var(--text)]">Política de cookies</h1>
        <p className="app-copy mt-4 text-sm">Última actualización: julio 2026</p>

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
              En esta fase no activamos cookies analíticas o publicitarias no necesarias desde la propia aplicación. Si incorporamos herramientas de medición, las cargaremos solo cuando corresponda según la normativa aplicable y actualizaremos esta página.
            </p>
          </section>

          <section>
            <h2 className="app-title text-xl text-[var(--text)]">Gestión de preferencias</h2>
            <p className="app-copy mt-3">
              Puedes aceptar el aviso informativo de cookies técnicas desde el banner de la web. También puedes borrar o bloquear cookies desde la configuración de tu navegador, aunque algunas funciones de sesión podrían dejar de funcionar.
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
