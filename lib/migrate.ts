import type { Client } from "@libsql/client";

export async function applyMigrations(client: Client): Promise<void> {
  const cols = await client.execute("PRAGMA table_info(bookings)");
  const hasDuration = cols.rows.some(
    (r) => (r as Record<string, unknown>).name === "duration_hours",
  );
  if (!hasDuration) {
    await client.execute(
      "ALTER TABLE bookings ADD COLUMN duration_hours INTEGER NOT NULL DEFAULT 1",
    );
  }

  const idx = await client.execute("PRAGMA index_list(bookings)");
  const hasOldIdx = idx.rows.some(
    (r) => (r as Record<string, unknown>).name === "idx_active_slot",
  );
  if (hasOldIdx) {
    await client.execute("DROP INDEX idx_active_slot");
  }
}
