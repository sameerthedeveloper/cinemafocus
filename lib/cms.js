import { unstable_cache } from 'next/cache';
import { createPublicClient } from './supabase/server';
import * as db from './db';
import * as aws from './aws/adapter';

/**
 * CMS LAYER (Server-Only)
 * High-performance, cached wrappers around raw database helpers.
 * These functions initialize their own server client internally to avoid 
 * circular reference issues during serialization.
 * 
 * IMPORTANT: Uses createPublicClient() which avoids cookies() to be 
 * compatible with unstable_cache() during build-time prerendering.
 */

/**
 * DATA BACKEND SWITCH
 * Default: AWS (lib/aws/adapter.js) with Supabase as the automatic fallback:
 * any AWS failure (network error, non-2xx) falls back to the Supabase path
 * below for that call, so a failed fetch is never cached as empty data.
 * DATA_BACKEND=supabase forces Supabase only. If API_GATEWAY_URL is not set
 * (e.g. local dev without AWS env) the AWS path is skipped entirely.
 */
const backend = () =>
    process.env.DATA_BACKEND === 'supabase' || !process.env.API_GATEWAY_URL ? 'supabase' : 'aws';

const STILL_SUPABASE = [
    'app/(public)/products/page.jsx',
    'app/(public)/press/[id]/page.jsx',
    'app/(public)/press/page.jsx',
    'app/(public)/about/page.jsx',
    'app/(public)/contact/page.jsx',
    'app/(public)/gallery/page.jsx',
    'components/Footer.jsx',
];
let warnedClientFiles = false;

async function fromAws(name, fn) {
    if (!warnedClientFiles) {
        warnedClientFiles = true;
        console.warn(`[cms] AWS backend active: client components still read Supabase via lib/db.js: ${STILL_SUPABASE.join(', ')}`);
    }
    try {
        return { ok: true, value: await fn() };
    } catch (e) {
        console.warn(`[cms] AWS ${name} failed, falling back to Supabase: ${e?.message || e}`);
        return { ok: false };
    }
}

export const getHero = unstable_cache(
    async () => {
        if (backend() === 'aws') {
            const res = await fromAws('getHero', () => aws.getHero());
            if (res.ok) return res.value;
        }
        const supabase = createPublicClient();
        return db.getHero(supabase);
    },
    ['hero-data'],
    { revalidate: 3600, tags: ['settings'] }
);

export const getNewLaunches = unstable_cache(
    async () => {
        if (backend() === 'aws') {
            const res = await fromAws('getNewLaunches', () => aws.getNewLaunches());
            if (res.ok) return res.value;
        }
        const supabase = createPublicClient();
        return db.getNewLaunches(supabase);
    },
    ['new-launches'],
    { revalidate: 3600, tags: ['products'] }
);

export const getProducts = unstable_cache(
    async (filter = null) => {
        if (backend() === 'aws') {
            const res = await fromAws('getProducts', () => aws.getProducts(filter));
            if (res.ok) return res.value;
        }
        const supabase = createPublicClient();
        return db.getProducts(supabase, filter);
    },
    ['products-list'],
    { revalidate: 3600, tags: ['products'] }
);

export const getProduct = unstable_cache(
    async (slug) => {
        if (backend() === 'aws') {
            const res = await fromAws('getProduct', async () => aws.getProduct(slug, await getProducts()));
            if (res.ok) return res.value;
        }
        const supabase = createPublicClient();
        return db.getProduct(supabase, slug);
    },
    ['single-product'],
    { revalidate: 3600, tags: ['products'] }
);

export const getCategories = unstable_cache(
    async () => {
        if (backend() === 'aws') {
            const res = await fromAws('getCategories', () => aws.getCategories());
            if (res.ok) return res.value;
        }
        const supabase = createPublicClient();
        return db.getCategories(supabase);
    },
    ['categories-live'],
    { revalidate: 3600, tags: ['categories'] }
);

export const getFeaturedProducts = unstable_cache(
    async () => {
        if (backend() === 'aws') {
            const res = await fromAws('getFeaturedProducts', () => aws.getFeaturedProducts());
            if (res.ok) return res.value;
        }
        const supabase = createPublicClient();
        return db.getFeaturedProducts(supabase);
    },
    ['featured-products'],
    { revalidate: 3600, tags: ['products'] }
);

export const getBrands = unstable_cache(
    async () => {
        if (backend() === 'aws') {
            const res = await fromAws('getBrands', () => aws.getBrands());
            if (res.ok) return res.value;
        }
        const supabase = createPublicClient();
        return db.getBrands(supabase);
    },
    ['brands-list'],
    { revalidate: 3600, tags: ['products'] }
);

export const getTrustBadges = unstable_cache(
    async () => {
        if (backend() === 'aws') {
            const res = await fromAws('getTrustBadges', () => aws.getTrustBadges());
            if (res.ok) return res.value;
        }
        const supabase = createPublicClient();
        return db.getTrustBadges(supabase);
    },
    ['trust-badges'],
    { revalidate: 3600, tags: ['settings'] }
);

export const getFooter = unstable_cache(
    async () => {
        if (backend() === 'aws') {
            const res = await fromAws('getFooter', () => aws.getFooter());
            if (res.ok) return res.value;
        }
        const supabase = createPublicClient();
        return db.getFooter(supabase);
    },
    ['footer-data'],
    { revalidate: 3600, tags: ['settings'] }
);

export const getProjects = unstable_cache(
    async () => {
        if (backend() === 'aws') {
            const res = await fromAws('getProjects', () => aws.getProjects());
            if (res.ok) return res.value;
        }
        const supabase = createPublicClient();
        return db.getProjects(supabase);
    },
    ['projects-list'],
    { revalidate: 3600, tags: ['projects'] }
);

export const getPressReleases = unstable_cache(
    async () => {
        if (backend() === 'aws') {
            const res = await fromAws('getPressReleases', () => aws.getPressReleases());
            if (res.ok) return res.value;
        }
        const supabase = createPublicClient();
        return db.getPressReleases(supabase);
    },
    ['press-releases'],
    { revalidate: 3600, tags: ['press'] }
);

export const getProductSeo = unstable_cache(
    async () => {
        if (backend() === 'aws') {
            const res = await fromAws('getProductSeo', () => aws.getProductSeo());
            if (res.ok) return res.value;
        }
        const supabase = createPublicClient();
        return db.getProductSeo(supabase);
    },
    ['product-seo-data'],
    { revalidate: 3600, tags: ['settings'] }
);

export const getSeo = unstable_cache(
    async () => {
        if (backend() === 'aws') {
            const res = await fromAws('getSeo', () => aws.getSeo());
            if (res.ok) return res.value;
        }
        const supabase = createPublicClient();
        return db.getSeo(supabase);
    },
    ['site-seo-data'],
    { revalidate: 3600, tags: ['settings'] }
);

export const getPhilosophy = unstable_cache(
    async () => {
        if (backend() === 'aws') {
            const res = await fromAws('getPhilosophy', () => aws.getPhilosophy());
            if (res.ok) return res.value;
        }
        const supabase = createPublicClient();
        return db.getPhilosophy(supabase);
    },
    ['philosophy-data'],
    { revalidate: 3600, tags: ['settings'] }
);

export const getGeneralSettings = unstable_cache(
    async () => {
        if (backend() === 'aws') {
            const res = await fromAws('getGeneralSettings', () => aws.getSettingData('general'));
            if (res.ok) return res.value;
        }
        const supabase = createPublicClient();
        const { data, error } = await db.fetchSiteSetting(supabase, 'general');
        return error || !data ? null : data.data;
    },
    ['general-settings'],
    { revalidate: 3600, tags: ['settings'] }
);
