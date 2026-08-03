import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[color:rgba(8,9,15,0.86)] backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-6 lg:px-8">
        <BrandMark />

        <nav aria-label="Acceso principal" className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/registro?intent=trainer"
            className="inline-flex min-h-10 items-center justify-center rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-bold text-[var(--ink)] transition-transform hover:-translate-y-0.5 sm:px-5"
          >
            Publica tu anuncio
          </Link>
          <Link
            href="/login"
            className="inline-flex min-h-10 items-center justify-center rounded-full px-3 py-2 text-sm font-semibold text-[#9bd5ff] transition-colors hover:text-[#d9f2ff] sm:px-4"
          >
            Iniciar sesión
          </Link>
        </nav>
      </div>
    </header>
  );
}
