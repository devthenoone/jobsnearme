import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-6 md:grid-cols-[210px_1fr]">
        <aside className="md:sticky md:top-8 md:self-start">
          <div className="rounded-xl border bg-white p-4">
            <p className="px-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Admin
            </p>
            <nav className="mt-2 space-y-1 text-sm">
              <NavLink href="/dashboard" label="Overview" icon="▤" />
              <NavLink href="/dashboard/new" label="New post" icon="✎" />
              <NavLink href="/dashboard/settings" label="Settings" icon="⚙" />
              <NavLink href="/" label="View site ↗" icon="🌐" />
            </nav>
            <div className="mt-4 border-t pt-3">
              <p className="px-2 text-xs text-gray-500">Signed in as</p>
              <p className="truncate px-2 text-sm font-medium text-gray-800">
                {user.name}
              </p>
              <p className="truncate px-2 text-xs text-gray-400">{user.email}</p>
            </div>
          </div>
        </aside>

        <section className="min-w-0">{children}</section>
      </div>
    </div>
  );
}

function NavLink({ href, label, icon }: { href: string; label: string; icon: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-700 hover:bg-brand-light hover:text-brand-dark"
    >
      <span className="text-xs opacity-70">{icon}</span>
      {label}
    </Link>
  );
}
