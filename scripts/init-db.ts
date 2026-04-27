import { config } from "dotenv";
import { createClient } from "@libsql/client";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { applyMigrations } from "../lib/migrate";

config({ path: ".env.local" });

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) {
  console.error("Missing TURSO_DATABASE_URL in .env.local");
  process.exit(1);
}

const client = createClient({ url, authToken });

const sql = readFileSync(resolve("lib/schema.sql"), "utf8");
const statements = sql
  .split(";")
  .map((s) => s.trim())
  .filter(Boolean);
(async () => {
  for (const stmt of statements) {
    await client.execute(stmt);
    console.log("✓", stmt.split("\n")[0].slice(0, 80));
  }

  await applyMigrations(client);
  console.log("✓ migrations");

  console.log("\nSchema applied to", url);
  process.exit(0);
})();