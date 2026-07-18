import assert from "node:assert/strict";
import test from "node:test";
import { getSafeInternalPath } from "../src/lib/safe-navigation";

test("allows internal paths with query strings", () => {
  assert.equal(getSafeInternalPath("/entrenadores?city=malaga"), "/entrenadores?city=malaga");
});

test("rejects absolute and protocol-relative destinations", () => {
  assert.equal(getSafeInternalPath("https://example.com"), "/dashboard");
  assert.equal(getSafeInternalPath("//example.com"), "/dashboard");
});

test("rejects backslash and control-character URL confusion", () => {
  assert.equal(getSafeInternalPath("/\\example.com/path"), "/dashboard");
  assert.equal(getSafeInternalPath("/path\nnext"), "/dashboard");
});

test("uses the requested fallback", () => {
  assert.equal(getSafeInternalPath(null, "/"), "/");
});
