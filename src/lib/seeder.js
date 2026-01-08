import { db, storage, auth } from "./firebase";
import { collection, doc, writeBatch } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { categories, products, hero, trustBadges } from "./seed-data";

// Helper to upload local public assets to Firebase Storage
const uploadLocalAsset = async (path) => {
    if (!path || !path.startsWith('/')) return path; // Skip if already URL or empty

    try {
        console.log(`Fetching asset: ${path}`);
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${path}: ${response.status} ${response.statusText}`);
        }
        const blob = await response.blob();
        console.log(`Blob size for ${path}: ${blob.size}`);
        if (blob.size === 0) throw new Error("Empty blob");

        const filename = path.split('/').pop();
        const storageRef = ref(storage, `seeded_assets/${Date.now()}_${filename}`);

        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);
        console.log(`Uploaded ${path} to ${downloadURL}`);

        return downloadURL;
    } catch (error) {
        console.warn(`Failed to upload asset to Firebase: ${path}`, error);
        // Do not return original path if it failed, maybe return null or handle it? 
        // For now, returning path ensures app doesn't crash but image will form 404 if it was local.
        return path;
    }
};

export const seedDatabase = async () => {
    // Notify user via console/alert since this takes time
    const batch = writeBatch(db);

    // Log auth state to debug potential permission issues
    const user = auth.currentUser;
    console.log("Starting database seed with Firebase...");
    console.log("Current User:", user ? `Logged in as ${user.email}` : "Not logged in (Unauthenticated)");

    if (!user) {
        console.warn("WARNING: You are not logged in. If your Firestore Rules require authentication, this will fail.");
    }


    // 1. Seed Categories
    for (const cat of categories) {
        // Upload image if needed
        if (cat.imageUrl && cat.imageUrl.startsWith('/')) {
            cat.imageUrl = await uploadLocalAsset(cat.imageUrl);
        }
        const ref = doc(collection(db, "categories"), cat.slug);
        batch.set(ref, cat);
    }

    // 2. Seed Products
    for (const prod of products) {
        // Handle images array
        if (prod.images && Array.isArray(prod.images)) {
            const newImages = [];
            for (const img of prod.images) {
                if (img.startsWith('/')) {
                    newImages.push(await uploadLocalAsset(img));
                } else {
                    newImages.push(img);
                }
            }
            prod.images = newImages;
        }
        const ref = doc(collection(db, "products"), prod.slug);
        batch.set(ref, prod);
    }

    // 3. Seed Hero
    if (hero.imageUrl && hero.imageUrl.startsWith('/')) {
        hero.imageUrl = await uploadLocalAsset(hero.imageUrl);
    }
    const heroRef = doc(collection(db, "hero"), "main");
    batch.set(heroRef, hero);

    // 4. Seed Trust Badges (Single Document in site_content)
    const trustRef = doc(collection(db, "site_content"), "trust_badges");
    batch.set(trustRef, { items: trustBadges });

    // 5. SEO & Footer Defaults (for completeness)
    const seoRef = doc(collection(db, "site_content"), "seo");
    batch.set(seoRef, {
        siteTitle: 'Cinema Focus',
        titleSuffix: '| Premium Audio',
        defaultDescription: 'Experience the ultimate in home audio and cinema.',
        defaultKeywords: 'audio, hifi, speakers, home theater, cinema focus',
    });

    const footerRef = doc(collection(db, "site_content"), "footer");
    batch.set(footerRef, {
        address: '123 Audio Lane, Sound City, SC 90210',
        phone: '+1 (555) 123-4567',
        phones: ['+1 (555) 123-4567'],
        email: 'contact@cinemafocus.com',
        workingHours: "Mon - Fri: 10am - 7pm\nSat - Sun: 11am - 5pm"
    });


    try {
        await batch.commit();
        console.log("Database seeded & Assets migrated to Firebase successfully!");
        alert("Database seeded successfully!");
    } catch (error) {
        console.error("Error seeding database:", error);
        alert(`Error seeding database: ${error.message}`);
        throw error;
    }
};
