// Quick puppeteer smoke test of the booking flow.
import puppeteer from "puppeteer";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const baseUrl = process.env.SCREENSHOT_BASE_URL || "http://localhost:3000";
const outDir = resolve("screenshots");
await mkdir(outDir, { recursive: true });

const browser = await puppeteer.launch({ headless: true });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`${baseUrl}/`, { waitUntil: "networkidle0" });

  // Find an empty slot (a button with the aria-label matching "Book")
  const buttons = await page.$$('button[aria-label^="Book "]');
  console.log(`empty slots found: ${buttons.length}`);
  if (buttons.length === 0) {
    throw new Error("no empty slots to test");
  }

  // Click the first available slot
  await buttons[0].evaluate((el) => el.scrollIntoView({ block: "center" }));
  await buttons[0].click();
  await new Promise((r) => setTimeout(r, 400));

  // Screenshot the dialog open
  await page.screenshot({
    path: resolve(outDir, "dialog.png"),
    fullPage: false,
  });
  console.log("dialog screenshot saved");
} finally {
  await browser.close();
}
