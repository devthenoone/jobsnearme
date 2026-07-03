"use client";

import { useEffect, useState } from "react";
import type { Keyword } from "@/lib/keywords";

/**
 * Admin tool: lists the suggested keywords for a post and lets the admin paste a
 * destination URL next to each. Saved links make those keywords open the given
 * URL (in a new tab) on the public blog page.
 */
export default function KeywordLinkManager({
  postId,
  title,
  tags,
}: {
  postId: number;
  title: string;
  tags?: string;
}) {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  // Load the stable keyword set + any existing links.
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const params = new URLSearchParams({ title, tags: tags ?? "", tick: "0" });
      const [kwRes, linkRes] = await Promise.all([
        fetch(`/api/keywords?${params.toString()}`, { cache: "no-store" }),
        fetch(`/api/posts/links?postId=${postId}`, { cache: "no-store" }),
      ]);
      const kwJson = await kwRes.json();
      const linkJson = await linkRes.json();
      if (cancelled) return;
      setKeywords(kwJson.keywords ?? []);
      setUrls(linkJson.links ?? {});
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [postId, title, tags]);

  async function save() {
    setSaving(true);
    setMsg("");
    const links = Object.entries(urls)
      .map(([keyword, url]) => ({ keyword, url: url.trim() }))
      .filter((l) => l.url);
    const res = await fetch("/api/posts/links", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, links }),
    });
    setSaving(false);
    setMsg(res.ok ? "Links saved." : "Failed to save links.");
    setTimeout(() => setMsg(""), 2500);
  }

  const linkedCount = Object.values(urls).filter((u) => u && u.trim()).length;

  return (
    <div className="rounded-xl border bg-white p-5">
      <div className="mb-1 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Keyword links</h2>
        <span className="rounded-full bg-brand-light px-2.5 py-0.5 text-xs font-medium text-brand-dark">
          {linkedCount} linked
        </span>
      </div>
      <p className="mb-4 text-sm text-gray-500">
        Paste a URL next to any keyword. On the live post, clicking that keyword opens
        your URL in a new tab. Leave blank to fall back to in-site search.
      </p>

      {loading ? (
        <p className="py-6 text-center text-sm text-gray-400">Loading keywords…</p>
      ) : keywords.length === 0 ? (
        <p className="py-6 text-center text-sm text-gray-400">
          Add a title to generate keywords.
        </p>
      ) : (
        <>
          <div className="space-y-2">
            {keywords.map((k) => (
              <div key={k.term} className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_2fr]">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-medium text-gray-800">
                    {k.term}
                  </span>
                  {urls[k.term]?.trim() && (
                    <span className="shrink-0 rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-bold text-green-700">
                      LINKED
                    </span>
                  )}
                </div>
                <input
                  type="url"
                  placeholder="https://example.com/page"
                  value={urls[k.term] ?? ""}
                  onChange={(e) =>
                    setUrls((prev) => ({ ...prev, [k.term]: e.target.value }))
                  }
                  className="w-full rounded-lg border px-3 py-1.5 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                />
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={save}
              disabled={saving}
              className="rounded-lg bg-brand px-5 py-2 font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save links"}
            </button>
            {msg && <span className="text-sm text-gray-600">{msg}</span>}
          </div>
        </>
      )}
    </div>
  );
}
