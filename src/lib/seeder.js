import { db } from "./firebase";
import { collection, doc, writeBatch, getDocs, setDoc } from "firebase/firestore";
import { categories, products, hero, trustBadges } from "./seed-data";
import { supabase, storageBucket } from "./supabase";

const ASSETS_TO_UPLOAD = [
    'hero.png',
    'speakers.png',
    'amplifiers.png',
    'turntables.png',
    'product-speakers.png',
    'product-amp.png'
];

const uploadAssetsToSupabase = async () => {
    const bucketName = storageBucket;
    console.log(`Starting Supabase asset upload to bucket: ${bucketName}...`);

    const uploads = ASSETS_TO_UPLOAD.map(async (filename) => {
        try {
            // 1. Fetch local file
            const response = await fetch(`/images/${filename}`);
            if (!response.ok) throw new Error(`Missing local file: ${filename}`);
            const blob = await response.blob();

            // 2. Upload to Supabase (Upsert to overwrite)
            const { error } = await supabase.storage
                .from(bucketName)
                .upload(filename, blob, { upsert: true });

            if (error) throw error;
            console.log(`Saved ${filename} to Supabase.`);
        } catch (e) {
            console.warn(`Failed to upload ${filename}:`, e.message);
        }
    });

    await Promise.all(uploads);
    console.log("Asset upload complete.");
};

export const seedDatabase = async () => {
    console.log("Starting database reset...");

    // 0. Ensure Assets exist in Supabase (The "Fetch from Supabase" requirement)
    try {
        await uploadAssetsToSupabase();
    } catch (e) {
        console.error("Asset upload failed, continuing with data reset...");
    }

    // 1. Delete existing collections (The "Old Method" - Full Reset)
    // We use a separate batch for deletes to ensure we clear the slate.
    const batchDelete = writeBatch(db);
    const collections = ['products', 'categories', 'hero', 'site_content', 'projects'];

    for (const colName of collections) {
        const snapshot = await getDocs(collection(db, colName));
        snapshot.docs.forEach((doc) => {
            batchDelete.delete(doc.ref);
        });
    }
    await batchDelete.commit();
    console.log("Cleared existing data.");

    // 2. Write Seed Data
    const batch = writeBatch(db);

    // Seed Categories
    for (const cat of categories) {
        const ref = doc(db, "categories", cat.slug);
        batch.set(ref, cat);
    }

    // Seed Products
    for (const prod of products) {
        const ref = doc(db, "products", prod.slug);
        batch.set(ref, prod);
    }

    // Seed Projects (New)
    const { projects } = await import('./seed-data'); // Dynamic import
    if (projects) {
        for (const proj of projects) {
            const ref = doc(collection(db, "projects")); // Auto-ID for projects
            batch.set(ref, proj);
        }
    }

    // Seed Hero
    const heroRef = doc(db, "hero", "main");
    batch.set(heroRef, hero);

    // Seed Trust Badges
    const trustRef = doc(db, "site_content", "trust_badges");
    batch.set(trustRef, { items: trustBadges });

    // Seed Defaults
    const seoRef = doc(db, "site_content", "seo");
    batch.set(seoRef, {
        siteTitle: 'Cinema Focus',
        titleSuffix: '| Premium Audio',
        defaultDescription: 'Experience the ultimate in home audio and cinema.',
        defaultKeywords: 'audio, hifi, speakers, home theater, cinema focus',
    });

    const footerRef = doc(db, "site_content", "footer");
    batch.set(footerRef, {
        address: '123 Audio Lane, Sound City, SC 90210',
        phone: '+1 (555) 123-4567',
        phones: ['+1 (555) 123-4567'],
        email: 'contact@cinemafocus.com',
        workingHours: "Mon - Fri: 10am - 7pm\nSat - Sun: 11am - 5pm"
    });

    await batch.commit();
    console.log("Database reset and seeded successfully.");
};
