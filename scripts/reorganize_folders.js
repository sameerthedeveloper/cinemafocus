/**
 * Folder Reorganization Script
 * 
 * Performs copy + verify (public reachability) + delete for brand folders.
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
    console.log('🚀 Starting Brand-Based Folder Reorganization...');

    // 1. Read Mapping
    if (!fs.existsSync('FOLDER_RESTRUCTURE_MAP.md')) {
        console.error('❌ Error: FOLDER_RESTRUCTURE_MAP.md not found. Run audit first.');
        process.exit(1);
    }

    const mapContent = fs.readFileSync('FOLDER_RESTRUCTURE_MAP.md', 'utf8');
    const lines = mapContent.split('\n').filter(l => l.includes('` | `'));
    
    const moveMap = {};
    for (const line of lines) {
        const match = line.match(/`([^`]+)` \| `([^`]+)`/);
        if (match) moveMap[match[1]] = match[2];
    }

    const total = Object.keys(moveMap).length;
    console.log(`📊 Processing ${total} files...`);

    // 2. Perform Moves
    const results = [];
    for (const [oldPath, newPath] of Object.entries(moveMap)) {
        try {
            await moveStorageFile(oldPath, newPath);
            results.push({ oldPath, newPath, status: 'SUCCESS' });
        } catch (err) {
            console.error(`   ❌ Failed processing ${oldPath}:`, err.message);
            results.push({ oldPath, newPath, status: 'FAILED', reason: err.message });
        }
    }

    // 3. Update Database
    console.log('\n🗄️  Updating Database References...');
    const tables = ['products', 'categories', 'press_releases', 'projects', 'new_launches'];
    
    for (const table of tables) {
        const { data: records } = await supabase.from(table).select('*');
        if (!records) continue;

        for (const record of records) {
            const updates = {};
            let changed = false;

            // Update image_url
            if (record.image_url) {
                const oldName = record.image_url.split('/').pop();
                if (moveMap[oldName]) {
                    updates.image_url = getFullUrl(moveMap[oldName]);
                    changed = true;
                }
            }

            // Update images array
            if (Array.isArray(record.images)) {
                const newImages = record.images.map(url => {
                    const oldName = url.split('/').pop();
                    if (moveMap[oldName]) {
                        changed = true;
                        return getFullUrl(moveMap[oldName]);
                    }
                    return url;
                });
                if (changed) updates.images = newImages;
            }

            // Update cover_images array
            if (Array.isArray(record.cover_images)) {
                const newCovers = record.cover_images.map(url => {
                    const oldName = url.split('/').pop();
                    if (moveMap[oldName]) {
                        changed = true;
                        return getFullUrl(moveMap[oldName]);
                    }
                    return url;
                });
                if (changed) updates.cover_images = newCovers;
            }

            if (changed) {
                await supabase.from(table).update(updates).eq('id', record.id);
            }
        }
    }

    // 4. Update Site Settings
    const { data: settings } = await supabase.from('site_settings').select('*');
    if (settings) {
        for (const s of settings) {
            if (s.id === 'hero_main' && s.data.imageUrl) {
                const oldName = s.data.imageUrl.split('/').pop();
                if (moveMap[oldName]) {
                    const newData = { ...s.data, imageUrl: getFullUrl(moveMap[oldName]) };
                    await supabase.from('site_settings').update({ data: newData }).eq('id', s.id);
                }
            }
        }
    }

    console.log('\n🏁 Folder Reorganization Complete!');
}

function getFullUrl(path) {
    return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${path}`;
}

run();
