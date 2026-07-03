import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";

// Single shared SQLite connection, cached across hot-reloads in dev.
const globalForDb = globalThis as unknown as { __db?: Database.Database };

function createDb(): Database.Database {
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  const db = new Database(path.join(dataDir, "app.db"));
  db.pragma("journal_mode = WAL");

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      email      TEXT NOT NULL UNIQUE,
      name       TEXT NOT NULL,
      password   TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS posts (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      author_id  INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title      TEXT NOT NULL,
      slug       TEXT NOT NULL UNIQUE,
      excerpt    TEXT NOT NULL DEFAULT '',
      content    TEXT NOT NULL DEFAULT '',
      tags       TEXT NOT NULL DEFAULT '',
      published  INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
    CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id);

    CREATE TABLE IF NOT EXISTS post_links (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id    INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
      keyword    TEXT NOT NULL,
      url        TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(post_id, keyword)
    );
    CREATE INDEX IF NOT EXISTS idx_links_post ON post_links(post_id);

    CREATE TABLE IF NOT EXISTS settings (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL DEFAULT ''
    );
  `);

  return db;
}

export const db = globalForDb.__db ?? createDb();
if (process.env.NODE_ENV !== "production") globalForDb.__db = db;

export type UserRow = {
  id: number;
  email: string;
  name: string;
  password: string;
  created_at: string;
};

export type PostRow = {
  id: number;
  author_id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string;
  published: number;
  created_at: string;
  updated_at: string;
  author_name?: string;
};

export type PostLinkRow = {
  id: number;
  post_id: number;
  keyword: string;
  url: string;
  created_at: string;
};
