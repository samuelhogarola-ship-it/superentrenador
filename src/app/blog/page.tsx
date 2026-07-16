import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock, Sparkles } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { listBlogPosts } from "@/lib/blog";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Guías para elegir entrenador personal, publicar perfiles fundadores y entender el marketplace de Super Entrenador.",
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogPage() {
  const posts = listBlogPosts();
  const featured = posts[0];
  const rest = posts.slice(1);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Blog de Super Entrenador",
    description: metadata.description,
    url: `${siteConfig.url}/blog`,
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      datePublished: post.publishedAt,
      url: `${siteConfig.url}/blog/${post.slug}`,
    })),
  };

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-6 md:px-6 md:py-8 lg:px-8">
      <JsonLd data={jsonLd} />
      <section className="premium-hero rounded-[32px] p-6 sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_340px] lg:items-end">
          <div>
            <p className="app-kicker inline-flex items-center gap-2">
              <BookOpen size={13} />
              Blog
            </p>
            <h1 className="app-title mt-4 max-w-4xl text-4xl leading-[1.02] text-[var(--text)] sm:text-6xl">
              Guías para elegir, comparar y vender entrenamiento personal.
            </h1>
            <p className="app-copy mt-5 max-w-2xl text-base">
              Contenido práctico para clientes que quieren decidir mejor y entrenadores que quieren publicar una ficha más clara antes del lanzamiento abierto.
            </p>
          </div>
          <aside className="premium-card rounded-[24px] p-5">
            <p className="app-kicker">Lanzamiento</p>
            <strong className="mt-4 block font-heading text-5xl text-[var(--text)]">{posts.length}</strong>
            <p className="app-copy mt-2 text-sm">guías iniciales para apoyar captación, SEO y confianza comercial.</p>
          </aside>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <Link
          href={`/blog/${featured.slug}`}
          className="group premium-card flex min-h-[360px] flex-col justify-between rounded-[28px] p-6 transition duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow)] sm:p-8"
        >
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent)]">
              <span>{featured.category}</span>
              <span className="h-1 w-1 rounded-full bg-[var(--accent)]" />
              <span>{featured.audience}</span>
            </div>
            <h2 className="app-title mt-5 max-w-3xl text-3xl text-[var(--text)] sm:text-5xl">
              {featured.title}
            </h2>
            <p className="app-copy mt-4 max-w-2xl text-base">{featured.excerpt}</p>
          </div>
          <span className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[var(--accent)]">
            Leer guía
            <ArrowRight size={15} />
          </span>
        </Link>

        <div className="grid gap-4">
          {rest.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group rounded-[22px] border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[var(--shadow-soft)] transition duration-200 hover:-translate-y-0.5 hover:border-[var(--line-strong)]"
            >
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-[var(--muted)]">
                <span className="inline-flex items-center gap-1.5 text-[var(--accent)]">
                  <Sparkles size={13} />
                  {post.category}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock size={13} />
                  {post.readingMinutes} min
                </span>
              </div>
              <h3 className="app-title mt-3 text-2xl text-[var(--text)]">{post.title}</h3>
              <p className="app-copy mt-2 text-sm">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
