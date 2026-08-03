"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { MessageSquare, SendHorizonal } from "lucide-react";
import Link from "next/link";
import { MessageForm } from "@/components/message-form";

interface Message {
  id: string;
  client_id: string;
  sender_id: string;
  sender_name: string;
  trainer_profile_id: string;
  body: string;
  created_at: string;
  read_at: string | null;
}

interface TrainerProfile {
  id: string;
  display_name: string;
  slug: string;
}

interface Thread {
  key: string;
  senderName: string;
  senderId: string;
  trainerProfileId: string;
  trainerDisplayName: string;
  trainerSlug: string;
  latestMessage: Message;
  unread: number;
  messages: Message[];
}

interface MessagesPayload {
  ok: boolean;
  mode?: "trainer" | "client";
  userId?: string;
  userName?: string;
  trainerProfile?: TrainerProfile | null;
  messages?: Message[];
  trainers?: TrainerProfile[];
}

function buildThreadsAsPT(msgs: Message[], tp: TrainerProfile): Thread[] {
  const map = new Map<string, Message[]>();
  for (const m of msgs) {
    if (!map.has(m.client_id)) map.set(m.client_id, []);
    map.get(m.client_id)!.push(m);
  }
  const result: Thread[] = [];
  for (const [senderId, threadMsgs] of map) {
    const sorted = [...threadMsgs].sort((a, b) => a.created_at.localeCompare(b.created_at));
    result.push({
      key: `${senderId}:${tp.id}`,
      senderName: sorted.find((message) => message.sender_id === senderId)?.sender_name ?? "Cliente",
      senderId,
      trainerProfileId: tp.id,
      trainerDisplayName: tp.display_name,
      trainerSlug: tp.slug,
      latestMessage: sorted[sorted.length - 1],
      unread: sorted.filter((m) => m.sender_id === senderId && !m.read_at).length,
      messages: sorted,
    });
  }
  return result.sort((a, b) => b.latestMessage.created_at.localeCompare(a.latestMessage.created_at));
}

function buildThreadsAsClient(msgs: Message[], trainers: TrainerProfile[], userId: string, userName: string): Thread[] {
  const map = new Map<string, Message[]>();
  for (const m of msgs) {
    if (!map.has(m.trainer_profile_id)) map.set(m.trainer_profile_id, []);
    map.get(m.trainer_profile_id)!.push(m);
  }
  const result: Thread[] = [];
  for (const [tpId, threadMsgs] of map) {
    const sorted = [...threadMsgs].sort((a, b) => a.created_at.localeCompare(b.created_at));
    const trainer = trainers.find((t) => t.id === tpId);
    result.push({
      key: `${userId}:${tpId}`,
      senderName: userName,
      senderId: userId,
      trainerProfileId: tpId,
      trainerDisplayName: trainer?.display_name ?? "Entrenador",
      trainerSlug: trainer?.slug ?? "",
      latestMessage: sorted[sorted.length - 1],
      unread: 0,
      messages: sorted,
    });
  }
  return result.sort((a, b) => b.latestMessage.created_at.localeCompare(a.latestMessage.created_at));
}

export default function MensajesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isTrainer, setIsTrainer] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [replying, setReplying] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    async function load() {
      const response = await fetch("/api/messages");

      if (response.status === 401) {
        router.replace("/login?redirectTo=/dashboard/mensajes");
        return;
      }

      const payload = (await response.json().catch(() => null)) as MessagesPayload | null;

      if (!response.ok || !payload?.ok || !payload.userId || !payload.userName) {
        setLoading(false);
        return;
      }

      setCurrentUserId(payload.userId);

      if (payload.mode === "trainer" && payload.trainerProfile) {
        setIsTrainer(true);
        setThreads(buildThreadsAsPT(payload.messages ?? [], payload.trainerProfile));
      } else {
        setIsTrainer(false);
        setThreads(buildThreadsAsClient(payload.messages ?? [], payload.trainers ?? [], payload.userId, payload.userName));
      }

      setLoading(false);
    }
    load();
  // reloadToken forces re-fetch after sending a reply
   
  }, [router, reloadToken]);

  async function markThreadRead(thread: Thread) {
    if (!isTrainer || thread.unread === 0) return;
    const unreadIds = thread.messages
      .filter((m) => m.sender_id !== currentUserId && !m.read_at)
      .map((m) => m.id);
    await fetch("/api/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messageIds: unreadIds }),
    });
    setThreads((prev) =>
      prev.map((t) =>
        t.key === thread.key
          ? { ...t, unread: 0, messages: t.messages.map((m) => ({ ...m, read_at: m.read_at ?? new Date().toISOString() })) }
          : t
      )
    );
  }

  const selectedThread = threads.find((t) => t.key === selectedKey) ?? null;

  if (loading) {
    return (
      <main className="mx-auto flex w-full max-w-5xl flex-1 items-center justify-center px-4 py-16">
        <span className="text-sm text-[var(--muted)]">Cargando mensajes…</span>
      </main>
    );
  }

  return (
    <main className="flex w-full flex-1 flex-col bg-white text-[#17171b]">
      <nav className="bg-[#202020] px-4 text-white sm:px-6 lg:px-8" aria-label="Panel del entrenador">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto">
          {[
            { label: "Panel de control", href: "/dashboard" },
            { label: "Mensajes", href: "/dashboard/mensajes" },
            { label: "Mis anuncios", href: "/mis-anuncios" },
            { label: "Mi cuenta", href: "/mi-perfil" },
            { label: "Premium", href: "/dashboard" },
          ].map((item) => (
            <Link key={item.label} href={item.href} className={`whitespace-nowrap border-b-4 px-4 py-5 text-sm font-bold sm:px-6 ${item.label === "Mensajes" ? "border-[#ff6868] text-white" : "border-transparent text-white/60 hover:text-white"}`}>
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 md:px-6 lg:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#ff6868]">Comunicación</p>
          <h1 className="mt-1 font-heading text-3xl font-bold text-[#17171b]">Mensajes</h1>
          <p className="mt-2 text-sm text-[#68686f]">Gestiona tus conversaciones con clientes y entrenadores.</p>
        </div>

      {threads.length === 0 ? (
        <div className="rounded-[24px] border border-black/10 bg-white px-6 py-16 text-center text-sm text-[#68686f] shadow-sm">
          <MessageSquare size={32} className="mx-auto mb-3 opacity-30" />
          No tienes mensajes todavía.
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
          <div className="flex flex-col gap-2">
            {threads.map((thread) => (
              <button
                key={thread.key}
                onClick={() => { setSelectedKey(thread.key); markThreadRead(thread); setReplying(false); }}
                className={`flex flex-col gap-1 rounded-[20px] border bg-white p-4 text-left shadow-sm transition-colors hover:border-[#ff6868] ${selectedKey === thread.key ? "border-[#ff6868] ring-2 ring-[#ff6868]/10" : "border-black/10"}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-semibold text-[#17171b]">
                    {isTrainer ? thread.senderName : thread.trainerDisplayName}
                  </span>
                  {thread.unread > 0 && (
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-[10px] font-bold text-[var(--ink)]">
                      {thread.unread}
                    </span>
                  )}
                </div>
                <p className="truncate text-xs text-[#68686f]">{thread.latestMessage.body}</p>
                <p className="text-[10px] text-[#68686f]">
                  {formatDistanceToNow(new Date(thread.latestMessage.created_at), { locale: es, addSuffix: true })}
                </p>
              </button>
            ))}
          </div>

          {selectedThread ? (
            <div className="flex min-h-[420px] flex-col gap-4 rounded-[24px] border border-black/10 bg-white p-5 shadow-sm">
              <div className="border-b border-black/10 pb-4">
                <p className="font-semibold text-[#17171b]">
                  {isTrainer ? selectedThread.senderName : selectedThread.trainerDisplayName}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {selectedThread.messages.map((msg) => {
                  const isMine = msg.sender_id === currentUserId;
                  return (
                    <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                          isMine
                            ? "bg-[var(--accent)] text-[var(--ink)]"
                            : "bg-[#f3f3f3] text-[#17171b]"
                        }`}
                      >
                        <p>{msg.body}</p>
                        <p className={`mt-1 text-[10px] ${isMine ? "text-[var(--ink)]/60" : "text-[var(--muted)]"}`}>
                          {formatDistanceToNow(new Date(msg.created_at), { locale: es, addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-black/10 pt-4">
                {replying ? (
                  <MessageForm
                    trainerProfileId={selectedThread.trainerProfileId}
                    trainerName={isTrainer ? selectedThread.senderName : selectedThread.trainerDisplayName}
                    clientId={isTrainer ? selectedThread.senderId : undefined}
                    onSent={() => { setReplying(false); setReloadToken((n) => n + 1); }}
                  />
                ) : (
                  <button
                    onClick={() => setReplying(true)}
                    className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-[#17171b] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  >
                    <SendHorizonal size={14} />
                    Responder
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-[24px] border border-black/10 bg-white p-10 text-sm text-[#68686f] shadow-sm">
              Selecciona una conversación
            </div>
          )}
        </div>
      )}
      </div>
    </main>
  );
}
