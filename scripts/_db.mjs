// Shared libSQL connection for the CLI scripts. Reads Turso env vars if set,
// otherwise falls back to the local file DB (same as the app in dev).
import { createClient } from "@libsql/client";
import fs from "node:fs";

// Load .env.local into process.env if present (so scripts see TURSO_* etc.).
try {
  const text = fs.readFileSync(new URL("../.env.local", import.meta.url), "utf8");
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && process.env[m[1]] === undefined) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
} catch {
  /* no .env.local — fine */
}

const url = process.env.TURSO_DATABASE_URL || "file:./data/app.db";
const authToken = process.env.TURSO_AUTH_TOKEN;

if (url.startsWith("file:") && !fs.existsSync("data")) fs.mkdirSync("data", { recursive: true });

export const db = createClient(authToken ? { url, authToken } : { url });

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL UNIQUE, name TEXT NOT NULL,
  password TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT, author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL, slug TEXT NOT NULL UNIQUE, excerpt TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '', tags TEXT NOT NULL DEFAULT '', published INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')), updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id);
CREATE TABLE IF NOT EXISTS post_links (
  id INTEGER PRIMARY KEY AUTOINCREMENT, post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  keyword TEXT NOT NULL, url TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(post_id, keyword)
);
CREATE INDEX IF NOT EXISTS idx_links_post ON post_links(post_id);
CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL DEFAULT '');
`;

export async function ensureSchema() {
  await db.executeMultiple(SCHEMA_SQL);
}
