// Capture a screenshot of a local dev URL.
// Usage:
//   node screenshot.mjs                                  -> screenshots/home.png at 1440x900
//   node screenshot.mjs /about                           -> screenshots/about.png
//   node screenshot.mjs /pricing pricing-mobile 390 844  -> screenshots/pricing-mobile.png at 390x844
import puppeteer from "puppeteer";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const [, , rawPath = "/", rawName, rawWidth, rawHeight] = process.argv;
const path = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;
const name = rawName || (path === "/" ? "home" : path.replace(/^\/+|\/+$/g, "").replace(/\//g, "-"));
const width = Number(rawWidth) || 1440;
const height = Number(rawHeight) || 900;

const baseUrl = process.env.SCREENSHOT_BASE_URL || "http://localhost:3000";
const url = `${baseUrl}${path}`;
const outDir = resolve("screenshots");
await mkdir(outDir, { recursive: true });
const outPath = resolve(outDir, `${name}.png`);

const browser = await puppeteer.launch({ headless: true });
try {
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  const response = await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });
  if (!response || !response.ok()) {
    throw new Error(`Failed to load ${url} (status ${response ? response.status() : "no response"})`);
  }
  await page.screenshot({ path: outPath, fullPage: true });
  console.log(outPath);
} finally {
  await browser.close();
}
