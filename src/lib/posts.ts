import { all, one, type PostRow } from "./db";

export async function listPublished(): Promise<PostRow[]> {
  return all<PostRow>(
    `SELECT p.*, u.name AS author_name
       FROM posts p JOIN users u ON u.id = p.author_id
      WHERE p.published = 1
      ORDER BY p.created_at DESC`
  );
}

export async function getBySlug(slug: string): Promise<PostRow | undefined> {
  return one<PostRow>(
    `SELECT p.*, u.name AS author_name
       FROM posts p JOIN users u ON u.id = p.author_id
      WHERE p.slug = ?`,
    [slug]
  );
}

export async function getById(id: number): Promise<PostRow | undefined> {
  return one<PostRow>("SELECT * FROM posts WHERE id = ?", [id]);
}

export async function listByAuthor(authorId: number): Promise<PostRow[]> {
  return all<PostRow>(
    "SELECT * FROM posts WHERE author_id = ? ORDER BY updated_at DESC",
    [authorId]
  );
}

export function tagList(tags: string): string[] {
  return tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}
