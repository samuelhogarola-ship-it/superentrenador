import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { LibraryArticleBody } from "@/components/library-article-body";
import { createSocialMetadata } from "@/lib/site";
import { getWfBloggerPost } from "@/lib/wf-blogger";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/biblioteca/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getWfBloggerPost(slug);
  if (!post) return { title: "Contenido no encontrado" };
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/biblioteca/${post.slug}` },
    ...createSocialMetadata(post.title, post.description, `/biblioteca/${post.slug}`),
  };
}

export default async function LibraryPostPage({ params }: PageProps<"/biblioteca/[slug]">) {
  const { slug } = await params;
  const post = await getWfBloggerPost(slug);
  if (!post) notFound();

  return (
    <main className="w-full flex-1 bg-white text-[#111214]">
      <article className="mx-auto max-w-3xl px-6 py-14 sm:py-20">
        <Link href="/biblioteca" className="inline-flex items-center gap-2 text-sm font-bold underline underline-offset-4"><ArrowLeft size={16} /> Volver a la biblioteca</Link>
        <p className="mt-10 text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent)]">{post.category}</p>
        <h1 className="mt-4 font-heading text-4xl font-bold leading-tight sm:text-6xl">{post.title}</h1>
        <p className="mt-6 text-lg leading-8 text-[#5b5b63]">{post.description}</p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm text-[#8a8a92]">
          {post.date ? <time dateTime={post.date}>{new Intl.DateTimeFormat("es-ES", { dateStyle: "long" }).format(new Date(post.date))}</time> : null}
          <span>Edición: {post.author}</span>
        </div>
        <div className="mt-10 border-t border-[#111214]/15 pt-4">
          <LibraryArticleBody body={post.body} format={post.format} />
        </div>
      </article>
    </main>
  );
}
