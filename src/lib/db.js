import { db } from "./firebase";
import { collection, getDocs, getDoc, doc, query, where, orderBy, limit } from "firebase/firestore";
import { products as seedProducts, categories as seedCategories, hero as seedHero, trustBadges as seedTrustBadges, newLaunches as seedNewLaunches, pressReleases as seedPressReleases } from "./seed-data";

// Toggle to force mock data if needed (e.g. if env vars missing)
const USE_MOCK = false;

export const getProducts = async (filter = null) => {
    // Handle legacy string argument (category slug) or new object filter
    let categorySlug = null;
    let brandName = null;

    if (typeof filter === 'string') {
        categorySlug = filter;
    } else if (typeof filter === 'object' && filter !== null) {
        categorySlug = filter.category;
        brandName = filter.brand;
    }

    if (USE_MOCK) {
        let results = seedProducts;
        if (categorySlug) results = results.filter(p => p.category === categorySlug);
        if (brandName) results = results.filter(p => p.brand === brandName);
        return results;
    }

    try {
        let q = collection(db, "products");
        if (categorySlug) {
            q = query(q, where("category", "==", categorySlug));
        }
        if (brandName) {
            // Note: Compound queries might require index
            q = query(q, where("brand", "==", brandName));
        }

        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            console.warn("Firestore empty, returning seed data");
            let results = seedProducts;
            if (categorySlug) results = results.filter(p => p.category === categorySlug);
            if (brandName) results = results.filter(p => p.brand === brandName);
            return results;
        }

        let docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Client-side filtering if multiple where clauses (to avoid index issues during dev)
        // If we used composite query above, this is redundant but safe.
        if (categorySlug) docs = docs.filter(p => p.category === categorySlug);
        if (brandName) docs = docs.filter(p => p.brand === brandName);

        return docs;
    } catch (error) {
        console.warn("Firestore fetch failed", error);
        let results = seedProducts;
        if (categorySlug) results = results.filter(p => p.category === categorySlug);
        if (brandName) results = results.filter(p => p.brand === brandName);
        return results;
    }
};

export const getBrands = async () => {
    if (USE_MOCK) {
        const brands = [...new Set(seedProducts.map(p => p.brand))];
        return brands.sort();
    }

    try {
        // Firestore doesn't support "distinct" natively easily without separate collection
        // For now, we'll fetch all products (or use a separate 'brands' collection if exists)
        // Optimization: Create a 'brands' collection or a 'metadata' doc.
        // For this scale, fetching properties is okay, or we just fallback to seed if empty.

        const q = query(collection(db, "products"));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            const brands = [...new Set(seedProducts.map(p => p.brand))];
            return brands.sort();
        }

        const products = querySnapshot.docs.map(doc => doc.data());
        const brands = [...new Set(products.map(p => p.brand))].filter(Boolean);
        return brands.sort();

    } catch (error) {
        console.warn("Firestore fetch brands failed", error);
        const brands = [...new Set(seedProducts.map(p => p.brand))];
        return brands.sort();
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

// ... existing code ...

// ... existing code ...

export const getNewLaunches = async () => {
    try {
        const q = query(collection(db, "new_launches")); // Can order by createdAt if added
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return [];
        }

        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
        console.warn("getNewLaunches fetch failed", e);
        return [];
    }
};

export const getPressReleases = async () => {
    try {
        const q = query(collection(db, "press_releases"), orderBy("date", "desc"));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return seedPressReleases;
        }

        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
        console.warn("getPressReleases fetch failed", e);
        return seedPressReleases;
    }
};

export const getPressRelease = async (idOrSlug) => {
    try {
        // First try to fetch as a direct ID (legacy)
        const docRef = doc(db, "press_releases", idOrSlug);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        }

        // If not found by ID, try querying by slug
        const q = query(collection(db, "press_releases"), where("slug", "==", idOrSlug));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            return { id: doc.id, ...doc.data() };
        }

        // Fallback to seed data
        return seedPressReleases.find(pr => pr.id === idOrSlug || pr.slug === idOrSlug);
    } catch (e) {
        console.warn("getPressRelease fetch failed", e);
        return seedPressReleases.find(pr => pr.id === idOrSlug || pr.slug === idOrSlug);
    }
};

export const getPressReleaseBySlug = async (slug) => {
    // Alias for clarity, but getPressRelease handles both now
    return getPressRelease(slug);
};
