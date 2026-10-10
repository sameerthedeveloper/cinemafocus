/**
 * One-off CMS data fixes found by `npm run seo:audit`. Dry run by default.
 *
 *   node scripts/fix-seo-data.mjs                                   # print the plan (read-only)
 *   ADMIN_EMAIL=... ADMIN_PASSWORD='...' node scripts/fix-seo-data.mjs --write
 *
 * Fixes
 *  1. cda2-mk2-cd-dac-pre-amplifier-2  -> canonical_slug = cda2-mk2-cd-dac-pre-amplifier (identical name/specs; duplicate)
 *  2. p4-2                              -> canonical_slug = p4 (same name, "ACT PRO" typo; duplicate)
 *  3. wandla-2                          -> name "WANDLA 2" (its own description says WANDLA 2; it is not a duplicate)
 *  4. beyond-line                       -> create the missing brand row so /brand/beyond-line exists
 *  5. scs70-pro, p1-pro-..., p2-pro-... -> category act-pro -> atc, brand "ACT PRO" -> "ATC" (descriptions say "The ATC ...")
 *
 * Saves a full backup of every row it touches to seo-fix-backup-<timestamp>.json (git-ignored) before writing.
 * PUT replaces whole items, so each write sends the existing row with only the changes applied.
 */
import fs from 'node:fs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local', quiet: true });
const base = process.env.API_GATEWAY_URL?.replace(/\/$/, '');
if (!base) throw new Error('API_GATEWAY_URL is not set');
const write = process.argv.includes('--write');

const get = async (p) => {
  const res = await fetch(base + p);
  if (!res.ok) throw new Error(`${p} -> ${res.status}`);
  return res.json();
};
const [products, categories] = await Promise.all([get('/products'), get('/categories')]);
const bySlug = Object.fromEntries(products.map((p) => [p.slug, p]));
const now = new Date().toISOString();

const edits = []; // { kind, id, before, after, note }
const editProduct = (slug, patch, note) => {
  const before = bySlug[slug];
  if (!before) return console.warn(`skip: product ${slug} not found`);
  const after = { ...before, ...patch, updated_at: now };
  edits.push({ kind: 'product', id: before.productId, slug, before, after, note });
};

if (bySlug['cda2-mk2-cd-dac-pre-amplifier']) editProduct('cda2-mk2-cd-dac-pre-amplifier-2', { canonical_slug: 'cda2-mk2-cd-dac-pre-amplifier' }, 'duplicate -> canonical');
if (bySlug['p4']) editProduct('p4-2', { canonical_slug: 'p4' }, 'duplicate -> canonical');
if (bySlug['wandla-2']?.name === 'WANDLA') editProduct('wandla-2', { name: 'WANDLA 2' }, 'rename (distinct product)');
for (const slug of ['scs70-pro', 'p1-pro-dual-mono-power-amplifier', 'p2-pro-dual-mono-power-amplifier']) {
  if (bySlug[slug]?.category === 'act-pro') editProduct(slug, { category: 'atc', brand: 'ATC' }, 'recategorise act-pro -> atc');
}

if (!categories.some((c) => c.slug === 'beyond-line')) {
  const sample = products.find((p) => p.category === 'beyond-line' && p.images?.[0]);
  if (sample) {
    const row = {
      categoryId: 'beyond-line',
      id: 'beyond-line',
      slug: 'beyond-line',
      name: 'Beyond Line',
      description: 'Premium Beyond Line collections selected for the highest acoustic performance.',
      image_url: sample.images[0],
      product_count: 0,
      featured: false,
      created_at: now,
      updated_at: now,
    };
    edits.push({ kind: 'category-create', id: 'beyond-line', slug: 'beyond-line', before: null, after: row, note: 'create missing brand row' });
  }
}

console.log(`${edits.length} change(s) planned:\n`);
for (const e of edits) {
  const changed = e.before
    ? Object.keys(e.after).filter((k) => k !== 'updated_at' && JSON.stringify(e.before[k]) !== JSON.stringify(e.after[k]))
    : Object.keys(e.after);
  console.log(`- [${e.kind}] ${e.slug}: ${e.note}`);
  for (const k of changed) console.log(`    ${k}: ${e.before ? JSON.stringify(e.before[k]) : '(new)'} -> ${JSON.stringify(e.after[k]).slice(0, 110)}`);
}
if (!write) {
  console.log('\nDry run. Re-run with --write (and ADMIN_EMAIL / ADMIN_PASSWORD) to apply.');
  process.exit(0);
}

const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
if (!ADMIN_EMAIL || !ADMIN_PASSWORD) throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD');
const backupFile = `seo-fix-backup-${now.replace(/[:.]/g, '-')}.json`;
fs.writeFileSync(backupFile, JSON.stringify(edits.map((e) => ({ kind: e.kind, id: e.id, before: e.before })), null, 2));
console.log(`\nBackup written: ${backupFile}`);

const login = await fetch(`${base}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
});
const auth = await login.json();
if (!login.ok || !auth.IdToken) throw new Error(`Login failed: ${auth.error || login.status}`);
const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.IdToken}` };

let failed = 0;
for (const e of edits) {
  const [method, path] =
    e.kind === 'product' ? ['PUT', `/products/${encodeURIComponent(e.id)}`] : ['POST', '/categories'];
  const res = await fetch(base + path, { method, headers, body: JSON.stringify(e.after) });
  console.log(`${res.ok ? 'ok  ' : 'FAIL'} ${e.slug} (HTTP ${res.status})`);
  if (!res.ok) failed++;
}
console.log(failed ? `\n${failed} write(s) failed.` : '\nDone. The site cache refreshes within an hour (or save any product in the admin to refresh now).');
process.exit(failed ? 1 : 0);
