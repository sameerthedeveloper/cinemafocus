import { collection, getDocs, getDoc, doc, query, where } from "firebase/firestore";
import { db } from "./firebase";
import { products as seedProducts, categories as seedCategories, hero as seedHero, trustBadges as seedTrustBadges } from "./seed-data";

// Helper to check if we should use Firestore or Seed Data
// In a real app, this might be based on a config or successful connection.
// For this demo, we'll try Firestore, and if it fails (e.g. no config), we might fall back?
// Actually, safely returning seed data is better for the demo if config is missing.
const USE_MOCK = false; // TOGGLE THIS TO FALSE TO USE FIRESTORE

export const getProducts = async (categorySlug = null) => {
    if (USE_MOCK) {
        if (categorySlug) {
            return seedProducts.filter(p => p.category === categorySlug);
        }
        return seedProducts;
    }

    // Firestore Implementation
    try {
        const productsRef = collection(db, "products");
        let q = productsRef;
        if (categorySlug) {
            q = query(productsRef, where("category", "==", categorySlug));
        }
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ ...doc.data(), slug: doc.id }));

        // Fallback if DB is empty
        if (data.length === 0) {
            console.warn("Firestore empty, returning seed data");
            if (categorySlug) {
                return seedProducts.filter(p => p.category === categorySlug);
            }
            return seedProducts;
        }
        return data;

    } catch (error) {
        console.warn("Firestore fetch failed, falling back to seed data", error);
        if (categorySlug) {
            return seedProducts.filter(p => p.category === categorySlug) || [];
        }
        return seedProducts || [];
    }
};

export const getProduct = async (slug) => {
    if (USE_MOCK) {
        return seedProducts.find(p => p.slug === slug);
    }

    try {
        const docRef = doc(db, "products", slug);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { ...docSnap.data(), slug: docSnap.id };
        }
        return null;
    } catch (error) {
        console.warn("Firestore fetch failed, falling back to seed data", error);
        return seedProducts.find(p => p.slug === slug);
    }
};

export const getCategories = async () => {
    if (USE_MOCK) return seedCategories;

    try {
        const snapshot = await getDocs(collection(db, "categories"));
        const data = snapshot.docs.map(doc => doc.data()).sort((a, b) => a.order - b.order);
        if (data.length === 0) return seedCategories;
        return data;
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
        if (docSnap.exists() && docSnap.data().items) return docSnap.data().items;
        return seedTrustBadges;
    } catch (e) { return seedTrustBadges; }
};

export const getFeaturedProducts = async () => {
    try {
        const all = await getProducts();
        if (!Array.isArray(all)) return [];
        return all.filter(p => p.featured).slice(0, 4);
    } catch (e) {
        console.error("getFeaturedProducts error:", e);
        return [];
    }
};

export const getProjects = async () => {
    try {
        const snapshot = await getDocs(collection(db, "projects"));
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
        console.error("getProjects error:", e);
        return [];
    }
};
