/**
 * upload_product_images.js
 *
 * Uploads all images from public/images/products/ to the Supabase
 * 'images' bucket at path: products/<filename>
 *
 * After uploading, it updates each product row in the DB so that
 * the `images` column holds the public Supabase CDN URLs instead
 * of the local /images/products/... paths.
 *
 * Usage:
 *   node scripts/upload_product_images.js
 *
 * Options (env vars):
 *   SKIP_DB_UPDATE=true  — only upload files, don't patch the DB
 */

const fs   = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// ─── Config ────────────────────────────────────────────────────────────────
const SUPABASE_URL    = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY     = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET          = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || 'images';
const LOCAL_DIR       = path.join(__dirname, '..', 'public', 'images', 'products');
const SKIP_DB_UPDATE  = process.env.SKIP_DB_UPDATE === 'true';

// How many files to upload in parallel (avoids overwhelming the API)
const CONCURRENCY = 5;

// ─── Validation ────────────────────────────────────────────────────────────
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}
if (!fs.existsSync(LOCAL_DIR)) {
  console.error(`❌ Local image directory not found: ${LOCAL_DIR}`);
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

// ─── Helpers ───────────────────────────────────────────────────────────────
function getContentType(filename) {
  const ext = path.extname(filename).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.png')  return 'image/png';
  if (ext === '.webp') return 'image/webp';
  if (ext === '.gif')  return 'image/gif';
  if (ext === '.svg')  return 'image/svg+xml';
  return 'application/octet-stream';
}

function publicUrl(filename) {
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/products/${filename}`;
}

/** Upload a single file. Returns { ok, file, error } */
async function uploadFile(file) {
  const filePath    = path.join(LOCAL_DIR, file);
  const storagePath = `products/${file}`;
  const buffer      = fs.readFileSync(filePath);

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, buffer, {
      contentType: getContentType(file),
      upsert: true,   // overwrite if it already exists
    });

  return { ok: !error, file, error: error?.message };
}

/** Run an array of async tasks with limited concurrency */
async function pool(tasks, limit) {
  const results = [];
  let i = 0;

  async function worker() {
    while (i < tasks.length) {
      const idx  = i++;
      results[idx] = await tasks[idx]();
    }
  }

  const workers = Array.from({ length: limit }, () => worker());
  await Promise.all(workers);
  return results;
}

// ─── Main ──────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n🚀 Uploading product images to Supabase (bucket: "${BUCKET}")\n`);

  // 1. Collect files
  const files = fs
    .readdirSync(LOCAL_DIR)
    .filter(f => !f.startsWith('.') && fs.statSync(path.join(LOCAL_DIR, f)).isFile());

  console.log(`📁 Found ${files.length} image files in ${LOCAL_DIR}\n`);

  // 2. Upload with progress counter
  let done = 0;
  const failed = [];

  const tasks = files.map((file, idx) => async () => {
    const result = await uploadFile(file);
    done++;
    const status = result.ok ? '✔' : '✘';
    process.stdout.write(`  [${String(done).padStart(3)}/${files.length}] ${status} ${file}`);
    if (!result.ok) {
      process.stdout.write(`  — ${result.error}`);
      failed.push({ file, error: result.error });
    }
    process.stdout.write('\n');
    return result;
  });

  await pool(tasks, CONCURRENCY);

  // 3. Summary
  const ok = files.length - failed.length;
  console.log(`\n✅ Upload complete: ${ok}/${files.length} succeeded`);
  if (failed.length > 0) {
    console.log(`⚠️  ${failed.length} failed:`);
    failed.forEach(f => console.log(`   - ${f.file}: ${f.error}`));
  }

  // 4. Update DB image URLs
  if (SKIP_DB_UPDATE) {
    console.log('\n⏭️  Skipping DB update (SKIP_DB_UPDATE=true)');
    return;
  }

  console.log('\n🗄️  Updating product image URLs in Supabase database…');

  // Fetch all products
  const { data: products, error: fetchError } = await supabase
    .from('products')
    .select('id, slug, images');

  if (fetchError) {
    console.error('❌ Failed to fetch products:', fetchError.message);
    return;
  }

  console.log(`   Found ${products.length} products to process…\n`);

  let dbOk = 0;
  let dbFail = 0;

  for (const product of products) {
    if (!Array.isArray(product.images) || product.images.length === 0) continue;

    // Only convert local paths — leave already-supabase URLs untouched
    const updatedImages = product.images.map(img => {
      if (typeof img === 'string' && img.startsWith('/images/products/')) {
        const filename = path.basename(img);
        return publicUrl(filename);
      }
      return img;
    });

    // Skip if nothing changed
    const changed = updatedImages.some((url, i) => url !== product.images[i]);
    if (!changed) continue;

    const { error: updateError } = await supabase
      .from('products')
      .update({ images: updatedImages })
      .eq('id', product.id);

    if (updateError) {
      console.error(`  ✘ ${product.slug}: ${updateError.message}`);
      dbFail++;
    } else {
      console.log(`  ✔ ${product.slug}`);
      dbOk++;
    }
  }

  console.log(`\n✅ DB update complete: ${dbOk} products updated, ${dbFail} failed`);
  console.log('\n🎉 All done! Product images are now served from Supabase CDN.');
}

main().catch(err => {
  console.error('\n❌ Fatal error:', err.message || err);
  process.exit(1);
});
