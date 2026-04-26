import { createClient, type Client } from "@libsql/client";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { applyMigrations } from "./migrate";

let _client: Client | null = null;
let _ready: Promise<Client> | null = null;

function buildClient(): { client: Client; needsLocalSchema: boolean } {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (url && url.startsWith("libsql://")) {
    return {
      client: createClient({ url, authToken }),
      needsLocalSchema: false,
    };
  }

  const dataDir = resolve(".data");
  if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });
  const filePath = resolve(dataDir, "nookers.db");
  return {
    client: createClient({ url: `file:${filePath}` }),
    needsLocalSchema: true,
  };
}

async function applyLocalSchema(client: Client) {
  const schemaPath = resolve("lib/schema.sql");
  if (!existsSync(schemaPath)) return;
  const sql = readFileSync(schemaPath, "utf8");
  const statements = sql
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);
  for (const stmt of statements) {
    await client.execute(stmt);
  }
}

export function db(): Promise<Client> {
  if (_ready) return _ready;
  _ready = (async () => {
    if (_client) return _client;
    const { client, needsLocalSchema } = buildClient();
    if (needsLocalSchema) await applyLocalSchema(client);
    await applyMigrations(client);
    _client = client;
    return client;
  })();
  return _ready;
}
