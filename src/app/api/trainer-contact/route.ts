import { NextResponse } from "next/server";
import { getSupabaseSessionServerClient } from "@/lib/supabase/server";
import { hasVerifiedEmail } from "@/lib/server/request-security";

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

  if (!hasVerifiedEmail(user)) {
    return NextResponse.json({ contactInfo: "", error: "email_not_verified" }, { status: 403 });
  }

  const { data, error } = await supabase.rpc("get_public_trainer_contact_info", {
    trainer_slug: slug,
  });

  if (error) {
    if (error.message.includes("rate_limit_exceeded")) {
      return NextResponse.json({ contactInfo: "", error: "rate_limited" }, { status: 429 });
    }
    return NextResponse.json({ contactInfo: "" }, { status: 500 });
  }

  return NextResponse.json({ contactInfo: data ?? "" });
}
