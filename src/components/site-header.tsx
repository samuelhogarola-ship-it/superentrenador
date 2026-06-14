import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";

const navItems = [
  { href: "/entrenadores", label: "Entrenadores" },
  { href: "/ciudades/fuengirola", label: "Fuengirola" },
  { href: "/ciudades/malaga", label: "Málaga" },
  { href: "/login", label: "Acceso" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[rgba(7,12,18,0.84)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 lg:px-10">
        <BrandMark />

        <nav className="hidden items-center gap-6 text-sm text-[var(--muted)] md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition-colors hover:text-[var(--text)]">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-[var(--text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/entrenadores"
            className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--ink)] transition-transform hover:-translate-y-0.5"
          >
            Buscar PT
          </Link>
        </div>
      </div>
    </header>
  );
}
