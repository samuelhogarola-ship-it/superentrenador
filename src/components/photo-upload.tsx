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

// Signature bytes for the formats the storage bucket accepts — catches a file
// whose extension/declared type doesn't match its real content (e.g. an SVG
// or HTML file renamed to .jpg), independent of the client-supplied MIME type.
const IMAGE_SIGNATURES: { ext: string; bytes: number[] }[] = [
  { ext: "jpg", bytes: [0xff, 0xd8, 0xff] },
  { ext: "png", bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
  { ext: "gif", bytes: [0x47, 0x49, 0x46, 0x38] },
];

async function detectRealImageExtension(file: File): Promise<string | null> {
  const header = new Uint8Array(await file.slice(0, 12).arrayBuffer());

  const matched = IMAGE_SIGNATURES.find((signature) =>
    signature.bytes.every((byte, index) => header[index] === byte),
  );
  if (matched) return matched.ext;

  // WebP: "RIFF"...."WEBP" — signature bytes aren't contiguous from offset 0.
  const isWebp =
    header[0] === 0x52 && header[1] === 0x49 && header[2] === 0x46 && header[3] === 0x46 &&
    header[8] === 0x57 && header[9] === 0x45 && header[10] === 0x42 && header[11] === 0x50;
  if (isWebp) return "webp";

  return null;
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

    const realExt = await detectRealImageExtension(file);
    if (!realExt) {
      setUploadError("El archivo no parece ser una imagen JPEG, PNG, WebP o GIF válida.");
      setUploading(false);
      return;
    }

    const supabase = getSupabaseBrowserClient();
    const path = `${userId}/profile`;
    const contentType = realExt === "jpg" ? "image/jpeg" : `image/${realExt}`;

    const { error } = await supabase.storage
      .from("trainer-photos")
      .upload(path, file, { upsert: true, contentType });

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
        accept="image/jpeg,image/png,image/webp,image/gif"
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
    </div>
  );
}
