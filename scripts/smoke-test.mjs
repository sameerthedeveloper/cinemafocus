#!/usr/bin/env node
/**
 * Smoke test against a running server (`next start`). Read-only: only GETs, plus
 * one login attempt with an invalid throwaway account to confirm auth rejects it.
 *
 * Usage: node scripts/smoke-test.mjs --base http://localhost:3100
 *
 * Crawls every URL in /sitemap.xml and checks status, title, single h1, canonical,
 * JSON-LD validity, absolute og:image; HEADs each unique og:image; then probes the
 * auth/proxy/API behaviour. Exit 1 on any failure.
 */
const args = Object.fromEntries(process.argv.slice(2).reduce((a, v, i, arr) => (v.startsWith('--') ? [...a, [v.slice(2), arr[i + 1]]] : a), []));
const BASE = (args.base || 'http://localhost:3100').replace(/\/$/, '');
const SITE = 'https://cinemafocus.in';
const UA = 'Mozilla/5.0 (compatible; Googlebot/2.1)';

const failures = [];
let passed = 0;
const check = (name, ok, detail = '') => {
  if (ok) passed++;
  else failures.push(`${name}${detail ? ` — ${detail}` : ''}`);
};

const decode = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'");
const get = async (path, opts = {}) => {
  const res = await fetch(path.startsWith('http') ? path : BASE + path, { headers: { 'user-agent': UA }, redirect: 'manual', ...opts });
  return { status: res.status, headers: res.headers, text: opts.method === 'HEAD' ? '' : await res.text() };
};
const pool = async (items, n, fn) => {
  let i = 0;
  await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) await fn(items[i++]); }));
};

// ---- 1. sitemap crawl ----
const sm = await get('/sitemap.xml');
check('sitemap 200', sm.status === 200);
const urls = [...sm.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => decode(m[1]));
check('sitemap has URLs', urls.length > 0, `${urls.length}`);
check('sitemap has no /api or /admin', !urls.some((u) => /\/(api|admin)(\/|$)/.test(u)));
check('sitemap URLs unique', new Set(urls).size === urls.length);

const images = new Set();
await pool(urls, 3, async (u) => {
  const path = u.replace(SITE, '') || '/';
  const r = await get(path);
  const t = (s) => `${path}: ${s}`;
  check(t('200'), r.status === 200, String(r.status));
  if (r.status !== 200) return;
  const title = r.text.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim();
  check(t('has title'), !!title);
  const h1s = (r.text.match(/<h1[\s>]/gi) || []).length;
  check(t('exactly one h1'), h1s === 1, `${h1s}`);
  const canon = r.text.match(/<link[^>]+rel="canonical"[^>]*href="([^"]+)"/i)?.[1] || r.text.match(/<link[^>]+href="([^"]+)"[^>]*rel="canonical"/i)?.[1];
  check(t('canonical matches URL'), canon && decode(canon).replace(/\/$/, '') === u.replace(/\/$/, ''), canon);
  let ldOk = true;
  for (const m of r.text.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    try { JSON.parse(m[1]); } catch { ldOk = false; }
  }
  check(t('JSON-LD parses'), ldOk);
  check(t('no undefined/[object leaks in title'), !/undefined|\[object/i.test(title || ''));
  const og = r.text.match(/<meta[^>]+property="og:image"[^>]*content="([^"]+)"/i)?.[1];
  if (og) {
    check(t('og:image absolute https'), /^https:\/\//.test(decode(og)), og);
    images.add(decode(og));
  }
  check(t('not noindex'), !/<meta[^>]+name="robots"[^>]*noindex/i.test(r.text));
});

// ---- 2. images ----
const imgList = [...images];
const badImages = [];
await pool(imgList, 5, async (u) => {
  try {
    const r = await get(u, { method: 'HEAD' });
    if (r.status !== 200) badImages.push(`${u} -> ${r.status}`);
  } catch (e) { badImages.push(`${u} -> ${e.cause?.code || e.name}`); }
});
check(`og:image URLs all 200 (${imgList.length} unique)`, badImages.length === 0, badImages.slice(0, 3).join('; '));

// ---- 3. redirects / 404 / robots ----
const redirects = [['/product-category/x', '/brand/x'], ['/category/x', '/brand/x'], ['/shop/x', '/products/x'], ['/product/x', '/products/x'], ['/shop', '/products'], ['/contact-us', '/contact'], ['/about-us', '/about'], ['/brands/x', '/brand/x'], ['/wp-content/a/b.jpg', '/images/a/b.jpg']];
for (const [from, to] of redirects) {
  const r = await get(from);
  check(`redirect ${from}`, [301, 308].includes(r.status) && (r.headers.get('location') || '').endsWith(to), `${r.status} ${r.headers.get('location')}`);
}
const nf = await get('/definitely-not-a-page-xyz');
check('unknown URL -> 404', nf.status === 404, String(nf.status));
const robots = await get('/robots.txt');
check('robots disallows /api and /admin', /Disallow: \/api/.test(robots.text) && /Disallow: \/admin/.test(robots.text));

// ---- 4. auth / proxy / API behaviour ----
const admin = await get('/admin/dashboard');
check('/admin/* without session redirects to login', [307, 308].includes(admin.status) && /\/admin\/login$/.test(admin.headers.get('location') || ''), `${admin.status} ${admin.headers.get('location')}`);
const login = await get('/admin/login');
check('/admin/login 200', login.status === 200);
const sess = await get('/api/auth/session');
check('session without cookie -> {user:null}', sess.status === 200 && JSON.parse(sess.text).user === null);
const bad = await get('/api/auth/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: 'nobody-test@example.invalid', password: 'not-a-real-password' }) });
check('login with invalid account -> 401', bad.status === 401, String(bad.status));
check('admin proxy without token -> 401 (users)', (await get('/api/aws/users')).status === 401);
check('admin proxy without token -> 401 (messages)', (await get('/api/aws/messages')).status === 401);
check('admin upload without token rejected', [401, 400, 403, 500].includes((await get('/api/upload', { method: 'POST', body: new FormData() })).status));
for (const p of ['/api/aws-public/products', '/api/aws-public/categories', '/api/aws-public/new-launches', '/api/aws-public/projects', '/api/aws-public/press-releases', '/api/aws-public/site-settings/footer']) {
  const r = await get(p);
  let ok = r.status === 200;
  try { JSON.parse(r.text); } catch { ok = false; }
  check(`public API ${p}`, ok && /s-maxage/.test(r.headers.get('cache-control') || ''), String(r.status));
}
for (const p of ['/api/aws-public/users', '/api/aws-public/messages', '/api/aws-public/stats/2026-01-01', '/api/aws-public/upload/presign']) {
  check(`public API blocks ${p}`, (await get(p)).status === 404);
}
check('admin proxy responses are no-store', /no-store/.test((await get('/api/aws/products')).headers.get('cache-control') || ''));

console.log(`\nPASSED ${passed}, FAILED ${failures.length}  (${urls.length} sitemap URLs crawled)`);
if (failures.length) {
  console.log(failures.map((f) => ` ✖ ${f}`).join('\n'));
  process.exit(1);
}
