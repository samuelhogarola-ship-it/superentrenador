const FALLBACK_PATH = "/dashboard";

export function getSafeInternalPath(value: string | null, fallback = FALLBACK_PATH) {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\") ||
    /[\u0000-\u001f\u007f]/.test(value)
  ) {
    return fallback;
  }

  return value;
}
