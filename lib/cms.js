import { unstable_cache } from 'next/cache';
import * as aws from './aws/adapter';

/**
 * CMS LAYER (Server-Only)
 * Cached wrappers around the AWS data adapter (API Gateway + DynamoDB).
 * AWS is the only data source here — there is no Supabase path.
 *
 * If an AWS request fails (after retries) the adapter throws AwsFetchError.
 * unstable_cache does not cache thrown errors, so a failed fetch is never
 * stored as empty data; the next request tries again.
 */

export const getHero = unstable_cache(
    async () => aws.getHero(),
    ['hero-data'],
    { revalidate: 3600, tags: ['settings'] }
);

export const getNewLaunches = unstable_cache(
    async () => aws.getNewLaunches(),
    ['new-launches'],
    { revalidate: 3600, tags: ['products'] }
);

export const getProducts = unstable_cache(
    async (filter = null) => aws.getProducts(filter),
    ['products-list'],
    { revalidate: 3600, tags: ['products'] }
);

export const getProduct = unstable_cache(
    async (slug) => aws.getProduct(slug, await getProducts()),
    ['single-product'],
    { revalidate: 3600, tags: ['products'] }
);

export const getCategories = unstable_cache(
    async () => aws.getCategories(),
    ['categories-live'],
    { revalidate: 3600, tags: ['categories'] }
);

export const getFeaturedProducts = unstable_cache(
    async () => aws.getFeaturedProducts(),
    ['featured-products'],
    { revalidate: 3600, tags: ['products'] }
);

export const getBrands = unstable_cache(
    async () => aws.getBrands(),
    ['brands-list'],
    { revalidate: 3600, tags: ['products'] }
);

export const getTrustBadges = unstable_cache(
    async () => aws.getTrustBadges(),
    ['trust-badges'],
    { revalidate: 3600, tags: ['settings'] }
);

export const getFooter = unstable_cache(
    async () => aws.getFooter(),
    ['footer-data'],
    { revalidate: 3600, tags: ['settings'] }
);

export const getProjects = unstable_cache(
    async () => aws.getProjects(),
    ['projects-list'],
    { revalidate: 3600, tags: ['projects'] }
);

export const getPressReleases = unstable_cache(
    async () => aws.getPressReleases(),
    ['press-releases'],
    { revalidate: 3600, tags: ['press'] }
);

export const getProductSeo = unstable_cache(
    async () => aws.getProductSeo(),
    ['product-seo-data'],
    { revalidate: 3600, tags: ['settings'] }
);

export const getSeo = unstable_cache(
    async () => aws.getSeo(),
    ['site-seo-data'],
    { revalidate: 3600, tags: ['settings'] }
);

export const getPhilosophy = unstable_cache(
    async () => aws.getPhilosophy(),
    ['philosophy-data'],
    { revalidate: 3600, tags: ['settings'] }
);

export const getGeneralSettings = unstable_cache(
    async () => aws.getSettingData('general'),
    ['general-settings'],
    { revalidate: 3600, tags: ['settings'] }
);
