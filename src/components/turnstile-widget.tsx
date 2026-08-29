"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

interface TurnstileApi {
  render(
    container: HTMLElement,
    options: {
      sitekey: string;
      action: string;
      theme: "auto";
      size: "flexible";
      callback: (token: string) => void;
      "error-callback": () => void;
      "expired-callback": () => void;
      "timeout-callback": () => void;
    },
  ): string;
  remove(widgetId: string): void;
  reset(widgetId: string): void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

interface TurnstileWidgetProps {
  action: string;
  onToken: (token: string | null) => void;
  resetKey: number;
}

const TURNSTILE_SCRIPT = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

export function TurnstileWidget({ action, onToken, resetKey }: TurnstileWidgetProps) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onTokenRef = useRef(onToken);
  const previousResetKeyRef = useRef(resetKey);
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    onTokenRef.current = onToken;
  }, [onToken]);

  useEffect(() => {
    if (!siteKey || scriptReady) return;
    if (window.turnstile) {
      const readyTimeoutId = window.setTimeout(() => setScriptReady(true), 0);
      return () => window.clearTimeout(readyTimeoutId);
    }

    const intervalId = window.setInterval(() => {
      if (window.turnstile) {
        window.clearInterval(intervalId);
        setScriptReady(true);
      }
    }, 50);

    const timeoutId = window.setTimeout(() => window.clearInterval(intervalId), 10_000);
    return () => {
      window.clearInterval(intervalId);
      window.clearTimeout(timeoutId);
    };
  }, [scriptReady, siteKey]);

  useEffect(() => {
    if (!siteKey || !scriptReady || !containerRef.current || !window.turnstile) return;

    const clearToken = () => onTokenRef.current(null);
    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      action,
      theme: "auto",
      size: "flexible",
      callback: (token) => onTokenRef.current(token),
      "error-callback": clearToken,
      "expired-callback": clearToken,
      "timeout-callback": clearToken,
    });

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
      widgetIdRef.current = null;
    };
  }, [action, scriptReady, siteKey]);

  useEffect(() => {
    if (previousResetKeyRef.current === resetKey) return;
    previousResetKeyRef.current = resetKey;
    onTokenRef.current(null);
    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
    }
  }, [resetKey]);

  if (!siteKey) return null;

  return (
    <div className="min-h-16" aria-label="Verificación anti-bots">
      <Script src={TURNSTILE_SCRIPT} strategy="afterInteractive" onReady={() => setScriptReady(true)} />
      <div ref={containerRef} />
    </div>
  );
}
