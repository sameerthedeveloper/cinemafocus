import { NextResponse } from 'next/server';

/**
 * SEO ROUTE GATE (used by proxy.js)
 *
 * Route-level `loading.jsx` streams the page shell with HTTP 200 before a page can
 * call redirect()/notFound(), so those calls only produce meta-refresh / soft 404s.
 * To return real status codes we resolve them here, before rendering:
 *   - /press/<uuid>              -> 308 /press/<slug>
 *   - /products/<dup>            -> 308 /products/<canonical_slug>
 *   - unknown product/press/brand -> 404 (app/not-found.jsx)
 *
 * Fails open: if the index cannot be loaded the request continues to the page,
 * which still does its own redirect()/notFound().
 */

const TTL_MS = 5 * 60_000;
let cache = { at: 0, index: null };
let inflight = null;

const get = async (base, path) => {
  const res = await fetch(`${base}${path}`, { signal: AbortSignal.timeout(5000) });
  if (!res.ok) throw new Error(`${path} -> ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error(`${path} -> not an array`);
  return data;
};

async function buildIndex() {
  const base = process.env.API_GATEWAY_URL?.replace(/\/$/, '');
  if (!base) return null;

  const [products, categories, press] = await Promise.all([
    get(base, '/products'),
    get(base, '/categories'),
    get(base, '/press-releases'),
  ]);

  const activeProducts = new Map(); // slug -> canonical slug | null
  for (const p of products) {
    if (!p.slug || p.is_active === false || p.isActive === false) continue;
    const target = p.canonical_slug ?? p.canonicalSlug;
    activeProducts.set(p.slug, typeof target === 'string' && target.trim() && target !== p.slug ? target.trim() : null);
  }

  const brands = new Set(categories.map((c) => c.slug).filter(Boolean));

  const pressSlugs = new Set();
  const pressIdToSlug = new Map();
  for (const r of press) {
    if (r.slug) pressSlugs.add(r.slug);
    const id = r.pressId ?? r.id;
    if (id && r.slug) pressIdToSlug.set(id, r.slug);
  }

  return { activeProducts, brands, pressSlugs, pressIdToSlug };
}

async function getIndex() {
  const now = Date.now();
  if (cache.index && now - cache.at < TTL_MS) return cache.index;
  if (!inflight) {
    inflight = buildIndex()
      .then((index) => {
        if (index) cache = { at: Date.now(), index };
        return index;
      })
      .catch((e) => {
        console.error('SEO route index failed, failing open:', e.message);
        return cache.index; // stale is better than nothing
      })
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

const ROUTE_RE = /^\/(products|press|brand)\/([^/]+)$/;

export async function seoRouteGate(request) {
  const { pathname } = request.nextUrl;
  const match = ROUTE_RE.exec(pathname);
  if (!match) return null;

  const [, section, rawParam] = match;
  let param;
  try {
    param = decodeURIComponent(rawParam);
  } catch {
    return null;
  }

  const index = await getIndex();
  if (!index) return null;

  const redirectTo = (path) => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    return NextResponse.redirect(url, 308);
  };
  const notFound = () => NextResponse.rewrite(new URL('/__not-found', request.url), { status: 404 });

  if (section === 'products') {
    if (!index.activeProducts.has(param)) return notFound();
    const target = index.activeProducts.get(param);
    // Only follow canonical_slug to a product that exists and is not itself a redirect.
    if (target && index.activeProducts.has(target) && !index.activeProducts.get(target)) {
      return redirectTo(`/products/${encodeURIComponent(target)}`);
    }
    return null;
  }

  if (section === 'press') {
    if (index.pressSlugs.has(param)) return null;
    const slug = index.pressIdToSlug.get(param);
    return slug ? redirectTo(`/press/${encodeURIComponent(slug)}`) : notFound();
  }

  // brand
  return index.brands.has(param) ? null : notFound();
}
