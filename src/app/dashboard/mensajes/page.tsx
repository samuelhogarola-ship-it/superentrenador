"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { MessageSquare, SendHorizonal } from "lucide-react";
import { MessageForm } from "@/components/message-form";

interface Message {
  id: string;
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
    if (!map.has(m.sender_id)) map.set(m.sender_id, []);
    map.get(m.sender_id)!.push(m);
  }
  const result: Thread[] = [];
  for (const [senderId, threadMsgs] of map) {
    const sorted = [...threadMsgs].sort((a, b) => a.created_at.localeCompare(b.created_at));
    result.push({
      key: `${senderId}:${tp.id}`,
      senderName: sorted[0].sender_name,
      senderId,
      trainerProfileId: tp.id,
      trainerDisplayName: tp.display_name,
      trainerSlug: tp.slug,
      latestMessage: sorted[sorted.length - 1],
      unread: sorted.filter((m) => !m.read_at).length,
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
    const unreadIds = thread.messages.filter((m) => !m.read_at).map((m) => m.id);
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
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8 md:px-6 lg:px-8">
      <div>
        <p className="app-kicker">Mensajes</p>
        <h1 className="app-title mt-1 text-3xl text-[var(--text)]">Bandeja de entrada</h1>
      </div>

      {threads.length === 0 ? (
        <div className="app-surface rounded-[24px] px-6 py-10 text-center text-sm text-[var(--muted)]">
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
                className={`app-surface flex flex-col gap-1 rounded-[20px] p-4 text-left transition-colors hover:border-[var(--line-strong)] ${selectedKey === thread.key ? "border-[var(--accent)]" : ""}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-semibold text-[var(--text)]">
                    {isTrainer ? thread.senderName : thread.trainerDisplayName}
                  </span>
                  {thread.unread > 0 && (
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-[10px] font-bold text-[var(--ink)]">
                      {thread.unread}
                    </span>
                  )}
                </div>
                <p className="truncate text-xs text-[var(--muted)]">{thread.latestMessage.body}</p>
                <p className="text-[10px] text-[var(--muted)]">
                  {formatDistanceToNow(new Date(thread.latestMessage.created_at), { locale: es, addSuffix: true })}
                </p>
              </button>
            ))}
          </div>

          {selectedThread ? (
            <div className="app-surface flex flex-col gap-4 rounded-[24px] p-5">
              <div className="border-b border-[var(--line)] pb-4">
                <p className="font-semibold text-[var(--text)]">
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
                            : "bg-[var(--bg-soft)] text-[var(--text)]"
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

              {!isTrainer && (
                <div className="border-t border-[var(--line)] pt-4">
                  {replying ? (
                    <MessageForm
                      trainerProfileId={selectedThread.trainerProfileId}
                      trainerName={selectedThread.trainerDisplayName}
                      onSent={() => { setReplying(false); setReloadToken((n) => n + 1); }}
                    />
                  ) : (
                    <button
                      onClick={() => setReplying(true)}
                      className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-4 py-2 text-sm font-semibold text-[var(--text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                    >
                      <SendHorizonal size={14} />
                      Responder
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="app-surface flex items-center justify-center rounded-[24px] p-10 text-sm text-[var(--muted)]">
              Selecciona una conversación
            </div>
          )}
        </div>
      )}
    </main>
  );
}
