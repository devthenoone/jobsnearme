import { db, type PostLinkRow } from "./db";

/** Returns { keyword -> url } for a post. */
export function getLinkMap(postId: number): Record<string, string> {
  const rows = db
    .prepare("SELECT keyword, url FROM post_links WHERE post_id = ?")
    .all(postId) as Pick<PostLinkRow, "keyword" | "url">[];
  const map: Record<string, string> = {};
  for (const r of rows) map[r.keyword] = r.url;
  return map;
}

/**
 * Replaces all keyword links for a post with the supplied list.
 * Entries with an empty url are treated as "remove".
 */
export function setLinks(
  postId: number,
  links: { keyword: string; url: string }[]
): void {
  const tx = db.transaction((items: { keyword: string; url: string }[]) => {
    db.prepare("DELETE FROM post_links WHERE post_id = ?").run(postId);
    const insert = db.prepare(
      "INSERT INTO post_links (post_id, keyword, url) VALUES (?, ?, ?)"
    );
    for (const { keyword, url } of items) {
      const k = (keyword || "").trim();
      const u = (url || "").trim();
      if (k && u) insert.run(postId, k, u);
    }
  });
  tx(links);
}
