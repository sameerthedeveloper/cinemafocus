/**
 * Brand Folder Audit Script
 * 
 * Maps root-level images to brand-specific subfolders.
 * Rule: products/<brand>/<filename>
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
    console.log('🔍 Auditing Storage for Brand Folder Restructuring...');

    // 1. List all root files
    const { data: files, error } = await supabase.storage.from(BUCKET_NAME).list('', { limit: 1000 });
    
    if (error) {
        console.error('❌ Error listing storage:', error.message);
        return;
    }

    const moveMap = {};
    const stats = { total: 0, mapped: 0 };

    // 2. Fetch all products to match brands accurately
    const { data: products } = await supabase.from('products').select('slug, brand');
    const brandMap = {}; // slug -> brand
    if (products) {
        products.forEach(p => brandMap[`${p.slug}${path.extname(p.slug) || ''}`] = p.brand);
    }

    for (const file of files) {
        if (file.id === null) continue; // Skip folders
        
        const oldName = file.name;
        stats.total++;

        // Brand extraction rule: everything before the first hyphen
        const brand = oldName.split('-')[0].toLowerCase();
        
        let newPath;
        if (['speakers', 'amplifiers', 'turntables', 'source'].some(c => oldName.startsWith(c))) {
            newPath = `categories/${oldName}`;
        } else if (oldName.startsWith('hero-') || oldName.startsWith('seo-') || oldName.startsWith('trust-')) {
            newPath = `site/${oldName}`;
        } else if (brand && brand.length > 1) {
            newPath = `products/${brand}/${oldName}`;
        } else {
            newPath = `misc/${oldName}`;
        }

        moveMap[oldName] = newPath;
        stats.mapped++;
    }

    // 3. Generate Artifact
    console.log('\n📝 Generating FOLDER_RESTRUCTURE_MAP.md...');
    let report = '# Folder Restructure Map\n\nProposed movement from root to subfolders.\n\n';
    report += `| Current File (Root) | Target Path | Brand/Category |\n`;
    report += `| :--- | :--- | :--- |\n`;
    
    for (const [oldPath, newPath] of Object.entries(moveMap)) {
        const parts = newPath.split('/');
        const category = parts.length > 2 ? parts[1] : parts[0];
        report += `| \`${oldPath}\` | \`${newPath}\` | \`${category}\` |\n`;
    }

    fs.writeFileSync('FOLDER_RESTRUCTURE_MAP.md', report);
    
    console.log(`\n✅ Audit Complete!`);
    console.log(`   Files analyzed: ${stats.total}`);
    console.log(`   Mapped: ${stats.mapped}`);
}

audit();
