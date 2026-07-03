import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import SearchClient from "@/components/SearchClient";

export const metadata: Metadata = { title: "Search", robots: { index: false } };

export default function SearchPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/" className="text-sm text-brand hover:underline">
        ← Back to blog
      </Link>
      <h1 className="mt-3 mb-6 text-2xl font-bold text-gray-900">Search</h1>
      <Suspense fallback={<p className="text-sm text-gray-400">Loading search…</p>}>
        <SearchClient />
      </Suspense>
    </div>
  );
}
