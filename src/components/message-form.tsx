"use client";

import { useState } from "react";
import { SendHorizonal } from "lucide-react";

interface MessageFormProps {
  trainerProfileId: string;
  trainerName: string;
  clientId?: string;
  onSent?: () => void;
}

export function MessageForm({ trainerProfileId, trainerName, clientId, onSent }: MessageFormProps) {
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setSending(true);
    setError(null);

    const response = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        trainerProfileId,
        clientId,
        body: body.trim(),
      }),
    });

    if (!response.ok) {
      setError("No se pudo enviar el mensaje. Inténtalo de nuevo.");
    } else {
      setSent(true);
      setBody("");
      onSent?.();
    }
    setSending(false);
  }

  if (sent) {
    return (
      <div role="status" className="rounded-2xl bg-[var(--accent-soft)] px-4 py-3 text-sm text-[var(--accent)]">
        Mensaje enviado a {trainerName}. Te responderá pronto.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <textarea
        aria-label={`Mensaje para ${trainerName}`}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={`Escribe un mensaje a ${trainerName}…`}
        maxLength={2000}
        rows={4}
        className="w-full resize-none rounded-2xl border border-[var(--line)] bg-[var(--bg-soft)] px-4 py-3 text-sm text-[var(--text)] placeholder-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
      />
      {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={sending || !body.trim()}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[var(--ink)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <SendHorizonal size={15} />
        {sending ? "Enviando…" : "Enviar mensaje"}
      </button>
    </form>
  );
}
