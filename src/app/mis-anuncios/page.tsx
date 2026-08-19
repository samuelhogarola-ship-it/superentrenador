import type { Metadata } from "next";
import Link from "next/link";
import { Eye, MessageSquare, PenLine, Plus } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { Avatar } from "@/components/avatar";
import { getSupabaseSessionServerClient } from "@/lib/supabase/server";
import { marketplaceCities } from "@/lib/marketplace-data";
import { AdSidebarActions } from "./ad-sidebar-actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mis anuncios | Super Entrenador",
  robots: { index: false, follow: false },
};

interface AdProfile {
  id: string;
  slug: string;
  display_name: string;
  city_slug: string;
  headline: string;
  specialties: string[];
  modalities: string[];
  photo_url: string | null;
  price_from: number;
  rating: number;
  reviews_count: number;
  is_published: boolean;
  review_status: string;
}

const NAV_ITEMS = [
  { label: "Panel de control", href: "/dashboard" },
  { label: "Mensajes", href: "/dashboard/mensajes" },
  { label: "Mis anuncios", href: "/mis-anuncios", active: true },
  { label: "Mi cuenta", href: "/mi-perfil" },
];

export default async function MisAnunciosPage() {
  const supabase = await getSupabaseSessionServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirectTo=/mis-anuncios");

  const { data: profile } = await supabase
    .from("trainer_profiles")
    .select("id, slug, display_name, city_slug, headline, specialties, modalities, photo_url, price_from, rating, reviews_count, is_published, review_status")
    .eq("user_id", user.id)
    .maybeSingle();

  const trainerProfile = profile as AdProfile | null;
  const canViewPublic = Boolean(
    trainerProfile && trainerProfile.is_published && trainerProfile.review_status === "approved"
  );
  const city = marketplaceCities.find((item) => item.slug === trainerProfile?.city_slug);
  const { count: messageCount } = trainerProfile
    ? await supabase.from("messages").select("id", { count: "exact", head: true }).eq("trainer_profile_id", trainerProfile.id)
    : { count: 0 };

  return (
    <main className="min-h-full flex-1 bg-[#f7f7f7] text-[#17171b]">
      <nav className="border-b border-white/10 bg-[#202020] px-4 text-white sm:px-6 lg:px-8" aria-label="Panel del entrenador">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`whitespace-nowrap border-b-4 px-4 py-5 text-sm font-bold transition-colors sm:px-6 ${
                item.active ? "border-[#ff6868] text-white" : "border-transparent text-white/60 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8 lg:py-8">
        <section className="min-w-0">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#ff6868]">Área profesional</p>
              <h1 className="mt-1 font-heading text-3xl font-bold sm:text-4xl">Mis anuncios</h1>
            </div>
            <Link href="/mi-perfil" className="inline-flex items-center gap-2 rounded-full bg-[#ff6868] px-5 py-3 text-sm font-bold text-white hover:bg-[#ef5c5c]">
              <Plus size={16} />
              Crear anuncio
            </Link>
          </div>

          {trainerProfile ? (
            <>
              <section className="overflow-hidden rounded-[28px] bg-[#111111] p-5 text-white shadow-[0_20px_50px_rgba(0,0,0,0.14)] sm:p-7">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.12em] text-white/60">Contactos</p>
                    <p className="mt-1 text-sm text-white/60">De los últimos 30 días</p>
                  </div>
                  <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${trainerProfile.is_published ? "bg-[#59c993] text-[#102a20]" : "bg-white/10 text-white/70"}`}>
                    {trainerProfile.is_published ? "Anuncio en línea" : "Pendiente de publicación"}
                  </span>
                </div>
                <div className="mt-6 grid gap-3 sm:max-w-sm">
                  <StatCard icon={MessageSquare} label="Nuevos contactos" value={String(messageCount ?? 0)} />
                </div>
              </section>

              <section className="mt-6 rounded-[28px] border border-[#e2e2e2] bg-white p-5 sm:p-7">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#ff6868]">Tu anuncio</p>
                    <h2 className="mt-1 font-heading text-2xl font-bold">Información pública</h2>
                  </div>
                  <Link href="/mi-perfil" aria-label="Editar anuncio" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#fff0ee] text-[#ff6868] hover:bg-[#ffe1df]">
                    <PenLine size={17} />
                  </Link>
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-4 border-b border-[#ededed] pb-6">
                  <Avatar name={trainerProfile.display_name} photoUrl={trainerProfile.photo_url} size="lg" />
                  <div>
                    <h3 className="font-heading text-2xl font-bold">{trainerProfile.display_name}</h3>
                    <p className="mt-1 text-sm text-[#666]">{city?.name ?? trainerProfile.city_slug} ({trainerProfile.modalities.join(" · ") || "Modalidad por completar"})</p>
                    {trainerProfile.reviews_count > 0 ? <p className="mt-2 text-sm font-bold">★ {trainerProfile.rating.toFixed(1)} ({trainerProfile.reviews_count} opiniones)</p> : null}
                  </div>
                </div>
                <AdField label="Categorías y servicios" value={trainerProfile.specialties.join(" · ") || "Añade tus categorías, subcategorías y servicios"} />
                <AdField label="Título del anuncio" value={trainerProfile.headline || "Añade un título que explique qué ofreces"} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <AdField label="Lugar" value={city?.name ?? trainerProfile.city_slug} />
                  <AdField label="Tarifa horaria" value={trainerProfile.price_from > 0 ? `${trainerProfile.price_from}€` : "Añade tu tarifa"} />
                </div>
              </section>
            </>
          ) : (
            <section className="rounded-[28px] border border-[#e2e2e2] bg-white p-8 text-center sm:p-14">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fff0ee] text-[#ff6868]"><Plus size={24} /></div>
              <h2 className="mt-5 font-heading text-2xl font-bold">Todavía no tienes anuncios</h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#666]">Crea tu primer anuncio para aparecer en el marketplace y empezar a recibir contactos.</p>
              <Link href="/mi-perfil" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#ff6868] px-5 py-3 text-sm font-bold text-white"><Plus size={16} /> Crear anuncio</Link>
            </section>
          )}
        </section>

        <aside className="h-fit rounded-[28px] border border-[#e2e2e2] bg-white p-5 sm:p-7 lg:sticky lg:top-6">
          {trainerProfile ? (
            <>
              <div className="flex justify-center"><Avatar name={trainerProfile.display_name} photoUrl={trainerProfile.photo_url} size="xl" /></div>
              <h2 className="mt-4 text-center font-heading text-2xl font-bold">{trainerProfile.display_name}</h2>
              {trainerProfile.reviews_count > 0 ? <p className="mt-2 text-center text-sm font-bold">★ {trainerProfile.rating.toFixed(1)} ({trainerProfile.reviews_count} opiniones)</p> : null}
              <p className="mt-6 flex items-center justify-between border-t border-[#ededed] pt-5 text-sm"><span>Tarifa horaria</span><strong className="text-2xl">{trainerProfile.price_from > 0 ? `${trainerProfile.price_from}€` : "—"}</strong></p>
              <div className="mt-6 grid gap-2">
                {canViewPublic ? (
                  <Link href={`/entrenadores/${trainerProfile.slug}`} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f5f5f5] px-4 py-3 text-sm font-bold"><Eye size={16} /> Vista pública</Link>
                ) : (
                  <span className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f5f5f5] px-4 py-3 text-sm font-bold text-[#777]"><Eye size={16} /> Vista disponible al publicar</span>
                )}
                <AdSidebarActions trainerId={trainerProfile.id} trainerSlug={trainerProfile.slug} canShare={canViewPublic} />
              </div>
            </>
          ) : <p className="text-sm leading-6 text-[#666]">Tu resumen aparecerá aquí cuando publiques tu primer anuncio.</p>}
        </aside>
      </div>
    </main>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return <div className="rounded-[20px] bg-[#292929] p-4"><Icon size={18} className="text-[#ffb4ac]" /><p className="mt-4 text-xs font-semibold leading-5 text-white/60">{label}</p><strong className="mt-1 block font-heading text-3xl">{value}</strong></div>;
}

function AdField({ label, value }: { label: string; value: string }) {
  return <div className="border-b border-[#ededed] py-5"><div className="flex items-center justify-between gap-4"><h3 className="text-sm font-bold text-[#ff6868]">{label}</h3><Link href="/mi-perfil" aria-label={`Editar ${label}`} className="text-[#ff6868] hover:text-[#17171b]"><PenLine size={16} /></Link></div><p className="mt-3 text-base font-semibold text-[#29292d]">{value}</p></div>;
}
