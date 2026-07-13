import playwright from "/Users/sam/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.js";
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";

const { chromium } = playwright;

function readEnv(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const env = {};
  for (const rawLine of content.split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    env[line.slice(0, eq)] = line.slice(eq + 1);
  }
  return env;
}

const env = readEnv(path.join(process.cwd(), ".env.local"));
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const baseUrl = "http://127.0.0.1:3000";
const email = `codex-smoke-${Date.now()}@example.com`;
const password = "codex123";

async function ensureDisposableUser() {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) throw error;
  return data.user.id;
}

async function cleanupUser(userId) {
  if (!userId) return;
  await supabase.auth.admin.deleteUser(userId);
}

async function run() {
  let userId = null;
  let browser = null;
  const report = [];

  try {
    userId = await ensureDisposableUser();
    report.push(`user-created:${email}`);

    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });

    await page.goto(baseUrl, { waitUntil: "networkidle" });
    report.push(`home-title:${await page.title()}`);
    report.push(`home-h1:${(await page.locator("h1").first().textContent())?.trim() ?? ""}`);

    await page.goto(`${baseUrl}/login`, { waitUntil: "networkidle" });
    await page.getByLabel("Email").fill("nobody@example.com");
    await page.getByLabel("Contraseña").fill("wrongpass");
    await page.getByRole("button", { name: /iniciar sesión/i }).click();
    await page.waitForTimeout(1200);
    report.push(`invalid-login-error:${await page.getByText("Email o contraseña incorrectos.").count() > 0}`);

    await page.goto(`${baseUrl}/registro`, { waitUntil: "networkidle" });
    await page.getByLabel("Email").fill(`mismatch-${Date.now()}@example.com`);
    await page.getByLabel("Contraseña", { exact: true }).fill("codex123");
    await page.getByLabel("Confirmar contraseña").fill("codex999");
    await page.getByRole("button", { name: /crear cuenta gratis/i }).click();
    await page.waitForTimeout(400);
    report.push(`registro-mismatch-error:${await page.getByText("Las contraseñas no coinciden.").count() > 0}`);

    await page.goto(`${baseUrl}/login`, { waitUntil: "networkidle" });
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Contraseña", { exact: true }).fill(password);
    await page.getByRole("button", { name: /iniciar sesión/i }).click();
    await page.waitForURL(/\/mi-perfil/, { timeout: 15000 });
    await page.waitForLoadState("networkidle");
    report.push(`login-redirect:${page.url()}`);

    const logoutButton = page.getByRole("button", { name: /cerrar sesión/i }).first();
    report.push(`logout-button-visible:${await logoutButton.isVisible()}`);
    await logoutButton.click();
    await page.waitForURL(baseUrl + "/", { timeout: 15000 });
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1200);
    report.push(`post-logout-url:${page.url()}`);
    report.push(`header-login-visible:${await page.getByRole("link", { name: /iniciar sesión/i }).count() > 0}`);
    report.push(`header-mi-perfil-visible:${await page.getByRole("link", { name: /mi perfil/i }).count() > 0}`);

    console.log(JSON.stringify({ ok: true, report }, null, 2));
  } catch (error) {
    console.error(JSON.stringify({ ok: false, report, error: String(error) }, null, 2));
    process.exitCode = 1;
  } finally {
    if (browser) await browser.close().catch(() => {});
    await cleanupUser(userId).catch(() => {});
  }
}

await run();
