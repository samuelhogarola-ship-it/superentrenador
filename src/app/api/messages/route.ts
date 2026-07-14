import { NextResponse } from "next/server";
import { getSupabaseSessionServerClient } from "@/lib/supabase/server";
import { getClientIp, rateLimit } from "@/lib/server/rate-limit";

interface PublicTrainerProfile {
  id: string;
  display_name: string;
  slug: string;
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MAX_MESSAGE_LENGTH = 2000;

function cleanIdArray(value: unknown, maxItems = 100) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string" && UUID_PATTERN.test(item.trim()))
    .map((item) => item.trim())
    .slice(0, maxItems);
}

export async function GET() {
  const supabase = await getSupabaseSessionServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const userName = user.user_metadata?.full_name ?? user.email ?? "Usuario";
  const { data: ownTrainerProfiles } = await supabase.rpc("get_own_trainer_message_profile");
  const trainerProfile = ownTrainerProfiles?.[0] ?? null;

  if (trainerProfile) {
    const { data: messages, error } = await supabase
      .from("messages")
      .select("*")
      .eq("trainer_profile_id", trainerProfile.id)
      .order("created_at", { ascending: true });

    if (error) {
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      mode: "trainer",
      userId: user.id,
      userName,
      trainerProfile,
      messages: messages ?? [],
      trainers: [],
    });
  }

  const { data: messages, error } = await supabase
    .from("messages")
    .select("*")
    .eq("sender_id", user.id)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  const trainerIds = [...new Set((messages ?? []).map((message) => message.trainer_profile_id))];
  let trainers: PublicTrainerProfile[] = [];

  if (trainerIds.length > 0) {
    const { data: trainerProfiles } = await supabase
      .from("trainer_profiles_public")
      .select("id, display_name, slug")
      .in("id", trainerIds);
    trainers = (trainerProfiles ?? []).filter(
      (trainer): trainer is PublicTrainerProfile =>
        Boolean(trainer.id && trainer.display_name && trainer.slug)
    );
  }

  return NextResponse.json({
    ok: true,
    mode: "client",
    userId: user.id,
    userName,
    trainerProfile: null,
    messages: messages ?? [],
    trainers,
  });
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as {
    trainerProfileId?: string;
    body?: string;
  } | null;

  const trainerProfileId = payload?.trainerProfileId;
  const body = payload?.body?.trim();

  if (!trainerProfileId || !UUID_PATTERN.test(trainerProfileId) || !body || body.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const supabase = await getSupabaseSessionServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const limited = rateLimit(`messages:post:${user.id}:${getClientIp(request)}`, {
    limit: 5,
    windowMs: 10 * 60 * 1000,
  });

  if (!limited.allowed) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  const { error } = await supabase.from("messages").insert({
    sender_id: user.id,
    sender_name: user.user_metadata?.full_name ?? user.email ?? "Usuario",
    trainer_profile_id: trainerProfileId,
    body,
  });

  if (error) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function PATCH(request: Request) {
  const payload = (await request.json().catch(() => null)) as {
    messageIds?: unknown;
  } | null;
  const messageIds = cleanIdArray(payload?.messageIds);

  if (messageIds.length === 0) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const supabase = await getSupabaseSessionServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const { error } = await supabase
    .from("messages")
    .update({ read_at: new Date().toISOString() })
    .in("id", messageIds);

  if (error) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
