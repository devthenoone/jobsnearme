"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const body: Record<string, string> = {
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
    };
    if (mode === "register") body.name = String(form.get("name") ?? "");

    const res = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setError(json.error || "Something went wrong.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {mode === "login"
            ? "Log in to write and manage your posts."
            : "Sign up to start publishing with live keyword insights."}
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          {mode === "register" && (
            <Field label="Name" name="name" type="text" placeholder="Jane Doe" />
          )}
          <Field label="Email" name="email" type="email" placeholder="you@example.com" />
          <Field
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
          />

          {error && (
            <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-brand py-2.5 font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
          >
            {loading ? "Please wait…" : mode === "login" ? "Log in" : "Sign up"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type,
  placeholder,
}: {
  label: string;
  name: string;
  type: string;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-gray-700">{label}</span>
      <input
        name={name}
        type={type}
        required
        placeholder={placeholder}
        className="w-full rounded-lg border px-3 py-2 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
      />
    </label>
  );
}
