export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export function uniqueSlug(base: string, exists: (slug: string) => boolean): string {
  const root = slugify(base) || "post";
  let candidate = root;
  let n = 2;
  while (exists(candidate)) {
    candidate = `${root}-${n++}`;
  }
  return candidate;
}
