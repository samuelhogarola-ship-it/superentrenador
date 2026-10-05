/**
 * Weekly Umami report → docs/informes/YYYY-MM-DD.md
 *
 * Reads credentials from .umami.json (gitignored). Umami returns the previous
 * period alongside the current one when `compare=prev` is set, which is what
 * makes the report useful: a number without its trend says nothing.
 *
 * Usage:
 *   node scripts/informe-umami.mjs            # last 7 days
 *   node scripts/informe-umami.mjs --days 30
 *   node scripts/informe-umami.mjs --dry-run  # print to stdout, write nothing
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const CONFIG_PATH = path.join(ROOT, ".umami.json");

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const days = Number(args[args.indexOf("--days") + 1]) || 7;

function loadConfig() {
  try {
    const config = JSON.parse(readFileSync(CONFIG_PATH, "utf8"));
    for (const key of ["host", "websiteId", "token"]) {
      if (!config[key]) throw new Error(`falta "${key}"`);
    }
    return { ...config, host: config.host.replace(/\/$/, "") };
  } catch (error) {
    console.error(`No se pudo leer ${CONFIG_PATH}: ${error.message}`);
    console.error("Genera el fichero con host, websiteId y token antes de ejecutar este script.");
    process.exit(1);
  }
}

/**
 * Node does not read .env.local on its own, so without this the Resend key
 * would silently be missing and the report would never be emailed. Existing
 * environment variables win, so a value passed on the command line overrides
 * the file.
 */
function loadDotEnvLocal() {
  try {
    for (const line of readFileSync(path.join(ROOT, ".env.local"), "utf8").split("\n")) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
      if (!match) continue;
      const [, key, rawValue] = match;
      if (process.env[key] !== undefined) continue;
      process.env[key] = rawValue.trim().replace(/^["']|["']$/g, "");
    }
  } catch {
    // No .env.local is fine — the variables may come from the environment.
  }
}

loadDotEnvLocal();

const config = loadConfig();
const endAt = Date.now();
const startAt = endAt - days * 24 * 60 * 60 * 1000;

async function api(pathname, params = {}) {
  const url = new URL(`${config.host}/api/websites/${config.websiteId}${pathname}`);
  for (const [key, value] of Object.entries({ startAt, endAt, ...params })) {
    url.searchParams.set(key, String(value));
  }

  const response = await fetch(url, { headers: { Authorization: `Bearer ${config.token}` } });

  if (response.status === 401) {
    console.error("Token rechazado (401). Vuelve a generarlo e inténtalo de nuevo.");
    process.exit(1);
  }
  if (!response.ok) {
    throw new Error(`${pathname} devolvió ${response.status}`);
  }
  return response.json();
}

/** Umami returns either a plain number or {value, prev} depending on the endpoint. */
function current(metric) {
  return typeof metric === "object" && metric !== null ? (metric.value ?? 0) : (metric ?? 0);
}

function previous(metric) {
  return typeof metric === "object" && metric !== null ? (metric.prev ?? 0) : 0;
}

function trend(metric) {
  const now = current(metric);
  const before = previous(metric);
  if (!before) return now ? "nuevo" : "—";

  const change = ((now - before) / before) * 100;
  const arrow = change > 0 ? "▲" : change < 0 ? "▼" : "=";
  return `${arrow} ${Math.abs(change).toFixed(0)} %`;
}

function formatDuration(seconds) {
  if (!seconds) return "0s";
  const mins = Math.floor(seconds / 60);
  return mins ? `${mins}m ${Math.round(seconds % 60)}s` : `${Math.round(seconds)}s`;
}

function table(rows, [colName, colValue]) {
  if (!rows.length) return "_Sin datos en este periodo._\n";

  const lines = [`| ${colName} | ${colValue} |`, "|---|---|"];
  for (const row of rows) lines.push(`| ${row.x || "(directo)"} | ${row.y} |`);
  return lines.join("\n") + "\n";
}

const [stats, paths, referrers, countries, devices, events] = await Promise.all([
  api("/stats", { compare: "prev" }),
  api("/metrics", { type: "path", limit: 10 }),
  api("/metrics", { type: "referrer", limit: 10 }),
  api("/metrics", { type: "country", limit: 10 }),
  api("/metrics", { type: "device", limit: 10 }),
  api("/metrics", { type: "event", limit: 20 }),
]);

const visitors = current(stats.visitors);
const pageviews = current(stats.pageviews);
const visits = current(stats.visits);
const bounces = current(stats.bounces);
const totalTime = current(stats.totaltime);

const bounceRate = visits ? Math.round((bounces / visits) * 100) : 0;
const avgVisit = visits ? totalTime / visits : 0;

const until = new Date(endAt);
const from = new Date(startAt);
const fmt = (d) => d.toISOString().slice(0, 10);

// Conversions are the point of the report: pageviews say people arrived,
// these say the marketplace actually worked.
const FUNNEL = {
  "contacto-iniciar-sesion": "Pulsó contactar (login)",
  "contacto-crear-cuenta": "Pulsó crear cuenta",
  "mensaje-enviado": "Mensaje enviado a entrenador",
  "entrenador-publicar-anuncio": "Quiere publicar anuncio",
  "premium-cta": "Interés en Premium",
};

const eventCounts = new Map(events.map((e) => [e.x, e.y]));
const funnelRows = Object.entries(FUNNEL).map(([key, label]) => `| ${label} | ${eventCounts.get(key) ?? 0} |`);
const otherEvents = events.filter((e) => !(e.x in FUNNEL));

const report = `# Informe de estadísticas — Super Entrenador

**Periodo:** ${fmt(from)} → ${fmt(until)} (${days} días)
**Generado:** ${new Date().toISOString().slice(0, 16).replace("T", " ")}
**Fuente:** Umami (${config.host})

## Resumen

| Métrica | Valor | vs. periodo anterior |
|---|---|---|
| Visitantes únicos | ${visitors} | ${trend(stats.visitors)} |
| Visitas | ${visits} | ${trend(stats.visits)} |
| Páginas vistas | ${pageviews} | ${trend(stats.pageviews)} |
| Rebote | ${bounceRate} % | ${trend(stats.bounces)} |
| Tiempo medio por visita | ${formatDuration(avgVisit)} | — |

${visitors === 0 ? "> **Sin visitas registradas en este periodo.** Si acabas de instalar Umami o el despliegue aún no está en producción, esto es lo esperado.\n" : ""}
## Conversiones

Lo que de verdad indica si el marketplace funciona.

| Acción | Veces |
|---|---|
${funnelRows.join("\n")}

${otherEvents.length ? `### Otros eventos\n\n${table(otherEvents, ["Evento", "Veces"])}` : ""}
## Páginas más vistas

${table(paths, ["Página", "Vistas"])}
## De dónde llegan

${table(referrers, ["Origen", "Visitas"])}
## Países

${table(countries, ["País", "Visitas"])}
## Dispositivos

${table(devices, ["Dispositivo", "Visitas"])}
---

_Informe generado automáticamente. Umami no usa cookies, así que estos datos cubren todo el tráfico, no solo el que acepta el banner._
`;

if (dryRun) {
  console.log(report);
  process.exit(0);
}

const outDir = path.join(ROOT, "docs", "informes");
mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, `${fmt(until)}.md`);
writeFileSync(outFile, report, "utf8");

console.log(`Informe escrito en ${path.relative(ROOT, outFile)}`);
console.log(`${visitors} visitantes · ${pageviews} páginas vistas · ${bounceRate} % rebote`);

/**
 * Email delivery is opt-in: the file is always written, and the send only
 * happens when a key is present. That way a missing or revoked Resend key
 * degrades to "report on disk" instead of losing the run entirely.
 *
 * The key is read from the environment and never stored in this repo.
 */
const resendKey = process.env.RESEND_API_KEY;
const to = process.env.INFORME_TO || "info@webfuengirola.com";
const fromAddress = process.env.INFORME_FROM || "informes@webfuengirola.com";

if (!resendKey) {
  console.log("\nRESEND_API_KEY no definida: no se envía email (el fichero ya está guardado).");
  process.exit(0);
}

// Minimal markdown → HTML so the mail is readable without a renderer.
const html = report
  .replace(/^# (.*)$/gm, "<h1>$1</h1>")
  .replace(/^## (.*)$/gm, "<h2>$1</h2>")
  .replace(/^### (.*)$/gm, "<h3>$1</h3>")
  .replace(/^> (.*)$/gm, "<blockquote>$1</blockquote>")
  .replace(/^\|(.+)\|$/gm, (line) => {
    if (/^\|[\s|:-]+\|$/.test(line)) return "";
    const cells = line.slice(1, -1).split("|").map((c) => `<td style="padding:4px 10px;border:1px solid #ddd">${c.trim()}</td>`);
    return `<tr>${cells.join("")}</tr>`;
  })
  .replace(/(<tr>[\s\S]*?<\/tr>\n?)+/g, (rows) => `<table style="border-collapse:collapse;margin:10px 0">${rows}</table>`)
  .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
  .replace(/^_(.+)_$/gm, "<em>$1</em>")
  .replace(/^---$/gm, "<hr>")
  .replace(/\n{2,}/g, "\n<br>\n");

const subject = `Super Entrenador — ${visitors} visitantes (${fmt(from)} → ${fmt(until)})`;

const response = await fetch("https://api.resend.com/emails", {
  method: "POST",
  headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
  body: JSON.stringify({
    from: `Informes Super Entrenador <${fromAddress}>`,
    to: [to],
    subject,
    html: `<div style="font-family:system-ui,sans-serif;font-size:14px;line-height:1.6;color:#111">${html}</div>`,
    attachments: [{ filename: `informe-${fmt(until)}.md`, content: Buffer.from(report).toString("base64") }],
  }),
});

if (!response.ok) {
  const detail = await response.text();
  console.error(`\nNo se pudo enviar el email (${response.status}): ${detail.slice(0, 300)}`);
  console.error(`El dominio de "${fromAddress}" debe estar verificado en Resend.`);
  process.exit(1);
}

console.log(`Email enviado a ${to}`);
