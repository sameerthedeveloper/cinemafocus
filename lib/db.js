import { products as seedProducts, categories as seedCategories, hero as seedHero, trustBadges as seedTrustBadges, newLaunches as seedNewLaunches, pressReleases as seedPressReleases } from "./seed-data";

/**
 * DATABASE HELPERS (Client-Agnostic)
 * These functions require a 'supabase' client derived from either 
 * supabase/server.js or supabase/client.js to be passed in.
 */

// Helper to map snake_case keys back to camelCase for the frontend
const mapKeys = (obj, mapping) => {
    if (!obj || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(item => mapKeys(item, mapping));
    
    const newObj = { ...obj };
    Object.keys(mapping).forEach(snakeKey => {
        if (newObj[snakeKey] !== undefined) {
            newObj[mapping[snakeKey]] = newObj[snakeKey];
        }
    });
    return newObj;
};

const PRODUCT_MAPPING = { short_description: 'shortDescription', long_description: 'longDescription' };
const CATEGORY_MAPPING = { product_count: 'productCount' };
const PROJECT_MAPPING = { image_url: 'imageUrl' };
const LAUNCH_MAPPING = { short_description: 'shortDescription', original_product_id: 'originalProductId' };

// Toggle to force mock data if needed (e.g. if database is empty)
const USE_MOCK = false;

export const getProducts = async (supabase, filter = null) => {
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
        let query = supabase.from("products").select("*");

        if (categorySlug) {
            query = query.eq("category", categorySlug);
        }
        if (brandName) {
            query = query.eq("brand", brandName);
        }

        const { data, error } = await query;

        if (error || !data || data.length === 0) {
            console.warn("Supabase empty or error, returning seed data");
            let results = seedProducts;
            if (categorySlug) results = results.filter(p => p.category === categorySlug);
            if (brandName) results = results.filter(p => p.brand === brandName);
            return results;
        }

        return mapKeys(data, PRODUCT_MAPPING);
    } catch (error) {
        console.error("Supabase [getProducts] failed:", error);
        let results = seedProducts;
        if (categorySlug) results = results.filter(p => p.category === categorySlug);
        if (brandName) results = results.filter(p => p.brand === brandName);
        return results;
    }
};

export const getBrands = async (supabase) => {
    if (USE_MOCK) {
        const brands = [...new Set(seedProducts.map(p => p.brand))];
        return brands.sort();
    }

    try {
        const { data, error } = await supabase.from("products").select("brand");

        if (error || !data || data.length === 0) {
            const brands = [...new Set(seedProducts.map(p => p.brand))];
            return brands.sort();
        }

        const brands = [...new Set(data.map(p => p.brand))].filter(Boolean);
        return brands.sort();
    } catch (error) {
        console.error("Supabase [getBrands] failed:", error);
        const brands = [...new Set(seedProducts.map(p => p.brand))];
        return brands.sort();
    }
};

export const getProduct = async (supabase, slug) => {
    if (USE_MOCK) return seedProducts.find(p => p.slug === slug);

    try {
        const { data, error } = await supabase
            .from("products")
            .select("*")
            .eq("slug", slug)
            .single();

        if (error || !data) {
            console.warn("Product not found in Supabase");
            return seedProducts.find(p => p.slug === slug);
        }
        return mapKeys(data, PRODUCT_MAPPING);
    } catch (error) {
        console.error("Supabase [getProduct] failed:", error);
        return seedProducts.find(p => p.slug === slug);
    }
};

export const getCategories = async (supabase) => {
    if (USE_MOCK) return seedCategories;

    try {
        const { data, error } = await supabase
            .from("categories")
            .select("*")
            .order("product_count", { ascending: false }); 

        if (error || !data || data.length === 0) return seedCategories;

        return mapKeys(data, CATEGORY_MAPPING);
    } catch (error) {
        console.error("Supabase [getCategories] failed:", error);
        return seedCategories;
    }
};

// Common helper to fetch from site_settings with fallback to site_content
export const fetchSiteSetting = async (supabase, settingId) => {
    const result = await supabase.from("site_settings").select("data").eq("id", settingId).single();
    
    if (result.error && result.error.code === 'PGRST205') {
        return await supabase.from("site_content").select("data").eq("id", settingId).single();
    }
    
    return result;
};

export const getHero = async (supabase) => {
    if (USE_MOCK) return seedHero;
    try {
        const { data, error } = await fetchSiteSetting(supabase, "hero_main");

        if (error || !data) return seedHero;
        return data.data;
    } catch (error) {
        console.error("Supabase [getHero] failed:", error);
        return seedHero;
    }
};

export const getTrustBadges = async (supabase) => {
    if (USE_MOCK) return seedTrustBadges;
    try {
        const { data, error } = await fetchSiteSetting(supabase, "trust_badges");

        if (error || !data) return seedTrustBadges;
        return data.data.items || [];
    } catch (error) {
        console.error("Supabase [getTrustBadges] failed:", error);
        return seedTrustBadges;
    }
};

export const getFooter = async (supabase) => {
    try {
        const { data, error } = await fetchSiteSetting(supabase, "footer");

        if (error || !data) {
            return {
                address: '123 Audio Lane, Sound City, SC 90210',
                phones: ['+1 (555) 123-4567'],
                email: 'contact@cinemafocus.com',
                workingHours: "Mon - Fri: 10am - 7pm\nSat - Sun: 11am - 5pm"
            };
        };
        return data.data;
    } catch (error) {
        console.error("Supabase [getFooter] failed:", error);
        return {
            address: '123 Audio Lane, Sound City, SC 90210',
            phones: ['+1 (555) 123-4567'],
            email: 'contact@cinemafocus.com',
            workingHours: "Mon - Fri: 10am - 7pm\nSat - Sun: 11am - 5pm"
        };
    }
};

export const getFeaturedProducts = async (supabase) => {
    try {
        const { data, error } = await supabase
            .from("products")
            .select("*")
            .eq("featured", true)
            .limit(4);

        if (error || !data) return seedProducts.filter(p => p.featured).slice(0, 4);
        return mapKeys(data, PRODUCT_MAPPING);
    } catch (error) {
        console.error("Supabase [getFeaturedProducts] failed:", error);
        return seedProducts.filter(p => p.featured).slice(0, 4);
    }
};

export const getProjects = async (supabase) => {
    try {
        const { data, error } = await supabase
            .from("projects")
            .select("*")
            .order("created_at", { ascending: false });

        if (error || !data) return [];
        return mapKeys(data, PROJECT_MAPPING);
    } catch (e) {
        console.error("getProjects error:", e);
        return [];
    }
};

export const getNewLaunches = async (supabase) => {
    try {
        const { data, error } = await supabase
            .from("new_launches")
            .select("*");

        if (error || !data || data.length === 0) return [];
        return mapKeys(data, LAUNCH_MAPPING);
    } catch (error) {
        console.error("Supabase [getNewLaunches] failed:", error);
        return [];
    }
};

export const getPressReleases = async (supabase) => {
    try {
        const { data, error } = await supabase
            .from("press_releases")
            .select("*")
            .order("date", { ascending: false });

        if (error || !data || data.length === 0) return seedPressReleases;
        return data;
    } catch (error) {
        console.error("Supabase [getPressReleases] failed:", error);
        return seedPressReleases;
    }
};

export const getPressRelease = async (supabase, idOrSlug) => {
    try {
        // Try slug first (standard for public pages)
        const { data, error } = await supabase
            .from("press_releases")
            .select("*")
            .eq("slug", idOrSlug)
            .single();

        if (data) return data;

        // Fallback to ID if uuid-like
        if (idOrSlug.includes("-")) {
            const { data: idData } = await supabase
                .from("press_releases")
                .select("*")
                .eq("id", idOrSlug)
                .single();
            if (idData) return idData;
        }

        return seedPressReleases.find(pr => pr.id === idOrSlug || pr.slug === idOrSlug);
    } catch (e) {
        console.warn("getPressRelease fetch failed", e);
        return seedPressReleases.find(pr => pr.id === idOrSlug || pr.slug === idOrSlug);
    }
};

export const getPressReleaseBySlug = async (supabase, slug) => {
    return getPressRelease(supabase, slug);
};
