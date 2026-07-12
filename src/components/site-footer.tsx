import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";

const COLUMNS = [
  {
    title: "Marketplace",
    links: [
      { href: "/entrenadores", label: "Todos los entrenadores" },
      { href: "/entrenadores?specialty=Hipertrofia", label: "Hipertrofia" },
      { href: "/entrenadores?specialty=Pérdida de grasa", label: "Pérdida de grasa" },
    ],
  },
  {
    title: "Ciudades",
    links: [
      { href: "/ciudades/fuengirola", label: "Fuengirola" },
      { href: "/ciudades/malaga", label: "Málaga" },
    ],
  },
  {
    title: "Entrenadores",
    links: [
      { href: "/registro", label: "Crear perfil público" },
      { href: "/login", label: "Iniciar sesión" },
      { href: "/coach-studio", label: "Coach Studio" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--line)] px-4 pb-24 pt-12 md:px-6 md:pb-10 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_2fr]">
          <div>
            <BrandMark />
            <p className="app-copy mt-5 max-w-sm text-sm">
              Encuentra entrenadores personales con perfiles claros, especialidades visibles y contacto protegido
              hasta que decidas avanzar.
            </p>
            <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--accent-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--accent)]">
              <ShieldCheck size={13} className="text-[var(--accent)]" />
              Perfiles verificados
            </span>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {COLUMNS.map((column) => (
              <div key={column.title}>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--muted)]">{column.title}</p>
                <div className="mt-4 flex flex-col gap-2.5 text-sm">
                  {column.links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="text-[var(--text)] transition-colors hover:text-[var(--accent)]"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-[var(--line)] pt-6 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <p>© {new Date().getFullYear()} Super Entrenador · Todos los derechos reservados.</p>
            <Link href="/politica-privacidad" className="hover:text-[var(--accent)]">Política de privacidad</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
