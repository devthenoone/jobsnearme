import type { Metadata } from "next";
import Link from "next/link";
import { listPublished, tagList } from "@/lib/posts";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Blogs",
  description: "Guides and tips on finding jobs near you — local, part-time, warehouse, and remote roles.",
};

export default async function BlogsPage() {
  const posts = await listPublished();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900">Jobs Near Me — Blog</h1>
      <p className="mt-2 text-gray-600">
        Practical guides to finding and landing local jobs fast.
      </p>

      {posts.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed bg-white p-10 text-center text-gray-500">
          No articles yet.
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {posts.map((p) => (
            <Link
              key={p.id}
              href={`/blog/${p.slug}`}
              className="group rounded-xl border bg-white p-5 transition hover:border-brand hover:shadow-md"
            >
              <h2 className="text-lg font-semibold text-gray-900 group-hover:text-brand">
                {p.title}
              </h2>
              <p className="mt-2 line-clamp-3 text-sm text-gray-600">
                {p.excerpt || p.content.slice(0, 160)}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-gray-400">
                <span>By {p.author_name}</span>
                <span>·</span>
                <span>{new Date(p.created_at).toLocaleDateString()}</span>
              </div>
              {tagList(p.tags).length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {tagList(p.tags)
                    .slice(0, 4)
                    .map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-brand-light px-2 py-0.5 text-[11px] text-brand-dark"
                      >
                        #{t}
                      </span>
                    ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
