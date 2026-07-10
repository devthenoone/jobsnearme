import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };

// Dedicated admin entry link. Sends signed-in admins to the dashboard,
// otherwise to the login page (which returns here-equivalent after auth).
export default async function AdminEntry() {
  const user = await getCurrentUser();
  redirect(user ? "/dashboard" : "/login");
}
