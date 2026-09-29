import { NextResponse } from "next/server";

/**
 * Read-only, cacheable proxy for PUBLIC catalogue data used by client components.
 * Kept separate from /api/aws (admin, authenticated, never cached) so an edge
 * cache keyed by URL can never serve an admin a stale or anonymous response.
 * Only allow-listed GET paths are forwarded, and no auth token is ever attached.
 */
const API_BASE = process.env.API_GATEWAY_URL;

const ALLOWED = [
  /^products(\/[^/]+)?$/,
  /^categories$/,
  /^new-launches$/,
  /^projects$/,
  /^press-releases(\/[^/]+)?$/,
  /^site-settings\/[a-z_]+$/,
];

export async function GET(request, { params }) {
  const headers = { "Content-Type": "application/json", "X-Robots-Tag": "noindex" };
  const { path } = await params;
  const joined = path.join("/");

  if (!ALLOWED.some((re) => re.test(joined))) {
    return NextResponse.json({ error: "Not found" }, { status: 404, headers });
  }
  if (!API_BASE) {
    return NextResponse.json({ error: "AWS API is not configured" }, { status: 503, headers });
  }

  const url = new URL(request.url);
  const res = await fetch(`${API_BASE}/${joined}${url.search}`, { headers: { "Content-Type": "application/json" } });
  const text = await res.text();

  // Brief edge caching protects the small Lambda concurrency limit.
  headers["Cache-Control"] = res.ok
    ? "public, s-maxage=60, stale-while-revalidate=300"
    : "no-store";

  return new NextResponse(text, { status: res.status, headers });
}
