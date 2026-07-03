import { NextResponse } from "next/server";
import { db, type PostRow } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { uniqueSlug } from "@/lib/slug";

// Create a new post.
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const { title, excerpt, content, tags, published } = await req.json().catch(() => ({}));
  if (!title || typeof title !== "string") {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }

  const slug = uniqueSlug(title, (s) => {
    return !!db.prepare("SELECT 1 FROM posts WHERE slug = ?").get(s);
  });

  const info = db
    .prepare(
      `INSERT INTO posts (author_id, title, slug, excerpt, content, tags, published)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      user.id,
      title.trim(),
      slug,
      String(excerpt ?? "").trim(),
      String(content ?? "").trim(),
      String(tags ?? "").trim(),
      published === false ? 0 : 1
    );

  return NextResponse.json({ ok: true, id: Number(info.lastInsertRowid), slug });
}

// Update an existing post (must be the author).
export async function PUT(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const { id, title, excerpt, content, tags, published } = await req.json().catch(() => ({}));
  const post = db.prepare("SELECT * FROM posts WHERE id = ?").get(Number(id)) as
    | PostRow
    | undefined;

  if (!post) return NextResponse.json({ error: "Post not found." }, { status: 404 });
  if (post.author_id !== user.id) {
    return NextResponse.json({ error: "Not your post." }, { status: 403 });
  }

  db.prepare(
    `UPDATE posts
       SET title = ?, excerpt = ?, content = ?, tags = ?, published = ?, updated_at = datetime('now')
     WHERE id = ?`
  ).run(
    String(title ?? post.title).trim(),
    String(excerpt ?? "").trim(),
    String(content ?? "").trim(),
    String(tags ?? "").trim(),
    published === false ? 0 : 1,
    post.id
  );

  return NextResponse.json({ ok: true, slug: post.slug });
}

// Delete a post (must be the author).
export async function DELETE(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const { id } = await req.json().catch(() => ({}));
  const post = db.prepare("SELECT * FROM posts WHERE id = ?").get(Number(id)) as
    | PostRow
    | undefined;
  if (!post) return NextResponse.json({ error: "Post not found." }, { status: 404 });
  if (post.author_id !== user.id) {
    return NextResponse.json({ error: "Not your post." }, { status: 403 });
  }

  db.prepare("DELETE FROM posts WHERE id = ?").run(post.id);
  return NextResponse.json({ ok: true });
}
