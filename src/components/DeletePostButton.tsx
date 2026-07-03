"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeletePostButton({ id }: { id: number }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function remove() {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    setBusy(true);
    await fetch("/api/posts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setBusy(false);
    router.refresh();
  }

  return (
    <button
      onClick={remove}
      disabled={busy}
      className="text-red-500 hover:underline disabled:opacity-50"
    >
      {busy ? "Deleting…" : "Delete"}
    </button>
  );
}
