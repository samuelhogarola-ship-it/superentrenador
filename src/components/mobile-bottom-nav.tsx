"use client";

import Link from "next/link";
import { Building2, Home, MapPinned, UserRound } from "lucide-react";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/entrenadores", label: "Buscar", icon: UserRound },
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
      <div className="grid grid-cols-4 rounded-[20px] border border-[var(--line-strong)] bg-[color:rgba(255,255,255,0.94)] px-2 py-2 shadow-[var(--shadow-soft)] backdrop-blur-md">
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
                isActive ? "bg-[var(--accent-soft)] text-[var(--accent)]" : "text-[var(--muted)]"
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
