import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Avatar } from "../src/components/avatar";
import * as coverageModule from "../src/lib/coverage";
import { publicTrainerProfiles } from "../src/lib/marketplace-data";
import { trainerProfileJsonLd } from "../src/lib/marketplace-seo";
import * as trainerRepository from "../src/lib/repositories/trainers";
import * as siteModule from "../src/lib/site";
import type { MarketplaceCity } from "../src/types/marketplace";

test("trainer structured data omits an Offer when the public price is unknown", () => {
  const jsonLd = trainerProfileJsonLd({ ...publicTrainerProfiles[0], priceFrom: 0 });

  assert.equal("makesOffer" in jsonLd, false);
});

test("trainer structured data describes the visible price unit when an Offer exists", () => {
  const jsonLd = trainerProfileJsonLd({ ...publicTrainerProfiles[0], priceFrom: 50, priceUnit: "hora" });

  assert.deepEqual(jsonLd.makesOffer?.priceSpecification, {
    "@type": "UnitPriceSpecification",
    price: 50,
    priceCurrency: "EUR",
    unitText: "HOUR",
  });
});

test("Andalucía SEO exposes only cities that have published trainer supply", () => {
  const getActiveAndaluciaCities = (
    coverageModule as unknown as Record<string, unknown>
  ).getActiveAndaluciaCities as
    | ((cities: MarketplaceCity[], trainers: typeof publicTrainerProfiles) => MarketplaceCity[])
    | undefined;
  assert.equal(typeof getActiveAndaluciaCities, "function");

  const cities: MarketplaceCity[] = [
    {
      slug: "fuengirola",
      name: "Fuengirola",
      region: "Málaga",
      country: "España",
      heroTitle: "Fuengirola",
      intro: "",
      seoDescription: "",
    },
    {
      slug: "sevilla",
      name: "Sevilla",
      region: "Sevilla",
      country: "España",
      heroTitle: "Sevilla",
      intro: "",
      seoDescription: "",
    },
    {
      slug: "madrid",
      name: "Madrid",
      region: "Comunidad de Madrid",
      country: "España",
      heroTitle: "Madrid",
      intro: "",
      seoDescription: "",
    },
  ];

  assert.deepEqual(
    getActiveAndaluciaCities!(cities, publicTrainerProfiles).map((city) => city.slug),
    ["fuengirola"],
  );
});

test("canonical site URLs are normalized to a single origin", () => {
  const normalizeSiteUrl = (
    siteModule as unknown as Record<string, unknown>
  ).normalizeSiteUrl as ((value: string) => string) | undefined;
  assert.equal(typeof normalizeSiteUrl, "function");
  assert.equal(normalizeSiteUrl!("https://superentrenador.com/"), "https://superentrenador.com");
  assert.equal(normalizeSiteUrl!("https://superentrenador.com/preview"), "https://superentrenador.com");
  assert.throws(
    () => (normalizeSiteUrl as (value: string, nodeEnv: string) => string)("https://preview.example.com", "production"),
    /canonical production origin/i,
  );
  assert.throws(
    () => (normalizeSiteUrl as (value: string, nodeEnv: string) => string)("http://superentrenador.com", "production"),
    /canonical production origin/i,
  );
});

test("page-specific social metadata never inherits the homepage URL or title", () => {
  const createSocialMetadata = (
    siteModule as unknown as Record<string, unknown>
  ).createSocialMetadata as
    | ((title: string, description: string, path: string) => {
        openGraph: { title: string; description: string; url: string; type: string };
        twitter: { card: string; title: string; description: string };
      })
    | undefined;
  assert.equal(typeof createSocialMetadata, "function");

  assert.deepEqual(createSocialMetadata!("Blog", "Guías", "/blog"), {
    openGraph: {
      type: "website",
      title: "Blog",
      description: "Guías",
      url: "https://superentrenador.com/blog",
      siteName: "Super Entrenador",
    },
    twitter: {
      card: "summary_large_image",
      title: "Blog",
      description: "Guías",
    },
  });
});

test("repository query failures throw instead of masquerading as empty SEO content", () => {
  const requireRepositoryData = (
    trainerRepository as unknown as Record<string, unknown>
  ).requireRepositoryData as
    | (<T>(operation: string, data: T | null, error: unknown) => T)
    | undefined;
  assert.equal(typeof requireRepositoryData, "function");
  assert.deepEqual(requireRepositoryData!("list", ["ok"], null), ["ok"]);
  assert.throws(
    () => requireRepositoryData!("list", null, { message: "temporary database failure" }),
    /list failed/,
  );
});

test("trainer photos use Next image optimization with intrinsic dimensions", () => {
  const markup = renderToStaticMarkup(
    createElement(Avatar, {
      name: "Samuel Irongar",
      photoUrl: "/logo.png",
      size: "xl",
    }),
  );

  assert.match(markup, /\/_next\/image\?url=/);
  assert.match(markup, /width="112"/);
  assert.match(markup, /height="112"/);
});
