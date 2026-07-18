import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getSupabaseSessionServerClient } from "@/lib/supabase/server";

interface OwnTrainerProfilePayload {
  slug?: string;
  display_name?: string;
  city_slug?: string;
  headline?: string;
  short_bio?: string;
  long_bio?: string;
  specialties?: string[];
  modalities?: string[];
  languages?: string[];
  years_experience?: number;
  price_from?: number;
  contact_info?: string;
  photo_url?: string | null;
}

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_TEXT_LENGTH = {
  displayName: 120,
  headline: 180,
  shortBio: 320,
  longBio: 3000,
  contactInfo: 500,
  photoUrl: 1000,
};

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function cleanStringArray(value: unknown, maxItems = 12, maxItemLength = 100) {
  if (!Array.isArray(value)) {
    return [];
  }

  const seen = new Set<string>();
  const cleaned: string[] = [];

  for (const item of value) {
    const text = cleanText(item);

    if (!text || text.length > maxItemLength || seen.has(text)) {
      continue;
    }

    seen.add(text);
    cleaned.push(text);

    if (cleaned.length >= maxItems) {
      break;
    }
  }

  return cleaned;
}

function cleanNonNegativeNumber(value: unknown, max: number) {
  const parsed = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(parsed)) {
    return 0;
  }

  return Math.min(Math.max(Math.floor(parsed), 0), max);
}

async function revalidatePublicTrainerPaths(
  supabase: Awaited<ReturnType<typeof getSupabaseSessionServerClient>>,
  slug: string
) {
  revalidatePath("/");
  revalidatePath("/entrenadores");
  revalidatePath(`/entrenadores/${slug}`);
  revalidatePath("/sitemap.xml");

  const { data: cities } = await supabase.from("cities").select("slug");
  cities?.forEach((city) => revalidatePath(`/ciudades/${city.slug}`));
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as OwnTrainerProfilePayload | null;

  if (!payload) {
    return NextResponse.json({ ok: false, error: "Datos inválidos." }, { status: 400 });
  }

  const slug = cleanText(payload.slug);
  const displayName = cleanText(payload.display_name);
  const citySlug = cleanText(payload.city_slug);
  const headline = cleanText(payload.headline);
  const shortBio = cleanText(payload.short_bio);
  const longBio = cleanText(payload.long_bio);
  const photoUrl = cleanText(payload.photo_url);
  const contactInfo = cleanText(payload.contact_info);
  const specialties = cleanStringArray(payload.specialties);
  const modalities = cleanStringArray(payload.modalities, 4);
  const languages = cleanStringArray(payload.languages, 10);
  const yearsExperience = cleanNonNegativeNumber(payload.years_experience, 80);
  const priceFrom = cleanNonNegativeNumber(payload.price_from, 10000);

  if (!slug || !displayName || !citySlug || !headline || !shortBio || !longBio) {
    return NextResponse.json({ ok: false, error: "Faltan campos obligatorios." }, { status: 400 });
  }

  if (specialties.length === 0 || modalities.length === 0 || languages.length === 0 || priceFrom <= 0) {
    return NextResponse.json(
      { ok: false, error: "Añade especialidades, modalidad, idiomas y precio antes de enviar el perfil." },
      { status: 400 }
    );
  }

  if (
    !SLUG_PATTERN.test(slug) ||
    !SLUG_PATTERN.test(citySlug) ||
    displayName.length > MAX_TEXT_LENGTH.displayName ||
    headline.length > MAX_TEXT_LENGTH.headline ||
    shortBio.length > MAX_TEXT_LENGTH.shortBio ||
    longBio.length > MAX_TEXT_LENGTH.longBio ||
    contactInfo.length > MAX_TEXT_LENGTH.contactInfo ||
    photoUrl.length > MAX_TEXT_LENGTH.photoUrl ||
    (photoUrl && !photoUrl.startsWith("https://"))
  ) {
    return NextResponse.json({ ok: false, error: "Revisa los campos del perfil." }, { status: 400 });
  }

  const supabase = await getSupabaseSessionServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: "Debes iniciar sesión." }, { status: 401 });
  }

  const { data: city } = await supabase
    .from("cities")
    .select("slug")
    .eq("slug", citySlug)
    .maybeSingle();

  if (!city) {
    return NextResponse.json(
      { ok: false, error: "Esta ciudad aún no está activada en la base de datos." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("trainer_profiles")
    .upsert(
      {
        user_id: user.id,
        slug,
        display_name: displayName,
        city_slug: citySlug,
        headline,
        short_bio: shortBio,
        long_bio: longBio,
        specialties,
        modalities,
        languages,
        years_experience: yearsExperience,
        price_from: priceFrom,
        contact_info: contactInfo,
        photo_url: photoUrl || null,
        is_published: false,
        review_status: "pending" as const,
        hidden_contact_hint:
          "El contacto directo se desbloquea para usuarios registrados en el marketplace.",
      },
      { onConflict: "user_id" }
    )
    .select("slug")
    .single();

  if (error || !data) {
    return NextResponse.json({ ok: false, error: "No se pudo guardar el perfil." }, { status: 500 });
  }

  await revalidatePublicTrainerPaths(supabase, data.slug);

  return NextResponse.json({ ok: true, slug: data.slug });
}
