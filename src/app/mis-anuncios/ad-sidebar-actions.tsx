"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Share2, Trash2 } from "lucide-react";
import { deleteTrainerProfile } from "./actions";

interface AdSidebarActionsProps {
  trainerId: string;
  trainerSlug: string;
  canShare: boolean;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function AdSidebarActions({ trainerId, trainerSlug, canShare }: AdSidebarActionsProps) {
  const [copied, setCopied] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const confirmRef = useRef<HTMLDivElement>(null);
  const deleteTriggerRef = useRef<HTMLButtonElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!showConfirm) return;

    cancelRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setShowConfirm(false);
        return;
      }
      if (event.key !== "Tab") return;

      const dialog = confirmRef.current;
      if (!dialog) return;
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    const trigger = deleteTriggerRef.current;
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      trigger?.focus();
    };
  }, [showConfirm]);

  async function handleShare() {
    const url = `${window.location.origin}/entrenadores/${trainerSlug}`;
    if (navigator.share) {
      await navigator.share({ url }).catch(() => null);
    } else {
      await navigator.clipboard.writeText(url).catch(() => null);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    setDeleteError(null);
    const result = await deleteTrainerProfile(trainerId);
    if (!result.ok) {
      setDeleteError(result.error);
      setDeleting(false);
    }
  }

  return (
    <>
      {canShare ? (
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f5f5f5] px-4 py-3 text-sm font-bold text-[#555] transition-colors hover:bg-[#ffe1df] hover:text-[#ff6868]"
        >
          {copied ? <Check size={16} /> : <Share2 size={16} />}
          {copied ? "¡Enlace copiado!" : "Compartir anuncio"}
        </button>
      ) : null}

      <button
        type="button"
        ref={deleteTriggerRef}
        onClick={() => { setShowConfirm(true); setDeleteError(null); }}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f5f5f5] px-4 py-3 text-sm font-bold text-[#555] transition-colors hover:bg-red-50 hover:text-red-600"
      >
        <Trash2 size={16} />
        Eliminar anuncio
      </button>

      {showConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowConfirm(false); }}
        >
          <div ref={confirmRef} className="w-full max-w-sm rounded-[24px] bg-white p-6 shadow-xl">
            <h2 id="confirm-title" className="font-heading text-xl font-bold text-[#17171b]">
              ¿Eliminar anuncio?
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#666]">
              Esta acción es permanente. Se borrará tu perfil, fotos y todos los mensajes asociados. No se puede deshacer.
            </p>
            {deleteError && (
              <p role="alert" className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600">
                {deleteError}
              </p>
            )}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                ref={cancelRef}
                onClick={() => setShowConfirm(false)}
                disabled={deleting}
                className="flex-1 rounded-full border border-[#e2e2e2] bg-white px-4 py-2.5 text-sm font-bold text-[#17171b] transition-colors hover:bg-[#f5f5f5] disabled:opacity-40"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 rounded-full bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Eliminando…" : "Sí, eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
