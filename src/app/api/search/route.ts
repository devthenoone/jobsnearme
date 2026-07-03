import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export type SearchResult = {
  title: string;
  link: string;
  displayLink: string;
  snippet: string;
};

/**
 * Server-side proxy for live Google results.
 * Provider order: YOUR Google Programmable Search Engine (Custom Search JSON API,
 * if key + cx set) -> SerpApi (if SERPAPI_KEY set) -> google.com link fallback.
 * Keeping the call server-side hides the API key from the browser.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim();

  if (!q) {
    return NextResponse.json({ error: "Missing query." }, { status: 400 });
  }

  const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(q)}`;

  const key = process.env.GOOGLE_SEARCH_API_KEY;
  const cx = process.env.GOOGLE_SEARCH_ENGINE_ID;

  // --- Provider 1 (primary): your own Programmable Search Engine ---
  if (key && cx) {
    const result = await customSearch(q, googleUrl, key, cx);
    // If your engine errors/runs out of quota, fall back to SerpApi when available.
    if (result.ok || !process.env.SERPAPI_KEY) return result.response;
  }

  // --- Provider 2 (failover): SerpApi ---
  if (process.env.SERPAPI_KEY) {
    return serpApiSearch(q, googleUrl);
  }

  // --- Nothing configured -> hint + google.com fallback link ---
  return NextResponse.json(
    {
      configured: false,
      query: q,
      googleUrl,
      results: [],
      error:
        "Search is not configured. Add GOOGLE_SEARCH_API_KEY + GOOGLE_SEARCH_ENGINE_ID (your custom engine) or SERPAPI_KEY in .env.local.",
    },
    { status: 200 }
  );
}

/**
 * Query YOUR Google Programmable Search Engine via the Custom Search JSON API.
 * Returns { ok, response } so the caller can decide whether to fail over.
 * Docs: https://developers.google.com/custom-search/v1/using_rest
 */
async function customSearch(q: string, googleUrl: string, key: string, cx: string) {
  const api = new URL("https://www.googleapis.com/customsearch/v1");
  api.searchParams.set("key", key);
  api.searchParams.set("cx", cx);
  api.searchParams.set("q", q);
  api.searchParams.set("num", "6");

  try {
    const res = await fetch(api.toString(), { cache: "no-store" });
    const data = await res.json();

    if (!res.ok) {
      return {
        ok: false,
        response: NextResponse.json(
        {
          configured: true,
          query: q,
          googleUrl,
          results: [],
          error: data?.error?.message || `Google API error (${res.status}).`,
        },
        { status: 200 }
        ),
      };
    }

    const results: SearchResult[] = (data.items ?? []).map((it: any) => ({
      title: it.title,
      link: it.link,
      displayLink: it.displayLink,
      snippet: it.snippet ?? "",
    }));

    return {
      ok: true,
      response: NextResponse.json(
        {
          configured: true,
          query: q,
          googleUrl,
          provider: "custom-search",
          totalResults: data.searchInformation?.formattedTotalResults ?? null,
          searchTime: data.searchInformation?.formattedSearchTime ?? null,
          results,
        },
        { headers: { "Cache-Control": "no-store" } }
      ),
    };
  } catch {
    return {
      ok: false,
      response: NextResponse.json(
        {
          configured: true,
          query: q,
          googleUrl,
          results: [],
          error: "Failed to reach Google Custom Search.",
        },
        { status: 200 }
      ),
    };
  }
}

/**
 * Query Google via SerpApi. Docs: https://serpapi.com/search-api
 */
async function serpApiSearch(q: string, googleUrl: string) {
  const api = new URL("https://serpapi.com/search.json");
  api.searchParams.set("engine", "google");
  api.searchParams.set("q", q);
  api.searchParams.set("num", "6");
  api.searchParams.set("api_key", process.env.SERPAPI_KEY as string);

  try {
    const res = await fetch(api.toString(), { cache: "no-store" });
    const data = await res.json();

    if (!res.ok || data?.error) {
      return NextResponse.json(
        {
          configured: true,
          query: q,
          googleUrl,
          results: [],
          error: data?.error || `SerpApi error (${res.status}).`,
        },
        { status: 200 }
      );
    }

    const results: SearchResult[] = (data.organic_results ?? [])
      .slice(0, 6)
      .map((it: any) => ({
        title: it.title,
        link: it.link,
        displayLink: it.displayed_link || it.source || "",
        snippet: it.snippet ?? "",
      }));

    const total = data.search_information?.total_results;

    return NextResponse.json(
      {
        configured: true,
        query: q,
        googleUrl,
        totalResults: typeof total === "number" ? total.toLocaleString() : null,
        searchTime: data.search_information?.time_taken_displayed
          ? `${data.search_information.time_taken_displayed}s`
          : null,
        results,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json(
      {
        configured: true,
        query: q,
        googleUrl,
        results: [],
        error: "Failed to reach SerpApi.",
      },
      { status: 200 }
    );
  }
}
