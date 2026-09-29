/**
 * Pure helpers for scripts/sync-supabase-to-aws.mjs (no network, unit-tested in
 * scripts/test-sync.mjs). Item shapes mirror what the original one-time
 * migration (scripts/migrate_to_dynamo.js in the cinemafocus-aws repo) wrote:
 * the raw Supabase row, with `id` renamed to the table's key attribute and
 * Supabase storage URLs rewritten to the CloudFront domain.
 */

// Postgres table -> DynamoDB table suffix + key attribute
export const TABLES = {
  products: { table: 'Products', pk: 'productId', slugged: true },
  categories: { table: 'Categories', pk: 'categoryId', slugged: true },
  new_launches: { table: 'NewLaunches', pk: 'launchId' },
  press_releases: { table: 'PressReleases', pk: 'pressId', slugged: true },
  projects: { table: 'Projects', pk: 'projectId' },
  messages: { table: 'Messages', pk: 'messageId' },
  site_settings: { table: 'SiteSettings', pk: 'settingId' },
};
export const DEFAULT_TABLES = Object.keys(TABLES);

/** Recursively rewrite Supabase public-storage URLs to the CDN domain, keeping the path. */
export function rewriteUrls(value, supabasePrefix, cdnDomain) {
  if (typeof value === 'string' && value.startsWith(supabasePrefix)) {
    return `https://${cdnDomain}/${value.slice(supabasePrefix.length)}`;
  }
  if (Array.isArray(value)) return value.map((v) => rewriteUrls(v, supabasePrefix, cdnDomain));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, rewriteUrls(v, supabasePrefix, cdnDomain)]));
  }
  return value;
}

/** Old contact form rows used { message, read }; the AWS admin reads { text, status }. */
export function normalizeMessage(row) {
  const out = { ...row };
  if (out.text === undefined && out.message !== undefined) out.text = out.message;
  if (out.status === undefined) out.status = out.read ? 'read' : 'unread';
  if (out.subject === undefined || out.subject === null || out.subject === '') out.subject = 'No Subject';
  return out;
}

/** Supabase row -> DynamoDB item (same shape the original migration produced). */
export function toItem(row, tableName, { supabasePrefix, cdnDomain }) {
  const cfg = TABLES[tableName];
  const prepared = tableName === 'messages' ? normalizeMessage(row) : row;
  const rewritten = rewriteUrls(prepared, supabasePrefix, cdnDomain);
  const { id, ...rest } = rewritten;
  return { ...rest, [cfg.pk]: id };
}

/**
 * Decide what to add. Never overwrites: a row is only added when its key is not in
 * AWS. Rows whose slug already exists in AWS under a *different* key are reported
 * as conflicts and skipped, so two records never compete for one public URL.
 */
export function planTable(tableName, rows, existing, { since } = {}) {
  const cfg = TABLES[tableName];
  const existingKeys = new Set(existing.map((e) => String(e[cfg.pk])));
  const existingSlugs = new Map(existing.filter((e) => e.slug).map((e) => [e.slug, String(e[cfg.pk])]));

  const toAdd = [];
  const conflicts = [];
  let alreadyThere = 0;
  let filteredBySince = 0;

  for (const row of rows) {
    const key = String(row.id ?? '');
    if (!key) {
      conflicts.push({ id: '(none)', reason: 'row has no id' });
      continue;
    }
    if (existingKeys.has(key)) {
      alreadyThere++;
      continue;
    }
    if (since) {
      const stamp = row.created_at || row.updated_at || row.date;
      if (stamp && new Date(stamp) < since) {
        filteredBySince++;
        continue;
      }
    }
    if (cfg.slugged && row.slug && existingSlugs.has(row.slug)) {
      conflicts.push({ id: key, reason: `slug "${row.slug}" already used in AWS by ${existingSlugs.get(row.slug)}` });
      continue;
    }
    toAdd.push(row);
  }
  return { toAdd, conflicts, alreadyThere, filteredBySince };
}

/** Storage object paths (relative to the bucket) referenced by an item via the CDN domain. */
export function collectStoragePaths(value, cdnDomain, out = new Set()) {
  const prefix = `https://${cdnDomain}/`;
  if (typeof value === 'string') {
    if (value.startsWith(prefix)) out.add(decodeURIComponent(value.slice(prefix.length).split('?')[0]));
  } else if (Array.isArray(value)) {
    value.forEach((v) => collectStoragePaths(v, cdnDomain, out));
  } else if (value && typeof value === 'object') {
    Object.values(value).forEach((v) => collectStoragePaths(v, cdnDomain, out));
  }
  return out;
}

/** Short human label for a row in the review listing (no personal data). */
export function labelFor(tableName, row) {
  if (tableName === 'messages') return `${row.subject || 'message'} (${String(row.created_at || '').slice(0, 10)})`;
  return row.slug || row.name || row.title || row.id;
}
