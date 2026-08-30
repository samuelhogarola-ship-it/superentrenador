import Script from "next/script";
import {
  resolvePersonalUmamiConfig,
  SUPERENTRENADOR_UMAMI_DOMAINS,
} from "@/lib/umami-config";

/**
 * Umami is cookieless and stores no personal data, so unlike Google Analytics
 * it runs without a consent gate — that is the point of using it: we measure
 * every visit instead of only the ones that accept the cookie banner.
 *
 * Both env vars must be set for the script to render, which keeps local and
 * preview builds from polluting production stats.
 */
export function UmamiAnalytics() {
  const config = resolvePersonalUmamiConfig({
    hostUrl: process.env.NEXT_PUBLIC_UMAMI_URL,
    websiteId: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
  });
  if (!config) return null;

  return (
    <Script
      src={`${config.hostUrl}/script.js`}
      data-website-id={config.websiteId}
      data-domains={SUPERENTRENADOR_UMAMI_DOMAINS}
      strategy="afterInteractive"
    />
  );
}
