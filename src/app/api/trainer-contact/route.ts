import { NextResponse } from "next/server";
import { getSupabaseSessionServerClient } from "@/lib/supabase/server";
import { getClientIp, rateLimit } from "@/lib/server/rate-limit";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug")?.trim() ?? "";

  if (!slug || !SLUG_PATTERN.test(slug)) {
    return NextResponse.json({ contactInfo: "" }, { status: 400 });
  }

  const supabase = await getSupabaseSessionServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ contactInfo: "" }, { status: 401 });
  }

  const limited = rateLimit(`trainer-contact:${user.id}:${getClientIp(request)}`, {
    limit: 30,
    windowMs: 10 * 60 * 1000,
  });

  if (!limited.allowed) {
    return NextResponse.json({ contactInfo: "", error: "rate_limited" }, { status: 429 });
  }

  const { data, error } = await supabase.rpc("get_public_trainer_contact_info", {
    trainer_slug: slug,
  });

  if (error) {
    return NextResponse.json({ contactInfo: "" }, { status: 500 });
  }

  return NextResponse.json({ contactInfo: data ?? "" });
}
