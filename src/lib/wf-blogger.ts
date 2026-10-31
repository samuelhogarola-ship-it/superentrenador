import "server-only";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const SAFE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

export type WfBloggerPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  category: string;
  level: string;
  tags: string[];
  format: "markdown" | "html";
  body: string;
};

function contentRoot() {
  const configured = process.env.WF_BLOGGER_ROOT?.trim();
  return path.resolve(configured || path.join(process.cwd(), ".wf-blogger"));
}

function parsePost(source: string, fallbackSlug: string): WfBloggerPost | null {
  const match = source.match(FRONTMATTER);
  if (!match) return null;

  const meta: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    if (!line.trim() || line.trimStart().startsWith("#")) continue;
    const separator = line.indexOf(":");
    if (separator < 1) continue;
    meta[line.slice(0, separator).trim()] = line.slice(separator + 1).trim().replace(/^["']|["']$/g, "");
  }

  const slug = meta.slug || fallbackSlug;
  if (!SAFE_SLUG.test(slug) || meta.status !== "published" || !meta.title || !meta.description) return null;

  return {
    slug,
    title: meta.title,
    description: meta.description,
    date: meta.date || "",
    author: meta.author || "WF Studio",
    category: meta.category || "Guía",
    level: meta.level || "",
    tags: (meta.tags || "").split(",").map((tag) => tag.trim()).filter(Boolean),
    format: meta.content_format === "html" ? "html" : "markdown",
    body: match[2].trim(),
  };
}

export async function listWfBloggerPosts(): Promise<WfBloggerPost[]> {
  const postsDir = path.join(contentRoot(), "blog-posts");
  try {
    const files = (await readdir(postsDir)).filter((file) => file.endsWith(".md"));
    const posts = await Promise.all(files.map(async (file) => {
      const fallbackSlug = file.slice(0, -3);
      if (!SAFE_SLUG.test(fallbackSlug)) return null;
      return parsePost(await readFile(path.join(postsDir, file), "utf8"), fallbackSlug);
    }));
    return posts.filter((post): post is WfBloggerPost => post !== null)
      .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

export async function getWfBloggerPost(slug: string): Promise<WfBloggerPost | null> {
  if (!SAFE_SLUG.test(slug)) return null;
  const posts = await listWfBloggerPosts();
  return posts.find((post) => post.slug === slug) ?? null;
}
