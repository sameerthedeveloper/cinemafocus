/**
 * Image Audit Script
 * 
 * Scans Supabase database and storage to create a mapping for renaming files to slugs.
 * Run: node scripts/audit_images.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET_NAME = 'images';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function getSlug(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function audit() {
    console.log('🔍 Auditing Supabase Storage & Database...');

    const renameMap = {};
    const stats = { found: 0, mapped: 0, skipped: 0 };

    // 1. Fetch all documents from relevant tables
    const tables = ['products', 'categories', 'press_releases', 'projects', 'new_launches'];
    
    for (const table of tables) {
        console.log(`\n📄 Auditing table: [${table}]`);
        const { data: records, error } = await supabase.from(table).select('*');
        
        if (error) {
            console.error(`   ❌ Error fetching ${table}:`, error.message);
            continue;
        }

        for (const record of records) {
            const slug = record.slug || getSlug(record.name || record.title);
            const imageFields = [];
            
            // Identify image URLs
            if (record.image_url) imageFields.push({ field: 'image_url', url: record.image_url });
            if (Array.isArray(record.images)) record.images.forEach((url, i) => imageFields.push({ field: `images[${i}]`, url }));
            if (Array.isArray(record.cover_images)) record.cover_images.forEach((url, i) => imageFields.push({ field: `cover_images[${i}]`, url }));

            for (const img of imageFields) {
                if (!img.url || !img.url.includes('/storage/v1/object/public/')) continue;
                
                stats.found++;
                
                // Extract path in bucket
                const parts = img.url.split('/public/')[1].split('/');
                const bucket = parts.shift();
                const filePath = parts.join('/');
                
                const ext = path.extname(filePath);
                // Proposed new name: slug + index/field suffix + extension
                let newName = slug;
                if (img.field.includes('[')) {
                    newName += `-${img.field.match(/\[(\d+)\]/)[1]}`;
                }
                newName += ext;

                if (filePath !== newName) {
                    renameMap[filePath] = newName;
                    stats.mapped++;
                } else {
                    stats.skipped++;
                }
            }
        }
    }

    // 2. Also check site_settings (hero, etc.)
    console.log(`\n⚙️  Auditing Site Settings...`);
    const { data: settings } = await supabase.from('site_settings').select('*');
    if (settings) {
        for (const s of settings) {
             // Hero main imageUrl
             if (s.id === 'hero_main' && s.data.imageUrl) {
                 const url = s.data.imageUrl;
                 if (url.includes('/storage/v1/object/public/')) {
                    const parts = url.split('/public/')[1].split('/');
                    const bucket = parts.shift();
                    const filePath = parts.join('/');
                    const ext = path.extname(filePath);
                    renameMap[filePath] = `hero-main${ext}`;
                    stats.mapped++;
                 }
             }
        }
    }

    // 3. Generate Artifact
    console.log('\n📝 Generating IMAGE_RENAME_MAP.md...');
    let report = '# Image Rename Map\n\nGenerated for slug-based storage reorganization.\n\n';
    report += `| Original File | New Name (Slug-based) | Status |\n`;
    report += `| :--- | :--- | :--- |\n`;
    
    for (const [oldPath, newPath] of Object.entries(renameMap)) {
        report += `| \`${oldPath}\` | \`${newPath}\` | 🔄 Pending |\n`;
    }

    fs.writeFileSync('IMAGE_RENAME_MAP.md', report);
    
    console.log(`\n✅ Audit Complete!`);
    console.log(`   Found: ${stats.found} images`);
    console.log(`   Mapped for rename: ${stats.mapped}`);
    console.log(`   Already correct: ${stats.skipped}`);
    console.log('\nReview IMAGE_RENAME_MAP.md before proceeding to Step 3.');
}

audit();
