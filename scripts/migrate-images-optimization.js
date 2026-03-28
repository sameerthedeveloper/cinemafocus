/**
 * Administrative Image Optimization Script (Firebase Admin Version)
 * 
 * This script uses the Firebase Admin SDK to bypass client-side security rules.
 * Use this for bulk data migrations and administrative cleanup.
 * 
 * UPDATED (V4): 
 * 1. Patches broken 403 URLs by assigning metadata tokens without re-uploading.
 * 2. Properly handles encoded filenames (e.g., %2F) in Storage.
 */

import admin from 'firebase-admin';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';
import sharp from 'sharp';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Service Account
const serviceAccountPath = path.resolve(__dirname, '../firebase-service-account.json');
const serviceAccount = JSON.parse(await readFile(serviceAccountPath, 'utf8'));

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

const DRY_RUN = process.argv.includes('--dry-run');
const COLLECTIONS = ['products', 'projects', 'categories', 'new_launches', 'press_releases'];

async function getBufferFromUrl(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Fetch failed: ${response.statusText}`);
    return Buffer.from(await response.arrayBuffer());
}

async function optimizeImage(url) {
    // 1. If already tokenized, skip
    if (url.includes('?alt=media&token=')) {
        return url;
    }

    // 2. If it's a GCS URL from the previous failed run (storage.googleapis.com)
    if (url.includes('storage.googleapis.com') && url.includes(bucket.name)) {
        // Extract the path exactly as it appears in the URL
        const pathPart = url.split(bucket.name + '/')[1];
        if (pathPart) {
            const file = bucket.file(pathPart);
            const [exists] = await file.exists();
            if (exists) {
                console.log(`    - Patching existing file (adding token): ${pathPart.substring(0, 50)}...`);
                if (DRY_RUN) return url;
                
                const token = crypto.randomUUID();
                await file.setMetadata({
                    metadata: {
                        firebaseStorageDownloadTokens: token
                    }
                });
                const newUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(pathPart)}?alt=media&token=${token}`;
                console.log(`    [PATCHED] New URL: ${newUrl.substring(0, 60)}...`);
                return newUrl;
            } else {
                console.warn(`    [WARN] File in URL not found in Storage: ${pathPart}`);
            }
        }
    }

    // 3. Otherwise, do the full optimization (download, sharp, upload)
    if (!url.startsWith('http')) return url;

    try {
        console.log(`  - Processing Full Optimization: ${url.substring(0, 60)}...`);
        const buffer = await getBufferFromUrl(url);

        const optimizedBuffer = await sharp(buffer)
            .resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality: 80, progressive: true })
            .toBuffer();

        if (DRY_RUN) {
            console.log(`    [DRY RUN] Would upload optimized version.`);
            return url;
        }

        const urlObj = new URL(url);
        // Clean up filename: Replace encoded slashes or spaces to keep it simple in Storage
        const baseName = path.basename(urlObj.pathname).split('?')[0].replace(/%2F/g, '_').replace(/%20/g, '_') || 'image.jpg';
        const newPath = `optimized/${Date.now()}_${baseName}`;
        
        const token = crypto.randomUUID();
        const file = bucket.file(newPath);
        
        await file.save(optimizedBuffer, {
            metadata: { 
                contentType: 'image/jpeg',
                metadata: {
                    firebaseStorageDownloadTokens: token
                }
            }
        });

        const newUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(newPath)}?alt=media&token=${token}`;
        console.log(`    [DONE] New URL: ${newUrl.substring(0, 60)}...`);
        return newUrl;
    } catch (error) {
        console.error(`    [ERROR] Failed to optimize ${url}:`, error.message);
        return url;
    }
}

async function startMigration() {
    console.log(DRY_RUN ? '--- STARTING DRY RUN MIGRATION (VERSION 4) ---' : '--- STARTING LIVE MIGRATION (VERSION 4) ---');
    
    for (const colName of COLLECTIONS) {
        console.log(`\n\x1b[36m>>> Processing collection: ${colName}\x1b[0m`);
        const snapshot = await db.collection(colName).get();
        
        for (const docSnap of snapshot.docs) {
            const data = docSnap.data();
            const updates = {};
            let hasChanges = false;

            console.log(`  \x1b[33mChecking Doc: ${docSnap.id}\x1b[0m`);

            const imageFields = ['image', 'imageUrl', 'images'];

            for (const field of imageFields) {
                if (!data[field]) continue;

                if (Array.isArray(data[field])) {
                    const newImages = [];
                    let arrayChanged = false;
                    for (const imgUrl of data[field]) {
                        if (typeof imgUrl === 'string' && imgUrl.startsWith('http')) {
                            const optimizedUrl = await optimizeImage(imgUrl);
                            if (optimizedUrl !== imgUrl) arrayChanged = true;
                            newImages.push(optimizedUrl);
                        } else {
                            newImages.push(imgUrl);
                        }
                    }
                    if (arrayChanged) {
                        updates[field] = newImages;
                        hasChanges = true;
                    }
                } else if (typeof data[field] === 'string' && data[field].startsWith('http')) {
                    const optimizedUrl = await optimizeImage(data[field]);
                    if (optimizedUrl !== data[field]) {
                        updates[field] = optimizedUrl;
                        hasChanges = true;
                    }
                }
            }

            if (hasChanges && !DRY_RUN) {
                await db.collection(colName).doc(docSnap.id).update(updates);
                console.log(`    \x1b[32m✔ Document ${docSnap.id} fixed.\x1b[0m`);
            } else if (hasChanges) {
                console.log(`    \x1b[34mℹ [DRY RUN] Document ${docSnap.id} would be fixed.\x1b[0m`);
            }
        }
    }

    console.log('\n--- MIGRATION COMPLETE ---');
    process.exit(0);
}

startMigration().catch(err => {
    console.error('\x1b[31mFatal Error:\x1b[0m', err);
    process.exit(1);
});
