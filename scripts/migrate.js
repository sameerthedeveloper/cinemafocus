/**
 * Firebase to Supabase Migration Script
 * 
 * Instructions:
 * 1. Place your Firebase Service Account JSON in the root as 'firebase-service-account.json'.
 * 2. Ensure .env.local has:
 *    - NEXT_PUBLIC_SUPABASE_URL
 *    - SUPABASE_SERVICE_ROLE_KEY
 * 3. Run: node scripts/migrate.js
 */

const admin = require('firebase-admin');
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// --- CONFIGURATION ---
const SERVICE_ACCOUNT_PATH = path.join(process.cwd(), 'firebase-service-account.json');
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use Service Role Key!
const BUCKET_NAME = 'images';

if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
    console.error('❌ Error: firebase-service-account.json not found in root.');
    process.exit(1);
}

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Error: Supabase credentials missing in .env.local.');
    process.exit(1);
}

// --- INITIALIZATION ---
admin.initializeApp({
    credential: admin.credential.cert(require(SERVICE_ACCOUNT_PATH)),
    storageBucket: 'cinemafocus-bf775.firebasestorage.app' // From legacy .env
});

const db = admin.firestore();
const storage = admin.storage().bucket();
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- HELPERS ---

async function migrateCollection(collectionName, supabaseTable, transformFn = (d) => d) {
    console.log(`\n📦 Migrating [${collectionName}] -> [${supabaseTable}]...`);
    const snapshot = await db.collection(collectionName).get();
    
    if (snapshot.empty) {
        console.log(`   ⚠️  No documents found in ${collectionName}.`);
        return;
    }

    const records = [];
    for (const doc of snapshot.docs) {
        const data = doc.data();
        const transformed = await transformFn({ id: doc.id, ...data });
        records.push(transformed);
    }

    const { error } = await supabase.from(supabaseTable).upsert(records);
    
    if (error) {
        console.error(`   ❌ Failed to migrate ${collectionName}:`, error.message);
    } else {
        console.log(`   ✅ Successfully migrated ${records.length} records.`);
    }
}

function parseFirestoreDate(d) {
    if (!d) return new Date().toISOString().split('T')[0];
    try {
        if (typeof d.toDate === 'function') return d.toDate().toISOString().split('T')[0];
        const date = new Date(d);
        if (!isNaN(date.getTime())) return date.toISOString().split('T')[0];
        return new Date().toISOString().split('T')[0];
    } catch (e) {
        return new Date().toISOString().split('T')[0];
    }
}

async function migrateStorageFile(firebaseUrl, targetFolder = '', newFileName = null) {
    if (!firebaseUrl || typeof firebaseUrl !== 'string' || !firebaseUrl.includes('firebasestorage.googleapis.com')) {
        return firebaseUrl;
    }

    try {
        const match = firebaseUrl.match(/\/o\/([^?#]+)/);
        if (!match) return firebaseUrl;
        
        const encodedPath = match[1];
        let filePath = decodeURIComponent(encodedPath);
        
        // Extract extension
        const ext = path.extname(filePath.split('?')[0]) || '.jpg';
        
        // Construct final path
        let finalPath;
        if (targetFolder && newFileName) {
            finalPath = `${targetFolder}/${newFileName}${ext}`;
        } else {
            const sanitizedPath = filePath.split('/').map(part => part.replace(/[^a-zA-Z0-9.-]/g, '_')).join('/');
            finalPath = sanitizedPath;
        }

        console.log(`   🖼️  Transferring to: ${finalPath}...`);

        // Download from Firebase
        const [fileBuffer] = await storage.file(filePath).download();

        // Upload to Supabase
        const { error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(finalPath, fileBuffer, {
                upsert: true,
                contentType: 'image/auto'
            });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(finalPath);

        return publicUrl;
    } catch (err) {
        console.warn(`   ⚠️  Failed to transfer file [${firebaseUrl.substring(0, 50)}...]:`, err.message);
        return firebaseUrl;
    }
}

// --- MIGRATION TASKS ---

async function run() {
    console.log('🚀 Starting Firebase to Supabase Migration...');

    try {
        // 1. Migrate Categories
        await migrateCollection('categories', 'categories', (d) => ({
            id: d.id,
            name: d.name,
            slug: d.slug,
            description: d.description || null,
            image_url: d.imageUrl || d.image_url || null,
            featured: d.featured || false,
            product_count: d.productCount || 0
        }));

        // 2. Migrate Products (with image transfer)
        console.log('\n📦 Migrating Products (including Assets)...');
        const productSnap = await db.collection('products').get();
        const products = [];
        for (const doc of productSnap.docs) {
            const d = doc.data();
            const brand = (d.brand || 'Unbranded').toLowerCase().replace(/\s+/g, '-');
            const slug = d.slug || d.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            const targetFolder = `products/${brand}/${slug}`;
            
            // Transfer images
            const images = [];
            if (Array.isArray(d.images)) {
                for (let i = 0; i < d.images.length; i++) {
                    const newName = `${slug}-${i}`;
                    images.push(await migrateStorageFile(d.images[i], targetFolder, newName));
                }
            } else if (d.imageUrl) {
                images.push(await migrateStorageFile(d.imageUrl, targetFolder, slug));
            }

            products.push({
                id: doc.id,
                name: d.name,
                brand: d.brand,
                slug: slug,
                category: d.category,
                price: d.price || 0,
                short_description: d.shortDescription || d.short_description || null,
                long_description: d.longDescription || d.long_description || null,
                featured: d.featured || false,
                images: images,
                specifications: d.specifications || [],
                created_at: d.createdAt ? d.createdAt.toDate() : new Date()
            });
        }
        const { error: pError } = await supabase.from('products').upsert(products);
        if (pError) console.error('   ❌ Products migration failed:', pError.message);
        else console.log(`   ✅ Successfully migrated ${products.length} products.`);

        // 3. Migrate Press Releases
        console.log('\n📦 Migrating Press Releases...');
        const pressSnap = await db.collection('press_releases').get();
        const press = [];
        for (const doc of pressSnap.docs) {
            const d = doc.data();
            const slug = d.slug || d.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            const targetFolder = `press/${slug}`;

            const coverImages = [];
            if (Array.isArray(d.coverImages)) {
                for (let i = 0; i < d.coverImages.length; i++) {
                    coverImages.push(await migrateStorageFile(d.coverImages[i], targetFolder, `${slug}-cover-${i}`));
                }
            }

            press.push({
                id: doc.id,
                title: d.title,
                slug: slug,
                date: parseFirestoreDate(d.date),
                excerpt: d.excerpt || '',
                image_url: await migrateStorageFile(d.imageUrl || d.image_url, targetFolder, slug),
                cover_images: coverImages,
                pdf_url: d.pdfUrl || d.pdf_url || null,
                content_blocks: d.content_blocks || d.contentBlocks || []
            });
        }
        await supabase.from('press_releases').upsert(press);

        // 4. Migrate Site Settings (Mapping docs to table entries)
        console.log('\n⚙️  Migrating Site Settings...');
        
        // Hero
        const heroSnap = await db.doc('hero/main').get();
        if (heroSnap.exists) {
            const h = heroSnap.data();
            const images = {};
            if (h.imageUrl) images.imageUrl = await migrateStorageFile(h.imageUrl);
            
            await supabase.from('site_settings').upsert({
                id: 'hero_main',
                data: { ...h, ...images }
            });
        }

        // Trust Badges
        const trustSnap = await db.doc('site_content/trust_badges').get();
        if (trustSnap.exists) {
            await supabase.from('site_settings').upsert({
                id: 'trust_badges',
                data: trustSnap.data()
            });
        }

        // 5. Migrate Projects (Gallery)
        await migrateCollection('projects', 'projects', async (d) => {
            const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(d.id);
            const id = isUUID ? d.id : require('crypto').randomUUID();
            const targetFolder = `projects/${id}`;
            const imageUrl = await migrateStorageFile(d.imageUrl || d.image_url, targetFolder, 'main');

            return {
                id, 
                title: d.name || d.title || 'Untitled Project',
                category: d.category || 'Installation',
                image_url: imageUrl,
                created_at: parseFirestoreDate(d.createdAt)
            }
        });

        // 6. Migrate Messages
        await migrateCollection('messages', 'messages', (d) => ({
            id: d.id,
            name: d.name,
            email: d.email,
            subject: d.subject || 'No Subject',
            text: d.text || d.message || '',
            status: d.status || 'unread',
            created_at: parseFirestoreDate(d.createdAt)
        }));

        console.log('\n🏁 Migration Complete!');
        
    } catch (err) {
        console.error('\n💥 Critical Migration Failure:', err);
    }
}

run();
