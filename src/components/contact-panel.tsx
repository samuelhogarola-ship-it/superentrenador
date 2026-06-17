"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Award, Globe2, LockKeyhole, MapPin, MessageSquare, Phone } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

interface ContactPanelProps {
  priceFrom: number;
  yearsExperience: number;
  modalities: string[];
  languages: string[];
  contactInfo: string;
  hiddenContactHint: string;
  trainerName: string;
}

export function ContactPanel({
  priceFrom,
  yearsExperience,
  modalities,
  languages,
  contactInfo,
  hiddenContactHint,
  trainerName,
}: ContactPanelProps) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    supabase.auth.getUser().then(({ data }) => {
      setLoggedIn(Boolean(data.user));
      setChecked(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setLoggedIn(Boolean(session));
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="rounded-[30px] border border-[var(--line)] bg-[var(--bg-soft)] p-6">
      <p className="text-xs text-[var(--muted)]">Desde</p>
      <p className="font-heading text-4xl text-[var(--text)]">
        {priceFrom}€<span className="text-base font-medium text-[var(--muted)]"> /sesión</span>
      </p>

      <div className="mt-6 grid gap-4 text-sm text-[var(--muted)]">
        <span className="inline-flex items-center gap-3">
          <Award size={16} className="text-[var(--accent)]" />
          {yearsExperience} años de experiencia
        </span>
        <span className="inline-flex items-center gap-3">
          <MapPin size={16} className="text-[var(--accent)]" />
          {modalities.join(" · ")}
        </span>
        <span className="inline-flex items-center gap-3">
          <Globe2 size={16} className="text-[var(--accent)]" />
          {languages.join(" · ")}
        </span>
      </div>

      <div className="mt-6 rounded-[24px] border border-[var(--line)] bg-white p-5">
        {!checked ? null : loggedIn && contactInfo ? (
          <>
            <p className="app-kicker">Contacto directo</p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Puedes contactar directamente con {trainerName}:
            </p>
            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--bg-soft)] px-4 py-3">
              <Phone size={16} className="shrink-0 text-[var(--accent)]" />
              <span className="text-sm font-semibold text-[var(--text)]">{contactInfo}</span>
            </div>
          </>
        ) : loggedIn && !contactInfo ? (
          <>
            <p className="app-kicker">Contacto</p>
            <p className="mt-3 text-sm text-[var(--muted)]">
              Este entrenador aún no ha añadido datos de contacto. Vuelve pronto.
            </p>
          </>
        ) : (
          <>
            <p className="app-kicker">Acceso premium</p>
            <p className="mt-3 text-sm leading-7 text-[var(--text)]">{hiddenContactHint}</p>
            <div className="mt-5 grid gap-3">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--text)] px-4 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
              >
                <MessageSquare size={16} />
                Iniciar sesión para desbloquear
              </Link>
              <Link
                href="/registro"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--line)] px-4 py-3 text-sm font-semibold text-[var(--text)]"
              >
                <LockKeyhole size={16} />
                Crear cuenta gratis
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
