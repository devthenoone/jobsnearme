import Link from "next/link";
import { listPublished, tagList } from "@/lib/posts";

export const dynamic = "force-dynamic";

export default function Home() {
  const posts = listPublished();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <section className="mb-10 rounded-2xl bg-gradient-to-br from-brand to-brand-dark px-8 py-12 text-white">
        <h1 className="text-3xl font-bold sm:text-4xl">
          Find jobs near you — fast
        </h1>
        <p className="mt-3 max-w-2xl text-white/90">
          Practical guides to local, part-time, warehouse, and remote jobs near you.
          Learn where to search, how to apply, and how to get hired quickly.
        </p>
        <Link
          href="/blogs"
          className="mt-6 inline-block rounded-lg bg-white px-5 py-2.5 font-semibold text-brand-dark hover:bg-gray-100"
        >
          Browse job guides →
        </Link>
      </section>

      <h2 className="mb-4 text-xl font-bold text-gray-800">Latest articles</h2>

      {posts.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-white p-10 text-center text-gray-500">
          No articles yet.
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {posts.map((p) => (
            <Link
              key={p.id}
              href={`/blog/${p.slug}`}
              className="group rounded-xl border bg-white p-5 transition hover:border-brand hover:shadow-md"
            >
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-brand">
                {p.title}
              </h3>
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
                  {tagList(p.tags).map((t) => (
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
