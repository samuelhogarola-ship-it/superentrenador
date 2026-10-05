import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { getBlogPost, listBlogPosts } from "@/lib/blog";
import { getCategoryTheme } from "@/lib/blog-theme";
import { siteConfig } from "@/lib/site";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return listBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {
      title: "Artículo no encontrado",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `${siteConfig.url}/blog/${post.slug}`,
      publishedTime: post.publishedAt,
      authors: [siteConfig.name],
    },
  };
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(iso),
  );
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const theme = getCategoryTheme(post.category);
  const related = listBlogPosts().filter((item) => item.slug !== post.slug).slice(0, 2);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    mainEntityOfPage: `${siteConfig.url}/blog/${post.slug}`,
  };

  return (
    <main className="w-full flex-1 bg-white text-[#111214]">
      <JsonLd data={jsonLd} />

      {/* Bold category band — the "which kind of article is this" signal */}
      <section className={`${theme.block} ${theme.onBlock}`}>
        <div className="mx-auto max-w-3xl px-6 pb-16 pt-14 sm:pb-20 sm:pt-20 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex w-fit items-center gap-2 text-sm font-semibold opacity-80 transition-opacity hover:opacity-100"
          >
            <ArrowLeft size={15} />
            Volver al blog
          </Link>
          <div className="mt-8 flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] opacity-80">
            <span>{post.category}</span>
            <span className="h-1 w-1 rounded-full bg-current" />
            <span>{post.audience}</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock size={13} />
              {post.readingMinutes} min
            </span>
          </div>
          <h1 className="mt-6 font-heading text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
            {post.title}
          </h1>
          <p className="mt-4 text-sm font-semibold opacity-70">{formatDate(post.publishedAt)}</p>
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-6 pb-8 pt-12 sm:px-8 sm:pt-16">
        <p className="text-xl leading-9 text-[#111214]">{post.hero}</p>

        <div className="mt-12 flex flex-col gap-11">
          {post.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-heading text-2xl font-bold text-[#111214] sm:text-3xl">
                {section.heading}
              </h2>
              <div className="mt-4 flex flex-col gap-4 text-base leading-8 text-[#3d3d42]">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className={`mt-14 border border-[#111214] p-8 sm:p-10 ${theme.block} ${theme.onBlock}`}>
          <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-80">Siguiente paso</p>
          <h2 className="mt-4 font-heading text-2xl font-bold leading-tight sm:text-3xl">
            Convierte esta guía en una decisión dentro del marketplace.
          </h2>
          <Link
            href={post.cta.href}
            className="mt-6 inline-flex items-center gap-2 border-2 border-current px-6 py-3 text-sm font-bold transition-opacity hover:opacity-80"
          >
            {post.cta.label}
            <ArrowRight size={15} />
          </Link>
        </div>
      </article>

      <section className="mx-auto max-w-3xl px-6 pb-24 pt-6 sm:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8a8a92]">Sigue leyendo</p>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          {related.map((item) => {
            const itemTheme = getCategoryTheme(item.category);
            return (
              <Link
                key={item.slug}
                href={`/blog/${item.slug}`}
                className="group flex flex-col border border-[#111214] transition-shadow hover:shadow-[6px_6px_0_0_#111214]"
              >
                <div className={`px-5 py-2.5 text-xs font-bold uppercase tracking-[0.16em] ${itemTheme.block} ${itemTheme.onBlock}`}>
                  {item.category}
                </div>
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <h3 className="font-heading text-lg font-bold leading-tight text-[#111214]">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-6 text-[#5b5b63]">{item.excerpt}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
