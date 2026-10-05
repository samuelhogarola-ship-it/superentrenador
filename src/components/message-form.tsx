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

    try {
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
    } catch {
      setError("No se pudo enviar el mensaje. Comprueba tu conexión e inténtalo de nuevo.");
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div role="status" className="border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-4 py-3 text-sm font-semibold text-[#8a5c0f]">
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
        className="w-full resize-none border border-[#111214]/15 bg-white px-4 py-3 text-sm text-[#111214] placeholder-[#8a8a92] focus:border-[#111214] focus:outline-none"
      />
      {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={sending || !body.trim()}
        className="inline-flex items-center justify-center gap-2 bg-[#111214] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent)] hover:text-[#111214] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <SendHorizonal size={15} />
        {sending ? "Enviando…" : "Enviar mensaje"}
      </button>
    </form>
  );
}
