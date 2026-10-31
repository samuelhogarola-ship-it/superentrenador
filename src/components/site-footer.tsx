import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { coachStudioUrl } from "@/lib/coach-studio";

const COLUMNS = [
  {
    title: "Buscar entrenador",
    links: [
      { href: "/como-funciona", label: "Cómo funciona" },
      { href: "/entrenadores", label: "Todos los entrenadores" },
    ],
  },
  {
    title: "Ciudades",
    links: [
      { href: "/ciudades/madrid", label: "Madrid" },
      { href: "/entrenadores?city=Barcelona", label: "Barcelona" },
      { href: "/ciudades/malaga", label: "Málaga" },
      { href: "/ciudades/fuengirola", label: "Fuengirola" },
    ],
  },
  {
    title: "Entrenadores",
    links: [
      { href: coachStudioUrl, label: "Coach Studio", external: true },
      { href: "/login", label: "Iniciar sesión" },
      { href: "/registro?intent=trainer", label: "Crear perfil" },
      { href: "/premium", label: "Planes y precios" },
    ],
  },
  {
    title: "Biblioteca",
    links: [
      { href: "/biblioteca", label: "Biblioteca" },
      { href: "/blog", label: "Todas las guías" },
      { href: "/blog/como-elegir-entrenador-personal-con-criterio", label: "Elegir entrenador" },
      { href: "/blog/preparar-primer-cliente-entrenador-andalucia", label: "Preparar tu primer cliente" },
      { href: "/blog/necesito-ser-autonomo-entrenador-personal", label: "Trabajar como entrenador" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="site-footer border-t border-[var(--line)] px-4 pb-6 pt-8 md:px-6 md:pb-10 md:pt-12 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-7 lg:grid-cols-[1.1fr_2fr] lg:gap-10">
          <div>
            <BrandMark />
            <p className="app-copy mt-5 hidden max-w-sm text-sm sm:block">
              Encuentra entrenadores y compara perfiles, especialidades y servicios.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-4 sm:gap-8">
            {COLUMNS.map((column) => (
              <div key={column.title}>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--muted)]">{column.title}</p>
                <div className="mt-3 flex flex-col gap-2 text-[13px] sm:mt-4 sm:gap-2.5 sm:text-sm">
                  {column.links.map((link) =>
                    "external" in link && link.external ? (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[var(--text)] transition-colors hover:text-[var(--accent)]"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="text-[var(--text)] transition-colors hover:text-[var(--accent)]"
                      >
                        {link.label}
                      </Link>
                    ),
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-[var(--line)] pt-5 text-xs text-[var(--muted)] sm:mt-10 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:pt-6 sm:text-sm">
          <div className="flex flex-wrap items-center gap-4">
            <p>© {new Date().getFullYear()} Super Entrenador · Todos los derechos reservados.</p>
            <Link href="/politica-privacidad" className="hover:text-[var(--accent)]">Política de privacidad</Link>
            <Link href="/terminos" className="hover:text-[var(--accent)]">Términos</Link>
            <Link href="/cookies" className="hover:text-[var(--accent)]">Cookies</Link>
          </div>
          <a
            href="https://webfuengirola.com/"
            target="_blank"
            rel="noreferrer"
            className="w-fit font-semibold transition-colors hover:text-[var(--accent)]"
          >
            Desarrollado y mantenido por WF Studio
          </a>
        </div>
      </div>
    </footer>
  );
}
