"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CSE_CX } from "@/lib/cse";
import GoogleWordmark from "@/components/GoogleWordmark";

/**
 * A Google-style search page: our own "Enhanced by Google" search bar plus the
 * results rendered INLINE on the same page (a `searchresults-only` element from
 * your Custom Search Engine). No overlay/popup — results update in place.
 */
let injected = false;

export default function SearchClient() {
  const params = useSearchParams();
  const initialQ = params.get("q") || "";
  const [q, setQ] = useState(initialQ);

  useEffect(() => {
    // Load Google CSE once, then render an inline results element.
    if (!injected) {
      injected = true;
      (window as any).__gcse = { parsetags: "explicit" };
      const s = document.createElement("script");
      s.async = true;
      s.src = `https://cse.google.com/cse.js?cx=${encodeURIComponent(CSE_CX)}`;
      document.head.appendChild(s);
    }

    const timer = setInterval(() => {
      const cse = (window as any).google?.search?.cse?.element;
      if (!cse) return;
      clearInterval(timer);
      if (!cse.getElement("results")) {
        cse.render({ div: "gcse-results", tag: "searchresults-only", gname: "results" });
      }
      if (initialQ) cse.getElement("results")?.execute(initialQ);
    }, 200);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function runSearch(e: React.FormEvent) {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    const el = (window as any).google?.search?.cse?.element?.getElement("results");
    if (el) el.execute(term);
  }

  return (
    <div>
      <form
        onSubmit={runSearch}
        className="flex items-stretch gap-2 rounded-full border border-gray-200 bg-white p-1.5 shadow-sm"
      >
        <div className="relative flex-1">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
          >
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search jobs, companies, keywords…"
            className="w-full rounded-full py-2.5 pl-11 pr-4 text-sm outline-none"
          />
        </div>
        <button
          type="submit"
          className="shrink-0 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      <p className="mt-2 pl-2 text-xs text-gray-500">
        Enhanced by <GoogleWordmark />
      </p>

      {/* Inline results — no overlay/popup */}
      <div id="gcse-results" className="mt-6" />
    </div>
  );
}
