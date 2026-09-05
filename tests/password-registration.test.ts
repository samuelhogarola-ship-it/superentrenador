import assert from "node:assert/strict";
import test from "node:test";
import {
  completePasswordRegistration,
  getPasswordRegistrationErrorMessage,
} from "../src/lib/auth";

test("password registration closes any session returned by Supabase", async () => {
  const calls: Array<{ name: string; value?: unknown }> = [];
  const auth = {
    async signUp(input: unknown) {
      calls.push({ name: "signUp", value: input });
      return {
        data: { user: { id: "trainer-user" }, session: { access_token: "secret" } },
        error: null,
      };
    },
    async signOut(input: unknown) {
      calls.push({ name: "signOut", value: input });
      return { error: null };
    },
  };

  const result = await completePasswordRegistration(auth, {
    email: "  TRAINER@example.com ",
    password: "valid-password",
    intent: "trainer",
    emailRedirectTo: "https://example.com/auth/callback?next=%2Fmi-perfil",
    captchaToken: "captcha",
  });

  assert.equal(result.error, null);
  assert.deepEqual(calls, [
    {
      name: "signUp",
      value: {
        email: "trainer@example.com",
        password: "valid-password",
        options: {
          emailRedirectTo: "https://example.com/auth/callback?next=%2Fmi-perfil",
          captchaToken: "captcha",
          data: { intent: "trainer" },
        },
      },
    },
    { name: "signOut", value: { scope: "local" } },
  ]);
});

test("password registration leaves the current session alone when confirmation is pending", async () => {
  let signedOut = false;
  const auth = {
    async signUp() {
      return { data: { user: { id: "trainer-user" }, session: null }, error: null };
    },
    async signOut() {
      signedOut = true;
      return { error: null };
    },
  };

  await completePasswordRegistration(auth, {
    email: "trainer@example.com",
    password: "valid-password",
    intent: "trainer",
    emailRedirectTo: "https://example.com/auth/callback?next=%2Fmi-perfil",
  });

  assert.equal(signedOut, false);
});

test("password registration returns safe Spanish errors", () => {
  assert.equal(
    getPasswordRegistrationErrorMessage("User already registered"),
    "Ya existe una cuenta con ese email. Inicia sesión.",
  );
  assert.equal(
    getPasswordRegistrationErrorMessage("Password should be at least 6 characters"),
    "La contraseña debe tener al menos 8 caracteres.",
  );
  assert.equal(
    getPasswordRegistrationErrorMessage("unexpected internal detail"),
    "No se pudo crear la cuenta. Inténtalo de nuevo.",
  );
});
