"use client";

import { useState } from "react";

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Demo only — no backend. Wire this to email/an API when ready.
    setSent(true);
  }

  if (sent) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-sm text-green-800">
        ✓ Thanks! Your message has been received. We&apos;ll get back to you soon.
        <p className="mt-2 text-xs text-green-700">
          (Demo form — connect it to an email service or API to receive messages.)
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-xl border bg-white p-6">
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">Name</span>
        <input
          required
          className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
          placeholder="Your name"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">Email</span>
        <input
          required
          type="email"
          className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
          placeholder="you@example.com"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">Message</span>
        <textarea
          required
          rows={5}
          className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
          placeholder="How can we help?"
        />
      </label>
      <button
        type="submit"
        className="rounded-lg bg-brand px-5 py-2.5 font-semibold text-white hover:bg-brand-dark"
      >
        Send message
      </button>
    </form>
  );
}
