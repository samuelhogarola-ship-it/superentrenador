export const PERSONAL_UMAMI_HOST =
  "https://analytics.187.124.55.36.sslip.io";
export const DEFAULT_SUPERENTRENADOR_UMAMI_WEBSITE_ID =
  "7fe51fc7-521e-45c4-b0d9-ea25d320fbc9";
export const SUPERENTRENADOR_UMAMI_DOMAINS =
  "superentrenador.com,www.superentrenador.com";

const WEBSITE_ID_PATTERN = /^[A-Za-z0-9_-]{8,128}$/;

type PersonalUmamiConfig = {
  hostUrl?: string;
  websiteId?: string;
};

export function resolvePersonalUmamiConfig(config: PersonalUmamiConfig) {
  const hostUrl =
    config.hostUrl?.replace(/\/$/, "") || PERSONAL_UMAMI_HOST;
  const websiteId =
    config.websiteId?.trim() || DEFAULT_SUPERENTRENADOR_UMAMI_WEBSITE_ID;

  if (
    hostUrl !== PERSONAL_UMAMI_HOST ||
    !WEBSITE_ID_PATTERN.test(websiteId)
  ) {
    return null;
  }

  return { hostUrl: PERSONAL_UMAMI_HOST, websiteId };
}
