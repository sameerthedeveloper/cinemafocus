#!/usr/bin/env node
/** Unit tests for scripts/lib/supabase-to-aws-sync.mjs (no network). Run: node scripts/test-sync.mjs */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rewriteUrls, normalizeMessage, toItem, planTable, collectStoragePaths } from './lib/supabase-to-aws-sync.mjs';

const PREFIX = 'https://x.supabase.co/storage/v1/object/public/images/';
const ctx = { supabasePrefix: PREFIX, cdnDomain: 'cdn.test' };

test('rewriteUrls: only Supabase storage URLs, deeply, keeping path', () => {
  const out = rewriteUrls({ a: `${PREFIX}products/a-0.jpg`, b: ['https://images.unsplash.com/x', `${PREFIX}p/b.png`], c: 5, d: null }, PREFIX, 'cdn.test');
  assert.deepEqual(out, { a: 'https://cdn.test/products/a-0.jpg', b: ['https://images.unsplash.com/x', 'https://cdn.test/p/b.png'], c: 5, d: null });
});

test('toItem: id renamed to the table key, snake_case kept, URLs rewritten', () => {
  const it = toItem({ id: 'p1', slug: 's', short_description: 'x', images: [`${PREFIX}products/s-0.jpg`], created_at: '2026-09-20T00:00:00Z' }, 'products', ctx);
  assert.equal(it.productId, 'p1');
  assert.equal('id' in it, false);
  assert.equal(it.short_description, 'x');
  assert.deepEqual(it.images, ['https://cdn.test/products/s-0.jpg']);
  assert.equal(toItem({ id: 'site', data: {} }, 'site_settings', ctx).settingId, 'site');
  assert.equal(toItem({ id: 'm' }, 'messages', ctx).messageId, 'm');
});

test('normalizeMessage: old {message, read} rows become {text, status}', () => {
  assert.deepEqual(normalizeMessage({ id: 1, message: 'hi', read: false }), { id: 1, message: 'hi', read: false, text: 'hi', status: 'unread', subject: 'No Subject' });
  assert.equal(normalizeMessage({ text: 't', status: 'read', subject: 'S' }).status, 'read');
  assert.equal(normalizeMessage({ message: 'x', read: true }).status, 'read');
});

test('planTable: add-only by key; never re-adds existing', () => {
  const existing = [{ productId: 'a', slug: 's-a' }];
  const p = planTable('products', [{ id: 'a', slug: 's-a' }, { id: 'b', slug: 's-b' }], existing);
  assert.deepEqual(p.toAdd.map((r) => r.id), ['b']);
  assert.equal(p.alreadyThere, 1);
  assert.equal(p.conflicts.length, 0);
});

test('planTable: slug already used by a different id is a conflict, not added', () => {
  const p = planTable('products', [{ id: 'new', slug: 's-a' }], [{ productId: 'a', slug: 's-a' }]);
  assert.equal(p.toAdd.length, 0);
  assert.match(p.conflicts[0].reason, /already used in AWS by a/);
  // non-slugged tables never conflict on slug
  assert.equal(planTable('messages', [{ id: 'n', slug: 'x' }], [{ messageId: 'o', slug: 'x' }]).toAdd.length, 1);
});

test('planTable: --since keeps newer/undated rows, skips older ones; rows without id are reported', () => {
  const since = new Date('2026-09-14');
  const p = planTable('messages', [
    { id: 'old', created_at: '2026-09-01T00:00:00Z' },
    { id: 'new', created_at: '2026-09-20T00:00:00Z' },
    { id: 'undated' },
    { created_at: '2026-09-20T00:00:00Z' },
  ], [], { since });
  assert.deepEqual(p.toAdd.map((r) => r.id), ['new', 'undated']);
  assert.equal(p.filteredBySince, 1);
  assert.equal(p.conflicts.length, 1);
});

test('collectStoragePaths: finds CDN image paths deeply, decodes, ignores other URLs', () => {
  const set = collectStoragePaths({ images: ['https://cdn.test/products/a%20b.jpg?v=1'], x: { y: 'https://cdn.test/press/p.webp' }, z: 'https://images.unsplash.com/q' }, 'cdn.test');
  assert.deepEqual([...set].sort(), ['press/p.webp', 'products/a b.jpg']);
});
