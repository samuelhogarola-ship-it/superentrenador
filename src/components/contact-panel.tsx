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
  try {
    const response = await fetch(`/api/trainer-contact?slug=${encodeURIComponent(trainerSlug)}`);
    if (response.status === 429) return { contactInfo: "", rateLimited: true };
    if (!response.ok) return { contactInfo: "", rateLimited: false };

    const payload = (await response.json()) as { contactInfo?: string };
    return { contactInfo: payload.contactInfo ?? "", rateLimited: false };
  } catch {
    return { contactInfo: "", rateLimited: false };
  }
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
  const [contactRateLimited, setContactRateLimited] = useState(false);
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
        const { contactInfo, rateLimited } = await fetchContactInfo(trainerSlug);
        setContactInfo(contactInfo);
        setContactRateLimited(rateLimited);
      }
    }

    checkAndFetch().catch((error) => console.error("[contact-panel] failed to check session", error));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      const isLoggedIn = Boolean(session);
      setLoggedIn(isLoggedIn);
      if (!isLoggedIn) {
        setContactInfo(null);
        setContactRateLimited(false);
        setCurrentUser(null);
      } else if (session?.user) {
        setCurrentUser({
          id: session.user.id,
          name: session.user.user_metadata?.full_name ?? session.user.email ?? "Usuario",
        });
        fetchContactInfo(trainerSlug)
          .then(({ contactInfo, rateLimited }) => {
            setContactInfo(contactInfo);
            setContactRateLimited(rateLimited);
          })
          .catch((error) => console.error("[contact-panel] failed to fetch contact info", error));
      }
    });

    return () => subscription.unsubscribe();
  }, [trainerSlug]);

  return (
    <div className="border border-[#111214] bg-white p-6 text-[#111214]">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8a8a92]">Tarifa horaria</p>
      <p className="font-heading text-4xl font-bold text-[#111214]">
        <span>{priceFrom}€</span>
        <span className="text-base font-medium text-[#8a8a92]"> /hora</span>
      </p>
      <p className="mt-3 inline-flex items-center gap-2 border border-[#111214]/15 bg-[#f7f7f7] px-3 py-1.5 text-xs font-semibold text-[#5b5b63]">
        <ShieldCheck size={13} />
        Contacto protegido por registro
      </p>

      <div className="mt-6 grid gap-4 text-sm text-[#68686f]">
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

      <div className="mt-6 border border-[#111214]/15 bg-white p-5 text-[#111214]">
        {!checked ? null : loggedIn && currentUser ? (
          <>
            {contactInfo ? (
              <>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--accent)]">Contacto directo</p>
                <p className="mt-2 text-sm text-[#5b5b63]">
                  Puedes contactar directamente con {trainerName}:
                </p>
                <div className="mt-4 flex items-center gap-3 border border-[#111214]/15 bg-[#f7f7f7] px-4 py-3">
                  <Phone size={16} className="shrink-0 text-[var(--accent)]" />
                  <span className="text-sm font-semibold text-[#111214]">{contactInfo}</span>
                </div>
              </>
            ) : (
              <>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--accent)]">Contacto</p>
                <p className="mt-2 text-sm text-[#5b5b63]">
                  {contactRateLimited
                    ? "Has consultado el contacto demasiadas veces seguidas. Espera unos minutos o envía un mensaje directo."
                    : `Envía un mensaje directo a ${trainerName}.`}
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
                  className="inline-flex w-full items-center justify-center gap-2 border border-[#111214]/15 px-4 py-2.5 text-sm font-semibold text-[#111214] transition-colors hover:border-[#111214]"
                >
                  <MessageSquare size={15} />
                  Enviar mensaje
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--accent)]">Contacto protegido</p>
            <p className="mt-3 text-sm leading-7 text-[#5b5b63]">
              {hiddenContactHint} Te pediremos una cuenta para ordenar el primer mensaje y evitar conversaciones sin intención.
            </p>
            <div className="mt-5 grid gap-3">
              <Link
                href={loginHref}
                className="inline-flex items-center justify-center gap-2 bg-[#111214] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[var(--accent)] hover:text-[#111214]"
              >
                <MessageSquare size={16} />
                Contactar con {trainerName}
              </Link>
              <Link
                href={registerHref}
                className="inline-flex items-center justify-center gap-2 border border-[#111214]/15 px-4 py-3 text-sm font-semibold text-[#111214]"
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
