"use client";

import { useEffect, useRef, useState } from "react";
import type { Keyword } from "@/lib/keywords";
import { cseUrl } from "@/lib/cse";
import { openInNewTab } from "@/lib/openTab";

type ApiResponse = {
  keywords: Keyword[];
  tick: number;
  updatedAt: string;
  disclaimer: string;
};

function SearchIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ChevronRight({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function KeywordPanel({
  title,
  tags,
  links = {},
  intervalMs = 6000,
}: {
  title: string;
  tags?: string;
  links?: Record<string, string>;
  intervalMs?: number;
}) {
  const DISPLAY = 6; // how many pills to show at once
  const STEP = 3; // how many to advance each refresh (so the set visibly changes)

  const [data, setData] = useState<ApiResponse | null>(null);
  const [offset, setOffset] = useState(0);
  const tickRef = useRef(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const params = new URLSearchParams({
        title,
        tags: tags ?? "",
        tick: String(tickRef.current),
        limit: "24", // pull a larger pool; we rotate a window through it
      });
      try {
        const res = await fetch(`/api/keywords?${params.toString()}`, {
          cache: "no-store",
        });
        const json: ApiResponse = await res.json();
        if (!cancelled) setData(json);
      } catch {
        /* keep last good data */
      }
    }

    load();
    const id = setInterval(() => {
      tickRef.current += 1;
      setOffset((o) => o + STEP); // rotate the visible window
      load();
    }, intervalMs);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [title, tags, intervalMs]);

  // Rotating window of keywords (wraps around the pool) so they keep changing.
  const pool = data?.keywords ?? [];
  const visible = pool.length
    ? Array.from({ length: Math.min(DISPLAY, pool.length) }, (_, i) => pool[(offset + i) % pool.length])
    : [];

  // Click a keyword: open the admin's custom link if set, otherwise open a Google
  // search for the exact term in a new tab.
  function openKeyword(term: string) {
    const url = links[term] || cseUrl(term);
    openInNewTab(url);
  }

  return (
    <section className="my-9">
      <div className="mb-5 flex items-center gap-2">
        <span className="inline-block h-2.5 w-2.5 animate-pulse rounded-full bg-green-500" />
        <h2 className="text-2xl font-bold text-gray-900">Related Searches</h2>
      </div>

      {!data ? (
        <p className="py-6 text-sm text-gray-400">Loading related searches…</p>
      ) : visible.length === 0 ? (
        <p className="py-6 text-sm text-gray-400">
          Not enough words in the title to suggest searches.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {visible.map((k) => (
            <button
              key={k.term}
              onClick={() => openKeyword(k.term)}
              title={
                links[k.term]
                  ? `Opens: ${links[k.term]}`
                  : `Search Google for "${k.term}"`
              }
              className="group flex items-center justify-between gap-3 rounded-full bg-gray-100 px-5 py-4 text-left transition hover:bg-gray-200"
            >
              <span className="flex min-w-0 items-center gap-3">
                <SearchIcon className="h-[18px] w-[18px] shrink-0 text-gray-400" />
                <span className="truncate text-[15px] text-gray-800">{k.term}</span>
                {links[k.term] && (
                  <span className="shrink-0 rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-bold text-green-700">
                    LINK
                  </span>
                )}
              </span>
              <ChevronRight className="h-[18px] w-[18px] shrink-0 text-gray-400 transition group-hover:translate-x-0.5 group-hover:text-gray-600" />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
