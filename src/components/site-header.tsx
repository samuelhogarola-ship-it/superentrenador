"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BrandMark } from "@/components/brand-mark";
import { signOut, useCurrentUser } from "@/lib/auth";

export function SiteHeader() {
  const { user } = useCurrentUser();
  const router = useRouter();
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/registro";

  async function handleSignOut() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[color:rgba(8,9,15,0.92)] backdrop-blur-md">
      <div className={`flex items-center justify-between gap-2 px-3 [&>a>span]:hidden sm:gap-4 sm:px-4 sm:[&>a>span]:flex md:px-6 lg:px-8 ${isAuthPage ? "py-3" : "mx-auto w-full max-w-7xl py-3"}`}>
        <BrandMark compact={isAuthPage} />

        <nav aria-label="Acceso principal" className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="inline-flex min-h-10 items-center justify-center whitespace-nowrap rounded-full bg-[var(--accent)] px-3 py-2 text-xs font-bold text-[var(--ink)] transition-transform hover:-translate-y-0.5 sm:px-5 sm:text-sm"
              >
                Mi panel
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="brand-super inline-flex min-h-10 items-center justify-center whitespace-nowrap rounded-full px-2 py-2 text-xs font-semibold transition-opacity hover:opacity-80 sm:px-4 sm:text-sm"
              >
                Cerrar sesión
              </button>
            </>
          ) : isAuthPage ? (
            pathname === "/login" ? (
              <Link
                href="/registro?intent=trainer"
                className="inline-flex min-h-9 items-center justify-center rounded-full border border-white/15 px-4 py-2 text-xs font-bold text-white transition-colors hover:border-[var(--accent)]"
              >
                Publica tu anuncio
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-flex min-h-9 items-center justify-center rounded-full border border-white/15 px-4 py-2 text-xs font-bold text-white transition-colors hover:border-[var(--accent)]"
              >
                Iniciar sesión
              </Link>
            )
          ) : (
            <>
              <Link
                href="/registro?intent=trainer"
                data-umami-event="entrenador-publicar-anuncio"
                data-umami-event-origen="header"
                className="inline-flex min-h-10 items-center justify-center whitespace-nowrap rounded-full bg-[var(--accent)] px-3 py-2 text-xs font-bold text-[var(--ink)] transition-transform hover:-translate-y-0.5 sm:px-5 sm:text-sm"
              >
                Publica tu anuncio
              </Link>
              <Link
                href="/login"
                className="brand-super inline-flex min-h-10 items-center justify-center whitespace-nowrap rounded-full px-2 py-2 text-xs font-semibold transition-opacity hover:opacity-80 sm:px-4 sm:text-sm"
              >
                Iniciar sesión
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
