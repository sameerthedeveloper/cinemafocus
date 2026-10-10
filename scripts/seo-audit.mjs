/**
 * Crawl-level SEO audit of a running build.
 *   npx next start -p 3100 &  node scripts/seo-audit.mjs [baseUrl]
 * Checks: sitemap XML, robots.txt, every sitemap URL (200, canonical == URL, unique title/description,
 * one h1, noindex absent), internal links (no 404s, no redirect chains), legacy redirects,
 * private routes protected. Exit 1 on any failure.
 */
import http from 'node:http';

const base = (process.argv[2] || 'http://localhost:3100').replace(/\/$/, '');
const PROD = 'https://cinemafocus.in';
const fails = [];
const warns = [];
const fail = (m) => fails.push(m);
const warn = (m) => warns.push(m);

const local = (u) => u.replace(PROD, base);
const get = (u, opts = {}) => fetch(local(u), { redirect: 'manual', ...opts });

// ── sitemap ──────────────────────────────────────────────────────────────
const sm = await (await get(`${base}/sitemap.xml`)).text();
if (!sm.startsWith('<?xml') || !sm.includes('<urlset')) fail('sitemap.xml is not a valid urlset');
const urls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (new Set(urls).size !== urls.length) fail('sitemap has duplicate <loc> entries');
if (urls.some((u) => !u.startsWith(PROD))) fail('sitemap has non-canonical host URLs');
console.log(`sitemap: ${urls.length} URLs`);

// ── robots ───────────────────────────────────────────────────────────────
const robots = await (await get(`${base}/robots.txt`)).text();
for (const need of ['Disallow: /admin/', 'Disallow: /portal/', 'Disallow: /api/', `Sitemap: ${PROD}/sitemap.xml`, 'User-Agent: OAI-SearchBot', 'User-Agent: Claude-SearchBot', 'User-Agent: Claude-User', 'User-Agent: PerplexityBot'])
  if (!robots.includes(need)) fail(`robots.txt missing "${need}"`);
if (/Disallow: \/(_next|images|static)/i.test(robots)) fail('robots.txt blocks render resources');

// ── pages ────────────────────────────────────────────────────────────────
const titles = new Map();
const descs = new Map();
const internal = new Map(); // href -> first page
for (const url of urls) {
  const res = await get(url);
  if (res.status !== 200) {
    fail(`${url}: HTTP ${res.status}`);
    continue;
  }
  const html = await res.text();
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
  const canon = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  if (!title) fail(`${url}: no <title>`);
  else (titles.get(title) || titles.set(title, []).get(title)).push(url);
  if (!desc) fail(`${url}: no meta description`);
  else (descs.get(desc) || descs.set(desc, []).get(desc)).push(url);
  if (canon !== url) fail(`${url}: canonical is ${canon}`);
  if (h1s !== 1) warn(`${url}: ${h1s} <h1> elements`);
  if (/<meta name="robots" content="[^"]*noindex/.test(html)) fail(`${url}: in sitemap but noindex`);
  for (const m of html.matchAll(/<a [^>]*href="(\/[^"#?]*)"/g)) if (!internal.has(m[1])) internal.set(m[1], url);
}
for (const [t, list] of titles) if (list.length > 1) fail(`duplicate title "${t}" on ${list.length} pages (${list.slice(0, 3).join(', ')})`);
for (const [d, list] of descs) if (list.length > 1) warn(`duplicate description on ${list.length} pages (${list.slice(0, 3).join(', ')})`);

// ── internal links ───────────────────────────────────────────────────────
const SKIP = /^\/(admin|portal|api|_next)\b/;
for (const [href, from] of internal) {
  if (SKIP.test(href) || /\.(png|jpe?g|webp|svg|ico|pdf|txt|xml|webmanifest)$/i.test(href)) continue;
  const res = await get(`${PROD}${href}`);
  if (res.status >= 400) fail(`broken internal link ${href} (HTTP ${res.status}) linked from ${from}`);
  else if (res.status >= 300) {
    const next = res.headers.get('location') || '';
    const res2 = await fetch(new URL(next, base), { redirect: 'manual' });
    warn(`internal link ${href} redirects (${res.status}) -> ${next}${res2.status >= 300 ? ' -> another redirect (chain)' : ''}; linked from ${from}`);
  }
}

// ── redirects ────────────────────────────────────────────────────────────
const redirects = [
  ['/product-category/atc', '/brand/atc'], ['/category/atc', '/brand/atc'], ['/shop/a20', '/products/a20'],
  ['/product/a20', '/products/a20'], ['/shop', '/products'], ['/contact-us', '/contact'], ['/about-us', '/about'], ['/brands/atc', '/brand/atc'],
];
for (const [from, to] of redirects) {
  const res = await get(`${PROD}${from}`);
  const loc = res.headers.get('location') || '';
  if (![301, 308].includes(res.status) || !loc.endsWith(to)) fail(`redirect ${from}: ${res.status} -> ${loc} (expected ${to})`);
}
// fetch() cannot override Host, so use node:http
const www = await new Promise((resolve, reject) => {
  const u = new URL(base);
  http
    .get({ host: u.hostname, port: u.port, path: '/about', headers: { Host: 'www.cinemafocus.in' } }, (r) => {
      r.resume();
      resolve({ status: r.statusCode, location: r.headers.location });
    })
    .on('error', reject);
});
// www -> apex is configured in the Vercel Domains setting, so it can only be checked against production
if (base.includes('cinemafocus.in') && (www.status !== 301 && www.status !== 308 || www.location !== `${PROD}/about`)) fail(`www redirect: ${www.status} ${www.location}`);

// ── private routes ───────────────────────────────────────────────────────
for (const path of ['/admin/dashboard', '/admin/seo', '/portal/dashboard', '/portal/products']) {
  const res = await get(`${PROD}${path}`);
  const loc = res.headers.get('location') || '';
  if (res.status === 200 || !/login/.test(loc)) fail(`private route ${path} not protected (HTTP ${res.status} ${loc})`);
}
const apiWrite = await fetch(`${base}/api/aws/products`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
if (apiWrite.status === 200) fail('unauthenticated POST /api/aws/products returned 200');

for (const w of warns) console.warn('WARN', w);
if (fails.length) {
  console.error(`\n${fails.length} failure(s):\n- ${fails.join('\n- ')}`);
  process.exit(1);
}
console.log(`\nSEO audit passed (${warns.length} warning(s))`);
