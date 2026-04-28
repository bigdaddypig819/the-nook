// One-off helper: log into /admin and screenshot the dashboard.
// node screenshot-admin.mjs [scope] [name] [width] [height]
import puppeteer from "puppeteer";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const [, , rawScope = "upcoming", rawName, rawWidth, rawHeight] = process.argv;
const scope = rawScope;
const name = rawName || `admin-${scope}`;
const width = Number(rawWidth) || 1440;
const height = Number(rawHeight) || 900;
const password = process.env.ADMIN_PASSWORD_FOR_SCREENSHOT || "nook-admin";

const baseUrl = process.env.SCREENSHOT_BASE_URL || "http://localhost:3000";
const outDir = resolve("screenshots");
await mkdir(outDir, { recursive: true });
const outPath = resolve(outDir, `${name}.png`);

const browser = await puppeteer.launch({ headless: true });
try {
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1 });

  await page.goto(`${baseUrl}/admin/login`, { waitUntil: "networkidle0", timeout: 60000 });
  await page.type('input[name="password"]', password);
  await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle0", timeout: 60000 }),
    page.click('button[type="submit"]'),
  ]);

  const targetUrl = scope === "upcoming" ? `${baseUrl}/admin` : `${baseUrl}/admin?scope=${scope}`;
  await page.goto(targetUrl, { waitUntil: "networkidle0", timeout: 60000 });
  await page.screenshot({ path: outPath, fullPage: true });
  console.log(outPath);
} finally {
  await browser.close();
}
