/**
 * Deep Folder Audit Script
 * 
 * Maps brand-nested images to product-specific subfolders.
 * Structure: products/<brand>/<slug>/<filename>
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET_NAME = 'images';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function audit() {
    console.log('🔍 Auditing for Deep Product Folder Restructuring...');

    // 1. Fetch all products to match slugs accurately
    const { data: products } = await supabase.from('products').select('slug, brand');
    const slugs = products.map(p => p.slug);
    
    // 2. Identify brand folders
    const { data: brandFolders, error: lsError } = await supabase.storage.from(BUCKET_NAME).list('products');
    if (lsError) {
        console.error('❌ Error listing brand folders:', lsError.message);
        return;
    }

    const moveMap = {};
    const stats = { total: 0, mapped: 0 };

    for (const brand of brandFolders) {
        if (brand.id === null) { // This is a directory
            console.log(`   📂 Analyzing brand: ${brand.name}...`);
            const { data: files } = await supabase.storage.from(BUCKET_NAME).list(`products/${brand.name}`);
            
            if (!files) continue;

            for (const file of files) {
                if (!file.name.includes('.')) continue; // Skip subdirectories if any

                const oldPath = `products/${brand.name}/${file.name}`;
                stats.total++;

                // find best matching slug
                // Filename might be slug.jpg or slug-0.jpg
                const nameWithoutExt = path.parse(file.name).name;
                const matchedSlug = slugs.find(s => nameWithoutExt.startsWith(s)) || nameWithoutExt.split('-').slice(0, -1).join('-');

                if (matchedSlug) {
                    const newPath = `products/${brand.name}/${matchedSlug}/${file.name}`;
                    moveMap[oldPath] = newPath;
                    stats.mapped++;
                }
            }
        }
    }

    // 3. Generate Artifact
    console.log('\n📝 Generating PRODUCT_FOLDER_MAP.md...');
    let report = '# Product Folder Map\n\nProposed movement to deep product-specific folders.\n\n';
    report += `| Current Path | Target Path |\n`;
    report += `| :--- | :--- |\n`;
    
    for (const [oldPath, newPath] of Object.entries(moveMap)) {
        report += `| \`${oldPath}\` | \`${newPath}\` |\n`;
    }

    fs.writeFileSync('PRODUCT_FOLDER_MAP.md', report);
    
    console.log(`\n✅ Audit Complete!`);
    console.log(`   Files found in brand folders: ${stats.total}`);
    console.log(`   Mapped: ${stats.mapped}`);
}

audit();
