#!/usr/bin/env node
/**
 * SEO snapshot: captures crawler-visible SEO output from a running server so
 * two snapshots can be diffed (`diff -r a b`) to prove zero SEO regression.
 *
 * Usage: node scripts/seo-snapshot.mjs --base http://localhost:3100 --out /tmp/seo-baseline
 *
 * Captures: /sitemap.xml, /robots.txt, the next.config redirects() list, live
 * status/Location of every redirect, and per page: title, meta description,
 * canonical, og:*, twitter:*, robots, JSON-LD, h1.
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, arr) => {
    if (a.startsWith('--')) acc.push([a.slice(2), arr[i + 1]]);
    return acc;
  }, [])
);
const BASE = (args.base || 'http://localhost:3100').replace(/\/$/, '');
const OUT = args.out || '/tmp/seo-snapshot';
const SITE = 'https://cinemafocus.in';
const SAMPLE = 5;
const STATIC_ROUTES = ['/', '/about', '/contact', '/gallery', '/location', '/press', '/products'];
// Crawler UA so Next serves blocking (in-<head>) metadata, as Google sees it.
const UA = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';

fs.mkdirSync(path.join(OUT, 'pages'), { recursive: true });
const write = (name, data) =>
  fs.writeFileSync(path.join(OUT, name), typeof data === 'string' ? data : JSON.stringify(data, null, 2) + '\n');

const decode = (s) =>
  s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');

function parseAttrs(tag) {
  const attrs = {};
  for (const m of tag.matchAll(/([a-zA-Z:-]+)=(?:"([^"]*)"|'([^']*)')/g)) attrs[m[1].toLowerCase()] = decode(m[2] ?? m[3]);
  return attrs;
}

function extractSeo(html) {
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1];
  const meta = {};
  for (const m of html.matchAll(/<meta\s[^>]*>/gi)) {
    const a = parseAttrs(m[0]);
    const key = a.property || a.name;
    if (!key || a.content === undefined) continue;
    if (key === 'description' || key === 'robots' || key.startsWith('og:') || key.startsWith('twitter:')) {
      (meta[key] ||= []).push(a.content);
    }
  }
  const canonical = [...html.matchAll(/<link\s[^>]*>/gi)]
    .map((m) => parseAttrs(m[0]))
    .filter((a) => a.rel === 'canonical')
    .map((a) => a.href);
  const jsonLd = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map((m) => {
    try {
      return JSON.parse(m[1]);
    } catch {
      return m[1];
    }
  });
  const h1 = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) =>
    decode(m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())
  );
  return { title: title ? decode(title) : null, meta, canonical, jsonLd, h1 };
}

async function get(url, opts = {}) {
  const res = await fetch(url, { headers: { 'user-agent': UA }, ...opts });
  return { status: res.status, location: res.headers.get('location'), text: opts.redirect === 'manual' ? '' : await res.text() };
}

// --- sitemap ---
const sm = await get(`${BASE}/sitemap.xml`);
const entries = [...sm.text.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => {
  const pick = (t) => m[1].match(new RegExp(`<${t}>([\\s\\S]*?)</${t}>`))?.[1] ?? null;
  const loc = pick('loc');
  const isStatic = STATIC_ROUTES.some((r) => loc === SITE + (r === '/' ? '' : r));
  // Static routes use lastModified: new Date() — volatile, so normalize.
  return { loc, lastmod: isStatic ? '<now>' : pick('lastmod'), changefreq: pick('changefreq'), priority: pick('priority') };
});
write('sitemap.status.txt', `${sm.status}\n`);
write('sitemap.json', entries);
write('sitemap-count.txt', `${entries.length}\n`);
write('sitemap-urls.txt', entries.map((e) => e.loc).sort().join('\n') + '\n');

// --- robots ---
const robots = await get(`${BASE}/robots.txt`);
write('robots.txt', `status: ${robots.status}\n\n${robots.text}`);

// --- redirects (config + live) ---
const configPath = path.resolve(process.cwd(), 'next.config.mjs');
const { default: nextConfig } = await import(pathToFileURL(configPath).href + `?t=${Date.now()}`);
const redirects = await nextConfig.redirects();
write('redirects-config.json', redirects);
const live = [];
for (const r of redirects) {
  const src = r.source.replace(':path*', 'uploads/2020/01/sample.jpg').replace(/:slug/g, 'sample-slug');
  const res = await get(`${BASE}${src}`, { redirect: 'manual' });
  live.push({ source: src, status: res.status, location: res.location?.replace(BASE, '') ?? null });
}
write('redirects-live.json', live);

// --- pages ---
const sample = (prefix) =>
  entries
    .map((e) => e.loc)
    .filter((l) => l.startsWith(`${SITE}${prefix}/`))
    .sort()
    .slice(0, SAMPLE)
    .map((l) => l.slice(SITE.length));
const pages = [...STATIC_ROUTES, ...sample('/products'), ...sample('/brand'), ...sample('/press')];
write('pages.txt', pages.join('\n') + '\n');

for (const p of pages) {
  const res = await get(`${BASE}${p}`);
  const file = (p === '/' ? 'home' : p.slice(1).replace(/[^a-zA-Z0-9._-]+/g, '__')) + '.json';
  write(path.join('pages', file), { path: p, status: res.status, ...extractSeo(res.text) });
}

console.log(`SEO snapshot: ${entries.length} sitemap URLs, ${pages.length} pages, ${redirects.length} redirects -> ${OUT}`);
