"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Award, Globe2, LockKeyhole, MapPin, MessageSquare, Phone } from "lucide-react";
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
        const { data } = await supabase
          .from("trainer_profiles")
          .select("contact_info")
          .eq("slug", trainerSlug)
          .maybeSingle();
        setContactInfo((data as { contact_info: string } | null)?.contact_info ?? "");
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
        supabase
          .from("trainer_profiles")
          .select("contact_info")
          .eq("slug", trainerSlug)
          .maybeSingle()
          .then(({ data }) => {
            setContactInfo((data as { contact_info: string } | null)?.contact_info ?? "");
          });
      }
    });

    return () => subscription.unsubscribe();
  }, [trainerSlug]);

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

      <div className="mt-6 rounded-[24px] border border-[var(--line)] bg-[var(--surface)] p-5">
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
                  senderName={currentUser.name}
                  senderId={currentUser.id}
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
            <p className="app-kicker">Acceso premium</p>
            <p className="mt-3 text-sm leading-7 text-[var(--text)]">{hiddenContactHint}</p>
            <div className="mt-5 grid gap-3">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-[var(--ink)] transition-transform hover:-translate-y-0.5"
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
