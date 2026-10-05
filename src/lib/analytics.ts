/**
 * Umami event tracking that stays silent when the script is absent.
 *
 * The script only loads when both Umami env vars are set, so in local and
 * preview builds `window.umami` is undefined — analytics must never be the
 * reason a conversion flow throws.
 *
 * Prefer `data-umami-event` attributes for plain link and button clicks; use
 * this helper when the event depends on runtime state (a request succeeded)
 * or needs typed, non-string values.
 */
declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: Record<string, string | number | boolean>) => void;
    };
  }
}

export function trackEvent(name: string, data?: Record<string, string | number | boolean>) {
  if (typeof window === "undefined") return;

  try {
    window.umami?.track(name, data);
  } catch {
    // Never let a broken analytics call surface to the user.
  }
}
