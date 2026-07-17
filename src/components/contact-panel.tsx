"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Award, Globe2, LockKeyhole, MapPin, MessageSquare, Phone, ShieldCheck } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { MessageForm } from "@/components/message-form";

interface ContactPanelProps {
  priceFrom: number;
  yearsExperience: number;
  modalities: string[];
  languages: string[];
  hiddenContactHint: string;
  trainerName: string;
  trainerSlug: string;
  trainerProfileId: string;
}

async function fetchContactInfo(trainerSlug: string) {
  const response = await fetch(`/api/trainer-contact?slug=${encodeURIComponent(trainerSlug)}`);
  if (!response.ok) return "";

  const payload = (await response.json()) as { contactInfo?: string };
  return payload.contactInfo ?? "";
}

export function ContactPanel({
  priceFrom,
  yearsExperience,
  modalities,
  languages,
  hiddenContactHint,
  trainerName,
  trainerSlug,
  trainerProfileId,
}: ContactPanelProps) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checked, setChecked] = useState(false);
  const [contactInfo, setContactInfo] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string } | null>(null);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const profilePath = `/entrenadores/${trainerSlug}`;
  const loginHref = `/login?redirectTo=${encodeURIComponent(profilePath)}`;
  const registerHref = `/registro?intent=client&redirectTo=${encodeURIComponent(profilePath)}`;

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    async function checkAndFetch() {
      const { data: { user } } = await supabase.auth.getUser();
      setLoggedIn(Boolean(user));
      setChecked(true);

      if (user) {
        setCurrentUser({
          id: user.id,
          name: user.user_metadata?.full_name ?? user.email ?? "Usuario",
        });
        setContactInfo(await fetchContactInfo(trainerSlug));
      }
    }

    checkAndFetch();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      const isLoggedIn = Boolean(session);
      setLoggedIn(isLoggedIn);
      if (!isLoggedIn) {
        setContactInfo(null);
        setCurrentUser(null);
      } else if (session?.user) {
        setCurrentUser({
          id: session.user.id,
          name: session.user.user_metadata?.full_name ?? session.user.email ?? "Usuario",
        });
        fetchContactInfo(trainerSlug).then(setContactInfo);
      }
    });

    return () => subscription.unsubscribe();
  }, [trainerSlug]);

  return (
    <div className="rounded-[28px] border border-[var(--line)] bg-[var(--text)] p-6 text-white shadow-[var(--shadow)]">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/55">Desde</p>
      <p className="font-heading text-4xl text-[var(--text)]">
        <span className="text-white">{priceFrom}€</span>
        <span className="text-base font-medium text-white/55"> /sesión</span>
      </p>
      <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs font-semibold text-white/78">
        <ShieldCheck size={13} />
        Contacto protegido por registro
      </p>

      <div className="mt-6 grid gap-4 text-sm text-white/70">
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

      <div className="mt-6 rounded-[22px] border border-white/10 bg-white p-5 text-[var(--text)]">
        {!checked ? null : loggedIn && currentUser ? (
          <>
            {contactInfo ? (
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
            ) : (
              <>
                <p className="app-kicker">Contacto</p>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Envía un mensaje directo a {trainerName}.
                </p>
              </>
            )}
            <div className="mt-4">
              {showMessageForm ? (
                <MessageForm
                  trainerProfileId={trainerProfileId}
                  trainerName={trainerName}
                  onSent={() => setShowMessageForm(false)}
                />
              ) : (
                <button
                  onClick={() => setShowMessageForm(true)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[var(--line)] px-4 py-2.5 text-sm font-semibold text-[var(--text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                >
                  <MessageSquare size={15} />
                  Enviar mensaje
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            <p className="app-kicker">Contacto protegido</p>
            <p className="mt-3 text-sm leading-7 text-[var(--text)]">
              {hiddenContactHint} Te pediremos una cuenta para ordenar el primer mensaje y evitar conversaciones sin intención.
            </p>
            <div className="mt-5 grid gap-3">
              <Link
                href={loginHref}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-4 py-3 text-sm font-bold text-[var(--ink)] transition-transform hover:-translate-y-0.5"
              >
                <MessageSquare size={16} />
                Contactar con {trainerName}
              </Link>
              <Link
                href={registerHref}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--line)] px-4 py-3 text-sm font-semibold text-[var(--text)]"
              >
                <LockKeyhole size={16} />
                Crear cuenta para contactar
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
