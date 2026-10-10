import { SITE } from '@/lib/site';
import { getAeoGeoResolved } from '@/lib/aeoGeo';
import { getIndexableContent, lastModifiedOf, latestDate } from '@/lib/seo';

// Rebuilt at most hourly; matches the CMS cache window.
export const revalidate = 3600;

const STATIC_ROUTES = ['/about', '/contact', '/gallery', '/location'];

export default async function sitemap() {
  let products = [];
  let brands = [];
  let releases = [];
  let faqs = [];
  try {
    [{ products, brands, releases }, { faqs }] = await Promise.all([getIndexableContent(), getAeoGeoResolved()]);
  } catch (error) {
    // Fail the request rather than publish a sitemap with no dynamic URLs;
    // crawlers retry, and a thin sitemap can de-index pages.
    console.error('Sitemap data fetch failed:', error);
    throw error;
  }

  const entry = (path, lastModified) => ({
    url: `${SITE.url}${path}`,
    ...(lastModified ? { lastModified } : {}),
  });

  const newest = (items) => latestDate(...items.map((i) => lastModifiedOf(i)?.toISOString()));

  return [
    entry('', newest([...products, ...releases])),
    ...STATIC_ROUTES.map((r) => entry(r)),
    ...(faqs.length ? [entry('/faq')] : []),
    entry('/press', newest(releases)),
    entry('/products', newest(products)),
    ...brands.map((b) => entry(`/brand/${b.slug}`, lastModifiedOf(b))),
    ...products.map((p) => entry(`/products/${p.slug}`, lastModifiedOf(p))),
    ...releases.map((r) => entry(`/press/${r.slug}`, lastModifiedOf(r))),
  ];
}
