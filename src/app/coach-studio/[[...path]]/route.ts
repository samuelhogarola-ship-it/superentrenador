import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { NextResponse } from "next/server";

const PUBLIC_DIR = join(process.cwd(), "public", "coach-studio");

const CONTENT_TYPES: Record<string, string> = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".webp": "image/webp",
};

type RouteContext = {
  params: Promise<{ path?: string[] }>;
};

function getContentType(filePath: string) {
  return CONTENT_TYPES[extname(filePath)] ?? "application/octet-stream";
}

function getCacheControl(filePath: string) {
  const extension = extname(filePath);
  if (filePath.endsWith("sw.js") || extension === ".html" || extension === ".webmanifest") {
    return "no-store, must-revalidate";
  }

  return "public, max-age=31536000, immutable";
}

function resolvePublicPath(pathSegments: string[]) {
  const requestedPath = pathSegments.length > 0 ? pathSegments.join("/") : "index.html";
  const safePath = normalize(requestedPath).replace(/^(\.\.(\/|\\|$))+/, "");
  return join(PUBLIC_DIR, safePath);
}

async function readCoachStudioFile(filePath: string) {
  const normalized = normalize(filePath);
  if (!normalized.startsWith(PUBLIC_DIR)) {
    return null;
  }

  try {
    return await readFile(normalized);
  } catch {
    return null;
  }
}

export async function GET(_request: Request, context: RouteContext) {
  const { path = [] } = await context.params;
  const filePath = resolvePublicPath(path);
  const file = await readCoachStudioFile(filePath);

  if (file) {
    return new NextResponse(file, {
      headers: {
        "Cache-Control": getCacheControl(filePath),
        "Content-Type": getContentType(filePath),
      },
    });
  }

  const indexPath = join(PUBLIC_DIR, "index.html");
  const indexFile = await readCoachStudioFile(indexPath);

  if (!indexFile) {
    return new NextResponse("Coach Studio build not found", { status: 404 });
  }

  return new NextResponse(indexFile, {
    headers: {
      "Cache-Control": "no-store, must-revalidate",
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
