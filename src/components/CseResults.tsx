"use client";

import { useEffect, useId, useRef } from "react";

/**
 * Renders YOUR Google Programmable Search Engine (Custom Search) results inline
 * using Google's official hosted Element widget — the same engine as your embed
 * snippet (cx). No API key and no daily quota; fully Google-policy compliant.
 *
 * We load cse.js in "explicit" mode and render a `searchresults-only` element,
 * then drive it with .execute(query) whenever the clicked keyword changes.
 */

// Module-level guard so the script is injected only once per page.
let scriptInjected = false;

function loadCseScript(cx: string) {
  if (scriptInjected || typeof document === "undefined") return;
  scriptInjected = true;
  // Must be set BEFORE the script loads.
  (window as any).__gcse = { parsetags: "explicit" };
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://cse.google.com/cse.js?cx=${encodeURIComponent(cx)}`;
  document.head.appendChild(s);
}

export default function CseResults({ cx, query }: { cx: string; query: string }) {
  const reactId = useId();
  const gname = `kw_${reactId.replace(/[^a-zA-Z0-9]/g, "")}`;
  const divId = `cse-${gname}`;
  const rendered = useRef(false);
  const lastQuery = useRef("");

  // Load script + render this element once the Element API is ready.
  useEffect(() => {
    if (!cx) return;
    loadCseScript(cx);

    const timer = setInterval(() => {
      const cse = (window as any).google?.search?.cse?.element;
      if (!cse) return;
      clearInterval(timer);
      if (!rendered.current) {
        cse.render({ div: divId, tag: "searchresults-only", gname });
        rendered.current = true;
        if (query) {
          cse.getElement(gname).execute(query);
          lastQuery.current = query;
        }
      }
    }, 200);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cx]);

  // Re-run the search whenever the selected keyword changes.
  useEffect(() => {
    if (!query || query === lastQuery.current) return;
    const el = (window as any).google?.search?.cse?.element?.getElement(gname);
    if (el) {
      el.execute(query);
      lastQuery.current = query;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return <div id={divId} className="gcse-results-host text-left" />;
}
