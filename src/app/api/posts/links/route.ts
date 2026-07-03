import { NextResponse } from "next/server";
import { one, type PostRow } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { getLinkMap, setLinks } from "@/lib/links";

export const dynamic = "force-dynamic";

async function ownedPost(postId: number) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated.", status: 401 as const };
  const post = await one<PostRow>("SELECT * FROM posts WHERE id = ?", [postId]);
  if (!post) return { error: "Post not found.", status: 404 as const };
  if (post.author_id !== user.id)
    return { error: "Not your post.", status: 403 as const };
  return { post };
}

// Read existing keyword -> url links for a post.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const postId = Number(searchParams.get("postId"));
  const res = await ownedPost(postId);
  if ("error" in res) return NextResponse.json({ error: res.error }, { status: res.status });
  return NextResponse.json({ links: await getLinkMap(postId) });
}

// Replace the full set of keyword links for a post.
export async function PUT(req: Request) {
  const { postId, links } = await req.json().catch(() => ({}));
  const res = await ownedPost(Number(postId));
  if ("error" in res) return NextResponse.json({ error: res.error }, { status: res.status });

  if (!Array.isArray(links)) {
    return NextResponse.json({ error: "links must be an array." }, { status: 400 });
  }
  await setLinks(Number(postId), links);
  return NextResponse.json({ ok: true, links: await getLinkMap(Number(postId)) });
}
