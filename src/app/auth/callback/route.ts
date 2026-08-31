import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSupabaseSessionServerClient } from "@/lib/supabase/server";
import { getSafeInternalPath } from "@/lib/safe-navigation";
import { completeEmailAuthCallback } from "@/lib/email-auth-callback";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const next = getSafeInternalPath(searchParams.get("next"));
  const appUrl = process.env.NEXT_PUBLIC_SITE_URL ?? request.nextUrl.origin;
  const supabase = await getSupabaseSessionServerClient();
  const result = await completeEmailAuthCallback(supabase.auth, searchParams);

  if (result.ok) {
    return NextResponse.redirect(new URL(next, appUrl));
  }

  console.error("[auth/callback] email authentication failed", { flow: result.flow });
  return NextResponse.redirect(new URL("/login?error=auth_callback_failed", appUrl));
}
