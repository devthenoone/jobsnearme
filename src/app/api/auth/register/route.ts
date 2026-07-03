import { NextResponse } from "next/server";

// Public self-registration is disabled — accounts are created by the site owner
// via scripts/create-user.mjs. This closes off a path into the admin panel.
export async function POST() {
  return NextResponse.json({ error: "Registration is disabled." }, { status: 403 });
}
