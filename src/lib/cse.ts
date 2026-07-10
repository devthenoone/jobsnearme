// Your Google Programmable Search Engine (Custom Search Engine) id.
export const CSE_CX = process.env.NEXT_PUBLIC_CSE_CX || "811d652cb3cdc4b68";

/**
 * URL that searches a query on YOUR Google Custom Search Engine.
 * Points to the in-site /search page, which loads your engine (cx) and runs the
 * exact query — reliable, and branded "Enhanced by Google". Open it in a new tab.
 */
export function cseUrl(query: string): string {
  return `/search?q=${encodeURIComponent(query)}`;
}
