/**
 * Storage Reorganization Script
 * 
 * Performs copy + verify + delete for images based on the rename map.
 * Then updates all database references.
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET_NAME = 'images';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function renameStorageFile(oldPath, newPath) {
    console.log(`   🔄 Renaming: ${oldPath} -> ${newPath}`);
    
    // 1. Copy
    const { error: copyError } = await supabase.storage
        .from(BUCKET_NAME)
        .copy(oldPath, newPath);
        
    if (copyError) {
        if (copyError.message.includes('already exists')) {
            console.log('      ⚠️  New file already exists, continuing to update DB.');
        } else {
            throw new Error(`Copy failed: ${copyError.message}`);
        }
    }

    // 2. Verify (Check if new exists)
    const { data: listData } = await supabase.storage.from(BUCKET_NAME).list(pathDir(newPath), { search: pathBase(newPath) });
    if (!listData || listData.length === 0) {
        // Double check with getPublicUrl + head/get if list is messy
        const { data: { publicUrl } } = supabase.storage.from(BUCKET_NAME).getPublicUrl(newPath);
        if (!publicUrl) throw new Error(`New file not confirmed after copy: ${newPath}`);
    }

    // 3. Delete old file (only if paths are actually different)
    if (oldPath !== newPath) {
        const { error: deleteError } = await supabase.storage.from(BUCKET_NAME).remove([oldPath]);
        if (deleteError) {
            console.warn(`      ⚠️  Delete failed (copy succeeded): ${deleteError.message}`);
        }
    }

    const { data: { publicUrl } } = supabase.storage.from(BUCKET_NAME).getPublicUrl(newPath);
    return publicUrl;
}

function pathDir(p) {
    const parts = p.split('/');
    parts.pop();
    return parts.join('/') || '';
}

function pathBase(p) {
    return p.split('/').pop();
}

async function run() {
    console.log('🚀 Starting Storage Reorganization...');

    // 1. Read Mapping
    const mapContent = fs.readFileSync('IMAGE_RENAME_MAP.md', 'utf8');
    const lines = mapContent.split('\n').filter(l => l.includes('🔄 Pending'));
    
    const renameMap = {};
    for (const line of lines) {
        const match = line.match(/`([^`]+)` \| `([^`]+)`/);
        if (match) {
            renameMap[match[1]] = match[2];
        }
    }

    const total = Object.keys(renameMap).length;
    console.log(`📊 Processing ${total} files...`);

    // 2. Perform Renames
    for (const [oldPath, newPath] of Object.entries(renameMap)) {
        try {
            await renameStorageFile(oldPath, newPath);
        } catch (err) {
            console.error(`   ❌ Failed processing ${oldPath}:`, err.message);
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

            // Handle image_url
            if (record.image_url) {
                const oldPath = getBucketPath(record.image_url);
                if (renameMap[oldPath]) {
                    updates.image_url = getFullUrl(renameMap[oldPath]);
                    changed = true;
                }
            }

            // Handle images array
            if (Array.isArray(record.images)) {
                const newImages = record.images.map(url => {
                    const oldPath = getBucketPath(url);
                    if (renameMap[oldPath]) {
                        changed = true;
                        return getFullUrl(renameMap[oldPath]);
                    }
                    return url;
                });
                if (changed) updates.images = newImages;
            }

            // Handle cover_images array
            if (Array.isArray(record.cover_images)) {
                const newCovers = record.cover_images.map(url => {
                    const oldPath = getBucketPath(url);
                    if (renameMap[oldPath]) {
                        changed = true;
                        return getFullUrl(renameMap[oldPath]);
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
                const oldPath = getBucketPath(s.data.imageUrl);
                if (renameMap[oldPath]) {
                    const newData = { ...s.data, imageUrl: getFullUrl(renameMap[oldPath]) };
                    await supabase.from('site_settings').update({ data: newData }).eq('id', s.id);
                }
            }
        }
    }

    console.log('\n🏁 Reorganization Complete!');
}

function getBucketPath(url) {
    if (!url || !url.includes('/public/')) return null;
    const parts = url.split('/public/')[1].split('/');
    parts.shift(); // remove bucket
    return parts.join('/');
}

function getFullUrl(path) {
    return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${path}`;
}

run();
