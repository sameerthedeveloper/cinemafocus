/**
 * Targeted Migration: Press Releases
 * 
 * Specifically handles the UUID mismatch for press_releases.
 */

const admin = require('firebase-admin');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config({ path: '.env.local' });

const SERVICE_ACCOUNT_PATH = path.join(process.cwd(), 'firebase-service-account.json');
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET_NAME = 'images';

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(require(SERVICE_ACCOUNT_PATH)),
        storageBucket: 'cinemafocus-bf775.firebasestorage.app'
    });
}

const db = admin.firestore();
const storage = admin.storage().bucket();
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function isValidUUID(uuid) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid);
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

async function migrateStorageFile(firebaseUrl) {
    if (!firebaseUrl || typeof firebaseUrl !== 'string' || !firebaseUrl.includes('firebasestorage.googleapis.com')) {
        return firebaseUrl;
    }

    try {
        const match = firebaseUrl.match(/\/o\/([^?#]+)/);
        if (!match) return firebaseUrl;
        
        const filePath = decodeURIComponent(match[1]);
        const sanitizedPath = filePath.split('/').map(part => part.replace(/[^a-zA-Z0-9.-]/g, '_')).join('/');
        const fileName = path.basename(sanitizedPath);

        console.log(`   🖼️  Transferring: ${fileName}...`);

        const [fileBuffer] = await storage.file(filePath).download();
        const { error } = await supabase.storage.from(BUCKET_NAME).upload(sanitizedPath, fileBuffer, { upsert: true, contentType: 'image/auto' });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage.from(BUCKET_NAME).getPublicUrl(sanitizedPath);
        return publicUrl;
    } catch (err) {
        console.warn(`   ⚠️  Failed to transfer file:`, err.message);
        return firebaseUrl;
    }
}

async function run() {
    console.log('🚀 Starting Targeted Press Release Migration...');

    const snapshot = await db.collection('press_releases').get();
    if (snapshot.empty) {
        console.log('⚠️ No press releases found in Firestore.');
        return;
    }

    const press = [];
    for (const doc of snapshot.docs) {
        const d = doc.data();
        console.log(`📦 Processing: ${d.title || doc.id}...`);

        const coverImages = [];
        if (Array.isArray(d.coverImages)) {
            for (const url of d.coverImages) {
                coverImages.push(await migrateStorageFile(url));
            }
        }

        press.push({
            id: isValidUUID(doc.id) ? doc.id : crypto.randomUUID(),
            title: d.title || 'Untitled',
            slug: d.slug || (d.title ? d.title.toLowerCase().replace(/ /g, '-') : doc.id),
            date: parseFirestoreDate(d.date),
            excerpt: d.excerpt || '',
            image_url: await migrateStorageFile(d.imageUrl || d.image_url),
            cover_images: coverImages,
            pdf_url: d.pdfUrl || d.pdf_url || null,
            content_blocks: d.content_blocks || d.contentBlocks || []
        });
    }

    const { error } = await supabase.from('press_releases').upsert(press);
    
    if (error) {
        console.error('❌ Migration failed:', error.message);
    } else {
        console.log(`✅ Successfully migrated ${press.length} press releases!`);
    }
}

run();
