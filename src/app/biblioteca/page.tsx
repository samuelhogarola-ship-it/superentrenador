import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, CookingPot, Dumbbell, MessagesSquare } from "lucide-react";
import { listBlogPosts } from "@/lib/blog";
import { createSocialMetadata } from "@/lib/site";
import { listWfBloggerPosts } from "@/lib/wf-blogger";

const DESCRIPTION = "Guías, rutinas, recetas y comunidad para alumnos y profesionales del entrenamiento.";

export const metadata: Metadata = {
  title: "Biblioteca de entrenamiento",
  description: DESCRIPTION,
  alternates: { canonical: "/biblioteca" },
  ...createSocialMetadata("Biblioteca de Superentrenador", DESCRIPTION, "/biblioteca"),
};

export const dynamic = "force-dynamic";

const AREAS = [
  { title: "Guías", description: "Criterios prácticos para elegir entrenador, empezar como profesional y entender la plataforma.", icon: BookOpen, status: "Disponible" },
  { title: "Rutinas", description: "Banco de rutinas organizado por objetivo, nivel, material y duración.", icon: Dumbbell, status: "En preparación" },
  { title: "Recetas", description: "Ideas culinarias claras, filtrables y sin promesas nutricionales engañosas.", icon: CookingPot, status: "En preparación" },
  { title: "Comunidad", description: "Debates y respuestas útiles entre alumnos, entrenadores y expertos verificados.", icon: MessagesSquare, status: "Próximamente" },
];

export default async function BibliotecaPage() {
  const [localPosts, bloggerPosts] = await Promise.all([Promise.resolve(listBlogPosts()), listWfBloggerPosts()]);

  return (
    <main className="w-full flex-1 bg-white text-[#111214]">
      <section className="mx-auto max-w-6xl px-6 pb-14 pt-16 sm:pt-24 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--accent)]">Biblioteca</p>
        <h1 className="mt-5 max-w-4xl font-heading text-4xl font-bold leading-tight sm:text-6xl">Aprende, aplica y comparte conocimiento útil.</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5b5b63]">Un único espacio para consultar guías, descubrir rutinas y recetas, y participar en la futura comunidad de Superentrenador.</p>
      </section>

      <section aria-label="Secciones de la biblioteca" className="mx-auto grid max-w-6xl gap-4 px-6 pb-16 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {AREAS.map(({ title, description, icon: Icon, status }) => (
          <article key={title} className="flex min-h-56 flex-col border border-[#111214]/15 bg-[#fafafa] p-6">
            <Icon className="text-[var(--accent)]" size={24} />
            <h2 className="mt-5 font-heading text-2xl font-bold">{title}</h2>
            <p className="mt-3 flex-1 text-sm leading-6 text-[#5b5b63]">{description}</p>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-[#8a8a92]">{status}</p>
          </article>
        ))}
      </section>

      {bloggerPosts.length > 0 ? (
        <section aria-labelledby="wf-studio-content" className="mx-auto max-w-6xl px-6 pb-16 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#111214] pb-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent)]">Contenido conectado</p>
              <h2 id="wf-studio-content" className="mt-2 font-heading text-3xl font-bold">Novedades de la biblioteca</h2>
            </div>
            <p className="text-sm text-[#5b5b63]">Publicado con WF-Blogger</p>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {bloggerPosts.slice(0, 6).map((post) => (
              <Link key={post.slug} href={`/biblioteca/${post.slug}`} className="group flex flex-col border border-[#111214]/15 p-6 hover:border-[#111214]">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent)]">{post.category}</p>
                <h3 className="mt-3 font-heading text-xl font-bold">{post.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-6 text-[#5b5b63]">{post.description}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold">Leer publicación <ArrowRight size={15} /></span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section aria-labelledby="guides-title" className="mx-auto max-w-6xl px-6 pb-20 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#111214] pb-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent)]">Lecturas verificadas</p>
            <h2 id="guides-title" className="mt-2 font-heading text-3xl font-bold">Guías de Superentrenador</h2>
          </div>
          <Link href="/blog" className="inline-flex items-center gap-2 font-bold underline underline-offset-4">Ver todas <ArrowRight size={16} /></Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {localPosts.slice(0, 6).map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group flex flex-col border border-[#111214]/15 p-6 hover:border-[#111214]">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent)]">{post.category}</p>
              <h3 className="mt-3 font-heading text-xl font-bold">{post.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-6 text-[#5b5b63]">{post.excerpt}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold">Leer guía <ArrowRight size={15} /></span>
            </Link>
          ))}
        </div>
        <p className="mt-8 text-sm text-[#5b5b63]">Edición y sistema de contenidos gestionados con WF Studio.</p>
      </section>
    </main>
  );
}
