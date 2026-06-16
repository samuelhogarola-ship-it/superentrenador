"use client";

import Link from "next/link";
import { ArrowRight, MapPinned, UserRound } from "lucide-react";
import { usePathname } from "next/navigation";
import { BrandMark } from "@/components/brand-mark";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";

const navItems = [
  { href: "/entrenadores", label: "Entrenadores", icon: UserRound },
  { href: "/ciudades/fuengirola", label: "Fuengirola", icon: MapPinned },
  { href: "/ciudades/malaga", label: "Málaga", icon: MapPinned },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-30 px-4 pt-4 md:px-6 lg:px-8">
        <div className="app-surface mx-auto flex max-w-7xl items-center justify-between gap-6 rounded-[28px] px-5 py-4 lg:px-8">
          <BrandMark />

          <nav className="hidden items-center gap-3 md:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[var(--accent-soft)] text-[var(--text)]"
                      : "text-[var(--muted)] hover:text-[var(--text)]"
                  }`}
                >
                  <Icon size={15} className={isActive ? "text-[var(--accent)]" : "text-current"} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              className="rounded-full border border-[var(--line)] px-4 py-2 text-sm font-semibold text-[var(--text)] transition-colors hover:border-[var(--line-strong)]"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/entrenadores"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--text)] px-4 py-2 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              Buscar PT
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="md:hidden">
            <Link
              href="/entrenadores"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--text)] px-4 py-2 text-sm font-semibold text-white"
            >
              Ver PT
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </header>
      <MobileBottomNav />
    </>
  );
}
