#!/usr/bin/env node
/**
 * Unit tests for lib/aws/adapter.js — AWS-shaped fixtures in, Supabase-shaped
 * output expected. No network: global fetch is stubbed.
 *
 * Usage: node scripts/test-adapter.mjs
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as seed from '../lib/seed-data.js';
import * as a from '../lib/aws/adapter.js';

process.env.API_GATEWAY_URL = 'https://api.test';
process.env.AWS_RETRY_BASE_MS = '1';

// Route-table fetch stub: { '/products': [..] | {status, body} | Error }
function stubFetch(routes) {
  globalThis.fetch = async (url) => {
    const path = new URL(url).pathname;
    const r = routes[path];
    if (r instanceof Error) throw r;
    if (r === undefined) return new Response('{"error":"not found"}', { status: 404 });
    if (r && r.status) return new Response(JSON.stringify(r.body ?? {}), { status: r.status });
    return new Response(JSON.stringify(r), { status: 200 });
  };
}

const P = (o) => ({ is_active: true, featured: false, ...o });
const products = [
  P({ productId: 'p3', slug: 'c-prod', brand: 'Beta', category: 'amps', created_at: '2024-03-01T00:00:00Z', short_description: 's3' }),
  P({ productId: 'p1', slug: 'a-prod', brand: 'Alpha', category: 'amps', createdAt: '2024-01-01T00:00:00Z', shortDescription: 's1', featured: true }),
  P({ productId: 'p2', slug: 'b-prod', brand: 'Alpha', category: 'dacs', created_at: '2024-02-01T00:00:00Z', is_active: false }),
  P({ productId: 'p4', slug: 'd-prod', brand: '', category: 'amps', created_at: '2024-01-01T00:00:00Z', is_active: undefined, isActive: false, featured: true }),
];

test('normalize: id mapping from each table key, never generated', () => {
  for (const k of ['productId', 'categoryId', 'pressId', 'launchId', 'projectId']) {
    assert.equal(a.normalize({ [k]: 'x1' }).id, 'x1');
  }
  assert.equal(a.normalize({ id: 'keep', productId: 'other' }).id, 'keep');
  assert.equal('id' in a.normalize({ slug: 'no-key' }), false);
});

test('normalize: both casings present from either input casing', () => {
  const fromSnake = a.normalize({ image_url: 'u', pdf_url: 'p' }, a.PRESS_RELEASE_MAPPING);
  assert.equal(fromSnake.imageUrl, 'u');
  assert.equal(fromSnake.pdfUrl, 'p');
  const fromCamel = a.normalize({ imageUrl: 'u', coverImages: ['c'] }, a.PRESS_RELEASE_MAPPING);
  assert.equal(fromCamel.image_url, 'u');
  assert.deepEqual(fromCamel.cover_images, ['c']);
});

test('normalize: created_at filled from createdAt only when missing; updatedAt kept', () => {
  assert.equal(a.normalize({ createdAt: 'c' }).created_at, 'c');
  assert.equal(a.normalize({ createdAt: 'c', created_at: 'orig' }).created_at, 'orig');
  assert.equal(a.normalize({ updatedAt: 'u' }).updatedAt, 'u');
});

test('getProducts: is_active filter (both casings), filters, created_at asc then id', async () => {
  stubFetch({ '/products': products });
  const all = await a.getProducts();
  assert.deepEqual(all.map((p) => p.id), ['p1', 'p3']);
  assert.equal(all[0].shortDescription, 's1');
  assert.equal(all[0].short_description, 's1');
  assert.equal(all[0].created_at, '2024-01-01T00:00:00Z');
  assert.deepEqual((await a.getProducts('amps')).map((p) => p.id), ['p1', 'p3']);
  assert.deepEqual((await a.getProducts({ category: 'amps', brand: 'Beta' })).map((p) => p.id), ['p3']);
  assert.deepEqual(await a.getProducts({ category: 'dacs' }), []);
});

test('sort: ties on created_at broken by id; missing created_at is deterministic', () => {
  const items = [{ id: 'b', created_at: '2024-01-01' }, { id: 'a', created_at: '2024-01-01' }, { id: 'c' }];
  assert.deepEqual([...items].sort(a.byCreatedAsc).map((x) => x.id), ['c', 'a', 'b']);
  assert.deepEqual([...items].reverse().sort(a.byCreatedAsc).map((x) => x.id), ['c', 'a', 'b']);
});

test('getProducts: empty 200 -> []', async () => {
  stubFetch({ '/products': [] });
  assert.deepEqual(await a.getProducts(), []);
});

test('getProduct: by slug, inactive -> null, unknown -> null, uses passed list', async () => {
  stubFetch({ '/products': products });
  assert.equal((await a.getProduct('a-prod')).id, 'p1');
  assert.equal(await a.getProduct('b-prod'), null);
  assert.equal(await a.getProduct('nope'), null);
  stubFetch({});
  assert.equal((await a.getProduct('c-prod', products)).id, 'p3');
});

test('getBrands: unique non-empty across ALL products (incl inactive), sorted', async () => {
  stubFetch({ '/products': products });
  assert.deepEqual(await a.getBrands(), ['Alpha', 'Beta']);
});

test('getCategories: counts ALL products by slug incl inactive, sorted desc, both casings', async () => {
  stubFetch({
    '/products': products,
    '/categories': [
      { categoryId: 'c2', slug: 'dacs', name: 'DACs' },
      { categoryId: 'c1', slug: 'amps', name: 'Amps', productCount: 99 },
      { categoryId: 'c3', slug: 'empty', name: 'Empty' },
    ],
  });
  const cats = await a.getCategories();
  assert.deepEqual(cats.map((c) => [c.id, c.product_count, c.productCount]), [
    ['c1', 3, 3],
    ['c2', 1, 1],
    ['c3', 0, 0],
  ]);
});

test('getCategories: empty 200 -> seed categories', async () => {
  stubFetch({ '/categories': [], '/products': products });
  assert.deepEqual(await a.getCategories(), seed.categories);
});

test('getFeaturedProducts: featured===true, no is_active filter, sorted, max 4', async () => {
  stubFetch({ '/products': products });
  assert.deepEqual((await a.getFeaturedProducts()).map((p) => p.id), ['p1', 'p4']);
  const many = Array.from({ length: 6 }, (_, i) => P({ productId: `f${i}`, featured: true, created_at: `2024-01-0${6 - i}` }));
  stubFetch({ '/products': many });
  assert.deepEqual((await a.getFeaturedProducts()).map((p) => p.id), ['f5', 'f4', 'f3', 'f2']);
});

test('getNewLaunches: mapped + sorted created_at asc then id; empty -> []', async () => {
  stubFetch({
    '/new-launches': [
      { launchId: 'l2', created_at: '2024-02-01', original_product_id: 'p1' },
      { launchId: 'l1', created_at: '2024-01-01', shortDescription: 'x' },
    ],
  });
  const l = await a.getNewLaunches();
  assert.deepEqual(l.map((x) => x.id), ['l1', 'l2']);
  assert.equal(l[1].originalProductId, 'p1');
  assert.equal(l[0].short_description, 'x');
  stubFetch({ '/new-launches': [] });
  assert.deepEqual(await a.getNewLaunches(), []);
});

test('getProjects: featured desc (nulls last), created_at desc, defaults; empty -> seed', async () => {
  stubFetch({
    '/projects': [
      { projectId: 'a', featured: null, created_at: '2024-05-01' },
      { projectId: 'b', featured: false, created_at: '2024-04-01' },
      { projectId: 'c', featured: true, created_at: '2024-01-01' },
      { projectId: 'd', featured: true, created_at: '2024-03-01', image_url: 'i', imagePosition: 'top' },
    ],
  });
  const p = await a.getProjects();
  assert.deepEqual(p.map((x) => x.id), ['d', 'c', 'b', 'a']);
  assert.equal(p[3].featured, false);
  assert.equal(p[1].imagePosition, 'center');
  assert.equal(p[0].imagePosition, 'top');
  assert.equal(p[0].imageUrl, 'i');
  stubFetch({ '/projects': [] });
  assert.deepEqual(await a.getProjects(), seed.projects);
});

test('getPressReleases: date desc then created_at desc (nulls first); empty -> seed', async () => {
  stubFetch({
    '/press-releases': [
      { pressId: 'x1', date: '2024-01-01', created_at: '2024-01-01T01:00:00Z' },
      { pressId: 'x2', date: '2024-06-01', created_at: '2024-06-01T00:00:00Z' },
      { pressId: 'x3', date: '2024-01-01', created_at: '2024-01-01T05:00:00Z' },
      { pressId: 'x4', date: null, created_at: '2023-01-01T00:00:00Z' },
    ],
  });
  assert.deepEqual((await a.getPressReleases()).map((x) => x.id), ['x4', 'x2', 'x3', 'x1']);
  stubFetch({ '/press-releases': [] });
  assert.deepEqual(await a.getPressReleases(), seed.pressReleases);
});

test('getPressRelease: single by slug or id with mapping', async () => {
  stubFetch({ '/press-releases/my-slug': { pressId: 'uuid-1', slug: 'my-slug', imageUrl: 'u' } });
  const pr = await a.getPressRelease('my-slug');
  assert.equal(pr.id, 'uuid-1');
  assert.equal(pr.image_url, 'u');
});

test('site settings: data unwrap and data-level fallbacks', async () => {
  stubFetch({
    '/site-settings/hero_main': { settingId: 'hero_main', data: { h: 1 } },
    '/site-settings/trust_badges': { settingId: 'trust_badges', data: { items: [1, 2] } },
    '/site-settings/seo': { settingId: 'seo', data: { title: 't' } },
    '/site-settings/product_seo': { settingId: 'product_seo', data: { p: 1 } },
    '/site-settings/footer': { settingId: 'footer', data: { email: 'e' } },
    '/site-settings/philosophy': { settingId: 'philosophy', data: { ph: 1 } },
  });
  assert.deepEqual(await a.getHero(), { h: 1 });
  assert.deepEqual(await a.getTrustBadges(), [1, 2]);
  assert.deepEqual(await a.getSeo(), { title: 't' });
  assert.deepEqual(await a.getProductSeo(), { p: 1 });
  assert.deepEqual(await a.getFooter(), { email: 'e' });
  assert.deepEqual(await a.getPhilosophy(), { ph: 1 });

  stubFetch({
    '/site-settings/trust_badges': { settingId: 'trust_badges', data: {} },
    '/site-settings/hero_main': null,
  });
  assert.deepEqual(await a.getTrustBadges(), []);
  assert.deepEqual(await a.getHero(), seed.hero);
});

test('fetch failures throw AwsFetchError (cms.js falls back to Supabase)', async () => {
  stubFetch({ '/products': new TypeError('fetch failed') });
  await assert.rejects(a.getProducts(), a.AwsFetchError);
  stubFetch({ '/products': { status: 500 } });
  await assert.rejects(a.getProducts(), (e) => e instanceof a.AwsFetchError && e.status === 500);
  stubFetch({});
  await assert.rejects(a.getHero(), (e) => e instanceof a.AwsFetchError && e.status === 404);
  stubFetch({ '/categories': [{ slug: 'x' }], '/products': { status: 503 } });
  await assert.rejects(a.getCategories(), a.AwsFetchError);
  stubFetch({ '/products': { status: 200, body: { not: 'an array' } } });
  await assert.rejects(a.getProducts(), a.AwsFetchError);

  const saved = process.env.API_GATEWAY_URL;
  delete process.env.API_GATEWAY_URL;
  await assert.rejects(a.getProducts(), a.AwsFetchError);
  process.env.API_GATEWAY_URL = saved;
});

test('retries throttling/5xx/network errors, then succeeds; 404 is not retried', async () => {
  let calls = 0;
  globalThis.fetch = async () => {
    calls++;
    if (calls === 1) throw new TypeError('fetch failed');
    if (calls === 2) return new Response('{}', { status: 503 });
    return new Response(JSON.stringify([{ productId: 'p1', slug: 's' }]), { status: 200 });
  };
  assert.equal((await a.getProducts()).length, 1);
  assert.equal(calls, 3);

  calls = 0;
  globalThis.fetch = async () => (calls++, new Response('{}', { status: 503 }));
  await assert.rejects(a.getProducts(), (e) => e instanceof a.AwsFetchError && e.status === 503);
  assert.equal(calls, 4);

  calls = 0;
  globalThis.fetch = async () => (calls++, new Response('{}', { status: 404 }));
  await assert.rejects(a.getHero(), (e) => e.status === 404);
  assert.equal(calls, 1);
});
