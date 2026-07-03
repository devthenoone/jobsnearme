import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="text-5xl font-bold text-brand">404</h1>
      <p className="mt-3 text-gray-600">This page could not be found.</p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-lg bg-brand px-5 py-2.5 font-semibold text-white hover:bg-brand-dark"
      >
        Back home
      </Link>
    </div>
  );
}
