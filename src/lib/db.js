import { db } from "./firebase";
import { collection, getDocs, getDoc, doc, query, where, orderBy, limit } from "firebase/firestore";
import { products as seedProducts, categories as seedCategories, hero as seedHero, trustBadges as seedTrustBadges } from "./seed-data";

// Toggle to force mock data if needed (e.g. if env vars missing)
const USE_MOCK = false;

export const getProducts = async (categorySlug = null) => {
    if (USE_MOCK) {
        if (categorySlug) return seedProducts.filter(p => p.category === categorySlug);
        return seedProducts;
    }

    try {
        let q = collection(db, "products");
        if (categorySlug) {
            q = query(q, where("category", "==", categorySlug));
        }

        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            console.warn("Firestore empty, returning seed data");
            if (categorySlug) return seedProducts.filter(p => p.category === categorySlug);
            return seedProducts;
        }

        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.warn("Firestore fetch failed", error);
        if (categorySlug) return seedProducts.filter(p => p.category === categorySlug);
        return seedProducts;
    }
};

export const getProduct = async (slug) => {
    if (USE_MOCK) return seedProducts.find(p => p.slug === slug);

    try {
        const docRef = doc(db, "products", slug);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            // Fallback for slugs that might not be document IDs (if we used auto-ids, but here we used slugs as IDs in seeder)
            // If we change seeder to use auto-IDs, we might need a query here. 
            // Assuming seeder uses slug as doc ID for simplicity as per previous versions.
            console.warn("Product not found in Firestore");
            return seedProducts.find(p => p.slug === slug);
        }
    } catch (error) {
        console.warn("Firestore fetch failed", error);
        return seedProducts.find(p => p.slug === slug);
    }
};

export const getCategories = async () => {
    if (USE_MOCK) return seedCategories;

    try {
        const q = query(collection(db, "categories"), orderBy("order", "asc"));
        // Note: 'order' might need to be created in index for complex queries, but simple get shouldn't fail tough.
        // If fail, just getDocs(collection(db, "categories")) and sort in JS.

        const querySnapshot = await getDocs(collection(db, "categories"));
        if (querySnapshot.empty) return seedCategories;

        const cats = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // sorting in JS to be safe from missing index
        return cats.sort((a, b) => (a.order || 0) - (b.order || 0));
    } catch (error) {
        console.warn("Firestore fetch failed", error);
        return seedCategories;
    }
};

export const getHero = async () => {
    if (USE_MOCK) return seedHero;
    try {
        const docRef = doc(db, "hero", "main");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) return docSnap.data();
        return seedHero;
    } catch (e) { return seedHero; }
};

export const getTrustBadges = async () => {
    if (USE_MOCK) return seedTrustBadges;
    try {
        const docRef = doc(db, "site_content", "trust_badges");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) return docSnap.data().items || [];
        return seedTrustBadges;
    } catch (e) { return seedTrustBadges; }
};

export const getFeaturedProducts = async () => {
    try {
        const q = query(collection(db, "products"), where("featured", "==", true), limit(4));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
        // Fallback to local
        return seedProducts.filter(p => p.featured).slice(0, 4);
    }
};

export const getProjects = async () => {
    try {
        const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
        console.error("getProjects error:", e);
        return [];
    }
};
