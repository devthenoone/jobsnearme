import Link from "next/link";
import { listPublished } from "@/lib/posts";
import { cseUrl } from "@/lib/cse";
import GoogleJobSearch from "@/components/GoogleJobSearch";

export const dynamic = "force-dynamic";

const trending = [
  "Remote Jobs",
  "Warehouse Jobs",
  "Nurse Jobs",
  "Driver Jobs",
  "Part Time Jobs",
  "Customer Service",
  "Government Jobs",
];

const categories = [
  { name: "Technology", icon: "💻", count: "2,458", color: "bg-blue-50" },
  { name: "Healthcare", icon: "❤️", count: "1,870", color: "bg-red-50" },
  { name: "Driving", icon: "🚚", count: "2,135", color: "bg-green-50" },
  { name: "Construction", icon: "👷", count: "1,246", color: "bg-orange-50" },
  { name: "Office Jobs", icon: "💼", count: "3,245", color: "bg-purple-50" },
  { name: "Education", icon: "🎓", count: "1,786", color: "bg-indigo-50" },
  { name: "Restaurant", icon: "🍴", count: "2,012", color: "bg-yellow-50" },
  { name: "Retail", icon: "🛍️", count: "1,987", color: "bg-pink-50" },
];

const sidebarTrending = [
  "Remote Jobs",
  "Part Time Jobs",
  "Warehouse Jobs",
  "Work From Home Jobs",
  "Teaching Jobs",
  "Government Jobs",
  "Delivery Driver Jobs",
  "Customer Service Jobs",
];

const locations = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Houston",
  "Dallas",
  "Miami",
  "Austin",
];

export default async function Home() {
  const posts = await listPublished();
  const guides = posts.slice(0, 4);

  return (
    <div className="bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white px-4 py-14">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Find Jobs Near You
          </h1>
          <p className="mt-3 text-gray-600">
            Search thousands of jobs from top employers in your area.
          </p>
          <div className="mt-6">
            <GoogleJobSearch variant="hero" />
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1fr_320px]">
        {/* Main column */}
        <main className="min-w-0 space-y-10">
          {/* Trending searches */}
          <section className="rounded-2xl border bg-white p-6">
            <h2 className="mb-4 text-lg font-bold text-gray-900">Trending Searches</h2>
            <div className="flex flex-wrap gap-3">
              {trending.map((t) => (
                <a
                  key={t}
                  href={cseUrl(`${t} near me`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3.5 py-2 text-sm text-gray-700 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700"
                >
                  <SearchIcon /> {t}
                </a>
              ))}
            </div>
          </section>

          {/* Popular categories */}
          <section>
            <h2 className="mb-4 text-xl font-bold text-gray-900">Popular Job Categories</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {categories.map((c) => (
                <a
                  key={c.name}
                  href={cseUrl(`${c.name} jobs near me`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-xl border bg-white p-5 text-center transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
                >
                  <div
                    className={`mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl ${c.color} text-2xl`}
                  >
                    {c.icon}
                  </div>
                  <div className="font-semibold text-gray-900 group-hover:text-blue-700">
                    {c.name}
                  </div>
                  <div className="mt-0.5 text-xs text-gray-500">{c.count} Jobs</div>
                </a>
              ))}
            </div>
            <div className="mt-6 text-center">
              <a
                href={cseUrl("jobs near me")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Browse All Categories
              </a>
            </div>
          </section>

          {/* Career guides */}
          {guides.length > 0 && (
            <section>
              <h2 className="mb-4 text-xl font-bold text-gray-900">Latest Career Guides</h2>
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
                {guides.map((g, i) => (
                  <Link
                    key={g.id}
                    href={`/blog/${g.slug}`}
                    className="group overflow-hidden rounded-xl border bg-white transition hover:shadow-md"
                  >
                    <div
                      className={`h-28 bg-gradient-to-br ${
                        ["from-blue-400 to-indigo-500", "from-emerald-400 to-teal-500", "from-orange-400 to-rose-500", "from-violet-400 to-purple-500"][i % 4]
                      }`}
                    />
                    <div className="p-4">
                      <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-blue-700">
                        {g.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-xs text-gray-500">{g.excerpt}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Newsletter */}
          <section className="rounded-2xl bg-blue-50 p-6">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="flex items-center gap-3">
                <span className="text-3xl">✉️</span>
                <div>
                  <h3 className="font-bold text-gray-900">
                    Get the latest job updates in your inbox
                  </h3>
                  <p className="text-sm text-gray-600">
                    Subscribe now and never miss any opportunity.
                  </p>
                </div>
              </div>
              <form className="flex w-full max-w-sm gap-2" action="#">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <button className="shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                  Subscribe
                </button>
              </form>
            </div>
          </section>
        </main>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="rounded-2xl border bg-white p-5">
            <h3 className="mb-3 font-bold text-gray-900">Search Jobs</h3>
            <GoogleJobSearch variant="sidebar" />
          </div>

          <SidebarList
            title="Trending Searches"
            items={sidebarTrending.map((t) => ({ label: t, href: cseUrl(`${t} near me`) }))}
            chevron
          />

          <SidebarList
            title="Popular Locations"
            items={locations.map((l) => ({
              label: `Jobs in ${l}`,
              href: cseUrl(`jobs in ${l}`),
              pin: true,
            }))}
          />

          {guides.length > 0 && (
            <div className="rounded-2xl border bg-white p-5">
              <h3 className="mb-3 font-bold text-gray-900">Recent Guides</h3>
              <ul className="space-y-3">
                {guides.map((g, i) => (
                  <li key={g.id}>
                    <Link href={`/blog/${g.slug}`} className="flex items-center gap-3 group">
                      <span
                        className={`h-11 w-14 shrink-0 rounded-md bg-gradient-to-br ${
                          ["from-blue-400 to-indigo-500", "from-emerald-400 to-teal-500", "from-orange-400 to-rose-500", "from-violet-400 to-purple-500"][i % 4]
                        }`}
                      />
                      <span className="line-clamp-2 text-sm font-medium text-gray-700 group-hover:text-blue-700">
                        {g.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-gray-400">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SidebarList({
  title,
  items,
  chevron,
}: {
  title: string;
  items: { label: string; href: string; pin?: boolean }[];
  chevron?: boolean;
}) {
  return (
    <div className="rounded-2xl border bg-white p-5">
      <h3 className="mb-3 font-bold text-gray-900">{title}</h3>
      <ul className="divide-y">
        {items.map((it) => (
          <li key={it.label}>
            <a
              href={it.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between py-2.5 text-sm text-gray-700 hover:text-blue-700"
            >
              <span className="flex items-center gap-2">
                {it.pin && <span className="text-blue-500">📍</span>}
                {it.label}
              </span>
              {chevron && <span className="text-gray-300">›</span>}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
