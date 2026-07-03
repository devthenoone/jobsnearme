"use client";

import { useEffect, useId, useRef } from "react";

/**
 * Official Google AdSense for Search — "Related Search for Content" (RSoC) unit.
 *
 * This renders Google's real, revenue-earning related-search unit using the
 * Custom Search Ads API (`_googCsa`). It is the ONLY compliant way to show this
 * feature: Google serves the related searches and the paid search ads, and the
 * publisher earns from them. We do NOT generate the terms or links ourselves.
 *
 * Requirements (see .env.local):
 *  - NEXT_PUBLIC_ADSENSE_PUB_ID   e.g. "partner-pub-1234567890123456"
 *  - NEXT_PUBLIC_RSOC_STYLE_ID    the style id from the AdSense Code generator
 *  - Your AdSense account must be allowlisted for RSoC (Restricted Access Feature).
 *
 * Docs: https://support.google.com/adsense/answer/10233819
 */

const ENV_PUB_ID = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID || "";
const ENV_STYLE_ID = process.env.NEXT_PUBLIC_RSOC_STYLE_ID || "";

let scriptLoaded = false;
function ensureCsaScript() {
  if (scriptLoaded || typeof window === "undefined") return;
  scriptLoaded = true;
  // Standard Google CSA bootstrap.
  (function (g: any, o: string) {
    g[o] =
      g[o] ||
      function () {
        (g[o].q = g[o].q || []).push(arguments);
      };
    g[o].t = 1 * (new Date() as any);
  })(window as any, "_googCsa");

  const s = document.createElement("script");
  s.async = true;
  s.src = "https://www.google.com/adsense/search/ads.js";
  document.head.appendChild(s);
}

export default function AdSenseRSoC({
  query,
  relatedSearches = 6,
  pubId,
  styleId,
}: {
  query: string;
  relatedSearches?: number;
  pubId?: string;
  styleId?: string;
}) {
  // Admin-saved keys (from the dashboard/DB) take priority over env vars.
  const PUB_ID = (pubId || ENV_PUB_ID).trim();
  const STYLE_ID = (styleId || ENV_STYLE_ID).trim();

  const reactId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const containerId = `afscontainer_${reactId}`;
  const requested = useRef(false);

  useEffect(() => {
    if (!PUB_ID || !STYLE_ID || !query || requested.current) return;
    requested.current = true;

    ensureCsaScript();

    const pageOptions = {
      pubId: PUB_ID,
      styleId: STYLE_ID,
      query, // page topic; Google returns related searches for it
      adPage: 1,
      // referrerAdCreative: "...", // required for ad-driven traffic (since 2025-11-01)
    };
    const rsBlock = {
      container: containerId,
      relatedSearches,
    };

    try {
      (window as any)._googCsa("relatedsearch", pageOptions, rsBlock);
    } catch {
      /* CSA not available / not allowlisted yet */
    }
  }, [query, containerId, relatedSearches]);

  // Not configured yet: render nothing for visitors, a hint for the developer.
  if (!PUB_ID || !STYLE_ID) {
    if (process.env.NODE_ENV !== "production") {
      return (
        <div className="my-8 rounded-xl border border-dashed border-amber-300 bg-amber-50 p-5 text-sm text-amber-800">
          <strong>AdSense RSoC not configured.</strong> Set{" "}
          <code>NEXT_PUBLIC_ADSENSE_PUB_ID</code> and{" "}
          <code>NEXT_PUBLIC_RSOC_STYLE_ID</code> in <code>.env.local</code> (requires
          Google RSoC approval). This box is only visible in development.
        </div>
      );
    }
    return null;
  }

  return <div id={containerId} className="my-8" />;
}
