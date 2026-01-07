import { db /*, storage */ } from "./firebase";
import { collection, doc, writeBatch } from "firebase/firestore";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { categories, products, hero, trustBadges } from "./seed-data";

// Helper to upload local public assets to Storage
// const uploadLocalAsset = async (path) => {
//     if (!path || !path.startsWith('/')) return path; // Skip if already URL or empty

//     try {
//         const response = await fetch(path);
//         const blob = await response.blob();
//         if (blob.size === 0) throw new Error("Empty blob");

//         const filename = path.split('/').pop();
//         const storageRef = ref(storage, `seeded_assets/${filename}`);
//         await uploadBytes(storageRef, blob);
//         return await getDownloadURL(storageRef);
//     } catch (error) {
//         console.warn(`Failed to upload asset: ${path}`, error);
//         return path; // Fallback to original path
//     }
// };

export const seedDatabase = async () => {
    // Notify user via console/alert since this takes time
    const batch = writeBatch(db);
    console.log("Starting migration to Firebase Storage...");

    // 1. Seed Categories
    for (const cat of categories) {
        // Upload image if needed
        // if (cat.imageUrl && cat.imageUrl.startsWith('/')) {
        //     cat.imageUrl = await uploadLocalAsset(cat.imageUrl);
        // }
        const ref = doc(collection(db, "categories"), cat.slug);
        batch.set(ref, cat);
    }

    // 2. Seed Products
    for (const prod of products) {
        // Handle images array
        /*
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
        */
        const ref = doc(collection(db, "products"), prod.slug);
        batch.set(ref, prod);
    }

    // 3. Seed Hero
    // if (hero.imageUrl && hero.imageUrl.startsWith('/')) {
    //     hero.imageUrl = await uploadLocalAsset(hero.imageUrl);
    // }
    const heroRef = doc(collection(db, "hero"), "main");
    batch.set(heroRef, hero);

    // 4. Seed Trust Badges (Single Document in site_content)
    const trustRef = doc(collection(db, "site_content"), "trust_badges");
    batch.set(trustRef, { items: trustBadges });

    try {
        await batch.commit();
        console.log("Database seeded & Assets migrated successfully!");
        alert("Database seeded & Assets migrated to Firebase Storage successfully!");
    } catch (error) {
        console.error("Error seeding database:", error);
        alert("Error seeding database: " + error.message);
    }
};
