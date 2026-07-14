"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle, ExternalLink, Loader } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { getTrainerProfile, signOut } from "@/lib/auth";

const FALLBACK_SPECIALTIES = [
  "Hipertrofia", "Pérdida de grasa", "Seguimiento online", "Planes híbridos",
  "Fuerza femenina", "Posparto", "Entrenamiento funcional", "Rendimiento",
  "Preparación física", "Fuerza aplicada",
];
const FALLBACK_MODALITIES = ["Presencial", "Online", "Híbrido"];
const FALLBACK_LANGUAGES = ["Alemán", "Español", "Francés", "Inglés", "Italiano", "Portugués"];

function uniqueSorted(rows: Record<string, unknown>[], key: string): string[] {
  const set = new Set<string>();
  rows.forEach((r) => ((r[key] as string[]) ?? []).forEach((v) => set.add(v)));
  return Array.from(set).sort();
}

interface City {
  slug: string;
  name: string;
  region: string;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function MiPerfilPage() {
  const router = useRouter();
  const [authLoading, setAuthLoading] = useState(true);
  const [cities, setCities] = useState<City[]>([]);
  const [allSpecialties, setAllSpecialties] = useState<string[]>(FALLBACK_SPECIALTIES);
  const [allModalities, setAllModalities] = useState<string[]>(FALLBACK_MODALITIES);
  const [allLanguages, setAllLanguages] = useState<string[]>(FALLBACK_LANGUAGES);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileSlug, setProfileSlug] = useState<string | null>(null);

  const [reviewStatus, setReviewStatus] = useState<string | null>(null);

  const [form, setForm] = useState({
    displayName: "",
    citySlug: "",
    headline: "",
    shortBio: "",
    longBio: "",
    specialties: [] as string[],
    modalities: [] as string[],
    languages: ["Español"],
    yearsExperience: "",
    priceFrom: "",
    contactInfo: "",
    photoUrl: "",
  });

  useEffect(() => {
    async function load() {
      const supabase = getSupabaseBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const [citiesRes, specialtiesRes, modalitiesRes, languagesRes, existing] = await Promise.all([
        supabase.from("cities").select("slug, name, region").order("name"),
        supabase.from("trainer_profiles_public").select("specialties"),
        supabase.from("trainer_profiles_public").select("modalities"),
        supabase.from("trainer_profiles_public").select("languages"),
        getTrainerProfile(),
      ]);

      if (citiesRes.data) setCities(citiesRes.data as City[]);

      const specs = uniqueSorted(specialtiesRes.data ?? [], "specialties");
      if (specs.length > 0) setAllSpecialties(specs);

      const mods = uniqueSorted(modalitiesRes.data ?? [], "modalities");
      if (mods.length > 0) setAllModalities(mods);

      const langs = uniqueSorted(languagesRes.data ?? [], "languages");
      if (langs.length > 0) setAllLanguages(langs);

      if (existing) {
        setProfileSlug(existing.slug as string);
        setReviewStatus(existing.review_status ?? "pending");
        setForm({
          displayName: existing.display_name as string ?? "",
          citySlug: existing.city_slug as string ?? "",
          headline: existing.headline as string ?? "",
          shortBio: existing.short_bio as string ?? "",
          longBio: existing.long_bio as string ?? "",
          specialties: existing.specialties as string[] ?? [],
          modalities: existing.modalities as string[] ?? [],
          languages: existing.languages as string[] ?? ["Español"],
          yearsExperience: String(existing.years_experience ?? ""),
          priceFrom: String(existing.price_from ?? ""),
          contactInfo: existing.contact_info as string ?? "",
          photoUrl: existing.photo_url as string ?? "",
        });
      }

      setAuthLoading(false);
    }

    load();
  }, [router]);

  function toggleArray(field: "specialties" | "modalities" | "languages", value: string) {
    setForm((prev) => {
      const arr = prev[field];
      return {
        ...prev,
        [field]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      };
    });
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    setError(null);
    setSaving(true);

    const slug = profileSlug ?? `${slugify(form.displayName)}-entrenador-personal-${form.citySlug}`;

    const payload = {
      slug,
      display_name: form.displayName,
      city_slug: form.citySlug,
      headline: form.headline,
      short_bio: form.shortBio,
      long_bio: form.longBio,
      specialties: form.specialties,
      modalities: form.modalities,
      languages: form.languages,
      years_experience: Number(form.yearsExperience) || 0,
      price_from: Number(form.priceFrom) || 0,
      contact_info: form.contactInfo,
      photo_url: form.photoUrl || null,
    };

    const response = await fetch("/api/own-trainer-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const result = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(result?.error ?? "No se pudo guardar el perfil.");
      setSaving(false);
      return;
    }

    setProfileSlug(slug);
    setReviewStatus("pending");
    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 4000);
  }

  async function handleSignOut() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  if (authLoading) {
    return (
      <main className="mx-auto flex w-full max-w-4xl flex-1 items-center justify-center px-4 py-10">
        <Loader size={24} className="animate-spin text-[var(--accent)]" />
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-6 md:px-6 md:py-8 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="app-kicker">Panel del entrenador</p>
          <h1 className="app-title mt-1 text-3xl text-[var(--text)]">Mi perfil público</h1>
        </div>
        <div className="flex items-center gap-3">
          {profileSlug && reviewStatus === "approved" ? (
            <Link
              href={`/entrenadores/${profileSlug}`}
              target="_blank"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-4 py-2 text-sm font-semibold text-[var(--text)] hover:border-[var(--line-strong)]"
            >
              Ver ficha pública
              <ExternalLink size={14} />
            </Link>
          ) : null}
          <button
            onClick={handleSignOut}
            className="rounded-full border border-[var(--line)] px-4 py-2 text-sm font-medium text-[var(--muted)] hover:text-[var(--text)]"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {reviewStatus === "pending" && profileSlug ? (
        <div className="rounded-[20px] border border-amber-500/30 bg-amber-500/10 px-5 py-4 text-sm text-amber-700">
          <p className="font-semibold">Perfil pendiente de revisión</p>
          <p className="mt-1 font-normal opacity-80">Tu perfil está en cola de aprobación. Lo revisaremos y aparecerá en el marketplace en breve.</p>
        </div>
      ) : reviewStatus === "rejected" ? (
        <div className="rounded-[20px] border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-700">
          <p className="font-semibold">Perfil rechazado</p>
          <p className="mt-1 font-normal opacity-80">Tu perfil no cumple los requisitos. Asegúrate de usar tu nombre real (no nombre comercial) y vuelve a guardar.</p>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="app-surface flex flex-col gap-8 rounded-[28px] p-6 sm:p-8">
        <fieldset className="flex flex-col gap-4">
          <legend className="text-base font-semibold text-[var(--text)]">Información básica</legend>

          <label className="flex flex-col gap-1.5 text-sm font-medium text-[var(--text)]">
            Nombre completo
            <input
              value={form.displayName}
              onChange={(e) => setForm((p) => ({ ...p, displayName: e.target.value }))}
              required
              placeholder="Ej. Sorvali García"
              className="rounded-2xl border border-[var(--line)] bg-[var(--bg-soft)] px-4 py-3 text-sm outline-none focus-visible:border-[var(--accent)]"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium text-[var(--text)]">
            Ciudad
            <select
              value={form.citySlug}
              onChange={(e) => setForm((p) => ({ ...p, citySlug: e.target.value }))}
              required
              className="rounded-2xl border border-[var(--line)] bg-[var(--bg-soft)] px-4 py-3 text-sm outline-none focus-visible:border-[var(--accent)]"
            >
              <option value="">Selecciona tu ciudad</option>
              {cities.map((city) => (
                <option key={city.slug} value={city.slug}>
                  {city.name} · {city.region}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium text-[var(--text)]">
            Titular (una frase que resume tu propuesta)
            <input
              value={form.headline}
              onChange={(e) => setForm((p) => ({ ...p, headline: e.target.value }))}
              required
              maxLength={120}
              placeholder="Ej. Entrenadora personal en Fuengirola especializada en fuerza femenina y posparto."
              className="rounded-2xl border border-[var(--line)] bg-[var(--bg-soft)] px-4 py-3 text-sm outline-none focus-visible:border-[var(--accent)]"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-sm font-medium text-[var(--text)]">
              Años de experiencia
              <input
                type="number"
                min="0"
                max="50"
                value={form.yearsExperience}
                onChange={(e) => setForm((p) => ({ ...p, yearsExperience: e.target.value }))}
                required
                placeholder="Ej. 5"
                className="rounded-2xl border border-[var(--line)] bg-[var(--bg-soft)] px-4 py-3 text-sm outline-none focus-visible:border-[var(--accent)]"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-medium text-[var(--text)]">
              Precio desde (€/sesión)
              <input
                type="number"
                min="0"
                value={form.priceFrom}
                onChange={(e) => setForm((p) => ({ ...p, priceFrom: e.target.value }))}
                required
                placeholder="Ej. 45"
                className="rounded-2xl border border-[var(--line)] bg-[var(--bg-soft)] px-4 py-3 text-sm outline-none focus-visible:border-[var(--accent)]"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1.5 text-sm font-medium text-[var(--text)]">
            Foto de perfil (URL pública)
            <input
              type="url"
              value={form.photoUrl}
              onChange={(e) => setForm((p) => ({ ...p, photoUrl: e.target.value }))}
              placeholder="https://…/tu-foto.jpg"
              className="rounded-2xl border border-[var(--line)] bg-[var(--bg-soft)] px-4 py-3 text-sm outline-none focus-visible:border-[var(--accent)]"
            />
            <span className="text-xs font-normal text-[var(--muted)]">
              Usa una URL de imagen directa (Google Drive no funciona). Prueba con LinkedIn, Instagram o sube la foto a Imgur/Cloudinary.
            </span>
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium text-[var(--text)]">
            Contacto directo (visible solo para usuarios registrados)
            <input
              value={form.contactInfo}
              onChange={(e) => setForm((p) => ({ ...p, contactInfo: e.target.value }))}
              placeholder="Ej. +34 612 345 678 · Instagram: @sorvali.fit"
              className="rounded-2xl border border-[var(--line)] bg-[var(--bg-soft)] px-4 py-3 text-sm outline-none focus-visible:border-[var(--accent)]"
            />
            <span className="text-xs font-normal text-[var(--muted)]">
              Los usuarios sin cuenta solo verán el bloqueo. Los registrados verán este dato.
            </span>
          </label>
        </fieldset>

        <fieldset className="flex flex-col gap-4">
          <legend className="text-base font-semibold text-[var(--text)]">Tu historia</legend>

          <label className="flex flex-col gap-1.5 text-sm font-medium text-[var(--text)]">
            Bio corta (1-2 frases, se ve en el listado)
            <textarea
              value={form.shortBio}
              onChange={(e) => setForm((p) => ({ ...p, shortBio: e.target.value }))}
              required
              rows={2}
              maxLength={220}
              placeholder="Ej. Entrenadora en Fuengirola y Marbella especializada en fuerza femenina, posparto y movilidad funcional."
              className="resize-none rounded-2xl border border-[var(--line)] bg-[var(--bg-soft)] px-4 py-3 text-sm outline-none focus-visible:border-[var(--accent)]"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium text-[var(--text)]">
            Bio completa (para tu página de perfil)
            <textarea
              value={form.longBio}
              onChange={(e) => setForm((p) => ({ ...p, longBio: e.target.value }))}
              required
              rows={5}
              placeholder="Cuéntanos tu historia, metodología y por qué tus clientes te eligen. Con detalle."
              className="resize-none rounded-2xl border border-[var(--line)] bg-[var(--bg-soft)] px-4 py-3 text-sm outline-none focus-visible:border-[var(--accent)]"
            />
          </label>
        </fieldset>

        <fieldset className="flex flex-col gap-3">
          <legend className="text-base font-semibold text-[var(--text)]">Especialidades</legend>
          <div className="flex flex-wrap gap-2">
            {allSpecialties.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => toggleArray("specialties", s)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  form.specialties.includes(s)
                    ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--ink)]"
                    : "border-[var(--line)] bg-[var(--surface)] text-[var(--text)] hover:border-[var(--line-strong)]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-6 sm:grid-cols-2">
          <fieldset className="flex flex-col gap-3">
            <legend className="text-base font-semibold text-[var(--text)]">Modalidades</legend>
            <div className="flex flex-wrap gap-2">
              {allModalities.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => toggleArray("modalities", m)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    form.modalities.includes(m)
                      ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--ink)]"
                      : "border-[var(--line)] bg-[var(--surface)] text-[var(--text)] hover:border-[var(--line-strong)]"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="flex flex-col gap-3">
            <legend className="text-base font-semibold text-[var(--text)]">Idiomas</legend>
            <div className="flex flex-wrap gap-2">
              {allLanguages.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => toggleArray("languages", l)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    form.languages.includes(l)
                      ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--ink)]"
                      : "border-[var(--line)] bg-[var(--surface)] text-[var(--text)] hover:border-[var(--line-strong)]"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        {error ? (
          <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
        ) : null}

        <div className="flex flex-wrap items-center gap-4 border-t border-[var(--line)] pt-6">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--ink)] transition-transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            {saving ? "Guardando…" : "Guardar perfil"}
            {!saving && <ArrowRight size={15} />}
          </button>

          {saved ? (
            <span className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600">
              <CheckCircle size={16} />
              {reviewStatus === "approved" ? "Cambios guardados" : "Perfil enviado, pendiente de revisión"}
            </span>
          ) : null}

          {profileSlug && reviewStatus === "approved" ? (
            <Link
              href={`/entrenadores/${profileSlug}`}
              target="_blank"
              className="ml-auto text-sm text-[var(--muted)] hover:text-[var(--text)]"
            >
              Ver cómo te ven los clientes →
            </Link>
          ) : null}
        </div>
      </form>
    </main>
  );
}
