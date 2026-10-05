import { NextResponse } from "next/server";
import { isSameOriginRequest } from "@/lib/server/request-security";
import { getSupabaseSessionServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ ok: false, error: "invalid_origin" }, { status: 403 });
  }

  try {
    const supabase = await getSupabaseSessionServerClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("[auth/sign-out] signOut failed", error);
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[auth/sign-out] unexpected error", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
