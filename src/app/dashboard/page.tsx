import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { listByAuthor } from "@/lib/posts";
import { one } from "@/lib/db";
import DeletePostButton from "@/components/DeletePostButton";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Dashboard" };

export default async function Dashboard() {
  const user = await getCurrentUser();
  if (!user) redirect("/login"); // guard (don't rely on the layout alone)
  const posts = await listByAuthor(user.id);

  const published = posts.filter((p) => p.published).length;
  const drafts = posts.length - published;
  const linkRow = await one<{ c: number }>(
    `SELECT COUNT(*) AS c FROM post_links
      WHERE post_id IN (SELECT id FROM posts WHERE author_id = ?)`,
    [user.id]
  );
  const linkCount = Number(linkRow?.c ?? 0);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
          <p className="text-sm text-gray-500">Manage your posts and keyword links.</p>
        </div>
        <Link
          href="/dashboard/new"
          className="rounded-lg bg-brand px-4 py-2 font-semibold text-white hover:bg-brand-dark"
        >
          + New post
        </Link>
      </div>

      {/* Stat cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Stat label="Total posts" value={posts.length} />
        <Stat label="Published" value={published} accent="text-green-600" />
        <Stat label="Drafts" value={drafts} accent="text-amber-600" />
      </div>
      <div className="mb-8 -mt-4">
        <Stat label="Keyword links configured" value={linkCount} accent="text-brand" />
      </div>

      {/* Posts table */}
      <div className="rounded-xl border bg-white">
        <div className="border-b px-5 py-3">
          <h2 className="font-semibold text-gray-800">Your posts</h2>
        </div>

        {posts.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No posts yet.{" "}
            <Link href="/dashboard/new" className="font-medium text-brand hover:underline">
              Write your first post
            </Link>
            .
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-[11px] uppercase tracking-wide text-gray-400">
                <th className="px-5 py-2 font-semibold">Title</th>
                <th className="px-5 py-2 font-semibold">Status</th>
                <th className="px-5 py-2 font-semibold">Updated</th>
                <th className="px-5 py-2 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <Link
                      href={`/blog/${p.slug}`}
                      className="font-medium text-gray-900 hover:text-brand"
                    >
                      {p.title}
                    </Link>
                  </td>
                  <td className="px-5 py-3">
                    {p.published ? (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-700">
                        Published
                      </span>
                    ) : (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-gray-500">
                    {new Date(p.updated_at).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/dashboard/edit/${p.id}`}
                        className="font-medium text-brand hover:underline"
                      >
                        Edit & links
                      </Link>
                      <DeletePostButton id={p.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  accent = "text-gray-900",
}: {
  label: string;
  value: number;
  accent?: string;
}) {
  return (
    <div className="rounded-xl border bg-white p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
      <p className={`mt-1 text-3xl font-bold ${accent}`}>{value}</p>
    </div>
  );
}
