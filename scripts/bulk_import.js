const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Error: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const productsJsonPath = path.join(__dirname, '..', 'public', 'supabase_products.json');
const categoriesJsonPath = path.join(__dirname, '..', 'public', 'supabase_categories.json');
const localImagesDir = path.join(__dirname, '..', 'public', 'images', 'products');

function getContentType(filename) {
  const ext = path.extname(filename).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.png') return 'image/png';
  if (ext === '.webp') return 'image/webp';
  if (ext === '.svg') return 'image/svg+xml';
  return 'application/octet-stream';
}

async function run() {
  try {
    console.log("🚀 Starting Supabase Bulk Import...");

    // 1. Load data
    if (!fs.existsSync(categoriesJsonPath) || !fs.existsSync(productsJsonPath)) {
      console.error("❌ Error: Converted JSON files not found. Please run 'node scripts/convert_products.js' first.");
      process.exit(1);
    }

    const categories = JSON.parse(fs.readFileSync(categoriesJsonPath, 'utf8'));
    const products = JSON.parse(fs.readFileSync(productsJsonPath, 'utf8'));

    // 2. Upsert categories
    console.log(`\n📂 Seeding ${categories.length} Categories...`);
    for (const cat of categories) {
      console.log(`- Seeding category: ${cat.name} (/${cat.slug})`);
      const { error } = await supabase
        .from('categories')
        .upsert({
          id: cat.id,
          slug: cat.slug,
          name: cat.name,
          description: cat.description,
          image_url: cat.imageUrl,
          featured: cat.featured,
          product_count: products.filter(p => p.category === cat.slug).length
        });
      
      if (error) {
        console.error(`  ✘ Failed to seed ${cat.slug}:`, error.message);
      } else {
        console.log(`  ✔ Successfully seeded ${cat.slug}`);
      }
    }

    // 3. Upload images to Supabase Storage Bucket
    console.log("\n📷 Syncing images to Supabase Storage 'images' bucket...");
    if (fs.existsSync(localImagesDir)) {
      const files = fs.readdirSync(localImagesDir).filter(f => !f.startsWith('.'));
      console.log(`Found ${files.length} images to sync...`);

      let successCount = 0;
      let failCount = 0;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const filePath = path.join(localImagesDir, file);
        const fileBuffer = fs.readFileSync(filePath);
        const storagePath = `products/${file}`;

        process.stdout.write(`- Uploading image [${i + 1}/${files.length}]: ${file}... `);

        const { error } = await supabase.storage
          .from('images')
          .upload(storagePath, fileBuffer, {
            contentType: getContentType(file),
            upsert: true
          });

        if (error) {
          console.log(`✘ Failed: ${error.message}`);
          failCount++;
        } else {
          console.log("✔ Uploaded");
          successCount++;
        }
      }
      console.log(`Image sync complete: ${successCount} successful, ${failCount} failed.`);
    } else {
      console.log("⚠️ No local renamed images found in public/images/products.");
    }

    // 4. Upsert Products
    console.log(`\n📦 Importing ${products.length} Products to Supabase...`);
    let prodSuccess = 0;
    let prodFail = 0;

    for (let i = 0; i < products.length; i++) {
      const prod = products[i];
      
      // Update image URLs to use public Supabase Storage paths instead of local public paths if desired
      // Public URL format: https://[project].supabase.co/storage/v1/object/public/images/products/[filename]
      const supabaseImages = prod.images.map(imgUrl => {
        if (imgUrl.startsWith('/images/products/')) {
          const fileName = path.basename(imgUrl);
          return `${supabaseUrl}/storage/v1/object/public/images/products/${fileName}`;
        }
        return imgUrl;
      });

      const mappedProduct = {
        id: prod.id,
        name: prod.name,
        slug: prod.slug,
        brand: prod.brand,
        price: prod.price,
        category: prod.category,
        short_description: prod.shortDescription,
        long_description: prod.longDescription,
        featured: prod.featured,
        images: supabaseImages,
        specifications: prod.specifications
      };

      console.log(`- [${i + 1}/${products.length}] Upserting product: ${mappedProduct.name}`);
      const { error } = await supabase
        .from('products')
        .upsert(mappedProduct);

      if (error) {
        console.error(`  ✘ Failed to upsert ${mappedProduct.name}:`, error.message);
        prodFail++;
      } else {
        prodSuccess++;
      }
    }

    console.log(`\n🎉 Bulk Sync Complete!`);
    console.log(`- Categories Seeded Successfully`);
    console.log(`- Products Upserted: ${prodSuccess} successful, ${prodFail} failed.`);
    console.log(`\n💡 Run 'npm run dev' to launch the app!`);

  } catch (err) {
    console.error("\n❌ Fatal Error:", err.message || err);
    process.exit(1);
  }
}

run();
