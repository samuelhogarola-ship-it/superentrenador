import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { getBlogPost, listBlogPosts } from "@/lib/blog";
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

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

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
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-4 py-8 md:px-6 md:py-10 lg:px-8">
      <JsonLd data={jsonLd} />
      <Link href="/blog" className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-[var(--muted)] hover:text-[var(--accent)]">
        <ArrowLeft size={15} />
        Volver al blog
      </Link>

      <article className="app-surface rounded-[30px] px-6 py-8 sm:px-10 sm:py-12">
        <header>
          <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent)]">
            <span>{post.category}</span>
            <span className="h-1 w-1 rounded-full bg-[var(--accent)]" />
            <span>{post.audience}</span>
            <span className="inline-flex items-center gap-1.5 text-[var(--muted)]">
              <Clock size={13} />
              {post.readingMinutes} min
            </span>
          </div>
          <h1 className="app-title mt-5 text-4xl leading-[1.02] text-[var(--text)] sm:text-6xl">
            {post.title}
          </h1>
          <p className="app-copy mt-5 text-lg">{post.hero}</p>
        </header>

        <div className="mt-10 flex flex-col gap-9">
          {post.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="app-title text-2xl text-[var(--text)]">{section.heading}</h2>
              <div className="app-copy mt-4 flex flex-col gap-4 text-base">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-10 rounded-[24px] bg-[var(--accent)] p-6 text-white sm:p-7">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/70">Siguiente paso</p>
          <h2 className="font-heading mt-3 text-2xl font-semibold leading-tight">
            Convierte esta guía en una decisión dentro del marketplace.
          </h2>
          <Link
            href={post.cta.href}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[var(--accent)] transition-colors hover:opacity-95"
          >
            {post.cta.label}
            <ArrowRight size={15} />
          </Link>
        </div>
      </article>

      <section className="grid gap-4 md:grid-cols-2">
        {related.map((item) => (
          <Link
            key={item.slug}
            href={`/blog/${item.slug}`}
            className="rounded-[22px] border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[var(--shadow-soft)] transition-colors hover:border-[var(--accent)]"
          >
            <p className="app-kicker">{item.category}</p>
            <h2 className="app-title mt-3 text-2xl text-[var(--text)]">{item.title}</h2>
            <p className="app-copy mt-2 text-sm">{item.excerpt}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
