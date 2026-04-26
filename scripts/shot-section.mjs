// Capture a specific scroll-range slice of the page (good for viewing mobile sections)
import puppeteer from "puppeteer";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const [, , rawName, rawWidth, rawHeight, rawY] = process.argv;
const name = rawName || "section";
const width = Number(rawWidth) || 390;
const height = Number(rawHeight) || 844;
const scrollY = Number(rawY) || 0;

const baseUrl = process.env.SCREENSHOT_BASE_URL || "http://localhost:3000";
const url = `${baseUrl}/`;
const outDir = resolve("screenshots");
await mkdir(outDir, { recursive: true });
const outPath = resolve(outDir, `${name}.png`);

const browser = await puppeteer.launch({
  headless: true,
  protocolTimeout: 180000,
});
try {
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 2 });
  await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });
  // Tall viewport to load all lazy images
  await page.setViewport({ width, height: 12000, deviceScaleFactor: 2 });
  await page.waitForNetworkIdle({ idleTime: 600, timeout: 30000 }).catch(() => {});
  // Restore + scroll to position
  await page.setViewport({ width, height, deviceScaleFactor: 2 });
  await page.evaluate((y) => window.scrollTo(0, y), scrollY);
  await new Promise((r) => setTimeout(r, 300));
  await page.screenshot({ path: outPath, fullPage: false });
  console.log(outPath);
} finally {
  await browser.close();
}
