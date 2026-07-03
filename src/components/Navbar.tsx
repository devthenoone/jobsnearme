import Link from "next/link";

// Public site navigation. The admin panel is intentionally separate (at /admin),
// so no Sign in / Sign up buttons appear here.
export default function Navbar() {
  return (
    <header className="border-b bg-white">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-brand">
          <span className="grid h-7 w-7 place-items-center rounded bg-brand text-white">J</span>
          JobsNearMe
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link href="/" className="text-gray-600 hover:text-brand">
            Home
          </Link>
          <Link href="/blogs" className="text-gray-600 hover:text-brand">
            Blogs
          </Link>
          <Link href="/about" className="text-gray-600 hover:text-brand">
            About
          </Link>
          <Link href="/contact" className="text-gray-600 hover:text-brand">
            Contact us
          </Link>
        </div>
      </nav>
    </header>
  );
}
