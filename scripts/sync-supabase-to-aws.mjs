#!/usr/bin/env node
/**
 * Incremental sync: copy rows that exist in Supabase but NOT in AWS (DynamoDB + S3).
 *
 *   node scripts/sync-supabase-to-aws.mjs                 # DRY RUN (default): reads only, lists what would be added
 *   node scripts/sync-supabase-to-aws.mjs --write         # actually write the missing rows / images to AWS
 *
 * Options:
 *   --tables=products,messages   limit to some tables (default: all of
 *                                products, categories, new_launches, press_releases, projects, messages, site_settings)
 *   --since=2026-09-14           only add rows created on/after this date (rows without a date are kept)
 *   --skip-storage               don't copy images to S3
 *
 * Safety:
 *   - Add-only. A row is written only if its key does not already exist in AWS
 *     (conditional put), so nothing already in AWS is ever overwritten or deleted.
 *   - Rows whose slug is already used in AWS by a different id are reported as
 *     conflicts and skipped (no duplicate public URLs).
 *   - Read-only against Supabase. Dry run is read-only against AWS as well.
 *   - Only images referenced by the rows being added are copied (and only if not already in S3).
 *   - Rows you deleted in AWS after the migration will look "missing" and be re-added;
 *     use --since (and review the dry-run list) to avoid resurrecting them.
 *
 * Credentials (never printed):
 *   Supabase source:  SOURCE_SUPABASE_URL + SOURCE_SUPABASE_SERVICE_ROLE_KEY   (from .env.migration),
 *                     or NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY   (from .env.local)
 *   AWS:              your local AWS CLI credentials; CDN_DOMAIN, IMAGES_BUCKET, AWS_REGION,
 *                     DYNAMO_TABLE_PREFIX from .env.local (defaults: ap-south-1, "cinemafocus-")
 *   Needs the AWS SDK from infra/:  cd infra && npm ci
 */
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { TABLES, DEFAULT_TABLES, toItem, planTable, collectStoragePaths, labelFor } from './lib/supabase-to-aws-sync.mjs';

for (const f of ['.env.migration', '.env.local']) if (fs.existsSync(f)) process.loadEnvFile(f);

const argv = process.argv.slice(2);
const WRITE = argv.includes('--write');
const SKIP_STORAGE = argv.includes('--skip-storage');
const opt = (name) => argv.find((a) => a.startsWith(`--${name}=`))?.split('=').slice(1).join('=');
const tables = (opt('tables')?.split(',').map((s) => s.trim()).filter(Boolean)) || DEFAULT_TABLES;
const since = opt('since') ? new Date(opt('since')) : null;

const SUPABASE_URL = (process.env.SOURCE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '');
const SUPABASE_KEY = process.env.SOURCE_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET_SRC = process.env.SOURCE_SUPABASE_BUCKET || 'images';
const CDN_DOMAIN = process.env.CDN_DOMAIN || process.env.NEXT_PUBLIC_CDN_DOMAIN;
const IMAGES_BUCKET = process.env.IMAGES_BUCKET;
const REGION = process.env.AWS_REGION || 'ap-south-1';
const PREFIX = process.env.DYNAMO_TABLE_PREFIX || 'cinemafocus-';

const fail = (msg, code = 2) => { console.error(msg); process.exit(code); };
const bad = tables.filter((t) => !TABLES[t]);
if (bad.length) fail(`Unknown table(s): ${bad.join(', ')}. Valid: ${DEFAULT_TABLES.join(', ')}`);
if (since && Number.isNaN(since.getTime())) fail('--since must be a date, e.g. --since=2026-09-14');
const missingEnv = [
  !SUPABASE_URL && 'SOURCE_SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL)',
  !SUPABASE_KEY && 'SOURCE_SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SERVICE_ROLE_KEY)',
  !CDN_DOMAIN && 'CDN_DOMAIN',
  !SKIP_STORAGE && !IMAGES_BUCKET && 'IMAGES_BUCKET (or pass --skip-storage)',
].filter(Boolean);
if (missingEnv.length) fail(`Missing configuration: ${missingEnv.join(', ')}\nPut the Supabase ones in .env.migration (gitignored) and the AWS ones in .env.local.`);

// AWS SDK lives in infra/ (see its package.json); load it from there.
let ddb, lib, s3sdk;
try {
  const req = createRequire(new URL('../infra/package.json', import.meta.url));
  ddb = req('@aws-sdk/client-dynamodb');
  lib = req('@aws-sdk/lib-dynamodb');
  s3sdk = req('@aws-sdk/client-s3');
} catch {
  fail('AWS SDK not found. Run:  cd infra && npm ci');
}
const doc = lib.DynamoDBDocumentClient.from(new ddb.DynamoDBClient({ region: REGION }), { marshallOptions: { removeUndefinedValues: true } });
const s3 = new s3sdk.S3Client({ region: REGION });

const supabaseHeaders = { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` };
const SUPABASE_PREFIX = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_SRC}/`;

async function fetchSupabase(table) {
  const rows = [];
  for (let from = 0; ; from += 1000) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*&order=id.asc`, {
      headers: { ...supabaseHeaders, Range: `${from}-${from + 999}`, 'Range-Unit': 'items' },
    });
    if (!res.ok) throw new Error(`Supabase ${table}: HTTP ${res.status}`);
    const page = await res.json();
    rows.push(...page);
    if (page.length < 1000) return rows;
  }
}

async function scanAws(tableName, cfg) {
  const items = [];
  let ExclusiveStartKey;
  do {
    const out = await doc.send(new lib.ScanCommand({
      TableName: PREFIX + cfg.table,
      ProjectionExpression: '#pk, #slug',
      ExpressionAttributeNames: { '#pk': cfg.pk, '#slug': 'slug' },
      ExclusiveStartKey,
    }));
    items.push(...(out.Items || []));
    ExclusiveStartKey = out.LastEvaluatedKey;
  } while (ExclusiveStartKey);
  return items;
}

async function s3Has(key) {
  try {
    await s3.send(new s3sdk.HeadObjectCommand({ Bucket: IMAGES_BUCKET, Key: key }));
    return true;
  } catch (e) {
    if (e.name === 'NotFound' || e.$metadata?.httpStatusCode === 404) return false;
    throw e;
  }
}

async function copyImage(path) {
  if (await s3Has(path)) return 'exists';
  const url = SUPABASE_PREFIX + path.split('/').map(encodeURIComponent).join('/');
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download HTTP ${res.status}`);
  await s3.send(new s3sdk.PutObjectCommand({
    Bucket: IMAGES_BUCKET,
    Key: path,
    Body: Buffer.from(await res.arrayBuffer()),
    ContentType: res.headers.get('content-type') || 'application/octet-stream',
    CacheControl: 'public, max-age=31536000, immutable',
  }));
  return 'copied';
}

console.log(`Mode: ${WRITE ? 'WRITE (adds missing rows to AWS)' : 'DRY RUN (read-only; nothing is written)'}`);
console.log(`Tables: ${tables.join(', ')}${since ? `  |  since ${since.toISOString().slice(0, 10)}` : ''}\n`);

const report = [];
const pendingImages = new Set();
const ctx = { supabasePrefix: SUPABASE_PREFIX, cdnDomain: CDN_DOMAIN };

for (const name of tables) {
  const cfg = TABLES[name];
  try {
    const [rows, existing] = await Promise.all([fetchSupabase(name), scanAws(name, cfg)]);
    const plan = planTable(name, rows, existing, { since });
    const items = plan.toAdd.map((r) => toItem(r, name, ctx));

    console.log(`${name}: Supabase ${rows.length} | already in AWS ${plan.alreadyThere} | to add ${items.length}` +
      `${plan.conflicts.length ? ` | conflicts ${plan.conflicts.length}` : ''}${plan.filteredBySince ? ` | older than --since ${plan.filteredBySince}` : ''}`);
    plan.toAdd.slice(0, 25).forEach((r) => console.log(`   + ${labelFor(name, r)}`));
    if (plan.toAdd.length > 25) console.log(`   … and ${plan.toAdd.length - 25} more`);
    plan.conflicts.forEach((c) => console.log(`   ! skipped ${c.id}: ${c.reason}`));

    let written = 0;
    let raced = 0;
    if (WRITE) {
      for (const Item of items) {
        try {
          await doc.send(new lib.PutCommand({
            TableName: PREFIX + cfg.table,
            Item,
            ConditionExpression: 'attribute_not_exists(#pk)',
            ExpressionAttributeNames: { '#pk': cfg.pk },
          }));
          written++;
          collectStoragePaths(Item, CDN_DOMAIN).forEach((p) => pendingImages.add(p));
        } catch (e) {
          if (e.name === 'ConditionalCheckFailedException') raced++; // appeared since the scan; leave it
          else throw e;
        }
      }
      console.log(`   wrote ${written}${raced ? `, skipped ${raced} that appeared meanwhile` : ''}`);
    } else {
      items.forEach((it) => collectStoragePaths(it, CDN_DOMAIN).forEach((p) => pendingImages.add(p)));
    }
    report.push({ table: name, supabase: rows.length, inAws: plan.alreadyThere, toAdd: items.length, conflicts: plan.conflicts.length, written });
  } catch (e) {
    console.error(`${name}: FAILED — ${e.message}`);
    report.push({ table: name, error: e.message });
    process.exitCode = 1;
  }
}

// Images referenced by the added rows
if (!SKIP_STORAGE) {
  const paths = [...pendingImages];
  console.log(`\nImages referenced by ${WRITE ? 'added' : 'to-be-added'} rows: ${paths.length}`);
  if (WRITE) {
    let copied = 0, existed = 0;
    for (const p of paths) {
      try {
        (await copyImage(p)) === 'copied' ? copied++ : existed++;
      } catch (e) {
        console.error(`   image failed ${p}: ${e.message}`);
        process.exitCode = 1;
      }
    }
    console.log(`   copied ${copied}, already in S3 ${existed}`);
  } else {
    let missing = 0;
    for (const p of paths) if (!(await s3Has(p))) missing++;
    console.log(`   ${missing} not yet in S3 (would be copied)`);
  }
}

console.log('\n=== Report ===');
console.table(report);
if (!WRITE) console.log('Dry run only. Review the list above, then re-run with --write to apply.');
