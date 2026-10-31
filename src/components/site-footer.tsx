import Link from "next/link";
import { ShieldCheck } from "lucide-react";
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
      { href: "/andalucia", label: "Andalucía" },
      { href: "/ciudades/malaga", label: "Málaga" },
      { href: "/ciudades/sevilla", label: "Sevilla" },
      { href: "/ciudades/marbella", label: "Marbella" },
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
      { href: "/blog", label: "Todas las guías" },
      { href: "/blog/como-elegir-entrenador-personal-con-criterio", label: "Elegir entrenador" },
      { href: "/blog/preparar-primer-cliente-entrenador-andalucia", label: "Preparar tu primer cliente" },
      { href: "/blog/necesito-ser-autonomo-entrenador-personal", label: "Trabajar como entrenador" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--line)] px-4 pb-10 pt-12 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_2fr]">
          <div>
            <BrandMark />
            <p className="app-copy mt-5 max-w-sm text-sm">
              Encuentra entrenadores de distintas disciplinas con perfiles claros, especialidades visibles y contacto protegido
              hasta que decidas avanzar.
            </p>
            <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--accent-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--accent)]">
              <ShieldCheck size={13} className="text-[var(--accent)]" />
              Contacto protegido
            </span>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {COLUMNS.map((column) => (
              <div key={column.title}>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--muted)]">{column.title}</p>
                <div className="mt-4 flex flex-col gap-2.5 text-sm">
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

        <div className="mt-10 flex flex-col gap-4 border-t border-[var(--line)] pt-6 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
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
