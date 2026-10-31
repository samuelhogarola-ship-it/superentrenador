import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const playwrightModule = process.env.PLAYWRIGHT_MODULE ?? "playwright";

let chromium;
try {
  ({ chromium } = require(playwrightModule));
} catch {
  throw new Error(
    `Playwright no está disponible. Instálalo en el proyecto o define PLAYWRIGHT_MODULE con su ruta (valor actual: ${playwrightModule}).`,
  );
}

const baseUrl = (process.env.SMOKE_BASE_URL ?? "http://127.0.0.1:3000").replace(/\/$/, "");
const executablePath = process.env.PLAYWRIGHT_EXECUTABLE_PATH;

async function assertAuthControls(page, path) {
  await page.goto(`${baseUrl}${path}`, { waitUntil: "load" });
  await page.getByRole("button", { name: "Continuar con Google", exact: true }).waitFor();
  await page.getByRole("textbox", { name: "Email", exact: true }).waitFor();

  const magicLinkLabel = path.startsWith("/registro")
    ? "Crear cuenta con magic link"
    : "Entrar con magic link";
  await page.getByRole("button", { name: magicLinkLabel, exact: true }).waitFor();

  const turnstile = page.getByLabel("Verificación anti-bots");
  if (await turnstile.count()) {
    await turnstile.locator('iframe[src*="challenges.cloudflare.com"]').waitFor({
      state: "attached",
      timeout: 15_000,
    });
  }

  const layout = await page.evaluate(() => ({
    viewportWidth: window.innerWidth,
    documentWidth: document.documentElement.scrollWidth,
  }));

  if (layout.documentWidth > layout.viewportWidth) {
    throw new Error(`${path} desborda horizontalmente: ${layout.documentWidth}px > ${layout.viewportWidth}px.`);
  }

  return layout;
}

async function run() {
  const browser = await chromium.launch({
    headless: true,
    ...(executablePath ? { executablePath } : {}),
  });
  const report = [];

  try {
    for (const viewport of [
      { width: 390, height: 844 },
      { width: 320, height: 700 },
    ]) {
      const page = await browser.newPage({ viewport });
      const loginLayout = await assertAuthControls(page, "/login");
      const registrationLayout = await assertAuthControls(page, "/registro?intent=trainer");
      report.push({ viewport, loginLayout, registrationLayout });
      await page.close();
    }

    if (process.env.SMOKE_SKIP_OAUTH !== "true") {
      const oauthPage = await browser.newPage({ viewport: { width: 1280, height: 900 } });
      await oauthPage.goto(`${baseUrl}/login`, { waitUntil: "load" });
      const googleButton = oauthPage.getByRole("button", { name: "Continuar con Google", exact: true });
      await googleButton.waitFor();
      await googleButton.click();
      await oauthPage.waitForURL(/accounts\.google\.com/, { timeout: 15_000 });
      report.push({ googleOAuthHost: new URL(oauthPage.url()).host });
      await oauthPage.close();
    }

    console.log(JSON.stringify({ ok: true, baseUrl, report }, null, 2));
  } finally {
    await browser.close();
  }
}

await run();
