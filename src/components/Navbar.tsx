import Link from "next/link";
import { cseUrl } from "@/lib/cse";

const browseJobs = [
  "Remote Jobs",
  "Part Time Jobs",
  "Full Time Jobs",
  "Warehouse Jobs",
  "Work From Home Jobs",
];
const categories = [
  "Technology Jobs",
  "Healthcare Jobs",
  "Driving Jobs",
  "Construction Jobs",
  "Office Jobs",
  "Education Jobs",
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-extrabold">
          <span className="text-blue-600">Jobs</span>
          <span className="text-gray-900">NearMe</span>
        </Link>

        <div className="hidden items-center gap-1 text-sm font-medium text-gray-700 md:flex">
          <Link href="/" className="rounded px-3 py-2 hover:text-blue-600">
            Home
          </Link>

          <Dropdown label="Browse Jobs" items={browseJobs} />
          <Dropdown label="Job Categories" items={categories} />

          <Link href="/blogs" className="rounded px-3 py-2 hover:text-blue-600">
            Career Guides
          </Link>
          <Link href="/blogs" className="rounded px-3 py-2 hover:text-blue-600">
            Resume Tips
          </Link>
          <Link href="/about" className="rounded px-3 py-2 hover:text-blue-600">
            About Us
          </Link>
        </div>

        <Link
          href="/login"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
            <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
            <path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Login
        </Link>
      </nav>
    </header>
  );
}

function Dropdown({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="group relative">
      <button className="flex items-center gap-1 rounded px-3 py-2 hover:text-blue-600">
        {label}
        <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div className="invisible absolute left-0 top-full z-50 w-56 translate-y-1 rounded-xl border bg-white p-2 opacity-0 shadow-lg transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
        {items.map((it) => (
          <a
            key={it}
            href={cseUrl(`${it} near me`)}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700"
          >
            {it}
          </a>
        ))}
      </div>
    </div>
  );
}
