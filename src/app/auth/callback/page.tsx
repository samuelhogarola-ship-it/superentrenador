"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

// OAuth callback: supabase-js detects the ?code= param and exchanges it automatically.
export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    supabase.auth.getSession().then(() => {
      router.replace("/mi-perfil");
    });
  }, [router]);

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 items-center justify-center px-4 py-10">
      <div className="flex flex-col items-center gap-4 text-center">
        <Loader size={28} className="animate-spin text-[var(--accent)]" />
        <p className="text-sm text-[var(--muted)]">Completando acceso con Google…</p>
      </div>
    </main>
  );
}
