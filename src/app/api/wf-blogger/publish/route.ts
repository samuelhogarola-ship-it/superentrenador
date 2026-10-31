import { timingSafeEqual } from "node:crypto";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

function matchesSecret(received: string, expected: string) {
  const left = Buffer.from(received);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}

export async function POST(request: Request) {
  const expected = process.env.WF_BLOGGER_BUILD_SECRET?.trim();
  const authorization = request.headers.get("authorization") ?? "";
  const received = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  if (!expected || !matchesSecret(received, expected)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const payload = await request.json().catch(() => null) as { siteKey?: string } | null;
  if (payload?.siteKey !== "superentrenador") {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  revalidatePath("/biblioteca");
  revalidatePath("/biblioteca/[slug]", "page");
  return NextResponse.json({ ok: true, siteKey: "superentrenador" });
}
