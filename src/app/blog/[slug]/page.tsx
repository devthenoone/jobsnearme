import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBySlug, tagList } from "@/lib/posts";
import { getSettings } from "@/lib/settings";
import RelatedSearchSection from "@/components/RelatedSearchSection";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBySlug(slug);
  if (!post) return { title: "Post not found" };
  const description = post.excerpt || post.content.slice(0, 155);
  return {
    title: post.title,
    description,
    keywords: tagList(post.tags),
    openGraph: { title: post.title, description, type: "article" },
    alternates: { canonical: `/blog/${post.slug}` },
  };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = getBySlug(slug);
  if (!post || !post.published) notFound();

  const settings = getSettings(); // admin-managed AdSense keys + preview toggle

  // Split the body into two halves so the keyword panel sits in the middle.
  const paragraphs = post.content.split(/\n{2,}/).filter((p) => p.trim());
  const mid = Math.ceil(paragraphs.length / 2);
  const firstHalf = paragraphs.slice(0, mid);
  const secondHalf = paragraphs.slice(mid);

  // JSON-LD structured data for SEO.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    author: { "@type": "Person", name: post.author_name },
    datePublished: post.created_at,
    dateModified: post.updated_at,
    keywords: tagList(post.tags).join(", "),
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link href="/" className="text-sm text-brand hover:underline">
        ← All posts
      </Link>

      <h1 className="mt-4 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
        {post.title}
      </h1>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-500">
        <span>By {post.author_name}</span>
        <span>·</span>
        <span>{new Date(post.created_at).toLocaleDateString()}</span>
      </div>
      {tagList(post.tags).length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tagList(post.tags).map((t) => (
            <span
              key={t}
              className="rounded-full bg-brand-light px-2 py-0.5 text-xs text-brand-dark"
            >
              #{t}
            </span>
          ))}
        </div>
      )}

      <div className="article mt-8 text-[17px] text-gray-800">
        {firstHalf.map((p, i) => (
          <p key={`a-${i}`}>{p}</p>
        ))}

        {/* Related searches — ① live AdSense unit + ② local preview, both labeled. */}
        <RelatedSearchSection
          title={post.title}
          tags={post.tags}
          pubId={settings.adsense_pub_id}
          styleId={settings.rsoc_style_id}
          showPreview={settings.show_keyword_preview !== "false"}
        />

        {secondHalf.map((p, i) => (
          <p key={`b-${i}`}>{p}</p>
        ))}

        {paragraphs.length === 0 && (
          <p className="text-gray-400">This post has no content yet.</p>
        )}
      </div>
    </article>
  );
}
