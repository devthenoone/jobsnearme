import { all, db, type PostLinkRow } from "./db";

/** Returns { keyword -> url } for a post. */
export async function getLinkMap(postId: number): Promise<Record<string, string>> {
  const rows = await all<Pick<PostLinkRow, "keyword" | "url">>(
    "SELECT keyword, url FROM post_links WHERE post_id = ?",
    [postId]
  );
  const map: Record<string, string> = {};
  for (const r of rows) map[r.keyword] = r.url;
  return map;
}

/**
 * Replaces all keyword links for a post with the supplied list (atomic batch).
 * Entries with an empty url are skipped (i.e. removed).
 */
export async function setLinks(
  postId: number,
  links: { keyword: string; url: string }[]
): Promise<void> {
  const stmts: { sql: string; args: (string | number)[] }[] = [
    { sql: "DELETE FROM post_links WHERE post_id = ?", args: [postId] },
  ];
  for (const { keyword, url } of links) {
    const k = (keyword || "").trim();
    const u = (url || "").trim();
    if (k && u) {
      stmts.push({
        sql: "INSERT INTO post_links (post_id, keyword, url) VALUES (?, ?, ?)",
        args: [postId, k, u],
      });
    }
  }
  await db.batch(stmts, "write");
}
