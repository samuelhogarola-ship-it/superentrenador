import type { NextConfig } from "next";

const scriptSources = ["'self'", "'unsafe-inline'"];
if (process.env.NODE_ENV === "development") scriptSources.push("'unsafe-eval'");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async rewrites() {
    const coachStudioOrigin = process.env.COACH_STUDIO_ORIGIN;

    if (!coachStudioOrigin) return [];

    const destination = coachStudioOrigin.replace(/\/$/, "");

    return {
      beforeFiles: [
        {
          source: "/coach-studio",
          destination: `${destination}/coach-studio`,
        },
        {
          source: "/coach-studio/:path*",
          destination: `${destination}/coach-studio/:path*`,
        },
      ],
    };
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.superentrenador.com" }],
        destination: "https://superentrenador.com/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    const securityHeaders = [
      {
        key: "Content-Security-Policy",
        value: [
          "default-src 'self'",
          "base-uri 'self'",
          "frame-ancestors 'none'",
          "form-action 'self'",
          "img-src 'self' data: blob: https:",
          "font-src 'self' data:",
          "style-src 'self' 'unsafe-inline'",
          `script-src ${scriptSources.join(" ")}`,
          "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://accounts.google.com",
          "frame-src https://accounts.google.com",
          "upgrade-insecure-requests",
        ].join("; "),
      },
      { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
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
