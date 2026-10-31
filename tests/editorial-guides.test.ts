import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as blog from "../src/lib/blog";
import BlogPostPage, { generateMetadata } from "../src/app/blog/[slug]/page";
import { ContactPanel } from "../src/components/contact-panel";

test("every guide has a review date, primary sources and valid curated related posts", () => {
  const posts = blog.listBlogPosts();
  assert.equal(posts.length, 9);
  for (const post of posts) {
    assert.match(post.reviewedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(post.updatedAt >= post.publishedAt);
    assert.ok(post.sources.length > 0);
    assert.ok(post.sources.every((source) => source.href.startsWith("https://") || source.href === "/como-funciona"));
    const related = blog.getRelatedBlogPosts(post.slug);
    assert.equal(related.length, 2);
    assert.ok(related.every((item) => item.slug !== post.slug && posts.some((candidate) => candidate.slug === item.slug)));
  }
  const related = blog.getRelatedBlogPosts("necesito-ser-autonomo-entrenador-personal").map((post) => post.slug);
  assert.ok(related.includes("como-facturar-entrenador-personal"));
});

test("article renders linked sources and real modified date in metadata and JSON-LD", async () => {
  const slug = "necesito-ser-autonomo-entrenador-personal";
  const props = { params: Promise.resolve({ slug }) };
  const html = renderToStaticMarkup(await BlogPostPage(props));
  const metadata = await generateMetadata(props);
  assert.match(html, /Fuentes y revisión/);
  assert.match(html, /sede.agenciatributaria.gob.es/);
  assert.match(html, /dateModified.*2026-10-06/);
  assert.equal(metadata.openGraph?.modifiedTime, "2026-10-06");
  assert.equal(metadata.alternates?.canonical, `/blog/${slug}`);
});

test("contact panel preserves session or hourly units and does not offer a missing price as free", () => {
  const props = { yearsExperience: 2, modalities: ["Online"], languages: ["Español"], hiddenContactHint: "", trainerName: "Fixture", trainerSlug: "fixture", trainerProfileId: "fixture" };
  const render = (priceFrom: number, priceUnit: "hora" | "sesión") => renderToStaticMarkup(createElement(ContactPanel, { ...props, priceFrom, priceUnit }));
  assert.match(render(25, "sesión"), /sesión/);
  assert.match(render(30, "hora"), /hora/);
  assert.match(render(0, "sesión"), /Consultar precio/);
  assert.doesNotMatch(render(0, "sesión"), /0€/);
});

test("how it works offers both real entry points and states the service boundaries", async () => {
  const { default: HowItWorksPage } = await import("../src/app/como-funciona/page");
  const html = renderToStaticMarkup(createElement(HowItWorksPage));
  assert.match(html, /href="\/entrenadores"/);
  assert.match(html, /href="\/registro\?intent=trainer"/);
  assert.match(html, /Confirma tu correo/);
  assert.match(html, /Las ediciones también requieren revisión/);
  assert.match(html, /No procesa pagos de sesiones ni confirma reservas/);
});
