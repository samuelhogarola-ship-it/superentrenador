import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { listBlogPosts } from "@/lib/blog";
import { getCategoryTheme } from "@/lib/blog-theme";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Guías para elegir entrenador personal, publicar perfiles que convierten y entender el marketplace de Super Entrenador.",
  alternates: {
    canonical: "/blog",
  },
};

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(iso),
  );
}

export default function BlogPage() {
  const posts = listBlogPosts();
  const featured = posts[0];
  const rest = posts.slice(1);
  const featuredTheme = getCategoryTheme(featured.category);

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
    <main className="w-full flex-1 bg-white text-[#111214]">
      <JsonLd data={jsonLd} />

      <section className="mx-auto max-w-6xl px-6 pb-16 pt-20 sm:pb-20 sm:pt-28 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#8a8a92]">Blog</p>
        <h1 className="mt-6 max-w-3xl font-heading text-5xl font-bold leading-[1.04] tracking-tight text-[#111214] sm:text-6xl lg:text-7xl">
          Guías claras para elegir, publicar y trabajar como entrenador personal.
        </h1>
        <p className="mt-7 max-w-xl text-lg leading-8 text-[#5b5b63]">
          Sin relleno. Artículos concretos para clientes que quieren decidir mejor y entrenadores que
          quieren construir un negocio serio.
        </p>
      </section>

      {/* Featured article — full-bleed square card, bold category block */}
      <section className="mx-auto max-w-6xl px-6 pb-8 lg:px-8">
        <Link
          href={`/blog/${featured.slug}`}
          className="group grid overflow-hidden border border-[#111214] transition-shadow hover:shadow-[8px_8px_0_0_#111214] lg:grid-cols-[380px_1fr]"
        >
          <div className={`flex flex-col justify-between p-8 sm:p-10 ${featuredTheme.block} ${featuredTheme.onBlock}`}>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-80">Destacado</p>
              <p className="mt-4 text-2xl font-bold leading-tight">{featured.category}</p>
            </div>
            <p className="mt-10 inline-flex items-center gap-2 text-sm font-semibold opacity-90">
              <Clock size={14} />
              {featured.readingMinutes} min de lectura
            </p>
          </div>
          <div className="flex flex-col justify-center gap-4 border-t border-[#111214] p-8 sm:p-10 lg:border-l lg:border-t-0">
            <h2 className="font-heading text-3xl font-bold leading-[1.08] text-[#111214] sm:text-4xl">
              {featured.title}
            </h2>
            <p className="max-w-2xl text-base leading-7 text-[#5b5b63]">{featured.excerpt}</p>
            <span className="mt-4 inline-flex w-fit items-center gap-2 border-b-2 border-[#111214] pb-1 text-sm font-bold text-[#111214]">
              Leer artículo
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </Link>
      </section>

      {/* Rest — square cards, 2-column, each with its own category block */}
      <section className="mx-auto max-w-6xl px-6 pb-24 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2">
          {rest.map((post) => {
            const theme = getCategoryTheme(post.category);
            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col border border-[#111214] transition-shadow hover:shadow-[6px_6px_0_0_#111214]"
              >
                <div className={`flex items-center justify-between px-6 py-3 ${theme.block} ${theme.onBlock}`}>
                  <span className="text-xs font-bold uppercase tracking-[0.16em]">{post.category}</span>
                  <span className="text-xs font-semibold opacity-80">{formatDate(post.publishedAt)}</span>
                </div>
                <div className="flex flex-1 flex-col gap-3 p-6 sm:p-7">
                  <h3 className="font-heading text-2xl font-bold leading-tight text-[#111214]">
                    {post.title}
                  </h3>
                  <p className="flex-1 text-sm leading-6 text-[#5b5b63]">{post.excerpt}</p>
                  <div className="mt-2 flex items-center justify-between text-xs font-semibold text-[#8a8a92]">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock size={13} />
                      {post.readingMinutes} min
                    </span>
                    <span className={`inline-flex items-center gap-1.5 font-bold ${theme.text} opacity-0 transition-opacity group-hover:opacity-100`}>
                      Leer
                      <ArrowRight size={13} />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
