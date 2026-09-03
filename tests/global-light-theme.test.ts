import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readSource = (path: string) =>
  readFile(new URL(`../${path}`, import.meta.url), "utf8");

function relativeLuminance(hex: string) {
  const channels = hex.match(/[a-f\d]{2}/gi)?.map((value) => parseInt(value, 16) / 255) ?? [];
  const linear = channels.map((value) =>
    value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
  );

  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

test("the application uses a light global canvas with scoped dark contrast blocks", async () => {
  const [css, layout, header, footer, login, register] = await Promise.all([
    readSource("src/app/globals.css"),
    readSource("src/app/layout.tsx"),
    readSource("src/components/site-header.tsx"),
    readSource("src/components/site-footer.tsx"),
    readSource("src/components/login-page-client.tsx"),
    readSource("src/components/registro-page-client.tsx"),
  ]);

  assert.match(css, /--bg:\s*#ffffff;/);
  assert.match(css, /--text:\s*#17171b;/);
  assert.match(css, /body\s*\{[^}]*background:\s*#ffffff;/s);
  assert.match(css, /\.theme-dark\s*\{[^}]*--bg:\s*#08090f;/s);
  assert.doesNotMatch(layout, /bg-\[var\(--bg\)\]/);

  for (const source of [header, footer, login, register]) {
    assert.match(source, /theme-dark/);
  }
});

test("the pink accent remains legible on the white canvas", async () => {
  const css = await readSource("src/app/globals.css");
  const accent = css.match(/:root\s*\{[^}]*--accent:\s*(#[a-f\d]{6});/is)?.[1] ?? "";
  const [red, green, blue] = accent.match(/[a-f\d]{2}/gi)?.map((value) => parseInt(value, 16)) ?? [];
  const contrastWithWhite = 1.05 / (relativeLuminance(accent) + 0.05);

  assert.ok(red > green && blue > green, `${accent} is not in the pink/red family`);
  assert.ok(contrastWithWhite >= 4.5, `${accent} has only ${contrastWithWhite.toFixed(2)}:1 contrast`);
});

test("loading skeletons remain visible on the white canvas", async () => {
  const css = await readSource("src/app/globals.css");
  const skeletonRule = css.match(/\.skeleton\s*\{([^}]*)\}/)?.[1] ?? "";
  const shimmerRule = css.match(/\.skeleton::after\s*\{([^}]*)\}/)?.[1] ?? "";

  assert.match(skeletonRule, /background:\s*#e[a-f\d]{5};/i);
  assert.match(shimmerRule, /rgba\(255,\s*255,\s*255,\s*0\.[1-9]/);
});
