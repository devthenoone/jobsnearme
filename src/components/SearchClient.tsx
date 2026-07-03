"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

/**
 * Full Google Programmable Search on its own page: a search BAR + results,
 * powered by your custom engine (cx). Reads ?q= and runs it automatically.
 */
const CX = process.env.NEXT_PUBLIC_CSE_CX || "";
let injected = false;

export default function SearchClient() {
  const params = useSearchParams();
  const q = params.get("q") || "";

  // Load cse.js once and render a full "search" element (box + results).
  useEffect(() => {
    if (!CX) return;
    if (!injected) {
      injected = true;
      (window as any).__gcse = { parsetags: "explicit" };
      const s = document.createElement("script");
      s.async = true;
      s.src = `https://cse.google.com/cse.js?cx=${encodeURIComponent(CX)}`;
      document.head.appendChild(s);
    }

    const timer = setInterval(() => {
      const cse = (window as any).google?.search?.cse?.element;
      if (!cse) return;
      clearInterval(timer);
      if (!cse.getElement("sitesearch")) {
        cse.render({ div: "gcse-box", tag: "search", gname: "sitesearch" });
      }
      if (q) cse.getElement("sitesearch")?.execute(q);
    }, 200);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-run when the query in the URL changes.
  useEffect(() => {
    const el = (window as any).google?.search?.cse?.element?.getElement("sitesearch");
    if (el && q) el.execute(q);
  }, [q]);

  if (!CX) {
    return (
      <p className="rounded bg-amber-50 px-4 py-3 text-sm text-amber-700">
        Search engine not configured. Set <code>NEXT_PUBLIC_CSE_CX</code> in
        <code> .env.local</code>.
      </p>
    );
  }

  return <div id="gcse-box" />;
}
