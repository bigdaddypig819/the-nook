import { config } from "dotenv";
import { createClient } from "@libsql/client";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { addDays, format, startOfWeek } from "date-fns";
import { nanoid } from "nanoid";

config({ path: ".env.local" });

async function main() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  let client;
  if (url && url.startsWith("libsql://")) {
    client = createClient({ url, authToken });
  } else {
    const dataDir = resolve(".data");
    if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });
    client = createClient({
      url: `file:${resolve(dataDir, "nookers.db")}`,
    });

    const sql = readFileSync(resolve("lib/schema.sql"), "utf8");
    for (const stmt of sql.split(";").map((s) => s.trim()).filter(Boolean)) {
      await client.execute(stmt);
    }
  }

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });

  const seeds: Array<{
    dayOffset: number;
    hour: number;
    name: string;
    email: string;
  }> = [
  { dayOffset: 0, hour: 8, name: "Mira Holloway", email: "mira@example.com" },
  { dayOffset: 0, hour: 12, name: "Theo Park", email: "theo@example.com" },
  { dayOffset: 1, hour: 9, name: "Sasha L.", email: "sasha@example.com" },
  { dayOffset: 1, hour: 10, name: "Jonas Reed", email: "jonas@example.com" },
  { dayOffset: 2, hour: 7, name: "Anika V.", email: "anika@example.com" },
  { dayOffset: 2, hour: 14, name: "Marco D.", email: "marco@example.com" },
  { dayOffset: 3, hour: 11, name: "Pia C.", email: "pia@example.com" },
  { dayOffset: 4, hour: 13, name: "Owen W.", email: "owen@example.com" },
  { dayOffset: 4, hour: 15, name: "Ren K.", email: "ren@example.com" },
  { dayOffset: 5, hour: 8, name: "Hana B.", email: "hana@example.com" },
  { dayOffset: 5, hour: 9, name: "Eli M.", email: "eli@example.com" },
  { dayOffset: 6, hour: 10, name: "Nora T.", email: "nora@example.com" },
    { dayOffset: 6, hour: 11, name: "Ben G.", email: "ben@example.com" },
  ];

  const now = new Date().toISOString();
  let inserted = 0;
  for (const s of seeds) {
    const date = format(addDays(weekStart, s.dayOffset), "yyyy-MM-dd");
    try {
      await client.execute({
        sql: `INSERT INTO bookings
              (id, court, slot_date, slot_hour, name, email, phone, cancel_token, created_at)
              VALUES (?, 'the-nook', ?, ?, ?, ?, NULL, ?, ?)`,
        args: [nanoid(12), date, s.hour, s.name, s.email, nanoid(24), now],
      });
      inserted++;
    } catch (e) {
      if (!String(e).includes("UNIQUE")) throw e;
    }
  }

  console.log(`Seeded ${inserted} bookings.`);
}

main().then(() => process.exit(0));
