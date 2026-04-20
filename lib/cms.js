import { unstable_cache } from 'next/cache';
import { createClient } from './supabase/server';
import * as db from './db';

/**
 * CMS LAYER (Server-Only)
 * High-performance, cached wrappers around raw database helpers.
 * These functions initialize their own server client internally to avoid 
 * circular reference issues during serialization.
 */

export const getHero = unstable_cache(
    async () => {
        const supabase = await createClient();
        return db.getHero(supabase);
    },
    ['hero-data'],
    { revalidate: 3600, tags: ['settings'] }
);

export const getNewLaunches = unstable_cache(
    async () => {
        const supabase = await createClient();
        return db.getNewLaunches(supabase);
    },
    ['new-launches'],
    { revalidate: 3600, tags: ['products'] }
);

export const getProducts = unstable_cache(
    async (filter = null) => {
        const supabase = await createClient();
        return db.getProducts(supabase, filter);
    },
    ['products-list'],
    { revalidate: 3600, tags: ['products'] }
);

export const getProduct = unstable_cache(
    async (slug) => {
        const supabase = await createClient();
        return db.getProduct(supabase, slug);
    },
    ['single-product'],
    { revalidate: 3600, tags: ['products'] }
);

export const getCategories = unstable_cache(
    async () => {
        const supabase = await createClient();
        return db.getCategories(supabase);
    },
    ['categories'],
    { revalidate: 3600, tags: ['categories'] }
);

export const getFeaturedProducts = unstable_cache(
    async () => {
        const supabase = await createClient();
        return db.getFeaturedProducts(supabase);
    },
    ['featured-products'],
    { revalidate: 3600, tags: ['products'] }
);

export const getBrands = unstable_cache(
    async () => {
        const supabase = await createClient();
        return db.getBrands(supabase);
    },
    ['brands-list'],
    { revalidate: 3600, tags: ['products'] }
);

export const getTrustBadges = unstable_cache(
    async () => {
        const supabase = await createClient();
        return db.getTrustBadges(supabase);
    },
    ['trust-badges'],
    { revalidate: 3600, tags: ['settings'] }
);

export const getFooter = unstable_cache(
    async () => {
        const supabase = await createClient();
        return db.getFooter(supabase);
    },
    ['footer-data'],
    { revalidate: 3600, tags: ['settings'] }
);

export const getProjects = unstable_cache(
    async () => {
        const supabase = await createClient();
        return db.getProjects(supabase);
    },
    ['projects-list'],
    { revalidate: 3600, tags: ['projects'] }
);

export const getPressReleases = unstable_cache(
    async () => {
        const supabase = await createClient();
        return db.getPressReleases(supabase);
    },
    ['press-releases'],
    { revalidate: 3600, tags: ['press'] }
);
