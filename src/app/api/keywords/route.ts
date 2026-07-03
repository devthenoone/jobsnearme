import { NextResponse } from "next/server";
import { generateKeywords, KEYWORD_DISCLAIMER } from "@/lib/keywords";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") ?? "";
  const tags = (searchParams.get("tags") ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  // `tick` lets the client request the next live snapshot. If omitted we derive
  // one from the current time so the data still drifts on its own.
  const tickParam = searchParams.get("tick");
  const tick = tickParam !== null ? Number(tickParam) || 0 : Math.floor(Date.now() / 5000);

  const limit = Math.min(40, Math.max(1, Number(searchParams.get("limit")) || 10));
  const keywords = generateKeywords(title, tags, tick, limit);

  return NextResponse.json(
    {
      keywords,
      tick,
      updatedAt: new Date().toISOString(),
      disclaimer: KEYWORD_DISCLAIMER,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
