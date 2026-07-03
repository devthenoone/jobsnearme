import { NextResponse } from "next/server";
import { one, type UserRow } from "@/lib/db";
import { verifyPassword, createSession } from "@/lib/auth";

export async function POST(req: Request) {
  const { email, password } = await req.json().catch(() => ({}));

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required." }, { status: 400 });
  }

  const normEmail = String(email).trim().toLowerCase();
  const user = await one<UserRow>("SELECT * FROM users WHERE email = ?", [normEmail]);

  if (!user || !(await verifyPassword(String(password), user.password))) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  await createSession({ id: user.id, email: user.email, name: user.name });
  return NextResponse.json({ ok: true });
}
