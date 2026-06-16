import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="px-4 pb-24 pt-6 md:px-6 md:pb-8 lg:px-8">
      <div className="app-surface mx-auto flex max-w-7xl flex-col gap-4 rounded-[32px] px-6 py-8 text-sm text-[var(--muted)] lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <p>Super Entrenador · Discovery premium para entrenadores personales.</p>
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
