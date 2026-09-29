#!/usr/bin/env node
/** Unit tests for lib/portal/stats.js (no network). Run: node scripts/test-portal.mjs */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lastDays, buildSeries, sum, growth, weekOverWeek, enquiryStats, isUnread } from '../lib/portal/stats.js';

const NOW = new Date('2026-09-29T10:00:00Z');

test('lastDays: oldest -> newest UTC keys ending today', () => {
  assert.deepEqual(lastDays(3, NOW), ['2026-09-27', '2026-09-28', '2026-09-29']);
  assert.equal(lastDays(30, NOW).length, 30);
  assert.equal(lastDays(30, NOW)[0], '2026-08-31');
});

test('buildSeries: fills missing days with 0 and coerces counts', () => {
  const days = lastDays(3, NOW);
  const s = buildSeries(days, { '2026-09-28': 5, '2026-09-29': '7' }, { '2026-09-29': 2 });
  assert.deepEqual(s.map((r) => [r.key, r.value, r.visitors]), [['2026-09-27', 0, 0], ['2026-09-28', 5, 0], ['2026-09-29', 7, 2]]);
  assert.equal(sum(s), 12);
  assert.equal(sum(s, 'visitors'), 2);
});

test('growth: percent change, null for "new", 0 for none', () => {
  assert.equal(growth(150, 100), 50);
  assert.equal(growth(50, 100), -50);
  assert.equal(growth(5, 0), null);
  assert.equal(growth(0, 0), 0);
});

test('weekOverWeek: last 7 vs the 7 before', () => {
  const series = Array.from({ length: 14 }, (_, i) => ({ value: i < 7 ? 10 : 20, visitors: i < 7 ? 4 : 2 }));
  assert.deepEqual(weekOverWeek(series), { current: 140, previous: 70, pct: 100 });
  assert.equal(weekOverWeek(series, 'visitors').pct, -50);
});

test('enquiryStats: buckets by UTC day, counts previous window, ignores bad dates', () => {
  const msgs = [
    { created_at: '2026-09-29T01:00:00Z' },
    { created_at: '2026-09-29T23:00:00Z' },
    { createdAt: '2026-09-10T00:00:00Z' },        // camelCase from Lambda-created messages
    { created_at: '2026-08-15T00:00:00Z' },        // previous 30-day window
    { created_at: 'not a date' },
    {},
  ];
  const s = enquiryStats(msgs, 30, NOW);
  assert.equal(s.series.length, 30);
  assert.equal(s.series.at(-1).value, 2);
  assert.equal(s.current, 3);
  assert.equal(s.previous, 1);
  assert.equal(s.pct, 200);
});

test('isUnread: anything not explicitly read', () => {
  assert.equal(isUnread({ status: 'unread' }), true);
  assert.equal(isUnread({}), true);
  assert.equal(isUnread({ status: 'read' }), false);
});
