import { unstable_cache } from 'next/cache';
import { createPublicClient } from './supabase/server';
import * as db from './db';

/**
 * CMS LAYER (Server-Only)
 * High-performance, cached wrappers around raw database helpers.
 * These functions initialize their own server client internally to avoid 
 * circular reference issues during serialization.
 * 
 * IMPORTANT: Uses createPublicClient() which avoids cookies() to be 
 * compatible with unstable_cache() during build-time prerendering.
 */

export const getHero = unstable_cache(
    async () => {
        const supabase = createPublicClient();
        return db.getHero(supabase);
    },
    ['hero-data'],
    { revalidate: 3600, tags: ['settings'] }
);

export const getNewLaunches = unstable_cache(
    async () => {
        const supabase = createPublicClient();
        return db.getNewLaunches(supabase);
    },
    ['new-launches'],
    { revalidate: 3600, tags: ['products'] }
);

export const getProducts = unstable_cache(
    async (filter = null) => {
        const supabase = createPublicClient();
        return db.getProducts(supabase, filter);
    },
    ['products-list'],
    { revalidate: 3600, tags: ['products'] }
);

export const getProduct = unstable_cache(
    async (slug) => {
        const supabase = createPublicClient();
        return db.getProduct(supabase, slug);
    },
    ['single-product'],
    { revalidate: 3600, tags: ['products'] }
);

export const getCategories = unstable_cache(
    async () => {
        const supabase = createPublicClient();
        return db.getCategories(supabase);
    },
    ['categories'],
    { revalidate: 3600, tags: ['categories'] }
);

export const getFeaturedProducts = unstable_cache(
    async () => {
        const supabase = createPublicClient();
        return db.getFeaturedProducts(supabase);
    },
    ['featured-products'],
    { revalidate: 3600, tags: ['products'] }
);

export const getBrands = unstable_cache(
    async () => {
        const supabase = createPublicClient();
        return db.getBrands(supabase);
    },
    ['brands-list'],
    { revalidate: 3600, tags: ['products'] }
);

export const getTrustBadges = unstable_cache(
    async () => {
        const supabase = createPublicClient();
        return db.getTrustBadges(supabase);
    },
    ['trust-badges'],
    { revalidate: 3600, tags: ['settings'] }
);

export const getFooter = unstable_cache(
    async () => {
        const supabase = createPublicClient();
        return db.getFooter(supabase);
    },
    ['footer-data'],
    { revalidate: 3600, tags: ['settings'] }
);

export const getProjects = unstable_cache(
    async () => {
        const supabase = createPublicClient();
        return db.getProjects(supabase);
    },
    ['projects-list'],
    { revalidate: 3600, tags: ['projects'] }
);

export const getPressReleases = unstable_cache(
    async () => {
        const supabase = createPublicClient();
        return db.getPressReleases(supabase);
    },
    ['press-releases'],
    { revalidate: 3600, tags: ['press'] }
);

export const getProductSeo = unstable_cache(
    async () => {
        const supabase = createPublicClient();
        return db.getProductSeo(supabase);
    },
    ['product-seo-data'],
    { revalidate: 3600, tags: ['settings'] }
);
