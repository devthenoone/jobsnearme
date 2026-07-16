import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getById } from "@/lib/posts";
import PostEditor from "@/components/PostEditor";

export const metadata = { title: "Edit post" };

export default async function EditPost({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const post = await getById(Number(id));
  if (!post) notFound();
  if (post.author_id !== user.id) redirect("/dashboard");

  return (
    <PostEditor
      initial={{
        id: post.id,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        tags: post.tags,
        category: post.category,
        published: !!post.published,
      }}
    />
  );
}
