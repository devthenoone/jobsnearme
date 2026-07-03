import { db, type PostRow } from "./db";

export function listPublished(): PostRow[] {
  return db
    .prepare(
      `SELECT p.*, u.name AS author_name
         FROM posts p JOIN users u ON u.id = p.author_id
        WHERE p.published = 1
        ORDER BY p.created_at DESC`
    )
    .all() as PostRow[];
}

export function getBySlug(slug: string): PostRow | undefined {
  return db
    .prepare(
      `SELECT p.*, u.name AS author_name
         FROM posts p JOIN users u ON u.id = p.author_id
        WHERE p.slug = ?`
    )
    .get(slug) as PostRow | undefined;
}

export function getById(id: number): PostRow | undefined {
  return db.prepare("SELECT * FROM posts WHERE id = ?").get(id) as PostRow | undefined;
}

export function listByAuthor(authorId: number): PostRow[] {
  return db
    .prepare("SELECT * FROM posts WHERE author_id = ? ORDER BY updated_at DESC")
    .all(authorId) as PostRow[];
}

export function tagList(tags: string): string[] {
  return tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}
