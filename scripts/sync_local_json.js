/**
 * sync_local_json.js
 * Pulls ALL products from Supabase (with pagination) and writes them to
 * public/supabase_products.json so the local file stays in sync.
 *
 * Usage: node scripts/sync_local_json.js
 */
const fs   = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const OUT      = path.join(__dirname, '..', 'public', 'supabase_products.json');
const PAGE_SZ  = 200; // fetch 200 rows at a time

async function fetchAll() {
  let all  = [];
  let from = 0;

  while (true) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name')
      .range(from, from + PAGE_SZ - 1);

    if (error) throw new Error(error.message);
    if (!data || data.length === 0) break;

    all = all.concat(data);
    console.log(`  fetched rows ${from + 1} – ${from + data.length}`);

    if (data.length < PAGE_SZ) break; // last page
    from += PAGE_SZ;
  }

  return all;
}

async function run() {
  console.log('⬇️  Fetching all products from Supabase (paginated)…');
  const products = await fetchAll();
  fs.writeFileSync(OUT, JSON.stringify(products, null, 2));
  console.log(`\n✅ Wrote ${products.length} products → public/supabase_products.json`);
}

run().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
