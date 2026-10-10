import { getProducts, getCategories, getPressReleases } from '@/lib/cms';

/**
 * SEO DATA HELPERS (Server-Only)
 * Single source of truth for "what may be indexed", shared by sitemap,
 * llms-full.txt, page metadata and JSON-LD.
 *
 * Optional CMS fields (plain attributes, DynamoDB is schemaless):
 *   products:   canonical_slug, seo_noindex, seo_title, seo_description
 *   categories: seo_noindex, seo_title, seo_description
 *   press:      seo_title, seo_description
 * Both snake_case and camelCase spellings are read.
 */

const pick = (obj, snake, camel) => obj?.[snake] ?? obj?.[camel];

export const seoNoindex = (item) => pick(item, 'seo_noindex', 'seoNoindex') === true;
export const seoTitle = (item) => cleanStr(pick(item, 'seo_title', 'seoTitle'));
export const seoDescription = (item) => cleanStr(pick(item, 'seo_description', 'seoDescription'));

/** Slug this product is a duplicate of, or null. A self-reference is ignored. */
export function canonicalSlugOf(product) {
  const target = cleanStr(pick(product, 'canonical_slug', 'canonicalSlug'));
  return target && target !== product.slug ? target : null;
}

function cleanStr(v) {
  return typeof v === 'string' && v.trim() ? v.trim() : null;
}

export const isIndexableProduct = (p) => !!p?.slug && !canonicalSlugOf(p) && !seoNoindex(p);

/** Latest valid timestamp among the given values, as a Date (or undefined). */
export function latestDate(...values) {
  let best;
  for (const v of values) {
    const t = v ? Date.parse(v) : NaN;
    if (!Number.isNaN(t) && (best === undefined || t > best)) best = t;
  }
  return best === undefined ? undefined : new Date(best);
}

export const lastModifiedOf = (item) =>
  latestDate(item?.updated_at, item?.updatedAt, item?.created_at, item?.createdAt, item?.date);

/**
 * Everything the sitemap / llms-full need, from one cached read each.
 * - products: active, not duplicate (canonical_slug), not noindex
 * - brands:   categories with >= 1 indexable product and not noindex
 * - press:    releases that have a slug (never UUID URLs)
 *
 * The AWS API returns full lists (no 1000-row cap), so no pagination is needed here.
 */
export async function getIndexableContent() {
  const [allProducts, categories, press] = await Promise.all([
    getProducts(),
    getCategories(),
    getPressReleases(),
  ]);

  const products = allProducts.filter(isIndexableProduct);

  const countByBrand = new Map();
  for (const p of products) {
    if (p.category) countByBrand.set(p.category, (countByBrand.get(p.category) || 0) + 1);
  }

  const brands = categories
    .filter((c) => c.slug && !seoNoindex(c) && (countByBrand.get(c.slug) || 0) > 0)
    .map((c) => ({ ...c, indexableProductCount: countByBrand.get(c.slug) }));

  const releases = press.filter((r) => r.slug);

  return { products, brands, releases, countByBrand };
}

/** Press release by slug, or by id/pressId (legacy UUID URLs). Reads the cached list. */
export async function findPressRelease(idOrSlug) {
  const all = await getPressReleases();
  return (
    all.find((r) => r.slug === idOrSlug) ||
    all.find((r) => r.id === idOrSlug || r.pressId === idOrSlug) ||
    null
  );
}
