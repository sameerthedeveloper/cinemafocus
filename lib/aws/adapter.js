import {
    products as seedProducts,
    categories as seedCategories,
    hero as seedHero,
    trustBadges as seedTrustBadges,
    pressReleases as seedPressReleases,
    projects as seedProjects,
} from "../seed-data.js";

/**
 * AWS DATA ADAPTER (Server-Only)
 * Reads from the API Gateway (DynamoDB-backed) public GET endpoints and returns
 * EXACTLY the shapes lib/db.js returns from Supabase, so sitemap/metadata code
 * is backend-agnostic.
 *
 * Error contract:
 *  - Network errors, non-2xx responses and unparseable bodies throw
 *    AwsFetchError. lib/cms.js catches these and falls back to Supabase, so a
 *    transient AWS failure never gets cached as empty data.
 *  - Data-level cases (HTTP 200 with an empty list / missing setting data) use
 *    the same seed/default fallbacks lib/db.js uses.
 *
 * The `supabase` client argument taken by lib/db.js is not used here.
 *
 * Runs on the server (direct to API_GATEWAY_URL) and in the browser (through the
 * same-origin /api/aws proxy, so no API URL or token ever reaches client code).
 */

export class AwsFetchError extends Error {
    constructor(path, status, cause) {
        super(`AWS API ${path} failed${status ? ` (HTTP ${status})` : ""}${cause ? `: ${cause.message || cause}` : ""}`);
        this.name = "AwsFetchError";
        this.path = path;
        this.status = status ?? null;
    }
}

const TIMEOUT_MS = 10000;

// The account's Lambda concurrency is small, so bursts (e.g. a build with many
// workers) can be throttled with 429/503. Retry those and network errors with
// backoff before giving up (cms.js then falls back to Supabase).
const RETRY_STATUS = new Set([429, 500, 502, 503, 504]);
const MAX_ATTEMPTS = 4;
const backoff = (attempt) =>
    new Promise((r) => setTimeout(r, Number(process.env.AWS_RETRY_BASE_MS ?? 250) * 2 ** attempt * (0.5 + Math.random())));

const isBrowser = typeof window !== "undefined";
const apiBase = () => (isBrowser ? "/api/aws" : process.env.API_GATEWAY_URL);

async function apiRequest(path, { retry = true, ...init } = {}) {
    const base = apiBase();
    if (!base) throw new AwsFetchError(path, null, "API_GATEWAY_URL is not set");

    let lastError;
    for (let attempt = 0; attempt < (retry ? MAX_ATTEMPTS : 1); attempt++) {
        if (attempt > 0) await backoff(attempt - 1);
        let res;
        try {
            res = await fetch(`${base.replace(/\/$/, "")}${path}`, {
                cache: "no-store",
                signal: AbortSignal.timeout(TIMEOUT_MS),
                ...init,
            });
        } catch (e) {
            lastError = new AwsFetchError(path, null, e);
            continue;
        }
        if (RETRY_STATUS.has(res.status)) {
            lastError = new AwsFetchError(path, res.status);
            continue;
        }
        if (!res.ok) throw new AwsFetchError(path, res.status);
        try {
            return await res.json();
        } catch (e) {
            throw new AwsFetchError(path, res.status, e);
        }
    }
    throw lastError;
}

const apiGet = (path) => apiRequest(path);

const apiList = async (path) => {
    const data = await apiGet(path);
    if (!Array.isArray(data)) throw new AwsFetchError(path, 200, "expected a JSON array");
    return data;
};

// ---------------------------------------------------------------------------
// Pure transforms (exported for scripts/test-adapter.mjs)
// ---------------------------------------------------------------------------

// Same snake_case -> camelCase pairs as lib/db.js
export const PRODUCT_MAPPING = { short_description: "shortDescription", long_description: "longDescription" };
export const CATEGORY_MAPPING = { product_count: "productCount" };
export const PROJECT_MAPPING = { image_url: "imageUrl" };
export const LAUNCH_MAPPING = { short_description: "shortDescription", original_product_id: "originalProductId" };
export const PRESS_RELEASE_MAPPING = { image_url: "imageUrl", cover_images: "coverImages", pdf_url: "pdfUrl", content_blocks: "contentBlocks" };

const ID_KEYS = ["productId", "categoryId", "pressId", "launchId", "projectId"];

/**
 * Normalizes one DynamoDB record to the Supabase row shape:
 * - `id` from the table's key attribute (never generated)
 * - both snake_case and camelCase present for every mapped key
 * - `created_at` / `is_active` filled from camelCase variants when missing
 */
export function normalize(record, mapping = {}) {
    if (!record || typeof record !== "object") return record;
    const out = { ...record };

    if (out.id === undefined) {
        const key = ID_KEYS.find((k) => out[k] !== undefined);
        if (key) out.id = out[key];
    }
    for (const [snake, camel] of Object.entries(mapping)) {
        if (out[snake] !== undefined && out[camel] === undefined) out[camel] = out[snake];
        if (out[camel] !== undefined && out[snake] === undefined) out[snake] = out[camel];
    }
    if (out.created_at === undefined && out.createdAt !== undefined) out.created_at = out.createdAt;
    if (out.is_active === undefined && out.isActive !== undefined) out.is_active = out.isActive;
    return out;
}

const isActive = (p) => p.is_active !== false;

const cmp = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
const timeKey = (v) => {
    if (v === null || v === undefined || v === "") return null;
    const t = Date.parse(v);
    return Number.isNaN(t) ? String(v) : t;
};

// created_at asc, then id — deterministic stand-in for Supabase insertion order.
// Missing created_at sorts first.
export const byCreatedAsc = (a, b) =>
    nullsFirst(timeKey(a.created_at), timeKey(b.created_at), cmp(timeKey(a.created_at), timeKey(b.created_at))) ||
    cmp(String(a.id ?? ""), String(b.id ?? ""));

function nullsFirst(a, b, otherwise) {
    if (a === null && b === null) return 0;
    if (a === null) return -1;
    if (b === null) return 1;
    return otherwise;
}

// Postgres `ORDER BY x DESC` puts NULLs first — mirror that.
const descNullsFirst = (a, b) => nullsFirst(a, b, cmp(b, a));

export function filterProducts(items, filter = null) {
    let categorySlug = null;
    let brandName = null;
    if (typeof filter === "string") {
        categorySlug = filter;
    } else if (typeof filter === "object" && filter !== null) {
        categorySlug = filter.category;
        brandName = filter.brand;
    }

    return items
        .map((p) => normalize(p, PRODUCT_MAPPING))
        .filter((p) => (!categorySlug || p.category === categorySlug) && (!brandName || p.brand === brandName) && isActive(p))
        .sort(byCreatedAsc);
}

export function findProduct(products, slug) {
    const found = products.find((p) => p.slug === slug && isActive(p));
    return found ? normalize(found, PRODUCT_MAPPING) : null;
}

export function toBrands(items) {
    return [...new Set(items.map((p) => p.brand))].filter(Boolean).sort();
}

export function toCategories(categories, products) {
    if (categories.length === 0) return seedCategories;

    // Counts ALL products (active or not) per category slug, like lib/db.js
    const counts = {};
    products.forEach((p) => {
        if (p.category) counts[p.category] = (counts[p.category] || 0) + 1;
    });

    return categories
        .map((c) => normalize({ ...c, product_count: counts[c.slug] || 0 }, CATEGORY_MAPPING))
        .map((c) => ({ ...c, productCount: c.product_count }))
        .sort((a, b) => (b.product_count || 0) - (a.product_count || 0));
}

export function toFeatured(items) {
    return items
        .map((p) => normalize(p, PRODUCT_MAPPING))
        .sort(byCreatedAsc)
        .filter((p) => p.featured === true)
        .slice(0, 4);
}

export function toNewLaunches(items) {
    if (items.length === 0) return [];
    return items.map((l) => normalize(l, LAUNCH_MAPPING)).sort(byCreatedAsc);
}

export function toProjects(items) {
    if (items.length === 0) return seedProjects;
    const featuredRank = (v) => (v === true ? 2 : v === false ? 1 : 0); // DESC, NULLS LAST
    return items
        .map((p) => normalize(p, PROJECT_MAPPING))
        .sort((a, b) => featuredRank(b.featured) - featuredRank(a.featured) || descNullsFirst(timeKey(a.created_at), timeKey(b.created_at)))
        .map((proj) => ({
            ...proj,
            featured: Boolean(proj.featured),
            imagePosition: proj.imagePosition || proj.image_position || "center",
        }));
}

export function toPressReleases(items) {
    if (items.length === 0) return seedPressReleases;
    return items
        .map((p) => normalize(p, PRESS_RELEASE_MAPPING))
        .sort((a, b) => descNullsFirst(timeKey(a.date), timeKey(b.date)) || descNullsFirst(timeKey(a.created_at), timeKey(b.created_at)));
}

// ---------------------------------------------------------------------------
// Data functions — same names/semantics as lib/db.js
// ---------------------------------------------------------------------------

// Rethrow fetch failures (cms.js falls back to Supabase); anything else gets
// the lib/db.js fallback so a page never sees a throw.
function guard(name, fallback, e) {
    if (e instanceof AwsFetchError) throw e;
    console.error(`AWS [${name}] failed:`, e);
    return typeof fallback === "function" ? fallback() : fallback;
}

export const getProducts = async (filter = null) => {
    const items = await apiList("/products");
    try {
        return filterProducts(items, filter);
    } catch (e) {
        return guard("getProducts", [], e);
    }
};

/**
 * Products have no slug index in DynamoDB, so this searches the full product
 * list. Pass `products` (e.g. the cached getProducts() result) to avoid a scan.
 */
export const getProduct = async (slug, products = null) => {
    const items = products ?? (await apiList("/products"));
    try {
        return findProduct(items, slug);
    } catch (e) {
        return guard("getProduct", null, e);
    }
};

export const getBrands = async () => {
    const items = await apiList("/products");
    try {
        return toBrands(items);
    } catch (e) {
        return guard("getBrands", [], e);
    }
};

export const getCategories = async () => {
    const categories = await apiList("/categories");
    if (categories.length === 0) return seedCategories;
    const products = await apiList("/products");
    try {
        return toCategories(categories, products);
    } catch (e) {
        return guard("getCategories", seedCategories, e);
    }
};

export const getFeaturedProducts = async () => {
    const items = await apiList("/products");
    try {
        return toFeatured(items);
    } catch (e) {
        return guard("getFeaturedProducts", () => seedProducts.filter((p) => p.featured).slice(0, 4), e);
    }
};

export const getNewLaunches = async () => {
    const items = await apiList("/new-launches");
    try {
        return toNewLaunches(items);
    } catch (e) {
        return guard("getNewLaunches", [], e);
    }
};

export const getProjects = async () => {
    const items = await apiList("/projects");
    try {
        return toProjects(items);
    } catch (e) {
        return guard("getProjects", seedProjects, e);
    }
};

export const getPressReleases = async () => {
    const items = await apiList("/press-releases");
    try {
        return toPressReleases(items);
    } catch (e) {
        return guard("getPressReleases", seedPressReleases, e);
    }
};

// The Lambda resolves slug (slug-index) first, then pressId.
export const getPressRelease = async (idOrSlug) => {
    const item = await apiGet(`/press-releases/${encodeURIComponent(idOrSlug)}`);
    try {
        return item ? normalize(item, PRESS_RELEASE_MAPPING) : null;
    } catch (e) {
        return guard("getPressRelease", null, e);
    }
};

// Site settings: AWS item shape is { settingId, data, updatedAt }
// A setting that doesn't exist (404) is "not set" -> null, so callers use the same
// defaults lib/db.js used. Any other failure still throws AwsFetchError.
const fetchSetting = async (settingId) => {
    try {
        return await apiGet(`/site-settings/${encodeURIComponent(settingId)}`);
    } catch (e) {
        if (e instanceof AwsFetchError && e.status === 404) return null;
        throw e;
    }
};

const DEFAULT_FOOTER = {
    address: "123 Audio Lane, Sound City, SC 90210",
    phones: ["+1 (555) 123-4567"],
    email: "contact@cinemafocus.com",
    workingHours: "Mon - Fri: 10am - 7pm\nSat - Sun: 11am - 5pm",
};

export const getProductSeo = async () => {
    const item = await fetchSetting("product_seo");
    return item ? item.data : {};
};

export const getSeo = async () => {
    const item = await fetchSetting("seo");
    return item ? item.data : null;
};

export const getHero = async () => {
    const item = await fetchSetting("hero_main");
    return item ? item.data : seedHero;
};

export const getTrustBadges = async () => {
    const item = await fetchSetting("trust_badges");
    if (!item || !item.data) return seedTrustBadges;
    return item.data.items || [];
};

export const getFooter = async () => {
    const item = await fetchSetting("footer");
    return item ? item.data : { ...DEFAULT_FOOTER };
};

export const getPhilosophy = async () => {
    const item = await fetchSetting("philosophy");
    return item ? item.data : null;
};

// Public, increment-only page-view counter (browser -> /api/aws proxy).
export const incrementStat = (date = new Date().toISOString().slice(0, 10)) =>
    apiRequest("/stats/increment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date }),
    });

// Public contact-form insert (browser -> /api/aws proxy -> POST /messages, no auth by design).
// Not retried on 5xx: a retry after a partial success could create duplicate messages.
export const createMessage = ({ name, email, subject, text }) =>
    apiRequest("/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, text }),
        retry: false,
    });

// Countdown / custom launch pages config: { [slug]: { product_name, widgets: [...] } }
export const getCustomRoutes = async () => {
    const item = await fetchSetting("custom_routes");
    return item ? item.data : null;
};

// Generic site setting -> its `data` payload (throws AwsFetchError on 404/errors).
export const getSettingData = async (settingId) => {
    const item = await fetchSetting(settingId);
    return item ? item.data : null;
};
