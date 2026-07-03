"use client";

import AdSenseRSoC from "./AdSenseRSoC";
import KeywordPanel from "./KeywordPanel";

/**
 * Shows TWO clearly-labeled blocks so it's obvious which is which:
 *
 *   ① LIVE  — the official Google AdSense for Search (RSoC) unit. Google serves
 *             the related searches and the paid ads; this is what earns money.
 *   ② PREVIEW — your own suggested keywords (local engine + post tags). NOT ads.
 *             For previewing/planning only. Toggle off in production with
 *             NEXT_PUBLIC_SHOW_KEYWORD_PREVIEW=false (recommended once live, so a
 *             look-alike unit never sits next to real AdSense ads).
 */

export default function RelatedSearchSection({
  title,
  tags,
  pubId,
  styleId,
  showPreview = true,
}: {
  title: string;
  tags?: string;
  pubId?: string;
  styleId?: string;
  showPreview?: boolean;
}) {
  const SHOW_PREVIEW = showPreview;
  return (
    <div className="my-8 space-y-8">
      {/* ① LIVE — Google AdSense */}
      <div className="rounded-xl border border-green-200 bg-green-50/40 p-4">
        <div className="mb-1 flex items-center gap-2">
          <span className="rounded bg-green-600 px-2 py-0.5 text-[10px] font-bold tracking-wide text-white">
            ① LIVE · GOOGLE ADSENSE
          </span>
          <span className="text-xs text-gray-500">
            Real related-search ads — Google chooses the terms &amp; you earn from clicks
          </span>
        </div>
        <AdSenseRSoC query={title} relatedSearches={6} pubId={pubId} styleId={styleId} />
      </div>

      {/* ② PREVIEW — your suggested keywords */}
      {SHOW_PREVIEW && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-4">
          <div className="mb-1 flex items-center gap-2">
            <span className="rounded bg-amber-500 px-2 py-0.5 text-[10px] font-bold tracking-wide text-white">
              ② PREVIEW · YOUR KEYWORDS
            </span>
            <span className="text-xs text-gray-500">
              Not live ads — generated from the title &amp; tags. For planning; edit later.
            </span>
          </div>
          <KeywordPanel title={title} tags={tags} />
        </div>
      )}
    </div>
  );
}
