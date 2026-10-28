import assert from "node:assert/strict";
import test from "node:test";
import * as callbackModule from "../src/lib/email-auth-callback";

const { completeEmailAuthCallback } = callbackModule;

type Call =
  | { method: "verifyOtp"; payload: { token_hash: string; type: "email" } }
  | { method: "exchangeCodeForSession"; code: string };

function authDouble(error: Error | null = null) {
  const calls: Call[] = [];

  return {
    calls,
    auth: {
      async verifyOtp(payload: { token_hash: string; type: "email" }) {
        calls.push({ method: "verifyOtp", payload });
        return { error };
      },
      async exchangeCodeForSession(code: string) {
        calls.push({ method: "exchangeCodeForSession", code });
        return { error };
      },
    },
  };
}

test("completes a magic link from TokenHash without requiring a PKCE verifier", async () => {
  const fake = authDouble();
  const params = new URLSearchParams("token_hash=fresh-token&type=email");

  const result = await completeEmailAuthCallback(fake.auth, params);

  assert.deepEqual(result, { ok: true, flow: "magic-link" });
  assert.deepEqual(fake.calls, [
    {
      method: "verifyOtp",
      payload: { token_hash: "fresh-token", type: "email" },
    },
  ]);
});

test("keeps PKCE code exchange for OAuth and previously issued links", async () => {
  const fake = authDouble();
  const params = new URLSearchParams("code=legacy-code");

  const result = await completeEmailAuthCallback(fake.auth, params);

  assert.deepEqual(result, { ok: true, flow: "pkce" });
  assert.deepEqual(fake.calls, [
    { method: "exchangeCodeForSession", code: "legacy-code" },
  ]);
});

test("does not consume recovery tokens in the magic-link callback", async () => {
  const fake = authDouble();
  const params = new URLSearchParams("token_hash=recovery-token&type=recovery");

  const result = await completeEmailAuthCallback(fake.auth, params);

  assert.deepEqual(result, { ok: false, flow: "invalid" });
  assert.deepEqual(fake.calls, []);
});

test("returns a safe failure when Supabase rejects the token", async () => {
  const fake = authDouble(new Error("expired token containing sensitive detail"));
  const params = new URLSearchParams("token_hash=expired&type=email");

  const result = await completeEmailAuthCallback(fake.auth, params);

  assert.deepEqual(result, { ok: false, flow: "magic-link" });
  assert.equal("error" in result, false);
});

test("applies only a validated registration intent to the OAuth user", async () => {
  const applyAuthIntent = (
    callbackModule as unknown as Record<string, unknown>
  ).applyAuthIntent as
    | ((auth: { updateUser(input: { data: { intent: "client" | "trainer" } }): Promise<{ error: unknown }> }, intent: string | null) => Promise<boolean>)
    | undefined;
  assert.equal(typeof applyAuthIntent, "function");

  const updates: unknown[] = [];
  const auth = {
    async updateUser(input: { data: { intent: "client" | "trainer" } }) {
      updates.push(input);
      return { error: null };
    },
  };

  assert.equal(await applyAuthIntent!(auth, "trainer"), true);
  assert.equal(await applyAuthIntent!(auth, "administrator"), false);
  assert.deepEqual(updates, [{ data: { intent: "trainer" } }]);
});
