import { chromium } from "playwright";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROUTES = [
  "/",
  "/about",
  "/contact",
  "/solution",
  "/news",
  "/how-we-work",
  "/solutions/home-and-housing-societies",
  "/solutions/office-and-workplace",
  "/solutions/public-places",
  "/solutions/fleet-organization",
  "/hrms",
  "/education",
  "/health",
  "/job",
  "/charger",
  "/e-com",
  "/park",
  "/food",
  "/crm",
  "/privacy-policy",
  "/terms-conditions",
  "/industrialsupport",
  "/cancellation-policy",
  "/shipping-policy",
];

const DIST_DIR = path.resolve(process.env.PRERENDER_DIST_DIR || "dist");
const PREVIEW_PORT = process.env.PRERENDER_PORT || "4173";
const BASE_URL = `http://127.0.0.1:${PREVIEW_PORT}`;

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeHtmlForRoute(route, html) {
  if (route === "/") {
    fs.writeFileSync(path.join(DIST_DIR, "index.html"), html, "utf8");
    return;
  }
  const dir = path.join(DIST_DIR, route.replace(/^\/+/, ""));
  ensureDir(dir);
  fs.writeFileSync(path.join(dir, "index.html"), html, "utf8");
}

async function main() {
  if (!fs.existsSync(DIST_DIR)) {
    throw new Error('dist/ not found. Run "vite build" first.');
  }

  // Serve the built site locally
//   const preview = spawn(
//     process.platform === "win32" ? "npx.cmd" : "npx",
//     ["vite", "preview", "--strictPort", "--host", "127.0.0.1", "--port", PREVIEW_PORT],
//     { stdio: "inherit" }
//   );

const isWin = process.platform === "win32";

const preview = spawn(
  isWin ? "cmd.exe" : "npx",
  isWin
    ? ["/c", "npx", "vite", "preview", "--outDir", DIST_DIR, "--strictPort", "--host", "127.0.0.1", "--port", PREVIEW_PORT]
    : ["vite", "preview", "--outDir", DIST_DIR, "--strictPort", "--host", "127.0.0.1", "--port", PREVIEW_PORT],
  { stdio: "inherit" }
);


  // small boot wait
  await new Promise((r) => setTimeout(r, 1500));

  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.setDefaultTimeout(30_000);

  for (const route of ROUTES) {
    const url = `${BASE_URL}${route}`;
    console.log(`\n[prerender] ${url}`);

    // For truly static pages, this should settle quickly.
    await page.goto(url, { waitUntil: "networkidle" });

    const html = await page.content();
    writeHtmlForRoute(route, html);

    console.log(`[prerender] saved ${route}`);
  }

  await browser.close();
  preview.kill("SIGTERM");
  console.log("\n[prerender] done ✅");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
