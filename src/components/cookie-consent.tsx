"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";

const STORAGE_KEY = "super-entrenador-cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setVisible(window.localStorage.getItem(STORAGE_KEY) !== "accepted");
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  if (!visible) return null;

  return (
    <aside aria-label="Aviso de cookies" className="fixed inset-x-3 bottom-24 z-50 mx-auto max-w-3xl rounded-[22px] border border-black/10 bg-white/95 p-4 text-[var(--ink)] shadow-[var(--shadow)] backdrop-blur md:bottom-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
            <ShieldCheck size={17} />
          </span>
          <div>
            <p className="text-sm font-bold text-[var(--ink)]">Cookies técnicas</p>
            <p className="mt-1 text-xs leading-5 text-[var(--paper-muted)]">
              Usamos lo necesario para sesión y preferencias. Sin analítica publicitaria en esta fase.{" "}
              <Link href="/cookies" className="font-semibold text-[var(--accent)] hover:underline">
                Ver política
              </Link>
              .
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            window.localStorage.setItem(STORAGE_KEY, "accepted");
            setVisible(false);
          }}
          className="inline-flex shrink-0 items-center justify-center rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-bold text-[var(--ink)] transition-colors hover:opacity-95"
        >
          Entendido
        </button>
      </div>
    </aside>
  );
}
