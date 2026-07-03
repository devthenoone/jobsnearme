import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import PostEditor from "@/components/PostEditor";

export const metadata = { title: "New post" };

export default async function NewPost() {
  if (!(await getCurrentUser())) redirect("/login");
  return <PostEditor />;
}
