/**
 * Pure analytics helpers for the owner portal (no network) — unit-tested in scripts/test-portal.mjs.
 *
 * Tracking model (see lib/analytics.js): the public site increments two kinds of rows in the
 * Stats table, keyed by UTC date:
 *   "YYYY-MM-DD"    -> page views that day
 *   "u:YYYY-MM-DD"  -> approximate unique visitors that day (one count per browser per day)
 */
export const DAY = 24 * 60 * 60 * 1000;

export const utcDay = (d) => d.toISOString().slice(0, 10);

/** Oldest -> newest list of UTC date keys ending today. */
export function lastDays(n, now = new Date()) {
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  return Array.from({ length: n }, (_, i) => utcDay(new Date(today.getTime() - (n - 1 - i) * DAY)));
}

export const shortLabel = (key) =>
  new Date(`${key}T00:00:00Z`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', timeZone: 'UTC' });

/** views/visitors: { [dateKey]: count }  ->  [{ key, label, value, visitors }] */
export function buildSeries(days, views = {}, visitors = {}) {
  return days.map((key) => ({ key, label: shortLabel(key), value: Number(views[key]) || 0, visitors: Number(visitors[key]) || 0 }));
}

export const sum = (rows, field = 'value') => rows.reduce((a, r) => a + (Number(r[field]) || 0), 0);

/** Percent change; null when there is no previous value to compare with but there is a current one. */
export function growth(current, previous) {
  if (previous > 0) return ((current - previous) / previous) * 100;
  return current > 0 ? null : 0;
}

/** Last 7 days vs the 7 before them, from a series of at least 14 days. */
export function weekOverWeek(series, field = 'value') {
  const cur = sum(series.slice(-7), field);
  const prev = sum(series.slice(-14, -7), field);
  return { current: cur, previous: prev, pct: growth(cur, prev) };
}

/** Messages -> enquiries per day (last n days) + growth vs the n days before. */
export function enquiryStats(messages, n = 30, now = new Date()) {
  const days = lastDays(n, now);
  const idx = new Map(days.map((k, i) => [k, i]));
  const series = days.map((key) => ({ key, label: shortLabel(key), value: 0 }));
  const startMs = Date.parse(`${days[0]}T00:00:00Z`);
  let previous = 0;
  for (const m of messages) {
    const raw = m.created_at || m.createdAt;
    const t = raw ? Date.parse(raw) : NaN;
    if (Number.isNaN(t)) continue;
    const i = idx.get(utcDay(new Date(t)));
    if (i !== undefined) series[i].value += 1;
    else if (t < startMs && t >= startMs - n * DAY) previous += 1;
  }
  const current = sum(series);
  return { series, current, previous, pct: growth(current, previous) };
}

export const isUnread = (m) => m.status !== 'read';
