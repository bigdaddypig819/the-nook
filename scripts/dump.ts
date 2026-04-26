import { createClient } from "@libsql/client";
import { resolve } from "node:path";

async function main() {
  const c = createClient({ url: `file:${resolve(".data/nookers.db")}` });
  const r = await c.execute(
    "SELECT id, cancel_token, name, slot_date, slot_hour FROM bookings LIMIT 3",
  );
  for (const row of r.rows) {
    console.log(JSON.stringify(row));
  }
}

main().then(() => process.exit(0));
