"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, LayoutDashboard, MapPinned, Sparkles, UserRound } from "lucide-react";
import { usePathname } from "next/navigation";
import { BrandMark } from "@/components/brand-mark";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { signOut } from "@/lib/auth";

const navItems = [
  { href: "/entrenadores", label: "Entrenadores", icon: UserRound },
  { href: "/andalucia", label: "Andalucía", icon: MapPinned },
  { href: "/ciudades/malaga", label: "Málaga", icon: MapPinned },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    supabase.auth.getSession().then(({ data }) => {
      setLoggedIn(!!data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    await signOut();
    window.location.assign("/");
  }

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[color:rgba(245,243,238,0.92)] backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 md:px-6 lg:px-8">
          <BrandMark />

          <nav className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                      : "text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--text)]"
                  }`}
                >
                  <Icon size={15} className={isActive ? "text-[var(--accent)]" : "text-current"} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {loggedIn ? (
              <>
                <Link
                  href="/coach-studio"
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--line-strong)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--text)] transition-colors hover:border-[var(--accent)]"
                >
                  <Sparkles size={15} />
                  Coach Studio
                </Link>
                <Link
                  href="/mi-perfil"
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--line-strong)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--text)] transition-colors hover:border-[var(--accent)]"
                >
                  <LayoutDashboard size={15} />
                  Mi perfil
                </Link>
                <button
                  onClick={handleSignOut}
                  className="rounded-full px-4 py-2 text-sm font-semibold text-[var(--muted)] transition-colors hover:text-[var(--text)]"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/registro"
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--line-strong)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--text)] transition-colors hover:border-[var(--accent)]"
                >
                  Publica tu anuncio
                </Link>
                <Link
                  href="/login"
                  className="rounded-full px-4 py-2 text-sm font-semibold text-[var(--muted)] transition-colors hover:text-[var(--text)]"
                >
                  Iniciar sesión
                </Link>
              </>
            )}
            <Link
              href="/entrenadores"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:opacity-92"
            >
              Buscar entrenador
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="md:hidden">
            {loggedIn ? (
              <Link
                href="/mi-perfil"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white"
              >
                <LayoutDashboard size={15} />
                Mi perfil
              </Link>
            ) : (
              <Link
                href="/entrenadores"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white"
              >
                Buscar
                <ArrowRight size={15} />
              </Link>
            )}
          </div>
        </div>
      </header>
      <MobileBottomNav />
    </>
  );
}
