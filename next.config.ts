import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";

/**
 * Umami is self-hosted on a separate origin, so both its script and the
 * beacons it posts back are blocked by our CSP unless that origin is
 * allowlisted. Derived from the same env var the component reads, so the
 * policy and the script tag cannot drift apart.
 */
export function getUmamiOrigin(rawUrl: string | undefined) {
  try {
    const url = new URL(rawUrl ?? "");
    return url.protocol === "https:" ? url.origin : null;
  } catch {
    return null;
  }
}

const umamiOrigin = getUmamiOrigin(process.env.NEXT_PUBLIC_UMAMI_URL);

const scriptSources = ["'self'", "'unsafe-inline'"];
scriptSources.push("https://www.googletagmanager.com");
if (umamiOrigin) scriptSources.push(umamiOrigin);
if (process.env.NODE_ENV === "development") scriptSources.push("'unsafe-eval'");

export function getSupabaseConnectSources(rawUrl: string | undefined, nodeEnv: string | undefined) {
  const sources: string[] = [];

  try {
    const supabaseUrl = new URL(rawUrl ?? "");
    if (supabaseUrl.protocol === "https:") {
      sources.push(supabaseUrl.origin, `wss://${supabaseUrl.host}`);
    } else if (nodeEnv === "development" && supabaseUrl.protocol === "http:") {
      sources.push(supabaseUrl.origin, `ws://${supabaseUrl.host}`);
    }
  } catch {
    // A missing URL is handled by the app's Supabase configuration checks.
  }

  return sources;
}

const supabaseConnectSources = getSupabaseConnectSources(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NODE_ENV,
);

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "*.supabase.in" },
    ],
    // Next.js defaults the optimizer's response to `Content-Disposition:
    // attachment` (an XSS guard aimed at SVGs). We don't allow SVG through
    // the optimizer, and on self-hosted deploys (no Vercel image CDN in
    // front) that default makes every next/image render blank — browsers
    // treat the response as a download instead of decoding it inline.
    contentDispositionType: "inline",
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.superentrenador.com" }],
        destination: "https://superentrenador.com/:path*",
        permanent: true,
      },
      {
        source: "/trainers/:slug",
        destination: "/entrenadores/:slug",
        permanent: true,
      },
      {
        source: "/app/pt",
        destination: "/dashboard",
        permanent: true,
      },
      {
        source: "/app/client",
        destination: "/dashboard",
        permanent: true,
      },
      {
        source: "/app/admin",
        destination: "/admin/entrenadores",
        permanent: true,
      },
    ];
  },
  async headers() {
    const contentSecurityPolicy = [
      "default-src 'self'",
      "base-uri 'self'",
      "frame-ancestors 'none'",
      "form-action 'self'",
      "img-src 'self' data: blob: https://*.supabase.co https://*.supabase.in",
      "font-src 'self' data:",
      "style-src 'self' 'unsafe-inline'",
      `script-src ${scriptSources.join(" ")}`,
      `connect-src ${["'self'", ...supabaseConnectSources, "https://accounts.google.com", "https://www.google-analytics.com", "https://*.google-analytics.com", ...(umamiOrigin ? [umamiOrigin] : [])].join(" ")}`,
      "frame-src https://accounts.google.com",
      ...(isProduction ? ["upgrade-insecure-requests"] : []),
    ].join("; ");

    const securityHeaders = [
      {
        key: "Content-Security-Policy",
        value: contentSecurityPolicy,
      },
      ...(isProduction
        ? [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }]
        : []),
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ];

    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
