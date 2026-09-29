#!/usr/bin/env node
/**
 * AWS <-> Supabase parity check (READ-ONLY).
 *
 * Compares what the site would render from Supabase (lib/db.js) against the
 * AWS adapter (lib/aws/adapter.js): record ids, slugs, id<->slug pairs,
 * active counts, category product_count, SEO-relevant fields, site settings,
 * and the sitemap URL set built from each backend. Also HEADs every image URL
 * used in metadata.
 *
 * Usage: node scripts/aws-parity-check.mjs [--no-images]
 * Env (from .env.local or shell): NEXT_PUBLIC_SUPABASE_URL,
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY, API_GATEWAY_URL; optional NEXT_PUBLIC_CDN_DOMAIN / CDN_DOMAIN.
 * Exit: 0 PASS, 1 mismatches found, 2 missing env / setup error.
 * Never prints env values.
 */
import fs from 'node:fs';
import { register } from 'node:module';

// lib/db.js uses extensionless relative imports (bundler style); teach Node to resolve them.
register(
  'data:text/javascript,' +
    encodeURIComponent(`
export async function resolve(specifier, context, next) {
  try { return await next(specifier, context); }
  catch (e) {
    if (specifier.startsWith('.') && !/\\.[cm]?js$/.test(specifier)) return next(specifier + '.js', context);
    throw e;
  }
}`)
);

if (fs.existsSync('.env.local')) process.loadEnvFile('.env.local');

const REQUIRED = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'API_GATEWAY_URL'];
const missing = REQUIRED.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`Missing env: ${missing.join(', ')}. Set them (e.g. in .env.local) and re-run.`);
  process.exit(2);
}

const CHECK_IMAGES = !process.argv.includes('--no-images');
const SITE = 'https://cinemafocus.in';
const { createClient } = await import('@supabase/supabase-js');
const db = await import('../lib/db.js');
const aws = await import('../lib/aws/adapter.js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const mismatches = [];
const add = (area, issue, detail = '') => mismatches.push({ area, issue, detail: String(detail) });
const str = (v) => (v === null || v === undefined ? '' : String(v));
const infos = [];
const info = (area, note) => infos.push(`${area}: ${note}`);

// Key-order-insensitive JSON (DynamoDB does not preserve object key order).
const stable = (v) =>
  Array.isArray(v)
    ? `[${v.map(stable).join(',')}]`
    : v && typeof v === 'object'
      ? `{${Object.keys(v).sort().map((k) => `${JSON.stringify(k)}:${stable(v[k])}`).join(',')}}`
      : JSON.stringify(v ?? null);

// Supabase public-storage URL and CloudFront URL for the same object path are
// the expected migration, not a mismatch.
const CDN_HOSTS = [process.env.NEXT_PUBLIC_CDN_DOMAIN, process.env.CDN_DOMAIN].filter(Boolean);
const SUPA_PREFIX = /^https:\/\/[^/]+\.supabase\.co\/storage\/v1\/object\/public\/[^/]+\//;
const CDN_PREFIX = new RegExp(`^https://(${CDN_HOSTS.map((h) => h.replace(/\./g, '\\.')).join('|') || '(?!)'})/`);
const storagePath = (u) => (typeof u === 'string' ? u.replace(SUPA_PREFIX, '').replace(CDN_PREFIX, '') : u);
const isHostRewrite = (a, b) => typeof a === 'string' && typeof b === 'string' && a !== b && SUPA_PREFIX.test(a) && CDN_PREFIX.test(b) && storagePath(a) === storagePath(b);
// Deep-rewrite storage URLs to host-independent paths (for settings).
const pathsOnly = (v) =>
  Array.isArray(v) ? v.map(pathsOnly) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, pathsOnly(x)])) : storagePath(v);
const sample = (arr, n = 10) => (arr.length > n ? `${arr.slice(0, n).join(', ')} … (+${arr.length - n})` : arr.join(', '));

function compareSets(area, label, supa, awsSet) {
  const a = new Set(supa.map(str));
  const b = new Set(awsSet.map(str));
  const onlySupa = [...a].filter((x) => !b.has(x));
  const onlyAws = [...b].filter((x) => !a.has(x));
  if (onlySupa.length) add(area, `${label} missing in AWS (${onlySupa.length})`, sample(onlySupa));
  if (onlyAws.length) add(area, `${label} extra in AWS (${onlyAws.length})`, sample(onlyAws));
}

function comparePairs(area, supaRows, awsRows) {
  const supaMap = new Map(supaRows.map((r) => [str(r.id), str(r.slug)]));
  const diffs = [];
  for (const r of awsRows) {
    const id = str(r.id);
    if (supaMap.has(id) && supaMap.get(id) !== str(r.slug)) diffs.push(`${id}: supabase=${supaMap.get(id)} aws=${str(r.slug)}`);
  }
  if (diffs.length) add(area, `id<->slug pair differs (${diffs.length})`, sample(diffs, 5));
}

function slugQuality(area, supaRows, awsRows) {
  const noSlug = awsRows.filter((r) => !r.slug).map((r) => str(r.id));
  if (noSlug.length) add(area, `AWS records with missing slug (${noSlug.length})`, sample(noSlug));
  const seen = new Map();
  for (const r of awsRows) if (r.slug) seen.set(r.slug, (seen.get(r.slug) || 0) + 1);
  const dups = [...seen].filter(([, n]) => n > 1).map(([s, n]) => `${s} x${n}`);
  if (dups.length) add(area, `duplicate AWS slugs (${dups.length})`, sample(dups));
  const canon = (s) => str(s).trim().toLowerCase().replace(/\/+$/, '');
  const supaSlugs = new Set(supaRows.map((r) => str(r.slug)));
  const supaCanon = new Map(supaRows.map((r) => [canon(r.slug), str(r.slug)]));
  const near = awsRows
    .filter((r) => r.slug && !supaSlugs.has(r.slug) && supaCanon.has(canon(r.slug)))
    .map((r) => `aws="${r.slug}" supabase="${supaCanon.get(canon(r.slug))}"`);
  if (near.length) add(area, `slug differs only in case/whitespace/trailing chars (${near.length})`, sample(near, 5));
}

function compareFields(area, fields, supaRows, awsRows) {
  const awsById = new Map(awsRows.map((r) => [str(r.id), r]));
  const diffs = {};
  const rewrites = {};
  for (const s of supaRows) {
    const a = awsById.get(str(s.id));
    if (!a) continue;
    for (const f of fields) {
      const sv = f.get(s) ?? null;
      const av = f.get(a) ?? null;
      if (isHostRewrite(sv, av)) (rewrites[f.name] ||= []).push(1);
      else if (stable(sv) !== stable(av)) (diffs[f.name] ||= []).push(str(s.slug || s.id));
    }
  }
  for (const [name, ids] of Object.entries(diffs)) add(area, `field "${name}" differs (${ids.length})`, sample(ids));
  for (const [name, n] of Object.entries(rewrites)) info(area, `"${name}": ${n.length} URL(s) moved Supabase storage -> CDN, same object path`);
}

async function paginateSupabase(table, columns) {
  const out = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase.from(table).select(columns).range(from, from + 999);
    if (error) throw new Error(`Supabase ${table}: ${error.message}`);
    out.push(...data);
    if (data.length < 1000) return out;
  }
}

async function awsRaw(path) {
  const res = await fetch(`${process.env.API_GATEWAY_URL.replace(/\/$/, '')}${path}`, { signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`AWS GET ${path}: HTTP ${res.status}`);
  return res.json();
}

const run = async (label, fn) => {
  try {
    return await fn();
  } catch (e) {
    add(label, 'fetch failed', e.message);
    return null;
  }
};

// ---------- Products ----------
const supaAllProducts = await run('products', () => paginateSupabase('products', 'id, slug, is_active'));
const awsAllProducts = await run('products', async () => (await awsRaw('/products')).map((p) => aws.normalize(p, aws.PRODUCT_MAPPING)));
const supaProducts = await db.getProducts(supabase);
const awsProducts = await run('products', () => aws.getProducts());

if (supaAllProducts && awsAllProducts) {
  compareSets('products', 'ids (all)', supaAllProducts.map((p) => p.id), awsAllProducts.map((p) => p.id));
  compareSets('products', 'slugs (all)', supaAllProducts.map((p) => p.slug), awsAllProducts.map((p) => p.slug));
  comparePairs('products', supaAllProducts, awsAllProducts);
  slugQuality('products', supaAllProducts, awsAllProducts);
  const inactive = (rows) => rows.filter((p) => p.is_active === false).map((p) => p.id);
  compareSets('products', 'inactive ids', inactive(supaAllProducts), inactive(awsAllProducts));
}
if (awsProducts) {
  if (supaProducts.length !== awsProducts.length) add('products', 'active count differs', `supabase=${supaProducts.length} aws=${awsProducts.length}`);
  compareFields(
    'products',
    [
      { name: 'name', get: (p) => p.name },
      { name: 'shortDescription', get: (p) => p.shortDescription },
      { name: 'longDescription', get: (p) => p.longDescription },
      { name: 'images[0]', get: (p) => p.images?.[0] },
      { name: 'brand', get: (p) => p.brand },
      { name: 'category', get: (p) => p.category },
      { name: 'is_active', get: (p) => p.is_active !== false },
      { name: 'lastModified (updatedAt||created_at)', get: (p) => (p.updatedAt || p.created_at ? new Date(p.updatedAt || p.created_at).toISOString() : null) },
    ],
    supaProducts,
    awsProducts
  );
}

// ---------- Categories ----------
const supaCats = await db.getCategories(supabase);
const awsCats = await run('categories', () => aws.getCategories());
if (awsCats) {
  compareSets('categories', 'ids', supaCats.map((c) => c.id), awsCats.map((c) => c.id));
  compareSets('categories', 'slugs', supaCats.map((c) => c.slug), awsCats.map((c) => c.slug));
  comparePairs('categories', supaCats, awsCats);
  slugQuality('categories', supaCats, awsCats);
  const awsCount = new Map(awsCats.map((c) => [c.slug, c.product_count]));
  const countDiffs = supaCats.filter((c) => awsCount.has(c.slug) && awsCount.get(c.slug) !== c.product_count).map((c) => `${c.slug}: ${c.product_count} vs ${awsCount.get(c.slug)}`);
  if (countDiffs.length) add('categories', `product_count differs (${countDiffs.length})`, sample(countDiffs, 5));
  compareFields('categories', [{ name: 'name', get: (c) => c.name }, { name: 'lastModified', get: (c) => c.updatedAt || c.created_at || null }], supaCats, awsCats);
}

// ---------- New launches ----------
const supaLaunches = await db.getNewLaunches(supabase);
const awsLaunches = await run('new-launches', () => aws.getNewLaunches());
if (awsLaunches) {
  compareSets('new-launches', 'ids', supaLaunches.map((l) => l.id), awsLaunches.map((l) => l.id));
  compareFields('new-launches', [{ name: 'originalProductId', get: (l) => l.originalProductId }, { name: 'name', get: (l) => l.name }], supaLaunches, awsLaunches);
}

// ---------- Press releases ----------
const supaPress = await db.getPressReleases(supabase);
const awsPress = await run('press', () => aws.getPressReleases());
if (awsPress) {
  compareSets('press', 'ids', supaPress.map((p) => p.id), awsPress.map((p) => p.id));
  compareSets('press', 'slugs', supaPress.map((p) => p.slug).filter(Boolean), awsPress.map((p) => p.slug).filter(Boolean));
  comparePairs('press', supaPress, awsPress);
  compareFields(
    'press',
    [
      { name: 'title', get: (p) => p.title },
      { name: 'imageUrl', get: (p) => p.imageUrl },
      { name: 'date', get: (p) => p.date },
      { name: 'lastModified', get: (p) => (p.updatedAt || p.created_at ? new Date(p.updatedAt || p.created_at).toISOString() : null) },
    ],
    supaPress,
    awsPress
  );
  const order = (rows) => rows.map((p) => str(p.id)).join(',');
  if (order(supaPress) !== order(awsPress)) add('press', 'sort order differs', '');
  for (const p of supaPress.slice(0, 5)) {
    const single = await run('press', () => aws.getPressRelease(p.slug || p.id));
    if (single && str(single.id) !== str(p.id)) add('press', 'single lookup resolves to different id', `${p.slug || p.id}: ${single.id}`);
  }
}

// ---------- Projects ----------
const supaProjects = await db.getProjects(supabase);
const awsProjects = await run('projects', () => aws.getProjects());
if (awsProjects) {
  compareSets('projects', 'ids', supaProjects.map((p) => p.id), awsProjects.map((p) => p.id));
  compareFields('projects', [{ name: 'imageUrl', get: (p) => p.imageUrl }, { name: 'featured', get: (p) => p.featured }], supaProjects, awsProjects);
}

// ---------- Site settings ----------
const settings = [
  ['seo', db.getSeo, aws.getSeo],
  ['product_seo', db.getProductSeo, aws.getProductSeo],
  ['hero_main', db.getHero, aws.getHero],
  ['footer', db.getFooter, aws.getFooter],
  ['trust_badges', db.getTrustBadges, aws.getTrustBadges],
];
for (const [id, fromSupa, fromAws] of settings) {
  const s = await fromSupa(supabase);
  const a = await run(`settings:${id}`, () => fromAws());
  if (a === null) continue;
  if (stable(s) === stable(a)) continue;
  if (stable(pathsOnly(s)) === stable(pathsOnly(a))) info(`settings:${id}`, 'image URLs moved Supabase storage -> CDN, same object paths; otherwise identical');
  else add(`settings:${id}`, 'data differs', '');
}

// ---------- Sitemap URL set ----------
const sitemapSet = (products, cats, press) => [
  ...products.map((p) => `${SITE}/products/${p.slug}`),
  ...cats.map((c) => `${SITE}/brand/${c.slug}`),
  ...press.map((p) => `${SITE}/press/${p.id}`),
];
if (awsProducts && awsCats && awsPress) {
  const s = sitemapSet(supaProducts, supaCats, supaPress);
  const a = sitemapSet(awsProducts, awsCats, awsPress);
  compareSets('sitemap', 'URLs', s, a);
  if (s.length !== a.length) add('sitemap', 'URL count differs', `supabase=${s.length} aws=${a.length}`);
}

// ---------- Image URLs used in metadata ----------
if (CHECK_IMAGES && (awsProducts || awsPress)) {
  const hosts = [process.env.NEXT_PUBLIC_CDN_DOMAIN, process.env.CDN_DOMAIN, 'images.unsplash.com', 'placehold.co'].filter(Boolean);
  const okHost = (h) => hosts.includes(h) || h.endsWith('.supabase.co');
  const urls = [
    ...(awsProducts || []).map((p) => [`product ${p.slug}`, p.images?.[0]]),
    ...(awsPress || []).map((p) => [`press ${p.id}`, p.imageUrl]),
  ].filter(([, u]) => u);

  const relative = [];
  const badHost = [];
  const absolute = [];
  for (const [who, u] of urls) {
    let parsed;
    try {
      parsed = new URL(u);
    } catch {
      relative.push(`${who}: ${u}`);
      continue;
    }
    if (!okHost(parsed.hostname)) badHost.push(`${who}: ${parsed.hostname}`);
    absolute.push([who, u]);
  }
  if (relative.length) add('images', `relative/invalid image URLs (${relative.length})`, sample(relative, 5));
  if (badHost.length) add('images', `unexpected image host (${badHost.length})`, sample(badHost, 5));

  const non200 = [];
  let i = 0;
  const worker = async () => {
    while (i < absolute.length) {
      const [who, u] = absolute[i++];
      try {
        const res = await fetch(u, { method: 'HEAD', signal: AbortSignal.timeout(15000) });
        if (res.status !== 200) non200.push(`${who}: ${res.status}`);
      } catch (e) {
        non200.push(`${who}: ${e.cause?.code || e.name}`);
      }
    }
  };
  await Promise.all(Array.from({ length: 5 }, worker));
  if (non200.length) add('images', `image HEAD not 200 (${non200.length}/${absolute.length})`, sample(non200, 10));
  console.log(`Checked ${absolute.length} image URLs.`);
}

// ---------- Report ----------
if (infos.length) {
  console.log('\nExpected differences (not failures):');
  for (const i of infos) console.log(`  - ${i}`);
}
if (mismatches.length === 0) {
  console.log('\nPARITY: PASS');
  process.exit(0);
}
console.log('\nArea            | Issue                                              | Detail');
console.log('----------------|----------------------------------------------------|-------');
for (const m of mismatches) console.log(`${m.area.padEnd(15)} | ${m.issue.padEnd(50)} | ${m.detail}`);
console.log(`\nPARITY: FAIL (${mismatches.length} mismatch${mismatches.length === 1 ? '' : 'es'})`);
process.exit(1);
