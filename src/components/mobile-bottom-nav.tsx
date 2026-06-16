"use client";

import Link from "next/link";
import { Building2, Home, MapPinned, UserRound } from "lucide-react";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/entrenadores", label: "Trainers", icon: UserRound },
  { href: "/ciudades/fuengirola", label: "Ciudad", icon: MapPinned },
  { href: "/login", label: "Acceso", icon: Building2 },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegacion principal movil"
      className="fixed inset-x-4 bottom-4 z-40 md:hidden"
    >
      <div className="app-surface grid grid-cols-4 rounded-[28px] px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 rounded-[20px] px-2 py-3 text-[11px] font-semibold transition-colors ${
                isActive ? "bg-[var(--accent-soft)] text-[var(--text)]" : "text-[var(--muted)]"
              }`}
            >
              <Icon size={18} className={isActive ? "text-[var(--accent)]" : "text-current"} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
