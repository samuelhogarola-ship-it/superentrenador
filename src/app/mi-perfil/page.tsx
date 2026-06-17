"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle, ExternalLink, Loader } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { getTrainerProfile, signOut } from "@/lib/auth";

const ALL_SPECIALTIES = [
  "Hipertrofia",
  "Pérdida de grasa",
  "Seguimiento online",
  "Planes híbridos",
  "Fuerza femenina",
  "Posparto",
  "Entrenamiento funcional",
  "Rendimiento",
  "Preparación física",
  "Fuerza aplicada",
];

const ALL_MODALITIES = ["Presencial", "Online", "Híbrido"];
const ALL_LANGUAGES = ["Español", "Inglés", "Alemán", "Francés", "Italiano", "Portugués"];

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
  const [userId, setUserId] = useState<string | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileSlug, setProfileSlug] = useState<string | null>(null);

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
  });

  useEffect(() => {
    async function load() {
      const supabase = getSupabaseBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      setUserId(user.id);

      const [citiesRes, existing] = await Promise.all([
        supabase.from("cities").select("slug, name, region").order("name"),
        getTrainerProfile(),
      ]);

      if (citiesRes.data) setCities(citiesRes.data as City[]);

      if (existing) {
        setProfileSlug(existing.slug as string);
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
    if (!userId) return;

    setError(null);
    setSaving(true);

    const slug = profileSlug ?? `${slugify(form.displayName)}-entrenador-personal-${form.citySlug}`;

    const payload = {
      user_id: userId,
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
      hidden_contact_hint:
        "El contacto directo se desbloquea para usuarios registrados en el marketplace.",
      is_published: true,
    };

    const supabase = getSupabaseBrowserClient();
    const { error: dbError } = await supabase.from("trainer_profiles").upsert(payload, { onConflict: "user_id" });

    if (dbError) {
      setError(dbError.message);
      setSaving(false);
      return;
    }

    setProfileSlug(slug);
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
          {profileSlug ? (
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

      <form onSubmit={handleSubmit} className="app-surface flex flex-col gap-8 rounded-[32px] p-6 sm:p-8">
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
            {ALL_SPECIALTIES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => toggleArray("specialties", s)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  form.specialties.includes(s)
                    ? "border-[var(--text)] bg-[var(--text)] text-white"
                    : "border-[var(--line)] bg-white text-[var(--text)] hover:border-[var(--line-strong)]"
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
              {ALL_MODALITIES.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => toggleArray("modalities", m)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    form.modalities.includes(m)
                      ? "border-[var(--text)] bg-[var(--text)] text-white"
                      : "border-[var(--line)] bg-white text-[var(--text)] hover:border-[var(--line-strong)]"
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
              {ALL_LANGUAGES.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => toggleArray("languages", l)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    form.languages.includes(l)
                      ? "border-[var(--text)] bg-[var(--text)] text-white"
                      : "border-[var(--line)] bg-white text-[var(--text)] hover:border-[var(--line-strong)]"
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
            className="inline-flex items-center gap-2 rounded-full bg-[var(--text)] px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            {saving ? "Guardando…" : "Guardar perfil"}
            {!saving && <ArrowRight size={15} />}
          </button>

          {saved ? (
            <span className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600">
              <CheckCircle size={16} />
              Perfil publicado correctamente
            </span>
          ) : null}

          {profileSlug ? (
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
