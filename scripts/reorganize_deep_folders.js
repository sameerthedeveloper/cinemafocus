/**
 * Deep Reorganization Script
 * 
 * Performs copy + verify (public reachability) + delete for deep product folders.
 * Then updates all database references.
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET_NAME = 'images';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function moveStorageFile(oldPath, newPath) {
    if (oldPath === newPath) return null;
    
    console.log(`   🔄 Moving: ${oldPath} -> ${newPath}`);

    // 1. Copy to new path
    const { error: copyError } = await supabase.storage
        .from(BUCKET_NAME)
        .copy(oldPath, newPath);

    if (copyError) {
        if (copyError.message.includes('already exists')) {
            console.log('      ⚠️  Target already exists, proceeding to verification.');
        } else {
            throw new Error(`Copy failed: ${copyError.message}`);
        }
    }

    // 2. Verify reachability
    const { data: { publicUrl } } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(newPath);

    try {
        const response = await axios.head(publicUrl);
        if (response.status !== 200) {
            throw new Error(`Public URL returned status ${response.status}`);
        }
    } catch (err) {
        throw new Error(`Reachability check failed for ${publicUrl}: ${err.message}`);
    }

    // 3. Delete old file
    const { error: deleteError } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([oldPath]);

    if (deleteError) {
        console.warn(`      ⚠️  Delete old file failed (copy succeeded): ${deleteError.message}`);
    }

    return publicUrl;
}

async function run() {
    console.log('🚀 Starting Deep Product Folder Reorganization...');

    // 1. Read Mapping
    if (!fs.existsSync('PRODUCT_FOLDER_MAP.md')) {
        console.error('❌ Error: PRODUCT_FOLDER_MAP.md not found. Run audit first.');
        process.exit(1);
    }

    const mapContent = fs.readFileSync('PRODUCT_FOLDER_MAP.md', 'utf8');
    const lines = mapContent.split('\n').filter(l => l.includes('` | `'));
    
    const moveMap = {};
    for (const line of lines) {
        const match = line.match(/`([^`]+)` \| `([^`]+)`/);
        if (match) moveMap[match[1]] = match[2];
    }

    const total = Object.keys(moveMap).length;
    console.log(`📊 Processing ${total} files...`);

    // 2. Perform Moves
    for (const [oldPath, newPath] of Object.entries(moveMap)) {
        try {
            await moveStorageFile(oldPath, newPath);
        } catch (err) {
            console.error(`   ❌ Failed processing ${oldPath}:`, err.message);
        }
    }

    // 3. Update Database
    console.log('\n🗄️  Updating Database References...');
    const tables = ['products']; // Focus primarily on products for this deep nested structure
    
    for (const table of tables) {
        const { data: records } = await supabase.from(table).select('*');
        if (!records) continue;

        for (const record of records) {
            const updates = {};
            let changed = false;

            // Update image_url
            if (record.image_url) {
                const parts = record.image_url.split('/public/images/')[1]?.split('/') || [];
                const oldPath = parts.join('/');
                if (moveMap[oldPath]) {
                    updates.image_url = getFullUrl(moveMap[oldPath]);
                    changed = true;
                }
            }

            // Update images array
            if (Array.isArray(record.images)) {
                const newImages = record.images.map(url => {
                    const parts = url.split('/public/images/')[1]?.split('/') || [];
                    const oldPath = parts.join('/');
                    if (moveMap[oldPath]) {
                        changed = true;
                        return getFullUrl(moveMap[oldPath]);
                    }
                    return url;
                });
                if (changed) updates.images = newImages;
            }

            if (changed) {
                await supabase.from(table).update(updates).eq('id', record.id);
            }
        }
    }

    console.log('\n🏁 Deep Folder Reorganization Complete!');
}

function getFullUrl(path) {
    return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${path}`;
}

run();
