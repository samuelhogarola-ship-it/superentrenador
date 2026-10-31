import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { getPasswordLoginErrorMessage } from "../src/lib/auth";

const loginSource = readFileSync(
  new URL("../src/components/login-page-client.tsx", import.meta.url),
  "utf8",
);

test("presents a simplified Google and magic-link login", () => {
  assert.doesNotMatch(loginSource, /type="password"/);
  assert.match(loginSource, /action="magic_link_login"/);
  assert.match(loginSource, /AuthAlternativeMethods/);
});

test("returns safe Spanish messages for password login failures", () => {
  assert.equal(getPasswordLoginErrorMessage("Invalid login credentials"), "Email o contraseña incorrectos.");
  assert.equal(
    getPasswordLoginErrorMessage("Email not confirmed"),
    "Tu email todavía no está confirmado. Revisa tu correo.",
  );
  assert.equal(
    getPasswordLoginErrorMessage("fetch failed"),
    "No se pudo conectar con el servicio de acceso. Inténtalo de nuevo.",
  );
  assert.equal(
    getPasswordLoginErrorMessage("unexpected internal detail"),
    "No se pudo iniciar sesión. Inténtalo de nuevo.",
  );
});
