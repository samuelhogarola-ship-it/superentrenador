import Script from "next/script";

/**
 * Umami is cookieless and stores no personal data, so unlike Google Analytics
 * it runs without a consent gate — that is the point of using it: we measure
 * every visit instead of only the ones that accept the cookie banner.
 *
 * Both env vars must be set for the script to render, which keeps local and
 * preview builds from polluting production stats.
 */
export function UmamiAnalytics() {
  const host = process.env.NEXT_PUBLIC_UMAMI_URL;
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

  if (!host || !websiteId) return null;

  return (
    <Script
      src={`${host.replace(/\/$/, "")}/script.js`}
      data-website-id={websiteId}
      strategy="afterInteractive"
    />
  );
}
