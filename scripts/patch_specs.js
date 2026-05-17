/**
 * patch_specs.js
 * Reads SPECS from specs_data.js and patches the Supabase `products` table.
 * Usage: node scripts/patch_specs.js
 */
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const SPECS = require('./specs_data');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  const slugs = Object.keys(SPECS);
  console.log(`\n🔧 Patching specs for ${slugs.length} products...\n`);
  let ok = 0, fail = 0;

  for (const slug of slugs) {
    const entry = SPECS[slug];
    const patch = {};
    if (entry.description) {
      patch.short_description = entry.description;
      patch.long_description  = entry.description;
    }
    if (entry.specs) patch.specifications = entry.specs;

    const { error } = await supabase.from('products').update(patch).eq('slug', slug);
    if (error) { console.error(`  ✘ ${slug}: ${error.message}`); fail++; }
    else        { console.log(`  ✔ ${slug}`); ok++; }
  }

  console.log(`\n✅ Done: ${ok} updated, ${fail} failed.`);
}

run().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
