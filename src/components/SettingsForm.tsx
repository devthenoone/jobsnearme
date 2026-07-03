"use client";

import { useState } from "react";

export default function SettingsForm({
  initial,
}: {
  initial: Record<string, string>;
}) {
  const [pubId, setPubId] = useState(initial.adsense_pub_id ?? "");
  const [styleId, setStyleId] = useState(initial.rsoc_style_id ?? "");
  const [showPreview, setShowPreview] = useState(
    initial.show_keyword_preview !== "false"
  );
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  async function save() {
    setSaving(true);
    setMsg("");
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        adsense_pub_id: pubId.trim(),
        rsoc_style_id: styleId.trim(),
        show_keyword_preview: showPreview ? "true" : "false",
      }),
    });
    setSaving(false);
    setMsg(res.ok ? "Saved. Reload a blog post to see changes." : "Failed to save.");
    setTimeout(() => setMsg(""), 4000);
  }

  const configured = pubId.trim() && styleId.trim();

  return (
    <div className="max-w-2xl space-y-6">
      <div className="rounded-xl border bg-white p-6">
        <h2 className="text-lg font-bold text-gray-900">AdSense for Search (RSoC)</h2>
        <p className="mt-1 text-sm text-gray-500">
          Paste your Google AdSense keys here. They are stored in the site database and
          used to serve the live related-search ad unit — no code changes needed.
        </p>

        <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
          <p className="font-semibold">How the keywords work</p>
          <p className="mt-1 text-blue-800">
            These keys only <strong>connect your Google account</strong>. <strong>Google
            selects which related keywords to show and serves the ads</strong> — the site
            never picks them. This is what keeps the unit within Google&apos;s AdSense for
            Search policies.
          </p>
          <p className="mt-2 text-blue-800">
            Requires your AdSense account to be <strong>approved for RSoC</strong> (a
            restricted feature) before ads appear.
          </p>
        </div>

        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">
              Publisher ID
            </span>
            <input
              value={pubId}
              onChange={(e) => setPubId(e.target.value)}
              placeholder="partner-pub-1234567890123456"
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">
              RSoC Style ID
            </span>
            <input
              value={styleId}
              onChange={(e) => setStyleId(e.target.value)}
              placeholder="1234567890"
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
            />
          </label>

          <div
            className={`rounded-lg px-3 py-2 text-xs ${
              configured
                ? "bg-green-50 text-green-700"
                : "bg-amber-50 text-amber-700"
            }`}
          >
            {configured
              ? "✓ Keys set — the live AdSense unit will render on posts (requires Google RSoC approval to serve ads)."
              : "Not configured yet — the live unit stays hidden until both keys are set."}
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-6">
        <h2 className="text-lg font-bold text-gray-900">Keyword preview</h2>
        <label className="mt-3 flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={showPreview}
            onChange={(e) => setShowPreview(e.target.checked)}
          />
          Show the local “your keywords” preview block under the live unit
        </label>
        <p className="mt-2 text-xs text-gray-500">
          Turn this OFF in production so a look-alike never sits next to real AdSense
          ads (AdSense policy).
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={save}
          disabled={saving}
          className="rounded-lg bg-brand px-5 py-2.5 font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save settings"}
        </button>
        {msg && <span className="text-sm text-gray-600">{msg}</span>}
      </div>
    </div>
  );
}
