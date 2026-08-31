type AuthResult = { error: unknown | null };

export interface EmailAuthCallbackClient {
  verifyOtp(params: { token_hash: string; type: "email" }): Promise<AuthResult>;
  exchangeCodeForSession(code: string): Promise<AuthResult>;
}

export type EmailAuthCallbackResult =
  | { ok: true; flow: "magic-link" | "pkce" }
  | { ok: false; flow: "magic-link" | "pkce" | "invalid" };

export async function completeEmailAuthCallback(
  auth: EmailAuthCallbackClient,
  searchParams: URLSearchParams,
): Promise<EmailAuthCallbackResult> {
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");

  if (tokenHash && type === "email") {
    const { error } = await auth.verifyOtp({ token_hash: tokenHash, type: "email" });
    return { ok: !error, flow: "magic-link" };
  }

  const code = searchParams.get("code");
  if (code) {
    const { error } = await auth.exchangeCodeForSession(code);
    return { ok: !error, flow: "pkce" };
  }

  return { ok: false, flow: "invalid" };
}
