"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

interface PhotoUploadProps {
  value: string;
  onChange: (url: string) => void;
  userId: string;
}

export function PhotoUpload({ value, onChange, userId }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("La imagen no puede superar 5 MB.");
      return;
    }
    setUploading(true);
    setUploadError(null);

    const supabase = getSupabaseBrowserClient();
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const path = `${userId}/profile.${ext}`;

    const { error } = await supabase.storage
      .from("trainer-photos")
      .upload(path, file, { upsert: true, contentType: file.type });

    if (error) {
      setUploadError("No se pudo subir la foto. Intenta de nuevo.");
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("trainer-photos").getPublicUrl(path);
    onChange(`${data.publicUrl}?t=${Date.now()}`);
    setUploading(false);
  }

  return (
    <div className="flex flex-col gap-3">
      {value ? (
        <div className="relative inline-block w-fit">
          <Image
            src={value}
            alt="Foto de perfil"
            width={96}
            height={96}
            unoptimized={!value.includes("supabase.co")}
            className="h-24 w-24 rounded-full object-cover ring-2 ring-[var(--line)]"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Eliminar foto"
            className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-black/10 hover:bg-red-50"
          >
            <X size={12} className="text-[var(--muted)]" />
          </button>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex items-center gap-3 rounded-2xl border border-dashed border-[var(--line)] bg-[var(--bg-soft)] px-4 py-4 text-sm text-[var(--muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-50"
      >
        <Upload size={18} />
        {uploading ? "Subiendo foto…" : value ? "Cambiar foto" : "Subir foto de perfil"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />

      {uploadError ? (
        <p className="text-xs text-red-600">{uploadError}</p>
      ) : null}

      <label className="flex flex-col gap-1 text-xs font-normal text-[var(--muted)]">
        O pega una URL directa
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://ejemplo.com/tu-foto.jpg"
          className="rounded-xl border border-[var(--line)] bg-[var(--bg-soft)] px-3 py-2 text-sm text-[var(--text)] outline-none focus-visible:border-[var(--accent)]"
        />
      </label>
    </div>
  );
}
