import { db } from "./firebase";
import { collection, doc, writeBatch } from "firebase/firestore";
import { categories, products, hero, trustBadges } from "./seed-data";

export const seedDatabase = async () => {
    const batch = writeBatch(db);

    // Seed Categories
    categories.forEach((cat) => {
        const startChar = cat.slug.charAt(0);
        // Use slug as doc ID for easy lookup, or random ID. 
        // Using random ID is generally safer for sorting/ordering if slugs change, 
        // but slug is good for URLs. Let's use auto-id but store slug field.
        // Actually, distinct IDs based on slug is fine for categories.
        const ref = doc(collection(db, "categories"), cat.slug);
        batch.set(ref, cat);
    });

    // Seed Products
    products.forEach((prod) => {
        const ref = doc(collection(db, "products"), prod.slug);
        batch.set(ref, prod);
    });

    // Seed Hero
    const heroRef = doc(collection(db, "hero"), "main");
    batch.set(heroRef, hero);

    // Seed Trust Badges (Single Document in site_content)
    const trustRef = doc(collection(db, "site_content"), "trust_badges");
    batch.set(trustRef, { items: trustBadges });

    try {
        await batch.commit();
        console.log("Database seeded successfully!");
        alert("Database seeded successfully!");
    } catch (error) {
        console.error("Error seeding database:", error);
        alert("Error seeding database: " + error.message);
    }
};
