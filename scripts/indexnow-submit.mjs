/**
 * Submit every URL in the live sitemap to IndexNow (e.g. after launch or a big import).
 *   INDEXNOW_KEY=<key> node scripts/indexnow-submit.mjs [siteUrl]
 * No-op when INDEXNOW_KEY is unset. The key file public/<key>.txt must be deployed first.
 */
const key = process.env.INDEXNOW_KEY;
if (!key) {
  console.log('INDEXNOW_KEY not set, nothing to do.');
  process.exit(0);
}
const site = (process.argv[2] || 'https://cinemafocus.in').replace(/\/$/, '');
const xml = await (await fetch(`${site}/sitemap.xml`)).text();
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: new URL(site).host, key, keyLocation: `${site}/${key}.txt`, urlList }),
});
console.log(`Submitted ${urlList.length} URLs -> HTTP ${res.status}`);
process.exit(res.ok || res.status === 202 ? 0 : 1);
