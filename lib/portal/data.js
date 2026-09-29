import { normalize, PRODUCT_MAPPING, CATEGORY_MAPPING, PROJECT_MAPPING, LAUNCH_MAPPING, PRESS_RELEASE_MAPPING } from '@/lib/aws/adapter';
import { lastDays, buildSeries } from './stats';

/**
 * Server-only data access for the owner portal. Public collections are read without a token;
 * messages and stats use the signed-in user's Cognito ID token (Lambda authz decides access).
 * Calls are retried briefly and memoised for a few seconds because the AWS account has a
 * small Lambda concurrency limit.
 */
const TIMEOUT_MS = 8000;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export class PortalApiError extends Error {
  constructor(path, status) {
    super(`Portal API ${path} failed${status ? ` (HTTP ${status})` : ''}`);
    this.path = path;
    this.status = status ?? null;
  }
}

async function apiGet(path, token) {
  const base = process.env.API_GATEWAY_URL;
  if (!base) throw new PortalApiError(path, null);
  let last;
  for (let attempt = 0; attempt < 4; attempt++) {
    if (attempt) await sleep(200 * 2 ** (attempt - 1) * (0.5 + Math.random()));
    try {
      const res = await fetch(`${base}${path}`, {
        cache: 'no-store',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if ([429, 500, 502, 503, 504].includes(res.status)) { last = new PortalApiError(path, res.status); continue; }
      if (!res.ok) throw new PortalApiError(path, res.status);
      return await res.json();
    } catch (e) {
      if (e instanceof PortalApiError) throw e;
      last = new PortalApiError(path, null);
    }
  }
  throw last;
}

const memo = new Map();
async function cached(key, ttlMs, fn) {
  const hit = memo.get(key);
  if (hit && Date.now() - hit.at < ttlMs) return hit.value;
  const value = await fn();
  memo.set(key, { at: Date.now(), value });
  return value;
}

const list = async (path, mapping, token) => (await apiGet(path, token)).map((r) => normalize(r, mapping));

export const getProducts = () => cached('products', 15_000, () => list('/products', PRODUCT_MAPPING));
export const getCategories = () => cached('categories', 15_000, () => list('/categories', CATEGORY_MAPPING));
export const getProjects = () => cached('projects', 15_000, () => list('/projects', PROJECT_MAPPING));
export const getLaunches = () => cached('launches', 15_000, () => list('/new-launches', LAUNCH_MAPPING));
export const getPress = () => cached('press', 15_000, () => list('/press-releases', PRESS_RELEASE_MAPPING));

export async function getMessages(token) {
  const rows = await apiGet('/messages', token);
  return rows
    .map((m) => normalize(m, {}))
    .sort((a, b) => (Date.parse(b.created_at || 0) || 0) - (Date.parse(a.created_at || 0) || 0));
}

/** Page views + unique visitors per UTC day for the last `n` days (oldest -> newest). */
export async function getTrafficSeries(token, n = 14) {
  return cached(`traffic:${n}`, 60_000, async () => {
    const days = lastDays(n);
    const jobs = days.flatMap((d) => [['v', d, `/stats/${d}`], ['u', d, `/stats/u:${d}`]]);
    const views = {};
    const visitors = {};
    let cursor = 0;
    let failures = 0;
    // Small pool: at most 3 requests in flight.
    await Promise.all(Array.from({ length: 3 }, async () => {
      while (cursor < jobs.length) {
        const [kind, day, path] = jobs[cursor++];
        try {
          const row = await apiGet(path, token);
          (kind === 'v' ? views : visitors)[day] = Number(row?.count) || 0;
        } catch {
          failures++;
        }
      }
    }));
    if (failures === jobs.length) throw new PortalApiError('/stats', null);
    return { series: buildSeries(days, views, visitors), partial: failures > 0 };
  });
}
