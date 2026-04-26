// Full-page screenshot that triggers lazy-loaded images by using a tall viewport.
import puppeteer from "puppeteer";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const [, , rawPath = "/", rawName, rawWidth, rawHeight] = process.argv;
const path = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;
const name =
  rawName || (path === "/" ? "home" : path.replace(/^\/+|\/+$/g, ""));
const width = Number(rawWidth) || 1440;
const height = Number(rawHeight) || 900;

const baseUrl = process.env.SCREENSHOT_BASE_URL || "http://localhost:3000";
const url = `${baseUrl}${path}`;
const outDir = resolve("screenshots");
await mkdir(outDir, { recursive: true });
const outPath = resolve(outDir, `${name}.png`);

const browser = await puppeteer.launch({
  headless: true,
  protocolTimeout: 180000,
});
try {
  const page = await browser.newPage();
  // First load with intended viewport
  await page.setViewport({ width, height, deviceScaleFactor: 2 });
  const response = await page.goto(url, {
    waitUntil: "networkidle0",
    timeout: 60000,
  });
  if (!response || !response.ok()) {
    throw new Error(`Failed to load ${url}`);
  }

  // Resize to a very tall viewport so every lazy image is "in view"
  await page.setViewport({ width, height: 12000, deviceScaleFactor: 2 });
  // Wait for any newly-triggered loads to settle
  await page
    .waitForNetworkIdle({ idleTime: 600, timeout: 30000 })
    .catch(() => {});

  // Restore viewport for the screenshot pass
  await page.setViewport({ width, height, deviceScaleFactor: 2 });
  await new Promise((r) => setTimeout(r, 300));

  await page.screenshot({ path: outPath, fullPage: true });
  console.log(outPath);
} finally {
  await browser.close();
}
