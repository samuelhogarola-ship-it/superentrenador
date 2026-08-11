"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const GA_MEASUREMENT_ID = "G-XP5C05LFL5";
const STORAGE_KEY = "super-entrenador-cookie-consent";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [analyticsAccepted, setAnalyticsAccepted] = useState(false);
  const [gtagReady, setGtagReady] = useState(false);
  const previousPageLocation = useRef<string | null>(null);

  useEffect(() => {
    const updateConsent = () => {
      setAnalyticsAccepted(window.localStorage.getItem(STORAGE_KEY) === "analytics");
    };

    updateConsent();
    window.addEventListener("super-entrenador-cookie-consent", updateConsent);
    window.addEventListener("storage", updateConsent);

    return () => {
      window.removeEventListener("super-entrenador-cookie-consent", updateConsent);
      window.removeEventListener("storage", updateConsent);
    };
  }, []);

  useEffect(() => {
    if (!analyticsAccepted || !gtagReady || !window.gtag) return;

    const search = searchParams.toString();
    const pagePath = search ? `${pathname}?${search}` : pathname;

    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: pagePath,
      page_location: window.location.href,
      page_referrer: previousPageLocation.current ?? document.referrer,
      page_title: document.title,
    });

    previousPageLocation.current = window.location.href;
  }, [analyticsAccepted, gtagReady, pathname, searchParams]);

  if (!analyticsAccepted) return null;

  return (
    <>
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
        `}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
        onReady={() => setGtagReady(true)}
      />
    </>
  );
}
