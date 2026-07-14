import { NextResponse } from "next/server";
import { getSupabaseSessionServerClient } from "@/lib/supabase/server";

export async function POST() {
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
