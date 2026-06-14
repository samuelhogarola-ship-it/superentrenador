import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[rgba(7,12,18,0.92)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-[var(--muted)] lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <p>Super Entrenador · Marketplace SEO para entrenadores personales.</p>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/entrenadores" className="transition-colors hover:text-[var(--text)]">
            Entrenadores
          </Link>
          <Link href="/ciudades/fuengirola" className="transition-colors hover:text-[var(--text)]">
            Ciudades
          </Link>
          <Link href="/login" className="transition-colors hover:text-[var(--text)]">
            Zona privada futura
          </Link>
        </div>
      </div>
    </footer>
  );
}
