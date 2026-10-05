interface EmailConfirmableUser {
  email_confirmed_at?: string | null;
}

export function hasVerifiedEmail(user: EmailConfirmableUser | null | undefined) {
  return Boolean(user?.email_confirmed_at?.trim());
}

export function isSameOriginRequest(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}
