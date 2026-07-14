import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSupabaseSessionServerClient } from "@/lib/supabase/server";

function getSafeNextPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/dashboard";
  }
  return value;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = getSafeNextPath(searchParams.get("next"));
  const appUrl = process.env.NEXT_PUBLIC_SITE_URL ?? request.nextUrl.origin;

  if (code) {
    const supabase = await getSupabaseSessionServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(next, appUrl));
    }
    console.error("[auth/callback] exchangeCodeForSession failed", error);
  }

  return NextResponse.redirect(new URL("/login?error=auth_callback_failed", appUrl));
}
