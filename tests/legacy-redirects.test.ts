import assert from "node:assert/strict";
import test from "node:test";
import nextConfig from "../next.config";

test("redirects legacy marketplace and app routes", async () => {
  const redirects = await nextConfig.redirects?.();

  assert.ok(Array.isArray(redirects));
  assert.deepEqual(
    redirects
      .filter((redirect) => redirect.source.startsWith("/trainers") || redirect.source.startsWith("/app/"))
      .map(({ source, destination, permanent }) => ({ source, destination, permanent })),
    [
      { source: "/trainers/:slug", destination: "/entrenadores/:slug", permanent: true },
      { source: "/app/pt", destination: "/dashboard", permanent: true },
      { source: "/app/client", destination: "/dashboard", permanent: true },
      { source: "/app/admin", destination: "/admin/entrenadores", permanent: true },
    ],
  );
});
