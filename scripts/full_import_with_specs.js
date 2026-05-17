/**
 * full_import_with_specs.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Reads the original Cat/products.json, converts each product into the DB
 * schema, merges in the rich technical specs from scripts/specs_data.js,
 * and upserts everything into the Supabase `products` table.
 *
 * Usage:  node scripts/full_import_with_specs.js
 */

const fs      = require('fs');
const path    = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL;
const CAT_JSON      = path.join(__dirname, '..', 'Cat', 'products.json');
const LOCAL_IMGS    = path.join(__dirname, '..', 'public', 'images', 'products');
const SPECS         = require('./specs_data');

// ── helpers ──────────────────────────────────────────────────────────────────

function cleanString(str) {
  if (!str) return '';
  return str
    .replace(/&amp;/g, '&')
    .replace(/&#8211;/g, '-')
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8230;/g, '...')
    .replace(/&nbsp;/g, ' ')
    .replace(/<[^>]*>/g, '')
    .trim();
}

function slugify(str) {
  return str.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function mapCategory(cats) {
  if (!cats || !cats.length) return 'uncategorized';
  const c = cats[0].toLowerCase();
  if (c.includes('studio')) return 'studio-monitors';
  if (c.includes('floor')) return 'floorstanding-speakers';
  if (c.includes('stand') || c.includes('bookshelf')) return 'bookshelf-speakers';
  if (c.includes('sub')) return 'subwoofers';
  if (c.includes('theater') || c.includes('cinema') || c.includes('home')) return 'home-theater';
  if (c.includes('stream') || c.includes('music player')) return 'music-streamers';
  if (c.includes('amplifier') || c.includes('amp')) return 'amplifiers';
  if (c.includes('tube')) return 'tube-amplifiers';
  if (c.includes('headphone') || c.includes('dac')) return 'dacs-headphones';
  if (c.includes('access') || c.includes('cable')) return 'accessories';
  return slugify(cats[0]);
}




async function run() {
  if (!fs.existsSync(CAT_JSON)) {
    console.error('❌ Cat/products.json not found. Check the path.');
    process.exit(1);
  }

  const raw = JSON.parse(fs.readFileSync(CAT_JSON, 'utf8'));
  console.log(`\n📦 Found ${raw.length} products in Cat/products.json`);
  console.log(`📋 Rich specs available for ${Object.keys(SPECS).length} slugs\n`);

  let ok = 0, fail = 0;

  for (let i = 0; i < raw.length; i++) {
    const p = raw[i];

    const name  = cleanString(p.title || p.name || '');
    const slug  = p.slug || slugify(name);

    // Brand — stored as a category in the Cat JSON (e.g. "ATC", "Lumin", "ProAc")
    const KNOWN_BRANDS = ['ATC','Lumin','HiFi Rose','Hifi Rose','Eversolo','Aurender',
      'Octave','ProAc','Ferrum','Audiovector','System Audio','MJ Acoustics','Kii',
      'Signature','Velox','Kef','Focal','Naim','Linn'];
    const cats  = Array.isArray(p.categories) ? p.categories : [];
    const brand = cats.find(c => KNOWN_BRANDS.some(b => b.toLowerCase() === c.toLowerCase()))
               || cats.find(c => !['Speakers','Enquiry','Studio Monitors','Subwoofers',
                 'Amplifiers','Accessories','Music Streamers','Home Theater','Floorstanding Speakers',
                 'Bookshelf Speakers'].includes(c))
               || '';
    const price = parseFloat(p.price || p.regular_price || 0) || 0;
    const category = mapCategory(cats);

    // images — use the already-renamed local files (slug-0.png, slug-1.png…)
    // which were uploaded to Supabase storage by upload_product_images.js
    const localFiles = fs.existsSync(LOCAL_IMGS)
      ? fs.readdirSync(LOCAL_IMGS)
          .filter(f => f.startsWith(slug + '-') || f.startsWith(slug + '.') )
          .sort()
      : [];

    const images = localFiles.length
      ? localFiles.map(f => `${SUPABASE_URL}/storage/v1/object/public/images/products/${f}`)
      : [`/images/placeholder.svg`];

    const shortDesc = cleanString(p.excerpt || p.short_description || '');
    const longDesc  = cleanString(p.description || p.longDescription || shortDesc || '');
    const featured  = !!(p.featured || false);

    // Merge rich specs if available for this slug
    const specEntry = SPECS[slug];
    const specifications = specEntry
      ? specEntry.specs
      : (p.specifications || [{ key: 'Brand', value: brand }]);

    const long_description = specEntry
      ? specEntry.description
      : longDesc;

    const record = {
      id:                slug,
      slug,
      name,
      brand,
      price,
      category,
      short_description: shortDesc || long_description.slice(0, 200),
      long_description,
      featured,
      images:            images.length ? images : [`/images/placeholder.svg`],
      specifications,
    };

    process.stdout.write(`  [${i + 1}/${raw.length}] ${name.slice(0, 50).padEnd(52)}… `);

    const { error } = await supabase.from('products').upsert(record);
    if (error) {
      console.log(`✘ ${error.message}`);
      fail++;
    } else {
      console.log(`✔`);
      ok++;
    }
  }

  console.log(`\n✅ Done: ${ok} upserted, ${fail} failed.`);
  console.log(`\nNow run:  node scripts/sync_local_json.js   to sync the local JSON.\n`);
}

run().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
