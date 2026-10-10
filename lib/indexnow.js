import { SITE, absoluteUrl } from '@/lib/site';

/**
 * INDEXNOW (Bing, Yandex, Seznam, Naver...). No-op unless INDEXNOW_KEY is set.
 * The key file must be served at `${SITE.url}/<key>.txt` (see public/).
 */

const ENDPOINT = 'https://api.indexnow.org/indexnow';

export async function submitUrls(urls) {
  const key = process.env.INDEXNOW_KEY;
  if (!key || !urls?.length) return { skipped: true };

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: new URL(SITE.url).host,
      key,
      keyLocation: `${SITE.url}/${key}.txt`,
      urlList: urls.slice(0, 10000),
    }),
    signal: AbortSignal.timeout(8000),
  });
  return { status: res.status, submitted: urls.length };
}

let lastRun = 0;
const MIN_GAP_MS = 5 * 60_000;

/**
 * Called after an admin publish. Submits pages modified in the last 24h
 * (home, products, press list included), at most once per 5 minutes per instance.
 * Never throws.
 */
export async function pingRecentlyChanged() {
  if (!process.env.INDEXNOW_KEY) return;
  const now = Date.now();
  if (now - lastRun < MIN_GAP_MS) return;
  lastRun = now;

  try {
    const { getIndexableContent, lastModifiedOf } = await import('@/lib/seo');
    const { products, brands, releases } = await getIndexableContent();
    const since = now - 24 * 3600_000;
    const recent = (items, prefix) =>
      items.filter((i) => (lastModifiedOf(i)?.getTime() ?? 0) >= since).map((i) => absoluteUrl(`${prefix}/${i.slug}`));
    const urls = [...recent(products, '/products'), ...recent(brands, '/brand'), ...recent(releases, '/press')];
    if (urls.length) urls.push(absoluteUrl('/'), absoluteUrl('/products'));
    await submitUrls(urls);
  } catch (e) {
    console.error('IndexNow ping failed:', e);
  }
}
