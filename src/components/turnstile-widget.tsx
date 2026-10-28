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
      size: "compact" | "flexible";
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

export function getTurnstileSize(containerWidth: number): "compact" | "flexible" {
  return containerWidth < 300 ? "compact" : "flexible";
}

export function shouldRerenderTurnstile(
  currentSize: "compact" | "flexible" | null,
  containerWidth: number,
) {
  return currentSize !== getTurnstileSize(containerWidth);
}

export function TurnstileWidget({ action, onToken, resetKey }: TurnstileWidgetProps) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const widgetSizeRef = useRef<"compact" | "flexible" | null>(null);
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

    const container = containerRef.current;
    const turnstile = window.turnstile;
    const clearToken = () => onTokenRef.current(null);
    const renderForWidth = (width: number) => {
      if (!shouldRerenderTurnstile(widgetSizeRef.current, width)) return;

      if (widgetIdRef.current) {
        turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }

      clearToken();
      const size = getTurnstileSize(width);
      widgetSizeRef.current = size;
      widgetIdRef.current = turnstile.render(container, {
        sitekey: siteKey,
        action,
        theme: "auto",
        size,
        callback: (token) => onTokenRef.current(token),
        "error-callback": clearToken,
        "expired-callback": clearToken,
        "timeout-callback": clearToken,
      });
    };

    renderForWidth(container.getBoundingClientRect().width);
    const resizeObserver = new ResizeObserver(([entry]) => {
      renderForWidth(entry?.contentRect.width ?? container.getBoundingClientRect().width);
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      if (widgetIdRef.current) {
        turnstile.remove(widgetIdRef.current);
      }
      widgetIdRef.current = null;
      widgetSizeRef.current = null;
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
      <div ref={containerRef} className="flex justify-center" />
    </div>
  );
}
