import { redirect } from "next/navigation";

// Public sign-up is disabled — the admin panel is invite-only. Create accounts
// with `node scripts/create-user.mjs <email> <password> "<name>"`.
export default function RegisterPage() {
  redirect("/login");
}
