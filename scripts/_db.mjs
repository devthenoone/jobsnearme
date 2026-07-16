// Shared libSQL connection for the CLI scripts. Reads Turso env vars if set,
// otherwise falls back to the local file DB (same as the app in dev).
import { createClient } from "@libsql/client";
import fs from "node:fs";

// Load .env and .env.local into process.env (so scripts use the same DB as the
// app). Real environment variables always win; .env.local overrides .env.
for (const file of ["../.env", "../.env.local"]) {
  try {
    const text = fs.readFileSync(new URL(file, import.meta.url), "utf8");
    for (const line of text.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m) {
        const [, key, raw] = m;
        const val = raw.replace(/^["']|["']$/g, "").trim();
        // Don't clobber a value that was set in the real environment.
        if (!Object.prototype.hasOwnProperty.call(process.env, key) || file === "../.env.local") {
          if (val) process.env[key] = val;
        }
      }
    }
  } catch {
    /* file not present — fine */
  }
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
  // Columns added after the first release (ALTER throws if already present).
  try {
    await db.execute("ALTER TABLE posts ADD COLUMN category TEXT NOT NULL DEFAULT ''");
  } catch {
    /* column already present */
  }
}
