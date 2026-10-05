import assert from "node:assert/strict";
import test from "node:test";

type RequestSecurityModule = {
  hasVerifiedEmail?: (user: { email_confirmed_at?: string | null } | null | undefined) => boolean;
  isSameOriginRequest?: (request: Request) => boolean;
};

async function loadRequestSecurity(): Promise<RequestSecurityModule> {
  return import("../src/lib/server/request-security").catch(() => ({}));
}

test("accepts mutating requests from the request URL origin", async () => {
  const { isSameOriginRequest } = await loadRequestSecurity();
  assert.equal(typeof isSameOriginRequest, "function");

  const request = new Request("https://superentrenador.com/api/messages", {
    method: "POST",
    headers: { origin: "https://superentrenador.com" },
  });

  assert.equal(isSameOriginRequest?.(request), true);
});

test("rejects cross-origin and origin-less mutating requests", async () => {
  const { isSameOriginRequest } = await loadRequestSecurity();
  assert.equal(typeof isSameOriginRequest, "function");

  const crossOrigin = new Request("https://superentrenador.com/api/messages", {
    method: "POST",
    headers: { origin: "https://attacker.example" },
  });
  const missingOrigin = new Request("https://superentrenador.com/api/messages", { method: "POST" });

  assert.equal(isSameOriginRequest?.(crossOrigin), false);
  assert.equal(isSameOriginRequest?.(missingOrigin), false);
});

test("recognizes only users with a confirmed email", async () => {
  const { hasVerifiedEmail } = await loadRequestSecurity();
  assert.equal(typeof hasVerifiedEmail, "function");

  assert.equal(hasVerifiedEmail?.({ email_confirmed_at: "2026-08-19T12:00:00.000Z" }), true);
  assert.equal(hasVerifiedEmail?.({ email_confirmed_at: null }), false);
  assert.equal(hasVerifiedEmail?.({}), false);
  assert.equal(hasVerifiedEmail?.(null), false);
});
