import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getSettings, setSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  return NextResponse.json({ settings: getSettings() });
}

export async function PUT(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }
  setSettings(body as Record<string, string>);
  return NextResponse.json({ ok: true, settings: getSettings() });
}
